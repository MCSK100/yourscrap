import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <InstallPrompt />
    </BrowserRouter>
  );
}
