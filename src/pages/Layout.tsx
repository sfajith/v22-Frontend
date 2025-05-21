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
        try {
          const data = await checkToken(localToken);
          if (data.ok === true) {
            dispatch(loginSuccess({ localToken, user: data.user }));
            // Puedes mostrar un toast opcional si lo deseas:
            // toast.success("Sesión iniciada correctamente");
          }
          // Si el token no es válido, simplemente no hacemos nada
        } catch (error) {
          // Error al verificar el token (puedes manejarlo si lo deseas)
        }
      };

      getData();
    }
  }, []);

  // Mostrar errores o éxitos desde el slice, si existen
  useEffect(() => {
    if (auth.error) {
      // toast.error(auth.error);
      dispatch(disableError());
    }
    if (auth.success) {
      //  toast.success(auth.success);
      dispatch(disableSuccess());
    }
  }, [auth.error, auth.success]);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <div className="containerMenu">
          <div className="logoContainer">
            <img className="logo" src="/bitmap.png" alt="logo" />
          </div>
          <div className="flex items-center authMenu">
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

      <main className="container flex-1 px-4 mx-auto">
        <Outlet />
      </main>

      <footer className="w-full h-[24px] text-center bg-gradient-mascoti text-white text-[12px] tracking-widest flex justify-center items-center">
        <span>Created by Sherjan</span>
      </footer>
    </div>
  );
}

export default Layout;
