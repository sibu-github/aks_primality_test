/**
 *
 *
 * This module implements the AKS Primality Test
 *
 *
 */

// dependecies
const BigNumber = require("big-number");

// container for this module
const aks = {};

/**
 * calculate gcd of two numbers
 * using Euclid's Algoritm
 */
aks.gcd = (a, b) => {
  if (b === 0) {
    return a;
  }
  return aks.gcd(b, a % b);
};

/**
 * calculate multiplicative order of n modulo r
 * i.e for some k > 0, n^k = 1 (mod r)
 * NOTE: using the BigNumber here because a number raises
 * to the power of another number could easily result in
 * very big number and exceed Number.MAX_SAFE_INTEGER, e.g - 31^28
 */
aks.ordr = (r, n) => {
  for (let i = 1; true; i++) {
    const mod = BigNumber(n)
      .pow(i)
      .mod(r);
    if (Number(mod) === 1) {
      return i;
    }
  }
};

/**
 * find the smallest r such that ordr(r, n) > (log2 n)^2
 */
aks.findSmallestR = n => {
  const log2n = Math.log2(n) * Math.log2(n);
  let r = 2;
  while (r) {
    // skip the iteration if r is not coprime to n
    if (aks.gcd(r, n) === 1 && aks.ordr(r, n) > log2n) {
      return r;
    }
    r++;
  }
};

/**
 * Euler's totient function
 * for a given number n, how many numbers less than n are relatively prime
 */
aks.phi = n => {
  let count = 0;
  for (let i = 1; i < n; i++) {
    if (aks.gcd(i, n) === 1) {
      count++;
    }
  }
  return count;
};

/**
 * Implements numpy's convolve function which is equivalent to
 * polynomial multiplication.
 * Ex:- to find (X^2+2X+1) x (X+1)
 * input vectors are [1,2,1], [1,1]
 * resulting vector [1,3,3,1]
 */
aks.convolve = (volume, kernel) => {
  const volumeLength = volume.length;
  const kernelLength = kernel.length;

  // return empty vector if any of the vector is empty
  if (!volumeLength || !kernelLength) {
    return [];
  }

  let displacement = 0;
  const convVec = [];

  for (let i = 0; i < volume.length; i++) {
    for (let j = 0; j < kernel.length; j++) {
      if (displacement + j !== convVec.length) {
        convVec[displacement + j] =
          convVec[displacement + j] + volume[i] * kernel[j];
      } else {
        convVec.push(volume[i] * kernel[j]);
      }
    }
    displacement++;
  }

  return convVec;
};

/**
 * calculates the mod n of each term in the vector and returns the resulting vector
 */
aks.modN = (vec, n) => {
  return vec.map(v => v % n);
};

/**
 *
 * compute the polynomial vector for (x + a)^n (mod n)
 * NOTE: here we are taking mod n at each step after polynomial multiplication
 * because as per AKS algorithm, we have to take mod n of (x + a)^n. By taking mod n
 * at each step we are making sure the terms are not geting bigger and bigger at each step,
 * also the result will always be same because of the transitivity property of congruences
 *
 */
aks.polyModN = (a, n) => {
  let x = [a, 1]; // initializing x to power 1, i.e (x + a)
  let res = [1]; // initializing res to power 0, i.e (x^0)
  let counter = n;
  while (counter > 0) {
    if (counter & 1) {
      res = aks.convolve(res, x);
      res = aks.modN(res, n);
    }
    x = aks.convolve(x, x);
    x = aks.modN(x, n);
    // divide counter by 2 in each step
    counter >>= 1;
  }
  return res;
};

/**
 *
 * calculates the polynomial remainder for a given polynomial
 * of the form (x + a)^n (mod x^r - 1).
 * The trick here is to move the term from position >= r to position % r
 * and add the all terms in all positions
 * Ex:- Lets say n = 5 , r = 2, so resulting vector will be of length 2.
 * (x + 1)^5 = [1, 5, 10, 10, 5, 1]
 *  so the terms will be arranged like below -
 *  1   5   10  10  5   1
 *  -----------------------
 *  1   5
 *  10  10
 *  5   1
 * ---------------------------
 * 16   16
 * After adding all terms resulting vector will be [16, 16]
 *
 */

aks.polyRemainder = (poly, r) =>
  poly.reduce((res, p, i) => {
    if (i < r) {
      res.push(p);
      return res;
    } else {
      res[i % r] += p;
      return res;
    }
  }, []);

/**
 * For a given integer a checks the polynomial mod of
 * (x + a)^n  = (x^n + a) [mod (x^r - 1), n],
 * if both sides are not congruent then returns false.
 * NOTE: (x^n + a)[mod (x^r - 1)] will always be of the form - a + x^(n%r)
 * Ex:- (x^5 + 1) [mod(x^2 - 1)] = x + 1
 * We will check here ((x + a)^n - (x^n + a)) = 0 [mod (x^r - 1), n]
 */
aks.checkPolyMod = (a, n, r) => {
  const poly = aks.polyModN(a, n);
  let remainder = aks.polyRemainder(poly, r);
  remainder[n % r] -= 1;
  remainder[0] -= a;
  return remainder.every(t => t % n === 0);
};

/**
 * Checks whether a given number is Prime or not
 * using AKS algorithm
 */

aks.checkIfPrime = n => {
  // if n < 2 then raise Invalid input error
  if (n < 2) {
    throw new Error("Value Error: Expected input greater than 2");
  }

  /**
   * Step 1, check if n = a^b a>1, b>1
   */

  const upperBound = Math.log2(n);
  for (let a = 2; a <= upperBound; a++) {
    for (let b = 2; b < n; b++) {
      const temp = a ** b;
      // no need to check for any higher power of a
      // if a^b is already higher than n
      // break inner loop in that case
      if (temp > n) {
        break;
      }

      // if a^b = n then return Composite
      if (temp === n) {
        return false;
      }
    }
  }

  /**
   * Step 2, Find the smallest r such that ordr(n) > (log2 n)^2
   */
  const r = aks.findSmallestR(n);
  // console.log({ r });

  /**
   *
   * Step 3, If 1 < gcd(a,n) < n for some a <= r, output composite.
   *
   */
  for (let a = r; a > 1; a--) {
    const gcd = aks.gcd(a, n);
    if (1 < gcd && gcd < n) {
      return false;
    }
  }

  /**
   * Step 4, If n <= r, output prime.
   */
  if (n <= r) {
    return true;
  }

  /**
   * Step 5, check for polynomial mod
   * for a = 1 to [floor(sqrt(phi(n)) * logn)]
   * if (x + a)^n != x^n + a (mod x^r - 1, n) then output composite
   * if above condition is false for all a then n must be prime
   */

  const max = Math.floor(Math.sqrt(aks.phi(r)) * Math.log2(n));
  for (let a = 1; a <= max; a++) {
    if (!aks.checkPolyMod(a, n, r)) {
      return false;
    }
  }

  /**
   * Step 6, return Prime if all condition satisfied
   */
  return true;
};

// export the module
module.exports = aks;
