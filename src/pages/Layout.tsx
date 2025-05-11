import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import "../index.css";
import FormControl from "../components/form/FormControl";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { checkToken } from "../features/auth/authService";
import { loginSuccess } from "../features/auth/authSlice";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { AppSidebar } from "@/components/myAccount/App-sidebar";

function Layout() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const localToken: string | null = localStorage.getItem("token");

  //manejador de recarga de pagina
  useEffect(() => {
    const getData = async () => {
      const data = await checkToken(localToken);
      if (data.ok === true) {
        dispatch(loginSuccess({ localToken, user: data.user }));
      }
    };
    getData();
  }, []);

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
                      <Link to={"/cuenta"}>Analiticas</Link>
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
