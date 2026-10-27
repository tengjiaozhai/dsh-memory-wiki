import { createHash } from "node:crypto";

/**
 * Multi-account pool ("号池") for the Cursor subscription.
 *
 * DSH stores one string per credential reference, so the whole pool lives in a
 * single reference as a JSON vault:
 *
 *   { version: 1, activeId, accounts: [{ id, label, email, credential,
 *     addedAt, lastUsedAt, cooldownUntil, failCount }] }
 *
 * The single-credential reference this plugin used before the pool existed is
 * kept as a mirror of the active account, so any other reader of
 * CURSOR_SUBSCRIPTION_OAUTH keeps working and a rollback to an older build
 * still finds a sign-in.
 *
 * Two invariants drive the design:
 *
 * - Every read-modify-write is serialized on one promise chain. The vault is
 *   rewritten whole, so two concurrent writers would otherwise drop the
 *   account the other one just added.
 * - A refreshed credential is written back only while the stored refresh token
 *   is still the one that was exchanged. Cursor rotates it on every exchange,
 *   so a late response from a stale request would otherwise overwrite the live
 *   token with one the server has already invalidated.
 */

const VAULT_VERSION = 1;
/** Credential reference that holds the whole pool. */
export const ACCOUNTS_REF_NAME = "CURSOR_SUBSCRIPTION_ACCOUNTS";
/** How long an account that cannot renew its token is parked. */
export const DEFAULT_COOLDOWN_MS = 5 * 60 * 1000;
/**
 * lastUsedAt is rewritten at most this often. The pool costs one credentials
 * write per store call, and a turn picks an account once per step, so writing
 * on every pick would make bookkeeping the busiest writer in the profile.
 */
const LAST_USED_WRITE_INTERVAL_MS = 60 * 1000;
const MAX_LABEL_LENGTH = 48;
const ID_HASH_LENGTH = 16;

const clone = (value) => (value === undefined ? undefined : structuredClone(value));

/**
 * Accept exactly the credential shape Cursor issues.
 * @param value Candidate credential.
 * @returns A detached copy, or undefined for "no credential".
 */
export function assertOAuthCredential(value) {
	if (value === undefined) return undefined;
	if (
		value === null ||
		typeof value !== "object" ||
		value.type !== "oauth" ||
		typeof value.access !== "string" ||
		value.access.length === 0 ||
		typeof value.refresh !== "string" ||
		value.refresh.length === 0 ||
		typeof value.expires !== "number" ||
		!Number.isFinite(value.expires)
	) {
		throw new Error("Cursor credential store received a malformed OAuth credential");
	}
	return clone(value);
}

/**
 * Parse one stored credential string.
 * @param raw JSON text held by the credentials service.
 * @returns The parsed credential.
 */
export function parseOAuthCredential(raw) {
	try {
		return assertOAuthCredential(JSON.parse(raw));
	} catch (error) {
		if (error?.message === "Cursor credential store received a malformed OAuth credential") throw error;
		throw new Error("Cursor credential store contains malformed OAuth JSON", { cause: error });
	}
}

function decodeJwtClaims(token) {
	const parts = String(token ?? "").split(".");
	if (parts.length !== 3 || !parts[1]) return undefined;
	try {
		const claims = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
		return claims !== null && typeof claims === "object" ? claims : undefined;
	} catch {
		return undefined;
	}
}

function digest(value) {
	return createHash("sha256").update(value).digest("hex").slice(0, ID_HASH_LENGTH);
}

/**
 * Stable pool id for one Cursor identity.
 *
 * It has to survive token rotation: access and refresh both change on every
 * exchange, so hashing either would mint a new id at each refresh and orphan
 * the session bindings and lastUsedAt recorded against the old one. The JWT
 * sub claim is the identity; the refresh token is only a fallback for tokens
 * whose claims cannot be read.
 * @param credential One Cursor OAuth credential.
 * @returns A stable, opaque id.
 */
export function accountIdFor(credential) {
	const claims = decodeJwtClaims(credential?.access);
	const subject = typeof claims?.sub === "string" && claims.sub.length > 0 ? claims.sub : undefined;
	if (subject !== undefined) {
		const identity = subject.includes("|") ? subject.split("|").pop() : subject;
		if (typeof identity === "string" && identity.length > 0) return "cursor_" + digest(identity);
	}
	return "cursor_" + digest(String(credential?.refresh ?? ""));
}

/**
 * Read the account email out of an access token when it carries one.
 * @param token Cursor access token.
 * @returns The email claim, or undefined.
 */
