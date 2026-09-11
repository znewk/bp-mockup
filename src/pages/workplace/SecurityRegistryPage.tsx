import { DatePicker, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import VisitRegistryTable from './VisitRegistryTable';
import { SECURITY_LINKS, useVisitRows } from './shared';
import { STATUS_INFO, type VisitStatus } from '../../data/registry';

/**
 * Реестр заявок в модуле «Охрана». Таблица та же, что в модуле «Посетители» —
 * охрана видит тот же список с теми же колонками, включая причину, по которой
 * посетителя не пропустили на посту. Отличается только набор фильтров:
 * кнопки создания заявки у охраны нет.
 */
export default function SecurityRegistryPage() {
  const rows = useVisitRows();

  return (
    <WorkplaceLayout
      role="security"
      moduleName="Охрана"
      activeMenu="security"
      links={SECURITY_LINKS}
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
          <DatePicker placeholder="Дата входа" />
          <DatePicker placeholder="Дата выхода" />
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
        </div>
      </div>

      <VisitRegistryTable rows={rows} />
    </WorkplaceLayout>
  );
}
