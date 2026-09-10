import { Link } from 'react-router-dom';
import { Avatar, Button, DatePicker, Input, Popover, Select, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ClockCircleOutlined,
  ControlOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import { VISITOR_LINKS, statusClass, useVisitRows } from './shared';
import { STATUS_INFO, type VisitRow, type VisitStatus } from '../../data/registry';
import infoIcon from '../../assets/img/info.png';

/**
 * Модуль «Посетители», список заявок — перенос views/visitors/visitors.component.html
 * основного проекта: панель поиска с фильтрами, жёлтый баннер с инструкцией
 * и таблица с теми же колонками (№ заявки, ФИО с аватаром, автор, цель визита,
 * к кому, срок действия, вход, выход, статус).
 * Добавлена колонка «Причина отклонения» — поле reasonDecline.
 */
export default function ReceptionDeskPage() {
  const rows = useVisitRows();

  const columns: ColumnsType<VisitRow> = [
    {
      title: '№ заявки',
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
      title: 'ФИО',
      key: 'fio',
      width: 240,
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
        </Popover>
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
      title: 'Вход',
      dataIndex: 'entryTime',
      width: 75,
      render: (v: string | null) => v?.slice(0, 5) ?? <span className="dash">—</span>,
    },
    {
      title: 'Выход',
      dataIndex: 'exitTime',
      width: 75,
      render: (v: string | null) => v?.slice(0, 5) ?? <span className="dash">—</span>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 150,
      render: (s: VisitStatus) => (
        <span className={statusClass(s)}>{STATUS_INFO[s].label}</span>
      ),
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
    <WorkplaceLayout
      role="reception"
      moduleName="Посетители"
      activeMenu="visitor"
      links={VISITOR_LINKS}
    >
      <div className="search-box">
        <button className="add-user-button">Добавить посетителя</button>

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
          <DatePicker placeholder="Дата входа" />
          <DatePicker placeholder="Дата выхода" />
          <Select
            id="residentStatus"
            className="narrow"
            allowClear
            showSearch={false}
            suffixIcon={null}
            placeholder="Резидентство"
            options={[
              { value: 'Resident', label: 'Резидент' },
              { value: 'NotResident', label: 'Нерезидент' },
            ]}
          />
          <Select
            className="narrow"
            allowClear
            showSearch={false}
            suffixIcon={null}
            placeholder="Тип пропуска"
            options={[
              { value: 'One', label: 'Одноразовый' },
              { value: 'Time', label: 'Временный' },
            ]}
          />
          <Button className="btn-add" shape="circle" icon={<DownloadOutlined />} />
        </div>
      </div>

      <div className="update-banner">
        <img src={infoIcon} alt="info" className="update-icon" />
        <p className="update-text">
          Обновлён порядок оформления пропусков: посетитель сам загружает фото в электронном
          пропуске.{' '}
          <a className="update-link" href="#" onClick={(e) => e.preventDefault()}>
            Инструкция пользователя
          </a>
          .
        </p>
      </div>

      <Table
        className="kmg-table"
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 10, size: 'small' }}
        scroll={{ x: 1700 }}
        rowClassName={(r) => (r.id === 0 ? 'row--live' : '')}
      />
    </WorkplaceLayout>
  );
}
