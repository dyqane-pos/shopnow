'use client'
import { useState } from 'react'
import ProductForm from './ProductForm'

const GENDERS = [
  { value: 'men',    label: 'Men',    icon: '👔', desc: 'Meshkuj' },
  { value: 'women',  label: 'Women',  icon: '👗', desc: 'Femra' },
  { value: 'kids',   label: 'Kids',   icon: '🧸', desc: 'Fëmijë' },
  { value: 'unisex', label: 'Unisex', icon: '👚', desc: 'Të gjithë' },
]

const CATEGORIES = [
  { value: 'clothing',     label: 'Veshje',      icon: '👕' },
  { value: 'shoes',        label: 'Këpucë',      icon: '👟' },
  { value: 'accessories',  label: 'Aksesore',    icon: '👜' },
  { value: 'sports',       label: 'Sport',       icon: '⚽' },
  { value: 'electronics',  label: 'Elektronikë', icon: '📱' },
]

export default function ProductWizard({ categoryTags }: { categoryTags?: Record<string, string[]> }) {
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')

  const pickGender = (g: string) => { setGender(g); setStep(2) }
  const pickCategory = (c: string) => { setCategory(c); setStep(3) }

  return (
    <div className="wizard-ay">
      <WizardProgress step={step} />

      {step === 1 && (
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

      {step === 2 && (
        <>
          <div className="wizard-nav-ay">
            <button className="admin-btn-ay admin-btn-ghost" onClick={() => setStep(1)}>← Kthehu</button>
            <span className="wizard-breadcrumb-ay">
              {GENDERS.find(g => g.value === gender)?.icon} <strong>{GENDERS.find(g => g.value === gender)?.label}</strong>
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

      {step === 3 && (
        <>
          <div className="wizard-nav-ay">
            <button className="admin-btn-ay admin-btn-ghost" onClick={() => setStep(2)}>← Kthehu</button>
            <span className="wizard-breadcrumb-ay">
              {GENDERS.find(g => g.value === gender)?.icon} <strong>{GENDERS.find(g => g.value === gender)?.label}</strong>
              <span className="wizard-sep-ay">›</span>
              {CATEGORIES.find(c => c.value === category)?.icon} <strong>{CATEGORIES.find(c => c.value === category)?.label}</strong>
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

function WizardProgress({ step }: { step: number }) {
  const steps = ['Gjinia', 'Kategoria', 'Detajet']
  return (
    <div className="wizard-progress-ay">
      {steps.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'active' : 'pending'
        return (
          <div key={label} className={`wizard-step-ay ${state}`}>
            <div className="wizard-step-num-ay">{state === 'done' ? '✓' : n}</div>
            <span className="wizard-step-label-ay">{label}</span>
            {i < steps.length - 1 && <div className="wizard-step-line-ay" />}
          </div>
        )
      })}
    </div>
  )
}
