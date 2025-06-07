import React from 'react';
import { useGetClinicsQuery } from '../../../context/clinicApi';
import './style.css';

// Utility function to format currency
const formatCurrency = (amount, locale = 'uz-UZ', currency = 'UZS') =>
  Number(amount)?.toLocaleString(locale, { style: 'currency', currency }) || "0 so'm";

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Utility function to get current time in Uzbekistan (UZT, UTC+5)
const getCurrentUzbekistanTime = () =>
  new Date().toLocaleTimeString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

// Utility function to safely access nested properties
const getSafe = (obj, path, defaultValue = 'N/A') =>
  path.reduce((xs, x) => (xs && xs[x] !== undefined ? xs[x] : defaultValue), obj);

function ModelCheck({ contentRef, data: story }) {
  const { data: clinics } = useGetClinicsQuery();

  // Fallback clinic info with safe access
  const clinicInfo = {
    name: getSafe(clinics, ['innerData', 'clinicName'], 'Unknown Clinic'),
    address: getSafe(clinics, ['innerData', 'address'], 'N/A'),
    contacts: getSafe(clinics, ['innerData', 'phone'], ['N/A']),
    time: `${getSafe(clinics, ['innerData', 'startTime'], 'N/A')} - ${getSafe(clinics, ['innerData', 'endTime'], 'N/A')}`,
  };

  // Get current time in Uzbekistan
  const currentTime = getCurrentUzbekistanTime();

  return (
    <div ref={contentRef} className="receipt-container-component">
      <div className="header-information-section">
        <h1 className="clinic-name-title">{clinicInfo.name}</h1>
        <p className="subtitle-description-text">Shifoxona markazi</p>
        <p className="bold-subtitle-emphasis-text">Har doim siz bilan!</p>
      </div>

      {/* Contact Info */}
      <div className="contact-details-section">
        <div className="contact-information-block">
          <strong>Manzil:</strong><br />{clinicInfo.address}
        </div>
        <div className="contact-information-block">
          <strong>Tel:</strong> {clinicInfo.contacts}
        </div>
        <div className="contact-information-block">
          <strong>Qabul vaqti:</strong><br />{clinicInfo.time}
        </div>
      </div>

      {/* Patient & Service Details */}
      <div className="patient-service-details-section">
        <div className="information-row-container">
          <span className="information-label-text">Mutaxassis:</span>
          <span className="information-value-text">{story?.doctor.specialization}</span>
        </div>
        <div className="information-row-container">
          <span className="information-label-text">Doktor:</span>
          <span className="information-value-text">{story?.doctor.firstname} {story?.doctor.lastname}</span>
        </div>
        <div className="information-row-container">
          <span className="information-label-text">Telefon:</span>
          <span className="information-value-text">{story?.doctor?.phone}</span>
        </div>
        <br />
        <div className="information-row-container">
          <span className="information-label-text">Bemor:</span>
          <span className="information-value-text">{story?.patient.firstname} {story?.patient.lastname}</span>
        </div>
        <div className="information-row-container">
          <span className="information-label-text">Sana/Vaqt:</span>
          <span className="information-value-text">{formatDate(story?.doctor.createdAt)} {currentTime}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="payment-information-section">
        <div className="information-row-container">
          <span className="information-label-text">Qabul narxi:</span>
          <span className="information-value-text">{formatCurrency(story?.doctor.admission_price)}</span>
        </div>
        <div className="total-amount-row">
          <span>JAMI:</span>
          <span>{formatCurrency(story?.doctor.admission_price)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-content-section">
        <div className="order-number-display">{story?.patient?.order_number}</div>
        <div className="footer-message-text"><strong>Sizning navbatingiz!</strong></div>
        <div className="footer-message-text">Rahmat! Sog'lik sizga!</div>
      </div>
    </div>
  );
}

export default ModelCheck;