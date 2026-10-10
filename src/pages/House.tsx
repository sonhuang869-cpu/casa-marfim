import { useState } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import { houseBySlug, inHouse, categories, t } from '../lib/catalogue'
import { visibleTo } from '../lib/access'
import { useStore, useT } from '../lib/store'
import { Card } from '../components/bits'

export default function House() {
  const { slug } = useParams()
  const T = useT()
  const { viewer, lang } = useStore()
  const [filter, setFilter] = useState<string | null>(null)

  const house = slug ? houseBySlug(slug) : undefined
  if (!house) return <Navigate to="/404" replace />
  if (house.slug === 'prive') return <Navigate to="/prive" replace />
  if (house.slug === 'concierge') return <Navigate to="/concierge" replace />

  const all = visibleTo(viewer, inHouse(house.slug))
  const cats = categories[house.slug] ?? []
  const shown = filter ? all.filter(p => p.category && t(p.category, lang) === filter) : all

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-card">
        <div className="shell flex items-center gap-2 py-3 text-xs text-muted">
          <Link to="/" className="hover:text-charcoal">{T({ pt: 'Início', en: 'Home' })}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-charcoal">{T(house.name)}</span>
        </div>
      </nav>

      <div className="shell py-12 md:py-16">
        <div className="hairline max-w-2xl">
          <h1 className="display-1">{T(house.name)}</h1>
          <p className="mt-5 text-base text-ink-2">{T(house.blurb)}</p>
        </div>

        {cats.length > 0 && (
          <div className="mt-9">
            <p className="caps">{T({ pt: 'Categorias', en: 'Categories' })}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setFilter(null)} aria-pressed={filter === null}
                className={`border px-3 py-1.5 text-xs transition-colors duration-150 ${filter === null ? 'border-charcoal bg-charcoal text-ivory' : 'border-field hover:border-charcoal'}`}>
                {T({ pt: 'Tudo', en: 'All' })}
              </button>
              {cats.map(c => {
                const label = T(c)
                return (
                  <button key={label} type="button" onClick={() => setFilter(label)} aria-pressed={filter === label}
                    className={`border px-3 py-1.5 text-xs transition-colors duration-150 ${filter === label ? 'border-charcoal bg-charcoal text-ivory' : 'border-field hover:border-charcoal'}`}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <p className="caps mt-8">
          {shown.length} {T({ pt: shown.length === 1 ? 'artigo' : 'artigos', en: shown.length === 1 ? 'item' : 'items' })}
        </p>

        {shown.length === 0 ? (
          <p className="mt-6 text-sm text-muted">{T({ pt: 'Nada nesta categoria por agora.', en: 'Nothing in this category just now.' })}</p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {shown.map(p => <Card key={p.id} p={p} />)}
          </ul>
        )}
      </div>
    </>
  )
}
