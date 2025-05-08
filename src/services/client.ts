import { ctpClient } from './BuildClient';
import type { ClientResponse, Project } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from './constantData';

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
export const getProject = (): Promise<ClientResponse<Project>> => {
  console.log(apiRoot);
  console.log(ctpClient);
  return apiRoot.get().execute();
};
