const { dungeonCompletionWorth, dungeonCompletionBuffs } = require("./constants.json");

let max1000 = 0;
let mMax1000 = 0;
for (let i = 0; i < dungeonCompletionWorth.length; i++) {
    if (i < 8) max1000 += dungeonCompletionWorth[i];
    else mMax1000 += dungeonCompletionWorth[i];
}

max1000 *= 1000;
mMax1000 *= 1000;

const getDungeonCompletionWeight = (cataCompl, mCataCompl) => {
    let upperBound = 1500;
    let score = 0;

    Object.entries(cataCompl).forEach(([floor, amount]) => {
        let excess = 0;
        if (amount > 1000) {
            excess = amount - 1000;
            amount = 1000;
        }

        let floorScore = amount * dungeonCompletionWorth[floor];
        if (excess > 0)
            floorScore *= Math.log(excess / 1000 + 1) / Math.log(7.5) + 1;
        score += floorScore;
    });

    const rating = score / max1000 * upperBound * 2;

    Object.entries(mCataCompl).forEach(([floor, amount]) => {
        if (Object.keys(dungeonCompletionBuffs).includes(floor)) {
            const threshold = 20;
            if (amount >= threshold) upperBound += dungeonCompletionBuffs[floor];
            else upperBound += dungeonCompletionBuffs[floor] * (amount / threshold) ** 1.840896416;
        }
    });

    let masterScore = 0;
    Object.entries(mCataCompl).forEach(([floor, amount]) => {
        let excess = 0;
        if (amount > 1000) {
            excess = amount - 1000;
            amount = 1000;
        }

        let floorScore = amount * dungeonCompletionWorth[7 + Number(floor)];
        if (excess > 0)
            floorScore *= (Math.log((excess / 1000) + 1) / Math.log(6)) + 1;
        masterScore += floorScore;
    });

    const masterRating = (masterScore / mMax1000) * upperBound * 2;
    return [rating, masterRating];
};

module.exports = { getDungeonCompletionWeight };
