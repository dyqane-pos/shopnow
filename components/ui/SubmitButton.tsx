'use client'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ label, pendingLabel, className, style }: {
  label: string; pendingLabel?: string; className?: string; style?: React.CSSProperties
}) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={className} style={style}>
      {pending ? (pendingLabel ?? label) : label}
    </button>
  )
}
