import { AuthProvider } from "@/contexts/AuthContext";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          <AuthProvider>
            <ScheduleProvider>
              <Navbar />
              {children}
            </ScheduleProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
