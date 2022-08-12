const { slayerDeprecationScaling } = require("./constants.json");

const getSlayerScore = exp => {
    // thank you Lucy -Desco
    const d = exp / 100000;
    if (exp >= 6416) {
        const D = (d - Math.pow(3, (-5 / 2))) * (d + Math.pow(3, -5 / 2));
        const u = Math.cbrt(3 * (d + Math.sqrt(D)));
        const v = Math.cbrt(3 * (d - Math.sqrt(D)));
        return u + v - 1;
    } else {
        return Math.sqrt(4 / 3) * Math.cos(Math.acos(d * Math.pow(3, 5 / 2)) / 3) - 1;
    }
};

const getEffectiveXP = (score, ind) => {
    const scaling = slayerDeprecationScaling[ind];
    let total = 0;
    for (let i = 1; i <= score; i++)
        total += (i ** 2 + i) * scaling ** i;

    total = Math.round((1000000 * total * (0.05 / scaling)) * 100) / 100;
    return total;
};

const getActualXP = score =>
    ((score ** 3 / 6) + (score ** 2 / 2) + (score / 3)) * 100000;

const getSlayerValue = (xp, i) => {
    const score = Math.floor(getSlayerScore(xp));
    const effectiveXP = getEffectiveXP(score, i);
    const actualXP = getActualXP(score);
    const distance = xp - actualXP;
    const effectiveDistance = distance * slayerDeprecationScaling[i] ** score;
    return effectiveXP + effectiveDistance;
};

const getSlayerWeight = slayerXP => {
    const zombie = getSlayerValue(slayerXP[0], 0);
    const spider = getSlayerValue(slayerXP[1], 1);
    const wolf = getSlayerValue(slayerXP[2], 2);
    const enderman = getSlayerValue(slayerXP[3], 3);
    const blaze = getSlayerValue(slayerXP[4], 4)

    const individual = zombie / 9250 + spider / 7019.57 + wolf / 2982.06 + enderman / 996.3003 + blaze / 935.0455;
    const extra = (slayerXP[0] + 1.6 * slayerXP[1] + 3.6 * slayerXP[2] + 10 * slayerXP[3] + 10 * slayerXP[4]) / 1000000;
    return 2 * (individual + extra);
};

module.exports = { getSlayerWeight };