"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Utils/dialog"
import { Input } from "@/components/Utils/input"
import { Button } from "@/components/Utils/button"
import { Label } from "@/components/Utils/label"
import { Alert, AlertDescription } from "@/components/Utils/alert"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/apiClient"

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setError("")

    try {
      const res = await apiClient.post("/auth/forgot-password", {
        email
      })

      if (res.status !== 200) {
        throw new Error(res.data.error || res.data.message || "Failed to send reset email")
      }

      setMessage("✅ Reset email sent! Check your inbox.")
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Your Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {message && (
            <Alert variant="default">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}