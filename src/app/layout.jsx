import "@/app/globals.css";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  title: "Y-Wallet",
  description: "Administración de tus gastos e ingresos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}