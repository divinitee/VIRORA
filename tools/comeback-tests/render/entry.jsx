import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ComebackCard from '@/components/mission/ComebackCard';
window.__mountAfter = () => createRoot(document.getElementById('after')).render(<MemoryRouter><ComebackCard variant="after" /></MemoryRouter>);
window.__mount = () => createRoot(document.getElementById('root')).render(<MemoryRouter><ComebackCard onState={(s) => { window.__lifted = s; }} /></MemoryRouter>);
