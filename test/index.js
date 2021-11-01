const Lily = require("../lib");
const lily = new Lily(process.env.HYPIXEL_API_KEY);

const parseData = data => {
    const { username, uuid, total, skill, catacombs, slayer } = data;
    console.log(`lilyweight for ${username ?? uuid}:`);
    console.log("Total: " + total);
    console.log(`Skill: ${skill.base} (${skill.base + skill.overflow} overflow)`);
    console.log(
        `Catacombs Completion: ${catacombs.completion.base} `
        + `(${catacombs.completion.base + catacombs.completion.master} master)`
    );
    console.log("Catacombs Experience: " + catacombs.experience);
    console.log("Slayer: " + slayer);
};

lily.getWeight("sirdesco", true).then(console.log);
lily.getWeight("e710ff36-fe33-4c0e-8401-bda9d24fa121", true).then(parseData);
lily.getWeight("SirDesco", true).then(parseData);
lily.getWeightFromUUID("e710ff36fe334c0e8401bda9d24fa121", true).then(parseData);
lily.getWeightFromUsername("SirDesco", true).then(parseData);
lily.getWeightFromUsername("LappySheep", true).then(parseData);

const raw = Lily.getWeightRaw(
    [60, 60, 60, 60, 60, 60, 60, 60],
    [
        1000000000,
        1000000000,
        1000000000,
        1000000000,
        1000000000,
        1000000000,
        1000000000,
        1000000000
    ],
    { "0": 10, "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 10, "7": 100 },
    { "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 100 },
    1000000,
    [1000000, 1000000, 1000000, 1000000]
);
console.log(raw);