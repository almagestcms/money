const { createMoney, money, RoundingMode } = require('./index');

describe('Money', () => {
  test('Should create a new money object', () => {
    const money = createMoney({
      amount: '123.5',
      currencyCode: 'USD',
    });
    expect(money.toString()).toEqual('123.5');
  });

  test('Should create a new money object by using copy constructor', () => {
    const base = createMoney({
      amount: '123.5',
      currencyCode: 'USD',
    });
    const money = createMoney(base);
    expect(money.toString()).toEqual('123.5');
  });

  test('Should round correctly', () => {
    const money = createMoney({
      amount: '123.55',
      currencyCode: 'USD',
    });
    expect(money.div(2).toString()).toEqual('61.78');
  });

  test('Should round correctly for zero decimal currency', () => {
    const money = createMoney({
      amount: '123',
      currencyCode: 'JPY',
    });
    expect(money.div(4).toString()).toEqual('31');
  });
  
  test('Should round correctly with round down', () => {
    const money = createMoney({
      amount: '123.55',
      currencyCode: 'USD',
      roundingMode: RoundingMode.RoundDown,
    });
    expect(money.div(2).toString()).toEqual('61.77');
  });

  test('Should return the sum of two money objects', () => {
    const money1 = createMoney({
      amount: '10.5',
      currencyCode: 'USD'
    });
    const money2 = createMoney({
      amount: '8.2',
      currencyCode: 'USD'
    });
    const sum = money1.plus(money2);
    expect(sum[money]).toBe(true);
    expect(sum.toString()).toEqual('18.7');
  });
});
