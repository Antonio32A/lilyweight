const fetch = require("node-fetch");
const { skillXPPerLevel } = require("./constants.json");

const getLevelFromXP = xp => {
    let xpAdded = 0;
    for (let i = 0; i < 61; i++) {
        xpAdded += skillXPPerLevel[i];
        if (xp < xpAdded)
            return Math.floor((i - 1) + (xp - (xpAdded - skillXPPerLevel[i])) / skillXPPerLevel[i]);
    }

    return 60;
};

const getXpFromLevel = level => {
    let xpAdded = 0;
    for (let i = 0; i < level + 1; i++)
        xpAdded += skillXPPerLevel[i];

    return xpAdded;
};

const fetchJSON = async (url) => {
    const body = await fetch(url);
    const json = await body.json();
    if (json.success === false) throw Error("Request to Hypixel API Failed: " + json.error);
    return json;
};

const getProfile = async (uuid, apiKey) =>
    (await fetchJSON(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`))
        .profiles
        .sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0]
        .members[uuid];

const getAchievements = async (uuid, apiKey) =>
    (await fetchJSON(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`)).player.achievements;

const getUUID = async username =>
    (await fetchJSON("https://api.mojang.com/users/profiles/minecraft/" + username)).id;

module.exports = { getProfile, getAchievements, getXpFromLevel, getLevelFromXP, getUUID };