import { world, BlockLocation } from "mojang-minecraft";
import config from "../../data/config.js";
import { disabler } from "../../util.js";

const World = world;

/**
 * @name sethome
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided.
 */
export function sethome(message, args) {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? ./commands/utility/sethome.js:8)");
    }
    if (!args) {
        return console.warn(`${new Date()} | ` + "Error: ${args} isnt defined. Did you forget to pass it? ./commands/utility/sethome.js:9)");
    }

    message.cancel = true;

    let player = message.sender;

    // Get current location
    let {x, y, z} = player.location;

    let homex = x.toFixed(0);
    let homey = y.toFixed(0);
    let homez = z.toFixed(0);
    let currentDimension;

    // Did they pass a parameter
    if (!args.length) {
        return player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"You need to give a name to your home!"}]}`);
    }

    // Don't allow spaces
    if (args.length > 1) {
        return player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"No spaces in names please!"}]}`);
    }

    // Make sure this name doesn't exist already and it doesn't exceed limitations
    let verify = false;
    let counter = 0;
    let tags = player.getTags();
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].startsWith(args[0].toString() + " X", 13)) {
            verify = true;
            player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"You already have a home named ${args[0]}!"}]}`)
            break;
        }
        if (tags[i].startsWith("LocationHome:")) {
            counter = ++counter;
        }
        if (counter >= config.modules.setHome.max && config.modules.setHome.enabled) {
            verify = true;
            player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"You can only have ${config.modules.setHome.max} saved locations!"}]}`)
            break;
        }
    }
    if (verify === true) {
        return;
    }

    // Save which dimension they were in
    if (player.dimension.id === "minecraft:overworld") {
        currentDimension = "overworld"
    }
    if (player.dimension.id === "minecraft:nether") {
        currentDimension = "nether"
    }
    if (player.dimension.id === "minecraft:the_end") {
        return player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"Not allowed to set home in this dimension!"}]}`)
    }

    // Store their new home coordinates
    player.addTag(`LocationHome:${args[0]} X:${homex} Y:${homey} Z:${homez} Dimension:${currentDimension}`);
    
    player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"text":"${args[0]} has been set at ${homex} ${homey} ${homez}!"}]}`)
}
