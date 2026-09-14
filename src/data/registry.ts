/**
 * Справочники макета: роли, статусы заявок, причины отклонения и
 * демонстрационные строки для журналов.
 *
 * Источники в основном проекте:
 *  - роли      — enums/permission.enum.ts (PermissionEnum)
 *  - статусы   — enums/visit-status.enum.ts (VisitStatusEnum)
 *  - действия  — dtos/visitors/entry-history-dto.ts (EntryTypeEnum)
 *  - отказ     — dtos/visitors/visit.dto.ts (поле reasonDecline)
 */

import type { EntryAction, EntryLogItem } from './mock';

/* ------------------------------ роли ------------------------------ */

export type RoleKey = 'security' | 'reception' | 'dkb';

export interface RoleInfo {
  key: RoleKey;
  /** Значение PermissionEnum в основном проекте */
  permission: string;
  title: string;
  /** Кто это и что делает в процессе */
  duty: string;
  user: string;
}

export const ROLES: Record<RoleKey, RoleInfo> = {
  security: {
    key: 'security',
    permission: 'Security',
    title: 'Пост охраны',
    duty: 'Сканирует QR, сверяет лицо, фиксирует вход и выход, отказывает с указанием причины.',
    user: 'Асылов Асыл Асылович',
  },
  reception: {
    key: 'reception',
    permission: 'Reception',
    title: 'Бюро пропусков',
    duty: 'Ведёт заявки, выдаёт и перевыпускает карты пропуска, следит за сроками действия.',
    user: 'Айгулова Айгуль Айгуловна',
  },
  dkb: {
    key: 'dkb',
    permission: 'Dkb',
    title: 'ДКБ — согласование',
    duty: 'Согласовывает заявки на пропуск, отклоняет с обязательным указанием причины.',
    user: 'Даулетов Даулет Даулетович',
  },
};

/* ---------------------------- статусы ----------------------------- */

/** Все значения VisitStatusEnum основного проекта (enums/visit-status.enum.ts) */
export type VisitStatus =
  | 'NotAgreement'
  | 'OnAgreement'
  | 'OnAgreementDkb'
  | 'OnAgreementDkbResponsible'
  | 'OnAgreementDkbAdviser'
  | 'OnAdvancedAgreementDkb'
  | 'Denied'
  | 'DeniedDkb'
  | 'DeniedDkbResponsible'
  | 'DeniedDkbAdviser'
  | 'Canceled'
  | 'OnTerminal'
  | 'CardGiven'
  | 'InBuilding'
  | 'LeftFromBuilding'
  | 'WrongEnterExit'
  | 'Expired'
  | 'NotUsed';

/**
 * Подписи статусов.
 *
 * ВАЖНО: в боевой системе тексты статусов лежат не в коде, а приходят с бэка
 * (api/Dictionaries/Localizations/GetLocalization, ключ VisitStatusEnum.<Status>).
 * В locale-файлах репозитория ключа VisitStatusEnum нет, поэтому подписи здесь
 * взяты из комментариев к enums/visit-status.enum.ts, а «Отменен» и
 * «Не использовано» — со скриншота боевого реестра. При переносе в прод
 * тексты нужно сверить со справочником локализаций.
 */
export const STATUS_INFO: Record<VisitStatus, { label: string; color: string }> = {
  NotAgreement: { label: 'Не согласован', color: 'gold' },
  OnAgreement: { label: 'На согласовании', color: 'gold' },
  OnAgreementDkb: { label: 'На согласовании ДКБ', color: 'orange' },
  OnAgreementDkbResponsible: { label: 'На согласовании у ответственного ДКБ', color: 'orange' },
  OnAgreementDkbAdviser: { label: 'На согласовании у советника ДКБ', color: 'orange' },
  OnAdvancedAgreementDkb: { label: 'На дополнительном согласовании ДКБ', color: 'orange' },
  Denied: { label: 'Отказано', color: 'red' },
  DeniedDkb: { label: 'Отказано ДКБ', color: 'red' },
  DeniedDkbResponsible: { label: 'Отказано ответственным ДКБ', color: 'red' },
  DeniedDkbAdviser: { label: 'Отказано советником ДКБ', color: 'red' },
  Canceled: { label: 'Отменен', color: 'default' },
  OnTerminal: { label: 'На терминале', color: 'cyan' },
  CardGiven: { label: 'Выдана карта', color: 'cyan' },
  InBuilding: { label: 'В здании', color: 'green' },
  LeftFromBuilding: { label: 'Вышел из здания', color: 'blue' },
  WrongEnterExit: { label: 'Некорректный вход/выход', color: 'red' },
  Expired: { label: 'Просрочено', color: 'default' },
  NotUsed: { label: 'Не использовано', color: 'default' },
};

