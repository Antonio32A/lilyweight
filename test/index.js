const lily = require("../lib")(process.env.HYPIXEL_API_KEY);

const parseData = data => {
    const { uuid, total, skill, catacombs, slayer } = data;
    console.log(`lilyweight for ${uuid}:`);
    console.log("Total: " + total);
    console.log(`Skill: ${skill.base} (${skill.base + skill.overflow} overflow)`);
    console.log(
        `Catacombs Completion: ${catacombs.completion.base} `
        + `(${catacombs.completion.base + catacombs.completion.master} master)`
    );
    console.log("Catacombs Experience: " + catacombs.experience);
    console.log("Slayer: " + slayer);
};

lily.getWeight("e710ff36fe334c0e8401bda9d24fa121").then(parseData);
lily.getWeight("e710ff36-fe33-4c0e-8401-bda9d24fa121").then(parseData);
lily.getWeight("SirDesco").then(parseData);
lily.getWeightFromUUID("e710ff36fe334c0e8401bda9d24fa121").then(parseData);
lily.getWeightFromUsername("SirDesco").then(parseData);
