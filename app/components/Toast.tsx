'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: string
  message: string
  type: ToastType
  description?: string
}

type ToastContextType = {
  toast: (message: string, options?: { type?: ToastType; description?: string }) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, options?: { type?: ToastType; description?: string }) => {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = {
      id,
      message,
      type: options?.type ?? 'success',
      description: options?.description,
    }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(t => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg border animate-fade-up',
              t.type === 'success' && 'bg-white border-sage-200',
              t.type === 'error' && 'bg-white border-red-200',
              t.type === 'info' && 'bg-white border-blue-200',
            )}
          >
            {t.type === 'success' && <CheckCircle2 size={18} className="text-sage-500 shrink-0 mt-0.5" />}
            {t.type === 'error' && <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800">{t.message}</p>
              {t.description && <p className="text-xs text-stone-500 mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-stone-300 hover:text-stone-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
