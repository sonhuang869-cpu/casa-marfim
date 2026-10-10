import { Link } from 'react-router-dom'
import { houses } from '../lib/catalogue'
import { S } from '../lib/ui'
import { useT } from '../lib/store'
import { Button } from '../components/bits'

export default function NotFound() {
  const T = useT()
  return (
    <section className="shell py-20 md:py-28">
      <div className="max-w-xl">
        <p className="caps caps-gold">404</p>
        <h1 className="display-1 mt-3">{T(S.notFound)}</h1>
        <p className="mt-5 text-base text-ink-2">
          {T({ pt: 'A página que procura mudou de sítio ou nunca existiu.', en: 'The page you wanted has moved or never existed.' })}
        </p>
        <ul className="mt-8 border-t border-line">
          {houses.filter(h => h.slug !== 'prive' && h.slug !== 'concierge').map(h => (
            <li key={h.slug} className="border-b border-line">
              <Link to={`/casa/${h.slug}`} className="block py-3.5 text-sm hover:text-gold">{T(h.name)}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Link to="/"><Button tone="ink">{T(S.backToShop)}</Button></Link></div>
      </div>
    </section>
  )
}
