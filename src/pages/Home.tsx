import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { houses, products, bySlug } from '../lib/catalogue'
import { visibleTo } from '../lib/access'
import { S } from '../lib/ui'
import { useStore, useT } from '../lib/store'
import { Card, Button } from '../components/bits'

export default function Home() {
  const T = useT()
  const { viewer } = useStore()
  // Even the homepage shelf goes through the access rule, so a Privé item can
  // never leak into a public listing.
  const shelf = visibleTo(viewer, products).filter(p => p.availability !== 'sold-out').slice(0, 4)
  const hero = bySlug('mala-couro-savana')!

  return (
    <>
      <section className="relative">
        <img
          src="/img/hero.webp" width={1700} height={1000} loading="eager" decoding="sync"
          alt={T({ pt: 'Uma mala de couro castanho apresentada sobre fundo claro.', en: 'A tan leather bag presented against a pale background.' })}
          className="h-[30rem] w-full bg-gold-soft object-cover md:h-[38rem]"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="shell pb-10 md:pb-16">
            <div className="max-w-xl bg-ivory/95 p-7 md:p-10">
              <p className="caps caps-gold">{T(S.tagline)}</p>
              <h1 className="display-1 mt-4">
                {T({ pt: 'O que não está na loja, encontramos.', en: 'What is not on the shelf, we find.' })}
              </h1>
              <p className="mt-5 text-base text-ink-2">
                {T({
                  pt: 'Compre o que temos em stock em Luanda, peça o que não temos, e deixe o resto connosco.',
                  en: 'Buy what we hold in Luanda, request what we do not, and leave the rest to us.',
                })}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={`/produto/${hero.slug}`}><Button tone="ink">{T(S.shopNow)}</Button></Link>
                <Link to="/concierge"><Button tone="outline">{T(S.conciergeTitle)}</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="houses" className="shell py-16 md:py-24">
        <div className="hairline">
          <h2 id="houses" className="display-2">{T(S.houses)}</h2>
        </div>
        <ul className="mt-9 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-6">
          {houses.map((h, i) => (
            <li key={h.slug} className={`bg-ivory p-7 md:p-9 ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <p className="caps caps-gold">{h.mode === 'members' ? T(S.prive) : h.mode === 'service' ? T(S.concierge) : T({ pt: 'Loja', en: 'Shop' })}</p>
              <h3 className="display-3 mt-2.5">{T(h.name)}</h3>
              <p className="mt-3 text-sm text-ink-2">{T(h.blurb)}</p>
              <Link
                to={h.slug === 'prive' ? '/prive' : h.slug === 'concierge' ? '/concierge' : `/casa/${h.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.18em] text-gold hover:text-charcoal"
              >
                {T(S.explore)}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="shelf" className="border-t border-line bg-card">
        <div className="shell py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="hairline">
              <h2 id="shelf" className="display-2">{T({ pt: 'Em destaque', en: 'Featured' })}</h2>
            </div>
            <Link to="/casa/beleza" className="text-[0.6875rem] uppercase tracking-[0.18em] text-gold hover:text-charcoal">
              {T(S.viewAll)}
            </Link>
          </div>
          <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {shelf.map(p => <Card key={p.id} p={p} />)}
          </ul>
        </div>
      </section>

      <section className="bg-charcoal text-ivory">
        <div className="shell grid gap-8 py-16 md:grid-cols-[1.3fr_1fr] md:items-center md:py-20">
          <div className="hairline">
            <h2 className="display-2">{T(S.priveTitle)}</h2>
            <p className="mt-4 max-w-lg text-base" style={{ color: '#CFC7BA' }}>{T(S.priveLede)}</p>
          </div>
          <div className="md:justify-self-end">
            <Link to="/prive"><Button tone="gold">{T(S.applyNow)}</Button></Link>
          </div>
        </div>
      </section>
    </>
  )
}