/* ------------------------ действия в журнале ---------------------- */

export const ACTION_INFO: Record<EntryAction, { label: string; color: string }> = {
  Enter: { label: 'Вход', color: 'green' },
  Exit: { label: 'Выход', color: 'blue' },
  CardPrint: { label: 'Печать карты', color: 'cyan' },
  CardRePrint: { label: 'Перепечать карты', color: 'purple' },
  Denied: { label: 'Отказано', color: 'red' },
};

/* ----------------------- причины отклонения ----------------------- */

export const DECLINE_REASONS = [
  'Лицо не совпадает с фото в пропуске',
  'Фото не совпадает со сканом удостоверения',
  'Не предъявлено удостоверение личности',
  'Истёк срок действия пропуска',
  'Посетитель находится в чёрном списке',
  'Проносит запрещённые предметы',
  'Иная причина',
];

export const POST_NAME = 'Пост №1, главный вход';

/* --------------------- демонстрационные заявки -------------------- */

export interface VisitRow {
  id: number;
  passNumber: number;
  visitorFullName: string;
  iin: string;
  purposeVisit: string;
  inviterFullName: string;
  /** Автор заявки */
  authorFullName: string;
  validFrom: string;
  validTo: string;
  entryTime: string | null;
  exitTime: string | null;
  status: VisitStatus;
  /** Причина отклонения согласующим — поле reasonDecline основного проекта */
  reasonDecline: string | null;
  /** Кто отклонил заявку на согласовании */
  declinedBy: string | null;
  /** Новое: причина, по которой охрана не пропустила на посту */
  securityDeclineReason?: string | null;
  cabinet: string;
  floor: number;
  /** Фото посетителя — в карточке охраны и в аватаре таблицы */
  photo?: string | null;
  /** Нарушение режима — красная точка у номера заявки */
  isBreach?: boolean;
  accompanying?: string;
  organization?: string;
}

