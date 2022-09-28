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
    if (json.success === false) throw Error("Request to Hypixel API Failed: " + json.cause);
    return json;
};

const getProfile = async (uuid, apiKey) =>
    (await fetchJSON(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`))
        .profiles
        .filter((a) => a.selected)[0]
        .members[uuid];

const getSpecifiedProfile = async (uuid, apiKey, profile) => 
    (await fetchJSON(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`))
        .profiles
        .filter(p => p.cute_name == profile)[0]
        .members[uuid]

const getPlayer = async (uuid, apiKey) =>
    (await fetchJSON(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`)).player;

const getUUID = async username =>
    (await fetchJSON("https://api.mojang.com/users/profiles/minecraft/" + username)).id;

const fetchUsername = async uuid => {
    const json = await fetchJSON(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    return json.name;
};

module.exports = { getProfile, getPlayer, getXpFromLevel, getLevelFromXP, getUUID, fetchUsername, getSpecifiedProfile };