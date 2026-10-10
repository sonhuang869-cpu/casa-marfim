# Casa Marfim

A bilingual luxury storefront with a private client tier, built against a brief
for a Luanda concierge and retail house.

Portuguese is the default. English is complete. The hard part of the brief was
not the shop, it was this line:

> Restrictions must be technically enforced. Removing a navigation link is not
> sufficient. Explain how direct links, search results and other relevant
> access routes are handled.

So the access rule is written once, in `src/lib/access.ts`, and every surface
asks it rather than deciding for itself.

## The access rule

`ROUTES` is an exhaustive list of the ways a customer can reach a resource:
navigation, direct link, search, collection listing, recommendations, sitemap,
storefront API and feed. Hiding a menu item closes exactly one of them.

The test suite walks every route against every member state before any screen
exists: **120 access attempts refused** across 8 routes and 5 non-member states,
with the approved member reaching all three private items by every route.

What that gives, checked through the browser as well as the module:

- A guest on a direct link to a Privé product gets **401**, not a pretend 404,
  and the reserved price never reaches the page.
- An ordinary signed-in account gets **403**. An account is not a membership.
- Applying moves you to pending and grants nothing. Approval is ECA's, not the
  customer's.
- Suspending a member closes the same door immediately, by every route.
- A listing and a direct hit can never disagree, because both call the same
  function. That mismatch is the usual bug.

Each refusal carries a distinct reason, so the page can say which of the five
situations the visitor is actually in rather than showing one blank wall.

## Bilingual

Every customer-facing string carries both languages at the point of definition,
so neither can be left behind. The test asserts that no product or house is
missing either language, and that the two are genuinely different text rather
than English copied across. A sweep check also fails the build on common
unaccented Portuguese, because `nutricao` for `nutrição` is exactly the tell
that a translation was never reviewed.

## Buy, request, or deposit

The brief asks that it always be obvious which one applies. Four states are
modelled and each is asserted: in stock shows a price and buys immediately;
sourced shows a price and a **50 per cent deposit as a figure**, not a promise
(625,000 Kz of 1,250,000 Kz on the leather bag); request-only shows no price,
because there is not one yet; sold out cannot be bought.

## Trying it

The viewer control at the top left switches between guest, ordinary account,
pending applicant, approved member and suspended member. In a real build ECA
does this from the Shopify admin; it is exposed here so the access rules can be
tested from the front.

Then try a direct link to `/produto/edicao-privada-perfume` as each one.

## Running it

```
npm install
npm run dev
```

## Stack and scope

Vite, React, TypeScript, Tailwind, React Router. This models the rules and the
customer experience; it is not a Shopify theme. On Shopify the same rules are
enforced by the membership app and Liquid, which is a configuration and
templating job rather than this code.

Photography from Unsplash under the Unsplash licence, inspected before
selection, resized to WebP and served from the repository.

Prototype. Representative brand, products and prices.
