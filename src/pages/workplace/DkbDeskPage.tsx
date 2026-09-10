import { useState } from 'react';
import { App as AntApp, Avatar, Input, Modal, Popconfirm, Select, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ControlOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import { VISITOR_LINKS, statusClass, useVisitRows } from './shared';
import {
  DECLINE_REASONS,
  ROLES,
  STATUS_INFO,
  type VisitRow,
  type VisitStatus,
} from '../../data/registry';

/**
 * Согласование заявок в модуле «Посетители». Кнопки согласования и модалка
 * отказа повторяют visitors.component.html основного проекта:
 * иконки check-circle / close-circle в первой колонке, модалка «Отклонение»
 * с полем «Причина отклонения» (reasonDecline).
 */
export default function DkbDeskPage() {
  const { message } = AntApp.useApp();
  const baseRows = useVisitRows();

  // Локальные решения ДКБ поверх исходных строк
  const [decisions, setDecisions] = useState<
    Record<number, { status: VisitStatus; reasonDecline: string | null; declinedBy: string | null }>
  >({});
  const [declining, setDeclining] = useState<VisitRow | null>(null);
  const [reason, setReason] = useState<string>(DECLINE_REASONS[0]);
  const [comment, setComment] = useState('');

  const rows = baseRows.map((r) => (decisions[r.id] ? { ...r, ...decisions[r.id] } : r));

  const canApprove = (r: VisitRow) =>
    r.status === 'OnAgreement' || r.status === 'OnAgreementDkb';

  const approve = (row: VisitRow) => {
    setDecisions((p) => ({
      ...p,
      [row.id]: { status: 'CardGiven', reasonDecline: null, declinedBy: null },
    }));
    void message.success(`Заявка № ${row.passNumber} согласована`);
  };

  const confirmDecline = () => {
    if (!declining) return;
    const full = reason === 'Иная причина' && comment.trim() ? comment.trim() : reason;
    setDecisions((p) => ({
      ...p,
      [declining.id]: {
        status: 'DeniedDkb',
        reasonDecline: full,
        declinedBy: `${ROLES.dkb.user} (ДКБ)`,
      },
    }));
    void message.error(`Заявка № ${declining.passNumber} отклонена`);
    setDeclining(null);
    setComment('');
    setReason(DECLINE_REASONS[0]);
  };

  const columns: ColumnsType<VisitRow> = [
    {
      title: '',
      key: 'approve',
      width: 90,
      render: (_, r) =>
        canApprove(r) ? (
          <span className="approveButtons">
            <Popconfirm
              title="Согласовать"
              okText="Да"
              cancelText="Добавить комментарий"
              onConfirm={() => approve(r)}
            >
              <Tooltip title="Согласовать">
                <a>
                  <CheckCircleOutlined className="approve-icon" />
                </a>
              </Tooltip>
            </Popconfirm>
            <Tooltip title="Отклонить">
              <a onClick={() => setDeclining(r)}>
                <CloseCircleOutlined className="refuse-icon" />
              </a>
            </Tooltip>
          </span>
        ) : null,
    },
    { title: '№ заявки', dataIndex: 'passNumber', width: 90 },
    {
      title: 'ФИО',
      key: 'fio',
      width: 240,
      render: (_, r) => (
        <div className="avatar-cell">
          {r.photo ? (
            <Avatar src={r.photo} size="large" />
          ) : (
            <Avatar size="large" style={{ backgroundColor: '#BB6BD9' }}>
              {r.visitorFullName
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </Avatar>
          )}
          {r.visitorFullName.toUpperCase()}
        </div>
      ),
    },
    { title: 'Автор заявки', dataIndex: 'authorFullName', width: 200 },
    { title: 'Цель визита', dataIndex: 'purposeVisit', width: 175 },
    { title: 'К кому', dataIndex: 'inviterFullName', width: 200 },
    {
      title: 'Срок действия',
      key: 'valid',
      width: 165,
      render: (_, r) => `${r.validFrom} - ${r.validTo}`,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 150,
      render: (s: VisitStatus) => <span className={statusClass(s)}>{STATUS_INFO[s].label}</span>,
    },
    {
      title: 'Причина отклонения',
      key: 'reason',
      width: 215,
      render: (_, r) =>
        r.reasonDecline ? (
          <span className="reason-cell">
            {r.reasonDecline}
            {r.declinedBy && <small>{r.declinedBy}</small>}
          </span>
        ) : (
          <span className="dash">—</span>
        ),
    },
    {
      title: '',
      key: 'actions',
      width: 30,
      render: () => <ControlOutlined className="additionalButtons" />,
    },
  ];

  return (
    <WorkplaceLayout
      role="dkb"
      moduleName="Посетители"
      activeMenu="visitor"
      links={VISITOR_LINKS}
    >
      <div className="search-box">
        <div className="filter">
          <Input placeholder="Поиск" suffix={<SearchOutlined />} />
          <Select
            mode="multiple"
            maxTagCount={0}
            allowClear
            showSearch={false}
            suffixIcon={null}
            placeholder="Статус заявки"
            options={(Object.keys(STATUS_INFO) as VisitStatus[]).map((s) => ({
              value: s,
              label: STATUS_INFO[s].label,
            }))}
          />
        </div>
      </div>

      <Table
        className="kmg-table"
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 10, size: 'small' }}
        scroll={{ x: 1600 }}
      />

      {/* Модалка отказа — nz-modal с reasonDeclineTemplate основного проекта */}
      <Modal
        open={declining !== null}
        title="Отклонение"
        okText="Отказать"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        onOk={confirmDecline}
        onCancel={() => setDeclining(null)}
      >
        <p style={{ marginBottom: 3 }}>Причина отклонения</p>
        <Select
          style={{ width: '100%' }}
          value={reason}
          onChange={setReason}
          options={DECLINE_REASONS.map((r) => ({ value: r, label: r }))}
        />
        <p style={{ margin: '14px 0 3px' }}>Комментарий</p>
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Напишите причину — текст уходит в письмо посетителю"
        />
      </Modal>
    </WorkplaceLayout>
  );
}