export function getTokenEmail(token) {
	const claims = decodeJwtClaims(token);
	return typeof claims?.email === "string" && claims.email.length > 0 ? claims.email : undefined;
}

/**
 * Normalize a display label the pool is willing to store.
 * @param value Operator-supplied label.
 * @returns The label with collapsed whitespace.
 */
export function normalizeLabel(value) {
	if (typeof value !== "string") throw new Error("Cursor account label must be text");
	const label = value.trim().replace(/\s+/gu, " ");
	if (label.length === 0 || label.length > MAX_LABEL_LENGTH) {
		throw new Error("Cursor account label must contain 1 to " + MAX_LABEL_LENGTH + " characters");
	}
	return label;
}

function assertVaultRecord(record) {
	if (
		record === null ||
		typeof record !== "object" ||
		record.version !== VAULT_VERSION ||
		typeof record.activeId !== "string" ||
		!Array.isArray(record.accounts)
	) {
		throw new Error("Cursor account pool holds an unreadable vault");
	}
	const ids = new Set();
	const accounts = record.accounts.map((account) => {
		if (
			account === null ||
			typeof account !== "object" ||
			typeof account.id !== "string" ||
			account.id.length === 0 ||
			ids.has(account.id)
		) {
			throw new Error("Cursor account pool holds a malformed account");
		}
		ids.add(account.id);
		return {
			id: account.id,
			label: normalizeLabel(account.label),
			...(account.email === undefined ? {} : { email: String(account.email) }),
			credential: assertOAuthCredential(account.credential),
			addedAt: Number.isFinite(account.addedAt) ? account.addedAt : 0,
			lastUsedAt: Number.isFinite(account.lastUsedAt) ? account.lastUsedAt : 0,
			cooldownUntil: Number.isFinite(account.cooldownUntil) ? account.cooldownUntil : null,
			failCount: Number.isSafeInteger(account.failCount) && account.failCount > 0 ? account.failCount : 0,
		};
	});
	if (accounts.length > 0 && !ids.has(record.activeId)) {
		throw new Error("Cursor account pool active account is missing");
	}
	return { version: VAULT_VERSION, activeId: record.activeId, accounts };
}

/** Browser-facing projection: never carries a token. */
function view(account, activeId) {
	return {
		id: account.id,
		label: account.label,
		active: account.id === activeId,
		expiresAt: account.credential.expires,
		lastUsedAt: account.lastUsedAt,
		cooldownUntil: account.cooldownUntil,
		failCount: account.failCount,
		...(account.email === undefined ? {} : { email: account.email }),
	};
}

/**
 * Vault plus selection policy behind the Cursor provider.
 *
 * pick() decides which account serves one request, modifyAccount() writes a
 * renewal back without disturbing the rest of the pool, and markFailure()
 * parks an account that cannot renew so the next request moves on.
 */
export class CursorAccountVault {
	#chain = Promise.resolve();
	/** sessionId -> accountId. In memory on purpose: a session is a live conversation. */
	#bindings = new Map();

	/**
	 * @param credentials DSH credentials service (resolve / set / unset).
	 * @param options vaultRef and legacyRef are required.
	 */
	constructor(credentials, options = {}) {
		if (credentials === undefined || credentials === null) {
			throw new Error("Cursor account pool requires the DSH credentials service");
		}
		if (options.vaultRef === undefined || options.legacyRef === undefined) {
			throw new Error("Cursor account pool needs both credential references");
		}
		this.credentials = credentials;
		this.vaultRef = options.vaultRef;
		this.legacyRef = options.legacyRef;
		this.cooldownMs = options.cooldownMs ?? DEFAULT_COOLDOWN_MS;
		this.now = options.now ?? Date.now;
	}

