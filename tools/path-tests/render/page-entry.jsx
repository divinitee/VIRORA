// Page-level check: the Grammar page entered from a path Continue link.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import Grammar from '@/pages/Grammar';
window.__loc = {};
const Loc = ({ id }) => { const l = useLocation(); window.__loc[id] = l.pathname + l.search; return null; };
const Mark = ({ t }) => <div data-testid="other-page">{t}</div>;
window.__mountPage = (id, url) => createRoot(document.getElementById(id)).render(
  <MemoryRouter initialEntries={[url]}>
    <Loc id={id} />
    <Routes>
      <Route path="/grammar" element={<Grammar />} />
      <Route path="/grammar/assessment" element={<Mark t="ASSESSMENT" />} />
      <Route path="/coach" element={<Mark t="COACH" />} />
      <Route path="/lesson/:id" element={<Mark t="LESSON" />} />
      <Route path="/" element={<Mark t="HOME" />} />
    </Routes>
  </MemoryRouter>);
