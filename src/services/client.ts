import { ctpClient } from './BuildClient';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { projectKey } from './apiEnv.ts';

// Create apiRoot from the imported ClientBuilder and include your Project key
export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});
