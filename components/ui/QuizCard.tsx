import React from 'react'

export interface QuizItem {
  question: string
  options: string[]
  answer: string
  explanation: string
  type?: string
  importance?: string
}

interface QuizCardProps {
  item: QuizItem
  selected: string | null
  setSelected: (option: string) => void
}

export function QuizCard({ item, selected, setSelected }: QuizCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto border-4 border-black bg-white p-6 space-y-4">
      {/* Metadata */}
      <div className="flex justify-between text-xs font-bold uppercase text-gray-600">
        <span>Type: {item.type || 'N/A'}</span>
        <span>{item.importance}</span>
      </div>

      {/* Question */}
      <h2 className="text-xl font-black text-black">{item.question}</h2>

      {/* Options */}
      <div className="grid gap-4">
        {item.options.map((option, i) => {
          const isCorrect = option === item.answer
          const isSelected = option === selected

          let optionClass =
            'border-2 border-black p-3 text-left font-bold cursor-pointer transition-all'

          if (selected) {
            optionClass += isCorrect
              ? ' bg-green-200 text-green-800'
              : isSelected
              ? ' bg-red-200 text-red-800'
              : ' bg-gray-100'
          } else {
            optionClass += ' hover:bg-yellow-100'
          }

          return (
            <button
              key={i}
              className={optionClass}
              onClick={() => !selected && setSelected(option)}
              disabled={!!selected}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {selected && (
        <div className="mt-4 p-4 border-t-2 border-black bg-yellow-100 text-black text-sm font-medium">
          ✅ <strong>Explanation:</strong> {item.explanation}
        </div>
      )}
    </div>
  )
} 