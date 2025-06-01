export default interface I_SortedProduct {
  description?: {
    ['en-GB']?: string;
  };
  id: string;
  name?: {
    ['en-GB']?: string;
  };
  masterVariant: {
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
}
