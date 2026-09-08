import { useState, type ReactNode } from 'react';
import { PhoneFrameContext } from './phoneFrameContext';
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
  // callback ref — после монтирования отдаём элемент вниз по дереву,
  // чтобы модалки рисовались внутри экрана телефона
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);

  return (
    <div className="phone-wrap">
      {caption && <div className="phone-caption">{caption}</div>}
      <div className="phone-frame" ref={setFrame}>
        <div className="phone-notch" />
        <div className="phone-screen">
          <PhoneFrameContext.Provider value={frame}>{children}</PhoneFrameContext.Provider>
        </div>
      </div>
    </div>
  );
}
