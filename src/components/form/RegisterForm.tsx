import { useState } from "react";
import { registerUser } from "../../features/auth/authService";
import { useAppDispatch } from "../../app/hooks";
import {
  startRegister,
  finishRegister,
  errorRegister,
} from "../../features/ui/uiSlice";
import { Skeleton } from "@/components/ui/skeleton";

type UiProps = {
  ui: {
    isRegistered: boolean;
    isLoading: boolean;
    error: string | null;
  };
};

function RegisterForm({ ui }: UiProps) {
  const [form, setForm] = useState<{
    username: string;
    email: string;
    password: string;
    repassword: string;
  }>({ username: "", email: "", password: "", repassword: "" });

  const dispatch = useAppDispatch();

  //manejador de registro
  const handleRegister = async () => {
    dispatch(startRegister());
    setTimeout(async () => {
      try {
        const data = await registerUser({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        if (data.success) {
          return console.log("hola");
        }
      } catch (error) {
        dispatch(errorRegister(error));
        return console.log(error);
      }
    }, 3000);
  };

  //barra de progreso

  return (
    <>
      {!ui.isLoading ? (
        <div>
          <div className="formDiv">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, username: e.target.value });
              }}
            />
          </div>
          <div className="formDiv">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, email: e.target.value });
              }}
            />
          </div>
          <div className="formDiv">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, password: e.target.value });
              }}
            />
          </div>
          <div className="formDiv">
            <label htmlFor="repassword">Confirmar contraseña</label>
            <input
              className={
                form.password !== form.repassword
                  ? "focus:bg-red-100"
                  : "focus:bg-green-100"
              }
              type="password"
              name="repassword"
              id="repassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, repassword: e.target.value });
              }}
            />
          </div>
          <div className="formDiv">
            <button
              className="bg-gradient-mascoti buttom-mascoti"
              onClick={() => {
                handleRegister();
              }}
            >
              Crear cuenta
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="w-full h-[10px] rounded-full" />
          <p>
            Registrado con exito <br /> Inicie session
          </p>
        </div>
      )}
    </>
  );
}

export default RegisterForm;
