import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Goomi - Auth",
  description: "Login or register for Goomi Community"
}

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}