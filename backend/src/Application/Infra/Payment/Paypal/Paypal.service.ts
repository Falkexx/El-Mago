import { env } from '#utils';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { PayPalCreateOrder, PayPalGetOrderResponse } from 'src/@types/paypal';
import { InfraCredentialsManagerService } from '../../InfraCredentialsManager/infraCredentialsManager.service';

export type Item = {
  name: string;
  description?: string;
  quantity: number;
  price: {
    currencyCode: 'USD';
    unityPrice: string;
  };
};

export type PayOrderProps = {
  items: Item[];
  orderId: string;
  amount: {
    totalPrice: string;
    currencyCode: 'USD';
  };
};

interface MakeBankWithdrawalProps {
  value: string;
  email: string;
}

interface PayoutRequest {
  sender_batch_header: {
    sender_batch_id: string;
    email_subject: string;
    email_message: string;
  };
  items: PayoutItem[];
}

interface PayoutItem {
  recipient_type: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
  amount: {
    value: string;
    currency: string;
  };
  note?: string;
  sender_item_id?: string;
  receiver: string;
  alternate_notification_method?: {
    phone: {
      country_code: string;
      national_number: string;
    };
  };
  notification_language?: string;
  purpose?: string;
}

@Injectable()
export class PaypalService {
  constructor(
    private readonly httpService: HttpService,
    private readonly infraCredentialsManagerService: InfraCredentialsManagerService,
  ) {}

  public async createPaymentUrl<T>(createOrder: PayOrderProps): Promise<T> {
    console.log(createOrder);

    // throw new NotImplementedException('clama aí, eu to testantod...');
    const paypalAccessToken =
      await this.infraCredentialsManagerService.getPaypalAccessToken();

    try {
      const bodyValid = this.validateOrder(createOrder);

      const response = await this.httpService.axiosRef<T>(
        `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${paypalAccessToken}`,
          },
          data: bodyValid,
        },
      );

      return response.data;
    } catch (error) {
      // Tratamento de erros
      if (error.response) {
        // Erros retornados pelo PayPal (HTTP status >= 400)
        console.error('PayPal API Error:', {
          status: error.response.status,
          data: error.response.data,
        });

        throw new Error(
          `PayPal API Error: ${error.response.status} - ${JSON.stringify(
            error.response.data,
          )}`,
        );
      } else if (error.request) {
        // Erro de conexão ou sem resposta do servidor
        console.error('No response received from PayPal API:', error.request);
        throw new Error('No response received from PayPal API.');
      } else {
        // Outros erros (ex.: erros de configuração)
        console.error('Unexpected error:', error.message);
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  public async checkOrder(paypalOrderId: string) {
    const paypalAccessToken =
      await this.infraCredentialsManagerService.getPaypalAccessToken();

    try {
      const response = await this.httpService.axiosRef<PayPalGetOrderResponse>(
        `${env.PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${paypalAccessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      // Tratamento de erros
      if (error.response) {
        // Erros retornados pelo PayPal (HTTP status >= 400)
        console.error('PayPal API Error:', {
          status: error.response.status,
          data: error.response.data,
        });

        throw new Error(
          `PayPal API Error: ${error.response.status} - ${JSON.stringify(
            error.response.data,
          )}`,
        );
      } else if (error.request) {
        // Erro de conexão ou sem resposta do servidor
        console.error('No response received from PayPal API:', error.request);
        throw new Error('No response received from PayPal API.');
      } else {
        // Outros erros (ex.: erros de configuração)
        console.error('Unexpected error:', error.message);
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  private validateOrder(createOrder: PayOrderProps): PayPalCreateOrder {
    try {
      if (!createOrder.orderId) throw new Error('orderId está ausente.');
      if (!Array.isArray(createOrder.items) || createOrder.items.length === 0)
        throw new Error('Itens do pedido estão ausentes ou inválidos.');
      if (
        !createOrder.amount ||
        !createOrder.amount.currencyCode ||
        !createOrder.amount.totalPrice
      )
        throw new Error('Detalhes de amount estão incompletos.');
      if (!env.BACKEND_BASE_URL || !env.BACKEND_PORT)
        throw new Error('Configurações de ambiente estão ausentes.');

      return {
        intent: 'CAPTURE',
        purchase_units: [
          {
            invoice_id: createOrder.orderId,
            items: createOrder.items.map((item) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: item.price.currencyCode,
                value: item.price.unityPrice,
              },
            })),
            amount: {
              currency_code: createOrder.amount.currencyCode,
              value: createOrder.amount.totalPrice,
              breakdown: {
                item_total: {
                  currency_code: createOrder.amount.currencyCode,
                  value: createOrder.amount.totalPrice,
                },
              },
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              landing_page: 'LOGIN',
              shipping_preference: 'NO_SHIPPING',
              return_url: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/complete-order`,
              cancel_url: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/cancel-order`,
              user_action: 'PAY_NOW',
            },
          },
        },
      };
    } catch (err) {
      console.error('Erro ao validar o pedido:', err.message);
      return null;
    }
  }

  async makeBankWithdrawal(props: MakeBankWithdrawalProps) {
    const body: PayoutRequest = {
      sender_batch_header: {
        sender_batch_id: 'Payouts_2018_100007',
        email_subject: 'You have a payout!',
        email_message:
          'You have received a payout! Thanks for using our service!',
      },
      items: [
        {
          amount: {
            currency: 'USD',
            value: props.value,
          },
          receiver: props.email,
          recipient_type: 'EMAIL',
        },
      ],
    };

    const url = `${env.PAYPAL_BASE_URL}/v1/payments/payouts`;

    const paypalAccessToken =
      await this.infraCredentialsManagerService.getPaypalAccessToken();

    try {
      const response = await this.httpService.axiosRef(url, {
        data: body,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paypalAccessToken}`,
        },
      });

      console.log(response.data);

      return response.data;
    } catch (e) {
      const { status, data } = e.response;

      switch (status) {
        case 400:
          console.error('bad request ', data);
          throw new BadRequestException();
        case 403:
          console.error('unauthorized ', data);
          throw new ForbiddenException();
        case 404:
          console.error('route not found ', data);
          throw new NotFoundException('paypal endpoint not found');
        case 500:
          console.error('papal internal server exception ', data);
          throw new InternalServerErrorException();
        default:
          console.error('error when make transfer', data);
          throw new InternalServerErrorException();
      }
    }
  }
}
