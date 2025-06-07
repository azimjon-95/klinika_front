import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, BedDouble, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import DoctorsSlite from './doctorsSlite/doctorsSlite';
import './clinicDashboard.css';

const Dashboard = () => {
    const { selectedMonth } = useSelector((state) => state.month);

    // Mock data for multiple months
    const monthlyStats = [
        {
            month: '2025-06',
            totalPatients: 1500,
            inpatients: 100,
            totalIncome: 180000000,
            totalExpenses: 120000000,
            profit: 60000000,
        },
        {
            month: '2025-05',
            totalPatients: 1350,
            inpatients: 92,
            totalIncome: 155000000,
            totalExpenses: 110000000,
            profit: 45000000,
        },
        {
            month: '2025-01',
            totalPatients: 1247,
            inpatients: 89,
            totalIncome: 145000000,
            totalExpenses: 98000000,
            profit: 47000000,
        },
        {
            month: '2024-12',
            totalPatients: 1109,
            inpatients: 82,
            totalIncome: 125663717,
            totalExpenses: 91495327,
            profit: 42000000,
        },
    ];

    // Daily data for multiple months, including complete data for 2025-06 (June 1 to June 30)
    const dailyData = [
        // For 2025-01 (unchanged)
        { month: '2025-01', day: 1, income: 4500000, expenses: 3200000, patients: 42 },
        { month: '2025-01', day: 2, income: 5200000, expenses: 3100000, patients: 38 },
        // For 2025-06 (complete data for all 30 days)
        { month: '2025-06', day: 1, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 2, income: 5900000, expenses: 3900000, patients: 49 },
        { month: '2025-06', day: 3, income: 6100000, expenses: 4100000, patients: 51 },
        { month: '2025-06', day: 4, income: 5800000, expenses: 3800000, patients: 48 },
        { month: '2025-06', day: 5, income: 6200000, expenses: 4200000, patients: 52 },
        { month: '2025-06', day: 6, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 7, income: 5700000, expenses: 3700000, patients: 47 },
        { month: '2025-06', day: 8, income: 6100000, expenses: 4100000, patients: 51 },
        { month: '2025-06', day: 9, income: 5900000, expenses: 3900000, patients: 49 },
        { month: '2025-06', day: 10, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 11, income: 5800000, expenses: 3800000, patients: 48 },
        { month: '2025-06', day: 12, income: 6200000, expenses: 4200000, patients: 52 },
        { month: '2025-06', day: 13, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 14, income: 5700000, expenses: 3700000, patients: 47 },
        { month: '2025-06', day: 15, income: 6100000, expenses: 4100000, patients: 51 },
        { month: '2025-06', day: 16, income: 5900000, expenses: 3900000, patients: 49 },
        { month: '2025-06', day: 17, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 18, income: 5800000, expenses: 3800000, patients: 48 },
        { month: '2025-06', day: 19, income: 6200000, expenses: 4200000, patients: 52 },
        { month: '2025-06', day: 20, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 21, income: 5700000, expenses: 3700000, patients: 47 },
        { month: '2025-06', day: 22, income: 6100000, expenses: 4100000, patients: 51 },
        { month: '2025-06', day: 23, income: 5900000, expenses: 3900000, patients: 49 },
        { month: '2025-06', day: 24, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 25, income: 5800000, expenses: 3400000, patients: 49 },
        { month: '2025-06', day: 26, income: 6200000, expenses: 4200000, patients: 52 },
        { month: '2025-06', day: 27, income: 6000000, expenses: 4000000, patients: 50 },
        { month: '2025-06', day: 28, income: 5700000, expenses: 3700000, patients: 47 },
        { month: '2025-06', day: 29, income: 6100000, expenses: 4100000, patients: 51 },
        { month: '2025-06', day: 30, income: 5500000, expenses: 3500000, patients: 47 },
    ];

    // Debit/credit data for multiple months, including complete data for 2025-06 (June 1 to June 30)
    const debitCreditData = [
        // For 2025-01 (unchanged)
        { month: '2025-01', date: '2025-01-01', type: 'Debit', amount: 4500000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-01', date: '2025-01-01', type: 'Credit', amount: 1200000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-01', date: '2025-01-01', type: 'Credit', amount: 800000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-01', date: '2025-01-02', type: 'Debit', amount: 5200000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-01', date: '2025-01-02', type: 'Credit', amount: 900000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        // For 2025-06 (complete data for all 30 days)
        { month: '2025-06', date: '2025-06-01', type: 'Debit', amount: 6000000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-01', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-01', type: 'Credit', amount: 1000000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-02', type: 'Debit', amount: 5900000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-02', type: 'Credit', amount: 1400000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-02', type: 'Credit', amount: 900000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-03', type: 'Debit', amount: 6100000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-03', type: 'Credit', amount: 1600000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-04', type: 'Debit', amount: 5800000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-04', type: 'Credit', amount: 1300000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-05', type: 'Debit', amount: 6200000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-05', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-05', type: 'Credit', amount: 1000000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-06', type: 'Debit', amount: 6000000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-06', type: 'Credit', amount: 1400000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-07', type: 'Debit', amount: 5700000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-07', type: 'Credit', amount: 1200000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-08', type: 'Debit', amount: 6100000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-08', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-09', type: 'Debit', amount: 5900000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-09', type: 'Credit', amount: 1300000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-10', type: 'Debit', amount: 6000000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-10', type: 'Credit', amount: 1400000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-11', type: 'Debit', amount: 5800000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-11', type: 'Credit', amount: 1200000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-12', type: 'Debit', amount: 6200000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-12', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-13', type: 'Debit', amount: 6000000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-13', type: 'Credit', amount: 1400000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-14', type: 'Debit', amount: 5700000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-14', type: 'Credit', amount: 1200000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-15', type: 'Debit', amount: 6100000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-15', type: 'Credit', amount: 1500000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-16', type: 'Debit', amount: 5900000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-16', type: 'Credit', amount: 1300000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-17', type: 'Debit', amount: 6000000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-17', type: 'Credit', amount: 1400000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-18', type: 'Debit', amount: 5800000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-18', type: 'Credit', amount: 1200000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-19', type: 'Debit', amount: 6200000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-19', type: 'Credit', amount: 1500000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-20', type: 'Debit', amount: 6000000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-20', type: 'Credit', amount: 1400000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-21', type: 'Debit', amount: 5700000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-21', type: 'Credit', amount: 1200000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-22', type: 'Debit', amount: 6100000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-22', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-23', type: 'Debit', amount: 5900000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-23', type: 'Credit', amount: 1300000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-24', type: 'Debit', amount: 6000000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-24', type: 'Credit', amount: 1400000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-25', type: 'Debit', amount: 5800000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-25', type: 'Credit', amount: 1200000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-26', type: 'Debit', amount: 6200000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-26', type: 'Credit', amount: 1500000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-27', type: 'Debit', amount: 6000000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-27', type: 'Credit', amount: 1400000, description: 'Maosh to\'lovi', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-28', type: 'Debit', amount: 5700000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-28', type: 'Credit', amount: 1200000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-29', type: 'Debit', amount: 6100000, description: 'Operatsiya va davolash', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-29', type: 'Credit', amount: 1500000, description: 'Kommunal to\'lovlar', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-30', type: 'Debit', amount: 5500000, description: 'Bemorlar davolash haqi', category: 'Daromad' },
        { month: '2025-06', date: '2025-06-30', type: 'Credit', amount: 1100000, description: 'Dori-darmonlar xarid', category: 'Xarajat' },
        { month: '2025-06', date: '2025-06-30', type: 'Credit', amount: 900000, description: 'Maosh to\'lovi', category: 'Xarajat' },
    ];

    // Function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Function to calculate percentage change
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return 0; // Avoid division by zero
        return ((current - previous) / previous * 100).toFixed(1);
    };

    // Filter data based on selectedMonth
    const currentMonthData = monthlyStats.find((stat) => stat.month === selectedMonth) || monthlyStats[0];
    const previousMonthData = monthlyStats.find((stat, index) => {
        const currentIndex = monthlyStats.findIndex((s) => s.month === selectedMonth);
        return currentIndex !== -1 && index === currentIndex + 1;
    }) || monthlyStats[1];

    // Filter dailyData and debitCreditData
    const filteredDailyData = dailyData.filter((data) => {
        if (selectedMonth === '2025-06') {
            return data.month === selectedMonth;
        }
        return data.month === selectedMonth;
    });

    const filteredDebitCreditData = debitCreditData.filter((data) => {
        if (selectedMonth === '2025-06') {
            return data.month === selectedMonth;
        }
        return data.month === selectedMonth;
    });

    // Calculate percentage changes
    const totalPatientsGrowth = calculatePercentageChange(currentMonthData.totalPatients, previousMonthData.totalPatients);
    const inpatientsGrowth = calculatePercentageChange(currentMonthData.inpatients, previousMonthData.inpatients);
    const totalIncomeGrowth = calculatePercentageChange(currentMonthData.totalIncome, previousMonthData.totalIncome);
    const totalExpensesGrowth = calculatePercentageChange(currentMonthData.totalExpenses, previousMonthData.totalExpenses);
    const profitGrowth = calculatePercentageChange(currentMonthData.profit, previousMonthData.profit);

    return (
        <div className="complex-root-container">
            <DoctorsSlite />
            <div className="complex-main-wrapper">
                {/* Stats Cards */}
                <div className="complex-stats-grid">
                    <div className="complex-stats-card complex-stats-card-blue">
                        <div className="complex-stats-card-flex">
                            <div>
                                <p className="complex-stats-label">Jami Bemorlar</p>
                                <p className="complex-stats-value">{currentMonthData.totalPatients.toLocaleString()}</p>
                                <p className={`complex-stats-trend-${totalPatientsGrowth >= 0 ? 'green' : 'red'}`}>
                                    {totalPatientsGrowth >= 0 ? '+' : ''}{totalPatientsGrowth}% o'tgan oyga nisbatan
                                </p>
                            </div>
                            <Users className="complex-icon-blue" />
                        </div>
                    </div>

                    <div className="complex-stats-card complex-stats-card-green">
                        <div className="complex-stats-card-flex">
                            <div>
                                <p className="complex-stats-label">Yotqizilgan Bemorlar</p>
                                <p className="complex-stats-value">{currentMonthData.inpatients}</p>
                                <p className={`complex-stats-trend-${inpatientsGrowth >= 0 ? 'green' : 'red'}`}>
                                    {inpatientsGrowth >= 0 ? '+' : ''}{inpatientsGrowth}% o'tgan oyga nisbatan
                                </p>
                            </div>
                            <BedDouble className="complex-icon-green" />
                        </div>
                    </div>

                    <div className="complex-stats-card complex-stats-card-purple">
                        <div className="complex-stats-card-flex">
                            <div>
                                <p className="complex-stats-label">Jami Daromad</p>
                                <p className="complex-stats-value complex-stats-value-income">{formatCurrency(currentMonthData.totalIncome)}</p>
                                <p className={`complex-stats-trend-${totalIncomeGrowth >= 0 ? 'green' : 'red'}`}>
                                    {totalIncomeGrowth >= 0 ? '+' : ''}{totalIncomeGrowth}% o'tgan oyga nisbatan
                                </p>
                            </div>
                            <TrendingUp className="complex-icon-purple" />
                        </div>
                    </div>

                    <div className="complex-stats-card complex-stats-card-red">
                        <div className="complex-stats-card-flex">
                            <div>
                                <p className="complex-stats-label">Jami Xarajat</p>
                                <p className="complex-stats-value complex-stats-value-income">{formatCurrency(currentMonthData.totalExpenses)}</p>
                                <p className={`complex-stats-trend-${totalExpensesGrowth >= 0 ? 'green' : 'red'}`}>
                                    {totalExpensesGrowth >= 0 ? '+' : ''}{totalExpensesGrowth}% o'tgan oyga nisbatan
                                </p>
                            </div>
                            <TrendingDown className="complex-icon-red" />
                        </div>
                    </div>
                </div>

                {/* Profit Card */}
                <div className="complex-profit-card">
                    <div className="complex-profit-flex">
                        <div>
                            <h2 className="complex-profit-title">Sof Foyda</h2>
                            <p className="complex-profit-value">{formatCurrency(currentMonthData.profit)}</p>
                            <p className="complex-profit-growth">
                                <span className="complex-profit-growth-icon">
                                    <TrendingUp className="complex-profit-icon" />
                                    {profitGrowth >= 0 ? '+' : ''}{profitGrowth}% o'sish
                                </span>
                            </p>
                        </div>
                        <DollarSign className="complex-profit-dollar-icon" />
                    </div>
                </div>

                {/* Charts */}
                <div className="complex-charts-grid">
                    {/* Line Chart */}
                    <div className="complex-chart-container">
                        <h3 className="complex-chart-title">Kunlik Daromad va Xarajat</h3>
                        <ResponsiveContainer className="complex-chart-responsive">
                            <LineChart data={filteredDailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        formatCurrency(value),
                                        name === 'income' ? 'Daromad' : 'Xarajat',
                                    ]}
                                    labelFormatter={(label) => `${label}-kun`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    name="Daromad"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    name="Xarajat"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="complex-chart-container">
                        <h3 className="complex-chart-title">Kunlik Bemorlar Soni</h3>
                        <ResponsiveContainer className="complex-chart-responsive">
                            <BarChart data={filteredDailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [value, 'Bemorlar']}
                                    labelFormatter={(label) => `${label}-kun`}
                                />
                                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Debit Credit Table */}
                <div className="complex-table-container">
                    <h3 className="complex-table-title">Debit-Kredit Jadvali</h3>
                    <div className="complex-table-overflow">
                        <table className="complex-table">
                            <thead>
                                <tr className="complex-table-header-row">
                                    <th className="complex-table-header-cell">Sana</th>
                                    <th className="complex-table-header-cell">Turi</th>
                                    <th className="complex-table-header-cell">Miqdor</th>
                                    <th className="complex-table-header-cell">Tavsif</th>
                                    <th className="complex-table-header-cell">Kategoriya</th>
                                </tr>
                            </thead>
                            <tbody className="complex-table-body">
                                {filteredDebitCreditData.map((item, index) => (
                                    <tr key={index} className="complex-table-row">
                                        <td className="complex-table-cell">{item.date}</td>
                                        <td className="complex-table-cell">
                                            <span className={`complex-table-cell-type-${item.type.toLowerCase()}`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="complex-table-cell complex-table-cell-amount">
                                            {formatCurrency(item.amount)}
                                        </td>
                                        <td className="complex-table-cell complex-table-cell-description">{item.description}</td>
                                        <td className="complex-table-cell">
                                            <span className={`complex-table-cell-category-${item.category.toLowerCase()}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="complex-table-summary">
                        <div className="complex-summary-card-debit">
                            <p className="complex-summary-label-debit">Jami Debit</p>
                            <p className="complex-summary-value complex-summary-value-debit">
                                {formatCurrency(filteredDebitCreditData.filter(item => item.type === 'Debit').reduce((sum, item) => sum + item.amount, 0))}
                            </p>
                        </div>
                        <div className="complex-summary-card-credit">
                            <p className="complex-summary-label-credit">Jami Kredit</p>
                            <p className="complex-summary-value complex-summary-value-credit">
                                {formatCurrency(filteredDebitCreditData.filter(item => item.type === 'Credit').reduce((sum, item) => sum + item.amount, 0))}
                            </p>
                        </div>
                        <div className="complex-summary-card-balance">
                            <p className="complex-summary-label-balance">Balans</p>
                            <p className="complex-summary-value complex-summary-value-balance">
                                {formatCurrency(
                                    filteredDebitCreditData.filter(item => item.type === 'Debit').reduce((sum, item) => sum + item.amount, 0) -
                                    filteredDebitCreditData.filter(item => item.type === 'Credit').reduce((sum, item) => sum + item.amount, 0)
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;