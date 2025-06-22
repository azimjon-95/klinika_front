import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
  Heart,
  Activity,
  HeartPulse,
  Thermometer,
  Weight,
  Bed,
  ChevronDown,
  ChevronUp,
  Pill,
  FileImage,
  ArrowLeft,
  Download,
  TestTube,
  Calendar as CalendarIcon,
  Eye,
} from "lucide-react";
import moment from "moment";

const PatientDetailsView = ({ patient, setSelectedPatient }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedStories, setExpandedStories] = useState({});
  console.log(expandedStories);
  const tabs = [
    { id: "overview", label: "Umumiy ma'lumot", icon: User },
    { id: "visits", label: "Tashriflar", icon: Calendar },
    { id: "prescriptions", label: "Retseptlar", icon: Pill },
    { id: "lab-results", label: "Laboratoriya", icon: TestTube },
    { id: "files", label: "Hujjatlar", icon: FileImage },
    { id: "ward-history", label: "Statsionar", icon: Bed },
  ];

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";

  const getPatientAge = (year) => new Date().getFullYear() - parseInt(year);

  const getStatusColor = (status) =>
    ({
      normal: "#22c55e",
      high: "#ef4444",
      low: "#f59e0b",
    }[status] || "#6b7280");

  const toggleStory = (id) =>
    setExpandedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  // File handling functions
  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.toLowerCase().split(".").pop();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "document";
    if (["txt"].includes(ext)) return "text";
    return "unknown";
  };
  const getFileIcon = (filename) => {
    const type = getFileType(filename);
    switch (type) {
      case "image":
        return <ImageIcon size={24} />;
      case "pdf":
        return <FileText size={24} />;
      case "document":
        return <FileText size={24} />;
      case "text":
        return <FileText size={24} />;
      default:
        return <File size={24} />;
    }
  };
  const handleViewFile = (file, storyId) => {
    // Create a mock file object with sample data
    const mockFile = {
      ...file,
      name: `Document_${file._id}.pdf`,
      type: "application/pdf",
      size: "2.3 MB",
      uploadDate: new Date().toISOString(),
      doctorId: storyId,
      // Mock file content - in real app this would come from API
      content:
        "data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgNCAwIFIKL091dGxpbmVzIDMgMCBSCi9QYWdlTW9kZSAvVXNlTm9uZQo+PgplbmRvYmoK...",
    };

    setSelectedFile(mockFile);
    setShowFileViewer(true);
  };

  const handleDownloadFile = (file, storyId) => {
    // Create a blob with sample content
    const sampleContent = `Medical Document
Patient: ${patient.firstname} ${patient.lastname}
Document ID: ${file._id}
Doctor ID: ${storyId}
Date: ${new Date().toLocaleDateString()}

This is a sample medical document content.
In a real application, this would contain the actual file data.`;

    const blob = new Blob([sampleContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Document_${file._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const closeFileViewer = () => {
    setShowFileViewer(false);
    setSelectedFile(null);
  };

  const renderVitalCard = (icon, value, label) => (
    <div className="vital-card">
      {icon}
      <div>
        <span className="vital-value">{value || "N/A"}</span>
        <span className="vital-label">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="patient-details">
      <div className="patient-details-header">
        <button
          onClick={() => setSelectedPatient(null)}
          className="back-button"
        >
          <ArrowLeft size={20} /> Orqaga
        </button>
        <div className="patient-title">
          <div className="patient-avatar-large">
            <User size={32} />
          </div>
          <div>
            <h2>
              {patient.firstname} {patient.lastname}
            </h2>
            <p>
              ID: {patient.idNumber} • {getPatientAge(patient.year)} yosh
            </p>
          </div>
        </div>
        <div className="vital-signs-quick">
          <div className="vital-item">
            <HeartPulse size={16} />
            <span>{patient.vitalSigns?.heartRate || "N/A"} BPM</span>
          </div>
          <div className="vital-item">
            <Activity size={16} />
            <span>{patient.vitalSigns?.bloodPressure || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="tabs-navigation">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`tab-button ${activeTab === id ? "active" : ""}`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>
                  <User size={20} /> Shaxsiy ma'lumotlar
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <Phone size={16} />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{patient.address}</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{patient.year}-yil tug'ilgan</span>
                  </div>
                  <div className="info-item">
                    <Heart size={16} />
                    <span>Qon guruhi: {patient.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>
                  <Activity size={20} /> Vital belgilar
                </h3>
                <div className="vital-grid">
                  {renderVitalCard(
                    <HeartPulse className="vital-icon" />,
                    patient.vitalSigns?.heartRate,
                    "BPM"
                  )}
                  {renderVitalCard(
                    <Activity className="vital-icon" />,
                    patient.vitalSigns?.bloodPressure,
                    "mmHg"
                  )}
                  {renderVitalCard(
                    <Thermometer className="vital-icon" />,
                    patient.vitalSigns?.temperature,
                    "°C"
                  )}
                  {renderVitalCard(
                    <Weight className="vital-icon" />,
                    patient.weight,
                    "kg"
                  )}
                </div>
              </div>

              <div className="overview-card">
                <h3>
                  <Stethoscope size={20} /> Tibbiy ma'lumotlar
                </h3>
                <div className="medical-info-grid">
                  <div className="medical-info-item">
                    <span className="label">BMI:</span>
                    <span className="value">{patient.bmi}</span>
                  </div>
                  <div className="medical-info-item">
                    <span className="label">Bo'yi:</span>
                    <span className="value">{patient.height} sm</span>
                  </div>
                  <div className="medical-info-item">
                    <span className="label">Vazni:</span>
                    <span className="value">{patient.weight} kg</span>
                  </div>
                  <div className="medical-info-item">
                    <span className="label">Oxirgi tashrif:</span>
                    <span className="value">
                      {moment(patient.lastVisit).format("DD.MM.YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "visits" && (
          <div className="visits-content">
            <div className="section-header">
              <h3>
                <Calendar size={20} /> Tashriflar tarixi
              </h3>
            </div>
            <div className="visits-list">
              {patient.stories?.map((visit) => (
                <div key={visit._id} className="visit-card">
                  <div className="visit-header">
                    <div className="visit-date">
                      <CalendarIcon size={16} />
                      {formatDate(visit.createdAt)}
                    </div>
                    <span
                      className={`visit-status ${
                        visit.payment_status ? "completed" : "pending"
                      }`}
                    >
                      {visit.payment_status ? "Tugallangan" : "Kutilmoqda"}
                    </span>
                  </div>
                  <div className="visit-details">
                    <div className="visit-row">
                      <strong>Shifokor:</strong>Shifokor:{" "}
                      {visit?.doctorId.firstName} {visit?.doctorId.lastName}
                    </div>
                    <div className="visit-row">
                      <strong>Shikoyatlar:</strong> {visit.description || "N/A"}
                    </div>
                    <div className="visit-row">
                      <strong>Xizmatlar:</strong>{" "}
                      {visit.services.map((s) => s.name).join(", ")}
                    </div>
                    <div className="visit-row">
                      <strong>To'lov summasi:</strong>{" "}
                      {formatCurrency(visit.payment_amount)}
                    </div>
                    <div className="visit-row">
                      <strong>To'lov turi:</strong> {visit.paymentType}
                    </div>
                    {visit.endTime && (
                      <div className="visit-row">
                        <strong>Tugash vaqti:</strong>{" "}
                        {formatDate(visit.endTime)}
                      </div>
                    )}
                  </div>
                </div>
              )) || <p>Tashriflar mavjud emas</p>}
            </div>
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="prescriptions-content">
            <div className="section-header">
              <h3>
                <Pill size={20} /> Retseptlar
              </h3>
            </div>
            <div className="prescriptions-list">
              {patient.stories?.map(
                (story, inx) =>
                  story.retsept?.prescription && (
                    <div key={inx} className="prescription-card">
                      <div className="prescription-header">
                        <div className="prescription-date">
                          <Calendar size={16} />
                          {formatDate(story.createdAt)}
                        </div>
                        <span
                          className={`prescription-status ${
                            story.payment_status ? "active" : "expired"
                          }`}
                        >
                          {story.payment_status ? "Faol" : "Tugagan"}
                        </span>
                      </div>
                      <div className="prescription-doctor">
                        <strong>Shifokor:</strong> Shifokor:{" "}
                        {story.doctorId.firstName} {story.doctorId.lastName}
                      </div>
                      <div className="medications-list">
                        <div className="medication-item">
                          <div className="medication-name">
                            <Pill size={16} />
                            {story.retsept.prescription}
                          </div>
                          <div className="medication-details">
                            <div>
                              <strong>Tavsiyalar:</strong>{" "}
                              {story.retsept.recommendations || "N/A"}
                            </div>
                            <div>
                              <strong>Tashxis:</strong>{" "}
                              {story.retsept.diagnosis || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              ) || <p>Retseptlar mavjud emas</p>}
            </div>
          </div>
        )}

        {activeTab === "lab-results" && (
          <div className="lab-results-content">
            <div className="section-header">
              <h3>
                <TestTube size={20} /> Laboratoriya natijalari
              </h3>
            </div>
            <div className="lab-results-list">
              {patient.stories?.flatMap((story, inx) =>
                story.laboratory?.map((lab) => (
                  <div key={inx} className="lab-result-card">
                    <div className="lab-result-header">
                      <div className="lab-info">
                        <h4>
                          {lab.results[0]?.analis === "1"
                            ? "Biokimyoviy Tahlil"
                            : "Umumiy Tahlil"}
                        </h4>
                        <div className="lab-meta">
                          <span>
                            <Calendar size={14} />
                            {formatDate(lab.createdAt)}
                          </span>
                          <span>
                            <User size={14} /> Shifokor:{" "}
                            {story.doctorId?.firstName}{" "}
                            {story.doctorId?.lastName}
                          </span>
                          {/* <span><User size={14} /> Shifokor: </span> */}
                        </div>
                      </div>
                      <span className={`lab-status ${lab.status}`}>
                        {lab.status === "wait" ? "Kutilmoqda" : "Tugallangan"}
                      </span>
                    </div>
                    <div className="lab-results-table">
                      {lab.results.map((result, inx) => (
                        <div key={inx} className="result-row">
                          <span className="result-name">{result.name}</span>
                          <span
                            className="result-value"
                            style={{ color: getStatusColor("normal") }}
                          >
                            {result.result} {result.siBirlik}
                          </span>
                          <span className="result-normal">{result.norma}</span>
                          <span className="result-status normal">Normal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) || <p>Laboratoriya natijalari mavjud emas</p>}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-content">
            <div className="section-header">
              <h3>
                <FileImage size={20} /> Tibbiy hujjatlar
              </h3>
            </div>
            <div className="files-grid">
              {patient.stories?.flatMap((story, inx) =>
                story.files?.map((file) => (
                  <div key={inx} className="file-card">
                    <div className="file-icon">
                      <FileImage size={24} />
                    </div>
                    <div className="file-info">
                      <div className="file-name">Hujjat: {file?.filename}</div>
                      <div className="file-meta">
                        <span>Fayl</span>
                      </div>
                      <div className="file-details">
                        <div>
                          Yuklagan Shifokor: {story.doctorId.firstName}{" "}
                          {story.doctorId.lastName}
                        </div>
                        <div>Sana: {formatDate(story.createdAt)}</div>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button
                        className="file-action-btn"
                        onClick={() => handleViewFile(file, story.doctorId)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="file-action-btn"
                        onClick={() => handleDownloadFile(file, story.doctorId)}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) || <p>Hujjatlar mavjud emas</p>}
            </div>
          </div>
        )}

        {activeTab === "ward-history" && (
          <div className="ward-history-content">
            <div className="section-header">
              <h3>
                <Bed size={20} /> Statsionar tarixi
              </h3>
            </div>
            <div className="ward-history-list">
              {patient.roomStories?.map((room) => (
                <div key={room._id} className="ward-card">
                  <div className="ward-header">
                    <div className="ward-info">
                      <h4>Xona: {room.roomId.roomNumber}</h4>
                      <span className="ward-department">Bo'lim N/A</span>
                    </div>
                    <span
                      className={`ward-status ${
                        room.active ? "active" : "completed"
                      }`}
                    >
                      <Bed size={14} />
                      {room.active ? "Faol" : "Tugagan"}
                    </span>
                  </div>
                  <div className="ward-details">
                    <div className="ward-row">
                      <strong>Yotqizilgan:</strong> {room.startDay}
                    </div>
                    <div className="ward-row">
                      <strong>Chiqarilgan:</strong> {room.endDay}
                    </div>
                    <div className="ward-row">
                      <strong>Shifokor:</strong> Shifokor:{" "}
                      {room.doctorId?.firstName} {room.doctorId?.lastName}
                    </div>
                    <div className="ward-financial">
                      <div className="financial-item">
                        <span>Kunlar soni:</span>
                        <span>{room.paidDays.length} kun</span>
                      </div>
                      <div className="financial-item">
                        <span>Jami summa:</span>
                        <span>
                          {formatCurrency(
                            room.paidDays.reduce(
                              (sum, day) => sum + day.price,
                              0
                            )
                          )}
                        </span>
                      </div>
                      <div className="financial-item">
                        <span>To'lovlar soni:</span>
                        <span>{room.payments.length}</span>
                      </div>
                    </div>
                    <div className="ward-actions">
                      <button className="action-btn">
                        <Eye size={16} /> Batafsil
                      </button>
                      {room.active && (
                        <button className="action-btn">
                          <Edit size={16} /> Tahrirlash
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    className="expand-button"
                    onClick={() => toggleStory(room._id)}
                  >
                    {expandedStories[room._id] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    {expandedStories[room._id] ? "Yashirish" : "Ko'proq"}
                  </button>
                  {expandedStories[room._id] && (
                    <div className="ward-expanded-content">
                      <div className="ward-row">
                        <strong>Qo'shimcha ma'lumot:</strong>
                        <span>N/A</span>
                      </div>
                    </div>
                  )}
                </div>
              )) || <p>Statsionar tarixi mavjud emas</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsView;
