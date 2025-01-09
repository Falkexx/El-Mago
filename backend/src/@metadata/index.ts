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
  CREATED: 'created',
  PAID: 'paid',
  ACCEPT: 'accept',
  CANCELED: 'canceled',
  RETURNED: 'returned',
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
