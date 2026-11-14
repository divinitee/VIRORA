import { build } from '/app/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import fs from 'node:fs';
const here = path.resolve('tools/path-tests/render');
const m = (f) => path.join(here, 'mocks', f);
const mocks = {
  '@/api/base44Client': m('base44Client.js'),
  '@/lib/grammarPractice': m('grammarPractice.js'),
  '@/lib/grammarPractice/composition': m('composition.js'),
  '@/lib/progress/progressClient': m('progressClient.js'),
  '@/lib/AuthContext': m('AuthContext.js'),
  '@/lib/serverApi': '/app/tools/comeback-tests/render/serverApi.mock.js',
};
const alias = { name: 'alias', setup(b) { b.onResolve({ filter: /^@\// }, (a) => {
  if (mocks[a.path]) return { path: mocks[a.path] };
  const base = path.join('/app/src', a.path.slice(2));
  for (const ext of ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext };
  return { path: base };
}); } };
await build({ entryPoints: [path.join(here, 'page-entry.jsx')], bundle: true, outfile: '/tmp/path-page-bundle.js', format: 'iife', platform: 'browser', jsx: 'automatic',
  nodePaths: ['/app/node_modules'], plugins: [alias], define: { 'process.env.NODE_ENV': '"development"', 'import.meta.env': '{}' }, loader: { '.js': 'jsx', '.png': 'dataurl', '.svg': 'dataurl', '.webp': 'dataurl', '.jpg': 'dataurl' }, logLevel: 'error' });
console.log('bundled', fs.statSync('/tmp/path-page-bundle.js').size);
