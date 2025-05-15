import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function ErrorVerify({
  title = "Error",
  message = "Algo salió mal.",
  actionText = "Intentar de nuevo",
  actionLink = "/",
  error,
}: {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
  error?: string | null;
}) {
  const [enviado, setEnviado] = useState<boolean>();

  const errorHandler = () => {
    setEnviado(true);
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-24 p-6 rounded-2xl shadow-lg bg-white text-center border border-gray-200"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex justify-center text-red-500 mb-4"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <AlertTriangle className="w-12 h-12" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">
        {!enviado ? error : "Enlace Reenviado con exito"}
      </p>
      <motion.div whileHover={{ scale: 1.05 }}>
        <button
          className="inline-block px-5 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer"
          onClick={() => {
            errorHandler();
          }}
        >
          Reenviar Enlace
        </button>
      </motion.div>
    </motion.div>
  );
}
