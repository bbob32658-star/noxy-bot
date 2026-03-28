const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🗂️ Schematic Selection Menu')
    .setDescription('Choose the schematic you want:');

  const menu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('schematic_select')
      .setPlaceholder('Choose a schematic...')
      .addOptions([
        { label: 'Iron Farm', value: 'iron_farm' },
        { label: 'Mob Grinder', value: 'mob_grinder' },
        { label: 'Auto Sorter', value: 'auto_sorter' },
        { label: 'Villager Breeder', value: 'villager_breeder' },
        { label: 'Enderman Farm', value: 'enderman_farm' },
        { label: 'Crop Harvester', value: 'crop_harvester' },
      ])
  );

  const channel = await client.channels.fetch(CHANNEL_ID);
  await channel.send({ embeds: [embed], components: [menu] });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'schematic_select') return;

  const selected = interaction.values[0];
  const label = interaction.component.options.find(o => o.value === selected)?.label;

  try {
    await interaction.user.send(`📦 Here's your **${label}** schematic!`);
    await interaction.reply({ content: `✅ Sent **${label}** to your DMs!`, ephemeral: true });
  } catch {
    await interaction.reply({ content: '❌ I couldn\'t DM you! Please enable DMs from server members.', ephemeral: true });
  }
});

client.login(TOKEN);