import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
  type TokenCache,
} from '@commercetools/ts-client';

import { projectKey, authUrl, apiUrl, clientId, clientSecret } from '@/services/apiEnv';

const anonymousScopes = [
  `view_products:${projectKey}', 'create_anonymous_token:${projectKey}', 'view_categories:${projectKey}', 'view_project_settings:${projectKey}`,
];

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
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
    anonymousId: id,
  },
  scopes: anonymousScopes,
  httpClient: fetch,
  tokenCache,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  httpClient: fetch,
};

// Export the ClientBuilder
export const anonymousCtpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();
