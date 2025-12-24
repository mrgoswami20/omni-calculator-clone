// Verification Script for Implied Probability Calculator Logic

function calculateImpliedProbability(sign, odds) {
    const val = Math.abs(parseFloat(odds));
    if (isNaN(val)) return null;
    let prob = 0;

    if (sign === 'positive') {
        // Formula: 100 / (Odds + 100)
        prob = 100 / (val + 100);
    } else {
        // Formula: Odds / (Odds + 100)
        prob = val / (val + 100);
    }

    return (prob * 100).toFixed(4); // Component uses toFixed(4)
}

const testCases = [
    { name: "Positive Odds +100", sign: 'positive', odds: 100, expected: '50.0000' },
    { name: "Positive Odds +300", sign: 'positive', odds: 300, expected: '25.0000' },
    { name: "Negative Odds -200", sign: 'negative', odds: 200, expected: '66.6667' },
    { name: "Negative Odds -150", sign: 'negative', odds: 150, expected: '60.0000' },
    { name: "Negative Odds -110", sign: 'negative', odds: 110, expected: '52.3810' }, // 110/210
    { name: "Positive Odds +150", sign: 'positive', odds: 150, expected: '40.0000' }  // 100/250
];

console.log("Starting Verification for Implied Probability Calculator Math...");
console.log("----------------------------------------------------------------");

let passed = 0;
let failed = 0;

testCases.forEach(test => {
    const result = calculateImpliedProbability(test.sign, test.odds);
    if (result === test.expected) {
        console.log(`[PASS] ${test.name}: Input ${test.sign === 'positive' ? '+' : '-'}${test.odds} -> ${result}%`);
        passed++;
    } else {
        console.error(`[FAIL] ${test.name}: Input ${test.sign === 'positive' ? '+' : '-'}${test.odds}`);
        console.error(`       Expected: ${test.expected}%, Got: ${result}%`);
        failed++;
    }
});

console.log("----------------------------------------------------------------");
console.log(`Verification Complete. Passed: ${passed}, Failed: ${failed}`);

if (failed > 0) process.exit(1);
process.exit(0);
