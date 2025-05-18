export enum InputTypes {
  text = 'text',
  email = 'email',
  password = 'password',
  number = 'number',
  date = 'date',
  checkbox = 'checkbox',
}

export enum InputName {
  login = 'login',
  password = 'password',
  firstName = 'firstName',
  lastName = 'lastName',
  bithDay = 'bithDay',
  street = 'street',
  city = 'city',
  postalCode = 'postalCode',
  country = 'country',
}

export enum AddressInputName {
  street = 'street',
  city = 'city',
  postalCode = 'postalCode',
  country = 'country',
}

export enum AddressType {
  billing = 'billing',
  shipping = 'shipping',
}

export enum listName {
  postalCode = 'postalCode',
  country = 'countries',
}

export interface Address {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface ICustomer {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: [
    { key?: string; country: string; city: string; streetName: string; postalCode: string },
  ];
  shippingAddresses?: number[];
  billingAddresses?: number[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
}

export interface ILoginParams {
  email: string;
  password: string;
}
