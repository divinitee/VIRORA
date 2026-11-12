import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/index.css";
import TeacherDashboard from "@/pages/TeacherDashboard";
function SkillHubStub() { const l = useLocation(); return <div id="skillhub" className="p-6">SKILL HUB {l.search}</div>; }
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter><Routes>
    <Route path="/teacher" element={<TeacherDashboard />} />
    <Route path="/teacher/skill-hub" element={<SkillHubStub />} />
    <Route path="*" element={<TeacherDashboard />} />
  </Routes></HashRouter>);
