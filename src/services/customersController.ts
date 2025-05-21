import type { MyCustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import type { ILoginParams } from '@/interfaces/types';

export async function createCustomer(body: MyCustomerDraft) {
  try {
    return await apiRoot
      .me()
      .signup()
      .post({
        body: body,
      })
      .execute();
  } catch (err) {
    if (err instanceof Error) return err;
  }
}

export async function loginCustomer(body: ILoginParams) {
  try {
    return await apiRoot
      .me()
      .login()
      .post({
        body: body,
      })
      .execute();
  } catch (err) {
    if (err instanceof Error) return err;
  }
}
