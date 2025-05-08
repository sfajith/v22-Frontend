import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/authSlice";
import { loginUser } from "../../features/auth/authService";

// Formulario de inicio de sesión que autentica al usuario y guarda el token
function LoginForm() {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();

  // Inicia el proceso de login y guarda el token si es exitoso
  const handleLogin = async () => {
    try {
      dispatch(loginStart());
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });
      dispatch(loginSuccess(data));
      console.log(data);
      localStorage.setItem("token", data.token);
      console.log(data);
    } catch (error) {
      dispatch(loginFailure(error));
      console.error("Error en el login", error);
    }
  };

  return (
    <div>
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
        <button
          className="bg-gradient-mascoti buttom-mascoti"
          onClick={() => {
            handleLogin();
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
