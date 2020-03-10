#!/usr/bin/env node

const currency = require('./');
const ora = require('ora');

const argv = process.argv.slice(2);

function help () {
  console.log(
    [
      '',
      '  Example',
      '    ❯ currency 1650 dkk eur',
      '    1650 DKK = 220.79486154 EUR',
      '',
      '  See README.md for detailed usage.'
    ].join('\n')
  );
}

const spinner = ora('Fetching exchange data..'); //message used while the api fetches data

async function start (opts) { 										//function that converts an amount from a currency to another
  try {
    const {amount, from, to} = opts; 							//opts contains amount, from and to which are respectively an amount and two types of currency
    const result = await currency(opts); 						//result is the amount converted to the target currency

    spinner.stop(); 														//this indicates that the request has gotten a conclusive answer and the loading message is no longer displayed 
    console.log(`${amount} ${from} = ${result} ${to}`); 	//this displays "amount in original currency = amount in target currency"
  } catch (error) { 														//block of code to which the function jumps if there is an error
    spinner.stop(); 														//stops displaying the loading message
    console.log(error); 													//displays an error message
    process.exit(1);														//function exits with error code 1
  }
}

if (argv.indexOf('--help') !== - 1) {								//block of code that gets used if the user wants help
  help();
  process.exit(0);
}

spinner.start();

const opts = {
  'amount': argv[0] || 1,
  'from': (argv[1] || 'USD').toUpperCase(),
  'to': (argv[2] || 'BTC').toUpperCase()
};

start(opts);
