import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import model from '../lib/models/language'
import { client } from '../index';
import { ApplicationCommandOptionType, ChannelType, Colors, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';

@ApplyOptions<Command.Options>({
  name: 'language',
  description: 'Language to be set.'
})

export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: 'language',
      description: 'Change the language of the Bot used on the server.',
      options: [
        {
          name: 'language',
          description: 'Language to be set.',
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: '日本語(Japanese)',
              value: 'ja_jp',
            },
            {
              name: 'English(US)',
              value: 'en_us',
            },
          ],
          required: true,
        },
      ],
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return this.run(interaction);
  }

  private async run(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    const member: GuildMember = interaction.guild?.members.cache.get(
      interaction.user.id
    ) as GuildMember;

    if (!member || interaction.channel?.type !== ChannelType.GuildText) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(client.i18n.__('error.unexpectederror.title'))
            .setDescription(client.i18n.__('error.unexpectederror.description'))
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(client.i18n.__('error.missingpermissions.title'))
            .setDescription(
              client.i18n.__('error.missingpermissions.manage_guild')
            )
            .setColor(Colors.Red)
            .setFooter({
              text: client.getUserData().footer,
              iconURL: client.getUserData().icon,
            }),
        ],
      });
    }

    const language = interaction.options.getString('language') as
      | 'ja_jp'
      | 'en_us';

    await model.findOneAndDelete({ GuildID: interaction.guild?.id });

    await model.create({
      GuildID: interaction.guild?.id,
      Language: language,
    });

    client.i18n.setLocale(language);

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.language.title'))
          .setDescription(client.i18n.__('command.language.description'))
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon,
          }),
      ],
    });
  }
}