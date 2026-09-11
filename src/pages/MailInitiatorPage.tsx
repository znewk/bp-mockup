import { Link } from 'react-router-dom';
import { Alert, Button, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MOCK_PASS } from '../data/mock';
import { usePassState } from '../data/usePassState';
import logoKmg from '../assets/img/logo-kmg.png';
import './MailPage.css';

/**
 * Письмо инициатору пропуска — тому, кто создал заявку на посетителя
 * (поле createdUser / «Автор заявки» в реестре).
 *
 * Уходит сразу после оформления пропуска: инициатор видит, что пропуск
 * выписан, на кого именно и до какого времени действует, и отдельно —
 * сделал ли посетитель фото, без которого его не пропустят на посту.
 */
export default function MailInitiatorPage() {
  const state = usePassState();
  const photoSent = state.photo !== null;

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
          <div className="mail__subject">
            Пропуск № {MOCK_PASS.number} оформлен на посетителя
          </div>
          <div className="mail__meta">
            от <b>no-reply@kmg.kz</b> — сегодня, 09:12
          </div>
          <div className="mail__meta">
            кому <b>{MOCK_PASS.accompanyingFullName}</b> — инициатор пропуска
          </div>
        </div>

        <div className="mail__body">
          <img src={logoKmg} alt="КазМунайГаз" className="mail__logo" />

          <p>
            Здравствуйте, <b>{MOCK_PASS.accompanyingFullName}</b>!
          </p>

          <p>
            По вашей заявке оформлен электронный пропуск № {MOCK_PASS.number} в{' '}
            {MOCK_PASS.organization}.
          </p>

          <Alert
            type="success"
            showIcon
            className="mail__result"
            title="Пропуск оформлен"
            description={`Посетитель: ${MOCK_PASS.visitorFullName} · ИИН ${MOCK_PASS.iin}`}
          />

          <div className="mail__facts">
            <div>
              <span>Посетитель</span>
              <b>{MOCK_PASS.visitorFullName}</b>
            </div>
            <div>
              <span>Цель визита</span>
              <b>{MOCK_PASS.purposeVisit}</b>
            </div>
            <div>
              <span>К кому</span>
              <b>{MOCK_PASS.inviterFullName}</b>
            </div>
            <div>
              <span>Кабинет</span>
              <b>№ {MOCK_PASS.cabinet}</b>
            </div>
            <div>
              <span>Срок действия</span>
              <b>
                {MOCK_PASS.beginDate} — {MOCK_PASS.endDate}
              </b>
            </div>
            <div>
              <span>Тип пропуска</span>
              <b>
                <Tag color="blue" style={{ margin: 0 }}>
                  {MOCK_PASS.type}
                </Tag>
              </b>
            </div>
          </div>

          {/* Инициатору важно знать, готов ли посетитель к проходу */}
          <Alert
            type={photoSent ? 'success' : 'warning'}
            showIcon
            className="mail__result"
            title={photoSent ? 'Посетитель отправил фото' : 'Посетитель ещё не отправил фото'}
            description={
              photoSent
                ? 'Пропуск готов к использованию — посетитель может проходить на пост охраны.'
                : 'Посетителю отправлена ссылка на электронный пропуск. Пока он не сфотографируется, охрана не пропустит его в здание.'
            }
          />

          <div className="mail__note">
            Посетителю на почту ушло отдельное письмо со ссылкой на электронный пропуск. Напомните
            ему сделать фото лица заранее — без фото охрана откажет во входе.
          </div>

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
