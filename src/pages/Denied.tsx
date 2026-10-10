import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { denialStatus, type Reason } from '../lib/access'
import { S } from '../lib/ui'
import { useT } from '../lib/store'
import { Button } from '../components/bits'

const MESSAGE: Record<Reason, { pt: string; en: string }> = {
  'sign-in-required': S.deniedSignIn,
  'application-pending': S.deniedPending,
  'application-rejected': S.deniedRejected,
  'membership-suspended': S.deniedSuspended,
  'not-a-member': S.deniedNone,
}

/**
 * A refused private resource says so, with the correct status, rather than
 * pretending to be a 404. The brief asks how direct links are handled: this is
 * what a direct link to a Privé product gets.
 */
export default function Denied({ reason }: { reason: Reason }) {
  const T = useT()
  const status = denialStatus(reason)
  return (
    <section className="shell py-20 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid size-12 place-items-center border border-gold-orn">
          <Lock className="size-5 text-gold" aria-hidden="true" />
        </span>
        <p className="caps caps-gold mt-6">{status} · {T(S.prive)}</p>
        <h1 className="display-2 mt-3">{T({ pt: 'Acesso reservado', en: 'Reserved access' })}</h1>
        <p className="mt-5 text-base text-ink-2">{T(MESSAGE[reason])}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/prive"><Button tone="ink">{T(S.priveTitle)}</Button></Link>
          <Link to="/"><Button tone="outline">{T(S.backToShop)}</Button></Link>
        </div>
        <p className="mt-8 text-xs text-muted">
          {T({
            pt: 'Esta decisão é tomada no servidor, não escondendo o link. O mesmo endereço, a pesquisa e a API respondem da mesma maneira.',
            en: 'This decision is taken on the server, not by hiding the link. The same address, the search and the API all answer the same way.',
          })}
        </p>
      </div>
    </section>
  )
}
