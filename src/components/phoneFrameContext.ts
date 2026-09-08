import { createContext, useContext } from 'react';

/**
 * Элемент рамки телефона. Служит точкой монтирования для оверлеев,
 * которые должны накрывать только «экран», а не всё окно браузера.
 * Вынесен из PhoneFrame.tsx, чтобы не ломать fast refresh.
 */
export const PhoneFrameContext = createContext<HTMLElement | null>(null);

export function usePhoneFrame(): HTMLElement | null {
  return useContext(PhoneFrameContext);
}
