export enum TABLE {
  user = 'user',
  affiliate = 'affiliate',
  affiliate_queue = 'affiliate_queue',
  item = 'item',
  image = 'image',
  category = 'category',
  order = 'order',
  cart = 'cart',
  cart_item = 'cart_item',
  order_status = 'order_status',
  order_item = 'order_item',
  order_in_progress = 'order_in_progress',
  digital_shipping = 'digital_shipping',
  transaction = 'transaction',
  wallet = 'wallet',

  /**
   * @deprecated
   * the table was removed in on migration: 1741349995212-remove-proof-of-delivery
   */
  proof_of_delivery = 'proof_of_delivery',
}
