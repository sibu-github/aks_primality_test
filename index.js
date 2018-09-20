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

if (TEST_NUMBER < 51) {
  // check if the test number is prime
  const isPrime = aks.checkIfPrime(TEST_NUMBER);
  console.log(`${TEST_NUMBER} is prime: ${isPrime}`);
} else {
  console.log(
    "Please test with numbers less than 50. Otherwise the coefficients in the polynomial expansion get too big for node js to handle."
  );
}

// end tracking execution time
console.timeEnd("execution time");
