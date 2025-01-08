export interface Link {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  links: Link[];
}

export interface PayPalGetOrderResponse {
  id: string;
  intent: string;
  status: string;
  payment_source: PaymentSource;
  purchase_units: PurchaseUnit[];
  payer: Payer;
  create_time: string;
  links: Link[];
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Paypal {
  email_address: string;
  account_id: string;
  account_status: string;
  name: Name;
  tax_info: TaxInfo;
  address: Address;
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface TaxInfo {
  tax_id: string;
  tax_id_type: string;
}

export interface Address {
  country_code: string;
}

export interface PurchaseUnit {
  reference_id: string;
  amount: Amount;
  payee: Payee;
  items: Item[];
}

export interface Amount {
  currency_code: string;
  value: string;
  breakdown: Breakdown;
}

export interface Breakdown {
  item_total: ItemTotal;
}

export interface ItemTotal {
  currency_code: string;
  value: string;
}

export interface Payee {
  email_address: string;
  merchant_id: string;
  display_data: DisplayData;
}

export interface DisplayData {
  brand_name: string;
}

export interface Item {
  name: string;
  unit_amount: UnitAmount;
  quantity: string;
  description: string;
}

export interface UnitAmount {
  currency_code: string;
  value: string;
}

export interface Payer {
  name: Name2;
  email_address: string;
  payer_id: string;
  address: Address2;
}

export interface Name2 {
  given_name: string;
  surname: string;
}

export interface Address2 {
  country_code: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}
