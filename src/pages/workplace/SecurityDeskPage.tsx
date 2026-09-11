import { Button, Card, Col, Input, Row, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import WorkplaceLayout from '../../components/WorkplaceLayout';
import { SECURITY_LINKS, statusClass, useVisitRows } from './shared';
import {
  MOCK_PASS,
  addLogEntry,
  formatEntryTime,
  writeState,
} from '../../data/mock';
import { POST_NAME, ROLES, STATUS_INFO, type VisitRow } from '../../data/registry';
import './SecurityDeskPage.css';

/**
 * Модуль «Охрана», вкладка «Посетители в здании» — перенос
 * views/security/security.component.html основного проекта: фильтр из поиска
 * и двух селектов, посетители карточками nz-card по три в ряд (nzSpan=8)
 * с фото слева и реквизитами справа.
 */
export default function SecurityDeskPage() {
  const rows = useVisitRows();

  // На экране охраны показываются активные пропуска текущего дня
  const list = rows.filter(
    (r) => r.status === 'InBuilding' || r.status === 'CardGiven' || r.status === 'LeftFromBuilding',
  );

  const registerExit = (row: VisitRow) => {
    const time = formatEntryTime();
    writeState({ exitDate: time });
    addLogEntry({
      passNumber: MOCK_PASS.number,
      visitorFullName: MOCK_PASS.visitorFullName,
      action: 'Exit',
      post: POST_NAME,
      operator: ROLES.security.user,
      date: time,
    });
    void row;
  };

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
      </div>

      <Row>
        {list.map((item) => (
          <Col span={8} key={item.id} style={{ position: 'relative' }}>
            <Card
              className="sec-card"
              styles={{ body: { padding: 10 } }}
              title={
                <>
                  <p style={{ margin: 0 }}>Посетитель: {item.visitorFullName.toUpperCase()}</p>
                  <span>
                    ИИН: <b>{item.iin}</b>
                  </span>
                </>
              }
            >
              <Row>
                <Col span={10} style={{ textAlign: 'center' }}>
                  {item.photo ? (
                    <img src={item.photo} className="photoPath" alt="" />
                  ) : (
                    <div className="photoPath photoPath--empty">Нет фото</div>
                  )}
                </Col>
                <Col span={14}>
                  <div style={{ padding: '0 0 0 15px' }}>
                    <div>
                      Время входа: <label>{item.entryTime?.slice(0, 5) ?? '—'}</label>
                    </div>
                    <div>
                      Время выхода: <label>{item.exitTime?.slice(0, 5) ?? '—'}</label>
                    </div>
                    <div>
                      К кому: <label>{item.inviterFullName}</label>
                    </div>
                    {item.organization && (
                      <div>
                        <label>{item.organization}</label>
                      </div>
                    )}
                    <div>
                      Этаж: <label>{item.floor}</label>
                    </div>
                    <div>
                      Кабинет: <label>{item.cabinet}</label>
                    </div>
                    <div>Цель визита:</div>
                    <div>
                      <label>{item.purposeVisit}</label>
                    </div>
                    <div>
                      Статус:{' '}
                      <label className={statusClass(item.status)}>
                        {STATUS_INFO[item.status].label}
                      </label>
                    </div>

                    {item.id === 0 && item.status === 'InBuilding' && (
                      <Button size="small" className="sec-exit" onClick={() => registerExit(item)}>
                        Отметить выход
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {list.length === 0 && <div className="sec-empty">Активных пропусков нет</div>}
    </WorkplaceLayout>
  );
}
