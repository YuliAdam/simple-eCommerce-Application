export default function formatPrice(price: number, fractionDigits: number = 2) {
  return (price / 100).toFixed(fractionDigits);
}
