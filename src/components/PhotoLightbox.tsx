import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { usePhoneFrame } from './phoneFrameContext';
import './PhotoLightbox.css';

interface Props {
  src: string | null;
  title?: string;
  onClose: () => void;
}

/**
 * Просмотр фото «в телефоне»: оверлей монтируется в рамку PhoneFrame и
 * накрывает только экран устройства, а не всё окно браузера.
 * Вне рамки (если компонент используют отдельно) разворачивается на весь экран.
 */
export default function PhotoLightbox({ src, title, onClose }: Props) {
  const frame = usePhoneFrame();
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!src) return null;

  const node = (
    <div
      className={`lightbox ${frame ? '' : 'lightbox--fullscreen'}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox__title">{title}</span>
        <button
          type="button"
          className="lightbox__icon"
          aria-label={zoomed ? 'Уменьшить' : 'Увеличить'}
          onClick={() => setZoomed((v) => !v)}
        >
          {zoomed ? <ZoomOutOutlined /> : <ZoomInOutlined />}
        </button>
        <button type="button" className="lightbox__icon" aria-label="Закрыть" onClick={onClose}>
          <CloseOutlined />
        </button>
      </div>

      <div className="lightbox__body">
        <img
          className={`lightbox__img ${zoomed ? 'lightbox__img--zoomed' : ''}`}
          src={src}
          alt={title ?? ''}
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((v) => !v);
          }}
        />
      </div>

      <div className="lightbox__hint">
        {zoomed ? 'Потяните, чтобы рассмотреть' : 'Нажмите на фото, чтобы приблизить'}
      </div>
    </div>
  );

  return createPortal(node, frame ?? document.body);
}
