import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReSendConfirmation from "@/pages/ReSendConfirmation";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider skipDelayDuration={0}>
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/cuenta" element={<MyAccount />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-email" element={<ReSendConfirmation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
