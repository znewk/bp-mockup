import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MailPage from './pages/MailPage';
import MailResultPage from './pages/MailResultPage';
import VisitorPassPage from './pages/VisitorPassPage';
import GuardScanPage from './pages/GuardScanPage';
import GuardCheckPage from './pages/GuardCheckPage';
import SecurityDeskPage from './pages/workplace/SecurityDeskPage';
import SecurityJournalPage from './pages/workplace/SecurityJournalPage';
import ReceptionDeskPage from './pages/workplace/ReceptionDeskPage';
import DkbDeskPage from './pages/workplace/DkbDeskPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Процесс посетителя */}
      <Route path="/mail" element={<MailPage />} />
      <Route path="/pass/:number" element={<VisitorPassPage />} />
      <Route path="/guard" element={<GuardScanPage />} />
      <Route path="/guard/pass/:number" element={<GuardCheckPage />} />
      {/* Итоговое письмо: пропущен или отказано с причиной */}
      <Route path="/mail/result" element={<MailResultPage />} />

      {/* Рабочие места сотрудников */}
      <Route path="/workplace/security" element={<SecurityDeskPage />} />
      <Route path="/workplace/security/journal" element={<SecurityJournalPage />} />
      <Route path="/workplace/reception" element={<ReceptionDeskPage />} />
      <Route path="/workplace/dkb" element={<DkbDeskPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
