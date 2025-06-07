export function Dot({ stroke }: { stroke?: string[] | string }) {
  function setStroke() {
    const baseColor = Array.isArray(stroke) ? (stroke[0] ?? '') : stroke;
    if (baseColor === 'white') return '#F2F2F2';
    return baseColor;
  }

  return (
    <svg
      style={{
        border: '1px solid #ccc',
        borderRadius: '100%',
        cursor: 'pointer',
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={setStroke()}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{stroke}</title>
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>
  );
}
