/**
 *
 * Main entry file
 *
 *
 */

// dependencies
const aks = require("./lib/aks_test");

// test number to test this module
// defaulted to 7 if not provided in command line
const TEST_NUMBER = process.env.TEST_NUMBER || 7;

// start tracking execution time
console.time("execution time");

const isPrime = aks.checkIfPrime(TEST_NUMBER);
console.log(`${TEST_NUMBER} is prime: ${isPrime}`);

// end tracking execution time
console.timeEnd("execution time");
