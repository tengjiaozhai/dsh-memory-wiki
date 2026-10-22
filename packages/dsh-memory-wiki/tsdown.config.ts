import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { writePackageArtifacts, WorkspaceTypertGenerator } from '@deepseek-ai/dsh-typert-generator'
import { defineConfig } from 'tsdown'
import ts from 'typescript'

const here = dirname(fileURLToPath(import.meta.url))

/**
 * Inline the stylesheets as string literals. The host only ever loads
 * `lib/client.js`; a sibling `.css` asset is never fetched, so the sheet has to
 * travel inside the bundle. `define` keeps this out of module resolution
 * entirely, which avoids depending on bundler-specific `?raw` handling.
 */
const css = (path: string) => JSON.stringify(readFileSync(path, 'utf8'))

/**
 * Wire the built client bundle into the host module table.
 *
 * The host serves every `dsh.client` bundle as a *classic* script and expects a
 * single `window.__ModuleLoader__.load({ id, factory })` registration whose
 * factory returns the plugin exports (name / inject / apply). That is the shape
 * `@deepseek-ai/*` client bundles ship and the only seam the vendored loader
 * consumes, so we reproduce it at build time rather than at runtime.
 */
const dshClientWrapper = (id: string) => ({
  name: 'dsh-client-wrapper',
  generateBundle(_options: unknown, bundle: Record<string, any>) {
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (chunk?.type !== 'chunk' || fileName !== 'client.js') continue
      chunk.code =
        'window.__ModuleLoader__.load({\n' +
        '\tid: ' + JSON.stringify(id) + ',\n' +
        '\tfactory: (require) => {\n' +
        '\t\tvar module = { exports: {} };\n' +
        '\t\tvar exports = module.exports;\n' +
        '\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });\n' +
        chunk.code +
        '\n\t\treturn module.exports;\n' +
        '\t}\n' +
        '});\n'
    }
  },
})

/**
 * Lower standard decorators (@Remote) before bundling. Rolldown/oxc does not
 * implement the TC39 decorator proposal, and the typert generator reads
 * decorators from TypeScript *source*, so the emit target here only has to be
 * one whose `@` syntax TypeScript downlevels (ES2024 does; ESNext does not).
 */
const lowerDecorators = {
  name: 'mw-lower-decorators',
  transform: {
    filter: { id: /^[^?]*\.[cm]?tsx?(?:\?|$)/ },
    handler(code: string, id: string) {
      if (!/^\s*@[A-Za-z_$][\w$]*/m.test(code)) return
      const file = id.replace(/\?.*$/u, '')
      const result = ts.transpileModule(code, {
        fileName: file,
        compilerOptions: {
          target: ts.ScriptTarget.ES2024,
          module: ts.ModuleKind.ESNext,
          ...(file.endsWith('x') ? { jsx: ts.JsxEmit.ReactJSX } : {}),
          sourceMap: true,
        },
      })
      return { code: result.outputText.replace(/\n?\/\/# sourceMappingURL=.*$/u, '\n'), map: result.sourceMapText }
    },
  },
}

/**
 * Emit the strict-codec artifacts for THIS package only.
 *
 * The generator's own tsdown plugin calls `generate()` with no package filter,
 * which also tries to emit the in-workspace protocol declaration mirror (that
 * package publishes no `./typert` export and must never be emitted). Passing an
 * explicit package selection keeps the byte-identical artifacts while leaving
 * the mirror analysis-only.
 */
const emitTypert = {
  name: 'mw-emit-typert',
  async writeBundle() {
    const root = resolve(here, '../..')
    const artifacts = new WorkspaceTypertGenerator(root).generate(['dsh-memory-wiki'], ['host'])
    writePackageArtifacts(here, artifacts.filter(artifact => artifact.package === 'dsh-memory-wiki'))
  },
}

export default defineConfig([
  {
    entry: { 'server/index': 'src/server/index.ts', 'shared/contracts': 'src/shared/contracts.ts' },
    outDir: 'lib',
    format: 'esm',
    dts: false,
    clean: false,
    outExtensions: () => ({ js: '.js' }),
    external: [/^@deepseek-ai\//, /^node:/, /^zod$/],
    plugins: [lowerDecorators, emitTypert],
  },
  {
    // Client half. react / react-dom / jsx-runtime stay external: the host seeds
    // them in PLATFORM_MODULES and hands them to the factory as require('react'),
    // so the panel runs on the host React instance instead of a bundled copy.
    // Everything else (@xyflow/react, zustand, ...) is inlined on purpose —
    // graph libraries are NOT part of the host base table.
    entry: { client: 'src/client/index.tsx' },
    outDir: 'lib',
    format: 'cjs',
    dts: false,
    clean: false,
    sourcemap: true,
    outExtensions: () => ({ js: '.js' }),
    define: {
      // Browser bundles must not leak Node globals: zustand/react code paths
      // reference process.env.NODE_ENV, which the host page does not define.
      'process.env.NODE_ENV': '"production"',
      __MW_PANEL_CSS__: css(resolve(here, 'src/client/memory-panel.css')),
      __MW_XYFLOW_CSS__: css(resolve(here, 'node_modules/@xyflow/react/dist/style.css')),
    },
    // zod stays external for the same reason as react: the host base table already
    // provides it (4.4.3, pinned via pnpm-workspace overrides). Inlining would put a
    // second zod instance in the page and the generated strict codecs are built from
    // z.ZodType — the exact "looks identical, validates differently" trap.
    // @deepseek-ai/dsh-typert-protocol/* is NOT in the host table, so that glue is
    // inlined on purpose (the generated remote contribution needs it at runtime).
    // The host serves a client plugin as ONE classic script and mounts it through
    // window.__ModuleLoader__.load({ id, factory }); that factory's require only
    // resolves platform seeds — it has no relative-file resolver. Any code
    // splitting therefore produces chunks the host can never load, and the split
    // is invisible until activate time. Force a single file.
    outputOptions: { inlineDynamicImports: true },
    external: (id: string) =>
      id === 'react' ||
      id === 'react-dom' ||
      id === 'react/jsx-runtime' ||
      id === 'react-dom/client' ||
      id === 'zod' ||
      id.startsWith('zod/'),
    // The generated remote contribution imports
    // '@deepseek-ai/dsh-typert-protocol/remote-info', which is NOT in the host
    // module table. tsdown externalizes dependencies by default, so it must be
    // explicitly re-inlined — otherwise the page dies with "missed the module
    // table" at activate time. This glue is descriptor construction only; it
    // holds no per-process state, so inlining cannot create a second instance
    // of anything that matters (unlike zod, which stays external on purpose).
    noExternal: [/^@deepseek-ai\/dsh-typert-protocol(\/|$)/],
    plugins: [dshClientWrapper('dsh-memory-wiki')],
  },
])