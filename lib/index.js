const { skillNames } = require("./constants.json");
const { getProfile, getPlayer, getXpFromLevel, getLevelFromXP, getUUID, fetchUsername } = require("./utils");
const { getSkillWeight } = require("./skillWeight");
const { getDungeonCompletionWeight } = require("./dungeonCompWeight");
const { getDungeonExpWeight } = require("./dungeonExpWeight");
const { getSlayerWeight } = require("./slayerWeight");

const getWeight = async (uuid, apiKey, returnUsername) => {
    if (uuid.length === 36)
        uuid = uuid.replace(/-/g, "");

    let username;
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
        const player = await getPlayer(uuid, apiKey);
        const { achievements } = player;
        username = player.displayName;

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

    const data = {
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

    if (returnUsername) {
        if (!username)
            username = await fetchUsername(uuid);
        return { username, ...data };
    } else return data;
};

module.exports = apiKey => {
    return {
        /**
         * Gets the player's weight.
         * @param {string} player - Either a Minecraft username or a Minecraft UUID (can be with dashes).
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, username?: string catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeight: async (player, returnUsername = false) =>
            getWeight(player.length > 16 ? player : await getUUID(player), apiKey, returnUsername),

        /**
         * Gets the player's weight.
         * @param {string} uuid - Player's Minecraft UUID, can be with dashes.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, username?: string catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeightFromUUID: async (uuid, returnUsername = false) =>
            getWeight(uuid, apiKey, returnUsername),

        /**
         * Gets the player's weight.
         * @param {string} username - Player's Minecraft username.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<{total: number, slayer: number, skill: {overflow: number, base: number}, uuid: string, username?: string catacombs: {completion: {base: number, master: number}, experience: number}}>}
         */
        getWeightFromUsername: async (username, returnUsername = false) =>
            getWeight(await getUUID(username), apiKey, returnUsername)
    };
};