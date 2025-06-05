export const MAX_INPUT_LENGTH = 32;
export const MAX_DATE = getValidEarlierDateInRegexFormat(13);
export const MIN_DATE = getValidEarlierDateInRegexFormat(130);
export const PATTERNS = {
  login: '^[a-zA-Z0-9.%!_]+(?:\\.[a-zA-Z0-9.%!_]+)*@[a-zA-Z0-9.%!_]+(?:\\.[a-zA-Z0-9.%!_]+)+$',
  password: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}',
  firstName: '[a-zA-Z\\s]{1,32}',
  lastName: '[a-zA-Z\\s]{1,32}',
  street: '[a-zA-Z0-9\\s\\-]{1,32}',
  city: '[a-zA-Z\\s\\-]{1,32}',
  postalCode: '[a-zA-Z0-9]{1,32}',
  country: '[a-zA-Z\\s]{1,32}',
  birthDay: '',
};

export const VALIDATION_MESSAGES = {
  login: 'Input valid email address. Max 32 characters.',
  password:
    'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number. Max 32 characters.',
  firstName:
    'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  lastName:
    'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  birthDay: 'Should be 13 years old or older.',
  street: 'Must contain at least one character. Max 32 characters.',
  city: 'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  postalCode: 'Choose a postal code from list.',
  country: 'Choose country from list.',
};

function getValidEarlierDateInRegexFormat(year: number): string {
  const dateNow = new Date();
  const month = String(dateNow.getMonth()).padStart(2, '0');
  const day = String(dateNow.getDate()).padStart(2, '0');
  return `${dateNow.getFullYear() - year}-${month}-${day}`;
}

function testPattern(pattern: string, value: string): boolean {
  return new RegExp(pattern).test(value);
}

export function userDataIsValid(
  login: string,
  firstName: string,
  lastName: string,
  birthDay: string,
) {
  return (
    testPattern(PATTERNS.login, login) &&
    testPattern(PATTERNS.firstName, firstName) &&
    testPattern(PATTERNS.lastName, lastName) &&
    birthDay.length > 0
  );
}
export function passwordIsValid(password: string) {
  return testPattern(PATTERNS.password, password);
}

export function addressIsValid(street: string, city: string, postalCode: string, country: string) {
  return (
    testPattern(PATTERNS.city, city) &&
    testPattern(PATTERNS.country, country) &&
    testPattern(PATTERNS.postalCode, postalCode) &&
    testPattern(PATTERNS.street, street)
  );
}
