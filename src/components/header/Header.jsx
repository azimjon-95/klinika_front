import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import { Calendar } from 'lucide-react';
import { RiLogoutCircleRLine, RiUser3Line, RiSearchLine, RiCloseLine } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logout } from '../../context/actions/authSlice';
import { toggleSearchPanel, setSearchQuery, clearSearchQuery } from '../../context/actions/authSearch';
import { setSelectedMonth } from '../../context/actions/monthSlice';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { adminFullname, role } = useSelector((state) => state.auth);
  const { isSearchOpen, searchQuery } = useSelector((state) => state.search);
  const { selectedMonth } = useSelector((state) => state.month);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchPanelRef = useRef(null);
  const profileToggleRef = useRef(null);

  // Set default date to current month
  const currentDate = new Date(); // Current date: 2025-06-05
  const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`; // '2025-06'


  // Compute selectedDate, ensuring it's a valid Date object
  const selectedDate = selectedMonth
    ? new Date(`${selectedMonth}-01T00:00:00`)
    : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const handleMonthChange = (date) => {
    if (date) {
      const formattedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      dispatch(setSelectedMonth(formattedMonth));
    }
  };

  const showLogoutModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    setIsModalOpen(false);
    dispatch(clearSearchQuery());
    navigate('/login');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const toggleProfilePanel = () => {
    setIsProfileOpen((prev) => !prev);
    if (isSearchOpen) {
      dispatch(toggleSearchPanel());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileOpen &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target) &&
        profileToggleRef.current &&
        !profileToggleRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    if (!selectedMonth || selectedMonth === '2025-01') {
      dispatch(setSelectedMonth(defaultMonth)); // Force set to '2025-06'
    }
  }, [selectedMonth, dispatch, defaultMonth]);

  const isDirectorPath = location.pathname === '/director';

  return (
    <header className="header">
      <div className="header-right">
        {isDirectorPath && (
          <div className="complex-header-flex">
            <Calendar className="complex-calendar-icon" />
            <DatePicker
              selected={selectedDate}
              onChange={handleMonthChange}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              className="complex-month-selector"
              placeholderText="Yil-Oy tanlang"
              calendarStartMonth={currentDate} // Ensure calendar opens to current month
            />
          </div>
        )}

        <div className="search-container">
          <button className="search-toggle" onClick={() => dispatch(toggleSearchPanel())} ref={profileToggleRef}>
            {isSearchOpen ? <RiCloseLine /> : <RiSearchLine />}
          </button>
          {isSearchOpen && (
            <div className="search-panel">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Qidirish..."
                className="search-input"
              />
            </div>
          )}
        </div>

        <button className="profile-btn" ref={searchPanelRef} onClick={toggleProfilePanel}>
          <RiUser3Line />
        </button>

        {isProfileOpen && (
          <div ref={profileToggleRef} className="profile-panel">
            <div className="profile-section">
              <RiUser3Line className="profile-icon" />
              <div>
                <p className="profile-name">{adminFullname || localStorage.getItem('doctor') || 'Admin'}</p>
                <p className="profile-role">{role || 'Role not specified'}</p>
              </div>
            </div>
            <button className="logout-btn" onClick={showLogoutModal}>
              <RiLogoutCircleRLine /> Chiqish
            </button>
          </div>
        )}
      </div>

      <Modal
        title="Tizimdan chiqmoqchimisiz?"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        centered
        maskClosable
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ className: 'logout-modal-ok', danger: true }}
        cancelButtonProps={{ className: 'logout-modal-cancel' }}
        footer={[
          <Button key="cancel" className="logout-modal-cancel" onClick={handleModalCancel}>
            Yo'q
          </Button>,
          <Button key="ok" className="logout-modal-ok" type="primary" danger onClick={handleModalOk}>
            Ha
          </Button>,
        ]}
      >
        <p>Chiqishni tasdiqlaysizmi?</p>
      </Modal>
    </header>
  );
}

export default Header;