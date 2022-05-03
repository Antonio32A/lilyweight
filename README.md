# lilyweight

[![discord](https://img.shields.io/discord/670733991082459146?logo=discord&style=for-the-badge)](https://discord.gg/kXfBmF4)
[![license](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![npm](https://img.shields.io/npm/v/lilyweight?style=for-the-badge)](https://npmjs.com/package/lilyweight)

Hypixel SkyBlock Weight Calculator

## Information

This is a reimplementation of https://github.com/LappySheep/hypixel-skyblock-weight in JavaScript.

Written without any external libraries other than node-fetch which is used to fetch data from the Hypixel API.

This requires a Hypixel API key. You may obtain one by logging onto `hypixel.net` with your Minecraft client and typing
/api new.

## Credits
- [LappySheep](https://github.com/LappySheep/) - Original author of the calculator
- [Desco](https://github.com/Desco1) - Ported the calculator to JavaScript.

## Usage

```js
// require from commonJS
const LilyWeight = require("lilyweight");

// or import from Ecmascript Module
import LilyWeight from "lilyweight";

// replace HYPIXEL_API_KEY with your Hypixel API key
const lily = new LilyWeight("HYPIXEL_API_KEY");

// using a UUID
lily.getWeight("e710ff36fe334c0e8401bda9d24fa121")
    .then(console.log)
    .catch(console.error);

// using a UUID, but also return the player's username
lily.getWeight("e710ff36fe334c0e8401bda9d24fa121", true)
    .then(console.log)
    .catch(console.error);

// using a UUID with dashes
lily.getWeight("e710ff36-fe33-4c0e-8401-bda9d24fa121")
    .then(console.log)
    .catch(console.error);

// using a username
lily.getWeight("SirDesco")
    .then(console.log)
    .catch(console.error);

// other functions if you wish to only accept either UUIDs or usernames
lily.getWeightFromUUID("e710ff36fe334c0e8401bda9d24fa121")
    .then(console.log)
    .catch(console.error);

lily.getWeightFromUsername("SirDesco")
    .then(console.log)
    .catch(console.error);

// functions for if you wish to see a certain profile instead of the most recently used profile
lily.getProfileWeight("Ascynx", "Mango")
    .then(console.log)
    .catch(console.error);

// only Username
lily.getProfileWeightFromUsername("Ascynx", "Mango")
    .then(console.log)
    .catch(console.error);

// only UUID
lily.getProfileWeightFromUUID("0ce87d5afa5f4619ae78872d9c5e07fe", "Mango")
    .then(console.log)
    .catch(console.error);

// get raw weight from raw data, read the JSDoc for more information
// this does not return the uuid and username fields but it does not make any requests
console.log(LilyWeight.getWeightRaw(
    [60, 60, 60, 60, 60, 60, 60, 60], // skill levels which scale up to 60
    [
        1000000000, 
        1000000000,
        1000000000,
        1000000000, // skill xp
        1000000000,
        1000000000,
        1000000000,
        1000000000
    ],
    { "0": 10, "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 10, "7": 100 }, // catacombs completion
    { "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 100 }, // catacombs completion (master mode)
    1000000, // catacombs experience
    [1000000, 1000000, 1000000, 1000000, 1000000] // slayer experience
));
```

Example output of one of the functions, in JSON, assuming that the second argument (returnUsername) is true:
```json
{
    "username": "SirDesco",
    "uuid": "e710ff36fe334c0e8401bda9d24fa121",
    "total": 14439.880600696824,
    "skill": {
        "base": 10346.795817290036,
        "overflow": 173.30267908613297
    },
    "catacombs": {
        "completion": {
            "base": 1226.2725420124711,
            "master": 532.7492424907152
        },
        "experience": 1057.0997512507508
    },
    "slayer": 1103.6605685667157
}
```

## API
If you aren't using JavaScript and you need an API, take a look at [lilyweight-worker](https://lilydocs.antonio32a.com/).
