// Lite-mode decision rules (VT-39). Run: node tools/perf-tests/perfMode.test.mjs
import { decidePerf, isSlow } from '../../src/lib/perfMode.js';
const eq = (a, b, m) => { if (a !== b) { console.log('FAIL', m, a, '!=', b); process.exit(1); } console.log('PASS', m); };
eq(decidePerf({ deviceMemory: 8, cores: 10 }), null, 'a capable Mac is undecided (stays full unless frames prove slow)');
eq(decidePerf({ cores: 6 }), null, 'flagship phone (6 cores, no memory hint) is undecided');
eq(decidePerf({ deviceMemory: 4, cores: 8 }), 'lite', 'budget Android: 8 slow cores, 4 GB');
eq(decidePerf({ deviceMemory: 2, cores: 8 }), 'lite', '2 GB phone');
eq(decidePerf({ cores: 4 }), 'lite', 'old quad-core laptop');
eq(decidePerf({ saveData: true, deviceMemory: 8, cores: 8 }), 'lite', 'Data Saver on');
eq(decidePerf({ stored: 'full', deviceMemory: 2 }), 'full', 'a remembered choice wins over the heuristic');
eq(decidePerf({ param: 'lite', stored: 'full' }), 'lite', '?perf= wins over everything');
eq(decidePerf({ param: 'banana', stored: 'lite' }), 'lite', 'junk param ignored');
const frames = (ms, n = 120) => Array.from({ length: n }, () => ms);
eq(isSlow(frames(16.7)), false, '60 fps is fine');
eq(isSlow(frames(8.3)), false, '120 fps is fine');
eq(isSlow(frames(40)), true, '25 fps is slow');
eq(isSlow([...frames(16.7, 100), ...frames(200, 20)]), false, 'a few long frames (loading) do not trip it: median');
eq(isSlow(frames(50, 10)), false, 'too few frames: no decision');
console.log('all good');
