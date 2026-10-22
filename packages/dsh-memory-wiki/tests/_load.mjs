/**
 * tests/_load.mjs — build src/core and hand the tests the compiled barrel.
 *
 * Import this module (not a .ts file) from every test: that is how "tests run
 * the build artifact" stays true while P1 owns no build config.
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, OUT_DIR } from './_build.mjs'

build()
export const core = await import(pathToFileURL(path.join(OUT_DIR, 'index.js')).href)
export default core
