import { disabler } from "../../util.js";
import config from "../../data/config.js";

/**
 * @name stackban
 * @param {object} message - Message object
 */
export function stackban(message) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/stackban.js:6)");
    }

    message.cancel = true;

    let player = message.sender;

    let tag = player.getTags();
    
    // make sure the user has permissions to run the command
    if (!tag.includes('paradoxOpped')) {
        return player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"§r§4[§6Paradox§4]§r "},{"text":"You need to be Paradox-Opped to use this command."}]}`);
    }

    if (!config.modules.illegalitemsA.enabled && !config.modules.illegalitemsB.enabled && !config.modules.illegalitemsC.enabled) {
        if (config.modules.stackBan.enabled) {
            // In this stage they are likely turning it off so oblige their request
            return config.modules.stackBan.enabled = false;
        }
        // If illegal items are not enabled then let user know this feature is inaccessible
        // It will not work without one of them
        return player.runCommand(`tellraw "${disabler(player.nameTag)}" {"rawtext":[{"text":"§r§4[§6Paradox§4]§r "},{"text":"You need to enable Illegal Items to use this feature."}]}`);
    }

    if (config.modules.stackBan.enabled === false) {
        // Allow
        config.modules.stackBan.enabled = true;
        player.runCommand(`tellraw @a[tag=paradoxOpped] {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"selector":"@s"},{"text":" has enabled §6StackBans§r!"}]}`);
        return;
    } else if (config.modules.stackBan.enabled === true) {
        // Deny
        config.modules.stackBan.enabled = false;
        player.runCommand(`tellraw @a[tag=paradoxOpped] {"rawtext":[{"text":"\n§r§4[§6Paradox§4]§r "},{"selector":"@s"},{"text":" has disabled §4StackBans§r!"}]}`);
        return;
    }
}
