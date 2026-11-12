import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
// Teacher Panel revamp (2026-11-12) UI harness: renders the REAL
// TeacherDashboard with teacherApi MOCKED (serverApi.mock.js). Not a backend test.
//   npx vite build --config tools/teacher-ui-harness/vite.config.js --outDir /tmp/teacher-ui
const root = path.resolve(__dirname, "../..");
export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [react()],
  css: { postcss: path.join(root, "postcss.config.js") },
  resolve: {
    alias: [
      { find: /^@\/lib\/serverApi$/, replacement: path.join(__dirname, "serverApi.mock.js") },
      { find: /^@\/api\/base44Client$/, replacement: path.join(__dirname, "base44Client.mock.js") },
      { find: "@", replacement: path.join(root, "src") },
    ],
  },
});
