import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import model from '../lib/models/language';
import { client } from '../index';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Colors,
  EmbedBuilder,
  Guild,
  PermissionFlagsBits,
  TextChannel,
  WebhookClient
} from 'discord.js';
import { permissionFilter } from '../lib/functions/permissionFilter';
import gchat_model from '../lib/models/gchat';
import { embedSlashCommand } from '../lib/functions/embedSlashCommand';

@ApplyOptions<Command.Options>({
  name: 'gchat',
  description: 'Rena-Global Management'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'connect',
          description: 'Connect to Rena-Global',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'channel',
              description: 'Channels connecting to Rena-Global',
              type: ApplicationCommandOptionType.Channel,
              channelTypes: [ChannelType.GuildText]
            }
          ]
        }
      ]
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return this.run(interaction);
  }

  private async run(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.guild) return;

    const language_data = await model.findOne({ GuildID: interaction.guild?.id });
    if (language_data) client.i18n.setLocale(language_data.Language as string);

    permissionFilter(PermissionFlagsBits.ManageGuild, interaction, 'ManageGuild');

    const channel = interaction.channel as TextChannel;
    const guild = interaction.guild as Guild;

    switch (interaction.options.getSubcommand()) {
      case 'connect':
        const data = await gchat_model.findOne({
          GuildID: guild.id
        });

        if (data) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle(client.i18n.__('command.gchat.connect.already_registed.title'))
                .setDescription(
                  client.i18n.__('command.gchat.connect.already_registed.description').replace('{command}', embedSlashCommand('gchat connect'))
                )
                .setColor(Colors.Red)
                .setFooter({
                  iconURL: client.getUserData().icon,
                  text: client.getUserData().footer
                })
            ],
            ephemeral: true
          });
        }

        const webhook = await channel.createWebhook({
          name: 'Rena-Global Manager',
          avatar: client.user?.avatarURL() as string,
          reason: `Rena-Global connected by ${interaction.user.tag}(${interaction.user.id})`
        });

        gchat_model
          .create({
            GuildID: guild.id,
            ChannelID: channel.id,
            Webhook: {
              WebhookURL: webhook.url,
              WebhookToken: webhook.token,
              WebhookID: webhook.id
            }
          })
          .then(async () => {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(client.i18n.__('command.gchat.connect.success.title'))
                  .setDescription(client.i18n.__('command.gchat.connect.success.description'))
                  .setColor(Colors.Aqua)
                  .setFooter({
                    iconURL: client.getUserData().icon,
                    text: client.getUserData().footer
                  })
              ]
            });

            client.guilds.cache.forEach(async (guild) => {
              if (guild.id === interaction.guild?.id) return;

              const data = await gchat_model.findOne({ GuildID: guild.id });
              if (!data) return;

              const webhook = new WebhookClient({
                url: data.Webhook.WebhookURL
              });

              if (!webhook) return;

              webhook
                .send({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle(client.i18n.__('command.gchat.connect.connected').replace('{guild}', interaction.guild?.name as string))
                      .setColor(Colors.Aqua)
                      .setFooter({
                        iconURL: client.getUserData().icon,
                        text: client.getUserData().footer
                      })
                  ],
                  avatarURL: interaction.guild?.iconURL() as string,
                  username: interaction.guild?.name
                })
                .catch();
            });
          })
          .catch(async (e) => {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(client.i18n.__('command.gchat.connect.failed'))
                  .setDescription(e as string)
                  .setColor(Colors.Aqua)
                  .setFooter({
                    iconURL: client.getUserData().icon,
                    text: client.getUserData().footer
                  })
              ]
            });
          });
        break;
    }
  }
}
