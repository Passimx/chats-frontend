import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './index.css';

Object.freeze(Object.prototype);
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
