# DiscordCodeExplainer

A Discord bot that allows users to communitcate with some of Open AI's APIs.

## Usage 
### Setting Up The Bot
1. You want to copy the ``.env.sample`` and rename it to ``.env``
```sh
cp .env.sample .env
```
2. Access the Discord developers portal and create your own bot which can be found [here](https://discordpy.readthedocs.io/en/stable/discord.html#creating-a-bot-account).
3. Add the TOKEN which is typically found under the Build-A-Bot sub-heading and paste the TOKEN into the .env DISCORD_TOKEN=
4. Add your own user ID to DISCORD_CLIENT_ID= in the .env
5. Add your own guild ID to DISCORD_GUILD_ID=in the .env
   -  If you are unsure on how to get these values, enabling Developer mode can be found [here](https://www.remote.tools/remote-work/how-to-find-discord-id)
6. To get access to Open AI's API you need to first join the OpenAI Codex waitlist which is [here](https://openai.com/blog/openai-codex/) and wait to be accepted. You also need to create an account an sign in [here](https://openai.com/api/).
    - From there you can go to your account in the top right corner and press "View API Keys" and paste the API key into CODEX_API_KEY= in the .env
7. To get access to Dalle-2's API you also need to join an waitlist and wait to be accepted which can be found [here](https://labs.openai.com/waitlist).
    1. To get the your unique session key you need to go to [https://labs.openai.com/](https://labs.openai.com/).
    2. Open the Network Tab in Developer Tools in your browser.
    3. Send a image request in the input box.
    4. In the network tab you'll find a POST request to [https://labs.openai.com/api/labs/tasks](https://labs.openai.com/api/labs/tasks).
    5. In the POST request headers you'll find your session key in the "Authorization" header, it'll look something like "sess-xxxxxxxxxxxxxxxxxxxxxxxxxxxx".
    6. Paste the session key in the DALLE2_SESSION_KEY= in the .env
8. Run ``npm i`` to install the required packages.
9. Run ``npm run build`` to compile the TypeScript files into JavaScript files.
10. Run ``npm run commands`` to deploy the slash commands to the bot.
11. Run ``npm start`` to start the bot and pray that you've setup the bot correctly.