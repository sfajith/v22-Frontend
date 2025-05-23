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

  // Cargar los enlaces cuando el usuario esté autenticado y su nombre de usuario esté disponible
  useEffect(() => {
    if (isAuthenticated && auth.user?.username) {
      handlerLoadCollection();
      console.log("Llamando handlerLoadCollection()");
    }
  }, [isAuthenticated, auth.user?.username]);

  // Función para cargar los enlaces del usuario
  const handlerLoadCollection = async () => {
    if (auth.user) {
      const payload = {
        username: auth.user.username,
        nextCursor: auth.collection.nextCursor,
        token: localStorage.getItem("token"),
      };

      try {
        // Si ya se cargaron todos los enlaces, no hacer nada
        if (
          auth.collection.totalCount !== null &&
          auth.collection.totalCount !== undefined &&
          auth.collection.totalCount !== 0 &&
          auth.collection.totalCount <= auth.collection.userLinks.length
        )
          return;

        const data = await getUserCollection(payload);

        // Manejo de la paginación
        if (!auth.collection.nextCursor) {
          dispatch(startLoadCollection());
          dispatch(loadCollection(data));
        } else if (auth.collection.nextCursor !== data.nextCursor) {
          dispatch(startLoadCollection());
          dispatch(pushCollection(data));
        }
      } catch (error) {
        dispatch(
          globalError(
            error instanceof Error
              ? error.message
              : "Error al cargar enlaces del usuario"
          )
        );
      }
    }
  };

  // Función para eliminar un enlace de la colección
  const deleteLinkHandler = async (id: string) => {
    console.log(user?.username, localStorage.getItem("token"), id);
    toast.dismiss();
    const payload = {
      token: localStorage.getItem("token"),
      username: user?.username || "linkAdmin",
      linkId: id,
    };
    try {
      if (isAuthenticated) {
        await deleteLink(payload);
      }
      dispatch(deleteFromCollection({ id }));
      toast.warning("Enlace eliminado");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error en el registro";
      toast.error(message);
      dispatch(globalError(message));
    }
  };

  return {
    handlerLoadCollection,
    deleteLinkHandler,
    isAuthenticated,
    collection,
    user,
    error,
  };
}
