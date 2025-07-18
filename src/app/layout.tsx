import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryClientProvider } from "@/components/Provider/QueryClientProvider"
import { ToastProvider } from "@/components/Utils/Toast"
import { ConfirmProvider } from "@/components/Utils/ConfirmDialog"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goomi - Your Learning Journey",
  description: "A comprehensive student platform for academic success",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider>
          <ToastProvider>
            <ConfirmProvider>
              {children}
            </ConfirmProvider>
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}