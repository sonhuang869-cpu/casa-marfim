import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Lock, MessageCircle, Eye } from 'lucide-react'
import { houses } from '../lib/catalogue'
import { S } from '../lib/ui'
import { useStore, useT } from '../lib/store'
import type { MemberStatus } from '../lib/access'

function Wordmark({ tone = 'ink' }: { tone?: 'ink' | 'ivory' }) {
  const c = tone === 'ivory' ? 'var(--color-ivory)' : 'var(--color-charcoal)'
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill={c} />
        <path d="M8 23V9l8 9 8-9v14" fill="none" stroke="#C6A664" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.35rem] font-medium leading-none tracking-[0.02em]" style={{ color: c }}>
        Casa Marfim
      </span>
    </span>
  )
}

/**
 * The demo control. In the built store ECA approves and suspends from the
 * Shopify admin; here it is exposed so the access rules can be tested from the
 * front, which is the whole point of the brief's section 7.
 */
function ViewerSwitch() {
  const { signedIn, status, setViewer } = useStore()
  const T = useT()
  const options: { key: string; label: { pt: string; en: string }; signedIn: boolean; status: MemberStatus }[] = [
    { key: 'guest', label: { pt: 'Visitante', en: 'Guest' }, signedIn: false, status: 'none' },
    { key: 'account', label: { pt: 'Conta normal', en: 'Ordinary account' }, signedIn: true, status: 'none' },
    { key: 'applied', label: { pt: 'Candidatura em análise', en: 'Application pending' }, signedIn: true, status: 'applied' },
    { key: 'approved', label: { pt: 'Privé aprovado', en: 'Privé approved' }, signedIn: true, status: 'approved' },
    { key: 'suspended', label: { pt: 'Privé suspenso', en: 'Privé suspended' }, signedIn: true, status: 'suspended' },
  ]
  const current = options.find(o => o.signedIn === signedIn && o.status === status)?.key ?? 'guest'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="caps flex items-center gap-1.5">
        <Eye className="size-3.5" aria-hidden="true" />
        {T({ pt: 'Ver o site como', en: 'View the site as' })}
      </span>
      <label className="sr-only" htmlFor="viewer">{T({ pt: 'Estado do visitante', en: 'Visitor state' })}</label>
      <select
        id="viewer"
        value={current}
        onChange={e => {
          const o = options.find(x => x.key === e.target.value)!
          setViewer(o.signedIn, o.status)
        }}
        className="rounded-none border border-field bg-card px-2.5 py-1 text-xs text-charcoal focus:border-gold"
      >
        {options.map(o => <option key={o.key} value={o.key}>{T(o.label)}</option>)}
      </select>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { lang, setLang } = useStore()
  const T = useT()
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  const shopHouses = houses.filter(h => h.slug !== 'prive')

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-2 focus:text-sm focus:text-ivory">
        {T({ pt: 'Ir para o conteúdo', en: 'Skip to content' })}
      </a>

      {/* Utility strip: language and the demo viewer control */}
      <div className="border-b border-line bg-card">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <ViewerSwitch />
          <div className="flex items-center gap-3">
            <span className="caps">{T(S.language)}</span>
            <div className="flex items-center gap-1" role="group" aria-label={T(S.language)}>
              {(['pt', 'en'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`px-2 py-0.5 text-xs uppercase tracking-[0.12em] transition-colors duration-150 ${
                    lang === l ? 'bg-charcoal text-ivory' : 'text-muted hover:text-charcoal'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
        <div className="shell flex h-[4.25rem] items-center justify-between gap-4">
          <Link to="/" aria-label="Casa Marfim"><Wordmark /></Link>

          <nav aria-label={T({ pt: 'Navegação principal', en: 'Primary navigation' })} className="hidden items-center gap-7 lg:flex">
            {shopHouses.map(h => (
              <NavLink
                key={h.slug}
                to={`/casa/${h.slug}`}
                className={({ isActive }) =>
                  `text-[0.8125rem] tracking-[0.04em] transition-colors duration-150 ${
                    isActive ? 'text-gold' : 'text-ink-2 hover:text-charcoal'
                  }`
                }
              >
                {T(h.name)}
              </NavLink>
            ))}
            <NavLink
              to="/prive"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-[0.8125rem] tracking-[0.04em] ${isActive ? 'text-gold' : 'text-ink-2 hover:text-charcoal'}`
              }
            >
              <Lock className="size-3.5" aria-hidden="true" />
              {T(S.prive)}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/concierge" className="hidden bg-charcoal px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-ivory hover:bg-gold sm:inline-block">
              {T(S.concierge)}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="grid size-10 place-items-center border border-field lg:hidden"
            >
              {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
              <span className="sr-only">{open ? T({ pt: 'Fechar menu', en: 'Close menu' }) : T({ pt: 'Abrir menu', en: 'Open menu' })}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label={T({ pt: 'Navegação móvel', en: 'Mobile navigation' })} className="border-t border-line bg-ivory lg:hidden">
            <div className="shell py-2">
              {shopHouses.map(h => (
                <NavLink key={h.slug} to={`/casa/${h.slug}`} className="block border-b border-line py-3 text-sm">
                  {T(h.name)}
                </NavLink>
              ))}
              <NavLink to="/prive" className="block border-b border-line py-3 text-sm">{T(S.prive)}</NavLink>
              <NavLink to="/concierge" className="block py-3 text-sm">{T(S.concierge)}</NavLink>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">{children}</main>

      <footer className="bg-charcoal text-ivory">
        <div className="shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark tone="ivory" />
            <p className="mt-4 max-w-xs text-sm" style={{ color: '#CFC7BA' }}>
              {T({
                pt: 'Rua Rainha Ginga, Luanda. Atendimento de segunda a sábado, com entrega em Luanda, nas províncias e em Portugal.',
                en: 'Rua Rainha Ginga, Luanda. Open Monday to Saturday, delivering in Luanda, the provinces and Portugal.',
              })}
            </p>
            <a href="https://wa.me/244000000000" className="mt-5 inline-flex items-center gap-2 text-sm text-ivory hover:underline">
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp Business
            </a>
          </div>
          <nav aria-label={T(S.houses)}>
            <p className="caps" style={{ color: '#C6A664' }}>{T(S.houses)}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {houses.map(h => (
                <li key={h.slug}>
                  <Link to={h.slug === 'prive' ? '/prive' : `/casa/${h.slug}`} className="hover:underline" style={{ color: '#CFC7BA' }}>
                    {T(h.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={T({ pt: 'Informação', en: 'Information' })}>
            <p className="caps" style={{ color: '#C6A664' }}>{T({ pt: 'Informação', en: 'Information' })}</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/concierge" className="hover:underline" style={{ color: '#CFC7BA' }}>{T(S.conciergeTitle)}</Link></li>
              <li><Link to="/prive" className="hover:underline" style={{ color: '#CFC7BA' }}>{T(S.priveTitle)}</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-ink-2">
          <div className="shell py-5">
            <p className="text-xs" style={{ color: '#9D948A' }}>{T(S.prototype)}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
