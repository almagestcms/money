const Big = require('big.js');

const RoundingMode = exports.RoundingMode = {
  RoundDown: 0, // Rounds towards zero. I.e. truncate, no rounding.
  RoundHalfUp: 1, // Rounds towards nearest neighbour. If equidistant, rounds away from zero.	
  RoundHalfEven: 2, // Rounds towards nearest neighbour. If equidistant, rounds towards even neighbour.
  RoundUp: 3, // Rounds away from zero.
};

const currencyCodeToMinorUnits = exports.currencyCodeToMinorUnits = {
  AED: 2,
  AFN: 2,
  ALL: 2,
  AMD: 2,
  ANG: 2,
  AOA: 2,
  ARS: 2,
  AUD: 2,
  AWG: 2,
  AZN: 2,
  BAM: 2,
  BBD: 2,
  BDT: 2,
  BGN: 2,
  BIF: 0,
  BMD: 2,
  BND: 2,
  BOB: 2,
  BRL: 2,
  BSD: 2,
  BWP: 2,
  BZD: 2,
  CAD: 2,
  CDF: 2,
  CHF: 2,
  CLP: 0,
  CNY: 2,
  COP: 0,
  CRC: 2,
  CVE: 2,
  CZK: 2,
  DJF: 0,
  DKK: 2,
  DOP: 2,
  DZD: 2,
  EGP: 2,
  ETB: 2,
  EUR: 2,
  FJD: 2,
  FKP: 2,
  GBP: 2,
  GEL: 2,
  GIP: 2,
  GMD: 2,
  GNF: 0,
  GTQ: 2,
  GYD: 2,
  HKD: 2,
  HNL: 2,
  HRK: 2,
  HTG: 2,
  HUF: 0,
  IDR: 2,
  ILS: 2,
  INR: 2,
  ISK: 2,
  JMD: 2,
  JPY: 0,
  KES: 2,
  KGS: 2,
  KHR: 2,
  KMF: 0,
  KRW: 0,
  KYD: 2,
  KZT: 2,
  LAK: 2,
  LBP: 2,
  LKR: 2,
  LRD: 2,
  LSL: 2,
  MAD: 2,
  MDL: 2,
  MGA: 1,
  MKD: 2,
  MMK: 2,
  MNT: 2,
  MOP: 2,
  MRO: 2,
  MUR: 2,
  MVR: 2,
  MWK: 2,
  MXN: 2,
  MYR: 2,
  MZN: 2,
  NAD: 2,
  NGN: 2,
  NIO: 2,
  NOK: 2,
  NPR: 2,
  NZD: 2,
  PAB: 2,
  PEN: 2,
  PGK: 2,
  PHP: 2,
  PKR: 2,
  PLN: 2,
  PYG: 0,
  QAR: 2,
  RON: 2,
  RSD: 2,
  RUB: 2,
  RWF: 0,
  SAR: 2,
  SBD: 2,
  SCR: 2,
  SEK: 2,
  SGD: 2,
  SHP: 2,
  SLL: 2,
  SOS: 2,
  SRD: 2,
  STD: 2,
  SZL: 2,
  THB: 2,
  TJS: 2,
  TOP: 2,
  TRY: 2,
  TTD: 2,
  TWD: 0,
  TZS: 0,
  UAH: 2,
  UGX: 0,
  USD: 2,
  UYU: 0,
  UZS: 2,
  VND: 0,
  VUV: 0,
  WST: 2,
  XAF: 0,
  XCD: 2,
  XOF: 0,
  XPF: 0,
  YER: 2,
  ZAR: 2,
  ZMW: 2
};

exports.createCurrency = ({ code = 'USD', roundingMode = RoundingMode.RoundHalfUp } = {}) => {
};

const money = exports.money = Symbol('money');

const createMoney = exports.createMoney = ({
  amount = '0', // string or number or Big
  currencyCode = 'USD',
  roundingMode = RoundingMode.RoundHalfUp,
}) => {
  const getBig = (n) => {
    const minorUnits = currencyCodeToMinorUnits[currencyCode];
    if (typeof minorUnits !== 'number') throw Error(`Currency code (value: ${currencyCode}) is not supported.`);
    const big = Big();
    big.DP = minorUnits;
    big.RM = roundingMode;
    return big(n);
  };
  
  const toBig = (n) => {
    switch (true) {
      case (typeof n === 'number'):
      case (typeof n === 'string'):
        return getBig(n);
      case (typeof n === 'object' && n instanceof Big):
        return n;
      case (typeof n === 'object' && n[money]):
        if (n.currencyCode !== currencyCode) throw new Error(`Currency codes do not match.`);
        return n.toBig();
      default:
        throw new Error(`Input value must a number, a string, a Big object, or created using createMoney.`);
    }
  }

  const value = getBig(amount);

  const uniaryOps = ['abs', 'sqrt'];
  const binaryOps = ['div', 'minus', 'mod', 'plus', 'times'];
  const relationalOps = ['cmp', 'eq', 'gt', 'gte', 'lt', 'lte'];
  const castingOps = ['toExponential', 'toFixed', 'toNumber', 'toPrecision', 'toString'];

  const toString = () => JSON.stringify({ amount: value.toString(), currencyCode });

  return new Proxy(
    {
      [money]: true,
      [Symbol.toStringTag]: () => toString(),
      [Symbol.toPrimitive]: (hint) => {
        if (hint === 'number') return value.toNumber();
        else if (hint === 'string') return toString();
        else return toString();
      },
      get amount() {
        return value.toString();
      },
      currencyCode,
    },
    {
      get: function (target, prop) {
        switch (true) {
          case uniaryOps.includes(prop):
            return () => createMoney({
              amount: value[prop](),
              currencyCode,
              roundingMode,
            });
          case binaryOps.includes(prop):
            return (n) => createMoney({
              amount: value[prop](toBig(n)),
              currencyCode,
              roundingMode,
            });
          case relationalOps.includes(prop):
            return n => value[prop](toBig(n));
          case castingOps.includes(prop):
            return (...args) => value[prop](...args);
          case prop === 'pow':
            return (n) => createMoney({
              amount: value[prop](n),
              currencyCode,
              roundingMode
            });
          case prop === 'toJSON':
            return () => ({
              amount: value.toString(),
              currencyCode,
            });
          case prop === 'toBig':
            return () => toBig(value);
          default:
            return Reflect.get(...arguments);
        }
      }
    }
  );
};
