'use client'
import { useState } from 'react'
import ProductForm from './ProductForm'

const GENDERS = [
  { value: 'men',    label: 'Men',    icon: '👔', desc: 'Meshkuj' },
  { value: 'women',  label: 'Women',  icon: '👗', desc: 'Femra' },
  { value: 'kids',   label: 'Kids',   icon: '🧸', desc: 'Fëmijë' },
  { value: 'unisex', label: 'Unisex', icon: '👚', desc: 'Të gjithë' },
]

const KIDS_SUBS = [
  { value: 'kids',         label: 'Të gjithë',  icon: '🧸', desc: 'All Kids' },
  { value: 'kids-babies',  label: 'Babies',      icon: '🍼', desc: '0–2 vjeç' },
  { value: 'kids-girls',   label: 'Girls',        icon: '🎀', desc: 'Vajza' },
  { value: 'kids-boys',    label: 'Boys',         icon: '⚽', desc: 'Djem' },
]

const CATEGORIES = [
  { value: 'clothing',    label: 'Veshje',      icon: '👕' },
  { value: 'shoes',       label: 'Këpucë',      icon: '👟' },
  { value: 'accessories', label: 'Aksesore',    icon: '👜' },
  { value: 'sports',      label: 'Sport',       icon: '🏃' },
  { value: 'electronics', label: 'Elektronikë', icon: '📱' },
]

type Step = 'gender' | 'kids-sub' | 'category' | 'details'

export default function ProductWizard({ categoryTags }: { categoryTags?: Record<string, string[]> }) {
  const [step, setStep] = useState<Step>('gender')
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')

  const pickGender = (g: string) => {
    setGender(g)
    setStep(g === 'kids' ? 'kids-sub' : 'category')
  }

  const pickKidsSub = (sub: string) => {
    setGender(sub)
    setStep('category')
  }

  const pickCategory = (c: string) => {
    setCategory(c)
    setStep('details')
  }

  const progressStep = step === 'gender' ? 1 : step === 'kids-sub' ? 1 : step === 'category' ? 2 : 3

  const genderLabel = [...GENDERS, ...KIDS_SUBS].find(g => g.value === gender)
  const categoryLabel = CATEGORIES.find(c => c.value === category)

  return (
    <div className="wizard-ay">
      <WizardProgress step={progressStep} hasKidsSub={step === 'kids-sub'} />

      {step === 'gender' && (
        <>
          <p className="wizard-hint-ay">Hapi 1 — Zgjidhni për kë është produkti</p>
          <div className="wizard-cards-ay wizard-cards-2-ay">
            {GENDERS.map(g => (
              <button key={g.value} className="wizard-card-ay" onClick={() => pickGender(g.value)}>
                <span className="wizard-icon-ay">{g.icon}</span>
                <span className="wizard-card-label-ay">{g.label}</span>
                <span className="wizard-card-desc-ay">{g.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'kids-sub' && (
        <>
          <div className="wizard-nav-ay">
            <button className="admin-btn-ay admin-btn-ghost" onClick={() => setStep('gender')}>← Kthehu</button>
            <span className="wizard-breadcrumb-ay">🧸 <strong>Kids</strong></span>
          </div>
          <p className="wizard-hint-ay">Hapi 1b — Zgjidhni tipin e fëmijëve</p>
          <div className="wizard-cards-ay wizard-cards-2-ay">
            {KIDS_SUBS.map(s => (
              <button key={s.value} className="wizard-card-ay" onClick={() => pickKidsSub(s.value)}>
                <span className="wizard-icon-ay">{s.icon}</span>
                <span className="wizard-card-label-ay">{s.label}</span>
                <span className="wizard-card-desc-ay">{s.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'category' && (
        <>
          <div className="wizard-nav-ay">
            <button className="admin-btn-ay admin-btn-ghost"
              onClick={() => setStep(gender.startsWith('kids') ? 'kids-sub' : 'gender')}>
              ← Kthehu
            </button>
            <span className="wizard-breadcrumb-ay">
              {genderLabel?.icon} <strong>{genderLabel?.label}</strong>
            </span>
          </div>
          <p className="wizard-hint-ay">Hapi 2 — Zgjidhni kategorinë e produktit</p>
          <div className="wizard-cards-ay wizard-cards-3-ay">
            {CATEGORIES.map(c => (
              <button key={c.value} className="wizard-card-ay" onClick={() => pickCategory(c.value)}>
                <span className="wizard-icon-ay">{c.icon}</span>
                <span className="wizard-card-label-ay">{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'details' && (
        <>
          <div className="wizard-nav-ay">
            <button className="admin-btn-ay admin-btn-ghost" onClick={() => setStep('category')}>← Kthehu</button>
            <span className="wizard-breadcrumb-ay">
              {genderLabel?.icon} <strong>{genderLabel?.label}</strong>
              <span className="wizard-sep-ay">›</span>
              {categoryLabel?.icon} <strong>{categoryLabel?.label}</strong>
            </span>
          </div>
          <p className="wizard-hint-ay">Hapi 3 — Plotësoni detajet e produktit</p>
          <ProductForm
            initialGender={gender}
            initialCategory={category}
            categoryTags={categoryTags}
          />
        </>
      )}
    </div>
  )
}

function WizardProgress({ step, hasKidsSub }: { step: number; hasKidsSub: boolean }) {
  const steps = ['Gjinia', 'Kategoria', 'Detajet']
  return (
    <div className="wizard-progress-ay">
      {steps.map((label, i) => {
        const n = i + 1
        const isActive = n === step
        const isDone = n < step
        const state = isDone ? 'done' : isActive ? 'active' : 'pending'
        return (
          <div key={label} className={`wizard-step-ay ${state}`}>
            <div className="wizard-step-num-ay">{isDone ? '✓' : n}</div>
            <span className="wizard-step-label-ay">
              {label}{n === 1 && hasKidsSub ? ' › Kids' : ''}
            </span>
            {i < steps.length - 1 && <div className="wizard-step-line-ay" />}
          </div>
        )
      })}
    </div>
  )
}
