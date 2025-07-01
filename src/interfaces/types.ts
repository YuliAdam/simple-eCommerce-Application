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

export enum IUserDataName {
  login = 'login',
  password = 'password',
  firstName = 'firstName',
  lastName = 'lastName',
  birthDay = 'birthDay',
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

export interface IUserPageAddress {
  id?: string;
  streetName: { value: string; newValue: string };
  city: { value: string; newValue: string };
  country: { value: string; newValue: string };
  postalCode: { value: string; newValue: string };
  isEditMode: boolean;
}

export interface ICustomerDraft {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  anonymousCart: { id: string };
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
  anonymousCartSignInMode: ' MergeWithExistingCustomerCart';
  anonymousCart?: { id: string };
  anonymousId?: string;
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
  billing: IAdditionalAddress;
  shipping: IAdditionalAddress;
}

export interface IAdditionalAddress {
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
  isVisible?: boolean;
  isValid: boolean;
  value: string;
  infoIsActive: boolean;
}

export enum ICustomerUpdateActions {
  changeEmail = 'changeEmail',
  setFirstName = 'setFirstName',
  setLastName = 'setLastName',
  setDateOfBirth = 'setDateOfBirth',
  changeAddress = 'changeAddress',
  removeAddress = 'removeAddress',
  setDefaultShippingAddress = 'setDefaultShippingAddress',
  addShippingAddressId = 'addShippingAddressId',
  removeShippingAddressId = 'removeShippingAddressId',
  setDefaultBillingAddress = 'setDefaultBillingAddress',
  addBillingAddressId = 'addBillingAddressId',
  removeBillingAddressId = 'removeBillingAddressId',
  addAddress = 'addAddress',
}
export enum IBasketUpdateActions {
  setCustomerEmail = 'setCustomerEmail',
  addLineItem = 'addLineItem',
  removeLineItem = 'removeLineItem',
  addDiscountCode = 'addDiscountCode',
  changeLineItemQuantity = 'changeLineItemQuantity',
  removeDiscountCode = 'removeDiscountCode',
}

export enum TEXT_LANGUAGES {
  enGB = 'en-GB',
}

export enum MONEY_SYMBOLS {
  euro = '€',
}

export enum AttributesName {
  brand = 'brand',
  size = 'size',
  color = 'color',
}

export interface ItemsIdObject {
  id: string;
  variantId: number;
}

export enum VARIANTS {
  brand = 'brand',
  size = 'size',
  color = 'color',
}
