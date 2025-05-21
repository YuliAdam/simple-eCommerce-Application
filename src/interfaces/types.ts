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
  birthDay = 'birthDay',
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

export enum ListName {
  postalCode = 'postalCode',
  country = 'countries',
}

export interface IAddress {
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

export interface IRegistrationState {
  login: IRegistrationFieldState;
  password: IRegistrationFieldState;
  firstName: IRegistrationFieldState;
  lastName: IRegistrationFieldState;
  birthDay: IRegistrationFieldState;
  street: IRegistrationFieldState;
  city: IRegistrationFieldState;
  postalCode: IRegistrationFieldState;
  country: IRegistrationFieldState;
  billing: IAdditionalAddres;
  shipping: IAdditionalAddres;
}

export interface IAdditionalAddres {
  isCopy: boolean;
  isDefault: boolean;
  isPresent: boolean;
  street: IRegistrationFieldState;
  city: IRegistrationFieldState;
  postalCode: IRegistrationFieldState;
  country: IRegistrationFieldState;
}

export interface IRegistrationFieldState {
  isUnique?: boolean;
  isValid: boolean;
  value: string;
  infoIsActive: boolean;
}
