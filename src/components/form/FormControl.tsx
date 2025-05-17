import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useAppSelector } from "../../app/hooks";

import { useState } from "react";

function FormControl() {
  const ui = useAppSelector((state) => state.ui);

  return (
    <nav className="flex border rounded-lg py-1 px-1">
      <RegisterForm />
      <LoginForm />
    </nav>
  );
}

export default FormControl;
