import {UNICODE_CHARS} from '@/utils/enums.common';

export const cutAddress = (address: string) => (`${address.slice(0, 6)}...${address.slice(-4)}`);
export const cutDecimals = (value: string, decimals: number): string => {
  const [integer, decimal] = value.split('.');
  const _integer = integer.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (decimal) {
    return `${_integer}.${decimal.slice(0, decimals)}`;
  }
  return _integer;
};

export const addressShortener = (address: string, from = [0, 5], to = -4) => {
  const {
    horizontalEllipsis,
    enDash,
  } = UNICODE_CHARS;

  const [fromStart, fromEnd] = from;

  const startPart = address.slice(fromStart, fromEnd);
  const endPart = address.slice(to);
  return address ? `${startPart}${horizontalEllipsis}${endPart}` : enDash;
};
