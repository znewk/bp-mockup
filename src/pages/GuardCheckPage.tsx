import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, App as AntApp, Button, Input, Modal, Result, Select, Tag } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, MailOutlined } from '@ant-design/icons';
import PhoneFrame from '../components/PhoneFrame';
import PassDocument from '../components/PassDocument';
import { MOCK_PASS, addLogEntry, formatEntryTime, writeState } from '../data/mock';
import { usePassState } from '../data/usePassState';
import { DECLINE_REASONS, POST_NAME, ROLES } from '../data/registry';
import './GuardCheckPage.css';

/**
 * Шаг 4. Страница, которая открывается у охранника после сканирования QR.
 * Слева — селфи посетителя, справа — скан его удостоверения из заявки.
 * Охранник сверяет лицо живого человека с обоими изображениями и принимает
 * решение. Отказ требует причины (поле reasonDecline основного проекта):
 * она попадает в журнал входов/выходов и в письмо посетителю.
 */
export default function GuardCheckPage() {
  const state = usePassState();
  const { message } = AntApp.useApp();
  const entryDate = state.entryDate ?? formatEntryTime();

  const [declineOpen, setDeclineOpen] = useState(false);
  const [reason, setReason] = useState<string>(DECLINE_REASONS[0]);
  const [comment, setComment] = useState('');

  const allow = () => {
    const time = formatEntryTime();
    writeState({ decision: 'allowed', entryDate: time, declineReason: null });
    addLogEntry({
      passNumber: MOCK_PASS.number,
      visitorFullName: MOCK_PASS.visitorFullName,
      action: 'Enter',
      post: POST_NAME,
      operator: ROLES.security.user,
      date: time,
    });
    void message.success('Вход разрешён');
  };

  const confirmDecline = () => {
    const full = reason === 'Иная причина' && comment.trim() ? comment.trim() : reason;
    const time = formatEntryTime();
    writeState({ decision: 'denied', declineReason: full, entryDate: null });
    addLogEntry({
      passNumber: MOCK_PASS.number,
      visitorFullName: MOCK_PASS.visitorFullName,
      action: 'Denied',
      post: POST_NAME,
      operator: ROLES.security.user,
      reason: full,
      date: time,
    });
    setDeclineOpen(false);
    setComment('');
    setReason(DECLINE_REASONS[0]);
    void message.error('Во входе отказано');
  };

  return (
    <div className="bp-page guard">
      <div className="guard__top bp-no-print">
        <Link to="/">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            К сценариям
          </Button>
        </Link>
      </div>

      <PhoneFrame caption="Телефон охранника — после скана QR">
        <div className="guard__screen">
          {state.decision ? (
            <Result
              status={state.decision === 'allowed' ? 'success' : 'error'}
              title={state.decision === 'allowed' ? 'Вход разрешён' : 'Во входе отказано'}
              subTitle={
                state.decision === 'allowed' ? (
                  `Пропуск № ${MOCK_PASS.number} · время входа ${entryDate}`
                ) : (
                  <>
                    Пропуск № {MOCK_PASS.number}
                    <br />
                    <b>Причина: {state.declineReason}</b>
                  </>
                )
              }
              extra={
                <div className="guard__result-actions">
                  <Button
                    onClick={() => writeState({ decision: null, declineReason: null })}
                  >
                    Вернуться к сверке
                  </Button>
                  <Link to="/mail/result">
                    <Button type="primary" icon={<MailOutlined />}>
                      Письмо посетителю
                    </Button>
                  </Link>
                </div>
              }
            />
          ) : (
            <>
              <Alert
                className="guard__alert"
                type={state.photo ? 'info' : 'warning'}
                showIcon
                title={state.photo ? 'Сверьте лицо посетителя' : 'Посетитель не сделал фото'}
                description={
                  state.photo
                    ? 'Сравните посетителя с его фото и со сканом удостоверения. Нажмите на изображение, чтобы увеличить.'
                    : 'Фото в пропуске отсутствует — сверяйте по скану удостоверения и оригиналу документа.'
                }
              />

              <div className="guard__status">
                <Tag color={state.photo ? 'green' : 'orange'}>
                  {state.photo ? 'Фото получено' : 'Фото не получено'}
                </Tag>
                <Tag color="blue">{MOCK_PASS.type}</Tag>
              </div>

              <PassDocument
                pass={MOCK_PASS}
                mode="guard"
                photo={state.photo}
                documentScan={state.documentScan}
                entryDate={entryDate}
              />

              <div className="guard__actions bp-no-print">
                <Button
                  danger
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => setDeclineOpen(true)}
                >
                  Отказать
                </Button>
                <Button type="primary" size="large" icon={<CheckOutlined />} onClick={allow}>
                  Пропустить
                </Button>
              </div>
            </>
          )}
        </div>
      </PhoneFrame>

      <Modal
        open={declineOpen}
        title="Причина отказа"
        okText="Отказать"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        onOk={confirmDecline}
        onCancel={() => setDeclineOpen(false)}
        width={420}
      >
        <p style={{ marginBottom: 6 }}>
          Выберите причину <span style={{ color: 'red' }}>*</span>
        </p>
        <Select
          style={{ width: '100%' }}
          value={reason}
          onChange={setReason}
          options={DECLINE_REASONS.map((r) => ({ value: r, label: r }))}
        />
        <p style={{ margin: '14px 0 6px' }}>Комментарий</p>
        <Input.TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Текст попадёт в журнал и в письмо посетителю"
        />
      </Modal>
    </div>
  );
}
