import { useState } from "react";
import { registerUser } from "../../features/auth/authService";
import { useAppDispatch } from "../../app/hooks";
import { globalError } from "../../features/auth/authSlice";

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
      dispatch(
        globalError(
          error instanceof Error ? error.message : "Error en el registro"
        )
      );
    }
  };

  //barra de progreso

  return (
    <>
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
    </>
  );
}

export default RegisterForm;
