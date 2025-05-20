import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import "../index.css";
import FormControl from "../components/form/FormControl";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { checkToken } from "../features/auth/authService";
import {
  loginSuccess,
  disableError,
  disableSuccess,
} from "../features/auth/authSlice";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { AppSidebar } from "@/components/myAccount/App-sidebar";
import { toast } from "sonner";

function Layout() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const localToken: string | null = localStorage.getItem("token");

  // Manejador de recarga de página con toast.promise
  useEffect(() => {
    if (localToken) {
      const getData = async () => {
        await toast.promise(
          checkToken(localToken).then((data) => {
            if (data.ok === true) {
              dispatch(loginSuccess({ localToken, user: data.user }));
              // Mostramos éxito opcionalmente
              toast.success("Sesión iniciada correctamente");
            }
            // Si no ok, simplemente no hacemos nada (falló el token silenciosamente)
          }),
          {
            loading: "Verificando sesión...",
            success: "Verificación completada",
            // No usamos el toast de error, porque no se necesita
            error: () => null,
          }
        );
      };

      getData();
    }
  }, []);

  // Mostrar errores o éxitos desde el slice, si existen
  useEffect(() => {
    if (auth.error) {
      toast.error(auth.error);
      dispatch(disableError());
    }
    if (auth.success) {
      toast.success(auth.success);
      dispatch(disableSuccess());
    }
  }, [auth.error, auth.success]);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="containerMenu">
          <div className="logoContainer">
            <img className="logo" src="/bitmap.png" alt="logo" />
          </div>
          <div className="authMenu flex items-center">
            {!auth.isAuthenticated ? (
              <FormControl />
            ) : (
              <>
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>
                      <Link to={"/"}>Inicio</Link>
                    </MenubarTrigger>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger>
                      <Link to={"/cuenta"}>Analíticas</Link>
                    </MenubarTrigger>
                  </MenubarMenu>
                </Menubar>

                <AppSidebar
                  email={auth.user?.email}
                  username={auth.user?.username}
                />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4">
        <Outlet />
      </main>

      <footer className="w-full h-[24px] text-center bg-gradient-mascoti text-white text-[12px] tracking-widest flex justify-center items-center">
        <span>Created by Sherjan</span>
      </footer>
    </div>
  );
}

export default Layout;
