/**
 * Privé access control.
 *
 * The brief is explicit: "Restrictions must be technically enforced. Removing a
 * navigation link is not sufficient. Explain how direct links, search results
 * and other relevant access routes are handled."
 *
 * So the rule is written once, here, and every route in the shop asks this
 * module rather than deciding for itself. A route that forgets to ask is the
 * bug this file exists to prevent, which is why ROUTES is exhaustive and the
 * test suite walks all of them.
 */

export type MemberStatus = 'none' | 'applied' | 'rejected' | 'approved' | 'suspended'

export type Viewer = {
  signedIn: boolean
  status: MemberStatus
}

export type Visibility = 'public' | 'prive'

export type Resource = {
  id: string
  kind: 'product' | 'collection' | 'page' | 'price'
  visibility: Visibility
}

/**
 * Every way a customer can reach a resource. Hiding a link closes exactly one
 * of these.
 */
export const ROUTES = [
  'navigation',
  'direct-link',
  'search',
  'collection-listing',
  'recommendations',
  'sitemap',
  'storefront-api',
  'rss-feed',
] as const

export type Route = (typeof ROUTES)[number]

export type Decision =
  | { allow: true }
  | { allow: false; reason: Reason }

export type Reason = 'sign-in-required' | 'application-pending' | 'application-rejected' | 'membership-suspended' | 'not-a-member'

/** The single rule. Everything else in the shop defers to this. */
export function can(viewer: Viewer, resource: Resource): Decision {
  if (resource.visibility === 'public') return { allow: true }
  if (!viewer.signedIn) return { allow: false, reason: 'sign-in-required' }

  switch (viewer.status) {
    case 'approved':
      return { allow: true }
    case 'applied':
      return { allow: false, reason: 'application-pending' }
    case 'rejected':
      return { allow: false, reason: 'application-rejected' }
    case 'suspended':
      return { allow: false, reason: 'membership-suspended' }
    default:
      return { allow: false, reason: 'not-a-member' }
  }
}

/**
 * The same decision, whichever door is used. Taking a Route is not because the
 * answer differs per route, but so that every access path is forced to name
 * itself and be covered by a test.
 */
export function canVia(viewer: Viewer, resource: Resource, _route: Route): Decision {
  return can(viewer, resource)
}

export const allowed = (viewer: Viewer, resource: Resource) => can(viewer, resource).allow

/** Filters any listing. Used by search, collections and recommendations alike. */
export function visibleTo<T extends { id: string; visibility: Visibility }>(viewer: Viewer, items: T[], kind: Resource['kind'] = 'product'): T[] {
  return items.filter(i => allowed(viewer, { id: i.id, kind, visibility: i.visibility }))
}

/**
 * What a denied visitor should get. A 404 would be a small lie and would also
 * stop an approved member who simply lost their session from understanding
 * what happened, so a denied private resource answers 403 and explains itself.
 */
export function denialStatus(reason: Reason): 401 | 403 {
  return reason === 'sign-in-required' ? 401 : 403
}

export const GUEST: Viewer = { signedIn: false, status: 'none' }
