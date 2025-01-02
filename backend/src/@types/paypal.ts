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
