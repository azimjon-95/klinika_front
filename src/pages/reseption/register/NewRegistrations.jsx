import React, { useRef, useState } from 'react';
import { useGetAllTodaysQuery } from '../../../context/todaysApi';
import { Table, Spin, Button, Typography } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from "react-to-print";
import { PhoneNumberFormat } from '../../../hook/NumberFormat';
import { capitalizeFirstLetter } from '../../../hook/CapitalizeFirstLitter';
import ModelCheck from '../../../components/check/modelCheck/ModelCheck';

const { Title } = Typography;

const NewRegistrations = () => {
    const { data: allStories, isLoading: isLoadingAllStories, isError } = useGetAllTodaysQuery();
    const contentRef = useRef(null);
    const [data, setData] = useState(null);
    // Print function for individual row

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
    const handleRowPrint = (record) => {

        const story = {
            doctor: {
                specialization: record?.doctorId?.specialization,
                firstname: record?.doctorId?.firstName,
                lastname: record?.doctorId?.lastName,
                phone: record?.doctorId?.phone || " ",
                createdAt: record?.doctorId?.createdAt,
                admission_price: record?.doctorId?.admission_price
            },
            patient: {
                firstname: record?.patientId?.firstname,
                lastname: record?.patientId?.lastname,
                paymentType: record?.paymentType,
                order_number: record?.order_number
            }
        }

        // Redux store'ga ma'lumot yuborish
        if (record) {
            setData(story)
            // // Print qilish uchun biroz kutish (DOM update bo'lishi uchun)
            setTimeout(() => {
                reactToPrintFn();
            }, 300);
        }

    };

    // Table columns configuration
    const columns = [
        {
            title: 'Navbati',
            dataIndex: 'order_number',
            key: 'order_number',
            align: "center"
        },
        {
            title: 'Bemor ismi',
            key: 'patient_name',
            render: (_, record) => `${record.patientId.firstname} ${record.patientId.lastname}`,
        },
        {
            title: 'Telefon',
            dataIndex: ['patientId', 'phone'],
            key: 'phone',
            render: (phone) => `${PhoneNumberFormat(phone)}`,
        },
        {
            title: 'To\'lov turi',
            dataIndex: 'paymentType',
            key: 'paymentType',
            render: (paymentType) => `${capitalizeFirstLetter(paymentType)}`
        },
        {
            title: 'To\'lov summasi',
            dataIndex: 'payment_amount',
            key: 'payment_amount',
            render: (amount) => `${amount.toLocaleString()} so'm`,
            width: 120,
        },
        {
            title: 'Soat',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => {
                const d = new Date(date);
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            },
        },
        {
            title: 'Chop etish',
            key: 'actions',
            align: "center",
            render: (_, record) => (
                <Button
                    icon={<PrinterOutlined />}
                    onClick={() => handleRowPrint(record)}
                    size="small"
                    className="no-print"
                />
            ),
        },
    ];
    const tableStyles = `
        @media print {
            .no-print {
                display: none;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 6px;
            }
            th {
                background-color: #f2f2f2;
            }
        }
        .ant-table-tbody > tr > td {
            padding: 8px !important;
            font-size: 12px !important;
        }
        .ant-table-thead > tr > th {
            padding: 8px !important;
            font-size: 13px !important;
        }
        .ant-table-row {
            height: 40px !important;
        }
    `;
    const sortedData = allStories?.innerData
        ? [...allStories.innerData].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];

    return (
        <div className="registration-container">
            <style>{tableStyles}</style>
            <Title level={4} className="registration-title">
                Qabulni kutyotkan bemorlar
            </Title>
            {isLoadingAllStories ? (
                <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={sortedData}
                    rowKey="_id"
                    bordered
                    pagination={false}
                    size="small"
                    style={{ background: '#fff' }}
                />
            )}

            {/* Print component - data bor bo'lsa ko'rsatiladi */}
            <div style={{ display: "none" }}>
                <ModelCheck data={data} contentRef={contentRef} />
            </div>
        </div>
    );
};

export default NewRegistrations;