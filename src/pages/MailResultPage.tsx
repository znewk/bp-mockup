import { Link } from 'react-router-dom';
import { Alert, Button, Radio, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { MOCK_PASS, writeState } from '../data/mock';
import { usePassState } from '../data/usePassState';
import { POST_NAME, ROLES } from '../data/registry';
import logoKmg from '../assets/img/logo-kmg.png';
import './MailPage.css';

/**
 * Итоговое письмо посетителю: результат прохода на пост охраны.
 * Текст меняется в зависимости от решения — пропущен или отказано
 * с указанием причины (reasonDecline).
 */
export default function MailResultPage() {
  const state = usePassState();
  const denied = state.decision === 'denied';

  return (
    <div className="bp-page mail">
      <div className="mail__top">
        <Link to="/">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            К сценариям
          </Button>
        </Link>
      </div>

      <div className="mail__switch">
        <span className="mail__switch-label">Показать письмо для решения:</span>
        <Radio.Group
          value={state.decision ?? 'allowed'}
          onChange={(e) =>
            writeState({
              decision: e.target.value,
              declineReason:
                e.target.value === 'denied'
                  ? (state.declineReason ?? 'Лицо не совпадает с фото в пропуске')
                  : null,
            })
          }
          optionType="button"
          buttonStyle="solid"
          options={[
            { value: 'allowed', label: 'Пропущен' },
            { value: 'denied', label: 'Отказано' },
          ]}
        />
      </div>

      <div className="mail__client">
        <div className="mail__client-head">
          <div className="mail__subject">
            {denied
              ? `Отказ во входе по пропуску № ${MOCK_PASS.number}`
              : `Вход по пропуску № ${MOCK_PASS.number} подтверждён`}
          </div>
          <div className="mail__meta">
            от <b>no-reply@kmg.kz</b> — сегодня,{' '}
            {(state.entryDate ?? '16:13 03.04.2023').slice(0, 5)}
          </div>
        </div>

        <div className="mail__body">
          <img src={logoKmg} alt="КазМунайГаз" className="mail__logo" />

          <p>
            Здравствуйте, <b>{MOCK_PASS.visitorFullName}</b>!
          </p>

          {denied ? (
            <>
              <p>
                К сожалению, во входе в {MOCK_PASS.organization} по пропуску № {MOCK_PASS.number}{' '}
                отказано.
              </p>

              <Alert
                type="error"
                showIcon
                className="mail__result"
                title="Причина отказа"
                description={state.declineReason ?? 'Лицо не совпадает с фото в пропуске'}
              />

              <p>
                Решение принято на посту охраны ({POST_NAME}), ответственный сотрудник —{' '}
                {ROLES.security.user}.
              </p>
              <p>
                Если вы считаете отказ ошибочным, свяжитесь с принимающей стороной:{' '}
                <b>{MOCK_PASS.inviterFullName}</b>, {MOCK_PASS.inviterPosition}. После устранения
                причины принимающая сторона может оформить новую заявку на пропуск.
              </p>
            </>
          ) : (
            <>
              <p>
                Ваш вход в {MOCK_PASS.organization} по пропуску № {MOCK_PASS.number} подтверждён.
              </p>

              <Alert
                type="success"
                showIcon
                className="mail__result"
                title="Вход разрешён"
                description={`Время входа: ${state.entryDate ?? '16:13 03.04.2023'} · ${POST_NAME}`}
              />

              <div className="mail__facts">
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
                  <span>Пропуск действует до</span>
                  <b>{MOCK_PASS.endDate}</b>
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

              <div className="mail__note">
                При выходе из здания сдайте карту пропуска на посту охраны — иначе пропуск
                останется в статусе «В здании».
              </div>
            </>
          )}

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
