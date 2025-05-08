import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  startLoadCollection,
  loadCollection,
  loadCollectionFailure,
  pushCollection,
  deleteFromCollection,
} from "../../features/auth/authSlice";
import { getUserCollection, deleteLink } from "../../features/auth/authService";

// Custom hook para manejar la colección de enlaces del usuario
export function useUserCollection() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const collection = auth.collection;
  const user = auth.user;

  // Cargar los enlaces cuando el usuario esté autenticado y su nombre de usuario esté disponible
  useEffect(() => {
    if (isAuthenticated && auth.user?.username) {
      handlerLoadCollection();
    }
  }, [auth.user?.username, isAuthenticated]);

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
          loadCollectionFailure(
            error instanceof Error
              ? error.message
              : "Error al cargar enlaces de usuario authenticado"
          )
        );
      }
    }
  };

  // Función para eliminar un enlace de la colección
  const deleteLinkHandler = async (id: string) => {
    const payload = {
      token: localStorage.getItem("token"),
      username: user?.username || "linkAdmin",
      linkId: id,
    };

    if (isAuthenticated) {
      await deleteLink(payload);
    }

    dispatch(deleteFromCollection({ id }));
    return;
  };

  return {
    handlerLoadCollection,
    deleteLinkHandler,
    isAuthenticated,
    collection,
    user,
  };
}
