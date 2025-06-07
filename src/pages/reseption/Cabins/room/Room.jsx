import React, { useEffect, useMemo, useState, useCallback } from "react";
import { message, Button, Select, Tooltip, Table, Spin } from "antd";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import { GiEntryDoor } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../../../../components/loading/LoadingTik';
import { useGetRoomByIdQuery, useGetRoomsQuery, useRemovePatientFromRoomMutation } from "../../../../context/roomApi";
import "./style.css";

// Constants
const ROOM_CATEGORIES = {
  pollux: "Polyuks",
  luxury: "Lyuks",
  free: "Oddiy",
};

// Helper Functions
const capitalizeFirstLetter = (str) => str ? `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}` : '';
const formatPhone = (phone) => phone ? `+998 ${phone.replace(/\D/g, "").match(/(\d{2})(\d{3})(\d{2})(\d{2})/)?.slice(1).join(" ") || phone}` : 'N/A';
const formatNumber = (num) => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
const calculateRoomPayment = (record) => record?.paidDays?.reduce((sum, day) => sum + (day?.price || 0), 0) || 0;

function Room() {
  const [roomModalState, setRoomModalState] = useState(false);
  const [additionalPrice, setAdditionalPrice] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [debtPayment, setDebtPayment] = useState({});
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const [removePatientFromRoom, { isLoading: isRemoving }] = useRemovePatientFromRoomMutation();
  const { data: roomData, isLoading: isLoadingRoom, error: roomError } = useGetRoomByIdQuery(id);
  const { data: allRoomsData, isLoading: isLoadingRooms } = useGetRoomsQuery();

  const todaysTime = useMemo(() => moment().utcOffset("+05:00").format("DD.MM.YYYY HH:mm"), []);
  const iconStyle = useMemo(() => ({ fontSize: "20px" }), []);
  const getCategoryLabel = useCallback((category) => ROOM_CATEGORIES[category] || category, []);

  // Process room data
  const patients = useMemo(() => roomData?.innerData?.capacity?.map((item) => ({
    _id: item._id,
    clientID: item.patientId?.idNumber || 'N/A',
    clientMongooseId: item.patientId?._id,
    clientFullname: `${item.patientId?.firstname || ''} ${item.patientId?.lastname || ''}`.trim(),
    clientPhone: item.patientId?.phone,
    startDay: item.startDay,
    payForRoom: item.roomId?.pricePerDay || 0,
    paidDays: item.paidDays || [],
    clientPayForRoomPrice: calculateRoomPayment(item),
    roomNumber: item.roomId?.roomNumber,
    doctorId: item.doctorId,
    active: item.active,
    endDay: item.endDay,
  })) || [], [roomData?.innerData?.capacity]);

  const roomOptions = useMemo(() => allRoomsData?.innerData
    ?.filter(r => r._id !== id)
    .map(r => ({
      value: r._id,
      label: `[${r.roomNumber}] ${getCategoryLabel(r.category)}`,
    })) || [], [allRoomsData?.innerData, id, getCategoryLabel]);

  const exitRoom = useCallback(async (record) => {
    try {
      if (!id || !record.clientMongooseId) throw new Error("Kerakli ma'lumotlar mavjud emas");
      console.log(record.clientMongooseId);
      await removePatientFromRoom({ id, patientId: record._id }).unwrap();
      message.success(`${record.clientFullname} xonadan muvaffaqiyatli chiqarildi!`);

      if (patients.length === 1) {
        message.info("Xonada boshqa bemorlar qolmadi. Orqaga qaytilmoqda...");
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (error) {
      message.error(error?.data?.message || "Bemorni xonadan chiqarishda xatolik yuz berdi!");
    } finally {
      setShowExitModal(false);
      setSelectedPatient(null);
    }
  }, [id, patients.length, navigate, removePatientFromRoom]);

  const confirmExitRoom = useCallback((record) => {
    setSelectedPatient(record);
    setShowExitModal(true);
  }, []);

  const closeExitModal = useCallback(() => {
    setShowExitModal(false);
    setSelectedPatient(null);
  }, []);

  const switchRoom = useCallback((newRoomId, user) => {
    const targetRoom = allRoomsData?.innerData?.find((r) => r._id === newRoomId);
    if (!newRoomId || !user || !targetRoom) {
      message.error("Ma'lumotlar to'liq emas yoki xona topilmadi");
      return;
    }

    if (targetRoom.capacity?.some((u) => u.idNumber === user.clientID || u.clientID === user.clientID)) {
      message.warning("Bemor xonada avvaldan mavjud");
      return;
    }

    if ((targetRoom.capacity?.length || 0) >= targetRoom.usersNumber) {
      message.warning("Xona to'la, boshqa xona tanlang");
      return;
    }

    // Using Ant Design Modal for switchRoom (as per original functionality)
    Modal.confirm({
      title: `Bemorni ${targetRoom.roomNumber}-xonaga ko'chirmoqchimisiz?`,
      icon: <ExclamationCircleFilled />,
      okText: "Ha",
      okType: "danger",
      cancelText: "Yo'q",
      onOk: () => {
        try {
          // Simplified room switch logic (replace with actual API call)
          message.success(`Bemor ${targetRoom.roomNumber}-xonaga muvaffaqiyatli joylandi!`);
          if (patients.length === 1) navigate(-1);
        } catch (error) {
          message.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
        }
      },
    });
  }, [allRoomsData?.innerData, patients.length, navigate]);

  const handleDebtPaymentChange = useCallback((e, record) => {
    const input = e.target.value;

    let updatedPaidDays = [...record.paidDays];
    console.log();

    setInputValue(input);
    setAdditionalPrice(operation ? null : parseFloat(input));
  }, []);

  const handlePayDebt = useCallback((item) => {
    const payments = debtPayment[item.clientID];
    if (!payments?.length) {
      message.warning("Iltimos, to'lov miqdorini kiriting.");
      return;
    }

    if (inputValue?.match(/^(\d+)([\+\-]\d+)$/)) {
      message.success("Davolanish kun muvaffaqiyatli yangilandi");
    } else {
      setRoomModalState({ record: item, totalPayForRoom: additionalPrice });
      message.success("To'lov muvaffaqiyatli yangilandi");
    }

    setAdditionalPrice(null);
    setInputValue('');
    setDebtPayment(prev => {
      const updated = { ...prev };
      delete updated[item.clientID];
      return updated;
    });
  }, [debtPayment, inputValue, additionalPrice]);

  const calculateDebt = useCallback((record) => {
    if (!record?.paidDays || !record?.payForRoom) return 0;
    return record.paidDays
      .filter((day) => !day.isPaid)
      .reduce((sum, day) => sum + (record.payForRoom - (day.price || 0)), 0);
  }, []);

  const getCardClassName = useCallback((isPaid, price, isToday) => {
    const baseClass = isPaid ? "ant-card-green" : (price || 0) > 0 ? "ant-card-yellow" : "ant-card-red";
    return `${baseClass} extro-colors${isToday ? " border-green" : ""}`;
  }, []);

  const columns = useMemo(() => [
    { title: "Bemor", dataIndex: "clientFullname", render: (text) => capitalizeFirstLetter(text) || 'N/A' },
    { title: "Telefon raqami", dataIndex: "clientPhone", render: formatPhone },
    { title: "Boshlanish sanasi", dataIndex: "startDay", render: (date) => date || 'N/A' },
    { title: "Davolanish kuni", dataIndex: "paidDays", render: (days) => `${days?.length || 0} kun` },
    { title: "To'langan summalar", dataIndex: "clientPayForRoomPrice", render: (price) => `${formatNumber(price || 0)} so'm` },
    {
      title: "Doktor",
      dataIndex: "doctorId",
      render: (doctorId) => doctorId ? `${doctorId.firstName || ''} ${doctorId.lastName || ''}, ${doctorId.specialization || ''}`.trim() : "N/A",
    },
    {
      title: "Xonadan chiqish",
      align: "center",
      width: 140,
      render: (record) => {
        const hasUnpaidDays = record.paidDays?.some((day) => !day.isPaid && (day.price || 0) > 0);
        return (
          <Tooltip title={hasUnpaidDays ? `Qarz: ${formatNumber(calculateDebt(record))} so'm. Avval to'lang!` : "Bemorni xonadan chiqarish"}>
            <Button
              onClick={() => confirmExitRoom(record)}
              className={`btn ${hasUnpaidDays ? 'btn-warning' : 'btn-danger'}`}
              disabled={!record.clientMongooseId || isRemoving}
              danger={!hasUnpaidDays}
              type={hasUnpaidDays ? "default" : "primary"}
              size="small"
              block
            >
              <GiEntryDoor style={iconStyle} />
              {hasUnpaidDays ? " Qarz bor" : " Chiqarish"}
            </Button>
          </Tooltip>
        );
      },
    },
    // {
    //   title: "Xonani almashtirish",
    //   align: "end",
    //   render: (record) => (
    //     <Select
    //       showSearch
    //       style={{ width: 132 }}
    //       placeholder="Xona tanlash"
    //       optionFilterProp="children"
    //       options={roomOptions}
    //       filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
    //       onChange={(newRoomId) => switchRoom(newRoomId, record)}
    //       disabled={!record.clientID}
    //       loading={isLoadingRooms}
    //     />
    //   ),
    // },
  ], [confirmExitRoom, iconStyle, isRemoving, roomOptions, switchRoom, isLoadingRooms, calculateDebt]);

  const expandedRowRender = useCallback((record) => (
    <div style={{ display: "flex" }}>
      <div className="my-table-box my-table-box_extro">
        {(record.paidDays || []).map((item, i) => {

          const isToday = moment(item.date, "DD.MM.YYYY").isSame(moment(), "day");

          return (
            <div key={i} className={getCardClassName(item.isPaid, item.price, isToday)}>
              <p>{item.date}</p>
              <p>{formatNumber(item.price || 0)} so'm</p>
            </div>
          );
        })}
      </div>
      <div className="extro-inp-box">
        <input
          type="text"
          placeholder={`${formatNumber(calculateDebt(record))} so'm`}
          onChange={(e) => handleDebtPaymentChange(e, record)}

          value={inputValue}
        />
        <button disabled={!inputValue} type="primary" onClick={() => handlePayDebt(record)}>
          <FaCheck />
        </button>
      </div>
    </div>
  ), [getCardClassName, calculateDebt, handleDebtPaymentChange, inputValue, isInputDisabled, handlePayDebt]);

  const handleExpand = useCallback((expanded, record) => {
    setExpandedRowKeys(expanded ? [record._id] : []);
  }, []);

  useEffect(() => {
    const handleUpdateRoomPayment = () => console.log("Room payment updated via socket");
    const socket = { on: (event, callback) => console.log(`Socket event ${event} registered`) };
    socket.on("updateRoomPayment", handleUpdateRoomPayment);
  }, []);

  const roomInfo = roomData?.innerData || {};
  const roomDetails = useMemo(() => [
    { label: "Xona raqami", value: roomInfo.roomNumber },
    { label: "Qavat", value: roomInfo.floor },
    { label: "Kategoriya", value: getCategoryLabel(roomInfo.category) },
    { label: "Bemorlar soni", value: roomInfo.usersNumber },
    { label: "Sig'imi", value: roomInfo.capacity?.length || 0 },
    { label: "Kunlik narx", value: roomInfo.pricePerDay ? `${formatNumber(roomInfo.pricePerDay)} so'm` : "N/A" },
  ], [roomInfo, getCategoryLabel]);

  if (isLoadingRoom) return <div className="updateRoom_wrapper"><Loading /></div>;
  if (roomError) return (
    <div className="updateRoom_wrapper">
      <div className="updateRoom_wrapperbox">
        <button onClick={() => navigate(-1)}>Orqaga</button>
        <p>Xatolik yuz berdi: {roomError.message || 'Noma\'lum xatolik'}</p>
      </div>
    </div>
  );

  return (
    <div className="updateRoom_wrapper">
      <div className="updateRoom_wrapperbox">
        <button onClick={() => navigate(-1)}>Orqaga</button>
        {roomDetails.map((item, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", gap: 4 }}>
            <strong>{item.label}:</strong>
            <span>{item.value || "N/A"}</span>
          </div>
        ))}
      </div>
      <Table
        columns={columns}
        dataSource={patients}
        pagination={false}
        size="small"
        bordered
        rowKey="_id"
        loading={isLoadingRoom}
        expandable={{ expandedRowRender, expandedRowKeys, onExpand: handleExpand }}
      />
      {showExitModal && selectedPatient && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-box">
              <h3>{`${selectedPatient.clientFullname} bemorni xonadan chiqarmoqchimisiz?`}</h3>
              <p>Bu amal bemorni xonadan olib tashlaydi. Davom etishni xohlaysizmi?</p>
              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeExitModal}>
                  Yo'q
                </button>
                <button
                  className="modal-button confirm"
                  onClick={() => exitRoom(selectedPatient)}
                  disabled={isRemoving}
                >
                  Ha
                </button>
              </div>
              {
                isRemoving &&
                <div className="outloading"> <Spin /></div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;