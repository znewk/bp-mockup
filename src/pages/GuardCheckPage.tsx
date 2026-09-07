import { Link } from 'react-router-dom';
import { Alert, App as AntApp, Button, Result, Tag } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PhoneFrame from '../components/PhoneFrame';
import PassDocument from '../components/PassDocument';
import { MOCK_PASS, formatEntryTime, writeState } from '../data/mock';
import { usePassState } from '../data/usePassState';
import './GuardCheckPage.css';

/**
 * Шаг 4. Страница, которая открывается у охранника после сканирования QR.
 * Слева — селфи посетителя, справа — скан его удостоверения из заявки.
 * Охранник сверяет лицо живого человека с обоими изображениями.
 */
export default function GuardCheckPage() {
  const state = usePassState();
  const { message } = AntApp.useApp();
  const entryDate = state.entryDate ?? formatEntryTime();

  const decide = (decision: 'allowed' | 'denied') => {
    writeState({ decision, entryDate: decision === 'allowed' ? entryDate : state.entryDate });
    void (decision === 'allowed'
      ? message.success('Вход разрешён')
      : message.error('Во входе отказано'));
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
                state.decision === 'allowed'
                  ? `Пропуск № ${MOCK_PASS.number} · время входа ${entryDate}`
                  : `Пропуск № ${MOCK_PASS.number} · фото не совпало`
              }
              extra={
                <Button onClick={() => writeState({ decision: null })}>Вернуться к сверке</Button>
              }
            />
          ) : (
            <>
              <Alert
                className="guard__alert"
                type={state.photo ? 'info' : 'warning'}
                showIcon
                message={
                  state.photo
                    ? 'Сверьте лицо посетителя'
                    : 'Посетитель не сделал фото'
                }
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
                  onClick={() => decide('denied')}
                >
                  Отказать
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckOutlined />}
                  onClick={() => decide('allowed')}
                >
                  Пропустить
                </Button>
              </div>
            </>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}