	#enqueue(operation) {
		const current = this.#chain.catch(() => undefined).then(operation);
		const tail = current.catch(() => undefined);
		this.#chain = tail;
		return current;
	}

	async #store(payload) {
		await this.credentials.set(this.vaultRef, JSON.stringify(payload));
		// The mirror is best-effort: the pool is the source of truth, and a
		// credentials backend that rejects the legacy reference still works.
		try {
			const active = payload.accounts.find((account) => account.id === payload.activeId) ?? payload.accounts[0];
			if (active === undefined) await this.credentials.unset(this.legacyRef);
			else await this.credentials.set(this.legacyRef, JSON.stringify(active.credential));
		} catch {}
	}

	async #clearAll() {
		try {
			await this.credentials.unset(this.vaultRef);
		} catch {}
		try {
			await this.credentials.unset(this.legacyRef);
		} catch {}
		this.#bindings.clear();
	}

	async #readVault() {
		const vaultHit = await this.credentials.resolve(this.vaultRef);
		const raw = vaultHit?.value;
		if (typeof raw === "string" && raw !== "") {
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch (error) {
				throw new Error("Cursor account pool contains malformed JSON", { cause: error });
			}
			return assertVaultRecord(parsed);
		}
		// Migrate the pre-pool single credential into a one-account vault so an
		// existing sign-in keeps working without a fresh browser round trip.
		const legacyHit = await this.credentials.resolve(this.legacyRef);
		const legacyValue = legacyHit?.value;
		if (typeof legacyValue !== "string" || legacyValue === "") return undefined;
		const credential = parseOAuthCredential(legacyValue);
		if (credential === undefined) return undefined;
		const now = this.now();
		const id = accountIdFor(credential);
		const email = credential.email ?? getTokenEmail(credential.access);
		const payload = {
			version: VAULT_VERSION,
			activeId: id,
			accounts: [
				{
					id,
					label: normalizeLabel(email ?? "Cursor 1"),
					...(email === undefined ? {} : { email }),
					credential,
					addedAt: now,
					lastUsedAt: now,
					cooldownUntil: null,
					failCount: 0,
				},
			],
		};
		await this.#store(payload);
		return payload;
	}

	/** @returns { activeId, expiresAt, accounts } or undefined when the pool is empty. */
	async status() {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined || payload.accounts.length === 0) return undefined;
			const active = payload.accounts.find((account) => account.id === payload.activeId) ?? payload.accounts[0];
			return {
				activeId: active.id,
				expiresAt: active.credential.expires,
				accounts: payload.accounts.map((account) => view(account, payload.activeId)),
			};
		});
	}

	/** @returns Every account as a browser-facing projection. */
	async list() {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) return [];
			return payload.accounts.map((account) => view(account, payload.activeId));
		});
	}

	/**
	 * Read one account credential.
	 * @param id Pool id, or undefined for the active account.
	 */
	async credentialOf(id) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) return undefined;
			const account = id === undefined
				? payload.accounts.find((candidate) => candidate.id === payload.activeId) ?? payload.accounts[0]
				: payload.accounts.find((candidate) => candidate.id === id);
			return clone(account?.credential);
		});
	}

	/**
	 * Choose the account that should serve one request.
	 *
	 * A session keeps the account it started with: Cursor threads the
	 * conversation through server-side state bound to the signed-in identity, so
	 * switching mid-conversation would present a checkpoint to an account that
	 * never issued it. Only an unusable account (cooling down, or excluded after a
	 * failed renewal) hands the session to another one.
	 *
	 * @param sessionId DSH session id, or undefined for "whichever is active".
	 * @param options exclude holds ids already tried; now overrides the clock.
	 * @returns { id, credential } or undefined when nothing is usable.
	 */
	async pick(sessionId, options = {}) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined || payload.accounts.length === 0) return undefined;
			const now = options.now ?? this.now();
			const excluded = options.exclude ?? new Set();
			const key = sessionId === undefined ? undefined : String(sessionId);
			const boundId = key === undefined ? payload.activeId : this.#bindings.get(key) ?? payload.activeId;
			const usable = (account) =>
				!excluded.has(account.id) && (account.cooldownUntil === null || account.cooldownUntil <= now);
			let chosen = payload.accounts.find((account) => account.id === boundId && usable(account));
			if (chosen === undefined) {
				// failCount first, then least recently used: ordering on lastUsedAt alone
				// would hand every request back to the account that keeps failing, simply
				// because it is also the one that has gone longest unused.
				const ranked = payload.accounts
					.filter(usable)
					.sort((a, b) => a.failCount - b.failCount || a.lastUsedAt - b.lastUsedAt);
				chosen = ranked[0];
			}
			if (chosen === undefined) return undefined;
			if (key !== undefined) this.#bindings.set(key, chosen.id);
			if (now - chosen.lastUsedAt > LAST_USED_WRITE_INTERVAL_MS) {
				const accounts = payload.accounts.map((account) =>
					account.id === chosen.id ? { ...account, lastUsedAt: now } : account,
				);
				await this.#store({ ...payload, accounts });
			}
			return { id: chosen.id, credential: clone(chosen.credential) };
		});
	}

	/**
	 * Add a freshly signed-in account, or refresh the tokens of one already in the
	 * pool (same identity means the same id).
	 * @param credential Credential returned by the login flow.
	 * @param options label and email describe it; both are optional.
	 * @returns The pool id.
	 */
	async add(credential, options = {}) {
		return this.#enqueue(async () => {
			const validated = assertOAuthCredential(credential);
			if (validated === undefined) throw new Error("Cursor account pool cannot store an empty credential");
			const payload = (await this.#readVault()) ?? { version: VAULT_VERSION, activeId: "", accounts: [] };
			const now = options.now ?? this.now();
			const id = accountIdFor(validated);
			const email = options.email ?? validated.email ?? getTokenEmail(validated.access);
			const existing = payload.accounts.find((account) => account.id === id);
			const label = normalizeLabel(
				options.label ?? email ?? existing?.label ?? "Cursor " + (payload.accounts.length + 1),
			);
			const account = {
				id,
				label,
				...(email === undefined ? {} : { email: String(email) }),
				credential: validated,
				addedAt: existing?.addedAt ?? now,
				lastUsedAt: now,
				cooldownUntil: null,
				failCount: 0,
			};
			const accounts = existing === undefined
				? [...payload.accounts, account]
				: payload.accounts.map((candidate) => (candidate.id === id ? account : candidate));
			await this.#store({ version: VAULT_VERSION, activeId: id, accounts });
			return id;
		});
	}

	/**
	 * Make one account the pool default for new sessions.
	 * @param id Pool id.
	 */
	async select(id) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) throw new Error("Cursor account pool is empty");
			if (!payload.accounts.some((account) => account.id === id)) throw new Error("Unknown Cursor account");
			await this.#store({ ...payload, activeId: id });
		});
	}

	async #removeId(id) {
		const payload = await this.#readVault();
		if (payload === undefined) return;
		const accounts = payload.accounts.filter((account) => account.id !== id);
		if (accounts.length === 0) {
			await this.#clearAll();
			return;
		}
		for (const [key, bound] of [...this.#bindings]) if (bound === id) this.#bindings.delete(key);
		await this.#store({
			version: VAULT_VERSION,
			activeId: payload.activeId === id ? accounts[0].id : payload.activeId,
			accounts,
		});
	}

	/**
	 * Remove one account. Removing the last one empties the pool, which is the
	 * same end state as signing out.
	 * @param id Pool id.
	 */
	async remove(id) {
		return this.#enqueue(() => this.#removeId(id));
	}

	async clear() {
		return this.#enqueue(() => this.#clearAll());
	}

	/**
	 * Rewrite one account credential without touching activeId or the rest of the
	 * pool. update receives the stored credential as it is now, so a caller can
	 * withdraw a stale renewal (return undefined) instead of overwriting a token
	 * another request already rotated.
	 * @param id Pool id.
	 * @param update Callback returning the credential to store.
	 * @returns The stored credential.
	 */
	async modifyAccount(id, update) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) return undefined;
			const index = payload.accounts.findIndex((account) => account.id === id);
			if (index < 0) return undefined;
			const previous = clone(payload.accounts[index].credential);
			const next = await update(clone(previous));
			if (next === undefined) return previous;
			const credential = assertOAuthCredential(next);
			const accounts = [...payload.accounts];
			accounts[index] = { ...accounts[index], credential, cooldownUntil: null, failCount: 0 };
			await this.#store({ ...payload, accounts });
			return clone(credential);
		});
	}

	/**
	 * Park an account after a failed renewal so the next request moves on.
	 * @param id Pool id.
	 * @param options cooldownMs overrides the default window.
	 */
	async markFailure(id, options = {}) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) return;
			const now = options.now ?? this.now();
			const cooldownMs = options.cooldownMs ?? this.cooldownMs;
			const accounts = payload.accounts.map((account) =>
				account.id === id
					? { ...account, failCount: account.failCount + 1, cooldownUntil: now + cooldownMs }
					: account,
			);
			await this.#store({ ...payload, accounts });
		});
	}

	/**
	 * Forget an account failure history once it answered successfully.
	 * @param id Pool id.
	 */
	async markSuccess(id) {
		return this.#enqueue(async () => {
			const payload = await this.#readVault();
			if (payload === undefined) return;
			const account = payload.accounts.find((candidate) => candidate.id === id);
			if (account === undefined || (account.failCount === 0 && account.cooldownUntil === null)) return;
			const accounts = payload.accounts.map((candidate) =>
				candidate.id === id ? { ...candidate, failCount: 0, cooldownUntil: null } : candidate,
			);
			await this.#store({ ...payload, accounts });
		});
	}

	/** Drop a session binding, so the next session may pick freely. */
	releaseSession(sessionId) {
		if (sessionId === undefined) return;
		this.#bindings.delete(String(sessionId));
	}
}
