import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { SemesterProvider } from "./contexts/SemesterContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SemesterProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </SemesterProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
