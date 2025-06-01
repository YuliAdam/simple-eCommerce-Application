export default interface I_SortProps {
  handleSortPriceButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortPrice: string | null;
  handleSortNameButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortName: string | null;
}
