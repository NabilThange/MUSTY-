'use client'

import React, { useState } from 'react'
import { QuizCard, QuizItem } from './QuizCard'

export function QuizDeck({ questions }: { questions: QuizItem[] }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto border-4 border-black bg-white p-6 text-center font-bold">
        No quiz questions available for this topic yet.
      </div>
    )
  }

  const nextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelected(null)
    }
  }

  const prevQuestion = () => {
    if (index > 0) {
      setIndex(index - 1)
      setSelected(null)
    }
  }

  const current = questions[index]

  return (
    <div className="space-y-6">
      <QuizCard item={current} selected={selected} setSelected={setSelected} />

      <div className="flex justify-between items-center max-w-2xl mx-auto mt-4">
        <button
          onClick={prevQuestion}
          disabled={index === 0}
          className="px-4 py-2 border-2 border-black bg-gray-200 font-bold uppercase disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-bold text-gray-600">
          Question {index + 1} of {questions.length}
        </span>

        <button
          onClick={nextQuestion}
          disabled={!selected || index === questions.length - 1}
          className="px-4 py-2 border-2 border-black bg-blue-500 text-white font-bold uppercase disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
} 