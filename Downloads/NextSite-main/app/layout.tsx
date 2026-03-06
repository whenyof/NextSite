import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextSite - Sitio Web Profesional",
  description: "Sitio web optimizado para empresas que buscan presencia digital profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}

        <Script
          id="clientlabs-sdk"
          src="https://cdn.clientlabs.app/v1/sdk.js"
          strategy="afterInteractive"
          data-key="cl_pub_1fa4abd01fe204434a700b1d5066f3a5"
          data-features='{"pageview":true,"forms":true,"intent":true,"ecommerce":true,"heartbeat":true,"utm":true,"email":true,"cta":true,"whatsapp":true,"cart":true}'
        />
      </body>
    </html>
  );
}
