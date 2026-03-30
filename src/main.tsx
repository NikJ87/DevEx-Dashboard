import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/routes/router';
import './index.css';

async function enableMocking() {
  const dataStrategy = import.meta.env.VITE_DATA_STRATEGY;
  const dataMockStrategy = import.meta.env.VITE_DATA_MOCK_STRATEGY;
  const themeSource = import.meta.env.VITE_THEME_SOURCE;
  const themeMockStrategy = import.meta.env.VITE_THEME_MOCK_STRATEGY;

  const needsDataMock = dataStrategy === 'mock' && dataMockStrategy === 'msw';
  const needsThemeMock = themeSource === 'mock' && themeMockStrategy === 'msw';

  if (!needsDataMock && !needsThemeMock) {
    return;
  }

  const { worker } = await import('./services/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // when the Service Worker is registered and ready.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
