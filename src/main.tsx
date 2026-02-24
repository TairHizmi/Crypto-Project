import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'

// global error catcher to surface runtime issues
window.onerror = function(message, source, lineno, colno, error) {
  alert(`JS Error: ${message}\nAt ${source}:${lineno}:${colno}`);
  console.error('Global error', {message, source, lineno, colno, error});
  return false; // let browser handle as well
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
