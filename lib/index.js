const { skillNames } = require("./constants.json");
const { getProfile, getPlayer, getXpFromLevel, getLevelFromXP, getUUID, fetchUsername } = require("./utils");
const { getSkillWeight } = require("./skillWeight");
const { getDungeonCompletionWeight } = require("./dungeonCompWeight");
const { getDungeonExpWeight } = require("./dungeonExpWeight");
const { getSlayerWeight } = require("./slayerWeight");

/**
 * an object containing weighs
 * @typedef {{total: number, slayer: number, skill: {overflow: number, base: number}, catacombs: {completion: {base: number, master: number}, experience: number}}} Weights
 */

/**
 * an object containing weighs, the uuid and maybe username
 * @typedef {Weights & {uuid: string, username?: string}} PlayerWeights
 */

class LilyWeight {
    /**
     * creates a new LilyWeight instance.
     * @param {string} apiKey a Hypixel API key.
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Gets the player's raw weight. This makes no API requests.
     * Order of skills: enchanting, taming, alchemy, mining, farming, foraging, combat, fishing.
     * Order of slayers: zombie, spider, wolf, enderman.
     * @param {number[]} skillLevels - Array of skill levels in the order listed above. They all scale up to 60.
     * @param {number[]} skillXP - Array of skill XP in the order listed above.
     * @param {{"0": number, "1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number}} cataCompl - Object of catacombs completion, e.g. { "0": 13, "1": 37, "2": 32, ... }.
     * @param {{"1": number, "2": number, "3": number, "4": number, "5": number, "6": number}} mCataCompl - Object of master catacombs completion, same format as cataCompl.
     * @param {number} cataXP - Catacombs experience.
     * @param {number[]} slayerXP - Array of slayer experience amounts in the order listed above.
     * @returns {Weights} the weights calculated from the data.
     */
    static getWeightRaw(skillLevels, skillXP, cataCompl, mCataCompl, cataXP, slayerXP) {
        const [skillWeight, overflowWeight] = getSkillWeight(skillLevels, skillXP);
        const [cataComplWeight, masterCataComplWeight] = getDungeonCompletionWeight(cataCompl, mCataCompl);
        const cataExpWeight = getDungeonExpWeight(cataXP);
        const slayerWeight = getSlayerWeight(slayerXP);

        return {
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
    }

    /**
     * Gets the player's weight.
     * @param {string} uuid - Player's Minecraft UUID, can be with dashes.
     * @param {boolean} [returnUsername=false] - Should the function return the player's username.
     * @returns {Promise<PlayerWeights>} the weights calculated for the player.
     */
    async getWeightFromUUID(uuid, returnUsername = false) {
        if (uuid.length === 36)
            uuid = uuid.replace(/-/g, "");

        let username;
        const profile = await getProfile(uuid, this.apiKey);
        const slayerXP = [
            profile.slayer_bosses?.zombie?.xp ?? 0,
            profile.slayer_bosses?.spider?.xp ?? 0,
            profile.slayer_bosses?.wolf?.xp ?? 0,
            profile.slayer_bosses?.enderman?.xp ?? 0
        ];

        const cataCompl = profile.dungeons?.dungeon_types?.catacombs?.tier_completions ?? {};
        const mCataCompl = profile.dungeons?.dungeon_types?.master_catacombs?.tier_completions ?? {};
        const cataXP = profile.dungeons?.dungeon_types?.catacombs?.experience ?? 0;

        let skillLevels;
        let skillXP;
        if (!profile.experience_skill_mining) {
            // skill API is off
            const player = await getPlayer(uuid, this.apiKey);
            const { achievements } = player;
            username = player.displayName;

            skillLevels = Object.values(skillNames).map(i => achievements?.[i] ?? 0);
            skillXP = skillLevels.map(getXpFromLevel);
        } else {
            skillXP = Object.keys(skillNames).map(i => profile[i]);
            skillLevels = skillXP.map(getLevelFromXP);
        }

        const weight = LilyWeight.getWeightRaw(skillLevels, skillXP, cataCompl, mCataCompl, cataXP, slayerXP);

        if (returnUsername) {
            if (!username)
                username = await fetchUsername(uuid);
            return { username, uuid, ...weight };
        } else return { uuid, ...weight };
    }

    /**
     * Gets the player's weight.
     * @param {string} username - Player's Minecraft username.
     * @param {boolean} [returnUsername=false] - Should the function return the player's username.
     * @returns {Promise<PlayerWeights>} the weights calculated for the player.
     */
    async getWeightFromUsername(username, returnUsername = false) {
        return this.getWeightFromUUID(await getUUID(username), returnUsername);
    }

    /**
     * Gets the player's weight.
     * @param {string} player - Either a Minecraft username or a Minecraft UUID (can be with dashes).
     * @param {boolean} [returnUsername=false] - Should the function return the player's username.
     * @returns {Promise<PlayerWeights>} the weights calculated for the player.
     */
    async getWeight (player, returnUsername = false) {
        return this.getWeightFromUUID(player.length > 16 ? player : await getUUID(player), returnUsername);
    }
}

module.exports = LilyWeight;