export const MOCK_VISITS: VisitRow[] = [
  {
    id: 1,
    passNumber: 4521,
    visitorFullName: 'Ерболов Ербол Ерболович',
    iin: '880212300455',
    purposeVisit: 'Совещание по бюджету',
    inviterFullName: 'Ерланов Ерлан Ерланович',
    authorFullName: 'Ерланов Ерлан Ерланович',
    validFrom: '09:00 10.09.2026',
    validTo: '18:30 10.09.2026',
    entryTime: '09:14 10.09.2026',
    exitTime: '12:40 10.09.2026',
    status: 'LeftFromBuilding',
    reasonDecline: null,
    declinedBy: null,
    cabinet: '1204',
    floor: 12,
    organization: 'ТОО «Контрагент»',
  },
  {
    id: 2,
    passNumber: 4523,
    visitorFullName: 'Санжарова Санжар Санжаровна',
    iin: '920730400871',
    purposeVisit: 'Подписание договора',
    inviterFullName: 'Даулетов Даулет Даулетович',
    authorFullName: 'Айгулова Айгуль Айгуловна',
    validFrom: '10:00 10.09.2026',
    validTo: '18:30 10.09.2026',
    entryTime: '10:05 10.09.2026',
    exitTime: null,
    status: 'InBuilding',
    reasonDecline: null,
    declinedBy: null,
    cabinet: '0908',
    floor: 9,
    organization: 'ТОО «Контрагент»',
  },
  {
    id: 3,
    passNumber: 4524,
    visitorFullName: 'Кайратов Кайрат Кайратович',
    iin: '850103301122',
    purposeVisit: 'Техническое обслуживание',
    inviterFullName: 'Асылов Асыл Асылович',
    authorFullName: 'Асылов Асыл Асылович',
    validFrom: '09:00 10.09.2026',
    validTo: '18:30 10.09.2026',
    entryTime: null,
    exitTime: null,
    status: 'Denied',
    reasonDecline: null,
    declinedBy: null,
    securityDeclineReason: 'Лицо не совпадает с фото в пропуске',
    cabinet: '0415',
    floor: 4,
    organization: 'ТОО «Контрагент»',
  },
  {
    id: 4,
    passNumber: 4525,
    visitorFullName: 'Нурланова Нурлана Нурлановна',
    iin: '960919500334',
    purposeVisit: 'Собеседование',
    inviterFullName: 'Ерланов Ерлан Ерланович',
    authorFullName: 'Ерланов Ерлан Ерланович',
    validFrom: '11:00 10.09.2026',
    validTo: '18:30 10.09.2026',
    entryTime: null,
    exitTime: null,
    status: 'DeniedDkb',
    reasonDecline: 'Посетитель находится в чёрном списке',
    declinedBy: 'Даулетов Даулет Даулетович (ДКБ)',
    securityDeclineReason: null,
    cabinet: '1306',
    floor: 13,
    organization: 'ТОО «Контрагент»',
  },
  {
    id: 5,
    passNumber: 4526,
    visitorFullName: 'Талгатов Талгат Талгатович',
    iin: '910405302299',
    purposeVisit: 'Доставка оборудования',
    inviterFullName: 'Айгулова Айгуль Айгуловна',
    authorFullName: 'Айгулова Айгуль Айгуловна',
    validFrom: '13:00 10.09.2026',
    validTo: '18:30 10.09.2026',
    entryTime: null,
    exitTime: null,
    status: 'OnAgreementDkb',
    reasonDecline: null,
    declinedBy: null,
    cabinet: '0210',
    floor: 2,
    organization: 'ТОО «Контрагент»',
  },
  {
    id: 6,
    passNumber: 4529,
    visitorFullName: 'Мадиев Мади Мадиевич',
    iin: '870614301777',
    purposeVisit: 'Аудиторская проверка',
    inviterFullName: 'Даулетов Даулет Даулетович',
    authorFullName: 'Даулетов Даулет Даулетович',
    validFrom: '09:00 09.09.2026',
    validTo: '18:30 09.09.2026',
    entryTime: null,
    exitTime: null,
    status: 'NotUsed',
    reasonDecline: null,
    declinedBy: null,
    cabinet: '1102',
    floor: 11,
    organization: 'ТОО «Контрагент»',
  },
];

/** Журнал за день — чтобы таблица не была пустой до прохода демо-посетителя */
export const SEED_LOG: EntryLogItem[] = [
  {
    id: 'seed-1',
    passNumber: 4521,
    visitorFullName: 'Ерболов Ербол Ерболович',
    action: 'Exit',
    date: '12:40 10.09.2026',
    post: POST_NAME,
    operator: 'Асылов Асыл Асылович',
  },
  {
    id: 'seed-2',
    passNumber: 4523,
    visitorFullName: 'Санжарова Санжар Санжаровна',
    action: 'Enter',
    date: '10:05 10.09.2026',
    post: POST_NAME,
    operator: 'Асылов Асыл Асылович',
  },
  {
    id: 'seed-3',
    passNumber: 4524,
    visitorFullName: 'Кайратов Кайрат Кайратович',
    action: 'Denied',
    date: '09:52 10.09.2026',
    post: POST_NAME,
    operator: 'Асылов Асыл Асылович',
    reason: 'Лицо не совпадает с фото в пропуске',
  },
  {
    id: 'seed-4',
    passNumber: 4521,
    visitorFullName: 'Ерболов Ербол Ерболович',
    action: 'Enter',
    date: '09:14 10.09.2026',
    post: POST_NAME,
    operator: 'Асылов Асыл Асылович',
  },
  {
    id: 'seed-5',
    passNumber: 4521,
    visitorFullName: 'Ерболов Ербол Ерболович',
    action: 'CardPrint',
    date: '09:12 10.09.2026',
    post: 'Бюро пропусков',
    operator: 'Айгулова Айгуль Айгуловна',
  },
];
