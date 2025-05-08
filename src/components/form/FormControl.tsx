import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useAppSelector } from "../../app/hooks";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

function FormControl() {
  const ui = useAppSelector((state) => state.ui);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Registrarse</MenubarTrigger>
        <MenubarContent>
          <RegisterForm ui={ui} />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Iniciar Sesion</MenubarTrigger>
        <MenubarContent>
          <LoginForm />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default FormControl;
