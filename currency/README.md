# Currency 
index.js contains a single function that uses money.js and 2 websites to convert an amount from a base currency to a target currency,
it requests rates of fiat currencies from 'https://api.exchangeratesapi.io/latest'  and if one of the currencies being traded is BTC, index.js
requests the rate from fiat to btc from 'https://blockchain.info/ticker', then the function uses money.convert to convert from the base currency to the target.