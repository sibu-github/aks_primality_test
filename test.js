/**
 * test aks test implementation
 */
let knownPrimes = [2, 3];
let next = 4;

const aks = require("./lib/aks_test");

const isPrime = n => {
  for (let i = 0; i < knownPrimes.length; i++) {
    if (n % knownPrimes[i] === 0) {
      return false;
    }
  }
  knownPrimes.push(n);
  return true;
};

while (next) {
  console.log({ next });
  const aksTest = aks.checkIfPrime(next);
  const prime = isPrime(next);
  if (aksTest !== prime) {
    console.log({ aksTest, prime, next });
    break;
  }
  next++;
}
