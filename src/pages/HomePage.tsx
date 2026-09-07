import { Link } from 'react-router-dom';
import { Button, Card, Steps, Tag, Typography } from 'antd';
import {
  CameraOutlined,
  MailOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { MOCK_PASS, resetState } from '../data/mock';
import logoLogin from '../assets/img/logo-login.svg';
import './HomePage.css';

const { Title, Paragraph } = Typography;

const SCENARIOS = [
  {
    to: '/mail',
    icon: <MailOutlined />,
    step: 'Шаг 1',
    title: 'Письмо посетителю',
    text: 'Посетитель получает на почту электронный пропуск со ссылкой.',
  },
  {
    to: `/pass/${MOCK_PASS.number}`,
    icon: <CameraOutlined />,
    step: 'Шаг 2',
    title: 'Электронный пропуск',
    text: 'Открывает ссылку на телефоне и фотографирует своё лицо кнопкой «Снять на фото».',
  },
  {
    to: '/guard',
    icon: <QrcodeOutlined />,
    step: 'Шаг 3',
    title: 'Сканирование QR',
    text: 'На посту охраны охранник сканирует QR внизу пропуска своим телефоном.',
  },
  {
    to: `/guard/pass/${MOCK_PASS.number}`,
    icon: <SafetyCertificateOutlined />,
    step: 'Шаг 4',
    title: 'Сверка охранником',
    text: 'У охранника открывается пропуск: он сверяет лицо посетителя с фото и со сканом удостоверения.',
  },
];

export default function HomePage() {
  return (
    <div className="bp-page home">
      <header className="home__header">
        <img src={logoLogin} alt="Бюро Пропусков" className="home__logo" />
        <Tag color="#02AEF0" className="home__tag">
          Макет новых процессов
        </Tag>
      </header>

      <div className="home__inner">
        <Title level={3} className="home__title">
          Электронный пропуск и проверка на посту охраны
        </Title>
        <Paragraph className="home__lead">
          Интерактивный макет в стилистике действующей системы «Бюро Пропусков». Данные
          демонстрационные, бэкенд не подключён. Фото, снятое на шаге 2, автоматически появляется на
          экране охранника на шаге 4.
        </Paragraph>

        <Steps
          className="home__steps"
          responsive
          current={-1}
          items={SCENARIOS.map((s) => ({ title: s.title }))}
        />

        <div className="home__cards">
          {SCENARIOS.map((s) => (
            <Link key={s.to} to={s.to} className="home__card-link">
              <Card hoverable className="home__card" variant="borderless">
                <div className="home__card-icon">{s.icon}</div>
                <div className="home__card-step">{s.step}</div>
                <div className="home__card-title">{s.title}</div>
                <div className="home__card-text">{s.text}</div>
              </Card>
            </Link>
          ))}
        </div>

        <Button icon={<ReloadOutlined />} className="home__reset" onClick={() => resetState()}>
          Сбросить состояние демо
        </Button>
      </div>
    </div>
  );
}
