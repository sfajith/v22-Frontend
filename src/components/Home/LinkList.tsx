import { ScrollArea } from "@/components/ui/scroll-area";
import CardLink from "../myAccount/Card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "../../features/links/linkTypes";

type LinklistProps = {
  deleteLinkHandler: (linkid: string) => void;
  collection: {
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    userLinks: Link[];
  };
};

// Componente que muestra la lista de enlaces del usuario no registrado
// Si hay enlaces, los renderiza en una grilla animada. Si no hay enlaces, muestra un mensaje motivador.
export function LinkList({ deleteLinkHandler, collection }: LinklistProps) {
  const reversedUserLinks = collection.userLinks.slice().reverse();

  return (
    <div className="flex flex-col justify-center">
      {collection.userLinks.length > 0 ? (
        <>
          {/* Título cuando existen enlaces */}
          <h3 className="text-center text-gray-600">Mis últimos enlaces</h3>
          {/* Contenedor scrollable con límite de altura */}
          <ScrollArea className="w-[660px] max-h-[300px] rounded-md border mt-2 p-4">
            <motion.ul className="grid grid-cols-2 gap-3 justify-items-center">
              <AnimatePresence>
                {/* Mapeo de enlaces del usuario con animación al montar/desmontar */}
                {reversedUserLinks.map((link, index) => (
                  <motion.li
                    key={link.idLink}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                    }}
                  >
                    <CardLink
                      linkId={link.idLink}
                      originalUrl={link.originalUrl}
                      shortUrl={link.shorter}
                      deleteLinkHandler={deleteLinkHandler}
                      clicks={0}
                      visitors={0}
                      isAuthenticated={false}
                      date={link.date}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </ScrollArea>
        </>
      ) : (
        // Mensaje motivador si no hay enlaces en la colección
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>¡Acorta tu primer enlace!</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nuestro acortador de enlaces es <strong>gratuito</strong>,{" "}
            <strong>sin publicidad</strong> y <strong>siempre lo será</strong>.
            <br />
            No recopilamos datos personales sin tu consentimiento.
            <br />
            Te recomendamos <strong>crear una cuenta</strong> para ver
            estadísticas de tus enlaces y acceder a ellos desde cualquier lugar.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
