import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
} from '@nestjs/common';

import { PaypalService } from './Paypal/Paypal.service';
import { PayPalPaymentResult } from 'src/@types/paypal';
import { ExceptionType } from '#types';

export enum CurrencyCode {
  BRL = 'BRL',
  USD = 'USD',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BOLETO = 'BOLETO',
  PIX = 'PIX',
}

export type PaymentType =
  | {
      method: PaymentMethod.CARD;
      provider: PaymentProvider.PayPal;
    }
  | {
      method: PaymentMethod.CARD;
      provider: PaymentProvider.PagSeguro;
      card: {
        number: string;
        holder: string;
        cvv: number;
        expiresMouth: string;
        expiresYear: string;
      };
    }
  | {
      method: PaymentMethod.PIX;
      provider: PaymentProvider.PagSeguro;
      cpf: string;
    }
  | {
      method: PaymentMethod.BOLETO;
      provider: PaymentProvider.PagSeguro;
      cpf: string;
    };

export enum PaymentProvider {
  PagSeguro = 'PagSeguro',
  PayPal = 'PayPal',
}

export type OrderItem = {
  name: string;
  description?: string;
  quantity: number;
  price: {
    unityPrice: string;
    currencyCode: 'USD';
  };
};

export type PayWithCardInformation = {
  installments: number;
  card: {
    name: string;
    holder: string;
    expiration_month: string;
    expiration_year: string;
    cvv: string;
  };
};

export type PayWithPixInformation = {
  name: string;
  email: string;
  tax_id: string;
};

export type CreateOrderOrPayProps = {
  payment: PaymentType;
  order: {
    orderId: string;
    totalPrice: string;
    items: OrderItem[];
  };
  customer: {
    name: string;
    email: string;
  };
};

@Injectable()
export class PaymentService {
  constructor(private readonly paypalService: PaypalService) {}

  async createOrderAndPay(
    paymentProps: CreateOrderOrPayProps,
  ): Promise<PayPalPaymentResult> {
    const method = paymentProps.payment.method;
    const provider = paymentProps.payment.provider;

    if (!paymentProps.order.items.length) {
      throw new BadRequestException('require items to purchase order');
    }

    // pay with paypal and card
    if (method === PaymentMethod.CARD && provider === PaymentProvider.PayPal) {
      try {
        const result =
          // call paypal API
          await this.paypalService.createPaymentUrl<PayPalPaymentResult>({
            orderId: paymentProps.order.orderId,
            amount: {
              currencyCode: CurrencyCode.USD,
              totalPrice: paymentProps.order.totalPrice,
            },
            items: paymentProps.order.items,
          });

        return result;
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }

    if (method === PaymentMethod.BOLETO) {
      throw new MethodNotAllowedException({
        message: {
          engUs: 'payment method not implemented',
          ptBr: 'método de pagamento não implementado',
          esp: 'método de pago no implementado',
        },
      } as ExceptionType);
    }

    if (method === PaymentMethod.PIX) {
      throw new MethodNotAllowedException({
        message: {
          engUs: 'payment method not implemented',
          ptBr: 'método de pagamento não implementado',
          esp: 'método de pago no implementado',
        },
      } as ExceptionType);
    }

    throw new NotAcceptableException({
      message: {
        engUs: 'invalid payment method',
        ptBr: 'método de pagamneto inválido',
        esp: 'método de pago no válido',
      },
    } as ExceptionType);

    // if (paymentProps.provider === PaymentProvider.PagSeguro) {
    //   if (!paymentProps.payment?.card || !paymentProps.payment.pix) {
    //     throw new BadRequestException('payment params are invalid');
    //   }

    //   // call pagseguro service
    // }
  }
}
