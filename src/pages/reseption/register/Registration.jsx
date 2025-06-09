import React, { useState, useRef } from 'react';
import { capitalizeFirstLetter } from '../../../hook/CapitalizeFirstLitter';
import { useAddPotsentsMutation } from '../../../context/clientApi';
import { useReactToPrint } from "react-to-print";
import { useGetPotsentsLengthQuery } from '../../../context/doctorApi';
import { notification, Form, Select, Input, Button, Typography, Spin, Radio } from 'antd';
import ModelCheck from '../../../components/check/modelCheck/ModelCheck';
import moment from 'moment';
import './registration.css';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Registration = () => {
    const { data: doctors, isLoading: doctorsLoading, error: doctorsError } = useGetPotsentsLengthQuery();
    const [addPotsents, { isLoading: isAdding }] = useAddPotsentsMutation();
    const [form] = Form.useForm();
    const contentRef = useRef(null);
    const [data, setData] = useState(null);

    // Watch the selected doctorId
    const selectedDoctorId = Form.useWatch('doctorId', form);

    // Set payment_amount based on selected doctor's admission_price
    React.useEffect(() => {
        if (selectedDoctorId && doctors?.innerData) {
            const selectedDoctor = doctors.innerData.find(doctor => doctor._id === selectedDoctorId);
            if (selectedDoctor?.admission_price) {
                const formattedPrice = formatPaymentAmount(selectedDoctor.admission_price.toString());
                form.setFieldsValue({ payment_amount: formattedPrice });
            }
        }
    }, [selectedDoctorId, doctors, form]);

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
    `
    });

    const initialValues = {
        doctorId: '',
        firstname: '',
        lastname: '',
        idNumber: '',
        phone: '',
        address: '',
        year: '',
        gender: 'erkak',
        paymentType: 'naqt',
        payment_amount: '',
        description: '',
        startTime: moment().format('YYYY-MM-DD HH:mm'),
        treating: false,
        debtor: false,
    };

    const onFinish = async (values) => {
        try {
            const patientData = {
                ...values,
                payment_amount: values.payment_amount
                    ? Number(values.payment_amount.replace(/\./g, ''))
                    : 0,
                phone: `+998${values.phone.replace(/\s/g, '')}`,
            };

            const response = await addPotsents(patientData).unwrap();

            if (response?.innerData) {
                setData(response.innerData);
                setTimeout(() => {
                    reactToPrintFn();
                }, 300);
                form.resetFields();
                notification.success({
                    message: 'Muvaffaqiyat',
                    description: `Bemor muvaffaqiyatli roʻyxatdan oʻtkazildi! Navbat raqami: ${response?.innerData?.order_number || 'N/A'}`,
                });
            } else {
                notification.error({
                    message: 'Xatolik',
                    description: 'Ma\'lumotlar saqlashda xatolik yuz berdi.',
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            notification.error({
                message: 'Xatolik',
                description: error?.data?.message || 'Xatolik yuz berdi. Iltimos, qayta urinib koʻring.',
            });
        }
    };

    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
        if (cleaned.length <= 7) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
    };

    const formatPaymentAmount = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned) return '';
        return Number(cleaned).toLocaleString('uz-UZ', { minimumFractionDigits: 0 }).replace(/,/g, '.');
    };

    return (
        <div className="registration-container">
            <Title level={4} className="registration-title">
                Bemorlarni Roʻyxatdan Oʻtkazish
            </Title>

            <Form
                form={form}
                initialValues={initialValues}
                onFinish={onFinish}
                layout="vertical"
                className="registration-form"
            >
                <Form.Item
                    name="doctorId"
                    label="Doktorni tanlang"
                    rules={[{ required: true, message: 'Iltimos, doktor tanlang!' }]}
                >
                    {doctorsLoading ? (
                        <div className="loading-spinner">
                            <Spin size="small" />
                        </div>
                    ) : (
                        <Select
                            placeholder="Doktorni tanlang"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {doctors?.innerData?.length > 0 ? (
                                doctors.innerData.map((doctor) => (
                                    <Option key={doctor._id} value={doctor._id}>
                                        {capitalizeFirstLetter(doctor.specialization)}: {doctor.firstName} {doctor.lastName} [
                                        {doctor.todayQueue}]
                                    </Option>
                                ))
                            ) : (
                                <Option disabled value="">
                                    Doktorlar topilmadi
                                </Option>
                            )}
                        </Select>
                    )}
                </Form.Item>

                <div className="form-row">
                    <Form.Item
                        name="firstname"
                        label="Ism"
                        rules={[{ required: true, message: 'Iltimos, bemor ismini kiriting!' }]}
                    >
                        <Input placeholder="Ismni kiriting" />
                    </Form.Item>
                    <Form.Item
                        name="lastname"
                        label="Familiya"
                        rules={[{ required: true, message: 'Iltimos, bemor familiyasini kiriting!' }]}
                    >
                        <Input placeholder="Familiyani kiriting" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="idNumber"
                        label="ID raqami"
                        rules={[
                            { required: true, message: 'Iltimos, ID raqamini kiriting!' },
                            {
                                pattern: /^[a-zA-Z]{2}\d{7}$/,
                                message: 'ID raqami 2 harf va 7 raqamdan iborat boʻlishi kerak (masalan, AA42540404)!',
                            },
                        ]}
                        normalize={(value) => (value ? value.toUpperCase() : value)}
                    >
                        <Input placeholder="AA42540404" maxLength={9} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Telefon raqami"
                        rules={[
                            { required: true, message: 'Iltimos, telefon raqamini kiriting!' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const cleanedValue = value.replace(/\s/g, '');
                                    if (/^\d{9}$/.test(cleanedValue)) return Promise.resolve();
                                    return Promise.reject(
                                        new Error('Telefon raqami 9 raqamdan iborat boʻlishi kerak (masalan, 94 432 44 54)!')
                                    );
                                },
                            },
                        ]}
                    >
                        <Input
                            addonBefore="+998"
                            placeholder="94 432 44 54"
                            maxLength={12}
                            onChange={(e) => {
                                const formattedValue = formatPhoneNumber(e.target.value);
                                form.setFieldsValue({ phone: formattedValue });
                            }}
                        />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <Form.Item
                        name="year"
                        label="Tugʻilgan yili"
                        rules={[
                            { required: true, message: 'Iltimos, tugʻilgan yilni kiriting!' },
                            {
                                pattern: /^\d{4}$/,
                                message: 'Tugʻilgan yil 4 raqamli boʻlishi kerak (masalan, 1990)!',
                            },
                        ]}
                    >
                        <Input placeholder="Tugʻilgan yilni kiriting" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Manzil"
                        rules={[{ required: true, message: 'Iltimos, manzilni kiriting!' }]}
                    >
                        <Input placeholder="Manzilni kiriting" />
                    </Form.Item>
                </div>

                <div className="form-row">
                    <div className="form-rowbox">
                        <Form.Item
                            name="gender"
                            label="Jinsi"
                            rules={[{ required: true, message: 'Iltimos, jinsni tanlang!' }]}
                        >
                            <Radio.Group>
                                <Radio value="erkak">Erkak</Radio>
                                <Radio value="ayol">Ayol</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="paymentType"
                            label="Toʻlov turi"
                            rules={[{ required: true, message: 'Iltimos, toʻlov turini tanlang!' }]}
                        >
                            <Radio.Group>
                                <Radio value="naqt">Naqd</Radio>
                                <Radio value="karta">Karta</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="payment_amount"
                        label="Toʻlov summasi"
                        rules={[
                            { required: true, message: 'Iltimos, toʻlov summasini kiriting!' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const cleanedValue = value.replace(/\./g, '');
                                    if (/^\d+$/.test(cleanedValue)) return Promise.resolve();
                                    return Promise.reject(
                                        new Error('Toʻlov summasi faqat raqamlardan iborat boʻlishi kerak!')
                                    );
                                },
                            },
                        ]}
                    >
                        <Input
                            readOnly
                            placeholder="50.000"
                        />
                    </Form.Item>
                </div>

                <Form.Item name="description" label="Tavsif">
                    <TextArea rows={4} placeholder="Tavsifni kiriting" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isAdding}
                        block
                        className="submit-button"
                    >
                        {isAdding ? 'Yuklanmoqda...' : 'Qabulni yaratish'}
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ display: "none" }}>
                <ModelCheck data={data} contentRef={contentRef} />
            </div>
        </div>
    );
};

export default Registration;