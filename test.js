const { createCurrency, RoundingMode } = require('./index');

describe('Currency', () => {
  test('Test basic construction', () => {
    const USD = createCurrency();
    expect(USD('123.5').toString()).toEqual('123.5');
  });

  test('Test basic operation with rounding', () => {
    const USD = createCurrency();
    expect(USD('123.55').div(2).toString()).toEqual('61.78');
  });

  test('Test zero decimal currency', () => {
    const JPY = createCurrency({ code: 'JPY' });
    expect(JPY('123').div(4).toString()).toEqual('31');
  });
  
  test('Test basic operation with round down', () => {
    const USD = createCurrency({ roundingMode: RoundingMode.RoundDown });
    expect(USD('123.55').div(2).toString()).toEqual('61.77');
  });
});
