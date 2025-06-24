import React from "react";
import { useGetClinicsQuery } from "../../context/clinicApi";
import { useGetDoctorByIdQuery } from "../../context/doctorApi";
import { PhoneNumberFormat } from "../../hook/NumberFormat";
import Logo from "./Logo.jpg";
import "./style.css";
import moment from "moment";

function RecordList({ componentRef, records, selectedPatient, data }) {
  const patcent = records?.patientId || {};

  const { data: clinicData } = useGetClinicsQuery();
  const clinic = clinicData?.innerData || {};

  const workerId = localStorage.getItem("workerId");
  const { data: doctor } = useGetDoctorByIdQuery(workerId, {
    skip: !workerId,
  });

  // Format date
  // const formattedDate = patcent?.date
  //   ? new Date(patcent.date)
  //       .toLocaleDateString("en-GB", {
  //         year: "numeric",
  //         month: "2-digit",
  //         day: "2-digit",
  //       })
  //       .split("/")
  //       .join(".")
  //   : "Invalid date";

  // Handle recommendations: Ensure it's an array for rendering
  const recommendations = Array.isArray(patcent?.retsept?.recommendations)
    ? patcent?.retsept?.recommendations
    : typeof patcent?.retsept?.recommendations === "string"
      ? patcent?.retsept?.recommendations
        .split("\n")
        .filter((item) => item.trim())
      : [];

  // Handle prescriptions: Split by number or newline for proper formatting
  const prescriptions = data?.prescription
    ? data?.prescription.split(/(?=\d+\.\s)/).filter((item) => item.trim())
    : [];

  return (
    <div ref={componentRef} className="prescription-document-masterpiece">
      {/* Decorative corner elements */}
      <div className="ornamental-corner-topleft"></div>
      <div className="ornamental-corner-topright"></div>
      <div className="ornamental-corner-bottomleft"></div>
      <div className="ornamental-corner-bottomright"></div>

      {/* Background watermark */}
      <div className="watermark-medical-backdrop">
        <img src={Logo} alt="Watermark Logo" />
      </div>

      {/* Header Section */}
      <div className="header-institutional-prestigious">
        <div className="ministry-information-left">
          <div className="government-seal-container">
            <div className="uzbekistan-emblem-stylized">🇺🇿</div>
          </div>
          <div className="official-text-hierarchy">
            <p className="republic-title-primary">Ўзбекиcтон Республикаси</p>
            <p className="ministry-title-secondary">
              Соғлиқни Сақлаш Вазирлиги
            </p>
            <p className="regional-title-tertiary">Наманган вилояти Соғлиқни</p>
            <p className="department-title-quaternary">сақлаш Бошқармаси</p>
          </div>
        </div>

        <div className="central-logo-magnificent">
          <img height={100} src={Logo} alt="Clinic Logo" />
        </div>

        <div className="clinic-information-right">
          <div className="address-contact-wrapper">
            <div className="clinic-address-formatted">
              <p className="address-text-professional">
                <span className="location-marker">📍</span>
                {clinic?.address || "Address not available"}
                <br />"{clinic?.address || "N/A"}" Мед Центр мчж га
                <br />
                қарашли даволаш маскани
              </p>
            </div>
            <div className="contact-phone-styled">
              <span className="phone-icon">📞</span>
              <p className="phone-number-formatted">
                +998 {PhoneNumberFormat(clinic?.phone) || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Recommendations Section */}
      <div className="medical-recommendations-detailed">
        <h2 className="section-title-prominent">Tashxis va davolash</h2>
        <div className="prescription-lines-containerone">
          <p className="section-title-pashxis">
            {data?.diagnosis || "Tashxis topilmadi"}
          </p>
        </div>

        <h2 className="section-title-prominent">
          Retsept va dori-darmonlar 💊
        </h2>
        <div className="prescription-lines-container">
          <div className="instruction-text-content">
            {/* <p className="recommendation-text-styled">
              {data?.prescription || "topilmadi"}
            </p> */}
            {/* {prescriptions.length > 0 ? ( */}
            {prescriptions.map((line, index) => (
              <p key={index} className="recommendation-text-styled">
                {line.trim()}
              </p>
            ))}
            {/* ) : (1 */}
            {/* <p className="recommendation-text-styled"> */}
            {/* No prescriptions available */}
            {/* </p> */}
            {/* )} */}
          </div>
        </div>

        <h2 className="section-title-prominent">Tavsiylar</h2>
        <div className="prescription-lines-containerone">
          <p className="section-title-pashxis">
            {data?.recommendations || "Tavsiya topilmadi"}
          </p>
        </div>
      </div>

      {/* Patient Data Section */}
      <div className="patient-data-comprehensive">
        <div className="information-grid-sophisticated">
          <div className="data-field-container">
            <span className="field-label-professional">Бемор:</span>
            <div className="field-value-underlined">
              {selectedPatient?.patientId?.name || "N/A"}
            </div>
          </div>
          <div className="data-field-container">
            <span className="field-label-professional">Yoshi:</span>
            <div className="field-value-underlined">
              {selectedPatient?.patientId?.age || "N/A"}
            </div>
          </div>
          <div className="data-field-container">
            <span className="field-label-professional">Сана:</span>
            <div className="field-value-underlined">
              {moment().format("YYYY-MM-DD")}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Information Footer */}
      <div className="physician-signature-section">
        <div className="doctor-credentials-left">
          <div className="doctor-info-card">
            <div className="doctor-avatar-placeholder">👨‍⚕️</div>
            <div className="doctor-details-formatted">
              <p className="doctor-specialization">
                {doctor?.innerData?.specialization ||
                  "Specialization not available"}{" "}
                shifokori
              </p>
              <p className="doctor-name-prominent">
                {`${doctor?.innerData?.firstName || ""} ${doctor?.innerData?.lastName || ""
                  }`.trim() || "N/A"}
              </p>
              <p className="doctor-contact-info">
                📱 +998 {PhoneNumberFormat(doctor?.innerData?.phone) || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="signature-space-right">
          <div className="signature-line-elegant">
            <div className="signature-placeholder-line"></div>
            <p className="signature-label">Шифокор имзоси:</p>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="prescription-footer-notice">
        <p className="validity-notice">
          ⚠️ Ушбу рецепт 30 кун муддатга амал қилади
        </p>
      </div>
    </div>
  );
}

export default RecordList;
