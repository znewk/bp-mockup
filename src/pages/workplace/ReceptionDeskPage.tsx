import { Button, DatePicker, Input, Select } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import VisitRegistryTable from './VisitRegistryTable';
import { VISITOR_LINKS, useVisitRows } from './shared';
import { STATUS_INFO, type VisitStatus } from '../../data/registry';
import infoIcon from '../../assets/img/info.png';

/**
 * Модуль «Посетители», список заявок — перенос
 * views/visitors/visitors.component.html основного проекта: панель поиска
 * с фильтрами, жёлтый баннер с инструкцией и реестр заявок.
 */
export default function ReceptionDeskPage() {
  const rows = useVisitRows();

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

      <VisitRegistryTable rows={rows} />
    </WorkplaceLayout>
  );
}
