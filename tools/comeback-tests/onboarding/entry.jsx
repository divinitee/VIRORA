import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Onboarding from '@/pages/Onboarding';
function Where() { const l = useLocation(); window.__path = l.pathname; return null; }
window.__mount = () => createRoot(document.getElementById('root')).render(
  <MemoryRouter initialEntries={['/onboarding']}><Where /><Routes><Route path="*" element={<Onboarding />} /></Routes></MemoryRouter>);
