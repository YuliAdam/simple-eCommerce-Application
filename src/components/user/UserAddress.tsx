import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import { AddressType, InputName, InputTypes, ICustomerUpdateActions } from '@/interfaces/types';
import Trash from '@/assets/img/trash';
import {
  backOldAddressValue,
  backOldStateValue,
  clearPasswordFields,
  IRedactMoods,
  IUserFieldNames,
  offRedactMood,
  onRedactMood,
  setAddresses,
  setNewUserValue,
  setVersion,
  toggleAddAddressForm,
  verifyPassword,
} from '@/store/slices/userSlice';
import { CloseButton } from '@/assets/img/CloseButton';
import { Save } from '@/assets/img/save';
import { resetState, setInvalid, setValid, setValue } from '@/store/slices/registrationSlice';
import { RegistrationInput } from '../registration/RegistrationInput';
import type { ChangeEvent } from 'react';
import { addressIsValid, PATTERNS } from '@/utils/validation/registrationValidation';
import { Datalist } from '../registration/Datalist';
import { getCodeByCountry } from '@/utils/searchInCountryArrayMethods';
import { Checkbox } from '../registration/CheckBoxInput';
import { Input } from './Input';
import { SHOP } from '@/config/localStorageConfig';
import type { CustomerUpdateAction } from '@commercetools/platform-sdk';
import { getCustomer, updateCustomer } from '@/services/customersController';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import Add from '@/assets/img/add';

const UPDATE_MESSAGE = 'Your address was updated successfully!';
const DELETE_MESSAGE = 'Your address was deleted successfully!';
const ADD_MESSAGE = 'Your address was add successfully!';

