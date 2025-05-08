import CardLink from "./Card";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "../../features/links/linkTypes";

type PropsCollection = {
  collection: {
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    userLinks: Link[];
  };
  username?: string;
  deleteLinkHandler: (linkId: string) => void;
  handlerLoadCollection: () => void;
  isAuthenticated: boolean;
};

function CardList({
  collection,
  deleteLinkHandler,
  handlerLoadCollection,
  isAuthenticated,
}: PropsCollection) {
  const loaderRef = useRef<HTMLDivElement>(null);

  // Hook que detecta cuando el loader es visible para cargar más elementos (paginación por scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setTimeout(() => {
            handlerLoadCollection();
          }, 500);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [handlerLoadCollection]);

  // Variantes para la animación de aparición de los ítems con framer-motion
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.01, // cada item se retrasa un poco más
      },
    }),
  };

  return (
    <div className="flex justify-center">
      {/* Contenedor scrollable con scrollbar personalizada */}
      <div className="h-[300px] w-[660px] rounded-md border p-4 overflow-auto overflow-y-scroll custom-scrollbar">
        <AnimatePresence>
          <motion.ul className="grid grid-cols-2 justify-items-center gap-3">
            {/**Animación al renderizar cada tarjeta de enlace */}
            {collection.userLinks.map((item, index) => (
              <motion.li
                key={item.shorter}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <CardLink
                  linkId={item.idLink}
                  originalUrl={item.originalUrl}
                  shortUrl={item.shorter}
                  clicks={item.clicks}
                  visitors={item.visitors}
                  isAuthenticated={isAuthenticated}
                  deleteLinkHandler={deleteLinkHandler}
                  date={item.date}
                />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
        {/**Elemento al final de la lista que sirve como referencia para el IntersectionObserver */}
        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  );
}

export default CardList;
