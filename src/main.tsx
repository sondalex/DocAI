import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import WebLandingPage from "./pages/web.tsx";
import DesktopLandingPage from "./pages/desktop.tsx";
import { Cpu, Sparkles } from "lucide-react";

const isDesktop = import.meta.env.VITE_PLATFORM === "desktop";
const isDevelopment = import.meta.env.MODE === "development";

const cards = [
    {
        caption:
      "All computations execute on your computer, ensuring privacy.",
        title: "Local Processing",
        logo: <Cpu className="h-12 w-12" />,
    },
    {
        caption:
      "Leverage AI models from HuggingFace for intelligent document processing and analysis.",
        title: "Multiple AI Models",
        logo: <Sparkles className="h-12 w-12" />,
    },
];

const createRouter = isDevelopment ? createBrowserRouter: createHashRouter 

const router = createRouter([
    {
        path: "/",
        element: isDesktop ? (
            <DesktopLandingPage />
        ) : (
            <WebLandingPage
                title="DocumentAI directly in your browser!"
                caption="Process documents intelligently with AI - right in your browser. Open-source and free to use!"
                cards={cards}
            />
        ),
    },
    {
        path: "/app",
        element: <App />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
