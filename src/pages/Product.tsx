import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Check, Truck, MessageCircle } from 'lucide-react'
import { bySlug, houseBySlug, kz, products } from '../lib/catalogue'
import { can, visibleTo } from '../lib/access'
import { S } from '../lib/ui'
import { useStore, useT } from '../lib/store'
import { Availability, Button, Card, Img, Price } from '../components/bits'
import Denied from './Denied'

export default function ProductPage() {
  const { slug } = useParams()
  const T = useT()
  const { viewer, addEnquiry } = useStore()
  const [variant, setVariant] = useState(0)
  const [done, setDone] = useState<string | null>(null)

  const p = slug ? bySlug(slug) : undefined
  if (!p) return <Navigate to="/404" replace />

  // The direct link goes through exactly the same rule as the listing did.
  const decision = can(viewer, { id: p.id, kind: 'product', visibility: p.visibility })
  if (!decision.allow) return <Denied reason={decision.reason} />

  const house = houseBySlug(p.house)!
  const deposit = p.priceKz !== null && p.depositPct !== null ? Math.round(p.priceKz * p.depositPct) : null
  const related = visibleTo(viewer, products.filter(x => x.id !== p.id && x.house === p.house)).slice(0, 4)

  const primary =
    p.availability === 'in-stock' ? S.shopNow :
    p.availability === 'sourced-deposit' ? S.shopNow :
    p.availability === 'request-only' ? S.requestQuote : S.notifyMe

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-card">
        <div className="shell flex flex-wrap items-center gap-2 py-3 text-xs text-muted">
          <Link to="/" className="hover:text-charcoal">{T({ pt: 'Início', en: 'Home' })}</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/casa/${house.slug}`} className="hover:text-charcoal">{T(house.name)}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-charcoal">{T(p.name)}</span>
        </div>
      </nav>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[1.05fr_26rem] lg:gap-16 lg:py-14">
        <div>
          <Img product={p} size="full" priority className="aspect-[4/5] w-full" />
        </div>

        <div>
          <p className="caps caps-gold">{p.brand}</p>
          <h1 className="display-1 mt-2 text-[2.2rem] md:text-[2.6rem]">{T(p.name)}</h1>
          <div className="mt-4"><Availability p={p} large /></div>
          <div className="mt-5"><Price p={p} large /></div>
          <p className="mt-4 text-base text-ink-2">{T(p.blurb)}</p>

          {p.variants.length > 1 && (
            <fieldset className="mt-7">
              <legend className="caps mb-2">{T({ pt: 'Opção', en: 'Option' })}</legend>
              <div className="flex flex-wrap gap-2">
                {p.variants.map((v, i) => (
                  <button key={T(v)} type="button" onClick={() => setVariant(i)} aria-pressed={variant === i}
                    className={`border px-4 py-2 text-sm transition-colors duration-150 ${variant === i ? 'border-charcoal bg-charcoal text-ivory' : 'border-field hover:border-charcoal'}`}>
                    {T(v)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {deposit !== null && (
            <div className="mt-7 border border-gold-orn bg-gold-soft p-5">
              <p className="caps caps-gold">{T({ pt: 'Pagamento em duas partes', en: 'Paid in two parts' })}</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt>{T({ pt: 'Depósito hoje', en: 'Deposit today' })}</dt>
                  <dd className="font-medium">{kz(deposit)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{T({ pt: 'Saldo antes do envio', en: 'Balance before despatch' })}</dt>
                  <dd className="text-muted">{kz(p.priceKz! - deposit)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">{T(S.depositNote)}</p>
            </div>
          )}

          <div className="mt-7">
            {done ? (
              <div className="border border-pos bg-card p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-pos">
                  <Check className="size-4" aria-hidden="true" />
                  {T({ pt: 'Pedido registado', en: 'Request logged' })} · {done}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {T({ pt: 'Protótipo, por isso nada foi enviado. No site real isto chega à equipa e ao cliente.', en: 'Prototype, so nothing was sent. On the real site this reaches the team and the customer.' })}
                </p>
              </div>
            ) : (
              <Button
                tone="ink"
                full
                disabled={p.availability === 'sold-out'}
                onClick={() => {
                  const e = addEnquiry({ kind: 'concierge', name: 'Demo', email: 'demo@casamarfim.ao', detail: `${T(p.name)} (${p.availability})` })
                  setDone(e.ref)
                }}
              >
                {T(primary)}
              </Button>
            )}
          </div>

          <ul className="mt-5 space-y-2">
            <li className="flex items-center gap-2 text-xs text-muted">
              <Truck className="size-3.5" aria-hidden="true" />
              {T({ pt: 'Entrega em Luanda, províncias e Portugal', en: 'Delivery in Luanda, the provinces and Portugal' })}
            </li>
            <li className="flex items-center gap-2 text-xs text-muted">
              <MessageCircle className="size-3.5" aria-hidden="true" />
              <a href={`https://wa.me/244000000000?text=${encodeURIComponent(T(p.name))}`} className="hover:text-charcoal hover:underline">
                {T({ pt: 'Perguntar por WhatsApp sobre este artigo', en: 'Ask about this item on WhatsApp' })}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="border-t border-line bg-card">
          <div className="shell py-14">
            <h2 id="related" className="display-2">{T({ pt: 'Da mesma casa', en: 'From the same house' })}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {related.map(x => <Card key={x.id} p={x} />)}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
