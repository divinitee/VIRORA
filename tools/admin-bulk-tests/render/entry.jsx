import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BulkBar from '@/components/console/BulkBar';
const ROWS = [{ user_id: 't1', name: 'Test One', email: 't1@x' }, { user_id: 't2', name: 'Test Two', email: 't2@x', banned: true }];
function Harness() { const [sel, setSel] = useState(ROWS); window.__cleared = () => sel.length === 0; return <BulkBar selected={sel} onClear={() => setSel([])} onDone={() => { window.__done = true; }} onSessionLost={() => {}} />; }
window.__mount = () => createRoot(document.getElementById('root')).render(<Harness />);
