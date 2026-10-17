import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FarmaLink • Sistema de Receta Digital Interconectada con Farmacias',
  description: 'FarmaLink: Plataforma médica para emisión de recetas digitales, interconexión en tiempo real con farmacias, control de inventario y notificación a pacientes vía WhatsApp.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FarmaLink'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#1d4ed8'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
