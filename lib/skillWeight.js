const { skillRatioWeight: srw, skillMaxXP, skillOverflowMultipliers, skillFactors, skillOverall } = require("./constants.json");

const effectiveXP = (xp, factor) => {
    return Math.pow(xp, factor)
};

const getSkillWeight = (skillLevels, skillXP) => {
    let skillAvg = 0;
    skillLevels.forEach(level => skillAvg += level);
    skillAvg /= skillLevels.length;

    const n = 12 * ((skillAvg / 60) ** 2.44780217148309);
    const r2 = 2 ** (1 / 2);

    let temp = [];
    for (let i = 0; i < skillLevels.length; i++) {
        temp.push(
            n * srw[Object.keys(srw)[i]][skillLevels[i]] * srw[Object.keys(srw)[i]][Object.keys(srw[Object.keys(srw)[i]]).length - 1] +
            srw[Object.keys(srw)[i]][Object.keys(srw[Object.keys(srw)[i]]).length - 1] * (skillLevels[i] / 60) ** r2
        );
    }

    let skillRating = 0;
    temp.forEach(thingy => {
        skillRating += thingy;
    });
    skillRating *= skillOverall;

    let overflowRating = 0;
    for (let i = 0; i < skillXP.length; i++) {
        if (skillXP[i] > skillMaxXP) {
            const factor = skillFactors[i];
            const effectiveOver = effectiveXP(skillXP[i] - skillMaxXP, factor);
            const rating = effectiveOver / skillMaxXP;
            const overflowMult = skillOverflowMultipliers[i];
            const t = rating * overflowMult;
            if (t > 0)
                overflowRating += skillOverall * (rating * overflowMult);
        }
    }

    return [skillRating, overflowRating];
};

module.exports = { getSkillWeight };
