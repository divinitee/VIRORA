// node tools/comeback-tests/starthere/run.mjs
import { build } from '/app/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import fs from 'node:fs';
const alias = { name: 'alias', setup(b) { b.onResolve({ filter: /^@\// }, (a) => {
  const base = path.join('/app/src', a.path.slice(2));
  for (const ext of ['', '.js', '.jsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext };
  return { path: base };
}); } };
await build({ entryPoints: [path.resolve('tools/comeback-tests/starthere/entry.mjs')], bundle: true, outfile: '/tmp/starthere.cjs', format: 'cjs', platform: 'node', jsx: 'automatic', nodePaths: ['/app/node_modules'], plugins: [alias], loader: { '.js': 'jsx' }, logLevel: 'error' });
await import('/tmp/starthere.cjs');
