import { ActivityType, Client, EmbedBuilder } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

// Initialise a new client
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// Config Open AI
const config = new Configuration({
  apiKey: process.env.OPEN_AI_KEY as string,
});

const openai = new OpenAIApi(config);

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

// Send a request to the OpenAI API
const analyseCode = async (code: string) => {
  const { data } = await openai.createCompletion({
    model: "code-davinci:002",
    prompt: code,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['"""'],
  });

  if (data.choices === undefined || data.choices[0].text === "") {
    return "Couldn't find anything...";
  }

  return data.choices[0].text;
};

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

  const code = JSON.stringify(message);

  const data = await analyseCode(code);

  if (!data) {
    messageCreate.reply("Couldn't find anything...");
    return;
  }

  const embed = new EmbedBuilder()
    .setColor("#ff00ff")
    .setTitle("Code Explainer")
    .setDescription("This is my interpretation of your hot garbage code")
    .addFields({ name: "Your code: ", value: data! })
    .setTimestamp()
    .setFooter({ text: "This was created using Open AI" });

  messageCreate.reply({ embeds: [embed] });
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
