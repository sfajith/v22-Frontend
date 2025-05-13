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
import { Error } from "../components/form/Error";

function Home() {
  // `userCode` es opcional y se usa solo cuando el usuario quiere personalizar la URL
  const [form, setForm] = useState<{
    originalUrl: string;
    userCode?: string;
  }>({ originalUrl: "", userCode: "" });

  const [showLink, setShowLink] = useState<string>("");
  const [custom, setCustom] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const linkState = useAppSelector((state) => state.link);

  const {
    handlerLoadCollection,
    isAuthenticated,
    collection,
    deleteLinkHandler,
  } = useUserCollection();

  // Al montar el componente, cargamos los enlaces desde el backend si el usuario está autenticado,
  // o desde el localStorage si es un usuario no registrado
  useEffect(() => {
    handlerLoadCollection();
    if (!isAuthenticated) {
      dispatch(loadLocalCollection());
    }
  }, []);

  const newLinkPayload = {
    token: localStorage.getItem("token"),
    link: {
      originalUrl: form.originalUrl,
      userCode: form.userCode,
    },
  };

  // Maneja la creación de un nuevo enlace:
  // Si el usuario está autenticado, se guarda en el estado global.
  // Si no lo está, se almacena en localStorage para persistencia local.
  const newLinkHandler = async () => {
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
        setForm({ originalUrl: "", userCode: "" });
        setCustom(false);
      }
      dispatch(addNewLink({ link }));
    } catch (error: unknown) {
      dispatch(cleanLink());
      const err = error as Error;
      dispatch(globalError(err.message));
    }
  };
  // Copia el enlace corto en el portapapeles
  const copyToClipboard = (shorter: string) =>
    navigator.clipboard.writeText(shorter);

  // Alterna la opción para habilitar o deshabilitar enlaces personalizados
  const customLinkHandler = () => {
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
              <h1 className="text-3xl font-bold text-[#751B80] text-center">
                Acortador de enlaces!
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
                className="text-2xl font-bold text-[#751B80] text-center border rounded-lg border-dashed border-2 border-[#751B80] w-1/3 flex justify-evenly items-center cursor-pointer"
              >
                <h2>{showLink}</h2>
                <FiCopy />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Campo de entrada para la URL original */}
        <motion.div className="flex flex-col mt-4 mx-auto w-1/2">
          <Input
            type="text"
            value={form.originalUrl}
            required
            className="rounded-full"
            placeholder="Pega el enlace que deseas acortar..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setForm({ ...form, originalUrl: e.target.value });
            }}
          />

          <AnimatePresence>
            {custom && (
              // Campo adicional para personalizar el enlace (si custom está activo)
              <motion.div
                className="flex mt-4 mx-auto items-center justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl text-gray-500">
                  http://localhost:3000/
                </h3>
                <Input
                  type="text"
                  value={form.userCode}
                  className="w-1/4 rounded-full"
                  placeholder="Tu codigo..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setForm({ ...form, userCode: e.target.value });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botones para personalizar o acortar el enlace */}
        <div className="flex justify-center gap-10 mt-5 w-full">
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
      <div className="flex flex-1 justify-center">
        {isAuthenticated ? (
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center">
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
