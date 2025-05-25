export default interface I_Product {
  id: string;
  masterData: {
    current: {
      description?: {
        [key: string]: string;
      };
      name?: {
        [key: string]: string;
      };
      masterVariant: {
        images?: {
          url?: string;
          label?: string;
        }[];
        prices?: {
          discounted?: {
            value?: I_Prices;
          };
          value?: I_Prices;
        }[];
      };
    };
  };
}

interface I_Prices {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}
