/**
 * The one place that unwraps a Typert RemoteResult.
 *
 * The generated client resolves `{ok: true, value}` or `{ok: false, error}`.
 * Call sites must NOT each write their own `if (result.ok)`: transport failures
 * become one typed error here, while *business* errors stay where the contract
 * puts them — inside `value.error` (e.g. `stale-revision`), never an exception.
 */
                                      
               
                  
                        
 

export class RemoteCallError extends Error {
           code        
           detail                                 

  constructor(code        , message        , detail                      ) {
    super(message)
    this.name = 'RemoteCallError'
    this.code = code
    this.detail = detail
  }
}

                                                                           

/** Throws RemoteCallError for `{ok:false}`; returns the value otherwise. */
export function unwrap   (result         )    {
  if (result === null || typeof result !== 'object') {
    throw new RemoteCallError('malformed-result', 'remote returned ' + typeof result)
  }
  const envelope = result               
  if (envelope.ok === true) return envelope.value     
  if (envelope.ok === false) {
    const detail = envelope.error ?? {}
    const code = typeof detail.code === 'string' ? detail.code : 'remote-failure'
    const message = typeof detail.message === 'string' ? detail.message : 'remote call failed'
    throw new RemoteCallError(code, message, detail)
  }
  // No envelope: already-decoded value (some paths hand the payload back directly).
  return result     
}
