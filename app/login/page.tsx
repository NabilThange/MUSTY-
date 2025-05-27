"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    prn: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.prn.trim()) {
      newErrors.prn = "PRN is required"
    } else if (formData.prn.length < 3) {
      newErrors.prn = "PRN must be at least 3 characters"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await login(formData.prn, formData.password)

      if (result.success) {
        // Success! Redirect to dashboard
        router.push("/dashboard")
      } else {
        setSubmitError(result.error || "Login failed. Please try again.")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b-8 border-black bg-primary">
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/landing" className="flex items-center">
              <div className="h-8 w-8 md:h-12 md:w-12 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="h-8 w-8 md:h-12 md:w-12 bg-blue-600 border-4 border-black -ml-4 md:-ml-6 -rotate-12"></div>
              <span className="font-black text-lg md:text-2xl tracking-tighter ml-3 md:ml-4 text-white">STUDGEM</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl w-full">
          {/* Left Column - Login Form */}
          <div className="bg-white border-8 border-black p-6 md:p-8 shadow-brutal">
            <h1 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 uppercase border-b-4 border-black pb-2">
              SECURE LOGIN
            </h1>

            {/* Global Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border-4 border-red-600 text-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-bold">{submitError}</span>
                </div>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-blue-100 border-4 border-blue-600 text-blue-800">
              <h3 className="font-bold mb-2">DEMO CREDENTIALS:</h3>
              <p className="text-sm">
                PRN: <strong>test</strong>
              </p>
              <p className="text-sm">
                Password: <strong>test</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="prn" className="text-base md:text-lg font-bold">
                  MU PRN NUMBER
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="prn"
                    name="prn"
                    placeholder="Enter your PRN"
                    className={`border-4 ${errors.prn ? "border-red-600" : "border-black"} h-12 md:h-14 text-base md:text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 pl-10`}
                    value={formData.prn}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                {errors.prn && (
                  <p className="text-red-600 font-bold text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.prn}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-base md:text-lg font-bold">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`border-4 ${errors.password ? "border-red-600" : "border-black"} h-12 md:h-14 text-base md:text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 pl-10`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 font-bold text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="h-5 w-5 border-2 border-black" />
                  <Label htmlFor="remember" className="font-bold">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="font-bold underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white border-4 border-black px-6 py-3 font-bold text-base md:text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    LOGGING IN...
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t-4 border-black text-center">
              <p className="mb-4 font-bold">Don't have an account?</p>
              <Link
                href="/signup"
                className="block w-full bg-yellow-500 border-4 border-black px-6 py-3 font-bold text-base md:text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
              >
                REGISTER WITH PRN
              </Link>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="bg-black text-white border-8 border-black p-6 md:p-8 shadow-brutal-inverse">
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 uppercase border-b-4 border-white pb-2">
              MUMBAI UNIVERSITY
            </h2>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold">STUDENT DASHBOARD</h3>
                <p className="text-base md:text-lg">
                  Access your academic information, resources, and tools in one place.
                </p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-red-600"></div>
                  <span className="text-sm md:text-base">Smart Academic Dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-blue-600"></div>
                  <span className="text-sm md:text-base">AI Assistant "StudGem"</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-yellow-500"></div>
                  <span className="text-sm md:text-base">Personalized Study Resources</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-cyan-400"></div>
                  <span className="text-sm md:text-base">Live Notice Feed & Scholarships</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-fuchsia-500"></div>
                  <span className="text-sm md:text-base">Subject Analytics & Heatmaps</span>
                </li>
              </ul>

              <div className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 p-4 md:p-6 border-4 border-white mt-6">
                <h3 className="text-lg md:text-xl font-bold mb-3">NEED HELP?</h3>
                <p className="mb-4 text-sm md:text-base">Contact your college administrator or email us at:</p>
                <a
                  href="mailto:support@studgem.edu"
                  className="bg-white text-black border-4 border-black px-3 md:px-4 py-2 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all inline-block text-sm md:text-base"
                >
                  support@studgem.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
