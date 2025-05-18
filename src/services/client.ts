import { ctpClient } from '@/services/BuildClient.ts';
import type { ClientResponse, Project } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from './apiEnv.ts';
import type { Client } from '@commercetools/ts-client';

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
export const getProject = (): Promise<ClientResponse<Project>> => {
  return apiRoot.get().execute();
};

// Утилита для создания клиента. Передаем при вызове функции настройки, например, ctpClient из BuildClient.ts и дальше используем apiRoot.
export function setApiRoot(client: Client) {
  const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
    projectKey: projectKey,
  });
  return apiRoot;
}
