import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface FlashcardProps {
  question: string
  answer: string
  subject?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export function Flashcard({ 
  question, 
  answer, 
  subject = 'General', 
  difficulty = 'medium' 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Difficulty color mapping
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto h-[400px] perspective group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className={`
          relative 
          w-full 
          h-full 
          transition-transform 
          duration-700 
          ease-in-out 
          transform-style-3d 
          ${isFlipped ? 'rotate-y-180' : ''}
          cursor-pointer
        `}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'tween' }}
      >
        {/* Front Side */}
        <div 
          className={`
            absolute 
            inset-0 
            backface-hidden 
            border-8 
            border-black 
            bg-white 
            flex 
            flex-col 
            justify-between 
            p-6 
            ${!isFlipped ? 'z-10' : 'z-0'}
          `}
        >
          <div className="flex justify-between items-start">
            <span 
              className={`
                text-xs 
                font-bold 
                uppercase 
                px-2 
                py-1 
                border-2 
                border-black 
                ${difficultyColors[difficulty]}
                text-white
              `}
            >
              {difficulty}
            </span>
            <span className="text-xs font-bold uppercase text-gray-600">
              {subject}
            </span>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <h3 className="text-xl font-black text-center text-black">
              {question}
            </h3>
          </div>
          
          <div className="text-center text-xs font-bold uppercase text-gray-600">
            Tap to Reveal Answer
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={`
            absolute 
            inset-0 
            backface-hidden 
            rotate-y-180 
            border-8 
            border-black 
            bg-yellow-500 
            flex 
            flex-col 
            justify-center 
            items-center 
            p-6 
            ${isFlipped ? 'z-10' : 'z-0'}
          `}
        >
          <div className="text-center">
            <h4 className="text-2xl font-black text-black mb-4">Answer</h4>
            <p className="text-lg font-bold text-black">
              {answer}
            </p>
          </div>
          
          <div className="absolute bottom-4 text-xs font-bold uppercase text-black opacity-70">
            Tap to Go Back
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FlashcardDeck({ 
  flashcards, 
  onMarkKnown 
}: { 
  flashcards: FlashcardProps[], 
  onMarkKnown?: (index: number) => void 
}) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const goToNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)
  }

  const markCurrentCardKnown = () => {
    onMarkKnown?.(currentCardIndex)
    goToNextCard()
  }

  if (flashcards.length === 0) return null

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="flex flex-col items-center space-y-6">
      <Flashcard 
        {...currentCard}
      />
      
      <div className="flex space-x-4">
        <button 
          onClick={goToNextCard}
          className="
            bg-blue-600 
            text-white 
            border-4 
            border-black 
            px-6 
            py-2 
            font-bold 
            uppercase 
            hover:bg-blue-700 
            transition-colors
          "
        >
          Next Card
        </button>
        
        <button 
          onClick={markCurrentCardKnown}
          className="
            bg-green-600 
            text-white 
            border-4 
            border-black 
            px-6 
            py-2 
            font-bold 
            uppercase 
            hover:bg-green-700 
            transition-colors
          "
        >
          Mark as Known
        </button>
      </div>
      
      <div className="text-sm font-bold uppercase text-gray-600">
        Card {currentCardIndex + 1} of {flashcards.length}
      </div>
    </div>
  )
} 