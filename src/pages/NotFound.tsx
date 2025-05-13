import { Error } from "../components/form/Error";
import { Success } from "../components/form/Success";
function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40">
      <Error />
    </div>
  );
}

export default NotFound;
