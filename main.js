const { Client, IntentsBitField, Collection } = require("discord.js");
const client = new Client({ intents: new IntentsBitField(3276799) });
const loadCommands = require("./connection/loadCommands");
const loadEvents = require("./connection/loadEvents");
const loadInteractions = require("./connection/loadInteractions");
require('./libs/colors/js/globalConfig');
require("dotenv").config();

client.commands = new Collection();
client.interactions = new Collection();

(async () => {
    await loadCommands(client);
    await loadEvents(client);
    await loadInteractions(client);
    await client.login(process.env.TOKEN);
})();
