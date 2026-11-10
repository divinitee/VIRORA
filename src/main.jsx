// First: decides lite mode and sets <html data-perf> before anything paints.
import { probePerf } from '@/lib/perfMode'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/fonts.js'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

// VT-39: if this device turns out to be slow, switch lite mode on (see perfMode.js).
probePerf()
