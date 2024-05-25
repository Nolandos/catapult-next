export const cutAddress = (address: string) => (`${address.slice(0, 6)}...${address.slice(-4)}`);
export const cutDecimals = (value: string, decimals: number): string => {
  const [integer, decimal] = value.split('.');
  const _integer = integer.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (decimal) {
    return `${_integer}.${decimal.slice(0, decimals)}`;
  }
  return _integer;
};
