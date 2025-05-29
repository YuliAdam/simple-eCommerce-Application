import type I_Product from './product';

export default interface I_ProductDetailed extends I_Product {
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
        attributes: {
          brand: {
            [key: string]: string;
          }[];
          size: {
            [key: string]: string;
          }[];
          color: {
            [key: string]: string;
          }[];
        };
      };
    };
  };
}
