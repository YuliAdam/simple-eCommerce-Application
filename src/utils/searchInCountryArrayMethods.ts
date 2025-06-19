import countries from '@assets/countriesList/countries.json';

export function getCodeByCountry(name: string): string {
  const result = countries.find(item => item.name === name);
  return result ? result.code : '';
}

export function getCountryByPostalCode(code: string): string {
  const result = countries.find(item => item.postalCode === code);
  return result ? result.name : '';
}

export function getPostalCodeByCountry(name: string): string {
  const result = countries.find(item => item.name === name);
  return result ? result.postalCode : '';
}
export function getCountryByCode(code: string): string {
  const result = countries.find(item => item.code === code);
  return result ? result.name : '';
}
