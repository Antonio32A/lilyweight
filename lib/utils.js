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

const fetchJson = async (url, headers = {}) => {
    const body = await fetch(url, {headers: headers});
    const json = await body.json();
    if (json.success === false) throw Error("Request to Hypixel API Failed: " + json.cause);
    return json;
};

const fetchJsonWithKey = async (url, key) => fetchJson(url, { "API-Key": key })

const getProfile = async (uuid, apiKey) =>
    (await fetchJsonWithKey(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}`, apiKey))
        .profiles
        .sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0]
        .members[uuid];

const getSpecifiedProfile = async (uuid, apiKey, profile) =>
    (await fetchJsonWithKey(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}`, apiKey))
        .profiles
        .filter(p => p.cute_name == profile)[0]
        .members[uuid]

const getPlayer = async (uuid, apiKey) =>
    (await fetchJsonWithKey(`https://api.hypixel.net/player?uuid=${uuid}`, apiKey)).player;

const getUUID = async username =>
    (await fetchJson("https://api.mojang.com/users/profiles/minecraft/" + username)).id;

const fetchUsername = async uuid => {
    const json = await fetchJson(`https://api.mojang.com/user/profile/${uuid}`);
    return json.name;
};

module.exports = { getProfile, getPlayer, getXpFromLevel, getLevelFromXP, getUUID, fetchUsername, getSpecifiedProfile };