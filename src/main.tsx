import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CSS/index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PrimeReactProvider>
			<App />
		</PrimeReactProvider>
	</StrictMode>
);
