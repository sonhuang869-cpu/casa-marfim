/** Interface copy. Both languages live together so neither can be forgotten. */
export const S = {
  tagline:      { pt: 'Retalho, procura e concierge em Luanda', en: 'Retail, sourcing and concierge in Luanda' },
  shopNow:      { pt: 'Comprar agora', en: 'Buy now' },
  requestItem:  { pt: 'Pedir disponibilidade', en: 'Request availability' },
  requestQuote: { pt: 'Pedir orçamento', en: 'Request a quotation' },
  soldOut:      { pt: 'Esgotado', en: 'Sold out' },
  notifyMe:     { pt: 'Avisar quando chegar', en: 'Notify me' },
  inStock:      { pt: 'Em stock em Luanda', en: 'In stock in Luanda' },
  sourced:      { pt: 'Por encomenda', en: 'Sourced to order' },
  requestOnly:  { pt: 'Apenas sob consulta', en: 'On request only' },
  depositNote:  { pt: 'Depósito de 50% na encomenda, saldo antes do envio.', en: '50% deposit on order, balance before despatch.' },
  priceOnAsk:   { pt: 'Preço sob consulta', en: 'Price on request' },
  houses:       { pt: 'As nossas casas', en: 'Our houses' },
  explore:      { pt: 'Ver', en: 'View' },
  concierge:    { pt: 'Concierge', en: 'Concierge' },
  prive:        { pt: 'Privé', en: 'Privé' },
  account:      { pt: 'Conta', en: 'Account' },
  language:     { pt: 'Idioma', en: 'Language' },
  viewAll:      { pt: 'Ver tudo', en: 'View all' },
  from:         { pt: 'desde', en: 'from' },

  /* Concierge form */
  conciergeTitle: { pt: 'Pedido de procura', en: 'Sourcing request' },
  conciergeLede:  { pt: 'Diga-nos o que procura. Respondemos no mesmo dia útil, por email ou WhatsApp.', en: 'Tell us what you are looking for. We reply the same working day, by email or WhatsApp.' },
  fName:        { pt: 'Nome', en: 'Name' },
  fEmail:       { pt: 'Email', en: 'Email' },
  fPhone:       { pt: 'Telefone ou WhatsApp', en: 'Phone or WhatsApp' },
  fWhat:        { pt: 'O que procura', en: 'What you are looking for' },
  fBrand:       { pt: 'Marca, modelo, tamanho ou cor', en: 'Brand, model, size or colour' },
  fBudget:      { pt: 'Orçamento', en: 'Budget' },
  fCurrency:    { pt: 'Moeda', en: 'Currency' },
  fWhen:        { pt: 'Data necessária', en: 'Required date' },
  fWhere:       { pt: 'Destino de entrega', en: 'Delivery destination' },
  fLinks:       { pt: 'Links de referência', en: 'Reference links' },
  fNotes:       { pt: 'Instruções adicionais', en: 'Additional instructions' },
  send:         { pt: 'Enviar pedido', en: 'Send request' },
  sending:      { pt: 'A enviar', en: 'Sending' },

  /* Privé */
  priveTitle:   { pt: 'ECA Privé', en: 'ECA Privé' },
  priveLede:    { pt: 'Um serviço privado, por aprovação. Seleção reservada, preços reservados e um contacto direto.', en: 'A private service, by approval. A reserved selection, reserved pricing and a direct contact.' },
  applyNow:     { pt: 'Candidatar-me', en: 'Apply' },
  applicationSent: { pt: 'Candidatura recebida', en: 'Application received' },
  enterRoom:    { pt: 'Entrar no salão privado', en: 'Enter the private room' },
  privateRoom:  { pt: 'Salão Privado', en: 'Private Room' },
  directLine:   { pt: 'Linha direta', en: 'Direct line' },

  /* Access denial */
  deniedSignIn:   { pt: 'Esta página é reservada a clientes Privé. Inicie sessão para continuar.', en: 'This page is reserved for Privé clients. Sign in to continue.' },
  deniedPending:  { pt: 'A sua candidatura está em análise. Avisamos assim que houver decisão.', en: 'Your application is under review. We will write as soon as there is a decision.' },
  deniedRejected: { pt: 'Esta página é reservada a clientes Privé aprovados.', en: 'This page is reserved for approved Privé clients.' },
  deniedSuspended:{ pt: 'O seu acesso Privé está suspenso. Fale com o seu contacto direto.', en: 'Your Privé access is suspended. Speak to your direct contact.' },
  deniedNone:     { pt: 'Esta página é reservada a clientes Privé aprovados. Pode candidatar-se.', en: 'This page is reserved for approved Privé clients. You are welcome to apply.' },
  backToShop:     { pt: 'Voltar à loja', en: 'Back to the shop' },

  /* Errors */
  required:     { pt: 'Campo obrigatório', en: 'This field is required' },
  badEmail:     { pt: 'Endereço de email inválido', en: 'That email address is not valid' },
  tooShort:     { pt: 'Pelo menos uma frase, por favor', en: 'A sentence at least, please' },

  notFound:     { pt: 'Página não encontrada', en: 'Page not found' },
  prototype:    { pt: 'Protótipo. Marca, produtos e preços representativos.', en: 'Prototype. Representative brand, products and prices.' },
} as const
