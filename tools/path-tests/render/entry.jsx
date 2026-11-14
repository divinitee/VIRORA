// Render check for the ONE learner path UI (jsdom). Run:
//   node tools/path-tests/render/build.mjs && NODE_PATH=<dir with jsdom>/node_modules node tools/path-tests/render/run.cjs
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ComebackCard from '@/components/mission/ComebackCard';
import PathCard from '@/components/mission/PathCard';
import PathNextActions from '@/components/grammar/path/PathNextActions';
import { pathState, stopHref, stopLabel, LESSON_STOPS } from '@/lib/learnerPath';

const KEYS = ['tenses.present.simple-routine', 'tenses.present.third-person-s', 'tenses.present.be-affirmative'];
const fresh = pathState({ available: new Set(KEYS), passed: new Set(), lessonsDone: 0 });
const afterLesson = pathState({ available: new Set(KEYS), passed: new Set(), lessonsDone: 1 });
window.__path = { fresh, afterLesson, href: stopHref, label: (s) => stopLabel(s, 'en'), lessonId: LESSON_STOPS[0].lessonId };
window.__clicks = [];
const Loc = () => { const l = useLocation(); window.__loc = l.pathname + l.search; return null; };
const mount = (id, node) => createRoot(document.getElementById(id)).render(<MemoryRouter><Loc />{node}</MemoryRouter>);

window.__mountHome = () => mount('root', <>
  <ComebackCard
    primary={{ label: `Continue: ${stopLabel(fresh.next, 'en')}`, hint: 'Lesson', onClick: () => window.__clicks.push('primary') }}
    onFreeRoam={() => window.__clicks.push('free')} />
  <PathCard state={fresh} loading={false} />
</>);
window.__mountPassed = () => mount('a', <PathNextActions lang="en" passed nextStop={afterLesson.next}
  onNext={() => window.__clicks.push('next')} onCoach={() => window.__clicks.push('coach')} onFree={() => window.__clicks.push('roam')} onPassed={() => window.__clicks.push('passed')} />);
window.__mountNotYet = () => mount('b', <PathNextActions lang="uz" passed={false} nextStop={afterLesson.next}
  onNext={() => window.__clicks.push('next2')} onCoach={() => {}} onFree={() => {}} onPassed={() => window.__clicks.push('passed2')} />);
window.__mountDone = () => mount('c', <PathCard state={pathState({ available: new Set(), passed: new Set(), lessonsDone: 1 })} loading={false} />);
