const nock = require('nock');
const axios = require('axios');
const currency = require('./');
beforeEach(() => {
  nock('https://api.exchangeratesapi.io')
    .get('/latest?base=USD')
    .reply(200, {
      'base': 'USD',
      'rates': {
        'EUR': 0.899
      }
    });

  nock('https://api.exchangeratesapi.io')
    .get('/latest?base=EUR')
    .reply(200, {
      'base': 'EUR',
      'rates': {
        'USD': 1.1122
      }
    });

  nock('https://blockchain.info')
    .get('/ticker')
    .reply(200, {
      'USD': {
        '15m': 8944.49,
        'last': 8944.49,
        'buy': 8944.49,
        'sell': 8944.49,
        'symbol': '$'
      },
      'EUR': {
        '15m': 8048.11,
        'last': 8048.11,
        'buy': 8048.11,
        'sell': 8048.11,
        'symbol': '€'
      }
    });
});

test('convert 1 USD to EUR', async () => {
  const opts = {'amount':1, 'from':('USD'), 'to':('EUR')};
  const result = await currency(opts);
  expect(result).toBe(0.899);
});

test('convert 1 USD to USD', async () => {
	const opts = {'amount':1, 'from':('USD'), 'to':('USD')};
    const result = await currency(opts);
    expect(result).toBe(1);
});

test('convert 1 EUR to USD', async () => {
	const opts = {'amount':1, 'from':('EUR'), 'to':('USD')};
    const result = await currency(opts);
    expect(result).toBe(1.1122);
});

test('convert 1 BTC to USD', async () => {
    const opts = {'amount':1, 'from':('BTC'), 'to':('USD')};
    const result = await currency(opts);
    expect(result).toBe(8944.49);});

test('convert 1 BTC to EUR', async () => {
	const opts = {'amount':1, 'from':('BTC'), 'to':('EUR')};
    const result = await currency(opts);
    expect(result).toBe(8048.11);
});

test('convert without arguments', async () => {
	const opts = {};
	const a = (1/8944.49); //opts is set to 1 from USD to BTC by default
    const result = await currency(opts);
    expect(result).toBe(a);
});

test('convert with amount only', async () => {
	const opts = {'amount':1};
	const a = (1/8944.49); //from and to are set to btc and usd by default
    const result = await currency(opts);
    expect(result).toBe(a);
});

test('convert with amount and (from) currency only', async () => {
	const opts = {'amount':1, 'from': 'EUR'};
	const a = (1/8048.11); //to is set to bitcoin by default
    const result = await currency(opts);
    expect(result).toBe(a);
});

test('convert without a correct `from` or `to` currency value', async () => {
	const opts = {'amount':1, 'from': 'AAA', 'to':'BBB'};
    const a = (('💵 Please specify a valid `from` and/or `to` currency value!');
	const result = await currency(opts);
    expect(result).toBe(a);
});
