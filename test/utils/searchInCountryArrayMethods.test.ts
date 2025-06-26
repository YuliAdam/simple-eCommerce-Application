import { expect, it, describe } from 'vitest';
import {
  getCodeByCountry,
  getCountryByCode,
  getCountryByPostalCode,
  getPostalCodeByCountry,
} from '@utils/searchInCountryArrayMethods';

describe('search in countries json', () => {
  it('should return code by country', () => {
    expect(getCodeByCountry('Germany')).toBe('DE');
    expect(getCountryByCode('DE')).toBe('Germany');
    expect(getCountryByPostalCode('16477')).toBe('Germany');
    expect(getPostalCodeByCountry('Germany')).toBe('16477');

    expect(getCodeByCountry('G')).toBe('');
    expect(getCountryByCode('D')).toBe('');
    expect(getCountryByPostalCode('')).toBe('');
    expect(getPostalCodeByCountry('lk')).toBe('');
  });
});
