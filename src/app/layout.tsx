import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mascoty - Todo para tu Mascota",
  description: "Los mejores productos para el cuidado de tu mascota. Alimentos, accesorios, juguetes y más. Envío gratis en pedidos mayores a $50.",
  keywords: ["mascotas", "productos para mascotas", "alimentos", "accesorios", "perros", "gatos"],
  authors: [{ name: "Mascoty" }],
  openGraph: {
    title: "Mascoty - Todo para tu Mascota",
    description: "Los mejores productos para el cuidado de tu mascota",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
