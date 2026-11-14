# One learner path: tests

- Logic: `node tools/grammar-practice/path-tests.mjs` (pass rule, path order, next stop, links, copy).
- UI (jsdom): needs jsdom once: `mkdir -p /tmp/rc && cd /tmp/rc && npm i jsdom@24`
  - Home card, path card, result actions:
    `node tools/path-tests/render/build.mjs && NODE_PATH=/tmp/rc/node_modules node tools/path-tests/render/run.cjs`
  - Grammar page from a Continue link (plays two rounds):
    `node tools/path-tests/render/page-build.mjs && NODE_PATH=/tmp/rc/node_modules node tools/path-tests/render/page-run.cjs`
