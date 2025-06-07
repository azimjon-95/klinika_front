import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Tabs, Form, Input, Button, Select, Table, Popconfirm, Modal, message } from 'antd';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { specializationOptions } from '../../../utils/specializationOptions';
import {
    useGetWorkersQuery,
    useAddWorkerMutation,
    useUpdateWorkerMutation,
    useDeleteWorkerMutation,
} from '../../../context/doctorApi';
import { NumberFormat } from '../../../hook/NumberFormat';
import { capitalizeFirstLetter } from '../../../hook/CapitalizeFirstLitter';
import './style.css';
import LoadingTik from '../../../components/loading/LoadingTik';

const { Option } = Select;

const Workers = () => {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors }, control } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            login: '',
            password: '',
            confirmPassword: '',
            role: 'reception',
            permissions: [],
            salary_type: 'fixed',
            salary_per_month: 0,
            percentage_from_admissions: 0,
            specialization: '',
            admission_price: 0,
        },
    });

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const role = watch('role') || 'reception';
    const salaryType = watch('salary_type');
    const admissionPrice = watch('admission_price');
    const [confirmPasswordBorderClass, setConfirmPasswordBorderClass] = useState('form-input');
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [modalConfirmPasswordBorderClass, setModalConfirmPasswordBorderClass] = useState('');
    const [updateForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');

    const { data: workers, isLoading, error } = useGetWorkersQuery();
    const [addWorker] = useAddWorkerMutation();
    const [updateWorker] = useUpdateWorkerMutation();
    const [deleteWorker] = useDeleteWorkerMutation();
    const { searchQuery } = useSelector((state) => state.search);
    const transformedWorkers = workers?.innerData?.map((worker) => ({
        ...worker,
        key: worker._id,
    }));

    const filteredWorkers = transformedWorkers?.filter((worker) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            worker.firstName?.toLowerCase().includes(query) ||
            worker.lastName?.toLowerCase().includes(query) ||
            worker.address?.toLowerCase().includes(query) ||
            worker.login?.toLowerCase().includes(query) ||
            worker.role?.toLowerCase().includes(query) ||
            worker.specialization?.toLowerCase().includes(query) ||
            worker.salary_per_month?.toString().includes(query) ||
            worker.admission_price?.toString().includes(query) ||
            worker.percentage_from_admissions?.toString().includes(query)
        );
    });

    useEffect(() => {
        if (confirmPassword) {
            setConfirmPasswordBorderClass(password === confirmPassword ? 'border-green' : 'border-red');
        } else {
            setConfirmPasswordBorderClass('form-input');
        }
        setSubmitError(null);
    }, [password, confirmPassword]);

    useEffect(() => {
        const confirm = updateForm.getFieldValue('confirmPassword');
        const pass = updateForm.getFieldValue('password');
        if (confirm) {
            setModalConfirmPasswordBorderClass(pass === confirm ? 'border-green' : 'border-red');
        } else {
            setModalConfirmPasswordBorderClass('');
        }
    }, [updateForm]);


    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const admissionPriceValue = data.admission_price !== undefined && data.admission_price !== ''
                ? Number(data.admission_price)
                : 0;
            const percentageValue = data.percentage_from_admissions !== undefined && data.percentage_from_admissions !== ''
                ? Number(data.percentage_from_admissions)
                : 0;

            const submitData = {
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                login: data.login,
                password: data.password,
                role: data.role,
                permissions: [data.role],
                salary_type: data.salary_type,
                salary_per_month: data.salary_type === 'fixed' ? Number(data.salary_per_month) || 0 : 0,
                percentage_from_admissions: data.salary_type === 'percentage' ? percentageValue : 0,
                specialization: data.specialization,
                admission_price: admissionPriceValue,
            };


            await addWorker(submitData).unwrap();
            message.success("Xodim muvaffaqiyatli qo'shildi");
            reset();
            setActiveTab('1');
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitError(err.data?.message || "Ro'yxatdan o'tishda xato yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setValue('role', selectedRole);
        if (selectedRole !== 'doctor') {
            setValue('specialization', '');
        }
    };

    const handleSalaryTypeSelect = (selectedType) => {
        setValue('salary_type', selectedType);
        if (selectedType === 'fixed') {
            setValue('percentage_from_admissions', 0);
        } else {
            setValue('salary_per_month', 0);
        }
    };

    const handleDelete = async (id) => {
        if (!isValidObjectId(id)) {
            message.error("Noto'g'ri ID formati");
            return;
        }
        try {
            await deleteWorker(id).unwrap();
            message.success("Xodim muvaffaqiyatli o'chirildi");
        } catch (err) {
            message.error(err.data?.message || "O'chirishda xato yuz berdi");
        }
    };

    const handleUpdate = (worker) => {
        setEditingWorker(worker);
        updateForm.setFieldsValue({
            ...worker,
            confirmPassword: worker.password,
            admission_price: worker.admission_price ?? 0,
            salary_type: worker.salary_type ?? 'fixed',
            percentage_from_admissions: worker.percentage_from_admissions ?? 0,
        });
        setIsModalVisible(true);
    };

    const handleUpdateSubmit = async (values) => {
        if (!isValidObjectId(editingWorker.key)) {
            message.error("Noto'g'ri ID formati");
            return;
        }
        try {
            const admissionPriceValue = values.admission_price !== undefined && values.admission_price !== ''
                ? Number(values.admission_price)
                : 0;
            const percentageValue = values.percentage_from_admissions !== undefined && values.percentage_from_admissions !== ''
                ? Number(values.percentage_from_admissions)
                : 0;

            const submitData = {
                firstName: values.firstName,
                lastName: values.lastName,
                address: values.address,
                login: values.login,
                role: values.role,
                salary_type: values.salary_type,
                salary_per_month: values.salary_type === 'fixed' ? Number(values.salary_per_month) || 0 : 0,
                percentage_from_admissions: values.salary_type === 'percentage' ? percentageValue : 0,
                admission_price: admissionPriceValue,
            };

            if (values.password && values.password !== editingWorker.password) {
                submitData.password = values.password;
            }

            if (values.role === 'doctor' && values.specialization) {
                submitData.specialization = values.specialization;
            } else {
                submitData.specialization = '';
            }

            if (values.permissions?.length > 0) {
                submitData.permissions = values.permissions;
            }

            await updateWorker({ id: editingWorker.key, ...submitData }).unwrap();
            message.success("Xodim muvaffaqiyatli yangilandi");
            setIsModalVisible(false);
            updateForm.resetFields();
            setEditingWorker(null);
        } catch (err) {
            console.error('Update error:', err);
            message.error(err.data?.message || "Yangilashda xato yuz berdi");
        }
    };

    const columns = [
        { title: 'Ism', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Familiya', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Manzil', dataIndex: 'address', key: 'address' },
        {
            title: 'Lavozim',
            dataIndex: 'role',
            key: 'role',
            render: (role) =>
                role === 'reception' ? 'Qabulxona' : role === 'director' ? 'Direktor' : 'Doktor',
        },
        {
            title: 'Mutaxassislik',
            dataIndex: 'specialization',
            key: 'specialization',
            render: (specialization) => capitalizeFirstLetter(specialization)
        },
        {
            title: 'Oylik turi',
            dataIndex: 'salary_type',
            key: 'salary_type',
            render: (salary_type) => salary_type === 'fixed' ? 'Belgilangan' : 'Foizli',
        },
        {
            title: 'Oylik maosh',
            dataIndex: 'salary_per_month',
            key: 'salary_per_month',
            render: (salary_per_month) => `${NumberFormat(salary_per_month)} so'm`
        },
        {
            title: 'Qabul foizi',
            dataIndex: 'percentage_from_admissions',
            key: 'percentage_from_admissions',
            render: (percentage) => percentage ? `${percentage}%` : '0%',
        },
        {
            title: 'Qabul narxi',
            dataIndex: 'admission_price',
            key: 'admission_price',
            render: (admission_price) => `${NumberFormat(admission_price ?? 0)} so'm`
        },
        { title: 'Login', dataIndex: 'login', key: 'login' },
        {
            title: 'Amallar',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Button type="link" onClick={() => handleUpdate(record)}>
                        Yangilash
                    </Button>
                    <Popconfirm
                        title="O'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button type="link" danger>
                            O'chirish
                        </Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];


    return (
        <>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane tab="Do'ktorlar ro'yxati" key="1">
                    {error && <p>Xatolik: {error.message || 'Ma\'lumotlarni olishda xato'}</p>}
                    {isLoading ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}> <LoadingTik /> </div> :
                        <Table bordered size="small" columns={columns} dataSource={filteredWorkers} pagination={false} />
                    }
                </Tabs.TabPane>

                <Tabs.TabPane tab="Yangi do'ktor qo'shish" key="2">
                    <div className="form-card">
                        {submitError && <p className="error-message">Xatolik: {submitError}</p>}
                        <div>
                            <div className="form-group-box">
                                <div className="form-group">
                                    <label>Lavozim</label>
                                    <div className="role-buttons">
                                        {['reception', 'director', 'doctor'].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => handleRoleSelect(r)}
                                                className={`role-button ${role === r ? 'active' : ''}`}
                                            >
                                                {r === 'reception' ? 'Qabulxona' : r === 'director' ? 'Direktor' : 'Doktor'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="firstName">Ism</label>
                                    <input
                                        {...register('firstName', { required: 'Ism kiritish shart' })}
                                        placeholder="Ismni kiriting"
                                        className="form-input"
                                    />
                                    {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Familiya</label>
                                    <input
                                        {...register('lastName', { required: 'Familiya kiritish shart' })}
                                        placeholder="Familiyani kiriting"
                                        className="form-input"
                                    />
                                    {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Manzil</label>
                                <input
                                    {...register('address', { required: 'Manzil kiritish shart' })}
                                    placeholder="Manzilni kiriting"
                                    className="form-input"
                                />
                                {errors.address && <p className="error-message">{errors.address.message}</p>}
                            </div>
                            <div className="form-group-box">
                                <div className="form-group">
                                    <label htmlFor="login">Login</label>
                                    <input
                                        {...register('login', { required: 'Login kiritish shart' })}
                                        placeholder="Loginni kiriting"
                                        className="form-input"
                                    />
                                    {errors.login && <p className="error-message">{errors.login.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Parol</label>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: 'Parol kiritish shart',
                                            minLength: { value: 6, message: 'Parol kamida 6 belgidan iborat bo\'lishi kerak' },
                                        }}
                                        render={({ field }) => (
                                            <Input.Password
                                                {...field}
                                                placeholder="Parolni kiriting"
                                                className="form-input"
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        )}
                                    />
                                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Parolni tasdiqlash</label>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        rules={{
                                            required: 'Parolni tasdiqlash shart',
                                            validate: (value) => value === password || 'Parollar mos kelmadi',
                                        }}
                                        render={({ field }) => (
                                            <Input.Password
                                                {...field}
                                                placeholder="Parolni qayta kiriting"
                                                className={`form-input ${confirmPasswordBorderClass}`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        )}
                                    />
                                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                            {role === 'doctor' && (
                                <div className="form-group">
                                    <label htmlFor="specialization">Mutaxassislik</label>
                                    <Controller
                                        name="specialization"
                                        control={control}
                                        rules={{ required: role === 'doctor' ? 'Mutaxassislik kiritish shart' : false }}
                                        render={({ field }) => (
                                            <ReactSelect
                                                {...field}
                                                options={specializationOptions}
                                                placeholder="Mutaxassislikni tanlang"
                                                isSearchable
                                                onChange={(option) => field.onChange(option ? option.value : '')}
                                                value={specializationOptions.find((option) => option.value === field.value)}
                                            />
                                        )}
                                    />
                                    {errors.specialization && <p className="error-message">{errors.specialization.message}</p>}
                                </div>
                            )}
                            <div className="form-group-box">
                                <div className="form-group">
                                    <label htmlFor="salary_type">Oylik turi</label>
                                    <Controller
                                        name="salary_type"
                                        control={control}
                                        rules={{ required: 'Oylik turi kiritish shart' }}
                                        render={({ field }) => (
                                            <div className="role-buttons">
                                                {['fixed', 'percentage'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            field.onChange(type);
                                                            handleSalaryTypeSelect(type);
                                                        }}
                                                        className={`role-button ${field.value === type ? 'active' : ''}`}
                                                    >
                                                        {type === 'fixed' ? 'Belgilangan' : 'Foizli'}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    {errors.salary_type && <p className="error-message">{errors.salary_type.message}</p>}
                                </div>
                                {salaryType === 'fixed' && (
                                    <div className="form-group">
                                        <label htmlFor="salary_per_month">Oylik maosh</label>
                                        <input
                                            {...register('salary_per_month', { required: 'Oylik maosh kiritish shart' })}
                                            placeholder="Oylik maoshni kiriting"
                                            className="form-input"
                                        />
                                        {errors.salary_per_month && <p className="error-message">{errors.salary_per_month.message}</p>}
                                    </div>
                                )}
                                {salaryType === 'percentage' && (
                                    <div className="form-group">
                                        <label htmlFor="percentage_from_admissions">Qabul foizi (%)</label>
                                        <input
                                            {...register('percentage_from_admissions', { required: 'Qabul foizi kiritish shart' })}
                                            placeholder="Qabul foizini kiriting"
                                            className="form-input"
                                        />
                                        {errors.percentage_from_admissions && <p className="error-message">{errors.percentage_from_admissions.message}</p>}
                                    </div>
                                )}


                                <div className="form-group">
                                    <label htmlFor="admission_price">Qabul narxi</label>
                                    <input
                                        {...register('admission_price', { required: 'Qabul narxini kiritish shart' })}
                                        placeholder="Qabul narxini kiriting"
                                        className="form-input"
                                    />
                                    {errors.admission_price && <p className="error-message">{errors.admission_price.message}</p>}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Yuborilmoqda...' : 'Ro\'yxatdan o\'tish'}
                            </button>
                        </div>
                    </div>
                </Tabs.TabPane>
            </Tabs>

            <Modal
                title="Xodimni yangilash"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    updateForm.resetFields();
                    setEditingWorker(null);
                }}
                footer={null}
                className="worker-update-modal"
            >
                <Form
                    form={updateForm}
                    layout="vertical"
                    onFinish={handleUpdateSubmit}
                    initialValues={editingWorker}
                    className="worker-update-form"
                >
                    <div className="form-row">
                        <Form.Item
                            label="Ism"
                            name="firstName"
                            rules={[{ required: true, message: "Ism kiritish shart" }]}
                            className="form-item"
                        >
                            <Input placeholder="Ismni kiriting" />
                        </Form.Item>
                        <Form.Item
                            label="Familiya"
                            name="lastName"
                            rules={[{ required: true, message: "Familiya kiritish shart" }]}
                            className="form-item"
                        >
                            <Input placeholder="Familiyani kiriting" />
                        </Form.Item>
                    </div>
                    <div className="form-row">
                        <Form.Item
                            label="Manzil"
                            name="address"
                            rules={[{ required: true, message: "Manzil kiritish shart" }]}
                            className="form-item"
                        >
                            <Input placeholder="Manzilni kiriting" />
                        </Form.Item>
                        <Form.Item
                            label="Login"
                            name="login"
                            rules={[{ required: true, message: "Login kiritish shart" }]}
                            className="form-item"
                        >
                            <Input placeholder="Loginni kiriting" />
                        </Form.Item>
                    </div>
                    <div className="form-row">
                        <Form.Item
                            label="Parol"
                            name="password"
                            rules={[
                                { required: true, message: "Parol kiritish shart" },
                                { minLength: 6, message: "Parol kamida 6 belgidan iborat bo'lishi kerak" },
                            ]}
                            className="form-item"
                        >
                            <Input.Password placeholder="Parolni kiriting" />
                        </Form.Item>
                        <Form.Item
                            label="Parolni tasdiqlash"
                            name="confirmPassword"
                            rules={[
                                { required: true, message: "Parolni tasdiqlash shart!" },
                                ({ getFieldValue }) => ({
                                    validator: (_, value) => {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Parollar mos kelmadi'));
                                    },
                                }),
                            ]}
                            className="form-item"
                        >
                            <Input.Password
                                placeholder="Parolni qayta kiriting"
                                className={modalConfirmPasswordBorderClass}
                            />
                        </Form.Item>
                    </div>
                    <div className="form-row">
                        <Form.Item
                            label="Lavozim"
                            name="role"
                            rules={[{ required: true, message: "Lavozimni tanlang" }]}
                            className="form-item"
                        >
                            <Select
                                placeholder="Lavozimni tanlang"
                                onChange={(value) => updateForm.setFieldsValue({ role: value })}
                            >
                                <Option value="reception">Qabulxona</Option>
                                <Option value="director">Qo'riqchi</Option>
                                <Option value="doctor">Doktor</Option>
                            </Select>
                        </Form.Item>
                        {updateForm.getFieldValue('role') === 'doctor' && (
                            <Form.Item
                                label="Mutaxassislik"
                                name="specialization"
                                rules={[{ required: true, message: "Mutaxassislik kiritish shart!" }]}
                                className="form-item"
                            >
                                <ReactSelect
                                    options={specializationOptions}
                                    placeholder="Mutaxassislikni tanlang"
                                    isSearchable
                                    onChange={(option) => updateForm.setFieldsValue({ specialization: option ? option.value : '' })}
                                    value={specializationOptions.find(
                                        (option) => option.value === updateForm.getFieldValue('specialization')
                                    )}
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div className="form-row">
                        <Form.Item
                            label="Oylik turi"
                            name="salary_type"
                            rules={[{ required: true, message: "Oylik turini tanlang" }]}
                            className="form-item"
                        >
                            <div className="role-buttons">
                                {['fixed', 'percentage'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                            updateForm.setFieldsValue({ salary_type: type });
                                            if (type === 'fixed') {
                                                updateForm.setFieldsValue({ percentage_from_admissions: 0 });
                                            } else {
                                                updateForm.setFieldsValue({ salary_per_month: 0 });
                                            }
                                        }}
                                        className={`role-button ${updateForm.getFieldValue('salary_type') === type ? 'active' : ''}`}
                                    >
                                        {type === 'fixed' ? 'Belgilangan' : 'Foizli'}
                                    </button>
                                ))}
                            </div>
                        </Form.Item>
                        {updateForm.getFieldValue('salary_type') === 'fixed' && (
                            <Form.Item
                                label="Oylik maosh"
                                name="salary_per_month"
                                rules={[{
                                    validator: async (_, value) => {
                                        const numValue = Number(value);
                                        if (updateForm.getFieldValue('salary_type') === 'fixed' && (isNaN(numValue) || numValue < 0)) {
                                            throw new Error('Maosh 0 dan kam bo‘lmasligi kerak');
                                        }
                                    },
                                }]}
                                className="form-item"
                            >
                                <Input
                                    type="number"
                                    placeholder="Oylik maoshni kiriting"
                                    defaultValue={0}
                                    onChange={(e) => updateForm.setFieldsValue({ salary_per_month: e.target.value ? Number(e.target.value) : 0 })}
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div className="form-row">
                        {updateForm.getFieldValue('salary_type') === 'percentage' && (
                            <Form.Item
                                label="Qabul foizi (%)"
                                name="percentage_from_admissions"
                                rules={[{
                                    validator: async (_, value) => {
                                        const numValue = Number(value);
                                        if (updateForm.getFieldValue('salary_type') === 'percentage' && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
                                            throw new Error('Foiz 0 dan 100 gacha bo‘lishi kerak');
                                        }
                                    },
                                }]}
                                className="form-item"
                            >
                                <Input
                                    type="number"
                                    placeholder="Qabul foizini kiriting (0-100)"
                                    defaultValue={0}
                                    onChange={(e) => updateForm.setFieldsValue({ percentage_from_admissions: e.target.value ? Number(e.target.value) : 0 })}
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Qabul narxi"
                            name="admission_price"
                            rules={[{
                                validator: async (_, value) => {
                                    const numValue = Number(value);
                                    if (isNaN(numValue) || numValue < 0) {
                                        throw new Error('Qabul narxi 0 dan kam bo‘lmasligi kerak');
                                    }
                                },
                            }]}
                            className="form-item"
                        >
                            <Input
                                type="number"
                                placeholder="Qabul narxini kiriting"
                                defaultValue={0}
                                onChange={(e) => {
                                    updateForm.setFieldsValue({ admission_price: e.target.value ? Number(e.target.value) : 0 });
                                }}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item className="form-submit">
                        <Button type="primary" htmlType="submit" block>
                            Yangilash
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Workers;