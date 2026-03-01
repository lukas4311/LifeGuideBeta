
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ModuleDetailLegacy from "./components/ModuleDetailLegacy";
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import DailyCheckIn from "./components/DailyCheckIn";
import Progress from "./components/Progress";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route key={"ModuleDetailLegacy"} path="/ModuleDetailLegacy" element={<ModuleDetailLegacy />} />
              <Route key={"DailyCheckIn"} path="/DailyCheckIn" element={<DailyCheckIn />} />
              <Route key={"Progress"} path="/Progress" element={<Progress />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
