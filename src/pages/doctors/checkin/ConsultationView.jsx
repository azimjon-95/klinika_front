import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
    User,
    Calendar,
    FileText,
    Stethoscope,
    Upload,
    Scale,
    Heart,
    CheckCircle
} from 'lucide-react';
import { useGetTodaysStoryVisitQuery, useRedirectPatientMutation } from '../../../context/storyApi';
import { capitalizeFirstLetter } from '../../../hook/CapitalizeFirstLitter';
import { MdCall } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { GrPowerCycle } from "react-icons/gr";
import { storyApi } from '../../../context/storyApi';
import { useGetDoctorsQuery } from '../../../context/doctorApi';
import { IoLocationSharp } from "react-icons/io5";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { useVisitPatientMutation } from "../../../context/storyApi";
import ConsultationViewSkeleton from './skeleton/ConsultationViewSkeleton';
import RecordList from '../../../components/patientRecordList/RecordList';
import { ToastContainer, toast } from 'react-toastify';
import ServiceModal from './skeleton/ServiceModal';
import Analysis from '../analysis/Analysis';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const ConsultationView = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const workerId = localStorage.getItem("workerId");
    const specialization = localStorage.getItem("specialization");
    const { data, isLoading, isError } = useGetTodaysStoryVisitQuery({ workerId, userId });
    const dispatch = useDispatch();
    const selectedPatient = data?.innerData || [];

    const [isChange, setIsChange] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [sendData, setSendData] = useState(null);
    const [visitPatient] = useVisitPatientMutation();
    const [redirectPatient] = useRedirectPatientMutation();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctorServices, setSelectedDoctorServices] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDoctorName, setSelectedDoctorName] = useState('');

    const handleClick = () => {
        setIsChange(!isChange);
        setTimeout(() => setIsRotating(false), 500);
    };

    const { data: doctors, refetch, isLoading: workersLoading } = useGetDoctorsQuery(selectedPatient?.patientId?._id);
    const [prescription, setPrescription] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contentRef = useRef(null);

    const getBMIStatus = (bmi) => {
        if (!bmi) return '';
        if (bmi < 18.5) return 'underweight';
        if (bmi < 25) return 'normal';
        if (bmi < 30) return 'overweight';
        return 'obese';
    };

    const getBMIColor = (bmi) => {
        if (!bmi) return '#6b7280';
        if (bmi < 18.5) return '#3b82f6';
        if (bmi < 25) return '#10b981';
        if (bmi < 30) return '#f59e0b';
        return '#ef4444';
    };

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }
      @media print {
        body { margin: 0; }
        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
      }
    `,
        onPrintError: () => {
            toast.error('Chop etishda xatolik yuz berdi. Iltimos, qayta urining.');
        }
    });

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setUploadedFiles(prevFiles => [...prevFiles, ...files]);
            toast.success(`${files.length} fayl muvaffaqiyatli yuklandi!`);
        } else {
            toast.warn('Hech qanday fayl tanlanmadi.');
        }
    };

    const handleCompleteConsultation = async () => {
        setIsSubmitting(true);
        const consultationData = {
            diagnosis,
            prescription,
            recommendations,
            description,
        };

        try {
            const data = await visitPatient({
                id: userId,
                consultationData,
                files: uploadedFiles,
                workerId,
            }).unwrap();
            setSendData(data);
            toast.success('Qabul muvaffaqiyatli yakunlandi!');
            setTimeout(() => {
                dispatch(
                    storyApi.util.invalidateTags([{ type: 'DoctorStories', id: workerId }])
                );
                navigate(-1);
            }, 1000);
            reactToPrintFn();
        } catch (error) {
            toast.error('Qabulni saqlashda xatolik yuz berdi. Iltimos, qayta urining.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendToLab = (doctor) => {
        if (!doctor?.servicesId?.services) {
            toast.warn('Bu doktor uchun xizmatlar mavjud emas.');
            return;
        }
        setSelectedDoctor(doctor);
        setSelectedDoctorServices(doctor.servicesId.services);
        setSelectedDoctorName(`${doctor.firstName} ${doctor.lastName}`);
        setIsModalOpen(true);
    };

    const handleModalConfirm = async (selectedServices) => {
        if (selectedServices.length === 0) {
            toast.warn('Kamida bitta xizmat tanlang.');
            return;
        }

        try {
            await redirectPatient({
                storyId: userId,
                newDoctorId: selectedDoctor?._id,
                services: selectedServices.map(service => ({
                    name: service.name,
                    price: service.price
                }))
            }).unwrap();
            refetch();
            toast.success('Bemor muvaffaqiyatli yo‘naltirildi!');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Bemor yo‘naltirishda xatolik yuz berdi. Iltimos, qayta urining.');
        }
    };

    const buttonColors = [
        "#4caf50", "#2196f3", "#ff9800", "#e91e63",
        "#9c27b0", "#795548", "#607d8b"
    ];

    const handleCompleteAnalis = async () => {
        const consultationData = {
            diagnosis: "",
            prescription: "",
            recommendations: "",
            description: "",
        };

        try {
            await visitPatient({
                id: userId,
                consultationData,
                files: uploadedFiles,
                workerId,
            }).unwrap();
            setTimeout(() => {
                dispatch(
                    storyApi.util.invalidateTags([{ type: 'DoctorStories', id: workerId }])
                );
                navigate(-1);
            }, 1000);
        } catch (error) {
            toast.error('Tahlilni saqlashda xatolik yuz berdi. Iltimos, qayta urining.');
        }
    };

    if (isLoading || workersLoading) {
        return <ConsultationViewSkeleton />;
    }

    if (isError) {
        toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    }


    return (
        <div className="consultation-container">
            <div className="consultation-header">
                <div className="detail-item-conat">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Qaytish
                    </button>
                    <div className="patient-info-header">
                        <User className="patient-avatar" />
                        <div>
                            <h2>{selectedPatient?.patientId?.name}</h2>
                            <p>Navbat raqami: #{selectedPatient?.order_number}</p>
                        </div>
                    </div>
                </div>
                <div className="detail-item-conat">
                    <div className="detail-item-box">
                        <div className="detail-item">
                            <MdCall className="detail-icon" />
                            <div>
                                <label>Tel</label>
                                <span>{selectedPatient?.patientId?.phone}</span>
                            </div>
                        </div>
                        <div className="detail-item">
                            <Calendar className="detail-icon" />
                            <div>
                                <label>Yosh</label>
                                <span>{selectedPatient?.patientId?.age}</span>
                            </div>
                        </div>
                    </div>
                    <div className="detail-item-box">
                        <div className="detail-item">
                            <IoLocationSharp className="detail-icon" />
                            <div>
                                <label>Manzil</label>
                                <span>{selectedPatient?.patientId?.address}</span>
                            </div>
                        </div>
                        <div className="detail-item">
                            {
                                selectedPatient?.patientId?.gender === "erkak" ? (
                                    <IoMdMale className="detail-icon" />
                                ) : (
                                    <IoMdFemale className="detail-icon" />
                                )
                            }
                            <div>
                                <label>Jinnsi</label>
                                <span>{capitalizeFirstLetter(selectedPatient?.patientId?.gender)}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: "15px" }} className="detail-item">
                        <div style={{ gap: "7px" }} className="medical-info-container">
                            <div className="bmi-info">
                                <Scale size={17} color="#6b7280" aria-hidden="true" />
                                <span
                                    className={`bmi-value bmi-${getBMIStatus(selectedPatient?.patientId?.bmi)}`}
                                    style={{ color: getBMIColor(selectedPatient?.patientId?.bmi), fontSize: "14px" }}
                                >
                                    BMI: {selectedPatient?.patientId?.bmi || "Nomalum"}
                                </span>
                            </div>
                            <div className="blood-group-info">
                                <Heart size={16} color="#dc2626" aria-hidden="true" />
                                <span style={{ fontSize: "14px" }} className="blood-group-value">{selectedPatient?.patientId?.bloodGroup || "Nomalum"}</span>
                            </div>
                            <div style={{ fontSize: "14px" }} className="physical-stats">
                                {selectedPatient?.patientId?.height || "Nomalum"}cm, {selectedPatient?.patientId?.weight || "Nomalum"}kg
                            </div>
                        </div>
                    </div>
                </div>

                <div className="history-list">
                    {selectedPatient?.visitHistory?.map((visit, index) => (
                        <div key={index} className="history-item">
                            <Calendar className="history-icon" />
                            <div>
                                <span className="history-date">{visit.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="consultation-content">

                <div className="services-card_box">
                    <div className="services-card">
                        <h3>Xizmatlar</h3>
                        <div className="services-list">
                            {selectedPatient?.services?.map((service, index) => (
                                <div key={index} className="serviceview-item">
                                    <Stethoscope className="service-icon" />
                                    <span>{service.name}</span>
                                    <span className="serviceivera">{service.price.toLocaleString()} so'm</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="file-upload-card">
                        <h3>Natijalarni yuklash</h3>
                        <div className="upload-area">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="file-input"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="upload-label">
                                <Upload className="upload-icon" />
                                Fayl yuklash
                            </label>
                        </div>
                        {uploadedFiles?.length > 0 && (
                            <div className="uploaded-files">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="uploaded-file">
                                        <FileText className="file-icon" />
                                        <span>{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="actions-card">
                    <h3>
                        {isChange ? "Qo‘shimcha tekshiruvlar" : "Bemor shikoyati"}
                        <button onClick={handleClick}>
                            <GrPowerCycle className={isRotating ? "rotate-icon" : ""} />
                        </button>
                    </h3>
                    {
                        isChange ?
                            <div className="action-buttons">
                                {doctors?.innerData?.map((doctor, index) => {
                                    const color = buttonColors[index % buttonColors.length];
                                    return (
                                        <button
                                            key={index}
                                            className="action-btn lab-btn"
                                            onClick={() => handleSendToLab(doctor)}
                                            style={{ backgroundColor: color }}
                                        >
                                            <FileText className="action-icon" />
                                            {capitalizeFirstLetter(doctor?.specialization)}ga yuborish
                                        </button>
                                    );
                                })}
                            </div>
                            :
                            <div>
                                {selectedPatient?.description === "" ?
                                    <textarea
                                        className="recommendations-input"
                                        placeholder="Masalan: Nafas qisishi, yurak urishi tezlashuvi..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '130px',
                                            resize: 'none',
                                        }}
                                    />
                                    :
                                    <p>{selectedPatient?.description}</p>
                                }
                            </div>
                    }
                </div>
            </div>
            {specialization === "laborant" ?
                <>
                    < Analysis handleCompleteAnalis={handleCompleteAnalis} userId={userId} />
                </>
                :
                <>
                    <br />
                    <div className="prescription-card">
                        <h3>Tashxis va davolash</h3>
                        <input
                            className="diagnosis-input"
                            placeholder="Tashxis yozing..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            style={{
                                width: '100%',
                                height: '42px',
                                resize: 'none',
                            }}
                        />
                        <textarea
                            className="prescription-input"
                            placeholder="Retsept va dori-darmonlar..."
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                        />
                        <textarea
                            className="recommendations-input"
                            placeholder="Tavsiylar..."
                            value={recommendations}
                            onChange={(e) => setRecommendations(e.target.value)}
                            style={{
                                width: '100%',
                                height: '80px',
                                resize: 'none',
                            }}
                        />
                    </div>

                    <div className="consultation-actions">
                        <button
                            className="complete-btn"
                            onClick={handleCompleteConsultation}
                            disabled={isSubmitting}
                        >
                            <CheckCircle className="btn-icon" />
                            {isSubmitting ? 'Yuborilmoqda...' : 'Qabulni yakunlash'}
                        </button>
                    </div>
                </>
            }


            {/* Hidden printable component */}
            <div style={{ display: 'none' }}>
                <RecordList
                    componentRef={contentRef}
                    records={sendData}
                    selectedPatient={selectedPatient}
                />
            </div>

            {/* Service Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                services={selectedDoctorServices}
                onConfirm={handleModalConfirm}
                doctorName={selectedDoctorName}
            />

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ConsultationView;


