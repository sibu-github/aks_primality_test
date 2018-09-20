/**
 *
 *
 * This module implements the AKS Primality Test
 * using Pascal's Triangle to calculate the coefficients of the Polynomial expansion.
 * NOTE: the sign of the coefficients are ignored in this implementation
 * as sign is not important in order to check AKS Test.
 *
 *
 */

// declare the module object
const aks = {};

/**
 * Generates the coefficients of the polynomial expansion using Pascal's Triangle method
 */
aks.generateCoeffs = number => {
  // initialize the coeffs array with 1 which correspond to power 0.
  let coeffs = [1];

  for (let i = 1; i <= number; i++) {
    // in each iteration we will add 1 in front of the array
    // and rest of the numbers in the array will be replaced by the
    // addition of that number and the subsequent number,
    // last number will be left as it is as it does not have any subsequent number
    coeffs.unshift(1);
    for (let j = 1; j < coeffs.length - 1; j++) {
      coeffs[j] = coeffs[j] + coeffs[j + 1];
    }
  }
  return coeffs;
};

/**
 * checks if any given number is prime or not and returns true or false accordingly
 */
aks.checkIfPrime = number => {
  // get the coeffs array first
  const coeffs = aks.generateCoeffs(number);

  // check if all numbers in the array are divisible by the given number
  // only first and last number are excused
  for (let i = 1; i < coeffs.length - 1; i++) {
    if (coeffs[i] % number !== 0) {
      return false;
    }
  }
  return true;
};

// export the module
module.exports = aks;
