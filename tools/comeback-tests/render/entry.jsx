import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ComebackCard from '@/components/mission/ComebackCard';
window.__mount = () => createRoot(document.getElementById('root')).render(<MemoryRouter><ComebackCard onState={(s) => { window.__lifted = s; }} /></MemoryRouter>);
