/**
 * Мок-данные пропуска. Поля повторяют TerminalDto основного проекта
 * (src/app/views/terminal/models/terminal.dto.ts).
 */

import idCardMock from '../assets/img/id-card-mock.svg';

export type Sex = 'Мужской' | 'Женский';

export type VisitType = 'Одноразовый' | 'Временный' | 'Постоянный';

export interface PassMaterial {
  technicName: string;
  serialNumber: string;
  description: string;
}

export interface PassDto {
  /** Номер пропуска */
  number: number;
  iin: string;
  visitorFullName: string;
  sex: Sex;
  /** Цель визита */
  purposeVisit: string;
  /** Организация, выдавшая разрешение */
  organization: string;
  /** Тип пропуска */
  type: VisitType;
  cabinet: string;
  floor: number;
  /** К кому */
  inviterFullName: string;
  inviterPosition: string;
  /** Ответственный сотрудник */
  accompanyingFullName: string;
  accompanyingPhone: string;
  beginDate: string;
  endDate: string;
  materials: PassMaterial[];
}

export const MOCK_PASS: PassDto = {
  number: 4527,
  iin: '900415300123',
  visitorFullName: 'Сериков Алихан Маратович',
  sex: 'Мужской',
  purposeVisit: 'Участие в собеседовании',
  organization: '«КазМунайГаз» АО НК',
  type: 'Одноразовый',
  cabinet: '1306',
  floor: 13,
  inviterFullName: 'Абдрахманова Динара Ерлановна',
  inviterPosition: 'Департамент управления персоналом',
  accompanyingFullName: 'Нурланов Ерасыл Сакенович',
  accompanyingPhone: '+7 (701) 234-56-78',
  beginDate: '09:00 03.04.2023',
  endDate: '18:30 03.04.2023',
  materials: [
    {
      technicName: 'Ноутбук Lenovo ThinkPad',
      serialNumber: 'PF-2K91MB',
      description: 'Кол-во: 1',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Состояние демо. Хранится в localStorage, чтобы фото, снятое         */
/* посетителем на своём телефоне, «долетело» до страницы охранника     */
/* (в проде это делает бэкенд + SignalR-хаб hubs/security).            */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'bp-mockup-state';

export interface PassState {
  /** Селфи посетителя (base64) */
  photo: string | null;
  /** Скан удостоверения, подтянутый из заявки */
  documentScan: string | null;
  /** Время входа, проставляется охранником */
  entryDate: string | null;
  /** Решение охранника */
  decision: 'allowed' | 'denied' | null;
}

const DEFAULT_STATE: PassState = {
  photo: null,
  documentScan: idCardMock,
  entryDate: null,
  decision: null,
};

export function readState(): PassState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    // documentScan всегда берём из сборки: в localStorage может лежать
    // путь из прошлой версии макета
    return { ...DEFAULT_STATE, ...JSON.parse(raw), documentScan: DEFAULT_STATE.documentScan };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function writeState(patch: Partial<PassState>): PassState {
  const next = { ...readState(), ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  return next;
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
}

export function formatEntryTime(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}.${pad(
    date.getMonth() + 1,
  )}.${date.getFullYear()}`;
}
