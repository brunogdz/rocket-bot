const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  VoiceChannel,
  GuildEmoji,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Musica")
    .addSubcommand((subcommand) => subcommand.setName("play"))
    .setDescription("tocar uma musica")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Nome ou link para tocar a musica")
        .setRequired(true)
    )
    .addSubcommand((subcommand) => subcommand.setName("volume"))
    .setDescription("ajustar o volume da musica")
    .addStringOption((option) =>
      option
        .setName("percent")
        .setDescription("10 = 10%")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addSubcommand((subcommand) => subcommand.setName("options"))
    .setDescription("selecione a opção")
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Selectione a opção")
        .setRequired(true)
        .addChoices(
          { name: "queue", value: "queue" },
          { name: "skip", value: "skip" },
          { name: "pause", value: "pause" },
          { name: "resume", value: "resume" },
          { name: "stop", value: "stop" }
        )
    ),
  async execute(interaction, client) {
    const { options, member, guild, channel } = interaction;

    const subcommand = options.getSubcommand();
    const query = options.getString("query");
    const volume = options.getNumber("percent");
    const option = options.getString("options");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor("Red").setDescription("Voce tem que estar em um canal");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription("o Bot já ta tocando em outro lugar");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      switch (subcommand) {
        case "play":
          client.distube.play(voiceChannel, query, {
            textChannel: channel,
            member: member,
          });
          return interaction.reply({ content: "Musica adicionada" });
        case "volue":
          client.distube.setVolume(voiceChannel, volume, {
            textChannel: channel,
            member: member,
          });
          return interaction.reply({ content: `Volume agora é ${volume}%` });
        case "settings":
          const queue = await client.distube.getQueue(voiceChannel);

          if (!queue) {
            embed.setColor("Red").setDescription("Não tem fila nenhuma");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          switch (option) {
            case "skip":
              await queue.skip(voiceChannel);
              embed.setColor("Green").setDescription("Musica pulada");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "stop":
              await queue.stop(voiceChannel);
              embed.setColor("Green").setDescription("Fila parada");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "pause":
              await queue.pause(voiceChannel);
              embed.setColor("Green").setDescription("Musica pausada");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case "resumed":
              await queue.pause(voiceChannel);
              embed.setColor("Green").setDescription("Musica pausada");
              return interaction.reply({ embeds: [embed], ephemeral: true });
              case "queue":
              await queue.pause(voiceChannel);
              embed.setColor("Green").setDescription("Musica pausada");
              return interaction.reply({ embeds: [embed], ephemeral: true });
          }
          return interaction.reply({ content: "Musica adicionada" });
          // assistir https://www.youtube.com/watch?v=AG-aEVqPwqQ&ab_channel=Kaj
      }
    } catch (error) {
      console.log(error);
    }
  },
};
