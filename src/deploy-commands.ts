import { SlashCommandBuilder, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import "dotenv/config";

const commands = [
  new SlashCommandBuilder()
    .setName("dalle")
    .setDescription("Generates an image using Open AI's Dalle-2 AI")
    .addStringOption((option) =>
      option
        .setName("caption")
        .setDescription("teddy bears shopping for groceries, one-line drawing")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch((error) => console.error(error));
