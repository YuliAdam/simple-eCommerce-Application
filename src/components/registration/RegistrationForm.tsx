import type { FormEvent, JSX } from 'react';
import styles from '@pages/registration/registration.module.scss';
import type { Address, ICustomer } from '@/interfaces/types';
import { InputTypes, InputName, AddressType } from '@/interfaces/types';
import { Datalist } from './Datalist';
import { RegistrationData } from './RegistrationData';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, toggleAdditionalAddress } from '@/store/slices/registrationSlice';
import RegistrationAdditionalAddress from './RegistrationAdditionalAddress';
import type { RootState } from '@/store/store';
import type {
  ClientResponse,
  CustomerDraft,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import { createCustomer } from '@/services/customersController';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Path } from '@/config/routesConfig';
import { getCodeByCountry } from '@/utils/searchInCountryArrayMetods';

export function RegistrationForm(): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
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
      city: registration.billing.city.value,
      streetName: registration.billing.street.value,
      postalCode: registration.billing.postalCode.value,
    };
    const shippingAddress = {
      key: AddressType.shipping,
      country: getCodeByCountry(registration.shipping.country.value),
      city: registration.shipping.city.value,
      streetName: registration.shipping.street.value,
      postalCode: registration.shipping.postalCode.value,
    };
    const customerDraft: ICustomer = {
      email: registration.login.value,
      password: registration.password.value,
      firstName: registration.firstName.value,
      lastName: registration.lastName.value,
      dateOfBirth: registration.bithDay.value,
      addresses: [
        {
          key: 'main',
          country: getCodeByCountry(registration.country.value),
          city: registration.city.value,
          streetName: registration.street.value,
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

  function onClickSendForm() {
    return async (event: React.MouseEvent) => {
      event.preventDefault();
      const body = getData();
      const response: Error | ClientResponse<CustomerSignInResult> = await createCustomer(body);
      !(response instanceof Error) ? goToIndexPage : console.log(response.message);
    };
  }

  function goToIndexPage() {
    navigate(Path.empty);
    dispatch(resetState());
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
        <RegistrationData name={InputName.login} type={InputTypes.email} />
        <RegistrationData name={InputName.password} type={InputTypes.password} />
      </div>
      <div>
        <h5>Personal Data</h5>
        <RegistrationData name={InputName.firstName} type={InputTypes.text} />
        <RegistrationData name={InputName.lastName} type={InputTypes.text} />
        <RegistrationData name={InputName.bithDay} type={InputTypes.date} />
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

      <button onClick={onClickSendForm()}>Registrate</button>
    </form>
  );
}
