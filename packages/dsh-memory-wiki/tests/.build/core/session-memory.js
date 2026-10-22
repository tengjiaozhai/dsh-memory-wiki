/**
 * core/session-memory.ts — the selection/freeze/commit state machine (design §8).
 *
 * Host-agnostic on purpose: this file imports nothing from DSH, so every branch
 * below is testable without a host. The adapter (server/dsh-adapter.ts) feeds it
 * three facts it cannot invent — the current turn, whether the model-facing
 * surface still holds a snapshot, and the observation events — and this module
 * owns every decision about inject / reuse / skip.
 *
 * Invariants enforced here:
 *   - One human turn freezes at most one snapshot (design §7). A later step of
 *     the same turn reuses it; it never re-searches.
 *   - "Already in the surface" is decided by the snapshot identity, not by the
 *     message list handed to pre-step (that list is only the current batch).
 *   - A snapshot that the surface no longer holds (compaction) is re-injected
 *     as the SAME frozen snapshot, never re-retrieved.
 *   - A prepared override stays pending until this plugin's own `user/message`
 *     commits; it is consumed exactly once, and only then.
 */
                                                  

/** Reported per-turn phase (design §6 `currentTurn.phase`). */
                       
               
               
             
               
            
             
             

/** Why a turn carries no injected snapshot. */
                        
                     
                        
                      
                      
              
                  

/** One turn's frozen decision. Immutable once committed. */
                             
                       
                             
                              
                        
                                                                    
                                 
                                                               
                       
                  
                                                                             
                      
 

/** Result of asking the machine what this pre-step should do. */
                            
                                                                                     
                                          

/** The build callback: a fresh snapshot, or undefined when nothing fits. */
                                                                

/** Facts one pre-step must supply; every one of them comes from the host. */
                               
                                                    
                       
                                                    
                       
                                                                                 
                                                      
                                                                       
                                 
 

/** Observation shape, kept structural so the adapter can translate host events. */
                         
                                                     
                                                                                 
                                                              
                                                                                               
                                           

/** Read-only projection for the Remote view / panel. */
                                    
                           
                                
                                             
 

/**
 * Per-session memory. One instance per SessionId; the adapter owns the map.
 *
 * Nothing here is persisted: after a host restart the committed history is read
 * back from the session log, and uncommitted state is intentionally gone
 * (design §8.2: "Host 重启或禁用插件清空未提交的内存状态").
 */
export class SessionMemory {
                   turns = new Map                    ()

          pendingOverride                   

  /** Last human turn this instance froze anything for. */
          lastHumanTurn = 0

          revisionCounter = 0

  /** Highest compaction seq observed; used only for diagnostics. */
          lastCompactionSeq = 0

  /** Monotonic view revision; every state change that the panel could show bumps it. */
  get revision()         {
    return this.revisionCounter
  }

  /**
   * Decide what this pre-step must do.
   *
   * A retry is the same turn+step asked twice: the second call sees the frozen
   * record and either reuses it (surface still holds it) or re-injects the same
   * snapshot (surface lost it to compaction). `build` is therefore never called
   * twice for one turn.
   * @param input - host facts for this pre-step.
   * @returns the action plus the exact snapshot to insert, when any.
   */
  prepare(input              )                 {
    if (input.turn < 1) return { action: 'none', reason: 'not-a-human-turn' }

    const existing = this.turns.get(input.turn)

    if (existing !== undefined) {
      // Reuse: the same turn never re-retrieves. Either it is still on the
      // surface, or compaction dropped it and we re-inject the frozen copy.
      if (input.surfaceHas(existing.snapshotId)) {
        return { action: 'none', reason: 'already-in-surface' }
      }
      return { action: 'inject', snapshot: this.snapshotOf(existing), reason: 're-injected' }
    }

    // A prepared manual override wins over retrieval for the turn it lands in:
    // the manual path never mixes automatic candidates into the frozen text.
    const snapshot = this.pendingOverride ?? input.build()
    if (snapshot === undefined) return { action: 'none', reason: 'no-usable-block' }

    const record             = {
      turn: input.turn,
      snapshotId: snapshot.snapshotId,
      payloadHash: snapshot.payloadHash,
      chars: snapshot.chars,
      injectedAtStep: input.step,
      phase: 'preparing',
      reInjections: 0,
    }
    this.turns.set(input.turn, record)
    this.lastHumanTurn = input.turn
    this.revisionCounter += 1
    this.snapshots.set(snapshot.snapshotId, snapshot)
    // Note: the override stays pending here on purpose. Returning from the hook
    // is not a commit; only observe() of our own user/message may consume it.
    return { action: 'inject', snapshot, reason: 'first' }
  }

