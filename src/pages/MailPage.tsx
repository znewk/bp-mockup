import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MOCK_PASS } from '../data/mock';
import logoKmg from '../assets/img/logo-kmg.png';
import './MailPage.css';

/**
 * Шаг 1. Письмо, которое посетитель получает на почту.
 * Ссылка ведёт на его электронный пропуск.
 */
export default function MailPage() {
  const passUrl = `/pass/${MOCK_PASS.number}`;

  return (
    <div className="bp-page mail">
      <div className="mail__top">
        <Link to="/">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            К сценариям
          </Button>
        </Link>
      </div>

      <div className="mail__client">
        <div className="mail__client-head">
          <div className="mail__subject">Электронный пропуск № {MOCK_PASS.number}</div>
          <div className="mail__meta">
            от <b>no-reply@kmg.kz</b> — сегодня, 09:12
          </div>
        </div>

        <div className="mail__body">
          <img src={logoKmg} alt="КазМунайГаз" className="mail__logo" />

          <p>
            Здравствуйте, <b>{MOCK_PASS.visitorFullName}</b>!
          </p>
          <p>
            Для вас оформлен электронный пропуск в {MOCK_PASS.organization} — {MOCK_PASS.purposeVisit}
            , каб. №{MOCK_PASS.cabinet}.
          </p>
          <p>
            Срок действия: <b>{MOCK_PASS.beginDate} — {MOCK_PASS.endDate}</b>
          </p>

          <div className="mail__note">
            Перед визитом откройте пропуск по ссылке и <b>сделайте фото своего лица</b>. На посту
            охраны покажите QR-код из пропуска.
          </div>

          <Link to={passUrl}>
            <Button type="primary" size="large" className="mail__cta">
              Открыть электронный пропуск
            </Button>
          </Link>

          <p className="mail__signature">
            С уважением,
            <br />
            Бюро пропусков АО НК «КазМунайГаз»
          </p>
        </div>
      </div>
    </div>
  );
}
