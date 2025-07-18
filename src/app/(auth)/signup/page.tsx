"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/Utils/logo"
import { Input } from "@/components/Utils/inputHeader"
import { Label } from "@/components/Utils/labelHeader"
import { Button } from "@/components/Utils/button"
import { Alert, AlertDescription } from "@/components/Utils/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })
  const router = useRouter()
  const { register } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await register(formData.email, formData.password, formData.name, formData.username)
      setSuccess("Account created successfully! Redirecting to dashboard...")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err: any) {
      setError(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <LogoIcon />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Create a Goomi Account</h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">Full Name</Label>
              <Input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="block text-sm">Username</Label>
              <Input 
                type="text" 
                name="username" 
                id="username" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">Email</Label>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="block text-sm">Password</Label>
              <Input 
                type="password" 
                name="password" 
                id="password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="button" 
              className="w-full" 
              disabled={isLoading}
              onClick={handleSignup}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Already have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}