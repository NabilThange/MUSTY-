"use client"

import React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, Circle, Square, AlertCircle, Loader2, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SignupData {
  // Step 1: Basic Info
  fullName: string
  age: string
  location: string
  collegeName: string
  rollNumber: string

  // Step 2: Academic Info
  yearOfStudy: string
  faculty: string
  department: string

  // NEW: Additional fields for first-year students
  coreSubject: string
  electivePhysics: string
  electiveChemistry: string

  // Step 3: Learning Preferences
  preferredLanguages: string[]
  learningStyle: string
  visualNotes: string
  studyPreference: string
  studyFrequency: string
  examReminders: string
  entranceExams: string[]

  // Step 4: Resource Matching
  peerNotes: string
  studyPlans: string
  backlogs: string
  weakSubjects: string[]
  currentTools: string[]
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitError, setSubmitError] = useState("")
  const [savedProgress, setSavedProgress] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const [signupData, setSignupData] = useState<SignupData>({
    fullName: "",
    age: "",
    location: "",
    collegeName: "",
    rollNumber: "",
    yearOfStudy: "",
    faculty: "",
    department: "",
    coreSubject: "",
    electivePhysics: "",
    electiveChemistry: "",
    preferredLanguages: [],
    learningStyle: "",
    visualNotes: "",
    studyPreference: "",
    studyFrequency: "",
    examReminders: "",
    entranceExams: [],
    peerNotes: "",
    studyPlans: "",
    backlogs: "",
    weakSubjects: [],
    currentTools: [],
  })

  const totalSteps = 4

  // Load saved progress on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("signup_progress")
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setSignupData(parsedData.data)
        setCurrentStep(parsedData.step)
        setSavedProgress(true)
      } catch (error) {
        console.error("Failed to load saved progress:", error)
      }
    }
  }, [])

  // Save progress to localStorage
  const saveProgress = () => {
    const progressData = {
      data: signupData,
      step: currentStep,
      timestamp: Date.now(),
    }
    localStorage.setItem("signup_progress", JSON.stringify(progressData))
    setSavedProgress(true)
    setTimeout(() => setSavedProgress(false), 2000)
  }

  const handleInputChange = (field: keyof SignupData, value: string | string[]) => {
    setSignupData((prev) => ({ ...prev, [field]: value }))

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  const handleArrayToggle = (field: keyof SignupData, value: string) => {
    const currentArray = signupData[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    handleInputChange(field, newArray)
  }

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {}

    switch (step) {
      case 1:
        if (!signupData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!signupData.age) newErrors.age = "Age is required"
        if (!signupData.location.trim()) newErrors.location = "Location is required"
        if (!signupData.collegeName) newErrors.collegeName = "College selection is required"
        break

      case 2:
        if (!signupData.yearOfStudy) newErrors.yearOfStudy = "Year of study is required"
        if (!signupData.faculty) newErrors.faculty = "Faculty selection is required"
        if (!signupData.department) newErrors.department = "Department selection is required"

        // Additional validation for first-year students
        if (signupData.yearOfStudy === "FY") {
          if (!signupData.coreSubject) newErrors.coreSubject = "Core subject selection is required"
          if (!signupData.electivePhysics) newErrors.electivePhysics = "Physics elective selection is required"
          if (!signupData.electiveChemistry) newErrors.electiveChemistry = "Chemistry elective selection is required"
        }
        break

      case 3:
        if (signupData.preferredLanguages.length === 0) newErrors.preferredLanguages = "Select at least one language"
        if (!signupData.learningStyle) newErrors.learningStyle = "Learning style is required"
        if (!signupData.studyFrequency) newErrors.studyFrequency = "Study frequency is required"
        break

      case 4:
        // Optional validations for final step
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      saveProgress()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await signup(signupData)

      if (result.success) {
        // Clear saved progress
        localStorage.removeItem("signup_progress")
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setSubmitError(result.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const colleges = [
    "VJTI - Veermata Jijabai Technological Institute",
    "SPIT - Sardar Patel Institute of Technology",
    "KJ Somaiya College of Engineering",
    "DJ Sanghvi College of Engineering",
    "Thadomal Shahani Engineering College",
    "Fr. Conceicao Rodrigues College of Engineering",
    "Atharva College of Engineering",
    "Mumbai University Institute of Technology",
    "Terna Engineering College",
    "Pillai College of Engineering",
    "Thakur College of Engineering",
    "Shah & Anchor Kutchhi Engineering College",
    "Bharati Vidyapeeth College of Engineering",
    "Other",
  ]

  const faculties = [
    "Engineering",
    "Science",
    "Commerce",
    "Arts",
    "Law",
    "Architecture",
    "Pharmacy",
    "Management",
    "Information Technology",
    "Medicine",
    "Dental",
  ]

  const departments = {
    Engineering: [
      "Computer Engineering",
      "Information Technology",
      "Electronics & Telecommunication",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "AI & Data Science",
      "AI & Machine Learning",
      "Automobile Engineering",
      "Chemical Engineering",
      "Instrumentation Engineering",
      "Production Engineering",
      "Textile Engineering",
    ],
    Science: [
      "Computer Science",
      "Information Technology",
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "Biotechnology",
      "Microbiology",
      "Environmental Science",
      "Statistics",
    ],
    Commerce: [
      "Accounting & Finance",
      "Banking & Insurance",
      "Financial Markets",
      "Business Economics",
      "Cost & Management Accounting",
      "Taxation",
      "International Business",
    ],
    Arts: [
      "Psychology",
      "Sociology",
      "English Literature",
      "History",
      "Political Science",
      "Philosophy",
      "Geography",
      "Economics",
      "Hindi Literature",
      "Marathi Literature",
    ],
    Management: [
      "BMS",
      "BAF",
      "BBI",
      "MBA",
      "PGDM",
      "Hotel Management",
      "Event Management",
      "Marketing",
      "Human Resources",
      "Operations",
    ],
  }

  return (
    <div className={`min-h-screen font-mono ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen">
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
                href="/login"
                className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
              >
                LOGIN
              </Link>
              <button
                onClick={saveProgress}
                className={`bg-green-600 border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 ${
                  savedProgress ? "bg-green-700" : ""
                }`}
              >
                <Save className="h-4 w-4" />
                {savedProgress ? "SAVED!" : "SAVE"}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
              >
                {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="max-w-2xl w-full">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-black uppercase">Join STUDGEM</h1>
                <span className="text-lg font-bold">
                  {currentStep}/{totalSteps}
                </span>
              </div>
              <div className="w-full h-6 bg-gray-200 border-4 border-black">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm font-bold">
                <span className={currentStep >= 1 ? "text-blue-600" : "text-gray-400"}>👤 PROFILE</span>
                <span className={currentStep >= 2 ? "text-blue-600" : "text-gray-400"}>🎓 ACADEMIC</span>
                <span className={currentStep >= 3 ? "text-blue-600" : "text-gray-400"}>⚙️ PREFERENCES</span>
                <span className={currentStep >= 4 ? "text-blue-600" : "text-gray-400"}>📚 RESOURCES</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white border-8 border-black p-6 md:p-8 shadow-brutal">
              {/* Global Error Message */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-100 border-4 border-red-600 text-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-bold">{submitError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black mb-2">BASIC INFORMATION</h2>
                      <p className="font-bold text-gray-600">
                        We hate boring forms too. This helps us help you better.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-lg font-bold">
                          FULL NAME *
                        </Label>
                        <Input
                          id="fullName"
                          value={signupData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className={`border-4 ${errors.fullName ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600`}
                          placeholder="Enter your full name"
                          required
                        />
                        {errors.fullName && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age" className="text-lg font-bold">
                            AGE *
                          </Label>
                          <select
                            id="age"
                            value={signupData.age}
                            onChange={(e) => handleInputChange("age", e.target.value)}
                            className={`w-full border-4 ${errors.age ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                            required
                          >
                            <option value="">Select Age</option>
                            {Array.from({ length: 26 }, (_, i) => i + 15).map((age) => (
                              <option key={age} value={age}>
                                {age}
                              </option>
                            ))}
                          </select>
                          {errors.age && (
                            <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.age}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="location" className="text-lg font-bold">
                            LOCATION *
                          </Label>
                          <Input
                            id="location"
                            value={signupData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="Mumbai, Maharashtra"
                            className={`border-4 ${errors.location ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600`}
                            required
                          />
                          {errors.location && (
                            <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="collegeName" className="text-lg font-bold">
                          COLLEGE NAME *
                        </Label>
                        <select
                          id="collegeName"
                          value={signupData.collegeName}
                          onChange={(e) => handleInputChange("collegeName", e.target.value)}
                          className={`w-full border-4 ${errors.collegeName ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                          required
                        >
                          <option value="">Select College</option>
                          {colleges.map((college) => (
                            <option key={college} value={college}>
                              {college}
                            </option>
                          ))}
                        </select>
                        {errors.collegeName && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.collegeName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="rollNumber" className="text-lg font-bold">
                          UNIVERSITY ROLL NUMBER (Optional)
                        </Label>
                        <Input
                          id="rollNumber"
                          value={signupData.rollNumber}
                          onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                          placeholder="e.g., 2021BTCS001"
                          className="border-4 border-black h-12 md:h-14 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Info */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black mb-2">ACADEMIC INFORMATION</h2>
                      <p className="font-bold text-gray-600">Help us customize your experience.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="yearOfStudy" className="text-lg font-bold">
                          YEAR OF STUDY *
                        </Label>
                        <select
                          id="yearOfStudy"
                          value={signupData.yearOfStudy}
                          onChange={(e) => handleInputChange("yearOfStudy", e.target.value)}
                          className={`w-full border-4 ${errors.yearOfStudy ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                          required
                        >
                          <option value="">Select Year</option>
                          <option value="FY">First Year (FY)</option>
                          <option value="SY">Second Year (SY)</option>
                          <option value="TY">Third Year (TY)</option>
                          <option value="BE">Final Year (BE/BTech)</option>
                          <option value="PG">Post Graduate</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.yearOfStudy && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.yearOfStudy}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="faculty" className="text-lg font-bold">
                          FACULTY *
                        </Label>
                        <select
                          id="faculty"
                          value={signupData.faculty}
                          onChange={(e) => {
                            handleInputChange("faculty", e.target.value)
                            handleInputChange("department", "") // Reset department when faculty changes
                          }}
                          className={`w-full border-4 ${errors.faculty ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                          required
                        >
                          <option value="">Select Faculty</option>
                          {faculties.map((faculty) => (
                            <option key={faculty} value={faculty}>
                              {faculty}
                            </option>
                          ))}
                        </select>
                        {errors.faculty && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.faculty}
                          </p>
                        )}
                      </div>

                      {signupData.faculty && (
                        <div>
                          <Label htmlFor="department" className="text-lg font-bold">
                            DEPARTMENT *
                          </Label>
                          <select
                            id="department"
                            value={signupData.department}
                            onChange={(e) => handleInputChange("department", e.target.value)}
                            className={`w-full border-4 ${errors.department ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                            required
                          >
                            <option value="">Select Department</option>
                            {departments[signupData.faculty as keyof typeof departments]?.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                          {errors.department && (
                            <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.department}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Additional fields for first-year students */}
                      {signupData.yearOfStudy === "FY" && (
                        <>
                          <div>
                            <Label htmlFor="coreSubject" className="text-lg font-bold">
                              CORE SUBJECT *
                            </Label>
                            <select
                              id="coreSubject"
                              value={signupData.coreSubject}
                              onChange={(e) => handleInputChange("coreSubject", e.target.value)}
                              className={`w-full border-4 ${errors.coreSubject ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                              required
                            >
                              <option value="">Select Core Subject</option>
                              <option value="PCC2011">PCC2011 - Data Structure (Computer Engineering, IT, CSE)</option>
                              <option value="PCC2012">PCC2012 - Elements of Civil Engineering</option>
                              <option value="PCC2013">PCC2013 - Elements of Biomedical Engineering</option>
                              <option value="PCC2014">PCC2014 - Digital Electronics</option>
                              <option value="PCC2015">PCC2015 - Introduction to Chemical Engineering</option>
                              <option value="PCC2016">PCC2016 - Elements of Telecommunication</option>
                              <option value="PCC2017">PCC2017 - Elements of Electrical Systems</option>
                              <option value="PCC2018">PCC2018 - Elements of Mechanical Engineering</option>
                              <option value="PCC2019">PCC2019 - Basics of Measurement and Sensors</option>
                            </select>
                            {errors.coreSubject && (
                              <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.coreSubject}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="electivePhysics" className="text-lg font-bold">
                              ELECTIVE PHYSICS *
                            </Label>
                            <select
                              id="electivePhysics"
                              value={signupData.electivePhysics}
                              onChange={(e) => handleInputChange("electivePhysics", e.target.value)}
                              className={`w-full border-4 ${errors.electivePhysics ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                              required
                            >
                              <option value="">Select Physics Elective</option>
                              <option value="BSC2021">BSC2021 - Physics for Emerging Fields</option>
                              <option value="BSC2022">BSC2022 - Semiconductor Physics</option>
                              <option value="BSC2023">BSC2023 - Physics of Measurements and Sensors</option>
                            </select>
                            {errors.electivePhysics && (
                              <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.electivePhysics}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="electiveChemistry" className="text-lg font-bold">
                              ELECTIVE CHEMISTRY *
                            </Label>
                            <select
                              id="electiveChemistry"
                              value={signupData.electiveChemistry}
                              onChange={(e) => handleInputChange("electiveChemistry", e.target.value)}
                              className={`w-full border-4 ${errors.electiveChemistry ? "border-red-600" : "border-black"} h-12 md:h-14 text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600`}
                              required
                            >
                              <option value="">Select Chemistry Elective</option>
                              <option value="BSC2031">BSC2031 - Engineering Materials</option>
                              <option value="BSC2032">
                                BSC2032 - Environmental Chemistry and Non-conventional Energy Sources
                              </option>
                              <option value="BSC2033">BSC2033 - Introduction to Computational Chemistry</option>
                            </select>
                            {errors.electiveChemistry && (
                              <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.electiveChemistry}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Learning Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black mb-2">LEARNING PREFERENCES</h2>
                      <p className="font-bold text-gray-600">Personalize your study experience.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-bold mb-3 block">PREFERRED LANGUAGE FOR LEARNING *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["English", "Hindi", "Marathi", "Hinglish"].map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => handleArrayToggle("preferredLanguages", lang)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.preferredLanguages.includes(lang)
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                        {errors.preferredLanguages && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.preferredLanguages}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">LEARNING STYLE *</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {["Video", "Text", "Mixed"].map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => handleInputChange("learningStyle", style)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.learningStyle === style
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                        {errors.learningStyle && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.learningStyle}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">
                          DO YOU LIKE VISUAL NOTES (DIAGRAMS, MINDMAPS)?
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleInputChange("visualNotes", option)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.visualNotes === option
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">HOW OFTEN DO YOU STUDY? *</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {["Daily", "Weekly", "Last-minute 😅"].map((freq) => (
                            <button
                              key={freq}
                              type="button"
                              onClick={() => handleInputChange("studyFrequency", freq)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.studyFrequency === freq
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {freq}
                            </button>
                          ))}
                        </div>
                        {errors.studyFrequency && (
                          <p className="text-red-600 font-bold text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.studyFrequency}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">PREPARING FOR ENTRANCE EXAMS?</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["GATE", "CAT", "CET", "GRE", "TOEFL", "JEE", "NEET", "None"].map((exam) => (
                            <button
                              key={exam}
                              type="button"
                              onClick={() => handleArrayToggle("entranceExams", exam)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.entranceExams.includes(exam)
                                  ? "bg-purple-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {exam}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Resource Matching */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black mb-2">CUSTOM RESOURCE MATCHING</h2>
                      <p className="font-bold text-gray-600">Almost done! Let's personalize your resources.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-bold mb-3 block">
                          DO YOU WANT PEER-SHARED NOTES FROM YOUR COLLEGE?
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleInputChange("peerNotes", option)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.peerNotes === option
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">
                          WOULD YOU LIKE TO RECEIVE SUGGESTED STUDY PLANS?
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleInputChange("studyPlans", option)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.studyPlans === option
                                  ? "bg-blue-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">DO YOU NEED HELP WITH BACKLOGS/ATKTs?</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Yes", "No"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleInputChange("backlogs", option)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.backlogs === option
                                  ? "bg-orange-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">WHAT ARE YOUR WEAKEST SUBJECTS?</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "Mathematics",
                            "Physics",
                            "Chemistry",
                            "Programming",
                            "Database",
                            "Networks",
                            "Algorithms",
                            "Data Structures",
                            "Operating Systems",
                            "Software Engineering",
                            "Web Development",
                            "None",
                          ].map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => handleArrayToggle("weakSubjects", subject)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.weakSubjects.includes(subject)
                                  ? "bg-red-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-lg font-bold mb-3 block">WHICH TOOLS DO YOU ALREADY USE?</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "Notion",
                            "YouTube",
                            "ChatGPT",
                            "WhatsApp Groups",
                            "Books",
                            "College Lectures",
                            "Khan Academy",
                            "Coursera",
                            "Udemy",
                            "Google Drive",
                            "OneNote",
                            "Evernote",
                          ].map((tool) => (
                            <button
                              key={tool}
                              type="button"
                              onClick={() => handleArrayToggle("currentTools", tool)}
                              className={`p-3 border-4 border-black font-bold transition-all ${
                                signupData.currentTools.includes(tool)
                                  ? "bg-green-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {tool}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t-4 border-black mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 font-bold border-4 border-black shadow-brutal hover:translate-y-1 hover:shadow-none transition-all ${
                      currentStep === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    BACK
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-bold border-4 border-black shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      NEXT
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-bold border-4 border-black shadow-brutal hover:translate-y-1 hover:shadow-none transition-all ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          CREATING...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          CREATE ACCOUNT
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="font-bold">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 underline font-black">
                  LOGIN HERE
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
