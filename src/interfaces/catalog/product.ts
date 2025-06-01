export default interface I_Product {
  id: string;
  masterData: {
    current: {
      description?: {
        ['en-GB']?: string;
      };
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
    };
  };
}
