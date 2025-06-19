import { expect, it, describe } from 'vitest';
import {
  getCodeByCountry,
  getCountryByCode,
  getCountryByPostalCode,
  getPostalCodeByCountry,
} from '../../src/utils/searchInCountryArrayMethods';

describe('search in countries json', () => {
  it('should return code by country', () => {
    expect(getCodeByCountry('Germany')).toBe('DE');
    expect(getCountryByCode('DE')).toBe('Germany');
    expect(getCountryByPostalCode('16477')).toBe('Germany');
    expect(getPostalCodeByCountry('Germany')).toBe('16477');
  });
});
