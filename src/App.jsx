import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ErrorBoundary>
  );
}

