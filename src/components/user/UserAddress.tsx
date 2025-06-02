import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import { AddressType, InputName, InputTypes, IUpdateActions } from '@/interfaces/types';
import Trash from '@/assets/img/trash';
import {
  backOldAddressValue,
  IUserFildNames,
  offRedactMood,
  onRedactMood,
  setAddresses,
  setNewUserValue,
  setVersion,
} from '@/store/slices/userSlice';
import { Close } from '@/assets/img/close';
import { Save } from '@/assets/img/save';
import { resetState, setInvalid, setValid, setValue } from '@/store/slices/registrationSlice';
import { RegistrationInput } from '../registration/RegistrationInput';
import type { ChangeEvent } from 'react';
import { addressIsValid, PATTERNS } from '@/utils/validation/registrationValidation';
import { Datalist } from '../registration/Datalist';
import {
  getCodeByCountry,
  getCountryByPostalCode,
  getPostalCodeByCountry,
} from '@/utils/searchInCountryArrayMethods';
import { CheckBox } from '../registration/CheckBoxInput';
import { Input } from './Input';
import { SHOP } from '@/config/localStorageConfig';
import type { CustomerUpdateAction } from '@commercetools/platform-sdk';
import { getCustomer, updateCustomer } from '@/services/customersController';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import Add from '@/assets/img/add';

const UPDATE_MESSAGE = 'Your address was updated successfully!';
const DELETE_MESSAGE = 'Your address was deleted successfully!';

