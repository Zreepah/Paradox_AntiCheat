import * as Minecraft from "mojang-minecraft";
import { flag, getTags } from "../../../util.js";
import config from "../../../data/config.js";

const World = Minecraft.World;
const Commands = Minecraft.Commands;

const SpammerC = () => {
    World.events.beforeChat.subscribe(msg => {

        const player = msg.sender;

        // get all tags of the player
        let playerTags = getTags(player);

        // Spammer/C = checks if someone sends a message while using an item
        if (config.modules.spammerC.enabled && playerTags.includes('right')) {
            try {
                Commands.run(`testfor @a[name="${player.nameTag}",tag=right]`, World.getDimension("overworld"));
                flag(player, "Spammer", "C", "Misc", false, false, false, msg);
            } catch (error) {}
        }
    })
}

export { SpammerC }