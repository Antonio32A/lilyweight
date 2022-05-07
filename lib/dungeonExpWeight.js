const { dungeonExperienceTable, dungeonMaxXP, dungeonOverall } = require("./constants.json");

const getDungeonExpWeight = cataXP => {
    let level = -1;
    for (let i = 0; i < dungeonExperienceTable.length; i++) {
        if (cataXP >= dungeonExperienceTable[i]) level++;
        else break;
    }

    if (level !== 50) {
        const nextLvlXP = dungeonExperienceTable[level + 1] - dungeonExperienceTable[level];
        const progress = Math.floor((cataXP - dungeonExperienceTable[level]) / nextLvlXP * 1000) / 1000;
        level += progress;
    }

    let n;
    let extra;
    if (cataXP < dungeonMaxXP)
        n = 0.2 * (level / 50) ** 1.538679118869934;
    else {
        let part = 142452410;
        extra = (500 * ((cataXP - dungeonMaxXP) / part) ** (1/1.781925776625157));
    }

    if (level !== 0) {
        if (cataXP < dungeonMaxXP) {
            return dungeonOverall * ((1.18340401286164044 ** (level + 1) - 1.05994990217254) * (1 + n));
        } else {
            return (4100 + extra) * 2;
        }
    } else {
        return 0;
    }
};

module.exports = { getDungeonExpWeight };
