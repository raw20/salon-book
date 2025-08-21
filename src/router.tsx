import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import NotFoundPage from "@/pages/NotFound";
import Layout from "@/components/layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
]);
