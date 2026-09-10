import { Link } from 'react-router-dom';
import { Button, Card, Steps, Tag, Typography } from 'antd';
import {
  AuditOutlined,
  CameraOutlined,
  IdcardOutlined,
  MailOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
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
    text: 'Открывает ссылку на телефоне, фотографирует лицо и отправляет фото — только после этого открывается QR.',
  },
  {
    to: '/guard',
    icon: <QrcodeOutlined />,
    step: 'Шаг 3',
    title: 'Сканирование QR',
    text: 'На посту охраны охранник сканирует QR. Без отправленного фото проход не пройдёт.',
  },
  {
    to: `/guard/pass/${MOCK_PASS.number}`,
    icon: <SafetyCertificateOutlined />,
    step: 'Шаг 4',
    title: 'Сверка охранником',
    text: 'Сверяет лицо с фото и со сканом удостоверения, пропускает или отказывает с причиной.',
  },
  {
    to: '/mail/result',
    icon: <SolutionOutlined />,
    step: 'Шаг 5',
    title: 'Итоговое письмо',
    text: 'Посетителю уходит результат: вход подтверждён или отказ с указанием причины.',
  },
];

const WORKPLACES = [
  {
    to: '/workplace/security',
    icon: <SafetyCertificateOutlined />,
    role: 'Security',
    title: 'Кабинет охраны',
    text: 'Журнал входов и выходов, посетители в здании, отметка выхода.',
  },
  {
    to: '/workplace/reception',
    icon: <IdcardOutlined />,
    role: 'Reception',
    title: 'Бюро пропусков',
    text: 'Реестр заявок: статусы, время входа и выхода, причины отклонения.',
  },
  {
    to: '/workplace/dkb',
    icon: <AuditOutlined />,
    role: 'Dkb',
    title: 'Кабинет ДКБ',
    text: 'Согласование заявок и отказ с обязательной причиной, история согласования.',
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
          демонстрационные, бэкенд не подключён. Действия посетителя и охранника связаны: фото,
          снятое на шаге 2, появляется на шаге 4, а решение охранника попадает в журнал входов и
          выходов, в реестр заявок и в итоговое письмо.
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

        <Title level={4} className="home__section">
          Рабочие места сотрудников
        </Title>
        <Paragraph className="home__lead">
          Роли взяты из PermissionEnum основного проекта. Показаны три кабинета, участвующие в
          проходе посетителя.
        </Paragraph>

        <div className="home__cards">
          {WORKPLACES.map((w) => (
            <Link key={w.to} to={w.to} className="home__card-link">
              <Card hoverable className="home__card" variant="borderless">
                <div className="home__card-icon">{w.icon}</div>
                <div className="home__card-step">{w.role}</div>
                <div className="home__card-title">{w.title}</div>
                <div className="home__card-text">{w.text}</div>
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
