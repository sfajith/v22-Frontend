import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Ajusta según tu proyecto

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)] px-4">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-extrabold text-[#751B80] text-center tracking-tight leading-tight mb-6"
      >
        404 - Página no encontrada
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="max-w-md mb-6 text-base font-medium text-center text-zinc-600"
      >
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que
        la dirección sea incorrecta o que la página haya sido eliminada.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="pt-2"
      >
        <Button
          onClick={() => (window.location.href = "/")}
          className="w-full max-w-xs px-4 py-2 text-lg font-semibold tracking-tight text-white transition rounded-full cursor-pointer bg-gradient-mascoti hover:brightness-110"
        >
          Volver al inicio
        </Button>
      </motion.div>
    </div>
  );
}
