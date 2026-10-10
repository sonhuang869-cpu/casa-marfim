import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from './catalogue'
import type { MemberStatus, Viewer } from './access'

const KEY = 'casamarfim.state'

export type Enquiry = {
  ref: string
  kind: 'concierge' | 'appointment' | 'prive'
  name: string
  email: string
  detail: string
  at: string
}

type Persisted = { lang: Lang; signedIn: boolean; status: MemberStatus; enquiries: Enquiry[] }

const DEFAULTS: Persisted = { lang: 'pt', signedIn: false, status: 'none', enquiries: [] }
const STATUSES: MemberStatus[] = ['none', 'applied', 'rejected', 'approved', 'suspended']

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const p = JSON.parse(raw) as Partial<Persisted>
    return {
      lang: p.lang === 'en' ? 'en' : 'pt',
      signedIn: !!p.signedIn,
      // Never trust a stored status: an unknown value must fall back to no access.
      status: STATUSES.includes(p.status as MemberStatus) ? (p.status as MemberStatus) : 'none',
      enquiries: Array.isArray(p.enquiries) ? p.enquiries.filter(e => e && typeof e.ref === 'string') : [],
    }
  } catch {
    return DEFAULTS
  }
}

const save = (s: Persisted) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* private mode */ }
}

type Ctx = Persisted & {
  viewer: Viewer
  setLang: (l: Lang) => void
  setViewer: (signedIn: boolean, status: MemberStatus) => void
  addEnquiry: (e: Omit<Enquiry, 'ref' | 'at'>) => Enquiry
}

const C = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(DEFAULTS)

  useEffect(() => setS(load()), [])
  useEffect(() => { document.documentElement.lang = s.lang }, [s.lang])


  const setLang = useCallback((lang: Lang) => setS(p => { const n = { ...p, lang }; save(n); return n }), [])

  const setViewer = useCallback((signedIn: boolean, status: MemberStatus) =>
    setS(p => { const n = { ...p, signedIn, status }; save(n); return n }), [])

  const addEnquiry = useCallback((e: Omit<Enquiry, 'ref' | 'at'>) => {
    const made: Enquiry = { ...e, ref: `CM-${Math.floor(Math.random() * 9000) + 1000}`, at: new Date().toISOString() }
    setS(p => { const n = { ...p, enquiries: [made, ...p.enquiries] }; save(n); return n })
    return made
  }, [])

  const value = useMemo<Ctx>(() => ({
    ...s,
    viewer: { signedIn: s.signedIn, status: s.status },
    setLang, setViewer, addEnquiry,
  }), [s, setLang, setViewer, addEnquiry])

  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore() {
  const c = useContext(C)
  if (!c) throw new Error('useStore outside StoreProvider')
  return c
}

/** Translate at the point of use, so no string can be left behind. */
export function useT() {
  const { lang } = useStore()
  return useCallback(<T extends { pt: string; en: string }>(s: T) => s[lang], [lang])
}
