import { ActivityType, Client } from "discord.js";
import "dotenv/config";

// Initialise a new client
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

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

// Everytime a message is created
client.on("messageCreate", async (messageCreate) => {
  // Ignore the message if the message is sent from a bot
  if (messageCreate.author.bot) return;

  // Message content
  let message = messageCreate.content.toString();

  // Get the first 3 characters and check if the next two characters are alphabetical with an optional 3rd character
  const regExp = new RegExp(/^```[a-z][a-z]?[a-z]?\n/);

  const isCodeBlock = message.match(regExp);

  // Do nothing if the message is not a code block or an invalid code block
  if (!isCodeBlock) {
    return;
  }

  // Remove code block tags
  message = message.replace(regExp, ""); // Remove what what the regex matched
  message = message.slice(0, -3); // Remove the ``` at the end of the code block
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
