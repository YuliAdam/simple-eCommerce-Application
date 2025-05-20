import countries from '@assets/countriesList/countries.json';

export function getCodeByCountry(name: string): string {
  let result = '';
  countries.forEach(item => {
    if (item.name === name) {
      result = item.code;
    }
  });
  return result;
}

export function getCountryByPostalCode(code: string): string {
  let result = '';
  countries.forEach(item => {
    if (item.postalCode === code) {
      result = item.name;
    }
  });
  return result;
}

export function getPostalCodeByCountry(name: string): string {
  let result = '';
  countries.forEach(item => {
    if (item.name === name) {
      result = item.postalCode;
    }
  });
  return result;
}
