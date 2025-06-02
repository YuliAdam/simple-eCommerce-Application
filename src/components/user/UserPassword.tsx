import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Input } from './Input';
import styles from '@pages/user/user.module.scss';
import registrationStyles from '@pages/registration/registration.module.scss';
import { Pencil } from '@/assets/img/pencil';
import {
  backOldAddressValue,
  backOldStateValue,
  clearPasswordCamps,
  IPasswordCamp,
  IRedactMoods,
  IUserFildNames,
  offRedactMood,
  onRedactMood,
  setNewUserValue,
  setPassword,
  setUserState,
  setVersion,
  toggleAddAddresForm,
  verifyPassword,
} from '@/store/slices/userSlice';
import { Close } from '@/assets/img/close';
import { Save } from '@/assets/img/save';
import { RegistrationInput } from '../registration/RegistrationInput';
import { InputName, InputTypes } from '@/interfaces/types';
import { useState, type ChangeEvent } from 'react';
import { resetState, setInvalid, setValid, setValue } from '@/store/slices/registrationSlice';
import { passwordIsValid, PATTERNS } from '@/utils/validation/registrationValidation';
import {
  getCustomer,
  updatePassword,
  verifyCustomerPassword,
} from '@/services/customersController';
import { SHOP } from '@/config/localStorageConfig';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import { Verify } from '@/assets/img/verify';
import { Eye } from '@/assets/img/eye';
import RegistrationInfo from '../registration/RegistrationInfo';

const UPDATE_MESSAGE = 'Your password was updated successfully!';
const PLACEHOLDER_REPEAT_PASSWORD = 'repeat password';
const REPEAT_PASSWORD_TEXT = 'passwords do not match';

