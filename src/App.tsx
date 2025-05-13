import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider skipDelayDuration={0}>
        <Toaster richColors />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/cuenta" element={<MyAccount />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
