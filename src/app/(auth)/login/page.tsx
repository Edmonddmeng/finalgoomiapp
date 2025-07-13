"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import ForgotPasswordModal from "@/components/Utils/forgot-password-modal"
import { LogoIcon } from '@/components/Utils/logo'
import { Button } from '@/components/Utils/button'
import { Input } from '@/components/Utils/inputHeader'
import { Label } from  '@/components/Utils/labelHeader'
import { Alert, AlertDescription } from '@/components/Utils/alert'
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResetModal, setShowResetModal] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // 
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  const formData = new FormData(e.currentTarget)
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await login(email, password)
    router.push("/")
  } catch (err: any) {
    setError(err.message || "Login failed")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleLogin}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Goomi</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">Email</Label>
              <Input type="email" required name="email" id="email" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-title text-sm">Password</Label>
                <Button asChild variant="link" size="sm">
                  <p
                    className="text-sm text-blue-600 hover:underline cursor-pointer mt-1"
                    onClick={() => setShowResetModal(true)}>
                    Forgot your password?
                  </p>
                </Button>
              </div>
              <Input type="password" required name="password" id="password" className="input sz-md variant-mixed" />
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/signup">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
      <ForgotPasswordModal open={showResetModal} onClose={() => setShowResetModal(false)} />
    </section>
  )
}
