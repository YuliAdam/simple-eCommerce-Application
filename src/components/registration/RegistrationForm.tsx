import { type FormEvent, type JSX } from 'react';
import styles from '@pages/registration/registration.module.scss';
import type { Address, ICustomer, ILoginParams } from '@/interfaces/types';
import { InputTypes, InputName, AddressType } from '@/interfaces/types';
import { Datalist } from './Datalist';
import { RegistrationData } from './RegistrationData';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetState,
  setLoginNotUnique,
  toggleAdditionalAddress,
} from '@/store/slices/registrationSlice';
import RegistrationAdditionalAddress from './RegistrationAdditionalAddress';
import type { RootState } from '@/store/store';
import type {
  ClientResponse,
  CustomerDraft,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import { createCustomer, loginCustomer } from '@/services/customersController';
import { useNavigate } from 'react-router-dom';
import { Path } from '@/config/routesConfig';
import { getCodeByCountry } from '@/utils/searchInCountryArrayMetods';
import { resetErrorState, setValue } from '@/store/slices/errorSlice';
import { shop } from '@/config/localStorageConfig';
import { PATTERNS } from '@/utils/validation/registrationValidation';

export function RegistrationForm(): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const error = useSelector((state: RootState) => state.error.values);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onClickToggleAdditionalAddress(addressType: AddressType) {
    return () => dispatch(toggleAdditionalAddress(addressType));
  }

  function addAdditionalAddressByTypeIfPresent(
    address: Address,
    type: AddressType,
    customerDraft: CustomerDraft,
    isPresent: boolean,
  ) {
    if (isPresent && customerDraft.addresses) {
      customerDraft.addresses.push(address);
      customerDraft.addresses.forEach((item, i) => {
        if (
          item.key === type &&
          customerDraft.billingAddresses &&
          customerDraft.shippingAddresses
        ) {
          type === AddressType.billing
            ? customerDraft.billingAddresses.push(i)
            : customerDraft.shippingAddresses.push(i);
        }
      });
    }
  }

  function getData() {
    const billingAddress = {
      key: AddressType.billing,
      country: getCodeByCountry(registration.billing.country.value),
      city: registration.billing.city.value.trim(),
      streetName: registration.billing.street.value.trim(),
      postalCode: registration.billing.postalCode.value,
    };
    const shippingAddress = {
      key: AddressType.shipping,
      country: getCodeByCountry(registration.shipping.country.value),
      city: registration.shipping.city.value.trim(),
      streetName: registration.shipping.street.value.trim(),
      postalCode: registration.shipping.postalCode.value,
    };
    const customerDraft: ICustomer = {
      email: registration.login.value.toLowerCase().trim(),
      password: registration.password.value.trim(),
      firstName: registration.firstName.value.trim(),
      lastName: registration.lastName.value.trim(),
      dateOfBirth: registration.birthDay.value,
      addresses: [
        {
          key: 'main',
          country: getCodeByCountry(registration.country.value),
          city: registration.city.value.trim(),
          streetName: registration.street.value.trim(),
          postalCode: registration.postalCode.value,
        },
      ],
      billingAddresses: [],
      shippingAddresses: [],
      defaultBillingAddress:
        registration.billing.isDefault && registration.billing.isPresent ? 1 : undefined,
      defaultShippingAddress:
        registration.shipping.isDefault && registration.shipping.isPresent
          ? registration.billing.isPresent
            ? 2
            : 1
          : undefined,
    };
    addAdditionalAddressByTypeIfPresent(
      billingAddress,
      AddressType.billing,
      customerDraft,
      registration.billing.isPresent,
    );

    addAdditionalAddressByTypeIfPresent(
      shippingAddress,
      AddressType.shipping,
      customerDraft,
      registration.shipping.isPresent,
    );
    return customerDraft;
  }

  function isValidForm() {
    return (
      new RegExp(PATTERNS.login).test(registration.login.value) &&
      new RegExp(PATTERNS.password).test(registration.password.value) &&
      registration.birthDay.value.length > 0 &&
      new RegExp(PATTERNS.firstName).test(registration.firstName.value) &&
      new RegExp(PATTERNS.lastName).test(registration.lastName.value) &&
      new RegExp(PATTERNS.city).test(registration.city.value) &&
      new RegExp(PATTERNS.country).test(registration.country.value) &&
      new RegExp(PATTERNS.postalCode).test(registration.postalCode.value) &&
      new RegExp(PATTERNS.street).test(registration.street.value) &&
      (registration.billing.isPresent
        ? new RegExp(PATTERNS.city).test(registration.billing.city.value) &&
          new RegExp(PATTERNS.country).test(registration.billing.country.value) &&
          new RegExp(PATTERNS.postalCode).test(registration.billing.postalCode.value) &&
          new RegExp(PATTERNS.street).test(registration.billing.street.value)
        : true) &&
      (registration.shipping.isPresent
        ? new RegExp(PATTERNS.login).test(registration.shipping.city.value) &&
          new RegExp(PATTERNS.login).test(registration.shipping.country.value) &&
          new RegExp(PATTERNS.login).test(registration.shipping.postalCode.value) &&
          new RegExp(PATTERNS.login).test(registration.shipping.street.value)
        : true)
    );
  }

  function onClickSendForm() {
    return async () => {
      if (isValidForm()) {
        const body = getData();
        const response: Error | ClientResponse<CustomerSignInResult> = await createCustomer(body);
        !(response instanceof Error)
          ? loginRequest(body.email, body.password)
          : response.message === 'There is already an existing customer with the provided email.'
            ? showRegistrationErrorMessage(response.message)
            : console.log(response.message);
      }
    };
  }

  function showRegistrationErrorMessage(message: string) {
    dispatch(setValue(message));
    dispatch(setLoginNotUnique());
    window.scrollTo(0, 0);
  }

  async function loginRequest(login: string, password: string) {
    const body: ILoginParams = { email: login, password: password };
    const response: Error | ClientResponse<CustomerSignInResult> = await loginCustomer(body);
    !(response instanceof Error) ? goToIndexPage(response) : console.log(response.message);
  }

  function goToIndexPage(response: ClientResponse<CustomerSignInResult>) {
    localStorage.setItem(shop.client_id, response.body.customer.id);
    navigate(Path.empty);
    dispatch(resetState());
    dispatch(resetErrorState());
  }

  function handlerSubmit() {
    return (event: FormEvent) => {
      event.preventDefault();
    };
  }

  return (
    <form className={styles.registration_form} onSubmit={handlerSubmit()}>
      <div>
        <h5>Login Data</h5>
        <p
          className={
            styles.registration_form_info + (registration.login.isUnique ? '' : ' ' + styles.active)
          }
        >
          {error.value}
        </p>
        <RegistrationData name={InputName.login} type={InputTypes.email} />
        <RegistrationData name={InputName.password} type={InputTypes.password} />
      </div>
      <div>
        <h5>Personal Data</h5>
        <RegistrationData name={InputName.firstName} type={InputTypes.text} />
        <RegistrationData name={InputName.lastName} type={InputTypes.text} />
        <RegistrationData name={InputName.birthDay} type={InputTypes.date} />
      </div>
      <div>
        <h5>Address</h5>
        <RegistrationData name={InputName.street} type={InputTypes.text} />
        <RegistrationData name={InputName.city} type={InputTypes.text} />
        <RegistrationData name={InputName.postalCode} type={InputTypes.text} />
        <Datalist id="postalCode" dataName="postalCode" />
        <RegistrationData name={InputName.country} type={InputTypes.text} />
        <Datalist id="countries" dataName="name" />
      </div>
      <div className={styles.registration_form_add_address}>
        <p
          className={styles.registration_form_add_address_text}
          onClick={onClickToggleAdditionalAddress(AddressType.billing)}
        >
          {registration.billing.isPresent ? 'Set billing address later' : 'Add billing address'}
        </p>
        <RegistrationAdditionalAddress type={AddressType.billing} />
        <p
          className={styles.registration_form_add_address_text}
          onClick={onClickToggleAdditionalAddress(AddressType.shipping)}
        >
          {registration.shipping.isPresent ? 'Set shipping address later' : 'Add shipping address'}
        </p>
        <RegistrationAdditionalAddress type={AddressType.shipping} />
      </div>

      <button type="submit" onClick={onClickSendForm()}>
        Register
      </button>
    </form>
  );
}
