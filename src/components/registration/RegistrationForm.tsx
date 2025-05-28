import { SHOP } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import type { IAddress, ICustomer, ILoginParams } from '@/interfaces/types';
import { AddressType, InputName, InputTypes } from '@/interfaces/types';
import { createCustomer, loginCustomer } from '@/services/customersController';
import { login } from '@/store/slices/authSlice';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import {
  resetState,
  setInvalid,
  setLoginNotUnique,
  setLoginUnique,
  setValid,
  setValue,
  toggleAdditionalAddress,
} from '@/store/slices/registrationSlice';
import type { RootState } from '@/store/store';
import { getCodeByCountry } from '@utils/searchInCountryArrayMethods';
import { PATTERNS } from '@/utils/validation/registrationValidation';
import type {
  ClientResponse,
  CustomerDraft,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import styles from '@pages/registration/registration.module.scss';
import type { ChangeEvent } from 'react';
import { type FormEvent, type JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Datalist } from './Datalist';
import RegistrationAdditionalAddress from './RegistrationAdditionalAddress';
import { RegistrationInput } from './RegistrationInput';

export function RegistrationForm(): JSX.Element {
  const registration = useSelector((state: RootState) => state.registration.values);
  const dialog = useSelector((state: RootState) => state.dialog.values);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const REGISTRATED_MESSAGE = 'Congratulations, your account has been successfully created!';
  function onClickToggleAdditionalAddress(addressType: AddressType) {
    return () => dispatch(toggleAdditionalAddress(addressType));
  }

  function onChangeInputValue(name: InputName) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setValue({ name: name, value: value }));
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
      if (name === InputName.login) {
        dispatch(setLoginUnique());
      }
    };
  }

  function addAdditionalAddressByTypeIfPresent(
    address: IAddress,
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
        ? new RegExp(PATTERNS.city).test(registration.shipping.city.value) &&
          new RegExp(PATTERNS.country).test(registration.shipping.country.value) &&
          new RegExp(PATTERNS.postalCode).test(registration.shipping.postalCode.value) &&
          new RegExp(PATTERNS.street).test(registration.shipping.street.value)
        : true)
    );
  }

  async function submitForm() {
    if (isValidForm()) {
      const body = getData();
      console.log(body);
      const response = await createCustomer(body);
      window.scrollTo(0, 0);
      dispatch(setDialogText(REGISTRATED_MESSAGE));
      dispatch(toggleDialog(true));
      if (!(response instanceof Error)) {
        while (dialog.isOpen) {
          setTimeout(() => {}, 3000);
        }
        loginRequest(body.email, body.password);
      } else {
        if (response.message === 'There is already an existing customer with the provided email.') {
          showRegistrationErrorMessage(response.message);
        } else {
          dispatch(setDialogText(response.message));
          dispatch(toggleDialog(true));
        }
      }
    }
  }

  function showRegistrationErrorMessage(message: string) {
    dispatch(setDialogText(message));
    dispatch(setLoginNotUnique());
  }

  async function loginRequest(login: string, password: string) {
    const body: ILoginParams = { email: login, password: password };
    const response = await loginCustomer(body);
    !(response instanceof Error) && response
      ? goToIndexPage(response)
      : response instanceof Error
        ? console.log(response.message)
        : console.log(response);
  }

  function goToIndexPage(response: ClientResponse<CustomerSignInResult>) {
    localStorage.setItem(SHOP.client_id, response.body.customer.id);
    dispatch(login(response.body.customer.id));
    dispatch(resetState());
    navigate(Path.empty);
  }

  function handlerSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <form className={styles.registration_form} onSubmit={handlerSubmit}>
      <div>
        <h5>Login Data</h5>
        <p
          className={
            styles.registration_form_info + (registration.login.isUnique ? '' : ' ' + styles.active)
          }
        >
          {dialog.value}
        </p>
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.login)}
          name={InputName.login}
          type={InputTypes.email}
          value={registration.login.value}
        />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.password)}
          name={InputName.password}
          type={InputTypes.password}
          value={registration.password.value}
        />
      </div>
      <div>
        <h5>Personal Data</h5>
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.firstName)}
          name={InputName.firstName}
          type={InputTypes.text}
          value={registration.firstName.value}
        />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.lastName)}
          name={InputName.lastName}
          type={InputTypes.text}
          value={registration.lastName.value}
        />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.birthDay)}
          name={InputName.birthDay}
          type={InputTypes.date}
          value={registration.birthDay.value}
        />
      </div>
      <div>
        <h5>Address</h5>
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.street)}
          name={InputName.street}
          type={InputTypes.text}
          value={registration.street.value}
        />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.city)}
          name={InputName.city}
          type={InputTypes.text}
          value={registration.city.value}
        />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.postalCode)}
          name={InputName.postalCode}
          type={InputTypes.text}
          value={registration.postalCode.value}
        />
        <Datalist id="postalCode" dataName="postalCode" />
        <RegistrationInput
          className={''}
          onChangeInput={onChangeInputValue(InputName.country)}
          name={InputName.country}
          type={InputTypes.text}
          value={registration.country.value}
        />
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

      <button type="submit" onClick={submitForm}>
        Register
      </button>
    </form>
  );
}
