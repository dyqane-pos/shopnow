'use client'
import { useState, useTransition } from 'react'
import { saveCategoryTags } from '@/actions/categories'
import type { Category } from '@/lib/types'
import { PRODUCT_TAGS } from '@/lib/types'

interface Props {
  productCats: Category[]
  categoryTags: Record<string, string[]>
}

export default function CategoryTagsManager({ productCats, categoryTags }: Props) {
  const cats = productCats.filter(c => c.id !== 'all')
  const [activeCat, setActiveCat] = useState(cats[0]?.id ?? '')
  const [localTags, setLocalTags] = useState<Record<string, string[]>>(
    Object.fromEntries(cats.map(c => [c.id, categoryTags[c.id] ?? []]))
  )
  const [, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const toggle = (catId: string, tag: string) => {
    setSaved(false)
    setLocalTags(prev => {
      const cur = prev[catId] ?? []
      return {
        ...prev,
        [catId]: cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag],
      }
    })
  }

  const handleSave = (catId: string) => {
    startTransition(async () => {
      await saveCategoryTags(catId, localTags[catId] ?? [])
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const currentCat = cats.find(c => c.id === activeCat)
  const currentTags = localTags[activeCat] ?? []

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: '8px', overflow: 'hidden', maxWidth: '640px' }}>
      {/* Tab headers */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e4', overflowX: 'auto' }}>
        {cats.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); setSaved(false) }}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: activeCat === cat.id ? 800 : 500,
              color: activeCat === cat.id ? '#1a1a1a' : '#888',
              borderBottom: activeCat === cat.id ? '2px solid #1a1a1a' : '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'color .15s',
            }}
          >
            {cat.label}
            <span style={{ marginLeft: 6, fontSize: '10px', color: '#bbb' }}>
              ({localTags[cat.id]?.length ?? 0})
            </span>
          </button>
        ))}
      </div>

      {/* Tag checkboxes */}
      {currentCat && (
        <div style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '1rem' }}>
            Zgjedh tagjet që shfaqen në sidebar kur vizitori zgjedh <strong>{currentCat.label}</strong>
          </div>
          <div className="tags-grid-ay" style={{ marginBottom: '1rem' }}>
            {PRODUCT_TAGS.map(tag => (
              <label key={tag} className="tag-check-ay">
                <input
                  type="checkbox"
                  checked={currentTags.includes(tag)}
                  onChange={() => toggle(activeCat, tag)}
                />
                {tag}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="admin-btn-ay admin-btn-primary"
              onClick={() => handleSave(activeCat)}
            >
              Ruaj për {currentCat.label}
            </button>
            {saved && (
              <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 700 }}>
                ✓ U ruajt
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
