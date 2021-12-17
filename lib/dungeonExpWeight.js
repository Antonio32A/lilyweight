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
    let tempLevel = 0;
    if (cataXP < 569809640)
        n = 0.2 * (level / 50) ** 1.538679118869934;
    else {
        let part = 142452410;
        tempLevel = 50 + (cataXP - dungeonMaxXP) / part;
        n = (1 + ((tempLevel - 50) / 50)) ** 2.967355422;
    }

    if (level !== 0) {
        if (cataXP < 569809640) return dungeonOverall * ((1.18340401286164044 ** (level + 1) - 1.05994990217254) * (1 + n));
        else return 3250 * n;
    } else return 0;
};

module.exports = { getDungeonExpWeight };
