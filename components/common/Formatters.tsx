interface DefaultPrecision {
  number: [number, number];
  currency: [number, number];
  cryptoCurrency: [number, number];
}

const defaultPrecision: DefaultPrecision = {
  number: [0, 20],
  currency: [0, 2],
  cryptoCurrency: [0, 18],
};

interface DefaultCurrencies {
  currency: string;
  cryptoCurrency: string;
}

const defaultCurrencies: DefaultCurrencies = {
  currency: 'USD',
  cryptoCurrency: 'USDT',
};

const defaultLocale = 'en-US';

interface DefaultDateFormatterOptions {
  full: Intl.DateTimeFormatOptions;
  dateOnly: Intl.DateTimeFormatOptions;
}

const defaultDateFormatterOptions: DefaultDateFormatterOptions = {
  full: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  },
  dateOnly: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
};

type IntlLocales = string | string[]

interface FormatNumber {
  value: number;
  locales?: IntlLocales;
  options?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
}

const formatNumber = ({
  value,
  locales,
  options,
  prefix,
  suffix,
}: FormatNumber) => {
  const numberFormatted = new Intl.NumberFormat(locales, options).format(value);

  return [prefix, numberFormatted, suffix].filter(Boolean)
    .join('');
};

export interface FormatDate {
  date: Date;
  locales?: IntlLocales;
  options?: Intl.DateTimeFormatOptions;
}

const formatDate = ({
  date,
  locales,
  options,
}: FormatDate) => new Intl.DateTimeFormat(locales, options).format(date);

export interface NumberFormatterProperties extends FormatNumber {
  precision?: [number, number];
}

export const NumberFormatter = ({
  locales = defaultLocale,
  precision = defaultPrecision.number,
  ...properties
}: NumberFormatterProperties) => {
  const [minimumFractionDigits, maximumFractionDigits] = precision;

  const options: Intl.NumberFormatOptions = {
    ...properties.options,
    minimumFractionDigits,
    maximumFractionDigits,
  };

  const formattedValue = formatNumber({
    locales,
    options,
    ...properties,
  });

  return {formattedValue};
};

type CurrencyType = Intl.NumberFormatOptions['currency']

export interface CurrencyFormatterProperties extends NumberFormatterProperties {
  currency?: CurrencyType;
}

export const CurrencyFormatter = ({
  locales = defaultLocale,
  precision = defaultPrecision.currency,
  currency = defaultCurrencies.currency,
  ...properties
}: CurrencyFormatterProperties) => {
  const [minimumFractionDigits, maximumFractionDigits] = precision;

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
    style: 'currency',
    currency,
  };

  const formattedValue = formatNumber({
    locales,
    options,
    ...properties,
  });

  return {formattedValue};
};

export interface CryptoCurrencyFormatterProperties
  extends NumberFormatterProperties {
  currency?: string;
}

export const CryptoCurrencyFormatter = ({
  locales = defaultLocale,
  precision = defaultPrecision.cryptoCurrency,
  currency = defaultCurrencies.cryptoCurrency,
  ...properties
}: CryptoCurrencyFormatterProperties) => {
  const [minimumFractionDigits, maximumFractionDigits] = precision;

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
    // @ts-expect-error wrong typescript version
    trailingZeroDisplay: 'stripIfInteger',
  };

  const formattedValue = formatNumber({
    locales,
    options,
    ...properties,
  });

  return (
    <>
      {formattedValue}
      {' '}
      {currency}
    </>
  );
};

export const DateFormatter = ({
  date,
  locales = defaultLocale,
  options = defaultDateFormatterOptions.full,
}: FormatDate) => {
  const formattedDate = formatDate({
    date,
    locales,
    options,
  })
    .replaceAll(
      '/',
      '-',
    );

  return {formattedDate};
};

export const formatChipDate = (dateString: string): string => {
  const date = new Date(dateString);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;

  const minutesString = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${month} ${hours}:${minutesString}${ampm} UTC`;
};
