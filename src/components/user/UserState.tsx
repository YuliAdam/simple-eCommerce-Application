import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Input } from './Input';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import {
  backOldAddressValue,
  backOldStateValue,
  clearPasswordFields,
  IRedactMoods,
  IUserFieldNames,
  offRedactMood,
  onRedactMood,
  setNewUserValue,
  setUserState,
  setVersion,
  toggleAddAddressForm,
  verifyPassword,
} from '@/store/slices/userSlice';
import { CloseButton } from '@/assets/img/CloseButton';
import { Save } from '@/assets/img/save';
import { RegistrationInput } from '../registration/RegistrationInput';
import { InputName, InputTypes, ICustomerUpdateActions } from '@/interfaces/types';
import type { ChangeEvent } from 'react';
import { resetState, setInvalid, setValid, setValue } from '@/store/slices/registrationSlice';
import { PATTERNS, userDataIsValid } from '@/utils/validation/registrationValidation';
import { getCustomer, updateCustomer } from '@/services/customersController';
import { SHOP } from '@/config/localStorageConfig';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import type { CustomerUpdateAction } from '@commercetools/platform-sdk';

const UPDATE_MESSAGE = 'Your personal data was updated successfully!';

export function UserState() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const dataArr = [
    { name: 'Email:', value: user.userParams.login, input: InputName.login, type: InputTypes.text },
    {
      name: 'First name:',
      value: user.userParams.firstName,
      input: InputName.firstName,
      type: InputTypes.text,
    },
    {
      name: 'Last name:',
      value: user.userParams.lastName,
      input: InputName.lastName,
      type: InputTypes.text,
    },
    {
      name: 'Birth day:',
      value: user.userParams.birthDay,
      input: InputName.birthDay,
      type: InputTypes.date,
    },
  ];

  function onRedactMoodHandle() {
    if (user.isRedactPasswordMood) {
      dispatch(offRedactMood(IRedactMoods.password));
      dispatch(verifyPassword(false));
      dispatch(clearPasswordFields());
      dispatch(resetState());
    }
    if (user.addedAddressIsPresent) {
      dispatch(toggleAddAddressForm(false));
      dispatch(resetState());
      dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
      dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
      dispatch(setNewUserValue({ name: IUserFieldNames.addressType, value: '' }));
    }
    user.userAddresses.forEach((item, i) => {
      if (item.isEditMode) {
        dispatch(setNewUserValue({ name: IUserFieldNames.billingArr, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.shippingArr, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFieldNames.shippingDefault, value: '' }));
        dispatch(offRedactMood(i));
        dispatch(backOldAddressValue(i));
        dispatch(resetState());
      }
    });
    dispatch(onRedactMood(IRedactMoods.userParams));
    dataArr.map(item => {
      dispatch(setValue({ name: item.input, value: item.value.newValue }));
    });
  }
  function offRedactMoodHandle() {
    dispatch(offRedactMood(IRedactMoods.userParams));
    dispatch(backOldStateValue());
    dispatch(resetState());
  }

  function onChangeInput(name: InputName) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setValue({ name: name, value: value }));
        dispatch(setNewUserValue({ name: IUserFieldNames.userParams, input: name, value: value }));
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
    };
  }

  function showMessage(value: string) {
    dispatch(setDialogText(value));
    dispatch(toggleDialog(true));
  }

  function isValid() {
    return userDataIsValid(
      user.userParams.login.newValue.trim(),
      user.userParams.firstName.newValue.trim(),
      user.userParams.lastName.newValue.trim(),
      user.userParams.birthDay.newValue.trim(),
    );
  }

  async function sendForm() {
    const id = localStorage.getItem(SHOP.client_id);
    const actions: CustomerUpdateAction[] = [];
    if (id) {
      if (user.userParams.login.newValue.trim() !== user.userParams.login.value) {
        actions.push({
          action: ICustomerUpdateActions.changeEmail,
          email: user.userParams.login.newValue.trim(),
        });
      }
      if (user.userParams.firstName.newValue.trim() !== user.userParams.firstName.value) {
        actions.push({
          action: ICustomerUpdateActions.setFirstName,
          firstName: user.userParams.firstName.newValue.trim(),
        });
      }
      if (user.userParams.lastName.newValue.trim() !== user.userParams.lastName.value) {
        actions.push({
          action: ICustomerUpdateActions.setLastName,
          lastName: user.userParams.lastName.newValue.trim(),
        });
      }
      if (user.userParams.birthDay.newValue.trim() !== user.userParams.birthDay.value) {
        actions.push({
          action: ICustomerUpdateActions.setDateOfBirth,
          dateOfBirth: user.userParams.birthDay.newValue.trim(),
        });
      }
      if (actions.length > 0 && isValid()) {
        try {
          const response = await updateCustomer(user.version, actions, id);
          dispatch(setVersion(response.body.version));
          showMessage(UPDATE_MESSAGE);
          const newUser = await getCustomer(id);
          if (newUser && !(newUser instanceof Error)) {
            const body = newUser.body;
            console.log(body);
            dispatch(setUserState(body));
            dispatch(offRedactMood(IRedactMoods.userParams));
          }
        } catch (err) {
          if (err instanceof Error) showMessage(err.message);
        }
      } else if (actions.length === 0) {
        offRedactMoodHandle();
      }
    }
  }

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Personal Data</h5>
        {user.isRedactUserParamsMood ? (
          <div className={styles.user_save_wrap}>
            <div className={styles.user_close_area} onClick={offRedactMoodHandle}>
              <CloseButton className={styles.user_close} />
            </div>
            <div className={styles.user_save_area} onClick={sendForm}>
              <Save className={styles.user_save} />
            </div>
          </div>
        ) : (
          <div role="button" onClick={onRedactMoodHandle}>
            <Pencil className={styles.user_pencil} />
          </div>
        )}
      </div>
      {dataArr.map(item => {
        return user.isRedactUserParamsMood ? (
          <RegistrationInput
            key={item.name}
            onChangeInput={onChangeInput(item.input)}
            name={item.input}
            type={item.type}
            value={item.value.newValue}
            className={styles.user_redact}
          />
        ) : (
          <div
            className={`${styles.user_wrap} ${user.isRedactUserParamsMood ? styles.redact : ''}`}
            key={item.input}
          >
            <Input
              value={`${item.name}  ${item.value.value}`}
              readOnly={!user.isRedactUserParamsMood}
              className={styles.user_input}
              type={InputTypes.text}
              placeholder=""
              onChange={() => {}}
            />
          </div>
        );
      })}
    </section>
  );
}
