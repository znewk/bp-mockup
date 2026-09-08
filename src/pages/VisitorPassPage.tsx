import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, App as AntApp, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PhoneFrame from '../components/PhoneFrame';
import PassDocument from '../components/PassDocument';
import CameraCapture from '../components/CameraCapture';
import { MOCK_PASS, writeState } from '../data/mock';
import { usePassState } from '../data/usePassState';
import './VisitorPassPage.css';

/**
 * Шаг 2. Страница, которую посетитель открывает по ссылке из письма
 * на своём телефоне: пропуск, съёмка лица и QR внизу.
 *
 * Съёмка и отправка разведены на два шага: снятое фото сначала лежит
 * черновиком (его видно, можно переснять) и уходит в систему только по кнопке
 * «Отправить фото». До этого QR закрыт — чтобы посетителю было однозначно
 * понятно, можно ли уже идти на пост охраны.
 */
export default function VisitorPassPage() {
  const state = usePassState();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);
  const { message } = AntApp.useApp();

  // origin + путь до макета + хэш-роут — работает и локально, и на GitHub Pages
  const guardUrl = `${window.location.origin}${window.location.pathname}#/guard/pass/${MOCK_PASS.number}`;

  const shownPhoto = draftPhoto ?? state.photo;
  const photoSent = draftPhoto === null && state.photo !== null;

  const sendPhoto = () => {
    if (!draftPhoto) return;
    writeState({ photo: draftPhoto });
    setDraftPhoto(null);
    void message.success('Фото отправлено, QR активен');
  };

  return (
    <div className="bp-page visitor">
      <div className="visitor__top bp-no-print">
        <Link to="/">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            К сценариям
          </Button>
        </Link>
      </div>

      <PhoneFrame caption="Телефон посетителя">
        <div className="visitor__screen">
          {!shownPhoto && (
            <Alert
              className="visitor__alert"
              type="info"
              showIcon
              title="Шаг 1. Сделайте фото лица"
              description="Без фото охранник не сможет сверить вас на посту, а QR останется закрытым."
            />
          )}

          {draftPhoto && (
            <Alert
              className="visitor__alert"
              type="warning"
              showIcon
              title="Шаг 2. Фото ещё не отправлено"
              description="Проверьте снимок и нажмите «Отправить фото». Если получилось плохо — переснимите."
            />
          )}

          {photoSent && (
            <Alert
              className="visitor__alert"
              type="success"
              showIcon
              title="Фото отправлено"
              description="Покажите QR-код внизу охраннику на посту."
            />
          )}

          <PassDocument
            pass={MOCK_PASS}
            mode="visitor"
            photo={shownPhoto}
            photoSent={photoSent}
            qrValue={guardUrl}
            onCapture={() => setCameraOpen(true)}
            onSendPhoto={sendPhoto}
          />
        </div>
      </PhoneFrame>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onConfirm={(base64) => {
          // фото пока только черновик — в систему уйдёт по кнопке «Отправить фото»
          setDraftPhoto(base64);
        }}
      />
    </div>
  );
}
