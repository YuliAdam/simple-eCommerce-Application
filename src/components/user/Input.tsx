export function Input({
  value,
  readonly,
  className,
}: {
  value: string;
  readonly: boolean;
  className: string;
}) {
  const props = {
    readOnly: readonly,
    className: className,
  };

  return (
    <>
      <input value={value} {...props} />
    </>
  );
}
