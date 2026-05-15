import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AppShell from "./layouts/AppShell.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ReceiptLayout from "./layouts/ReceiptLayout.jsx";
import Skeleton from "./components/ui/Skeleton.jsx";
import { pageTransition } from "./animations/transitions.js";

const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const ForgotPage = lazy(() => import("./pages/ForgotPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const StudentsPage = lazy(() => import("./pages/StudentsPage.jsx"));
const StudentFormPage = lazy(() => import("./pages/StudentFormPage.jsx"));
const FeePage = lazy(() => import("./pages/FeePage.jsx"));
const MonthlyFeePage = lazy(() => import("./pages/MonthlyFeePage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const ReceiptPage = lazy(() => import("./pages/ReceiptPage.jsx"));

const registry = {
  login: LoginPage,
  forgot: ForgotPage,
  dashboard: DashboardPage,
  students: StudentsPage,
  "add-student": StudentFormPage,
  "edit-student": StudentFormPage,
  "pay-fee": FeePage,
  "monthly-fee": MonthlyFeePage,
  settings: SettingsPage,
  profile: SettingsPage,
  "admin-panel": SettingsPage,
  receipt: ReceiptPage,
  "monthly-receipt": ReceiptPage
};

function Root() {
  const page = window.__ERP_PAGE__ || { name: "dashboard", props: {} };
  const Page = registry[page.name] || DashboardPage;
  const isAuth = ["login", "forgot"].includes(page.name);
  const isReceipt = ["receipt", "monthly-receipt"].includes(page.name);
  const Layout = isAuth ? AuthLayout : isReceipt ? ReceiptLayout : AppShell;

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <Layout pageName={page.name} title={page.title}>
            <AnimatePresence mode="wait">
              <motion.main
                key={page.name}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-0"
              >
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <Page {...page.props} pageName={page.name} />
                </Suspense>
              </motion.main>
            </AnimatePresence>
          </Layout>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
