import { MOCK_PASS } from '../../data/mock';
import { usePassState } from '../../data/usePassState';
import { MOCK_VISITS, type VisitRow, type VisitStatus } from '../../data/registry';
import type { ModuleLink } from '../../components/WorkplaceLayout';

/**
 * Ряды ссылок под шапкой — массив AllLinks из enums/module-type.ts
 * основного проекта, сокращённый до экранов, которые есть в макете.
 */
export const VISITOR_LINKS: ModuleLink[] = [
  { url: '/workplace/reception', name: 'Список посетителей' },
];

/** Кабинет ДКБ живёт отдельно — из списка посетителей на него не переходят */
export const DKB_LINKS: ModuleLink[] = [
  { url: '/workplace/dkb', name: 'Согласование ДКБ' },
];

export const SECURITY_LINKS: ModuleLink[] = [
  { url: '/workplace/security', name: 'Посетители в здании' },
  { url: '/workplace/security/registry', name: 'Реестр заявок' },
  { url: '/workplace/security/journal', name: 'Журнал входов и выходов' },
];

/**
 * Цвет статуса в таблице — классы pending/valid/default-status
 * из visitors.component.scss основного проекта.
 */
export function statusClass(status: VisitStatus): string {
  switch (status) {
    case 'OnTerminal':
    case 'CardGiven':
    case 'InBuilding':
    case 'LeftFromBuilding':
      return 'valid-status';
    case 'Denied':
    case 'DeniedDkb':
    case 'DeniedDkbResponsible':
    case 'DeniedDkbAdviser':
    case 'WrongEnterExit':
      return 'default-status';
    default:
      return 'pending-status';
  }
}

/**
 * Заявки для таблиц: демо-посетитель первой строкой, дальше статичные записи.
 * Статус демо-посетителя пересчитывается из состояния прохода.
 */
export function useVisitRows(): VisitRow[] {
  const state = usePassState();

  const status: VisitStatus =
    state.decision === 'denied'
      ? 'Denied'
      : state.decision === 'allowed'
        ? state.exitDate
          ? 'LeftFromBuilding'
          : 'InBuilding'
        : state.photo
          ? 'CardGiven'
          : 'NotAgreement';

  const live: VisitRow = {
    id: 0,
    passNumber: MOCK_PASS.number,
    visitorFullName: MOCK_PASS.visitorFullName,
    iin: MOCK_PASS.iin,
    purposeVisit: MOCK_PASS.purposeVisit,
    inviterFullName: MOCK_PASS.inviterFullName,
    authorFullName: MOCK_PASS.accompanyingFullName,
    validFrom: MOCK_PASS.beginDate,
    validTo: MOCK_PASS.endDate,
    entryTime: state.decision === 'allowed' ? state.entryDate : null,
    exitTime: state.exitDate,
    status,
    reasonDecline: null,
    declinedBy: null,
    // отказ на посту пишется в отдельную колонку «Причина отклонения охраны»
    securityDeclineReason: state.declineReason,
    cabinet: MOCK_PASS.cabinet,
    floor: MOCK_PASS.floor,
    photo: state.photo,
    isBreach: state.decision === 'denied',
  };

  return [live, ...MOCK_VISITS];
}
