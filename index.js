const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('📂 Schematic Selection Menu')
    .setDescription('Choose the schematic you want:');

  const menu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('schematic_select')
      .setPlaceholder('Choose a schematic...')
      .addOptions([
        { label: '🍯🐝 Gambling Station / Pearl Station', value: 'gambling_station' },
      ])
  );

  const channel = await client.channels.fetch(CHANNEL_ID);
  await channel.send({ embeds: [embed], components: [menu] });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'schematic_select') return;

  const selected = interaction.values[0];

  try {
    if (selected === 'gambling_station') {
      const file = new AttachmentBuilder('./Yellow_Gamble-Stations.litematic');
      await interaction.user.send({
        content: '🍯🐝 Here is your **Gambling Station / Pearl Station** schematic!',
        files: [file]
      });
    }

    await interaction.reply({ 
      content: '✅ Schematic sent to your DMs!', 
      ephemeral: true 
    });
  } catch {
    await interaction.reply({ 
      content: '❌ I couldn\'t DM you! Please enable DMs from server members.', 
      ephemeral: true 
    });
  }
});

client.login(TOKEN);
