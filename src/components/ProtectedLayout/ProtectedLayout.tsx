"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/Auth/auth-provider"

const PUBLIC_ROUTES = ["/login", "/signup"]

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isPublic = PUBLIC_ROUTES.includes(pathname)

  useEffect(() => {
    if (!user && !isPublic) {
      router.replace("/login")
    }
    if (user && isPublic) {
      router.replace("/") // prevent access to login/signup if already logged in
    }
  }, [user, pathname, isPublic, router])

  // Avoid flashing public page briefly before redirect
  if (!user && !isPublic) return null
  if (user && isPublic) return null

  return <>{children}</>
}
