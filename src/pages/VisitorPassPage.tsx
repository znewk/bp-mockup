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
 * на своём телефоне: пропуск, кнопка «Снять на фото» и QR внизу.
 */
export default function VisitorPassPage() {
  const state = usePassState();
  const [cameraOpen, setCameraOpen] = useState(false);
  const { message } = AntApp.useApp();

  // origin + путь до макета + хэш-роут — работает и локально, и на GitHub Pages
  const guardUrl = `${window.location.origin}${window.location.pathname}#/guard/pass/${MOCK_PASS.number}`;

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
          {!state.photo && (
            <Alert
              className="visitor__alert"
              type="info"
              showIcon
              message="Сделайте фото лица"
              description="Без фото охранник не сможет сверить вас на посту."
            />
          )}

          <PassDocument
            pass={MOCK_PASS}
            mode="visitor"
            photo={state.photo}
            qrValue={guardUrl}
            onCapture={() => setCameraOpen(true)}
          />
        </div>
      </PhoneFrame>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onConfirm={(base64) => {
          writeState({ photo: base64 });
          void message.success('Фото сохранено');
        }}
      />
    </div>
  );
}
