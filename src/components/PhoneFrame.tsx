import type { ReactNode } from 'react';
import './PhoneFrame.css';

interface Props {
  /** Подпись над «телефоном» — кто держит устройство */
  caption?: string;
  children: ReactNode;
}

/**
 * Рамка телефона. Нужна только для демонстрации макета на десктопе —
 * на реальном устройстве страницы открываются на весь экран.
 */
export default function PhoneFrame({ caption, children }: Props) {
  return (
    <div className="phone-wrap">
      {caption && <div className="phone-caption">{caption}</div>}
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}
