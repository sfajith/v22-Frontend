import { useLocation } from "react-router-dom";
import { verifyAccount } from "../features/auth/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Success } from "../components/form/Success";
import { ErrorVerify } from "../components/form/ErrorVerify";
import { Loader } from "../components/form/Loader";
function VerifyEmail() {
  let navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [verify, setVerify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    verifiHandler();
  }, [token]);

  const verifiHandler = async () => {
    setTimeout(async () => {
      try {
        const response = await verifyAccount({ token });

        if (response.success) {
          setIsLoading(false);
          setVerify(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        return response.success;
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }, 2000);
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 pointer-events-auto">
          <div className="pointer-events-auto">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          {verify ? (
            <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 pointer-events-auto">
              <div className="pointer-events-auto">
                <Success success={"Email Verificado"} />
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 pointer-events-auto">
              <div className="pointer-events-auto">
                <ErrorVerify error={"Enlace expirado o invalido"} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default VerifyEmail;
