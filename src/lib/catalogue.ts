/**
 * Bilingual catalogue. Portuguese is the default, as the brief requires, and
 * every customer-facing string carries both languages at the point of
 * definition rather than in a parallel translation file that drifts.
 */

import type { Visibility } from './access'

export type Lang = 'pt' | 'en'
export type T = { pt: string; en: string }

export const t = (s: T, lang: Lang) => s[lang]

/** The five ECA houses. */
export type HouseSlug = 'beleza' | 'casa-closet' | 'bem-estar' | 'concierge' | 'prive'

export type House = {
  slug: HouseSlug
  name: T
  blurb: T
  /** Houses that sell products versus houses that take requests. */
  mode: 'shop' | 'service' | 'members'
  tone: 'rose' | 'gold' | 'sage' | 'charcoal'
}

export const houses: House[] = [
  {
    slug: 'beleza',
    name: { pt: 'Beleza', en: 'Beauty' },
    blurb: {
      pt: 'Perfumaria, cuidado de pele e maquilhagem de marcas selecionadas, com stock em Luanda.',
      en: 'Fragrance, skincare and make-up from selected houses, held in stock in Luanda.',
    },
    mode: 'shop',
    tone: 'rose',
  },
  {
    slug: 'casa-closet',
    name: { pt: 'Closet e Casa', en: 'Closet & Home' },
    blurb: {
      pt: 'Peças de vestuário, acessórios e objetos para a casa. Muitas por encomenda.',
      en: 'Clothing, accessories and pieces for the home. Many are sourced to order.',
    },
    mode: 'shop',
    tone: 'gold',
  },
  {
    slug: 'bem-estar',
    name: { pt: 'Bem-Estar e Longevidade', en: 'Wellness & Longevity' },
    blurb: {
      pt: 'Vitaminas, suplementos, proteína e nutrição, bem-estar e bem-estar familiar.',
      en: 'Vitamins, supplements, protein and nutrition, wellness and family wellness.',
    },
    mode: 'shop',
    tone: 'sage',
  },
  {
    slug: 'concierge',
    name: { pt: 'Concierge de Estilo de Vida', en: 'Lifestyle Concierge' },
    blurb: {
      pt: 'Procura de produtos, compras pessoais e pedidos de serviço, tratados pela nossa equipa.',
      en: 'Product sourcing, personal shopping and service requests, handled by our team.',
    },
    mode: 'service',
    tone: 'charcoal',
  },
  {
    slug: 'prive',
    name: { pt: 'Clientes Privé', en: 'Privé Clients' },
    blurb: {
      pt: 'Acesso privado por aprovação. Seleção reservada, preços reservados e contacto direto.',
      en: 'Private access by approval. Reserved selection, reserved pricing and a direct contact.',
    },
    mode: 'members',
    tone: 'charcoal',
  },
]

export const houseBySlug = (s: string) => houses.find(h => h.slug === s)

/** Sub-categories, which the brief spells out for Wellness. */
export const categories: Record<string, T[]> = {
  'bem-estar': [
    { pt: 'Vitaminas', en: 'Vitamins' },
    { pt: 'Suplementos', en: 'Supplements' },
    { pt: 'Proteína e Nutrição', en: 'Protein & Nutrition' },
    { pt: 'Produtos de Bem-Estar', en: 'Wellness Products' },
    { pt: 'Bem-Estar Familiar', en: 'Family Wellness' },
  ],
}

/**
 * How a customer can obtain the item. The brief insists this is unmistakable:
 * "The website must make it clear when an item can be purchased immediately
 * and when the customer must request availability or a quotation."
 */
export type Availability = 'in-stock' | 'sourced-deposit' | 'request-only' | 'sold-out'

