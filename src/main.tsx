import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
