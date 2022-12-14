import { ActivityType, Client, EmbedBuilder } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

import { Dalle } from "./dalle";

// Initialise a new client
const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

// Config Codex Open AI
const config = new Configuration({
  apiKey: process.env.CODEX_API_KEY!,
});

const openai = new OpenAIApi(config);

// Config Dalle-2
const dalle = new Dalle({ apiKey: process.env.DALLE2_SESSION_KEY! });

// Dalle-2 API
const getDalleImage = async (caption: string) => {
  const imageGenerations = await dalle.generate(caption);

  return imageGenerations;
};

// Send a request to the Codex Open AI API
const analyseCode = async (
  code: string
): Promise<string | undefined | null> => {
  const { data } = await openai.createCompletion({
    model: "code-davinci-002",
    prompt: code,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['"""'],
  });

  if (!data) {
    return null;
  }

  // If Davinci returned nothing
  if (data.choices === undefined || data.choices[0].text === "") {
    return undefined;
  }

  // Return the code analysis
  return data.choices[0].text;
};

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
    `I am currently connected to ${client.guilds.cache.size} ${
      client.guilds.cache.size > 1 ? "servers" : "server"
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

  message = message.concat('\n"""\nHere\'s what the above code is doing:\n1.');

  const codeDescription = await analyseCode(message); // Send message to the Codex Open AI API

  // If the API didn't return anything
  if (!codeDescription || codeDescription.trim() === "") {
    messageCreate.reply(
      "**Failed to interpret your code block, sorry not sorry :)**"
    );
    return;
  }

  // Build an embed and reply to the user
  const embed = new EmbedBuilder()
    .setColor("#ff00ff")
    .setTitle("Code Explainer")
    .addFields({
      name: "Here's my interpretation of what your garbage code is doing: ",
      value: `1. ${codeDescription}`,
    })
    .setTimestamp()
    .setFooter({ text: "This was created using Open AI's Davinci model." });

  await messageCreate.reply({ embeds: [embed] });
});

// Slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // Command names
  switch (commandName) {
    case "dalle":
      const caption = interaction.options.getString("caption"); // Get the input from caption

      // If user didn't input a caption
      if (!caption) {
        await interaction.reply(
          "Please input a caption so I can generate an image for you."
        );

        return;
      }

      await interaction.deferReply(); // Display "bot is thinking..." whilst the bot talks to the Dalle-2 Open AI API

      const response = await getDalleImage(caption); // Call the Dall-e 2 API to get an initial response

      // Let the user know that Dall-e 2 couldn't generate an image
      if (!response) {
        await interaction.editReply(
          "Dall-e 2 couldn't generate images based upon your caption."
        );
        return;
      }

      // Get the image array from the response
      const { data } = response;

      // If the image object was empty
      if (!data) {
        await interaction.editReply(
          "Dall-e 2 couldn't generate images based upon your caption."
        );
        return;
      }

      const image = data[0].generation.image_path; // Get the first image URL from the response

      await interaction.editReply(image); // Edit the reply with the image
      break;

    default:
      break;
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
