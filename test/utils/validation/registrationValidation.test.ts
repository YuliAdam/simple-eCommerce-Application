import { expect, it, describe } from 'vitest';
import {
  userDataIsValid,
  passwordIsValid,
  addressIsValid,
} from '../../../src/utils/validation/registrationValidation';

const validUserData = {
  login: '1@1.1',
  firstName: 'a',
  lastName: 'a',
  birthDay: '1994.04.22',
};
const validPassword = '111111aA';
const validAddress = {
  street: 'h',
  city: 'a',
  postalCode: 'a',
  country: 'a',
};

describe('validation', () => {
  it('should return user Data is valid or not', () => {
    expect(
      userDataIsValid(
        validUserData.login,
        validUserData.firstName,
        validUserData.lastName,
        validUserData.birthDay,
      ),
    ).toBeTruthy();
    expect(
      userDataIsValid(
        '@jh.kugv',
        validUserData.firstName,
        validUserData.lastName,
        validUserData.birthDay,
      ),
    ).toBeFalsy();
    expect(
      userDataIsValid(validUserData.login, '', validUserData.lastName, validUserData.birthDay),
    ).toBeFalsy();
    expect(
      userDataIsValid(validUserData.login, validUserData.firstName, '', validUserData.birthDay),
    ).toBeFalsy();
    expect(
      userDataIsValid(
        validUserData.login,
        validUserData.firstName,
        validUserData.lastName,
        '2025/04/22',
      ),
    ).toBeFalsy();
    expect(passwordIsValid(validPassword)).toBeTruthy();
    expect(passwordIsValid('111111aa')).toBeFalsy();
    expect(passwordIsValid('11111Aa')).toBeFalsy();
    expect(
      addressIsValid(
        validAddress.street,
        validAddress.city,
        validAddress.postalCode,
        validAddress.country,
      ),
    ).toBeTruthy();
    expect(
      addressIsValid('', validAddress.city, validAddress.postalCode, validAddress.country),
    ).toBeFalsy();
    expect(
      addressIsValid(validAddress.street, '', validAddress.postalCode, validAddress.country),
    ).toBeFalsy();
    expect(
      addressIsValid(validAddress.street, validAddress.city, '', validAddress.country),
    ).toBeFalsy();
    expect(
      addressIsValid(validAddress.street, validAddress.city, validAddress.postalCode, ''),
    ).toBeFalsy();
  });
});
