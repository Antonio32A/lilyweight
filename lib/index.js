const { skillNames } = require("./constants.json");
const { getProfile, getAchievements, getXpFromLevel, getLevelFromXP, getUUID } = require("./utils");
const { getSkillWeight } = require("./skillWeight");
const { getDungeonCompletionWeight } = require("./dungeonCompWeight");
const { getDungeonExpWeight } = require("./dungeonExpWeight");
const { getSlayerWeight } = require("./slayerWeight");

const getWeight = async (uuid, apiKey) => {
    if (uuid.length === 36)
        uuid = uuid.replace(/-/g, "");

    const profile = await getProfile(uuid, apiKey);
    const slayerXP = [
        profile.slayer_bosses.zombie?.xp ?? 0,
        profile.slayer_bosses.spider?.xp ?? 0,
        profile.slayer_bosses.wolf?.xp ?? 0,
        profile.slayer_bosses.enderman?.xp ?? 0
    ];

    const cataCompl = profile.dungeons.dungeon_types.catacombs?.tier_completions ?? {};
    const mCataCompl = profile.dungeons.dungeon_types.master_catacombs?.tier_completions ?? {};
    const cataXP = profile.dungeons.dungeon_types.catacombs?.experience ?? 0;

    let skillLevels;
    let skillXP;
    if (profile.experience_skill_mining === null) {
        // skill API is off
        const achievements = await getAchievements(uuid, apiKey);
        skillLevels = Object.values(skillNames).map(i => achievements[i]);
        skillXP = skillLevels.map(getXpFromLevel);
    } else {
        skillXP = Object.keys(skillNames).map(i => profile[i]);
        skillLevels = skillXP.map(getLevelFromXP);
    }

    const [skillWeight, overflowWeight] = getSkillWeight(skillLevels, skillXP);
    const [cataComplWeight, masterCataComplWeight] = getDungeonCompletionWeight(cataCompl, mCataCompl);
    const cataExpWeight = getDungeonExpWeight(cataXP);
    const slayerWeight = getSlayerWeight(slayerXP);

    return {
        uuid,
        total: (skillWeight + overflowWeight + cataComplWeight + masterCataComplWeight + cataExpWeight + slayerWeight),
        skill: {
            base: skillWeight,
            overflow: overflowWeight
        },
        catacombs: {
            completion: {
                base: cataComplWeight,
                master: masterCataComplWeight
            },
            experience: cataExpWeight
        },
        slayer: slayerWeight
    };
};

module.exports = apiKey => {
    return {
        /**
         * Gets the player's weight.
         * @param {string} player - Either a Minecraft username or a Minecraft UUID (can be with dashes).
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeight: async player => getWeight(player.length > 16 ? player : await getUUID(player), apiKey),

        /**
         * Gets the player's weight.
         * @param {string} uuid - Player's Minecraft UUID, can be with dashes.
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeightFromUUID: async uuid => getWeight(uuid, apiKey),

        /**
         * Gets the player's weight.
         * @param {string} username - Player's Minecraft username.
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeightFromUsername: async username => getWeight(await getUUID(username), apiKey)
    };
};