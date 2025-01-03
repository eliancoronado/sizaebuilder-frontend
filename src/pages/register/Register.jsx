import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "/isologo.png";

const Register = ({ url }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://${url}/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="relative bg-gradient-to-tr from-[#0F0C29] via-[#302B63] to-[#24243E] h-full w-full flex items-center justify-center">
      <div className="w-full max-w-96 h-auto py-6 rounded-xl bg-white backdrop-blur-3xl bg-opacity-20 flex flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center px-5"
        >
          <img src={logo} className="w-14" alt="Logo" />
          <h3 className="text-2xl font-semibold text-white mt-3">
            Registrate en SIZAE
          </h3>
          <p className="text-base font-medium text-white self-start mt-5">
            Usuario:
          </p>
          <input
            type="text"
            className="w-full h-9 rounded outline-none pl-2 mt-2 text-base text-black"
            {...register("username", { required: true })}
          />
          <p className="text-base font-medium text-white self-start mt-5">
            Correo:
          </p>
          <input
            type="email"
            className="w-full h-9 rounded outline-none pl-2 mt-2 text-base text-black"
            {...register("email", { required: true })}
          />
          <p className="text-base font-medium text-white self-start mt-3">
            Contraseña:
          </p>
          <input
            type="password"
            className="w-full h-9 rounded outline-none pl-2 mt-2 text-base text-black"
            {...register("pass", { required: true })}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#0077FF] text-[#ffffff] text-base font-semibold mt-5"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
          <p className="text-sm font-medium text-white self-end mt-4">
            No tienes una cuenta{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#3392ff] cursor-pointer underline"
            >
              Registrate
            </span>
          </p>
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

export default Register;
