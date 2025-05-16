import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Loader({
  message = "Procesando solicitud...",
}: {
  message?: string;
}) {
  return (
    <motion.div
      className="max-w-md mx-auto mt-24 p-6 rounded-2xl shadow-lg bg-white text-center border border-gray-200"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex justify-center text-blue-500 mb-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 animate-spin" />
      </motion.div>
      <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
    </motion.div>
  );
}
