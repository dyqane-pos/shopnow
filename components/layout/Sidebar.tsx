'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import type { Category } from '@/lib/types'
import { useLang } from '@/context/LanguageContext'

export default function Sidebar({ links }: { links: Category[] }) {
  const { t } = useLang()
  const params = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const activeSidebar = params.get('sidebar')

  const push = (label: string) => {
    const next = new URLSearchParams(params.toString())
    if (next.get('sidebar') === label) {
      next.delete('sidebar')
    } else {
      next.set('sidebar', label)
    }
    next.delete('modal')
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }))
  }

  const sections = [
    { title: t('sbExplore'),    items: links.slice(0, 2) },
    { title: t('sbCategories'), items: links.slice(2, 10) },
    { title: t('sbStyle'),      items: links.slice(10) },
  ].filter(s => s.items.length > 0)

  return (
    <aside className="sidebar-ay">
      {sections.map(section => (
        <div key={section.title} className="sb-section-ay">
          <div className="sb-section-title">{section.title}</div>
          {section.items.map(link => (
            <button
              key={link.id}
              onClick={() => push(link.label)}
              className={`sb-link-ay${activeSidebar === link.label ? ' active' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
