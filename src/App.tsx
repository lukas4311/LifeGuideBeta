
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "./pages/NotFound";
import ModuleDetailLegacy from "./components/ModuleDetailLegacy";
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import DailyCheckIn from "./components/DailyCheckIn";
import Progress from "./components/Progress";
import AppLayout from "./components/AppLayout";
import ModulesLegacy from "./components/ModulesLegacy";
import { AppProvider } from './contexts/AppContext';

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
              {/* wrap everything that needs the common chrome in AppLayout */}
              <Route
                path="/"
                element={
                  <AppProvider>
                    <AppLayout />
                  </AppProvider>
                }
              >
                {/* index route shows modules list */}
                <Route index element={<ModulesLegacy />} />
                <Route path="ModuleDetailLegacy" element={<ModuleDetailLegacy />} />
                <Route path="DailyCheckIn" element={<DailyCheckIn />} />
                <Route path="Progress" element={<Progress />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
