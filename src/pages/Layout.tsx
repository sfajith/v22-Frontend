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

  // Manejador de recarga de página con toast.promise
  useEffect(() => {
    const getData = () => {
      checkToken()
        .then((data) => {
          if (data.accessToken) {
            dispatch(
              loginSuccess({ accessToken: data.accessToken, user: data.user })
            );
          }
        })
        .catch((error) => {
          toast.error("Sesión expirada");
        });
    };
    getData();
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
