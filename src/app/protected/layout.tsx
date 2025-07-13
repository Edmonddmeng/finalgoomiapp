// src/app/(protected)/layout.tsx
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedLayout } from "@/components/ProtectedLayout/ProtectedLayout"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Goomi - Dashboard",
  description: "Your learning hub"
}

export default function ProtectedAppLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
