import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FarmaLink • Sistema de Receta Digital Interconectada con Farmacias',
  description: 'FarmaLink: Plataforma médica para emisión de recetas digitales, interconexión en tiempo real con farmacias, control de inventario y notificación a pacientes vía WhatsApp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900">
        {children}
      </body>
    </html>
  );
}
