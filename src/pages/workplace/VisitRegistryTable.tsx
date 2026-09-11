import { Link } from 'react-router-dom';
import { Avatar, Popover, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ClockCircleOutlined,
  ControlOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { statusClass } from './shared';
import { STATUS_INFO, type VisitRow, type VisitStatus } from '../../data/registry';

/**
 * Реестр заявок — колонки один в один с боевым списком посетителей
 * (views/visitors/visitors.component.html): номер заявки, ФИО посетителя
 * с аватаром, автор заявки, цель визита, руководитель, срок действия пропуска,
 * время входа, время выхода, статус.
 *
 * Новое по требованию аналитика — последняя колонка «Причина отклонения
 * охраны»: заполняется, когда охранник не пропустил посетителя на посту
 * после сверки лица.
 *
 * Один и тот же реестр выводится и в модуле «Посетители», и у охраны.
 */
interface Props {
  rows: VisitRow[];
}

export default function VisitRegistryTable({ rows }: Props) {
  const columns: ColumnsType<VisitRow> = [
    {
      title: 'Номер заявки',
      dataIndex: 'passNumber',
      width: 90,
      render: (n: number, r) => (
        <>
          {n}
          {r.isBreach && <span className="blink-dot" />}
        </>
      ),
    },
    {
      title: 'ФИО Посетителя',
      key: 'fio',
      width: 235,
      render: (_, r) => (
        <Popover
          placement="right"
          title={r.visitorFullName.toUpperCase()}
          content={
            <div style={{ width: 220 }}>
              {r.photo ? (
                <img src={r.photo} alt="" style={{ width: 200 }} />
              ) : (
                <span className="dash">Фото не загружено</span>
              )}
            </div>
          }
        >
          <div className="avatar-cell">
            {r.photo ? (
              <Avatar src={r.photo} />
            ) : (
              <Avatar style={{ backgroundColor: '#BB6BD9' }}>
                {r.visitorFullName
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </Avatar>
            )}
            {r.visitorFullName.toUpperCase()}
          </div>
        </Popover>
      ),
    },
    { title: 'Автор заявки', dataIndex: 'authorFullName', width: 195 },
    { title: 'Цель визита', dataIndex: 'purposeVisit', width: 185 },
    { title: 'Руководитель', dataIndex: 'inviterFullName', width: 195 },
    {
      title: 'Срок действия пропуска',
      key: 'valid',
      width: 175,
      render: (_, r) => `${r.validFrom} - ${r.validTo}`,
    },
    {
      title: 'Время входа',
      dataIndex: 'entryTime',
      width: 95,
      render: (v: string | null) => v?.slice(0, 5) ?? <span className="dash">—</span>,
    },
    {
      title: 'Время выхода',
      dataIndex: 'exitTime',
      width: 100,
      render: (v: string | null) => v?.slice(0, 5) ?? <span className="dash">—</span>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 135,
      render: (s: VisitStatus) => <span className={statusClass(s)}>{STATUS_INFO[s].label}</span>,
    },
    {
      title: 'Причина отклонения охраны',
      dataIndex: 'securityDeclineReason',
      width: 230,
      render: (reason: string | null | undefined) =>
        reason ? (
          <span className="reason-cell">{reason}</span>
        ) : (
          <span className="dash">—</span>
        ),
    },
    {
      title: '',
      key: 'actions',
      width: 30,
      fixed: 'right',
      render: () => (
        <Popover
          placement="left"
          trigger="click"
          content={
            <div className="buttons">
              <Tooltip title="Редактировать" placement="left">
                <a>
                  <EditOutlined />
                </a>
              </Tooltip>
              <Tooltip title="Просмотр" placement="left">
                <a>
                  <EyeOutlined />
                </a>
              </Tooltip>
              <Tooltip title="Аннулировать" placement="left">
                <a>
                  <DeleteOutlined style={{ color: 'red' }} />
                </a>
              </Tooltip>
              <Tooltip title="История входов" placement="left">
                <Link to="/workplace/security/journal">
                  <ClockCircleOutlined />
                </Link>
              </Tooltip>
            </div>
          }
        >
          <ControlOutlined className="additionalButtons" />
        </Popover>
      ),
    },
  ];

  return (
    <Table
      className="kmg-table"
      rowKey="id"
      columns={columns}
      dataSource={rows}
      pagination={{ pageSize: 10, size: 'small' }}
      scroll={{ x: 1770 }}
      rowClassName={(r) => (r.id === 0 ? 'row--live' : '')}
    />
  );
}
