'use client'
import { createContext, useContext, useState, useCallback } from 'react'

interface ToastContextValue { showToast: (msg: string, type?: 'success' | 'error') => void }
const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('')
  const [type, setType] = useState<'success' | 'error'>('success')
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(0)

  const showToast = useCallback((message: string, t: 'success' | 'error' = 'success') => {
    setMsg(message); setType(t); setVisible(true); setKey(k => k + 1)
    setTimeout(() => setVisible(false), 2600)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && <div key={key} className={`toast-ay${type === 'error' ? ' error' : ''}`}>{msg}</div>}
    </ToastContext.Provider>
  )
}

export const useToastContext = () => useContext(ToastContext)
