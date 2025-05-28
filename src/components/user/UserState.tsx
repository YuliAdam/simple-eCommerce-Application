import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Input } from './Input';
import styles from '@pages/user/user.module.scss';
import { Pencil } from '@/assets/img/pencil';
import {
  backOldStateValue,
  IUserFildNames,
  offRedactMood,
  onRedactMood,
  setNewUserValue,
  setUserState,
  setVersion,
} from '@/store/slices/userSlice';
import { Close } from '@/assets/img/close';
import { Save } from '@/assets/img/save';
import { RegistrationInput } from '../registration/RegistrationInput';
import { InputName, InputTypes, IUpdateActions } from '@/interfaces/types';
import type { ChangeEvent } from 'react';
import { setInvalid, setValid, setValue } from '@/store/slices/registrationSlice';
import { PATTERNS } from '@/utils/validation/registrationValidation';
import { getCustomer, updateCustomer } from '@/services/customersController';
import { SHOP } from '@/config/localStorageConfig';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';

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
      name: 'Bith day:',
      value: user.userParams.birthDay,
      input: InputName.birthDay,
      type: InputTypes.date,
    },
  ];

  function onRedactMoodHandle() {
    dispatch(onRedactMood());
  }
  function offRedactMoodHandle() {
    dispatch(offRedactMood());
    dispatch(backOldStateValue());
  }

  function onChangeInput(name: InputName) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setValue({ name: name, value: value }));
        dispatch(setNewUserValue({ name: IUserFildNames.userParams, input: name, value: value }));
        new RegExp(PATTERNS[name]).test(value)
          ? dispatch(setValid(name))
          : dispatch(setInvalid(name));
      }
      event.target.focus();
    };
  }

  function showIfError(value: string) {
    dispatch(setDialogText(value));
    dispatch(toggleDialog(true));
  }

  async function sendForm() {
    const id = localStorage.getItem(SHOP.client_id);
    if (id) {
      if (user.userParams.login.newValue !== user.userParams.login.value) {
        try {
          await updateCustomer(
            user.version,
            [{ action: IUpdateActions.changeEmail, email: user.userParams.login.newValue }],
            id,
          );
        } catch (e) {
          if (e instanceof Error) showIfError(e.message);
        }
      }
      if (user.userParams.firstName.newValue !== user.userParams.firstName.value) {
        try {
          await updateCustomer(
            user.version,
            [
              {
                action: IUpdateActions.setFirstName,
                firstName: user.userParams.firstName.newValue,
              },
            ],
            id,
          );
          dispatch(setVersion(user.version + 1));
        } catch (e) {
          if (e instanceof Error) showIfError(e.message);
        }
      }
      if (user.userParams.lastName.newValue !== user.userParams.lastName.value) {
        try {
          await updateCustomer(
            user.version,
            [{ action: IUpdateActions.setLastName, lastName: user.userParams.lastName.newValue }],
            id,
          );
          dispatch(setVersion(user.version + 1));
        } catch (e) {
          if (e instanceof Error) showIfError(e.message);
        }
      }
      if (user.userParams.birthDay.newValue !== user.userParams.birthDay.value) {
        try {
          await updateCustomer(
            user.version,
            [
              {
                action: IUpdateActions.setDateOfBirth,
                dateOfBirth: user.userParams.birthDay.newValue,
              },
            ],
            id,
          );
          dispatch(setVersion(user.version + 1));
        } catch (e) {
          if (e instanceof Error) showIfError(e.message);
        }
      }
      dispatch(setVersion(user.version + 1));
      await getCustomer(id).then(res => {
        if (res && !(res instanceof Error)) {
          const body = res.body;
          console.log(body);
          dispatch(setUserState(body));
          dispatch(setVersion(body.version));
          dispatch(offRedactMood());
        }
      });
    }
  }

  return (
    <section className={styles.user_section}>
      <div className={styles.user_section_title}>
        <h5>Personal Data</h5>
        {user.isRedactMood ? (
          <div className={styles.user_save_wrap}>
            <div className={styles.user_close_area}>
              <Close className={styles.user_close} onClick={offRedactMoodHandle} />
            </div>
            <div className={styles.user_save_area}>
              <Save className={styles.user_save} onClick={sendForm} />
            </div>
          </div>
        ) : (
          <Pencil className={styles.user_pencil} onClick={onRedactMoodHandle} />
        )}
      </div>
      {user.isRedactMood
        ? dataArr.map(item => {
            dispatch(setValue({ name: item.input, value: item.value.newValue }));
            return (
              <RegistrationInput
                key={item.name}
                onChangeInput={onChangeInput(item.input)}
                name={item.input}
                type={item.type}
                value={item.value.newValue}
                className={styles.user_redact}
              />
            );
          })
        : dataArr.map(item => {
            return (
              <div
                className={`${styles.user_wrap} ${user.isRedactMood ? styles.redact : ''}`}
                key={item.input}
              >
                <Input
                  value={`${item.name} ${item.value.value}`}
                  readonly={!user.isRedactMood}
                  className={styles.user_input}
                />
              </div>
            );
          })}
    </section>
  );
}
