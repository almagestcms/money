const { createMoney, RoundingMode } = require('./index');

describe('Money', () => {
  test('Test basic construction', () => {
    const money = createMoney({
      amount: '123.5',
      currencyCode: 'USD',
    });
    expect(money.toString()).toEqual('123.5');
  });

  test('Test basic operation with rounding', () => {
    const money = createMoney({
      amount: '123.55',
      currencyCode: 'USD',
    });
    expect(money.div(2).toString()).toEqual('61.78');
  });

  test('Test zero decimal currency', () => {
    const money = createMoney({
      amount: '123',
      currencyCode: 'JPY',
    });
    expect(money.div(4).toString()).toEqual('31');
  });
  
  test('Test basic operation with round down', () => {
    const money = createMoney({
      amount: '123.55',
      currencyCode: 'USD',
      roundingMode: RoundingMode.RoundDown,
    });
    expect(money.div(2).toString()).toEqual('61.77');
  });
});
