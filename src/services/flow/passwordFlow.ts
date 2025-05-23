import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { PasswordAuthMiddlewareOptions } from '@commercetools/ts-client';
import { ClientBuilder } from '@commercetools/ts-client';
import { authUrl, clientId, clientSecret, projectKey, scopes } from '../apiEnv';
import { httpMiddlewareOptions } from '../BuildClient';
import { TokenState } from '../token/tokenCache';

export function withPasswordFlow(username: string, password: string): ByProjectKeyRequestBuilder {
  const tokenCache = new TokenState();
  const options: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret,
      user: {
        username,
        password,
      },
    },
    scopes: scopes, // FIX: only passwordFlow scope with split()
    tokenCache,
    httpClient: fetch,
  };

  const ctpClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: projectKey,
  });
}
