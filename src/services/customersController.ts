import type { ClientResponse, CustomerSignInResult } from '@commercetools/platform-sdk';
import { apiRoot } from './client';

const customerDraft = {
  email: 'yuli3@example.com',
  firstName: 'Yuli',
  lastName: 'Adam',
  password: 'secret123',
};

export function createCustomers(): Promise<Error | ClientResponse<CustomerSignInResult>> {
  return apiRoot
    .me()
    .signup()
    .post({
      body: customerDraft,
    })
    .execute()
    .catch((err: Error) => err);
}
