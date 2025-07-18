// components/Utils/ConfirmDialog.tsx
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AlertTriangle, X, Check } from 'lucide-react'

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
  isOpen: boolean
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

// Confirm Dialog Component
function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "danger",
  onConfirm, 
  onCancel 
}: {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!isOpen) return null

  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      headerBg: "bg-red-50 dark:bg-red-900/20"
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
      headerBg: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    info: {
      icon: <Check className="w-6 h-6 text-blue-500" />,
      confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
      headerBg: "bg-blue-50 dark:bg-blue-900/20"
    }
  }

  const styles = typeStyles[type]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className={`${styles.headerBg} px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            {styles.icon}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 dark:bg-slate-700/50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Confirm Provider
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: ''
  })
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(options)
      setResolvePromise(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsOpen(false)
    if (options.onConfirm) {
      await options.onConfirm()
    }
    if (resolvePromise) {
      resolvePromise(true)
    }
  }, [options, resolvePromise])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
    if (options.onCancel) {
      options.onCancel()
    }
    if (resolvePromise) {
      resolvePromise(false)
    }
  }, [options, resolvePromise])

  const value = {
    confirm,
    isOpen
  }

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        type={options.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  )
}

// useConfirm Hook
export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}