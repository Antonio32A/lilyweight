declare module "lilyweight" {

    export type Weights = {total: number, slayer: number, skill: {overflow: number, base: number}, catacombs: {completion: {base: number, master: number}, experience: number}}
    export type PlayerWeights = Weights & { uuid: string, username?: string, specifiedProfile?: string}

    export default class LilyWeight {
        /**
         * Creates a new LilyWeight instance.
         * @param {string} apiKey a Hypixel API key.
         */
        constructor(apiKey: string)
        /**
         * Gets the player's raw weight. This makes no API requests.
         * Order of skills: enchanting, taming, alchemy, mining, farming, foraging, combat, fishing.
         * Order of slayers: zombie, spider, wolf, enderman, blaze.
         * @param {number[]} skillLevels - Array of skill levels in the order listed above. They all scale up to 60.
         * @param {number[]} skillXP - Array of skill XP in the order listed above.
         * @param {{"0": number, "1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number}} cataCompl - Object of catacombs completion, e.g. { "0": 13, "1": 37, "2": 32, ... }.
         * @param {{"1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number}} mCataCompl - Object of master catacombs completion, same format as cataCompl.
         * @param {number} cataXP - Catacombs experience.
         * @param {number[]} slayerXP - Array of slayer experience amounts in the order listed above.
         * @returns {Weights} The weights calculated from the data.
         */
        static getWeightRaw(
            skillLevels: number[],
            skillXP: number[],
            cataCompl: {"0": number, "1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number},
            mCataCompl: {"1": number, "2": number, "3": number, "4": number, "5": number, "6": number, "7": number},
            cataXP: number,
            slayerXP: number[]
        ): Weights

        /**
         * Gets the player's weight.
         * @param {string} uuid - Player's Minecraft UUID, can be with dashes.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getWeightFromUUID(uuid: string, returnUsername: boolean): Promise<PlayerWeights>

        /**
         * Returns the specified profile's Weight.
         * @param {string} uuid - Player's Minecraft UUID, can be with dashes.
         * @param  {string} specifiedProfile - The profile name, can be uppercase or lowercase.
         * @param  {boolean} [returnUsername=false] - Should the function return the username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getProfileWeightFromUUID(uuid: string, specifiedProfile: string, returnUsername: boolean): Promise<PlayerWeights>

        /**
         * Gets the player's weight.
         * @param {string} username - Player's Minecraft username.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getWeightFromUsername(username: string, returnUsername: boolean): Promise<PlayerWeights>

        /**
         * Gets the player profile's weight.
         * @param {string} username - Player's Minecraft username.
         * @param {string} profile - Player's profile name.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getProfileWeightFromUsername(username: string, profile: string, returnUsername: boolean): Promise<PlayerWeights>

        /**
         * Gets the player's weight.
         * @param {string} player - Either a Minecraft username or a Minecraft UUID (can be with dashes).
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getWeight(player: string, returnUsername: boolean): Promise<PlayerWeights>

        /**
         * Gets the player profile's weight.
         * @param {string} player - Either a Minecraft username or a Minecraft UUID (can be with dashes).
         * @param {string} profile - The name of the profile, doesn't matter if it's uppercase or lowercase.
         * @param {boolean} [returnUsername=false] - Should the function return the player's username.
         * @returns {Promise<PlayerWeights>} The weights calculated for the player.
         */
        getProfileWeight(player: string, profile: string, returnUsername: boolean): Promise<PlayerWeights>
    }
}