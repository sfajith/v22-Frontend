import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ButtomHospet } from "@/components/ui/ButtomHospet";
import { newLink } from "../features/links/linkService";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { startLink, createdLink, cleanLink } from "../features/links/linkSlice";
import { LinkList } from "../components/Home/LinkList";
import CardList from "../components/myAccount/CardList";
import { FiCopy } from "react-icons/fi";
import { toast } from "sonner";
import { useUserCollection } from "../app/hooks/useUserCollection";
import {
  addNewLink,
  loadLocalCollection,
  globalError,
} from "../features/auth/authSlice";
import { AlertCircle, CheckCircle } from "lucide-react";
import { lazy, Suspense } from "react";

const UserCode = lazy(() => import("../components/UserCode"));

function Home() {
  // `userCode` es opcional y se usa solo cuando el usuario quiere personalizar la URL
  const [form, setForm] = useState<{
    originalUrl: string;
    userCode?: string;
    isValidCode: boolean;
    isValidUrl: string | null;
  }>({ originalUrl: "", userCode: "", isValidCode: true, isValidUrl: null });

  const [showLink, setShowLink] = useState<string>("");
  const [custom, setCustom] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const linkState = useAppSelector((state) => state.link);

  const {
    handlerLoadCollection,
    isAuthenticated,
    collection,
    deleteLinkHandler,
    accessToken,
  } = useUserCollection();

  // Al montar el componente, cargamos los enlaces desde el backend si el usuario está autenticado,
  // o desde el localStorage si es un usuario no registrado
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadLocalCollection());
    }
  }, []);

  //Esquema paravalidar las url ingresadas por el usuario
  useEffect(() => {
    const handler = setTimeout(() => {
      newLinkFieldValidator();
    }, 500);

    return () => clearTimeout(handler);
  }, [form.originalUrl]);

  const newLinkFieldValidator = () => {
    toast.dismiss();
    if (!form.originalUrl) {
      return;
    }

    try {
      new URL(form.originalUrl);
      toast.success("Es una URL valida");
      setForm({ ...form, isValidUrl: "URL valida" });
    } catch (error) {
      setForm({ ...form, isValidUrl: "error" });
      toast.error("No es una URL valida");
    }
  };

  const newLinkPayload = {
    token: accessToken,
    link: {
      originalUrl: form.originalUrl,
      userCode: form.userCode,
    },
  };

  // Maneja la creación de un nuevo enlace:
  // Si el usuario está autenticado, se guarda en el estado global.
  const newLinkHandler = async () => {
    toast.dismiss();
    if (!form.originalUrl) {
      toast.error("Debes introducir un enlace!");
      return;
    }
    if (!form.isValidUrl) {
      toast.error("Introduce una URL valida");
      return;
    }
    if (!form.isValidCode) {
      toast.error("Tu codigo personalizado es invalido");
      return;
    }
    try {
      dispatch(startLink());
      const link = await newLink(newLinkPayload);
      setShowLink(link.shorter);
      if (!isAuthenticated) {
        const storedLinks = localStorage.getItem("links");
        const linksArray = storedLinks ? JSON.parse(storedLinks) : [];
        linksArray.push(link);
        localStorage.setItem("links", JSON.stringify(linksArray));
        dispatch(createdLink());
        setForm({
          originalUrl: "",
          userCode: "",
          isValidCode: true,
          isValidUrl: "URL valida",
        });
        setCustom(false);
      }
      dispatch(addNewLink({ link }));
      toast.success("Enlace acortado con exito!");
      if (form.originalUrl) {
        setForm({
          originalUrl: "",
          userCode: "",
          isValidCode: true,
          isValidUrl: "URL valida",
        });
      }
    } catch (error: unknown) {
      dispatch(cleanLink());
      const err = error as Error;
      dispatch(globalError(err.message));
      toast.error(err.message);
    }
  };
  // Copia el enlace corto en el portapapeles
  const copyToClipboard = (shorter: string) =>
    navigator.clipboard.writeText(shorter);

  // Alterna la opción para habilitar o deshabilitar enlaces personalizados
  const customLinkHandler = () => {
    if (!custom) {
      setForm({ ...form, userCode: "", isValidCode: true });
    }
    setCustom(!custom);
  };

  return (
    <motion.div
      // Contenedor principal con animación de entrada al renderizar la vista
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-center"
      style={{ height: "calc(100vh - 144px)" }}
    >
      <div className="flex flex-col justify-center basis-[40%]">
        <AnimatePresence mode="wait">
          {!linkState.generated ? (
            // Título animado cuando aún no se ha generado un enlace
            <motion.div
              key="first"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-[linear-gradient(90deg,rgba(196,121,128,1)_0%,rgba(166,63,128,1)_30%,rgba(138,27,128,1)_69%,rgba(97,75,175,1)_100%)] tracking-tight">
                Acortador de enlaces
              </h1>
            </motion.div>
          ) : (
            // Mostrar enlace generado con opción de copiar
            <motion.div
              className="flex justify-center"
              key="second"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => {
                  copyToClipboard(showLink);
                  toast.success(`Enlace copiado con exito ${showLink}`);
                }}
                className="text-2xl font-bold text-[#751B80] text-center  rounded-lg border-dashed border-2 border-[#751B80] w-1/3 flex justify-evenly items-center cursor-pointer"
              >
                <h2>{showLink}</h2>
                <FiCopy />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Campo de entrada para la URL original */}
        <motion.div className="flex flex-col mt-4">
          <div className="flex items-center w-1/2 gap-1 mx-auto">
            <Input
              type="text"
              value={form.originalUrl}
              required
              className="rounded-full relatve"
              placeholder="Pega el enlace que deseas acortar..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, originalUrl: e.target.value });
              }}
            />
            <div className="relative w-5 h-5">
              <AnimatePresence mode="wait">
                {form.isValidUrl === "URL valida" && form.originalUrl && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
                {form.isValidUrl === "error" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {custom && (
              <motion.div
                key="usercode"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center mx-auto mt-4">
                      <svg
                        className="w-6 h-6 text-gray-400 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      <span className="ml-2 text-gray-400">
                        Cargando personalizador...
                      </span>
                    </div>
                  }
                >
                  <UserCode form={form} setForm={setForm} />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botones para personalizar o acortar el enlace */}
        <div className="flex justify-center w-full gap-10 mt-5">
          {custom ? (
            <ButtomHospet content="Cancelar" job={customLinkHandler} />
          ) : (
            <ButtomHospet
              content="Personalizar enlace"
              job={customLinkHandler}
            />
          )}
          <ButtomHospet content="Acortar enlace" job={newLinkHandler} />
        </div>
      </div>

      {/* Lista de enlaces generados, según si el usuario está autenticado o no */}
      <div className="flex justify-center flex-1">
        {isAuthenticated ? (
          <div className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground">
              Mostrando {collection.userLinks.length} de {collection.totalCount}{" "}
              enlaces
            </div>
            <CardList
              collection={collection}
              handlerLoadCollection={handlerLoadCollection}
              isAuthenticated={isAuthenticated}
              deleteLinkHandler={deleteLinkHandler}
            />
          </div>
        ) : (
          <LinkList
            deleteLinkHandler={deleteLinkHandler}
            collection={collection}
          />
        )}
      </div>
    </motion.div>
  );
}

export default Home;
