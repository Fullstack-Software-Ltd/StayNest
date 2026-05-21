import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { SettingsProvider } from "@/context/SettingsContext";
import { MobileNavWrapper } from "@/components/ui/MobileNavWrapper";
import { NavbarWrapper } from "@/components/ui/NavbarWrapper";
import { Toaster } from "@/components/ui/sonner";
import { UrugoAssistant } from "@/components/chat/UrugoAssistant";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";
import { HostModeGuard } from "@/components/auth/HostModeGuard";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'UrugoStay | Elite Rwandan Accommodations & Luxury Stays',
  description: "Experience Rwanda through a curated collection of the country's most distinctive homes, boutique hotels, and luxury resorts. Secure, vetted, and world-class.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  const role = (user as any)?.role || 'guest';

  const dashboardLink = role === 'admin' 
    ? '/admin/dashboard' 
    : (role === 'owner' ? '/owner/dashboard' : '/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body 
        suppressHydrationWarning
        className={`${plusJakartaSans.className} ${plusJakartaSans.variable} ${playfairDisplay.variable} min-h-screen bg-transparent text-gray-900 antialiased relative overflow-x-hidden transition-colors duration-500`}
      >
        <NextAuthSessionProvider session={session}>
          <SettingsProvider>
            {/* Global Background Elements */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[var(--background)]">
              <div 
                className="absolute inset-0 opacity-[0.25] mix-blend-multiply pointer-events-none" 
                style={{ 
                  backgroundImage: `url('/luxury_plaster_texture.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} 
              />
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, var(--luxury-gold) 0%, transparent 40%), linear-gradient(135deg, transparent 40%, var(--luxury-gold) 42%, transparent 44%)`,
                  filter: 'blur(100px)'
                }}
              ></div>
            </div>

            <NavbarWrapper>
              <Navbar />
            </NavbarWrapper>
            
            <UrugoAssistant />
            
            <HostModeGuard>
              <MobileNavWrapper 
                role={role} 
                dashboardLink={dashboardLink}
              >
                {children}
              </MobileNavWrapper>
            </HostModeGuard>
            
            <Toaster />
          </SettingsProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
