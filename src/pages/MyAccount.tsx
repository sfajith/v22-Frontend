import { useUserCollection } from "../app/hooks/useUserCollection";

function MyAccount(): React.ReactElement {
  const { isAuthenticated, user } = useUserCollection();

  return (
    <>
      <div className="mi-cuenta flex justify-center">
        {!isAuthenticated ? (
          <p>No tienes permiso para esto</p>
        ) : (
          <div className="flex justify-between container-p ">
            <h3 className="content-center">
              Usuario:
              <br />
              {user?.username}
            </h3>
            <h3 className="content-center">
              Correo:
              <br />
              {user?.email}
            </h3>
            <h3>{user?.statistics.totalVisitors}</h3>
          </div>
        )}
      </div>
    </>
  );
}

export default MyAccount;
