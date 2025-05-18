import { shop } from '@/config/localStorageConfig';
import type { TokenCache, TokenStore } from '@commercetools/ts-client';

export class TokenState implements TokenCache {
  private cachedToken: TokenStore;

  constructor() {
    this.cachedToken = {
      token: '',
      refreshToken: '',
      expirationTime: 0,
    };

    const storedToken = localStorage.getItem(shop.client_token);
    if (storedToken) {
      try {
        this.cachedToken = JSON.parse(storedToken);
      } catch (error) {
        console.log('failed parse storedToken:', error);
      }
    }
  }

  public set(newCache: TokenStore): void {
    this.cachedToken = newCache;
    localStorage.setItem(shop.client_token, JSON.stringify(this.cachedToken));
  }

  public get(): TokenStore {
    return this.cachedToken;
  }

  public clear(): void {
    this.cachedToken = {
      token: '',
      refreshToken: '',
      expirationTime: 0,
    };
    localStorage.removeItem(shop.client_token);
  }
}
