import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  startLoadCollection,
  loadCollection,
  globalError,
  pushCollection,
  deleteFromCollection,
} from "../../features/auth/authSlice";
import { getUserCollection, deleteLink } from "../../features/auth/authService";
import { toast } from "sonner";

// Custom hook para manejar la colección de enlaces del usuario
export function useUserCollection() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const collection = auth.collection;
  const user = auth.user;
  const error = auth.error;
  const accessToken = auth.accessToken;

  // Cargar los enlaces cuando el usuario esté autenticado y su nombre de usuario esté disponible
  useEffect(() => {
    if (isAuthenticated && auth.user?.username) {
      handlerLoadCollection();
    }
  }, [isAuthenticated, auth.user?.username]);

  // Función para cargar los enlaces del usuario
  const handlerLoadCollection = async () => {
    if (auth.user) {
      const payload = {
        username: auth.user.username,
        nextCursor: auth.collection.nextCursor,
      };
      // Si ya se cargaron todos los enlaces, no hacer nada
      if (
        auth.collection.totalCount !== null &&
        auth.collection.totalCount !== undefined &&
        auth.collection.totalCount !== 0 &&
        auth.collection.totalCount <= auth.collection.userLinks.length
      )
        return;
      getUserCollection(payload)
        .then((data) => {
          dispatch(startLoadCollection());
          if (!auth.collection.nextCursor) {
            dispatch(loadCollection(data));
          } else if (auth.collection.nextCursor !== data.nextCursor) {
            dispatch(pushCollection(data));
          }
        })
        .catch((error) => {
          dispatch(
            globalError(
              error instanceof Error
                ? error.message
                : "Error al cargar enlaces del usuario"
            )
          );
        });
    }
  };

  // Función para eliminar un enlace de la colección
  const deleteLinkHandler = async (id: string) => {
    toast.dismiss();
    const payload = {
      username: auth.user?.username,
      linkId: id,
    };
    if (!isAuthenticated) return;
    deleteLink(payload)
      .then(() => {
        dispatch(deleteFromCollection({ id }));
        toast.warning("Enlace eliminado");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return {
    handlerLoadCollection,
    deleteLinkHandler,
    isAuthenticated,
    collection,
    user,
    error,
    accessToken,
  };
}
