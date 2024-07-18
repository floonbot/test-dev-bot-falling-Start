const { Client, IntentsBitField, Collection } = require("discord.js");
const client = new Client({ intents: new IntentsBitField(3276799) });
const loadCommands = require("./loaders/loadCommands");
const loadEvents = require("./loaders/loadEvents");
const loadInteractions = require("./loaders/loadInteractions");
require("dotenv").config();

client.commands = new Collection();
client.interactions = new Collection();


(async () => {
    await loadCommands(client);
    await loadEvents(client);
    await loadInteractions(client);
    await client.login(process.env.TOKEN);
})();