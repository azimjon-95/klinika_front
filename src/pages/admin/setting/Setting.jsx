import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Input, Button, TimePicker, Table, Spin, Typography, Card, Row, Col, Space, Upload, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, MedicineBoxOutlined, UploadOutlined } from '@ant-design/icons';
import { useGetClinicsQuery, useCreateClinicMutation, useUpdateClinicMutation, useDeleteClinicMutation } from '../../../context/clinicApi';
import { handleUpload } from '../../../utils/handleUpload';
import { PhoneNumberFormat } from '../../../hook/NumberFormat';
import moment from 'moment';
import './style.css';

const { Title } = Typography;

// Form validation rules
const FORM_RULES = {
    clinicName: [{ required: true, message: 'Iltimos, klinika nomini kiriting' }],
    startTime: [{ required: true, message: 'Iltimos, boshlanish vaqtini tanlang' }],
    endTime: [{ required: true, message: 'Iltimos, tugash vaqtini tanlang' }],
    address: [{ required: true, message: 'Iltimos, manzilni kiriting' }],
    phone: [
        { required: true, message: 'Iltimos, telefon raqamini kiriting' },
        { pattern: /^\+?\d{10,15}$/, message: 'Noto\'g\'ri telefon raqami' },
    ],
};

const ClinicManagement = () => {
    const [form] = Form.useForm();
    const [clinicToEdit, setClinicToEdit] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    // RTK Query hooks
    const { data: clinics, isLoading, error } = useGetClinicsQuery();
    const [createClinic, { isLoading: isCreating }] = useCreateClinicMutation();
    const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();
    const [deleteClinic] = useDeleteClinicMutation();

    // Set form values when editing
    useEffect(() => {
        if (clinicToEdit) {
            form.setFieldsValue({
                clinicName: clinicToEdit.clinicName,
                startTime: clinicToEdit.startTime ? moment(clinicToEdit.startTime, 'HH:mm') : null,
                endTime: clinicToEdit.endTime ? moment(clinicToEdit.endTime, 'HH:mm') : null,
                address: clinicToEdit.address,
                phone: clinicToEdit.phone,
            });
            setFileList(clinicToEdit.logo ? [{ uid: '-1', name: 'logotip.jpg', status: 'done', url: clinicToEdit.logo }] : []);
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [clinicToEdit, form]);

    // Handle form submission
    const handleSubmit = useCallback(
        async (values) => {
            let logoUrl = clinicToEdit?.logo || '';
            if (fileList.length > 0 && fileList[0].originFileObj) {
                try {
                    logoUrl = await handleUpload({ file: fileList[0].originFileObj, setUploading });
                } catch (error) {
                    return;
                }
            }

            const formattedValues = {
                ...values,
                startTime: values.startTime ? values.startTime.format('HH:mm') : '',
                endTime: values.endTime ? values.endTime.format('HH:mm') : '',
                logo: logoUrl,
            };

            try {
                if (clinicToEdit) {
                    await updateClinic({ id: clinicToEdit._id, ...formattedValues }).unwrap();
                    message.success('Klinika muvaffaqiyatli yangilandi');
                } else {
                    await createClinic(formattedValues).unwrap();
                    message.success('Klinika muvaffaqiyatli yaratildi');
                }
                form.resetFields();
                setFileList([]);
                setClinicToEdit(null);
            } catch (error) {
                message.error(`Klinikani saqlashda xatolik: ${error?.data?.message || error.message}`);
            }
        },
        [clinicToEdit, fileList, form, createClinic, updateClinic]
    );

    // Handle edit
    const handleEdit = useCallback((clinic) => {
        setClinicToEdit(clinic);
    }, []);

    // Handle delete with confirmation
    const handleDelete = useCallback(
        async (id) => {
            try {
                await deleteClinic(id).unwrap();
                message.success('Klinika muvaffaqiyatli o\'chirildi');
            } catch (error) {
                message.error(`Klinikani o\'chirishda xatolik: ${error?.data?.message || error.message}`);
            }
        },
        [deleteClinic]
    );

    // Handle cancel
    const handleCancel = useCallback(() => {
        form.resetFields();
        setFileList([]);
        setClinicToEdit(null);
    }, [form]);

    // Upload props
    const uploadProps = useMemo(
        () => ({
            onRemove: () => setFileList([]),
            beforeUpload: (file) => {
                const isImage = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isImage) {
                    message.error('Faqat rasm fayllarini yuklash mumkin!');
                    return false;
                }
                if (!isLt2M) {
                    message.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak!');
                    return false;
                }
                setFileList([file]);
                return false;
            },
            fileList,
            accept: 'image/*',
            maxCount: 1,
            showUploadList: { showPreviewIcon: true },
        }),
        [fileList]
    );

    // Table columns
    const columns = useMemo(
        () => [
            {
                title: 'Logotip',
                dataIndex: 'logo',
                key: 'logo',
                render: (logo) => (logo ? <img src={logo} alt="logotip" style={{ width: 50, borderRadius: 4 }} /> : 'Logotip Yo\'q'),
            },
            {
                title: 'Klinika Nomi',
                dataIndex: 'clinicName',
                key: 'clinicName',
            },
            {
                title: 'Boshlanish va Tugash vaqti',
                dataIndex: ['startTime', 'endTime'],
                key: 'timeRange',
                render: (_, record) => `${record.startTime} - ${record.endTime}`,
            },
            {
                title: 'Manzil',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Telefon',
                dataIndex: 'phone',
                key: 'phone',
                render: (phone) => (phone ? PhoneNumberFormat(phone) : 'Telefon Yo\'q'),
            },
            {
                title: 'Amallar',
                key: 'actions',
                render: (_, record) => (
                    <Space>
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                            Tahrirlash
                        </Button>
                        <Popconfirm
                            title="Klinikani o'chirishni xohlaysizmi?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Ha"
                            cancelText="Yo'q"
                        >
                            <Button type="link" icon={<DeleteOutlined />} danger>
                                O'chirish
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        [handleEdit, handleDelete]
    );

    // Ensure dataSource is an array
    const tableData = Array.isArray(clinics?.innerData)
        ? clinics?.innerData
        : clinics?.innerData && typeof clinics?.innerData === 'object' && Object.keys(clinics?.innerData).length > 0
            ? [clinics?.innerData]
            : [];

    // Log for debugging


    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Title level={3} style={{ display: 'flex', alignItems: 'center', color: '#1890ff' }}>
                <MedicineBoxOutlined style={{ marginRight: 8 }} /> Klinika Boshqaruvi
            </Title>

            <Card
                className="clinic-card"
                title={clinicToEdit ? 'Klinikani Tahrirlash' : 'Yangi Klinika Qo\'shish'}
                style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ clinicName: '', startTime: null, endTime: null, address: '', phone: '' }}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Klinika Nomi" name="clinicName" rules={FORM_RULES.clinicName}>
                                <Input prefix={<MedicineBoxOutlined />} placeholder="Klinika nomini kiriting" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Boshlanish Vaqti" name="startTime" rules={FORM_RULES.startTime}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Vaqtni tanlang" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Tugash Vaqti" name="endTime" rules={FORM_RULES.endTime}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Vaqtni tanlang" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Manzil" name="address" rules={FORM_RULES.address}>
                                <Input placeholder="Manzilni kiriting" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Telefon" name="phone" rules={FORM_RULES.phone}>
                                <Input placeholder="Telefon raqamini kiriting" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Logotip">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />} loading={uploading}>
                                        Logotipni Yuklash (ixtiyoriy)
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} loading={isCreating || isUpdating || uploading}>
                                {clinicToEdit ? 'Yangilash' : 'Yaratish'}
                            </Button>
                            {clinicToEdit && <Button onClick={handleCancel}>Bekor Qilish</Button>}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                {isLoading ? (
                    <Spin tip="Klinikalar yuklanmoqda..." />
                ) : error ? (
                    <div>Klinikalarni yuklashda xatolik: {error?.data?.message || error.message}</div>
                ) : (
                    <Table pagination={false} size="small" bordered columns={columns} dataSource={tableData} rowKey="_id" className="clinic-table" />
                )}
            </Card>
        </div>
    );
};

export default ClinicManagement;