export function UserPassword() {
  const [isVisible, changeVisibility] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const password = {
    value: user.userParams.password,
    input: InputName.password,
    type: InputTypes.password,
  };

  function onRedactMoodHandle() {
    if (user.addedAddressIsPresent) {
      dispatch(toggleAddAddresForm(false));
      dispatch(resetState());
      dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }));
      dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
      dispatch(setNewUserValue({ name: IUserFildNames.addressType, value: '' }));
    }
    user.userAddresses.forEach((item, i) => {
      if (item.isRedactMood) {
        dispatch(setNewUserValue({ name: IUserFildNames.billingArr, value: '' }));
        dispatch(setNewUserValue({ name: IUserFildNames.shippingArr, value: '' }));
        dispatch(setNewUserValue({ name: IUserFildNames.billingDefault, value: '' }));
        dispatch(setNewUserValue({ name: IUserFildNames.shippingDefault, value: '' }));
        dispatch(offRedactMood(i));
        dispatch(backOldAddressValue(i));
        dispatch(resetState());
      }
    });
    if (user.isRedactUserParamsMood) {
      dispatch(offRedactMood(IRedactMoods.userParams));
      dispatch(backOldStateValue());
      dispatch(resetState());
    }
    dispatch(setValue({ name: InputName.password, value: user.userParams.password.currentValue }));
    dispatch(onRedactMood(IRedactMoods.password));
  }

  function offRedactMoodHandle() {
    dispatch(offRedactMood(IRedactMoods.password));
    dispatch(verifyPassword(false));
    dispatch(clearPasswordCamps());
    dispatch(resetState());
  }

  function onChangeInput(name: InputName, passwordFild: IPasswordCamp) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setPassword({ passwordCamp: passwordFild, value: value }));
        dispatch(setValue({ name: name, value: value }));
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
    };
  }

  function onChangeRepeatPassword(passwordFild: IPasswordCamp) {
    return (event: ChangeEvent<HTMLInputElement> | undefined) => {
      if (event && event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setPassword({ passwordCamp: passwordFild, value: value }));
      }
    };
  }

  function showSaveOrVerifyIcon() {
    return user.passwordIsVerify ? (
      <Save className={styles.user_save} onClick={sendForm} />
    ) : (
      <Verify className={styles.user_save} onClick={onClickVerify} />
    );
  }

  async function sendForm() {
    const id = localStorage.getItem(SHOP.client_id);
    if (id && isValid() && passwordsIsMatch()) {
      try {
        const response = await updatePassword(
          id,
          user.version,
          user.userParams.password.currentValue,
          user.userParams.password.newValue,
        );
        dispatch(setVersion(response.body.version));
        showMessage(UPDATE_MESSAGE);
        const newUser = await getCustomer(id);
        if (newUser && !(newUser instanceof Error)) {
          const body = newUser.body;
          console.log(body);
          dispatch(setUserState(body));
          dispatch(offRedactMood(IRedactMoods.password));
        }
      } catch (err) {
        if (err instanceof Error) showMessage(err.message);
      }
    }
  }

  async function onClickVerify() {
    const id = localStorage.getItem(SHOP.client_id);
    if (id) {
      try {
        const response = await verifyCustomerPassword(
          id,
          user.version,
          user.userParams.password.currentValue.trim(),
        );
        if (response.statusCode === 200) {
          dispatch(verifyPassword(true));
          dispatch(setVersion(response.body.version));
        }
      } catch (err) {
        if (err instanceof Error) showMessage(err.message);
      }
    }
  }

  function showMessage(value: string) {
    dispatch(setDialogText(value));
    dispatch(toggleDialog(true));
  }

  function getCurrentPaswordInput() {
    return (
      <>
        <p>Set current password</p>
        <RegistrationInput
          onChangeInput={onChangeInput(password.input, IPasswordCamp.currentValue)}
          name={password.input}
          type={password.type}
          value={password.value.currentValue}
          className={styles.user_redact}
        />
      </>
    );
  }

  function isValid() {
    return passwordIsValid(user.userParams.password.newValue.trim());
  }

  function passwordsIsMatch() {
    return (
      user.userParams.password.newValue.trim() === user.userParams.password.repeatNewValue.trim()
    );
  }

  function toggleRepeatPasswordVisibility() {
    changeVisibility(!isVisible);
  }

  function getClassIfInfoIsActive(): string {
    return !passwordsIsMatch() ? registrationStyles.active : '';
  }

  function getNewPasswordsInputs() {
    dispatch(setValue({ name: InputName.password, value: user.userParams.password.newValue }));
    return (
      <>
        <p>Input new password</p>
        <RegistrationInput
          onChangeInput={onChangeInput(password.input, IPasswordCamp.newValue)}
          name={password.input}
          type={password.type}
          value={password.value.newValue}
          className={styles.user_redact}
        />
        <div className={`${styles.user_wrap} ${user.isRedactPasswordMood ? styles.redact : ''}`}>
          <Input
            type={isVisible ? InputTypes.text : password.type}
            value={password.value.repeatNewValue}
            readonly={!user.isRedactPasswordMood}
            className={styles.user_input}
            placeholder={PLACEHOLDER_REPEAT_PASSWORD}
            onChange={onChangeRepeatPassword(IPasswordCamp.repeatNewValue)}
          />
          <div onClick={toggleRepeatPasswordVisibility}>
            <Eye className={isVisible ? `${styles.eye} ${styles.active}` : `${styles.eye}`} />
          </div>
        </div>
        <RegistrationInfo className={getClassIfInfoIsActive()} text={REPEAT_PASSWORD_TEXT} />
      </>
    );
  }

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Password</h5>
        {user.isRedactPasswordMood ? (
          <div className={styles.user_save_wrap}>
            <div className={styles.user_close_area}>
              <Close className={styles.user_close} onClick={offRedactMoodHandle} />
            </div>
            <div className={styles.user_save_area}>{showSaveOrVerifyIcon()}</div>
          </div>
        ) : (
          <Pencil className={styles.user_pencil} onClick={onRedactMoodHandle} />
        )}
      </div>
      {user.isRedactPasswordMood ? (
        !user.passwordIsVerify ? (
          getCurrentPaswordInput()
        ) : (
          getNewPasswordsInputs()
        )
      ) : (
        <div className={`${styles.user_wrap} ${user.isRedactPasswordMood ? styles.redact : ''}`}>
          <Input
            type={password.type}
            value={password.value.value}
            readonly={!user.isRedactPasswordMood}
            className={styles.user_input}
            placeholder=""
            onChange={() => {}}
          />
        </div>
      )}
    </section>
  );
}
