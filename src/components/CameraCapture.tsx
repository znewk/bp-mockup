import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Modal, Upload } from 'antd';
import { CameraOutlined, CheckOutlined, RetweetOutlined, UploadOutlined } from '@ant-design/icons';
import './CameraCapture.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (base64: string) => void;
}

/**
 * Съёмка селфи с фронтальной камеры телефона.
 * Аналог views/terminal/image-capture основного проекта, только под мобильный
 * браузер посетителя. Если камера недоступна (нет HTTPS / нет разрешения) —
 * остаётся загрузка файла, чтобы макет можно было показать где угодно.
 */
export default function CameraCapture({ open, onClose, onConfirm }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!open) {
      stopCamera();
      setShot(null);
      setError(null);
      return;
    }

    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user', width: 720, height: 960 }, audio: false })
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
        if (!cancelled) {
          setError('Камера недоступна. Разрешите доступ в браузере или загрузите фото файлом.');
        }
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [open, stopCamera]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Зеркалим, чтобы селфи выглядело как в зеркале
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setShot(canvas.toDataURL('image/jpeg', 0.85));
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setShot(String(reader.result));
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Снять на фото"
      footer={null}
      width={420}
      centered
      destroyOnHidden
    >
      {error && <Alert type="warning" showIcon title={error} className="camera__alert" />}

      <div className="camera__stage">
        {shot ? (
          <img className="camera__media" src={shot} alt="Снимок" />
        ) : (
          <>
            <video ref={videoRef} className="camera__media camera__media--mirror" playsInline muted />
            <div className="camera__oval" />
            <div className="camera__hint">Расположите лицо в овале</div>
          </>
        )}
      </div>

      {shot ? (
        <div className="camera__actions">
          <Button size="large" icon={<RetweetOutlined />} onClick={() => setShot(null)}>
            Переснять
          </Button>
          <Button
            size="large"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => {
              onConfirm(shot);
              onClose();
            }}
          >
            Сохранить
          </Button>
        </div>
      ) : (
        <div className="camera__actions">
          <Upload beforeUpload={readFile} showUploadList={false} accept="image/*">
            <Button size="large" icon={<UploadOutlined />}>
              Файлом
            </Button>
          </Upload>
          <Button size="large" type="primary" icon={<CameraOutlined />} onClick={capture} disabled={!!error}>
            Сделать снимок
          </Button>
        </div>
      )}
    </Modal>
  );
}
