import React, { useEffect, useState } from "react";
import logo from "/isologo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({url}) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  },[user])

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, pass };
    try {
      const response = await axios.post(`http://${url}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        console.log(response.data);
        setLoading(false);
        navigate("/");
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
        setLoading(false);
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-tr from-[#0F0C29] via-[#302B63] to-[#24243E] h-full w-full flex items-center justify-center">
      <div className="w-full max-w-96 h-auto py-6 rounded-xl bg-white backdrop-blur-3xl bg-opacity-20 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center px-5"
        >
          <img src={logo} className="w-14" />
          <h3 className="text-2xl font-semibold text-white mt-3">
            Inicia Sesión en SIZAE
          </h3>
          <p className="text-base font-medium text-white self-start mt-5">
            Correo:
          </p>
          <input
            type="text"
            className="w-full h-9 rounded outline-none pl-2 mt-2 text-base text-black"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <p className="text-base font-medium text-white self-start mt-3">
            Contraseña:
          </p>
          <input
            type="text"
            className="w-full h-9 rounded outline-none pl-2 mt-2 text-base text-black"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#0077FF] text-[#ffffff] text-base font-semibold mt-5"
            onClick={() => setLoading(true)}
          >
            {loading ? "Logging..." : "Log In"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Login;
