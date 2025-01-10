import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import imgSide from "/Frame 7.png"

const Register = ({ url }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/register`, data, {
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
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 thin-scroll">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden">
              <CardContent className="grid p-0 md:grid-cols-2">
                <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Bienvenido a SIZAE</h1>
                      <p className="text-balance text-muted-foreground">
                        Crea tu cuenta ahora
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Usuario:</Label>
                      <Input
                        id="username"
                        type="text"
                        {...register("username", { required: true })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo:</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register("email", { required: true })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Contraseña:</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...register("pass", { required: true })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {loading ? "Registrando..." : "Registrar"}
                    </Button>
                    <div className="text-center text-sm">
                      Ya tienes una cuenta?{" "}
                      <a href="/login" className="underline underline-offset-4">
                        Inicia Sesión
                      </a>
                    </div>
                  </div>
                </form>
                <div className="relative hidden bg-muted md:block">
                  <img
                    src={imgSide}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              Al momento de hacer click, estas aceptando{" "}
              <a href="#">Terminos de Servicio</a> y{" "}
              <a href="#">Politica y Privacidad</a>.
            </div>
          </div>
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
