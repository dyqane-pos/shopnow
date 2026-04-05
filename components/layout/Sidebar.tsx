import Link from 'next/link'
import type { Category } from '@/lib/types'

export default function Sidebar({ links }: { links: Category[] }) {
  const sections = [
    { title: 'Eksploroni', items: links.slice(0, 2) },
    { title: 'Kategoritë', items: links.slice(2, 10) },
    { title: 'Stil & Madhësi', items: links.slice(10) },
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
