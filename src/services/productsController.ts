import { apiRoot } from './client';

export const getProducts = async () => {
  try {
    return await apiRoot.products().get().execute();
  } catch (err) {
    console.log(err);
  }
};

export const getCatregories = async () => {
  try {
    return await apiRoot.categories().get().execute();
  } catch (err) {
    console.log(err);
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    return await apiRoot
      .products()
      .get({
        queryArgs: {
          where: `masterData(current(categories(id in ("${categoryId}"))))`,
        },
      })
      .execute();
  } catch (err) {
    console.log(err);
  }
};
