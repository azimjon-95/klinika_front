import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiLockKeyFill } from "react-icons/pi";
import { message } from "antd";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from "../../api";
import bg from "../../assets/bg.svg";
import wave from "../../assets/wave.png";
import imgDoc from "../../assets/singleImg.png";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/admin/login", { login, password });
      const { message: successMessage, innerData } = res.data;
      message.success(successMessage);
      localStorage.setItem(
        "doctor",
        `${innerData?.admin.firstName} ${innerData?.admin.lastName}`.trim()
      );
      localStorage.setItem("token", innerData?.token);
      localStorage.setItem("role", innerData?.admin.role);
      navigate(`/${innerData?.admin.role}`);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Tizimga kirishda xatolik yuz berdi!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Loginbodylog">
      <img className="wave" src={wave} alt="kirish" />
      <div className="containerlog">
        <div className="imgLog">
          <img src={bg} alt="kirish" />
        </div>
        <div className="login-content">
          <form className="FormLogin" onSubmit={onFinishHandler}>
            <img src={imgDoc} alt="kirish LOGO" />
            <h2>Tizimga kirish</h2>
            <div className="input-div one">
              <div className="iconCont">
                <FaUser />
              </div>
              <div className="Inputdiv">
                <input
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="login"
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="iconCont">
                <PiLockKeyFill />
              </div>
              <div className="Inputdiv">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={!eye ? "password" : "text"}
                  className="input"
                  placeholder="parol"
                />
                <button type="button" onClick={() => setEye(!eye)}>
                  {eye ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>
            <button type="submit" className="btnIN" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Yuklanmoqda...
                </span>
              ) : (
                "Kirish"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;



