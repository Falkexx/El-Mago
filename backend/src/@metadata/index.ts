import e from 'express';

export enum ItemType {
  COMMON = 'COMMON',
  UNIQUE = 'UNIQUE',
  LEGENDARY = 'LEGENDARY',
}

export enum STORAGE_PROVIDER {
  S3 = 'S3',
  LOCAL = 'LOCAL',
}

export const Status = {
  CREATED: 'CREATED', // when create the order
  PAID: 'PAID', // when paid the order
  ACCEPT: 'ACCEPT', // when affiliate accept the order
  CANCELED: 'CANCELED', // when a customer cancel the order
  RETURNED: 'RETURNED', // when admin or affiliate return the order
  COMPLETED: 'COMPLETED',
};

export const OrderAction = {
  // normal action
  WAITING_FOR_PAYMENT: {
    engUs: 'waiting for the payment',
    ptBr: 'esperando o pagamento',
  },

  WAITING_FOR_CONFIRMATION: {
    engUs: 'waiting for the order confirmation',
    ptBr: 'esperando a confirmação do pedido',
  },

  WAITING_FOR_DELIVERY_CONFIRMATION: {
    engUs: 'waiting for delivery confirmation',
    ptBr: 'esperando a confirmação da entrega',
  },

  // denied or canceled action
  WAITING_FOR_REFUND: {
    engUs: 'waiting for refund of the order',
    ptBr: 'aguardando o reestorno do pedido',
  },

  ORDER_COMPLETED: { engUs: 'order finished', ptBr: 'ordem finalizada' },
} as const;

export function getNextAction(value: keyof typeof Status) {
  switch (value) {
    // normal action
    case 'CREATED':
      return OrderAction.WAITING_FOR_PAYMENT;
    case 'PAID':
      return OrderAction.WAITING_FOR_CONFIRMATION;
    case 'ACCEPT':
      return OrderAction.WAITING_FOR_DELIVERY_CONFIRMATION;

    // denied or canceled action
    case 'CANCELED':
      return OrderAction.WAITING_FOR_REFUND;
    case 'RETURNED':
      return OrderAction.ORDER_COMPLETED;
  }
}

export enum PLATFORM {
  PC = 'PC',
  XBOX = 'XBOX',
}

export enum Languages {
  portugues_br = 'português brasil',
  portugues_pt = 'português portugal',
  english_us = 'english united states',
  english_uk = 'english united kingdom',
  spanish_es = 'español españa',
  spanish_mx = 'español méxico',
  french_fr = 'français france',
  german_de = 'deutsch deutschland',
  italian_it = 'italiano italia',
  japanese_jp = '日本語 日本',
  chinese_cn = '中文 中国',
  korean_kr = '한국어 한국',
  hindi_in = 'हिंदी भारत',
  russian_ru = 'русский россия',
  arabic_sa = 'العربية السعودية',
}

export enum AffiliateOnHoldStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionProvider {
  SERVER = 'SERVER',
  AFFILIATE = 'AFFILIATE',
  ADMIN = 'ADMIN',
}
