'use client'
import Link from 'next/link'
import type { Category } from '@/lib/types'
import { useLang } from '@/context/LanguageContext'

export default function Sidebar({ links }: { links: Category[] }) {
  const { t } = useLang()

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
            <Link key={link.id} href={`/?sidebar=${encodeURIComponent(link.label)}`} className="sb-link-ay">
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  )
}
