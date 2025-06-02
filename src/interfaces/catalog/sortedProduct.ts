export default interface I_SortedProduct {
  description?: {
    ['en-GB']?: string;
  };
  id: string;
  name?: {
    ['en-GB']?: string;
  };
  masterVariant: {
    attributes?: {
      name: string;
      value: {
        key: string;
        label: string;
      };
    }[];
    images?: {
      url?: string;
      label?: string;
    }[];
    prices?: {
      discounted?: {
        value?: {
          centAmount: number;
          currencyCode: string;
          fractionDigits: number;
        };
      };
      value?: {
        centAmount: number;
        currencyCode: string;
        fractionDigits: number;
      };
    }[];
  };
  variants?: {
    attributes?: {
      name: string;
      value: {
        key: string;
        label: string;
      };
    }[];
  }[];
}
