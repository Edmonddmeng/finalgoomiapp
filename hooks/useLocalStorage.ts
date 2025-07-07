"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This function now runs only on the client, preventing build errors.
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      const valueToStore = storedValue
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }, [key, storedValue])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToSet = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToSet)
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
