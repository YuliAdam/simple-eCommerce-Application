export const MAX_INPUT_LENGTH = 32;
export const MAX_DATE = getValidEarlierDateInRegexFormat(13);
export const MIN_DATE = getValidEarlierDateInRegexFormat(130);
export const PATTERNS = {
  login: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}',
  password: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}',
  firstName: '^[A-Z][a-z]{1,32}',
  lastName: '^[A-Z][a-z]{1,32}',
  street: '.^[A-Z][a-z][0-9]+(\s[A-Z][a-z][0-9]+)*{1,32}',
  city: '^[A-Z][a-z]+(\s[A-Z][a-z]+)*{1,32}',
  postalCode: '[a-zA-Z0-9]{1,32}',
  country: '^[A-Z][a-z]+(\s[A-Z][a-z]+)*{1,32}',
};
export const VALIDATION_MESSAGES = {
  login: 'Input valid email address. Max 32 characters.',
  password:
    'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number. Max 32 characters.',
  firstName:
    'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  lastName:
    'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  bithDay: 'Should be 13 years old or older.',
  street: 'Must contain at least one character. Max 32 characters.',
  city: 'Must contain at least one character and no special characters or numbers. Max 32 characters.',
  postalCode: 'Choise a postal code from list.',
  country: 'Choise country from list.',
};

function getValidEarlierDateInRegexFormat(year: number): string {
  const dateNow = new Date();
  const month = dateNow.getMonth() > 9 ? `${dateNow.getMonth() + 1}` : `0${dateNow.getMonth() + 1}`;
  const day = dateNow.getDate() > 10 ? `${dateNow.getDate()}` : `0${dateNow.getDate()}`;
  return `${dateNow.getFullYear() - year}-${month}-${day}`;
}
