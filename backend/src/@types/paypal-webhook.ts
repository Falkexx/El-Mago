interface WebhookEvent {
  id: string;
  event_version: string;
  create_time: string; // ISO 8601 date-time format
  resource_type: 'checkout-order' | string; // Pode haver outros tipos de recursos
  resource_version: string;
  event_type: 'CHECKOUT.ORDER.APPROVED'; // Pode haver outros tipos de eventos
  summary: string;
  resource: {
    create_time: string; // ISO 8601 date-time format
    purchase_units: PurchaseUnit[];
    links: Link[];
    id: string;
    payment_source: {
      paypal: {
        email_address: string;
        account_id: string;
        name: {
          given_name: string;
          surname: string;
        };
        address: {
          country_code: string;
        };
      };
    };
    intent: 'CAPTURE' | 'AUTHORIZE' | string; // Pode haver outros tipos de intenções
    payer: {
      name: {
        given_name: string;
        surname: string;
      };
      email_address: string;
      payer_id: string;
      address: {
        country_code: string;
      };
    };
    status: 'APPROVED' | 'COMPLETED' | 'CREATED' | 'SAVED' | 'VOIDED'; // Pode haver outros status
  };
  links: Link[];
}

interface PurchaseUnit {
  reference_id: string;
  amount: {
    currency_code: string;
    value: string;
  };
  payee: {
    email_address: string;
    merchant_id: string;
  };
  shipping: {
    name: {
      full_name: string;
    };
    address: {
      address_line_1: string;
      admin_area_2: string;
      admin_area_1: string;
      postal_code: string;
      country_code: string;
    };
  };
  invoice_id: string;
  payments: {
    captures: Capture[];
  };
}

interface Capture {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING' | 'REFUNDED' | string; // Pode haver outros status
  amount: {
    currency_code: string;
    value: string;
  };
  final_capture: boolean;
  seller_protection: {
    status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | string; // Pode haver outros status
  };
  create_time: string; // ISO 8601 date-time format
  update_time: string; // ISO 8601 date-time format
}

interface Link {
  href: string;
  rel: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string; // Pode haver outros métodos HTTP
}
