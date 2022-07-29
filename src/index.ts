import { ActivityType, Client } from "discord.js";
import "dotenv/config";

// Initialise a new client
const client = new Client({ intents: ["Guilds"] });

// When the bot is ready
client.once("ready", () => {
  // Set the bot's status
  client.user!.setPresence({
    activities: [{ name: "Your garbage code", type: ActivityType.Watching }],
    status: "idle",
  });

  // Log when bot turns on
  console.log("Ready or not, here I come to look at some garbage code!");
  console.log(
    `I am currently connected to ${
      client.guilds.cache.size === 1
        ? `${client.guilds.cache.size} server`
        : `${client.guilds.cache.size} servers`
    }`
  );
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
