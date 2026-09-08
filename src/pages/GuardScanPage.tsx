import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'antd';
import { ArrowLeftOutlined, QrcodeOutlined } from '@ant-design/icons';
import PhoneFrame from '../components/PhoneFrame';
import { MOCK_PASS, formatEntryTime, readState, writeState } from '../data/mock';
import logoKmg from '../assets/img/logo-kmg.png';
import './GuardScanPage.css';

/**
 * Шаг 3. Пост охраны: охранник наводит камеру телефона на QR из пропуска
 * посетителя. В боевой версии распознаванием занимается ZXing
 * (в основном проекте — @zxing/ngx-scanner).
 */
export default function GuardScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      })
      .catch(() => {
        if (!cancelled) setError('Камера недоступна — макет можно пролистать кнопкой ниже.');
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const handleScan = () => {
    // Пропуск без фото сверять нечем — на пост такого посетителя не пускаем
    if (!readState().photo) {
      setScanError(
        'В пропуске нет фото посетителя. Попросите его открыть электронный пропуск, ' +
          'сфотографироваться и нажать «Отправить фото».',
      );
      return;
    }

    // Фиксируем время входа — оно появится в пропуске у охранника
    setScanError(null);
    writeState({ entryDate: formatEntryTime(), decision: null });
    navigate(`/guard/pass/${MOCK_PASS.number}`);
  };

  return (
    <div className="bp-page scan">
      <div className="scan__top bp-no-print">
        <Link to="/">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            К сценариям
          </Button>
        </Link>
      </div>

      <PhoneFrame caption="Телефон охранника">
        <div className="scan__screen">
          <div className="scan__header">
            <img src={logoKmg} alt="КазМунайГаз" />
            <span>Пост охраны</span>
          </div>

          {error && <Alert type="warning" showIcon title={error} className="scan__alert" />}

          {scanError && (
            <Alert
              type="error"
              showIcon
              title="Пропуск не прошёл проверку"
              description={scanError}
              className="scan__alert"
            />
          )}

          <div className="scan__viewport">
            <video ref={videoRef} playsInline muted />
            <div className="scan__frame">
              <i className="scan__corner scan__corner--tl" />
              <i className="scan__corner scan__corner--tr" />
              <i className="scan__corner scan__corner--bl" />
              <i className="scan__corner scan__corner--br" />
              <div className="scan__laser" />
            </div>
          </div>

          <div className="scan__hint">Наведите камеру на QR-код в пропуске посетителя</div>

          <Button
            type="primary"
            size="large"
            block
            icon={<QrcodeOutlined />}
            className="scan__btn"
            onClick={handleScan}
          >
            {scanError ? 'Проверить ещё раз' : 'Считать QR-код'}
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
}
