import { useState } from 'react'
import { Check, MessageCircle, Mail } from 'lucide-react'
import { S } from '../lib/ui'
import { useT, useStore } from '../lib/store'
import { Button, Field, inputClass } from '../components/bits'

/**
 * The brief: "Forms should be appropriate to the service rather than asking
 * every customer irrelevant questions." So the request type chooses the
 * fields, and a wellness enquiry is never asked for a shoe size.
 */
const KINDS = [
  { key: 'sourcing', label: { pt: 'Procurar um produto', en: 'Source a product' },
    fields: ['what', 'brand', 'budget', 'when', 'where', 'links'] },
  { key: 'personal', label: { pt: 'Compras pessoais', en: 'Personal shopping' },
    fields: ['what', 'budget', 'when', 'where'] },
  { key: 'appointment', label: { pt: 'Marcar atendimento', en: 'Book an appointment' },
    fields: ['when', 'where', 'notes'] },
  { key: 'other', label: { pt: 'Outro pedido', en: 'Another request' },
    fields: ['what', 'notes'] },
] as const

type Kind = (typeof KINDS)[number]['key']

export default function Concierge() {
  const T = useT()
  const { addEnquiry } = useStore()
  const [kind, setKind] = useState<Kind>('sourcing')
  const [v, setV] = useState<Record<string, string>>({ currency: 'AOA' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<string | null>(null)

  const active = KINDS.find(k => k.key === kind)!
  const set = (f: string, val: string) => setV(p => ({ ...p, [f]: val }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!v.name?.trim()) errs.name = T(S.required)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v.email ?? '').trim())) errs.email = T(S.badEmail)
    if (!v.phone?.trim()) errs.phone = T(S.required)
    if (active.fields.includes('what' as never) && (v.what ?? '').trim().length < 10) errs.what = T(S.tooShort)
    if (active.fields.includes('when' as never) && !v.when?.trim()) errs.when = T(S.required)
    setErrors(errs)
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return }
    const made = addEnquiry({
      kind: kind === 'appointment' ? 'appointment' : 'concierge',
      name: v.name!.trim(), email: v.email!.trim(),
      detail: active.fields.map(f => v[f]).filter(Boolean).join(' · '),
    })
    setSent(made.ref)
  }

  if (sent) {
    return (
      <section className="shell py-20 md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <Check className="mx-auto size-8 text-pos" aria-hidden="true" />
          <p className="caps caps-gold mt-5">{sent}</p>
          <h1 className="display-2 mt-3">{T({ pt: 'Pedido recebido', en: 'Request received' })}</h1>
          <p className="mt-5 text-base text-ink-2">
            {T({
              pt: 'A nossa equipa responde no mesmo dia útil, por email ou WhatsApp, conforme preferir.',
              en: 'Our team replies the same working day, by email or WhatsApp, whichever you prefer.',
            })}
          </p>
          <p className="mt-6 text-xs text-muted">{T({ pt: 'Protótipo, por isso nada foi enviado.', en: 'Prototype, so nothing was actually sent.' })}</p>
        </div>
      </section>
    )
  }

  return (
    <div className="shell grid gap-12 py-12 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
      <div>
        <div className="hairline max-w-xl">
          <h1 className="display-1">{T(S.conciergeTitle)}</h1>
          <p className="mt-5 text-base text-ink-2">{T(S.conciergeLede)}</p>
        </div>

        <fieldset className="mt-9">
          <legend className="caps mb-2.5">{T({ pt: 'Tipo de pedido', en: 'Type of request' })}</legend>
          <div className="flex flex-wrap gap-2">
            {KINDS.map(k => (
              <button key={k.key} type="button" onClick={() => setKind(k.key)} aria-pressed={kind === k.key}
                className={`border px-4 py-2 text-sm transition-colors duration-150 ${kind === k.key ? 'border-charcoal bg-charcoal text-ivory' : 'border-field hover:border-charcoal'}`}>
                {T(k.label)}
              </button>
            ))}
          </div>
        </fieldset>

        <form noValidate onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field id="name" label={T(S.fName)} error={errors.name}>
            <input id="name" className={inputClass} autoComplete="name" value={v.name ?? ''}
              aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}
              onChange={e => set('name', e.target.value)} />
          </Field>
          <Field id="email" label={T(S.fEmail)} error={errors.email}>
            <input id="email" type="email" className={inputClass} autoComplete="email" value={v.email ?? ''}
              aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
              onChange={e => set('email', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="phone" label={T(S.fPhone)} error={errors.phone}>
              <input id="phone" className={inputClass} autoComplete="tel" value={v.phone ?? ''} placeholder="+244"
                aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined}
                onChange={e => set('phone', e.target.value)} />
            </Field>
          </div>

          {active.fields.includes('what' as never) && (
            <div className="sm:col-span-2">
              <Field id="what" label={T(S.fWhat)} error={errors.what}>
                <textarea id="what" rows={3} className={inputClass} value={v.what ?? ''}
                  aria-invalid={!!errors.what} aria-describedby={errors.what ? 'what-error' : undefined}
                  onChange={e => set('what', e.target.value)} />
              </Field>
            </div>
          )}
          {active.fields.includes('brand' as never) && (
            <div className="sm:col-span-2">
              <Field id="brand" label={T(S.fBrand)}>
                <input id="brand" className={inputClass} value={v.brand ?? ''} onChange={e => set('brand', e.target.value)} />
              </Field>
            </div>
          )}
          {active.fields.includes('budget' as never) && (
            <>
              <Field id="budget" label={T(S.fBudget)}>
                <input id="budget" inputMode="numeric" className={inputClass} value={v.budget ?? ''} onChange={e => set('budget', e.target.value)} />
              </Field>
              <Field id="currency" label={T(S.fCurrency)}>
                <select id="currency" className={inputClass} value={v.currency} onChange={e => set('currency', e.target.value)}>
                  <option value="AOA">AOA (Kz)</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </Field>
            </>
          )}
          {active.fields.includes('when' as never) && (
            <Field id="when" label={T(S.fWhen)} error={errors.when}>
              <input id="when" type="date" className={inputClass} value={v.when ?? ''}
                aria-invalid={!!errors.when} aria-describedby={errors.when ? 'when-error' : undefined}
                onChange={e => set('when', e.target.value)} />
            </Field>
          )}
          {active.fields.includes('where' as never) && (
            <Field id="where" label={T(S.fWhere)}>
              <select id="where" className={inputClass} value={v.where ?? ''} onChange={e => set('where', e.target.value)}>
                <option value="">{T({ pt: 'Escolher', en: 'Choose' })}</option>
                <option value="luanda">Luanda</option>
                <option value="provincias">{T({ pt: 'Outra província', en: 'Another province' })}</option>
                <option value="portugal">Portugal</option>
              </select>
            </Field>
          )}
          {active.fields.includes('links' as never) && (
            <div className="sm:col-span-2">
              <Field id="links" label={T(S.fLinks)} hint={T({ pt: 'Cole aqui links ou referências.', en: 'Paste links or references here.' })}>
                <input id="links" className={inputClass} value={v.links ?? ''} onChange={e => set('links', e.target.value)} />
              </Field>
            </div>
          )}
          {active.fields.includes('notes' as never) && (
            <div className="sm:col-span-2">
              <Field id="notes" label={T(S.fNotes)}>
                <textarea id="notes" rows={3} className={inputClass} value={v.notes ?? ''} onChange={e => set('notes', e.target.value)} />
              </Field>
            </div>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" tone="ink" full>{T(S.send)}</Button>
          </div>
        </form>
      </div>

      <aside className="lg:pt-24">
        <div className="border border-line bg-card p-7">
          <p className="caps caps-gold">{T({ pt: 'Prefere falar', en: 'Rather talk' })}</p>
          <a href="https://wa.me/244000000000" className="mt-3 flex items-center gap-2.5 text-sm hover:text-gold">
            <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp Business
          </a>
          <a href="mailto:concierge@casamarfim.ao" className="mt-2.5 flex items-center gap-2.5 text-sm hover:text-gold">
            <Mail className="size-4" aria-hidden="true" /> concierge@casamarfim.ao
          </a>
          <p className="mt-5 border-t border-line pt-4 text-xs text-muted">
            {T({
              pt: 'Cada pedido chega à equipa com o contexto do produto, quando vem de uma página de artigo.',
              en: 'Each request reaches the team with the product context, when it comes from an item page.',
            })}
          </p>
        </div>
      </aside>
    </div>
  )
}
