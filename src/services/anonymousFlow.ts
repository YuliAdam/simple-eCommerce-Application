import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
  type TokenCache,
} from '@commercetools/ts-client';

import { projectKey, authUrl, apiUrl, clientId, clientSecret, scopes } from '@/services/apiEnv';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// anonymousId
export function getAnonymousId() {
  let id = localStorage.getItem('anonymousId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('anonymousId', id);
  }
  console.log(id);
  return id;
}

const id = getAnonymousId();

// tokenCache
const tokenCache: TokenCache = {
  get: () => {
    const token = localStorage.getItem('anonymousToken');
    console.log('LocalStorage got anonymousToken:', token);
    return token ? JSON.parse(token) : null;
  },
  set: token => {
    console.log('LocalStorage set anonymousToken:', token);
    localStorage.setItem('anonymousToken', JSON.stringify(token));
  },
};

// Configure authMiddlewareOptions
const anonymousAuthMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
    anonymousId: id,
  },
  scopes,
  httpClient: fetch,
  tokenCache,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  scopes,
  httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

// Export the ClientBuilder
export const anonymousCtpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export const apiRootAnonymous = createApiBuilderFromCtpClient(anonymousCtpClient).withProjectKey({
  projectKey: projectKey,
});
