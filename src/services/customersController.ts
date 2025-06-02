import type { CustomerUpdateAction, MyCustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import type { ILoginParams } from '@/interfaces/types';
import { withPasswordFlow } from './flow/passwordFlow';

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
    return await withPasswordFlow(body.email, body.password)
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

export async function getCustomer(id: string) {
  try {
    return await apiRoot.customers().withId({ ID: id }).get().execute();
  } catch (err) {
    if (err instanceof Error) return err;
  }
}

export async function updateCustomer(version: number, actions: CustomerUpdateAction[], id: string) {
  console.log(actions);
  return await apiRoot
    .customers()
    .withId({
      ID: id,
    })
    .post({
      body: {
        version,
        actions,
      },
    })
    .execute();
}

export async function updatePassword(
  id: string,
  version: number,
  currentPassword: string,
  newPassword: string,
) {
  return await apiRoot
    ?.customers()
    .password()
    .post({
      body: {
        id,
        version,
        currentPassword,
        newPassword,
      },
    })
    .execute();
}

export async function verifyCustomerPassword(id: string, version: number, currentPassword: string) {
  const newPassword = currentPassword;
  return await apiRoot
    ?.customers()
    .password()
    .post({
      body: {
        id,
        version,
        currentPassword,
        newPassword,
      },
    })
    .execute();
}
