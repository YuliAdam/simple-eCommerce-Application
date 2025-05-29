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
      };
    };
  };
}
