# Code map

## Memory Wiki

- `packages/dsh-memory-wiki/src/server/index.ts` — Declares configuration, authenticated Remote methods and plugin lifecycle wiring.
- `packages/dsh-memory-wiki/src/server/dsh-adapter.ts` — Integrates the read-only corpus, retrieval and session evidence with DSH.
- `packages/dsh-memory-wiki/src/shared/contracts.ts` — Owns the server/client DTOs and Remote contracts.
- `packages/dsh-memory-wiki/tests/client-graph-lifecycle.test.mjs` — Exercises renderer replacement and WebGL context-loss recovery through the client component's lifecycle effect.

## Automatic experience capture

- `docs/feat-capture-history.md` — Defines the implementation scope, record contracts and acceptance criteria for capture judgment history.
- `packages/dsh-memory-wiki/src/server/capture.ts` — Exposes the capture interfaces for integration verification.
- `packages/dsh-memory-wiki/src/server/capture/types.ts` — Defines persisted evidence, jobs and approved publication manifests.
- `packages/dsh-memory-wiki/src/server/capture/journal.ts` — Owns persistent capture history, legacy normalization and read projections.
- `packages/dsh-memory-wiki/src/server/capture/history.ts` — Applies session-scoped read access to capture status, pages of tasks and judgment details.
- `packages/dsh-memory-wiki/src/client/CaptureHistory.tsx` — Displays capture availability, task history and on-demand judgment details.
- `packages/dsh-memory-wiki/tests/capture-journal.test.mjs` — Verifies history persistence, legacy import, pagination and safe projections.
- `packages/dsh-memory-wiki/tests/capture-history-integration.test.mjs` — Exercises controlled Jev decisions, Wiki publication and disabled-service history reads.
- `packages/dsh-memory-wiki/src/server/capture/experience.ts` — Collects human turn evidence and runs durable background capture jobs.
- `packages/dsh-memory-wiki/src/server/capture/jev.ts` — Applies the pinned CommandCode Jev assessment and claim-verification rubric.
- `packages/dsh-memory-wiki/src/server/capture/ingest.ts` — Prepares a Wiki ingest in isolation and publishes checked changes with recovery support.
- `packages/dsh-memory-wiki/src/server/capture/files.ts` — Provides constrained file access, durable file replacement and credential redaction.
- `packages/dsh-memory-wiki/src/server/capture/host.ts` — Resolves host credentials, logs and the independent writer route.
- `packages/dsh-memory-wiki/src/client/CaptureStatus.tsx` — Displays the latest authorized session's capture result and published pages.
- `packages/dsh-memory-wiki/tests/capture-jev.test.mjs` — Verifies the CommandCode System One path, model and credential contract.
- `packages/dsh-memory-wiki/tests/capture-ingest.test.mjs` — Exercises staging, publication, path restrictions and external-edit protection.
- `packages/dsh-memory-wiki/tests/capture-pipeline.test.mjs` — Exercises turn identity, recovery, failure visibility and recursion prevention.
- `packages/dsh-memory-wiki/tests/capture-writer.test.mjs` — Verifies the independent writer's empty tool set and strict completion contract.
- `packages/dsh-memory-wiki/tests/capture-packaging.test.mjs` — Checks published client declarations and the browser loader's external-module contract.
