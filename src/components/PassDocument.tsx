import { QRCodeCanvas } from 'qrcode.react';
import { Button, Empty, Image } from 'antd';
import { CameraOutlined, RetweetOutlined } from '@ant-design/icons';
import type { PassDto } from '../data/mock';
import logoKmg from '../assets/img/logo-kmg.png';
import './PassDocument.css';

export type PassMode = 'visitor' | 'guard';

interface Props {
  pass: PassDto;
  mode: PassMode;
  /** Селфи посетителя */
  photo: string | null;
  /** Скан удостоверения — показывается только охраннику */
  documentScan?: string | null;
  /** Время входа — появляется после сканирования QR охранником */
  entryDate?: string | null;
  /** Ссылка, зашитая в QR (страница охранника) */
  qrValue?: string;
  onCapture?: () => void;
}

/**
 * Тело электронного пропуска. Порядок и состав полей повторяют печатную
 * форму основного проекта (views/terminal/print-terminal).
 */
export default function PassDocument({
  pass,
  mode,
  photo,
  documentScan,
  entryDate,
  qrValue,
  onCapture,
}: Props) {
  const isGuard = mode === 'guard';

  return (
    <div className="pass">
      <img className="pass__logo" src={logoKmg} alt="КазМунайГаз" />

      <h4 className="pass__title">ПРОПУСК № {pass.number}</h4>

      {/* --- Фото: у посетителя одно, у охранника рядом со сканом документа --- */}
      <div className={`pass__photos ${isGuard ? 'pass__photos--two' : ''}`}>
        <figure className="pass__photo">
          {photo ? (
            <Image src={photo} alt="Фото посетителя" preview={isGuard} />
          ) : (
            <div className="pass__photo-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={isGuard ? 'Посетитель ещё не сделал фото' : 'Фото не сделано'}
              />
            </div>
          )}
          {isGuard && <figcaption>Фото посетителя</figcaption>}
        </figure>

        {isGuard && (
          <figure className="pass__photo">
            {documentScan ? (
              <Image src={documentScan} alt="Скан удостоверения личности" preview={isGuard} />
            ) : (
              <div className="pass__photo-empty">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет скана" />
              </div>
            )}
            <figcaption>Скан удостоверения</figcaption>
          </figure>
        )}
      </div>

      {/* --- Кнопка съёмки: только на странице посетителя --- */}
      {!isGuard && onCapture && (
        <Button
          block
          size="large"
          type={photo ? 'default' : 'primary'}
          icon={photo ? <RetweetOutlined /> : <CameraOutlined />}
          className="pass__capture-btn"
          onClick={onCapture}
        >
          {photo ? 'Переснять' : 'Снять на фото'}
        </Button>
      )}

      {/* --- Реквизиты --- */}
      <table className="pass__fields">
        <tbody>
          <tr>
            <td className="pass__label">ФИО</td>
            <td className="pass__value">{pass.visitorFullName}</td>
          </tr>
          <tr>
            <td className="pass__label">Пол</td>
            <td className="pass__value">{pass.sex}</td>
          </tr>
          <tr>
            <td className="pass__label">Цель визита</td>
            <td className="pass__value">{pass.purposeVisit}</td>
          </tr>
        </tbody>
      </table>

      <p className="pass__center">
        {pass.organization} Разрешение на <b>{pass.type}</b>
      </p>
      <p className="pass__center">№{pass.cabinet} каб.</p>
      <p className="pass__center">
        К кому <b>{pass.inviterFullName}</b>
      </p>

      {isGuard && entryDate && (
        <p className="pass__center pass__center--accent">Время входа: {entryDate}</p>
      )}

      <p className="pass__center">
        Срок действия: {pass.beginDate} — {pass.endDate}
      </p>

      <p className="pass__center">
        Ответственный сотрудник <b>{pass.accompanyingFullName}</b>
      </p>

      {/* --- Материальные ценности --- */}
      {pass.materials.length > 0 && (
        <table className="pass__materials">
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Серийный номер</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {pass.materials.map((m) => (
              <tr key={m.serialNumber}>
                <td>{m.technicName}</td>
                <td>{m.serialNumber}</td>
                <td>{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="pass__center">{pass.type}</p>

      {/* --- QR: сканирует охранник на посту --- */}
      {!isGuard && (
        <div className="pass__qr">
          <QRCodeCanvas value={qrValue ?? String(pass.number)} size={190} level="M" marginSize={2} />
          <div className="pass__qr-hint">Покажите QR охраннику на посту</div>
        </div>
      )}
    </div>
  );
}
