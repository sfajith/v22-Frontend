import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "sonner";
import Tooltipmanager from "../ui/Tooltipmanager";
import { motion } from "framer-motion";
import { PiClockCountdownBold } from "react-icons/pi";
import { addDays, parseISO, differenceInDays } from "date-fns";
import { useState } from "react";

// Tipado de las props que recibe el componente CardLink
type PropItem = {
  originalUrl: string;
  shortUrl: string;
  username?: string;
  linkId: string;
  clicks: number;
  visitors: number;
  deleteLinkHandler: (linkId: string) => void;
  isAuthenticated: boolean;
  date: string;
};

// Componente que representa una tarjeta individual de enlace acortado
function CardLink({
  originalUrl,
  shortUrl,
  linkId,
  deleteLinkHandler,
  clicks,
  visitors,
  isAuthenticated,
  date,
}: PropItem) {
  const [expired, setExpired] = useState<boolean>(false);

  const copyToClipboard = (shorter: string) =>
    navigator.clipboard.writeText(shorter);

  const expireTimeCalculator = () => {
    const fecha = addDays(parseISO(date.substring(0, 10)), 30);
    const fechaDiff = differenceInDays(fecha, new Date());
    if (fechaDiff === 0) {
      setExpired(true);
    }
    return fechaDiff;
  };

  const Uptime = expireTimeCalculator();

  return (
    <div
      className={`bg-[#f4f4f4] border rounded-lg w-full py-2 px-3 hover:border-[#751b80] transition-all duration-300 ease-in-out relative ${
        expired && "opacity-40"
      }`}
      key={linkId}
    >
      {/* Encabezado de la tarjeta con el enlace corto y botón de eliminación */}
      <div className="flex justify-between">
        {/* Muestra el enlace acortado con botón para copiar */}
        <div className="text-gray-800 bg-[#751b80] max-w-[90%] text-[14px] border rounded-lg border-dashed border-2 border-gray-300 mb-1 flex justify-between px-2 py-1 gap-3">
          <h3 className="text-white">{shortUrl}</h3>
          <div className="flex items-center">
            <FiCopy
              className="w-6 text-white cursor-pointer"
              onClick={() => {
                toast.success(`Enlace copiado con exito ${shortUrl}`);
                copyToClipboard(shortUrl);
              }}
            />
          </div>
        </div>
        {/* Botón para eliminar el enlace */}
        <button
          className="flex items-start cursor-pointer"
          onClick={() => {
            deleteLinkHandler(linkId);
          }}
        >
          <AiOutlineDelete />
        </button>
      </div>
      {/* Muestra el enlace original completo en un tooltip */}
      <Tooltipmanager
        children2={<p className="max-w-[200px] break-words">{originalUrl}</p>}
        children={
          <p className="text-[14px] text-gray-500 font-light w-70 truncate">
            {originalUrl}
          </p>
        }
      />
      {/* Sección de estadísticas de clics o mensaje de registro si no está autenticado */}
      <div className="w-full bg-gray-200 px-2 rounded-b-lg flex justify-evenly text-[12px] font-medium text-gray-700">
        {isAuthenticated ? (
          <>
            <p>Clics en el enlace: {clicks}</p>
            <p>Visitantes: {visitors}</p>
          </>
        ) : (
          <p>Registrate para ver estadisitcas</p>
        )}
      </div>
      {/* seccion de aviso de eliminacion de mensajes para usuarios no autenticados */}
      {!isAuthenticated && (
        <Tooltipmanager
          children2={
            expired ? (
              <p className="max-w-[200px] text-center">
                Este enlace expiró, registrate para tener enlaces permanentes
              </p>
            ) : (
              <p className="max-w-[200px] text-center">
                Este enlace expirará en {Uptime} días. Regístrate para
                mantenerlo activo permanentemente.
              </p>
            )
          }
          children={
            <div className="h-7 w-7 absolute bg-red-300 left-0 bottom-0 rounded-bl-lg rounded-tr-lg flex justify-center items-center text-white cursor-pointer">
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="text-[#ef4444]"
              >
                <PiClockCountdownBold />
              </motion.div>
            </div>
          }
        />
      )}
    </div>
  );
}

export default CardLink;