export function UserAddress() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

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
    const id = user.userAddresses[i].id;
    const addressType = user.billingArr.values.find(item => id === item)
      ? IUserFildNames.billingArr
      : user.shippingArr.values.find(item => id === item)
        ? IUserFildNames.shippingArr
        : null;
    for (let j = 0; j < user.userAddresses.length; j++) {
      if (i !== j) {
        offRedactMoodHandle(j);
        dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
      }
    }
    id && addressType && dispatch(setNewUserValue({ name: addressType, value: id }));
    id === user.shippingDefault.value
      ? dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: id }))
      : id === user.billingDefault.value
        ? dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: id }))
        : dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' })) &&
          dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
    dispatch(onRedactMood(i));
  }

  function offRedactMoodHandle(i: number) {
    dispatch(setNewUserValue({ name: IUserFildNames.billingArr, value: '' }));
    dispatch(setNewUserValue({ name: IUserFildNames.shippingArr, value: '' }));
    dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }));
    dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
    dispatch(offRedactMood(i));
    dispatch(backOldAddressValue(i));
    dispatch(resetState());
  }

  function getRedactForm(j: number) {
    return dataArr.map(item => {
      dispatch(setValue({ name: item.input, value: user.userAddresses[j][item.field].newValue }));
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
        <div className={`${styles.user_wrap} ${styles.redact}`}>
          <Input
            type={InputTypes.text}
            value={user.addressType}
            readonly={false}
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
          <CheckBox
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
      if (!(user.billingDefault.newValue || user.shippingDefault.newValue)) {
        user.addressType === AddressType.billing
          ? dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: id || '' }))
          : dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: id || '' }));
      } else {
        user.addressType === AddressType.billing
          ? dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }))
          : dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
      }
    };
  }

  function onChangeAddressType(id: string | undefined) {
    return (event?: ChangeEvent<HTMLInputElement>) => {
      if (event && event.target && event.target instanceof HTMLInputElement && id) {
        const value = event.target.value;
        dispatch(setNewUserValue({ name: IUserFildNames.addressType, value: value }));
        if (value === AddressType.billing) {
          dispatch(setNewUserValue({ name: IUserFildNames.billingArr, value: id }));
        }
        if (value === AddressType.shipping) {
          dispatch(setNewUserValue({ name: IUserFildNames.shippingArr, value: id }));
        }
        if (value === 'address') {
          dispatch(setNewUserValue({ name: IUserFildNames.billingArr, value: '' }));
          dispatch(setNewUserValue({ name: IUserFildNames.shippingArr, value: '' }));
          dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }));
          dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
        }
      }
    };
  }

  function onChangeInput(name: InputName, i: number) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setValue({ name: name, value: value }));
        dispatch(
          setNewUserValue({
            name: { arrayName: IUserFildNames.userAddresses, i: i },
            input: name,
            value: value,
          }),
        );
        name == InputName.postalCode
          ? dispatch(
              setNewUserValue({
                name: { arrayName: IUserFildNames.userAddresses, i: i },
                input: InputName.country,
                value: getCountryByPostalCode(value),
              }),
            )
          : name == InputName.country
            ? dispatch(
                setNewUserValue({
                  name: { arrayName: IUserFildNames.userAddresses, i: i },
                  input: InputName.postalCode,
                  value: getPostalCodeByCountry(value),
                }),
              )
            : '';
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
    };
  }

  function setBillingOrShipping(id: string | undefined) {
    const isBilling = !!user.billingArr.values.find(item => item === id);
    const isBillingDefaul = user.billingDefault.value === id;
    const isShipping = !!user.shippingArr.values.find(item => item === id);
    const isShippingDefaul = user.shippingDefault.value === id;
    return (
      <div>
        {isBilling ? (
          <span className={styles.address_additional}>Billing</span>
        ) : isShipping ? (
          <span className={styles.address_additional}>Shipping</span>
        ) : (
          ''
        )}
        {isBillingDefaul || isShippingDefaul ? (
          <span className={styles.address_additional}>Default</span>
        ) : (
          ''
        )}
      </div>
    );
  }

  function isValid(i: number) {
    return addressIsValid(
      user.userAddresses[i].streetName.newValue.trim(),
      user.userAddresses[i].city.newValue.trim(),
      user.userAddresses[i].postalCode.newValue.trim(),
      user.userAddresses[i].country.newValue.trim(),
    );
  }

  function showMessage(value: string) {
    window.scrollTo(0, 0);
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
          action: IUpdateActions.changeAddress,
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
          action: IUpdateActions.setDefaultShippingAddress,
          addressId: changedAddress.id,
        });
      }
      if (!user.shippingDefault.newValue && user.shippingDefault.value === changedAddress.id) {
        actions.push({
          action: IUpdateActions.removeShippingAddressId,
          addressId: changedAddress.id,
        });
        actions.push({
          action: IUpdateActions.addShippingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        user.billingDefault.newValue === changedAddress.id &&
        user.billingDefault.value !== changedAddress.id
      ) {
        actions.push({
          action: IUpdateActions.setDefaultBillingAddress,
          addressId: changedAddress.id,
        });
      }
      if (!user.billingDefault.newValue && user.billingDefault.value === changedAddress.id) {
        actions.push({
          action: IUpdateActions.removeBillingAddressId,
          addressId: changedAddress.id,
        });
        actions.push({
          action: IUpdateActions.addBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        changedAddress.id === user.billingArr.newValue &&
        !user.billingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: IUpdateActions.addBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        !user.billingArr.newValue &&
        user.billingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: IUpdateActions.removeBillingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        changedAddress.id === user.shippingArr.newValue &&
        !user.shippingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: IUpdateActions.addShippingAddressId,
          addressId: changedAddress.id,
        });
      }
      if (
        !user.shippingArr.newValue &&
        user.shippingArr.values.find(value => value === changedAddress.id)
      ) {
        actions.push({
          action: IUpdateActions.removeShippingAddressId,
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
          action: IUpdateActions.removeAddress,
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

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Addresses</h5>
        <Add className={styles.user_add} onClick={() => {}} />
      </div>
      {user.userAddresses.map((item, i) => {
        return (
          <div className={styles.user_section} key={item.id}>
            {user.userAddresses[i].isRedactMood ? (
              <>
                <div className={styles.address}>
                  {setBillingOrShipping(user.userAddresses[i].id)}
                  <div className={styles.address_redact}>
                    <div className={styles.user_save_wrap}>
                      <div className={styles.user_close_area}>
                        <Close
                          className={styles.user_close}
                          onClick={() => offRedactMoodHandle(i)}
                        />
                      </div>
                      <div className={styles.user_save_area}>
                        <Save className={styles.user_save} onClick={() => sendForm(i)} />
                      </div>
                    </div>
                  </div>
                </div>
                {getRedactForm(i)}
                {addAddressTypeDiv(item.id)}
              </>
            ) : (
              <>
                <div className={styles.address}>
                  {setBillingOrShipping(user.userAddresses[i].id)}
                  <div className={styles.address_redact}>
                    <Pencil className={styles.user_pencil} onClick={() => onRedactMoodHandler(i)} />
                    <Trash className={styles.user_pencil} onClick={() => deleteAddress(i)} />
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
