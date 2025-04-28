
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TracksProvider } from "@/contexts/TracksContext";
import { Routes, Route, Navigate } from "react-router-dom";
import MyMusic from "./pages/MyMusic";
import Recommendations from "./pages/Recommendations";
import Browse from "./pages/Browse";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TracksProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MyMusic />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </TracksProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