export function UserAddress() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const registration = useSelector((state: RootState) => state.registration.values);
  const dataArr: {
    name: string;
    input: InputName;
    field: InputName.country | InputName.postalCode | InputName.city | 'streetName';
  }[] = [
    { name: 'Street:', input: InputName.street, field: 'streetName' },
    {
      name: 'City:',
      input: InputName.city,
      field: InputName.city,
    },
    {
      name: 'Postal Code:',
      input: InputName.postalCode,
      field: InputName.postalCode,
    },
    {
      name: 'Country:',
      input: InputName.country,
      field: InputName.country,
    },
  ];

  function onRedactMoodHandler(i: number) {
    if (user.isRedactPasswordMood) {
      dispatch(offRedactMood(IRedactMoods.password));
      dispatch(verifyPassword(false));
      dispatch(clearPasswordFields());
      dispatch(resetState());
    }
    if (user.addedAddressIsPresent) closeAddAddressForm();
    if (user.isRedactUserParamsMood) {
      dispatch(offRedactMood(IRedactMoods.userParams));
      dispatch(backOldStateValue());
      dispatch(resetState());
    }

    const id = user.userAddresses[i].id;
    const addressType = user.billingArr.values.find(item => id === item)
      ? IUserFieldNames.billingArr
      : user.shippingArr.values.find(item => id === item)
        ? IUserFieldNames.shippingArr
        : null;
    for (let j = 0; j < user.userAddresses.length; j++) {
      if (i !== j) {
        offRedactMoodHandle(j);
        dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
      }
    }
    id && addressType && dispatch(setNewUserValue({ name: addressType, value: id }));
    id === user.shippingDefault.value
      ? dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: id }))
      : id === user.billingDefault.value
        ? dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: id }))
        : dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' })) &&
          dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
    dataArr.map(item => {
      dispatch(setValue({ name: item.input, value: user.userAddresses[i][item.field].newValue }));
    });
    dispatch(onRedactMood(i));
  }

  function offRedactMoodHandle(i: number) {
    dispatch(setNewUserValue({ name: IUserFieldNames.billingArr, value: '' }));
    dispatch(setNewUserValue({ name: IUserFieldNames.shippingArr, value: '' }));
    dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
    dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
    dispatch(offRedactMood(i));
    dispatch(backOldAddressValue(i));
    dispatch(resetState());
  }

  function getRedactForm(j: number) {
    return dataArr.map(item => {
      return (
        <div key={item.name}>
          <RegistrationInput
            onChangeInput={onChangeInput(item.input, j)}
            name={item.input}
            type={InputTypes.text}
            value={user.userAddresses[j][item.field].newValue}
            className={styles.user_redact}
          />
          {item.input === InputName.postalCode ? (
            <Datalist id={item.input} dataName={item.input} />
          ) : item.input === InputName.country ? (
            <Datalist id="countries" dataName="name" />
          ) : (
            ''
          )}
        </div>
      );
    });
  }

  function addAddressTypeDiv(id: string | undefined) {
    return (
      <>
        <div
          className={`${styles.user_wrap} ${styles.redact} ${[AddressType.billing, AddressType.shipping, 'address'].includes(user.addressType) ? '' : styles.invalid}`}
        >
          <Input
            type={InputTypes.text}
            value={user.addressType}
            readOnly={false}
            className={styles.user_input}
            placeholder="address type"
            onChange={onChangeAddressType(id)}
            list="address"
          />
        </div>
        <datalist id="address">
          <option value="address" />
          <option value={AddressType.billing} />
          <option value={AddressType.shipping} />
        </datalist>
        {user.addressType !== 'address' ? (
          <Checkbox
            checked={!!(user.billingDefault.newValue || user.shippingDefault.newValue)}
            onChange={onChangeAsDefault(id)}
            text="Set as default"
          />
        ) : (
          ''
        )}
      </>
    );
  }

  function onChangeAsDefault(id: string | undefined) {
    return () => {
      if (!(user.billingDefault.newValue || user.shippingDefault.newValue) && id) {
        user.addressType === AddressType.billing
          ? dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: id }))
          : dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: id }));
      } else if (id && !!(user.billingDefault.newValue || user.shippingDefault.newValue)) {
        user.addressType === AddressType.billing
          ? dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }))
          : dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
      } else if (!id && !(user.billingDefault.newValue || user.shippingDefault.newValue)) {
        user.addressType === AddressType.billing
          ? dispatch(
              setNewUserValue({ name: IUserFieldNames.billingDefault, value: 'new address' }),
            )
          : user.addressType === AddressType.shipping
            ? dispatch(
                setNewUserValue({ name: IUserFieldNames.shippingDefault, value: 'new address' }),
              )
            : '';
      } else if (!id && !!(user.billingDefault.newValue || user.shippingDefault.newValue)) {
        dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
      }
    };
  }

  function onChangeAddressType(id: string | undefined) {
    return (event?: ChangeEvent<HTMLInputElement>) => {
      if (event && event.target && event.target instanceof HTMLInputElement && id) {
        const value = event.target.value;
        dispatch(setNewUserValue({ name: IUserFieldNames.addressType, value: value }));
        if (value === AddressType.billing) {
          dispatch(setNewUserValue({ name: IUserFieldNames.billingArr, value: id }));
        }
        if (value === AddressType.shipping) {
          dispatch(setNewUserValue({ name: IUserFieldNames.shippingArr, value: id }));
        }
        if (value === 'address') {
          dispatch(setNewUserValue({ name: IUserFieldNames.billingArr, value: '' }));
          dispatch(setNewUserValue({ name: IUserFieldNames.shippingArr, value: '' }));
          dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
          dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
        }
      } else if (event && event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setNewUserValue({ name: IUserFieldNames.addressType, value: value }));
        dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
      }
    };
  }

  function onChangeInput(name: InputName, i: number) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        console.log(value);
        dispatch(setValue({ name: name, value: value }));
        dispatch(
          setNewUserValue({
            name: { arrayName: IUserFieldNames.userAddresses, i: i },
            input: name,
            value: value,
          }),
        );
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
    };
  }

  function setBillingOrShipping(id: string | undefined) {
    const isBilling = !!user.billingArr.values.find(item => item === id);
    const isBillingDefault = user.billingDefault.value === id;
    const isShipping = !!user.shippingArr.values.find(item => item === id);
    const isShippingDefault = user.shippingDefault.value === id;
    return (
      <div>
        {isBilling ? (
          <span className={styles.address_additional}>Billing</span>
        ) : isShipping ? (
          <span className={styles.address_additional}>Shipping</span>
        ) : (
          ''
        )}
        {isBillingDefault || isShippingDefault ? (
          <span className={styles.address_additional}>Default</span>
        ) : (
          ''
        )}
      </div>
    );
  }

  function isValid(i: number) {
    return (
      addressIsValid(
        user.userAddresses[i].streetName.newValue.trim(),
        user.userAddresses[i].city.newValue.trim(),
        user.userAddresses[i].postalCode.newValue.trim(),
        user.userAddresses[i].country.newValue.trim(),
      ) && [AddressType.billing, AddressType.shipping, 'address'].includes(user.addressType)
    );
  }

  function showMessage(value: string) {
    dispatch(setDialogText(value));
    dispatch(toggleDialog(true));
  }

  async function sendForm(i: number) {
    const id = localStorage.getItem(SHOP.client_id);
    const actions: CustomerUpdateAction[] = [];
    const changedAddress = user.userAddresses[i];
    if (id) {
      if (
        changedAddress.city.value !== changedAddress.city.newValue.trim() ||
        changedAddress.country.value !== changedAddress.country.newValue.trim() ||
        changedAddress.postalCode.value !== changedAddress.postalCode.newValue.trim() ||
        changedAddress.streetName.value !== changedAddress.streetName.newValue.trim()
      ) {
        actions.push({
          action: ICustomerUpdateActions.changeAddress,
          addressId: changedAddress.id,
          address: {
            id: changedAddress.id,
            city: changedAddress.city.newValue.trim(),
            country: getCodeByCountry(changedAddress.country.newValue.trim()),
            postalCode: changedAddress.postalCode.newValue.trim(),
            streetName: changedAddress.streetName.newValue.trim(),
          },
        });
      }
      if (
        user.shippingDefault.newValue === changedAddress.id &&
        user.shippingDefault.value !== changedAddress.id
      ) {
        actions.push({
          action: ICustomerUpdateActions.setDefaultShippingAddress,
          addressId: changedAddress.id,
        });
      }
      if (!user.shippingDefault.newValue && user.shippingDefault.value === changedAddress.id) {
        actions.push({
          action: ICustomerUpdateActions.removeShippingAddressId,
          addressId: changedAddress.id,
        });
        actions.push({
          action: ICustomerUpdateActions.addShippingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        user.billingDefault.newValue === changedAddress.id &&
        user.billingDefault.value !== changedAddress.id
      ) {
        actions.push({
          action: ICustomerUpdateActions.setDefaultBillingAddress,
          addressId: changedAddress.id,
        });
      }
      if (!user.billingDefault.newValue && user.billingDefault.value === changedAddress.id) {
        actions.push({
          action: ICustomerUpdateActions.removeBillingAddressId,
          addressId: changedAddress.id,
        });
        actions.push({
          action: ICustomerUpdateActions.addBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        changedAddress.id === user.billingArr.newValue &&
        !user.billingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: ICustomerUpdateActions.addBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        !user.billingArr.newValue &&
        user.billingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: ICustomerUpdateActions.removeBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        changedAddress.id === user.shippingArr.newValue &&
        !user.shippingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: ICustomerUpdateActions.addShippingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        !user.shippingArr.newValue &&
        user.shippingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: ICustomerUpdateActions.removeShippingAddressId,
          addressId: changedAddress.id,
        });
      }

      if (actions.length > 0 && isValid(i)) {
        try {
          const response = await updateCustomer(user.version, actions, id);
          dispatch(setVersion(response.body.version));
          showMessage(UPDATE_MESSAGE);
          const newUser = await getCustomer(id);
          if (newUser && !(newUser instanceof Error)) {
            const body = newUser.body;
            console.log(body);
            dispatch(offRedactMood(i));
            dispatch(setAddresses(body));
          }
        } catch (err) {
          if (err instanceof Error) showMessage(err.message);
        }
      } else if (actions.length === 0) {
        offRedactMoodHandle(i);
      }
    }
  }

  async function deleteAddress(i: number) {
    const id = localStorage.getItem(SHOP.client_id);
    if (id) {
      const actions: CustomerUpdateAction[] = [
        {
          action: ICustomerUpdateActions.removeAddress,
          addressId: user.userAddresses[i].id,
        },
      ];
      try {
        for (let i = 0; i < user.userAddresses.length; i++) {
          dispatch(offRedactMood(i));
        }
        const response = await updateCustomer(user.version, actions, id);
        dispatch(setVersion(response.body.version));
        showMessage(DELETE_MESSAGE);
        const newUser = await getCustomer(id);
        if (newUser && !(newUser instanceof Error)) {
          const body = newUser.body;
          console.log(body);
          dispatch(setAddresses(body));
        }
      } catch (err) {
        if (err instanceof Error) showMessage(err.message);
      }
    }
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
    };
  }

  function closeAddAddressForm() {
    dispatch(toggleAddAddressForm(false));
    dispatch(resetState());
    dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
    dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
    dispatch(setNewUserValue({ name: IUserFieldNames.addressType, value: '' }));
  }

  function addAddressForm() {
    return (
      <div className={styles.user_section}>
        <div className={styles.address}>
          <h5>Add address</h5>
          <div className={styles.address_redact}>
            <div className={styles.user_save_wrap}>
              <div className={styles.user_close_area} onClick={closeAddAddressForm}>
                <CloseButton className={styles.user_close} />
              </div>
              <div className={styles.user_save_area} onClick={sendFormAddNewAddress}>
                <Save className={styles.user_save} />
              </div>
            </div>
          </div>
        </div>

        <RegistrationInput
          className={styles.user_redact}
          onChangeInput={onChangeInputValue(InputName.street)}
          name={InputName.street}
          type={InputTypes.text}
          value={registration.street.value}
        />
        <RegistrationInput
          className={styles.user_redact}
          onChangeInput={onChangeInputValue(InputName.city)}
          name={InputName.city}
          type={InputTypes.text}
          value={registration.city.value}
        />
        <RegistrationInput
          className={styles.user_redact}
          onChangeInput={onChangeInputValue(InputName.postalCode)}
          name={InputName.postalCode}
          type={InputTypes.text}
          value={registration.postalCode.value}
        />
        <Datalist id="postalCode" dataName="postalCode" />
        <RegistrationInput
          className={styles.user_redact}
          onChangeInput={onChangeInputValue(InputName.country)}
          name={InputName.country}
          type={InputTypes.text}
          value={registration.country.value}
        />
        <Datalist id="countries" dataName="name" />
        {addAddressTypeDiv(undefined)}
      </div>
    );
  }

  function newAddressIsValid() {
    return (
      addressIsValid(
        registration.street.value.trim(),
        registration.city.value.trim(),
        registration.postalCode.value.trim(),
        registration.country.value.trim(),
      ) && [AddressType.billing, AddressType.shipping, 'address'].includes(user.addressType)
    );
  }

  async function sendFormAddNewAddress() {
    const id = localStorage.getItem(SHOP.client_id);
    let actions: CustomerUpdateAction[] = [];
    if (newAddressIsValid() && id) {
      actions.push({
        action: ICustomerUpdateActions.addAddress,
        address: {
          city: registration.city.value.trim(),
          country: getCodeByCountry(registration.country.value.trim()),
          postalCode: registration.postalCode.value.trim(),
          streetName: registration.street.value.trim(),
        },
      });

      try {
        await updateCustomer(user.version, actions, id);
        const newUser = await getCustomer(id);
        if (newUser && !(newUser instanceof Error)) {
          const body = newUser.body;
          const newAddressId = body.addresses[body.addresses.length - 1].id;
          actions = [];
          if (user.shippingDefault.newValue) {
            actions.push({
              action: ICustomerUpdateActions.setDefaultShippingAddress,
              addressId: newAddressId,
            });
          }
          if (user.billingDefault.newValue) {
            actions.push({
              action: ICustomerUpdateActions.setDefaultBillingAddress,
              addressId: newAddressId,
            });
          }
          if (user.addressType === AddressType.billing) {
            actions.push({
              action: ICustomerUpdateActions.addBillingAddressId,
              addressId: newAddressId,
            });
          }
          if (user.addressType === AddressType.shipping) {
            actions.push({
              action: ICustomerUpdateActions.addShippingAddressId,
              addressId: newAddressId,
            });
          }
          const response = await updateCustomer(user.version + 1, actions, id);
          dispatch(setVersion(response.body.version));
          showMessage(ADD_MESSAGE);
          const newFinalUser = await getCustomer(id);
          if (newFinalUser && !(newFinalUser instanceof Error)) {
            const body = newFinalUser.body;
            console.log(body);
            closeAddAddressForm();
            dispatch(setAddresses(body));
          }
        }
      } catch (err) {
        if (err instanceof Error) showMessage(err.message);
      }
    }
  }

  function addAddressMood() {
    if (user.isRedactPasswordMood) {
      dispatch(offRedactMood(IRedactMoods.password));
      dispatch(verifyPassword(false));
      dispatch(clearPasswordFields());
      dispatch(resetState());
    }
    if (user.isRedactUserParamsMood) {
      dispatch(offRedactMood(IRedactMoods.userParams));
      dispatch(backOldStateValue());
      dispatch(resetState());
    }
    user.userAddresses.forEach((item, i) => {
      if (item.isEditMode) {
        offRedactMoodHandle(i);
      }
    });
    dispatch(toggleAddAddressForm(true));
  }

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Addresses</h5>
        <Add className={styles.user_add} onClick={addAddressMood} />
      </div>
      {user.addedAddressIsPresent ? addAddressForm() : ''}
      {user.userAddresses.map((item, i) => {
        return (
          <div className={styles.user_section} key={item.id}>
            {user.userAddresses[i].isEditMode ? (
              <>
                <div className={styles.address}>
                  {setBillingOrShipping(user.userAddresses[i].id)}
                  <div className={styles.address_redact}>
                    <div className={styles.user_save_wrap}>
                      <div
                        role="button"
                        className={styles.user_close_area}
                        onClick={() => offRedactMoodHandle(i)}
                      >
                        <CloseButton className={styles.user_close} />
                      </div>
                      <div className={styles.user_save_area} onClick={() => sendForm(i)}>
                        <Save className={styles.user_save} />
                      </div>
                    </div>
                  </div>
                </div>
                {...getRedactForm(i)}
                {addAddressTypeDiv(item.id)}
              </>
            ) : (
              <>
                <div className={styles.address}>
                  {setBillingOrShipping(user.userAddresses[i].id)}
                  <div className={styles.address_redact}>
                    <div role="button" onClick={() => onRedactMoodHandler(i)}>
                      <Pencil className={styles.user_pencil} />
                    </div>
                    <div role="button" onClick={() => deleteAddress(i)}>
                      <Trash className={styles.user_pencil} />
                    </div>
                  </div>
                </div>
                <p>{`${item.streetName.value} ${item.city.value} ${item.country.value}, ${item.postalCode.value}`}</p>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
