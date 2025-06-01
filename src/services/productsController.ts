import { apiRoot } from './client';

export const getProducts = async ({ categoryId = null }: { categoryId?: string | null } = {}) => {
  try {
    if (categoryId) {
      return await apiRoot
        .products()
        .get({
          queryArgs: {
            where: `masterData(current(categories(id in ("${categoryId}"))))`,
          },
        })
        .execute();
    } else {
      return await apiRoot.products().get().execute();
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCategories = async () => {
  try {
    return await apiRoot.categories().get().execute();
  } catch (err) {
    console.log(err);
  }
};

export const getSortedProducts = async ({
  categoryId,
  sortByPrice,
  sortByName,
}: {
  categoryId?: string | null;
  sortByPrice?: string | null;
  sortByName?: string | null;
} = {}) => {
  const filterOptions = `categories.id:"${categoryId}"`;
  const sortByPriceOptions = `price ${sortByPrice}`;
  const sortByNameOptions = `name.en-GB ${sortByName}`;

  const options: { [key: string]: string[] } = {};

  const sortOptions = [];

  if (categoryId) {
    options.filter = [filterOptions];
  }

  if (sortByPrice) {
    sortOptions.push(sortByPriceOptions);
  }

  if (sortByName) {
    sortOptions.push(sortByNameOptions);
  }

  if (sortOptions.length > 0) {
    options.sort = sortOptions;
  }

  try {
    return await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: options,
      })
      .execute();
  } catch (err) {
    console.log(err);
  }
};

export const getProductsBySearch = async (text: string) => {
  try {
    return await apiRoot
      .productProjections()
      .suggest()
      .get({
        queryArgs: {
          'searchKeywords.en-GB': text,
          fuzzy: true,
        },
      })
      .execute();
  } catch (err) {
    console.log(err);
  }
};
