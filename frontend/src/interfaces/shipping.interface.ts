export interface ShippingInterface {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ShippingFormValidators {
  address: boolean;
  city: boolean;
  postalCode: boolean;
  country: boolean;
}
