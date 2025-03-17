import { env } from '#utils';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  PayPalCreateOrderResponse,
  PayPalGetOrderResponse,
} from 'src/@types/paypal';
import { InfraCredentialsManagerService } from '../../InfraCredentialsManager/infraCredentialsManager.service';

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
  constructor(
    private readonly httpService: HttpService,
    private readonly infraCredentialsManagerService: InfraCredentialsManagerService,
  ) {}

  public async payOrder(createOrder: PayOrderProps) {
    const paypalAccessToken =
      await this.infraCredentialsManagerService.getPaypalAccessToken();

    try {
      const orderDataValid = this.validateOrder(createOrder);

      const response =
        await this.httpService.axiosRef<PayPalCreateOrderResponse>(
          `${env.PAYPAL_BASE_URL}/v2/checkout/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${paypalAccessToken}`,
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
