
// Logic Verification for Addiction Calculator

// Inputs
const nonAddictLifeExpectancy = 79.68;
const ageStarted = 20;
const timesUsedPerDay = 10;
const lifeLostPerDoseMin = 14.1;

// 1. Calculate Loss Per Dose in Years
// 14.1 min / (60 * 24 * 365.25)
const lossPerDoseYears = lifeLostPerDoseMin / (60 * 24 * 365.25);
console.log("Loss Per Dose (Years):", lossPerDoseYears);

// 2. R = Loss per day in years
const R = lossPerDoseYears * timesUsedPerDay;
console.log("R (Loss per day in years):", R);

// 3. Formula: L_addict = (L_base + Age_start * R) / (1 + R)
const numer = nonAddictLifeExpectancy + (ageStarted * R);
const denom = 1 + R;
const L_addict = numer / denom;

console.log("Addict Life Expectancy:", L_addict.toFixed(2));
console.log("Life Lost:", (nonAddictLifeExpectancy - L_addict).toFixed(2));
console.log("Duration:", (L_addict - ageStarted).toFixed(2));
