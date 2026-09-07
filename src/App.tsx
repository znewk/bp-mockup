import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MailPage from './pages/MailPage';
import VisitorPassPage from './pages/VisitorPassPage';
import GuardScanPage from './pages/GuardScanPage';
import GuardCheckPage from './pages/GuardCheckPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mail" element={<MailPage />} />
      {/* Шаг 2 — пропуск посетителя */}
      <Route path="/pass/:number" element={<VisitorPassPage />} />
      {/* Шаг 3 — сканер QR у охранника */}
      <Route path="/guard" element={<GuardScanPage />} />
      {/* Шаг 4 — сверка охранником */}
      <Route path="/guard/pass/:number" element={<GuardCheckPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
