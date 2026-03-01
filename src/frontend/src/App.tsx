import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { CompressPDF } from "@/pages/CompressPDF";
import { HistoryPage } from "@/pages/HistoryPage";
import { Home } from "@/pages/Home";
import { JPGToPDF } from "@/pages/JPGToPDF";
import { MergePDF } from "@/pages/MergePDF";
import { OrganizePDF } from "@/pages/OrganizePDF";
import { PDFToJPG } from "@/pages/PDFToJPG";
import { PageNumbers } from "@/pages/PageNumbers";
import { ProtectPDF } from "@/pages/ProtectPDF";
import { RotatePDF } from "@/pages/RotatePDF";
import { SplitPDF } from "@/pages/SplitPDF";
import { UnlockPDF } from "@/pages/UnlockPDF";
import { WatermarkPDF } from "@/pages/WatermarkPDF";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const mergeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/merge",
  component: MergePDF,
});
const splitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/split",
  component: SplitPDF,
});
const compressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compress",
  component: CompressPDF,
});
const rotateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rotate",
  component: RotatePDF,
});
const watermarkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watermark",
  component: WatermarkPDF,
});
const protectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/protect",
  component: ProtectPDF,
});
const unlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unlock",
  component: UnlockPDF,
});
const pdfToJpgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pdf-to-jpg",
  component: PDFToJPG,
});
const jpgToPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jpg-to-pdf",
  component: JPGToPDF,
});
const pageNumbersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/page-numbers",
  component: PageNumbers,
});
const organizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organize",
  component: OrganizePDF,
});
const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mergeRoute,
  splitRoute,
  compressRoute,
  rotateRoute,
  watermarkRoute,
  protectRoute,
  unlockRoute,
  pdfToJpgRoute,
  jpgToPdfRoute,
  pageNumbersRoute,
  organizeRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
