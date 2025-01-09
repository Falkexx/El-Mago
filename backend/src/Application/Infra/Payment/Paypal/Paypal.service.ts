import { env } from '#utils';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  PayPalCreateOrderResponse,
  PayPalGetOrderResponse,
} from 'src/@types/paypal';

export type Item = {
  name: string;
  description?: string;
  quantity: number;
  unit_amount: {
    currency_code: 'BRL' | 'USD';
    value: string;
  };
};

export type PayOrderProps = {
  items: Item[];
  orderId: string;
  amount: {
    totalPrice: string;
    currency_code: 'BRL' | 'USD';
  };
};

@Injectable()
export class PaypalService {
  private accessToken: string | null;
  private tokenExpiresAt: number;

  constructor(private readonly httpService: HttpService) {}

  public async payOrder(createOrder: PayOrderProps) {
    try {
      const orderDataValid = this.validateOrder(createOrder);

      const response =
        await this.httpService.axiosRef<PayPalCreateOrderResponse>(
          `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await this.getValidAccessToken()}`,
            },
            data: orderDataValid,
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
    try {
      const response = await this.httpService.axiosRef<PayPalGetOrderResponse>(
        `${env.PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${await this.getValidAccessToken()}`,
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

  private async getAccessToken() {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    ).toString('base64');

    const url = `${env.PAYPAL_BASE_URL}/v1/oauth2/token`;

    try {
      const response = await this.httpService.axiosRef(url, {
        method: 'POST',
        data: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;
      this.tokenExpiresAt = Date.now() + expiresIn + 1000;

      return this.accessToken;
    } catch (e) {
      console.log('Erro ao obter o token: ', e.response.data);
      throw new Error('Não foi possível obter o tken de accesso');
    }
  }

  private async getValidAccessToken() {
    if (
      this.accessToken &&
      this.tokenExpiresAt &&
      Date.now() < this.tokenExpiresAt
    ) {
      return this.accessToken;
    }

    const token = await this.getAccessToken();

    console.log(token);

    return token;
  }

  private validateOrder(createOrder: PayOrderProps) {
    try {
      if (!createOrder.orderId) throw new Error('orderId está ausente.');
      if (!Array.isArray(createOrder.items) || createOrder.items.length === 0)
        throw new Error('Itens do pedido estão ausentes ou inválidos.');
      if (
        !createOrder.amount ||
        !createOrder.amount.currency_code ||
        !createOrder.amount.totalPrice
      )
        throw new Error('Detalhes de amount estão incompletos.');
      if (!env.BACKEND_BASE_URL || !env.BACKEND_PORT)
        throw new Error('Configurações de ambiente estão ausentes.');

      return {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: createOrder.orderId,
            items: createOrder.items,
            amount: {
              currency_code: createOrder.amount.currency_code,
              value: createOrder.amount.totalPrice,
              breakdown: {
                item_total: {
                  currency_code: createOrder.amount.currency_code,
                  value: createOrder.amount.totalPrice,
                },
              },
            },
          },
        ],
        application_context: {
          return_url: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/complete-order`,
          cancel_url: `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/cancel-order`,
          user_action: 'PAY_NOW',
        },
      };
    } catch (err) {
      console.error('Erro ao validar o pedido:', err.message);
      return null;
    }
  }
}