  /** Frozen snapshots by id; the in-memory source for re-injection and the panel. */
                   snapshots = new Map                          ()

  /**
   * Snapshot of one recorded turn.
   * @param record - committed turn record.
   * @returns the frozen snapshot the record points at.
   */
          snapshotOf(record            )                   {
    const snapshot = this.snapshots.get(record.snapshotId)
    if (snapshot === undefined) {
      // Cannot happen through prepare(); a defensive throw keeps a corrupt
      // record from silently injecting a different snapshot.
      throw new Error('memory-wiki: frozen snapshot missing for ' + record.snapshotId)
    }
    return snapshot
  }

  /**
   * Read one frozen snapshot by identity.
   * @param snapshotId - id carried by the producer message.
   * @returns the frozen snapshot, or undefined when this instance never froze it.
   */
  snapshotOfId(snapshotId        )                               {
    return this.snapshots.get(snapshotId)
  }

  /**
   * Record that the surface lost a snapshot and it had to be re-injected.
   * @param turn - turn whose snapshot was re-injected.
   */
  noteReInjected(turn        )       {
    const record = this.turns.get(turn)
    if (record === undefined) return
    record.reInjections += 1
    this.revisionCounter += 1
  }

  /**
   * Apply one host observation.
   *
   * Only committed events reach here (`session/event` is post-commit), so a
   * phase change to `committed` is evidence, not intent. An override is
   * consumed by this path only — never by the hook return value.
   * @param observation - normalized host fact.
   */
  observe(observation             )       {
    if (observation.kind === 'compaction-end') {
      this.lastCompactionSeq = observation.seq
      return
    }

    const record = this.turns.get(observation.turn)

    if (observation.kind === 'message-committed') {
      if (record === undefined) return
      if (observation.snapshotId !== undefined && observation.snapshotId !== record.snapshotId) return
      record.committedSeq = observation.seq
      record.phase = 'committed'
      // Consumption needs positive proof: the commit must name OUR snapshot.
      // A same-turn commit that carries no snapshotId is some other message.
      if (observation.snapshotId !== undefined && this.pendingOverride !== undefined && this.pendingOverride.snapshotId === observation.snapshotId) {
        this.pendingOverride = undefined
      }
      this.revisionCounter += 1
      return
    }

    if (observation.kind === 'attempt-settled') {
      if (record === undefined) return
      record.phase = observation.failed ? 'failed' : 'calling'
      this.revisionCounter += 1
      return
    }

    if (observation.kind === 'turn-end') {
      if (record === undefined) return
      record.phase = observation.outcome
      this.revisionCounter += 1
    }
  }

  /**
   * Prepare a manual override for the NEXT human turn (design §8.1).
   *
   * Preparing does not consume anything and does not wake an agent: the snapshot
   * becomes the frozen one for the next turn this instance freezes, and stays
   * pending until that turn's own commit is observed.
   * @param snapshot - frozen snapshot compiled from the manual selection.
   */
  prepareOverride(snapshot                  )       {
    this.pendingOverride = snapshot
    this.revisionCounter += 1
  }

  /** Drop a pending override (the user returned to automatic). */
  clearOverride()       {
    if (this.pendingOverride === undefined) return
    this.pendingOverride = undefined
    this.revisionCounter += 1
  }

  /** Whether an override is still waiting for its turn. */
  get hasPendingOverride()          {
    return this.pendingOverride !== undefined
  }

  /**
   * Consume the pending override into a turn. The adapter calls this instead of
   * `build` when an override exists, so the manual path never mixes automatic
   * candidates into the frozen text (design §5.2).
   * @returns the override snapshot, or undefined when none is pending.
   */
  takeOverride()                               {
    const snapshot = this.pendingOverride
    return snapshot
  }

  /**
   * The record for one turn, when this instance froze it.
   * @param turn - host turn number.
   * @returns the immutable record or undefined.
   */
  turnRecord(turn        )                         {
    return this.turns.get(turn)
  }

  /** Highest turn this instance has frozen a snapshot for. */
  get lastFrozenTurn()         {
    return this.lastHumanTurn
  }

  /** Diagnostic: last compaction seq observed for this session. */
  get lastCompaction()         {
    return this.lastCompactionSeq
  }

  /**
   * Panel-facing projection.
   * @returns revision, the newest turn record and the pending override.
   */
  view()                    {
    const records = [...this.turns.values()]
    const last = records.length === 0 ? undefined : records[records.length - 1]
    return {
      revision: this.revisionCounter,
      ...(last === undefined ? {} : { lastTurn: { ...last } }),
      ...(this.pendingOverride === undefined ? {} : { pendingOverride: this.pendingOverride }),
    }
  }
}