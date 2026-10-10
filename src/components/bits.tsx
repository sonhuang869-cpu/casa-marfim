import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { kz, t, type Product } from '../lib/catalogue'
import { S } from '../lib/ui'
import { useStore, useT } from '../lib/store'

export function Img({
  product, size = 'card', className = '', priority,
}: { product: Product; size?: 'thumb' | 'card' | 'full'; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  const { lang } = useStore()
  const alt = `${t(product.name, lang)}, ${product.brand}`
  if (failed) {
    return <div className={`grid place-items-center bg-gold-soft text-center text-xs text-muted ${className}`} role="img" aria-label={alt}>{product.brand}</div>
  }
  const src = size === 'thumb' ? `/img/${product.img}-160.webp` : size === 'card' ? `/img/${product.img}-440.webp` : `/img/${product.img}.webp`
  return (
    <img
      src={src}
      srcSet={`/img/${product.img}-160.webp 160w, /img/${product.img}-440.webp 440w, /img/${product.img}.webp 900w`}
      sizes={size === 'full' ? '(min-width:1024px) 560px, 92vw' : size === 'thumb' ? '80px' : '(min-width:1024px) 280px, 45vw'}
      width={900} height={1125}
      loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'sync' : 'async'}
      onError={() => setFailed(true)}
      alt={alt}
      className={`bg-gold-soft object-cover ${className}`}
    />
  )
}

/** The badge that answers "can I buy this now?" before anything else. */
export function Availability({ p, large }: { p: Product; large?: boolean }) {
  const T = useT()
  const map = {
    'in-stock': { label: S.inStock, cls: 'border-pos text-pos' },
    'sourced-deposit': { label: S.sourced, cls: 'border-gold text-gold' },
    'request-only': { label: S.requestOnly, cls: 'border-rose text-rose' },
    'sold-out': { label: S.soldOut, cls: 'border-field text-muted' },
  }[p.availability]
  return (
    <span className={`inline-block border px-2.5 py-1 uppercase tracking-[0.14em] ${map.cls} ${large ? 'text-[0.6875rem]' : 'text-[0.625rem]'}`}>
      {T(map.label)}
    </span>
  )
}

export function Price({ p, large }: { p: Product; large?: boolean }) {
  const T = useT()
  if (p.priceKz === null) {
    return <span className={`text-muted ${large ? 'text-base' : 'text-sm'}`}>{T(S.priceOnAsk)}</span>
  }
  return (
    <span className="flex flex-wrap items-baseline gap-2">
      <span className={`font-display ${large ? 'text-3xl' : 'text-lg'} text-charcoal`}>{kz(p.priceKz)}</span>
      {p.compareKz && <span className="text-xs text-muted line-through">{kz(p.compareKz)}</span>}
    </span>
  )
}

export function Card({ p }: { p: Product }) {
  const T = useT()
  return (
    <li className="group">
      <Link to={`/produto/${p.slug}`} className="block">
        <div className="relative overflow-hidden bg-gold-soft">
          <Img product={p} className="aspect-[4/5] w-full transition-transform duration-300 group-hover:scale-[1.02]" />
          {p.visibility === 'prive' && (
            <span className="absolute left-3 top-3 flex items-center gap-1 bg-charcoal px-2 py-1 text-[0.625rem] uppercase tracking-[0.14em] text-ivory">
              <Lock className="size-3" aria-hidden="true" /> {T(S.prive)}
            </span>
          )}
        </div>
        <p className="caps mt-3">{p.brand}</p>
        <h3 className="display-3 mt-1 group-hover:text-gold">{T(p.name)}</h3>
        <div className="mt-2"><Price p={p} /></div>
        <div className="mt-2.5"><Availability p={p} /></div>
      </Link>
    </li>
  )
}

export function Button({
  children, onClick, type = 'button', tone = 'ink', full, disabled,
}: { children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; tone?: 'ink' | 'gold' | 'outline'; full?: boolean; disabled?: boolean }) {
  const tones = {
    ink: 'bg-charcoal text-ivory hover:bg-gold',
    gold: 'bg-gold text-ivory hover:bg-charcoal',
    outline: 'border border-field text-charcoal hover:border-charcoal',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-block px-6 py-3 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-150 disabled:opacity-55 ${tones[tone]} ${full ? 'w-full' : ''}`}>
      {children}
    </button>
  )
}

export const inputClass =
  'w-full rounded-none border border-field bg-card px-3 py-2.5 text-sm text-charcoal placeholder:text-muted focus:border-gold focus:outline-2 focus:outline-offset-0 focus:outline-gold'

export function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="caps block">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-neg">{error}</p>}
    </div>
  )
}
