const axios = require('axios');
const money = require('money');

const RATES_URL = 'https://api.exchangeratesapi.io/latest'; //url that contains the rates of currencies updated in real time
const BLOCKCHAIN_URL = 'https://blockchain.info/ticker';   //url that contains the rates of bitcion to fiat currencies updated in real time
const CURRENCY_BITCOIN = 'BTC';  //name of the bitcoin currency

/**
 * tells if there is btc among converted currencies
 * @param {String} from - base currency
 * @param {String} to - target currency
 */
const isAnyBTC = (from, to) => [from, to].includes(CURRENCY_BITCOIN); //function that determines if bitcoin is among currencies being converted

/**
* converts money from one currency to another
* @param {list} opts - an amount, a base currency and a target currency
*/
module.exports = async opts => {															   
  const {amount = 1, from = 'USD', to = CURRENCY_BITCOIN} = opts;
  const promises = [];
  let base = from;

  const anyBTC = isAnyBTC(from, to);

  if (anyBTC) {															//checks if bitcoin is among the currencies being converted and if it is 
    base = from === CURRENCY_BITCOIN ? to : from; //base = what isn't equal to btc
    promises.push(axios(BLOCKCHAIN_URL)); //add the result of a get request to btc rates url to a list 
  }

  promises.unshift(axios(`${RATES_URL}?base=${base}`)); //adds the result of a get request to a list

  try {
    const responses = await Promise.all(promises);  //responses of the get requests previously put in a promise list
    const [rates] = responses; 

    money.base = rates.data.base; //name of the base currency
    money.rates = rates.data.rates; //rates from the base to various targets

    const conversionOpts = {
      from,
      to
    };

    if (anyBTC) { //if there is BTC among currencies being converted, add btc rate to money.rates
      const blockchain = responses.find(response => 
        response.data.hasOwnProperty(base)
      );

      Object.assign(money.rates, { //adds BTC to the rates
        'BTC': blockchain.data[base].last
      });
    }
    if (anyBTC) { //reverses 'from' and 'to' if btc is among currencies being traded because BTC in money.rates is the amount of btc is worth in 'base' currency
      Object.assign(conversionOpts, {
        'from': to,
        'to': from
      });
    }
	console.log(money.rates)

    return money.convert(amount, conversionOpts); 
  } catch (error) {
    throw new Error (
      '💵 Please specify a valid `from` and/or `to` currency value!'
    );
  }
};




