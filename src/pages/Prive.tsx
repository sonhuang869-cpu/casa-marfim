import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Check, Phone } from 'lucide-react'
import { products } from '../lib/catalogue'
import { can, visibleTo } from '../lib/access'
import { S } from '../lib/ui'
import { useStore, useT } from '../lib/store'
import { Button, Card, Field, inputClass } from '../components/bits'
import Denied from './Denied'

/** The public page: explains the offering and takes an application. */
export function PrivePublic() {
  const T = useT()
  const { viewer, status, setViewer, addEnquiry } = useStore()
  const [form, setForm] = useState({ name: '', email: '', why: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<string | null>(null)

  const approved = viewer.signedIn && status === 'approved'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = T(S.required)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = T(S.badEmail)
    if (form.why.trim().length < 10) errs.why = T(S.tooShort)
    setErrors(errs)
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return }
    const made = addEnquiry({ kind: 'prive', name: form.name.trim(), email: form.email.trim(), detail: form.why.trim() })
    // An application never grants access. It moves the account to "pending"
    // and waits for ECA, which is exactly what section 7 of the brief asks.
    setViewer(true, 'applied')
    setSent(made.ref)
  }

  return (
    <>
      <section className="bg-charcoal text-ivory">
        <div className="shell py-16 md:py-24">
          <div className="hairline max-w-2xl">
            <p className="caps" style={{ color: '#C6A664' }}>{T(S.prive)}</p>
            <h1 className="display-1 mt-3">{T(S.priveTitle)}</h1>
            <p className="mt-6 text-lg" style={{ color: '#CFC7BA' }}>{T(S.priveLede)}</p>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { pt: 'Seleção reservada, publicada ao longo da semana.', en: 'A reserved selection, published through the week.' },
              { pt: 'Preços e condições específicos da sua conta.', en: 'Pricing and terms specific to your account.' },
              { pt: 'Um número direto, não um formulário.', en: 'A direct number, not a form.' },
            ].map((x, i) => (
              <li key={i} className="border-t border-ink-2 pt-4 text-sm" style={{ color: '#CFC7BA' }}>{T(x)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        {approved ? (
          <div className="mx-auto max-w-xl text-center">
            <h2 className="display-2">{T({ pt: 'A sua conta está aprovada.', en: 'Your account is approved.' })}</h2>
            <div className="mt-7"><Link to="/prive/sala"><Button tone="ink">{T(S.enterRoom)}</Button></Link></div>
          </div>
        ) : sent || status === 'applied' ? (
          <div className="mx-auto max-w-xl border border-gold-orn bg-gold-soft p-8 text-center">
            <Check className="mx-auto size-7 text-gold" aria-hidden="true" />
            <h2 className="display-3 mt-4">{T(S.applicationSent)}{sent ? ` · ${sent}` : ''}</h2>
            <p className="mt-3 text-sm text-ink-2">{T(S.deniedPending)}</p>
            <p className="mt-4 text-xs text-muted">
              {T({
                pt: 'A candidatura não dá acesso. A aprovação é feita pela equipa, e só então a seleção reservada aparece.',
                en: 'Applying does not grant access. Approval is done by the team, and only then does the reserved selection appear.',
              })}
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <div className="hairline">
              <h2 className="display-2">{T({ pt: 'Candidatura', en: 'Application' })}</h2>
            </div>
            <form noValidate onSubmit={submit} className="mt-7 grid gap-5">
              <Field id="name" label={T(S.fName)} error={errors.name}>
                <input id="name" className={inputClass} value={form.name} autoComplete="name"
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field id="email" label={T(S.fEmail)} error={errors.email}>
                <input id="email" type="email" className={inputClass} value={form.email} autoComplete="email"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field id="why" label={T({ pt: 'O que procura normalmente', en: 'What you usually look for' })} error={errors.why}>
                <textarea id="why" rows={4} className={inputClass} value={form.why}
                  aria-invalid={!!errors.why} aria-describedby={errors.why ? 'why-error' : undefined}
                  onChange={e => setForm(f => ({ ...f, why: e.target.value }))} />
              </Field>
              <Button type="submit" tone="ink" full>{T(S.applyNow)}</Button>
            </form>
          </div>
        )}
      </section>
    </>
  )
}

/** The private room itself. */
export function PriveRoom() {
  const T = useT()
  const { viewer } = useStore()

  const decision = can(viewer, { id: 'prive-room', kind: 'page', visibility: 'prive' })
  if (!decision.allow) return <Denied reason={decision.reason} />

  const items = visibleTo(viewer, products.filter(p => p.visibility === 'prive'))

  return (
    <div className="shell py-12 md:py-16">
      <div className="hairline">
        <p className="caps caps-gold flex items-center gap-1.5"><Lock className="size-3.5" aria-hidden="true" /> {T(S.prive)}</p>
        <h1 className="display-1 mt-3">{T(S.privateRoom)}</h1>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-5">
        <p className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-gold" aria-hidden="true" />
          <span className="caps">{T(S.directLine)}</span>
          <a href="tel:+244923000000" className="font-display text-xl text-charcoal hover:text-gold">+244 923 000 000</a>
        </p>
        <p className="text-xs text-muted">
          {T({ pt: 'Atendimento direto, sem formulário, das 8h às 20h.', en: 'Answered directly, no form, 8am to 8pm.' })}
        </p>
      </div>

      <h2 className="display-2 mt-12">{T({ pt: 'Seleção reservada', en: 'Reserved selection' })}</h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
        {items.map(p => <Card key={p.id} p={p} />)}
      </ul>
    </div>
  )
}
