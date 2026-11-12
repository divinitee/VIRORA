import { build } from '/app/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import fs from 'node:fs';
const here = path.resolve('tools/admin-bulk-tests/render');
const mocks = { '@/lib/consoleApi': path.join(here, 'mocks.js') };
const alias = { name: 'alias', setup(b) { b.onResolve({ filter: /^@\// }, (a) => {
  if (mocks[a.path]) return { path: mocks[a.path] };
  const base = path.join('/app/src', a.path.slice(2));
  for (const ext of ['', '.js', '.jsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext };
  return { path: base };
}); } };
await build({ entryPoints: [path.join(here, 'entry.jsx')], bundle: true, outfile: '/tmp/bulk.js', format: 'iife', platform: 'browser', jsx: 'automatic', nodePaths: ['/app/node_modules'], plugins: [alias], define: { 'process.env.NODE_ENV': '"development"' }, loader: { '.js': 'jsx' }, logLevel: 'error' });