export type Product = {
  id: string
  slug: string
  house: HouseSlug
  category?: T
  name: T
  brand: string
  blurb: T
  /** Kwanza. Integer minor units, as everywhere else. */
  priceKz: number | null
  compareKz: number | null
  availability: Availability
  /** Share of the price taken up front on a sourced order. */
  depositPct: number | null
  visibility: Visibility
  variants: T[]
  /** Base name of the photograph in /public/img. */
  img: string
  tone: 'rose' | 'gold' | 'sage' | 'charcoal'
}

const KZ = (n: number) => n * 100

export const products: Product[] = [
  {
    id: 'p1', slug: 'serum-vitamina-c', house: 'beleza',
    category: { pt: 'Cuidado de pele', en: 'Skincare' },
    name: { pt: 'Sérum de Vitamina C, 30 ml', en: 'Vitamin C Serum, 30 ml' },
    brand: 'Maison Lumière',
    blurb: { pt: 'Concentrado de 15 por cento, para uso matinal. Stock em Luanda.', en: 'A 15 per cent concentrate for morning use. Held in Luanda.' },
    priceKz: KZ(48500), compareKz: KZ(62000), availability: 'in-stock', depositPct: null,
    visibility: 'public', variants: [{ pt: '30 ml', en: '30 ml' }], img: 'serum', tone: 'rose',
  },
  {
    id: 'p2', slug: 'creme-de-noite', house: 'beleza',
    category: { pt: 'Cuidado de pele', en: 'Skincare' },
    name: { pt: 'Creme de Noite, Rosa Damascena', en: 'Night Cream, Damask Rose' },
    brand: 'Maison Lumière',
    blurb: { pt: 'Textura rica, sem perfume adicionado. Frasco de vidro recarregável.', en: 'A rich texture with no added fragrance, in a refillable glass jar.' },
    priceKz: KZ(39000), compareKz: null, availability: 'in-stock', depositPct: null,
    visibility: 'public', variants: [{ pt: '50 ml', en: '50 ml' }], img: 'cream', tone: 'rose',
  },
  {
    id: 'p3', slug: 'perfume-de-autor', house: 'beleza',
    category: { pt: 'Perfumaria', en: 'Fragrance' },
    name: { pt: 'Perfume de Autor, edição esgotada', en: 'Signature Perfume, discontinued edition' },
    brand: 'Maison Lumière',
    blurb: { pt: 'Já não é produzido. Procuramos individualmente em Lisboa e Paris.', en: 'No longer in production. We source it individually in Lisbon and Paris.' },
    priceKz: null, compareKz: null, availability: 'request-only', depositPct: null,
    visibility: 'public', variants: [], img: 'perfume', tone: 'rose',
  },
  {
    id: 'p4', slug: 'mala-couro-savana', house: 'casa-closet',
    category: { pt: 'Acessórios', en: 'Accessories' },
    name: { pt: 'Mala de Couro Savana', en: 'Savana Leather Bag' },
    brand: 'Atelier Duarte',
    blurb: { pt: 'Encomendada ao atelier em Lisboa. Seis a oito semanas até Luanda.', en: 'Ordered from the atelier in Lisbon. Six to eight weeks to Luanda.' },
    priceKz: KZ(1250000), compareKz: null, availability: 'sourced-deposit', depositPct: 0.5,
    visibility: 'public',
    variants: [{ pt: 'Castanho', en: 'Tan' }, { pt: 'Preto', en: 'Black' }], img: 'bag', tone: 'gold',
  },
  {
    id: 'p5', slug: 'conjunto-cama-linho', house: 'casa-closet',
    category: { pt: 'Casa', en: 'Home' },
    name: { pt: 'Conjunto de Cama em Linho', en: 'Linen Bedding Set' },
    brand: 'Casa Tejo',
    blurb: { pt: 'Linho lavado, king size, quatro peças. Stock limitado.', en: 'Washed linen, king size, four pieces. Limited stock.' },
    priceKz: KZ(285000), compareKz: KZ(340000), availability: 'in-stock', depositPct: null,
    visibility: 'public',
    variants: [{ pt: 'Marfim', en: 'Ivory' }, { pt: 'Carvão', en: 'Charcoal' }], img: 'bedding', tone: 'gold',
  },
  {
    id: 'p6', slug: 'multivitaminico-diario', house: 'bem-estar',
    category: { pt: 'Vitaminas', en: 'Vitamins' },
    name: { pt: 'Multivitamínico Diário, 90 cápsulas', en: 'Daily Multivitamin, 90 capsules' },
    brand: 'Nordé',
    blurb: { pt: 'Formulação completa, três meses por frasco.', en: 'A complete formulation, three months a bottle.' },
    priceKz: KZ(42000), compareKz: null, availability: 'in-stock', depositPct: null,
    visibility: 'public', variants: [{ pt: '90 cápsulas', en: '90 capsules' }], img: 'vitamins', tone: 'sage',
  },
  {
    id: 'p7', slug: 'proteína-isolada', house: 'bem-estar',
    category: { pt: 'Proteína e Nutrição', en: 'Protein & Nutrition' },
    name: { pt: 'Proteína Isolada, 1 kg', en: 'Isolate Protein, 1 kg' },
    brand: 'Nordé',
    blurb: { pt: 'Baunilha ou chocolate. Sem adoçantes artificiais.', en: 'Vanilla or chocolate. No artificial sweeteners.' },
    priceKz: KZ(68000), compareKz: null, availability: 'sold-out', depositPct: null,
    visibility: 'public',
    variants: [{ pt: 'Baunilha', en: 'Vanilla' }, { pt: 'Chocolate', en: 'Chocolate' }], img: 'protein', tone: 'sage',
  },

  /* --- Privé. These must not surface anywhere for a visitor who is not approved. --- */
  {
    id: 'v1', slug: 'edicao-privada-perfume', house: 'prive',
    name: { pt: 'Edição Privada, perfume exclusivo', en: 'Private Edition, exclusive fragrance' },
    brand: 'Maison Lumière',
    blurb: { pt: 'Doze frascos por ano, reservados a clientes Privé.', en: 'Twelve bottles a year, reserved for Privé clients.' },
    priceKz: KZ(680000), compareKz: null, availability: 'in-stock', depositPct: null,
    visibility: 'prive', variants: [{ pt: '100 ml', en: '100 ml' }], img: 'perfume-prive', tone: 'charcoal',
  },
  {
    id: 'v2', slug: 'alta-joalharia', house: 'prive',
    name: { pt: 'Alta Joalharia, seleção reservada', en: 'Fine Jewellery, reserved selection' },
    brand: 'Privado',
    blurb: { pt: 'Peças apresentadas apenas no salão privado, mediante marcação.', en: 'Pieces shown only in the private room, by appointment.' },
    priceKz: null, compareKz: null, availability: 'request-only', depositPct: null,
    visibility: 'prive', variants: [], img: 'jewellery', tone: 'charcoal',
  },
  {
    id: 'v3', slug: 'relogio-heranca', house: 'prive',
    name: { pt: 'Relógio de Herança, referência rara', en: 'Heritage Watch, rare reference' },
    brand: 'Privado',
    blurb: { pt: 'Procurado individualmente em leilão. Depósito na confirmação.', en: 'Sourced individually at auction. Deposit on confirmation.' },
    priceKz: KZ(4200000), compareKz: null, availability: 'sourced-deposit', depositPct: 0.5,
    visibility: 'prive', variants: [], img: 'watch', tone: 'charcoal',
  },
]
export const bySlug = (s: string) => products.find(p => p.slug === s)
export const inHouse = (h: HouseSlug) => products.filter(p => p.house === h)

/** Kwanza, formatted the way an Angolan customer expects. */
export const kz = (minor: number) =>
  `${(minor / 100).toLocaleString('pt-AO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Kz`
