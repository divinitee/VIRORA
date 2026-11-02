// node tools/legal-consent-tests/render/build.mjs   (from the app root)
import { build } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
const root = process.cwd();
const R = path.join(root, 'tools/legal-consent-tests/render');
const mocks = {
  '@/api/base44Client': path.join(R, 'mocks/base44Client.js'),
  '@/lib/AuthContext': path.join(R, 'mocks/AuthContext.js'),
  ...(process.env.GATE_OFF ? {} : { '@/lib/legal/consentConfig': path.join(R, 'mocks/consentConfig.js') }),
  ...(process.env.ANALYTICS_SPY ? { '@/lib/analyticsConsent': path.join(R, 'mocks/analyticsConsent.js') } : {}),
};
const alias = { name: 'alias', setup(b) {
  b.onResolve({ filter: /^@\// }, (a) => {
    if (mocks[a.path]) return { path: mocks[a.path] };
    const base = path.join(root, 'src', a.path.slice(2));
    for (const ext of ['', '.js', '.jsx', '/index.js', '/index.jsx']) if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return { path: base + ext };
    return { path: base };
  });
} };
const out = process.env.BUNDLE_OUT || '/tmp/consent-render-bundle.js';
await build({ entryPoints: [path.join(R, process.env.ENTRY || 'entry.jsx')], bundle: true, outfile: out, format: 'iife', platform: 'browser', jsx: 'automatic',
  nodePaths: [path.join(root, 'node_modules')], plugins: [alias], define: { 'process.env.NODE_ENV': '"development"', 'import.meta.env': '{}' }, loader: { '.js': 'jsx' }, logLevel: 'error' });
console.log('bundled', fs.statSync(out).size);
