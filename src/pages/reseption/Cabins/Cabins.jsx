import React, { useState, useRef, useEffect } from "react";
import { MdOutlineBedroomChild } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { FiUserPlus, FiEye } from "react-icons/fi";
import { ExclamationCircleFilled, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { TbElevator } from "react-icons/tb";
import { message, Button, Radio, Input, Form, Modal, Table, Row, Select } from "antd";
import { PiLockKeyFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import Door from "../../../assets/door.png"; // Ensure this path is correct
import { NumberFormat } from "../../../hook/NumberFormat";
import "./style.css";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useCloseRoomMutation,
} from "../../../context/roomApi";

const { Option } = Select;

const Cabins = () => {
  const [optenAddModal, setOptenAddModal] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [occupancyFilter, setOccupancyFilter] = useState("all");
  const modalRef = useRef(null);
  const kassir = localStorage.getItem("admin") || "admin";

  const { data: rooms, isLoading, error: fetchError } = useGetRoomsQuery();
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const [closeRoom, { isLoading: isClosing }] = useCloseRoomMutation();

  // Handle right-click to open modal
  const handleRightClick = (e) => {
    e.preventDefault();
    setOptenAddModal(true);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && optenAddModal) {
        setOptenAddModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [optenAddModal]);

  // Focus modal when it opens
  useEffect(() => {
    if (optenAddModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [optenAddModal]);

  // Handle fetch error
  useEffect(() => {
    if (fetchError) {
      message.error("Xonalar ro'yxatini olishda xatolik yuz berdi");
    }
  }, [fetchError]);

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Xonani o'chirib tashlaysizmi?",
      icon: <ExclamationCircleFilled />,
      okText: "Ha",
      okType: "danger",
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          await deleteRoom(id).unwrap();
          message.success("Xona muvaffaqiyatli o'chirildi");
        } catch (error) {
          message.error("Xonani o'chirishda xatolik yuz berdi");
        }
      },
    });
  };

  const toggleRoomStatus = async (id, closeRoomStatus) => {
    try {
      await closeRoom(id).unwrap();
      message.success(`Xona ${closeRoomStatus ? "ochildi" : "yopildi"}`);
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "pollux":
        return "Polyuks";
      case "luxury":
        return "Lyuks";
      case "free":
        return "Oddiy";
      default:
        return category;
    }
  };

  // Filter rooms based on category and occupancy
  const filteredRooms = rooms
    ? rooms?.innerData?.filter((room) =>
      categoryFilter === "all" ? true : room.category === categoryFilter
    )
      .filter((room) =>
        occupancyFilter === "all"
          ? true
          : occupancyFilter === "available"
            ? room.capacity.length < room.usersNumber
            : room.capacity.length === room.usersNumber
      )
      .sort((a, b) => a.roomNumber - b.roomNumber)
    : [];

  const columns = [
    {
      title: "Xona nomeri",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text) => (
        <div className="imgRoor">
          <img src={Door} alt="Door" />
          <div className="roomN">
            <b>{text}</b>
          </div>
        </div>
      ),
    },
    {
      title: "Qavati",
      key: "floor",
      render: (_, record) => (
        <div className="room_Box-length">
          <div>Qavat</div>
          <div>
            <TbElevator /> {record?.floor}
          </div>
        </div>
      ),
    },
    {
      title: "Xona sig'imi",
      dataIndex: "usersNumber",
      key: "usersNumber",
      render: (text) => (
        <div className="room_Box-length">
          <div>Xona sig'imi</div>
          <div>
            <MdOutlineBedroomChild /> {text}
          </div>
        </div>
      ),
    },
    {
      title: "Bemorlar soni",
      dataIndex: "capacity",
      key: "capacity",
      render: (_, record) => (
        <div className="room_Box-length">
          <div>Bemorlar soni</div>
          {record.capacity.length === record.usersNumber ? (
            <p className="busyRoom">Xonada joy yo'q</p>
          ) : record.capacity.length === 0 ? (
            <div className="emptyRoom">Bo'sh xona</div>
          ) : (
            <div>
              <FaUsers /> {record.capacity.length}
            </div>
          )}
        </div>
      ),
    },
    {
      title: `1 kunlik to'lov`,
      key: "pricePerDay",
      render: (data) => (
        <div className="room_Box-length">
          <div>
            1 kunlik to'lov | <b>{getCategoryLabel(data?.category)}</b>
          </div>
          <div>
            <GiMoneyStack /> {NumberFormat(data?.pricePerDay)} so'm
          </div>
        </div>
      ),
    },
    {
      title: "Xonaga kirish",
      key: "enterButton",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.capacity.length === 0}
          style={{
            display: "flex",
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
            width: 45,
          }}
        >
          <Link
            style={{ color: "#fff", marginTop: 5 }}
            to={`/room/${record._id}`}
          >
            <FiEye />
          </Link>
        </Button>
      ),
    },
    {
      title: "Bemor qo'shish",
      key: "openUpdate",
      render: (record) => {
        const isFull = record.capacity.length === record.usersNumber;
        const isLocked = record.closeRoom;
        const isDisabled = kassir === "buhgalter";

        if (isLocked) {
          return (
            <Button
              disabled={isDisabled}
              type="primary"
              danger
              style={{ padding: 0, fontSize: 18, width: 45 }}
              onClick={() => toggleRoomStatus(record._id, record.closeRoom)}
            >
              <PiLockKeyFill />
            </Button>
          );
        }

        if (isFull) {
          return (
            <Button
              disabled
              type="primary"
              style={{ padding: 0, fontSize: 18, width: 45 }}
            >
              <FiUserPlus style={{ fontSize: "22px" }} />
            </Button>
          );
        }

        return (
          <Link
            to={isDisabled ? "" : `/addpatient/${record._id}`}
            style={{ padding: 0, fontSize: 18, width: 45 }}
          >
            <Button disabled={isDisabled} type="primary">
              <FiUserPlus />
            </Button>
          </Link>
        );
      },
    },
    {
      title: "O'chirish",
      key: "delete",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          style={{
            display: "flex",
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
            width: 45,
          }}
          onClick={() => showDeleteConfirm(record._id)}
          disabled={kassir === "buhgalter"}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const onFinish = async (values) => {
    if (
      values.roomNumber <= 0 ||
      values.pricePerDay <= 0 ||
      values.usersNumber <= 0 ||
      values.floor <= 0
    ) {
      return message.warning("Xatolik: Iltimos, to'g'ri son kiritng");
    }
    if (values.usersNumber >= 6) {
      return message.warning(
        "Xatolik: Bir xonaga 6 tadan ko'p odam joylab bulmaydi."
      );
    }

    const roomData = {
      roomNumber: +values.roomNumber,
      pricePerDay: +values.pricePerDay,
      usersNumber: +values.usersNumber,
      floor: +values.floor,
      category: values.category,
    };

    try {
      await createRoom(roomData).unwrap();
      message.success("Xona muvaffaqiyatli qo'shildi");
      form.resetFields();
      setOptenAddModal(false);
    } catch (error) {
      message.error("Xona qo'shishda xatolik yuz berdi");
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const maxLength = 5;
    if (inputValue > maxLength) {
      setError(`Xona sig'imi ${maxLength} dan ko'proq bo'lishi mumkin emas!`);
    } else {
      setError("");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "end", gap: "16px", marginBottom: "14px" }}>
        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={(value) => setCategoryFilter(value)}
        >
          <Option value="all">Barcha kategoriyalar</Option>
          <Option value="free">Oddiy</Option>
          <Option value="luxury">Lyuks</Option>
          <Option value="pollux">Pol lyuks</Option>
        </Select>
        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={(value) => setOccupancyFilter(value)}
        >
          <Option value="all">Barcha xonalar</Option>
          <Option value="available">Joy borlar</Option>
          <Option value="full">Joy qolmagan</Option>
        </Select>
        <Button type="primary" onClick={handleRightClick}>
          Xona Qo'shish
        </Button>
      </div>
      <Table
        rowKey="_id"
        pagination={false}
        loading={isLoading || isDeleting || isClosing}
        bordered
        size="small"
        columns={columns}
        dataSource={filteredRooms}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`modalroom ${optenAddModal ? "modalroom-open" : "modalroom-closed"}`}
      >
        <div
          className="modalroom-overlay"
          onClick={() => setOptenAddModal(false)}
        />
        <div className="modalroom-content">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="FormApply"
          >
            <h4 style={{ textAlign: "center", lineHeight: "10px" }}>
              Xona qo'shish
            </h4>
            <Form.Item
              label="Xonaning raqami"
              name="roomNumber"
              rules={[{ required: true, message: "Iltimos, xona raqamini kiriting!" }]}
            >
              <Input type="number" placeholder="Xona raqami" />
            </Form.Item>
            <Form.Item
              label="Bir kunlik narxi"
              name="pricePerDay"
              rules={[{ required: true, message: "Iltimos, kunlik to‘lovi kiriting!" }]}
            >
              <Input type="number" placeholder="1 kunlik to'lovi" />
            </Form.Item>
            <Form.Item
              label="Xona sig'imi"
              name="usersNumber"
              validateStatus={error ? "error" : ""}
              help={error}
              rules={[{ required: true, message: "Iltimos, xona sigimini kiriting!" }]}
            >
              <Input
                type="number"
                placeholder="Ex: 4ta"
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              label="Qavat"
              name="floor"
              rules={[{ required: true, message: "Iltimos, qavatni kiriting!" }]}
            >
              <Input type="number" placeholder="Ex: 1-qavat" />
            </Form.Item>
            <Form.Item
              label="Lyuks yoki Pollyuks"
              name="category"
              rules={[{ required: true, message: "Iltimos, kategoriya tanlang!" }]}
            >
              <Radio.Group>
                <Radio value="free">Oddiy</Radio>
                <Radio value="luxury">Lyuks</Radio>
                <Radio value="pollux">Pol lyuks</Radio>
              </Radio.Group>
            </Form.Item>
            <Row style={{ display: "flex", gap: "5px" }}>
              <Button
                style={{ width: "88%" }}
                loading={isCreating}
                type="primary"
                htmlType="submit"
              >
                Saqlash
              </Button>
              <Button
                style={{
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setOptenAddModal(false)}
              >
                <CloseOutlined />
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Cabins;