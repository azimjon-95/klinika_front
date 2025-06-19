import React from "react";
import moment from "moment";
import "./style.css";

// PrintCheckList komponenti
const PrintCheckList = ({ ref, result }) => {
  console.log(result);

  // result dan ma'lumotlarni ajratib olish
  const { innerData } = result || {};
  const { results = [] } = innerData || {};

  // Tug'ilgan sanani "YYYY-MM-DD" formatidan "DD.MM.YYYY" formatiga o'zgartirish
  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return "_______________";
    return moment(dateString).format("DD.MM.YYYY");
  };

  // Bugungi sanani formatlash
  const formattedDate = formatToDDMMYYYY(moment().format("YYYY-MM-DD"));

  // Clinic ma'lumotlari (localStorage dan olinadi yoki default qiymat)
  const clinicData = {
    name: "Медицинский центр",
    address: "Тошкент шаҳри",
    phone: "+998 (90) 123-45-67"
  };

  // Analizlarni guruhlash
  const groupAnalyses = (results) => {
    const groups = {};

    // analis raqamiga qarab guruhlash
    const analysisMapping = {
      '1': 'Biokimyoviy Tahlil',
      '2': 'Umumiy Tahlil',
      '3': 'Eritrotsitlar',
      '4': 'Siydik Tahlili',
      '5': 'Chokmas Tahlili'
    };

    results.forEach(item => {
      const groupName = analysisMapping[item.analis] || 'Boshqa';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });

    return groups;
  };

  const analysisGroups = groupAnalyses(results);

  return (
    <div ref={ref} className="laboratory-report">
      {/* Header - Klinika ma'lumotlari */}
      <header className="report-header">
        <div className="clinic-info">
          <h1 className="clinic-name">{clinicData?.name}</h1>
          <p className="clinic-address">{clinicData?.address}</p>
          <p className="clinic-phone">{clinicData?.phone}</p>
        </div>
        <div className="lab-title">
          <h2>ЛАБОРАТОРИЯ</h2>
          <div className="lab-subtitle">Тиббий текширув натижалари</div>
        </div>
      </header>

      {/* Patient Information */}
      <section className="patient-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Бемор:</span>
            <span className="value">_______________</span>
          </div>
          <div className="info-item">
            <span className="label">Туғилган сана:</span>
            <span className="value">_______________</span>
          </div>
          <div className="info-item">
            <span className="label">Сана:</span>
            <span className="value">{formattedDate}</span>
          </div>
          <div className="info-item">
            <span className="label">Амбулатория №:</span>
            <span className="value">_______________</span>
          </div>
        </div>
      </section>

      {/* Doctor Information */}
      <section className="doctor-info">
        <div className="doctor-grid">
          <div className="doctor-item">
            <span className="label">Лаборант:</span>
            <span className="value">_______________</span>
          </div>
          <div className="doctor-item">
            <span className="label">Имзо:</span>
            <span className="signature-line">_______________</span>
          </div>
        </div>
      </section>

      {/* Analysis Results */}
      <main className="analysis-results">
        {Object.entries(analysisGroups || {}).map(([tabTitle, data], index) =>
          data && data.length ? (
            <div key={index} className="analysis-section">
              <h3 className="section-title">{tabTitle}</h3>

              {data.some(
                (item) =>
                  item?.name ||
                  item?.result ||
                  item?.norma ||
                  item?.siBirlik
              ) ? (
                <div className="table-container">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th className="col-number">№</th>
                        <th className="col-parameter">Параметрлар</th>
                        <th className="col-result">Натижа</th>
                        <th className="col-norm">Норма</th>
                        <th className="col-unit">Бирлик</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, inx) =>
                        item?.name ||
                          item?.result ||
                          item?.norma ||
                          item?.siBirlik ? (
                          <tr key={inx} className="result-row">
                            <td className="number">{inx + 1}</td>
                            <td className="parameter">{item?.name || "___"}</td>
                            <td className="result">
                              {item?.result || "___"}
                            </td>
                            <td className="norm">{item?.norma || "___"}</td>
                            <td className="unit">{item?.siBirlik || "___"}</td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">Маълумотлар топилмади</div>
              )}
            </div>
          ) : null
        )}
      </main>

      {/* Footer */}
      <footer className="report-footer">
        <div className="footer-info">
          <p>Натижалар фақат текширилган параметрлар учун берилган</p>
          <p className="print-date">Чоп этилган: {formattedDate}</p>
        </div>
      </footer>
    </div>
  );
}

export default PrintCheckList;