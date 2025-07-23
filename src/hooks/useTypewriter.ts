import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  speed?: number // milliseconds per character
  startDelay?: number // delay before starting
  onComplete?: () => void
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
) {
  const {
    speed = 20, // Adjust for faster/slower typing
    startDelay = 0,
    onComplete
  } = options

  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('')
    setIsComplete(false)
    currentIndexRef.current = 0

    if (!text) {
      setIsTyping(false)
      return
    }

    setIsTyping(true)

    // Start typing after delay
    const startTimeout = setTimeout(() => {
      // Split by words for more natural typing
      const words = text.split(' ')
      let wordIndex = 0
      let charIndex = 0
      let currentText = ''

      intervalRef.current = setInterval(() => {
        if (wordIndex >= words.length) {
          // Typing complete
          setIsTyping(false)
          setIsComplete(true)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          onComplete?.()
          return
        }

        const currentWord = words[wordIndex]
        
        if (charIndex < currentWord.length) {
          // Add next character
          currentText += currentWord[charIndex]
          charIndex++
        } else {
          // Word complete, add space and move to next word
          if (wordIndex < words.length - 1) {
            currentText += ' '
          }
          wordIndex++
          charIndex = 0
        }

        setDisplayedText(currentText)
        currentIndexRef.current = currentText.length
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimeout)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, speed, startDelay, onComplete])

  // Function to skip to the end
  const skipToEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setDisplayedText(text)
    setIsTyping(false)
    setIsComplete(true)
    onComplete?.()
  }

  return {
    displayedText,
    isTyping,
    isComplete,
    skipToEnd
  }
}