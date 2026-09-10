import { DatePicker, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import { SECURITY_LINKS } from './shared';
import { usePassState } from '../../data/usePassState';
import type { EntryLogItem } from '../../data/mock';
import { ACTION_INFO, POST_NAME, SEED_LOG } from '../../data/registry';

/**
 * Журнал входов и выходов. Основа — views/visitors/components/entry-history
 * основного проекта (колонки «Дата» и «Тип действия», EntryTypeEnum).
 * Для журнала поста добавлены пропуск, посетитель, причина отклонения,
 * пост и оператор.
 */
export default function SecurityJournalPage() {
  const state = usePassState();
  const log: EntryLogItem[] = [...state.log, ...SEED_LOG];

  const columns: ColumnsType<EntryLogItem> = [
    { title: 'Дата', dataIndex: 'date', width: 150 },
    { title: '№ заявки', dataIndex: 'passNumber', width: 95 },
    { title: 'ФИО', dataIndex: 'visitorFullName', width: 240 },
    {
      title: 'Тип действия',
      dataIndex: 'action',
      width: 150,
      render: (a: EntryLogItem['action']) => {
        const info = ACTION_INFO[a];
        const cls =
          a === 'Denied' ? 'default-status' : a === 'Enter' ? 'valid-status' : 'pending-status';
        return <span className={cls}>{info.label}</span>;
      },
    },
    {
      title: 'Причина отклонения',
      dataIndex: 'reason',
      width: 260,
      render: (reason?: string) =>
        reason ? <span className="reason-cell">{reason}</span> : <span className="dash">—</span>,
    },
    { title: 'Пост', dataIndex: 'post', width: 180 },
    { title: 'Ответственный сотрудник', dataIndex: 'operator', width: 220 },
  ];

  return (
    <WorkplaceLayout
      role="security"
      moduleName="Охрана"
      activeMenu="security"
      links={SECURITY_LINKS}
    >
      <div className="filter sec-filter">
        <Input placeholder="Поиск" suffix={<SearchOutlined />} />
        <Select
          className="narrow"
          allowClear
          showSearch={false}
          suffixIcon={null}
          placeholder="Тип действия"
          options={(Object.keys(ACTION_INFO) as EntryLogItem['action'][]).map((a) => ({
            value: a,
            label: ACTION_INFO[a].label,
          }))}
        />
        <DatePicker placeholder="Дата" />
        <Select
          className="narrow"
          allowClear
          showSearch={false}
          suffixIcon={null}
          placeholder="Пост"
          options={[
            { value: 'post1', label: POST_NAME },
            { value: 'reception', label: 'Бюро пропусков' },
          ]}
        />
      </div>

      <Table
        className="kmg-table"
        rowKey="id"
        columns={columns}
        dataSource={log}
        pagination={{ pageSize: 10, size: 'small' }}
        scroll={{ x: 1300 }}
      />
    </WorkplaceLayout>
  );
}
