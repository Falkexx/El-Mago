export enum KEY_INJECTION {
  USER_REPOSITORY_CONTRACT = 'USER_REPOSITORY_CONTRACT',
  AFFILIATE_REPOSITORY_CONTRACT = 'AFFILIATE_REPOSITORY_CONTRACT',
  IMAGE_REPOSITORY_CONTRACT = 'IMAGE_REPOSITORY_CONTRACT ',
  ITEM_REPOSITORY_CONTRACT = 'ITEM_REPOSITORY_CONTRACT',
  CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY',
  CART_REPOSITORY = 'CART_REPOSITORY',
  ORDER_REPOSITORY = 'ORDER_REPOSITORY',
  REQUEST_AFFILIATE_REPOSITORY = 'REQUEST_AFFILIATE_REPOSITORY',
}

export enum KEY_CACHE {
  paypal_access_token = 'paypal_access_token',
  gmail_access_token = 'gmail_access_token',
}

export enum KEY_OF_QUEUE {
  PAYMENT = 'PAYMENT',
}

export enum KEY_OF_JOB {
  CONFIRM_PAYMENT = 'CONFIRM_PAYMENT',
}
