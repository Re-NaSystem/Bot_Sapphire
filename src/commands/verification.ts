import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import model from '../lib/models/language';
import { client } from '../index';
import { permissionFilter } from '../lib/functions/permissionFilter';

@ApplyOptions<Command.Options>({
  name: 'verification',
  description: 'Setting verification panel'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: 'verification',
      description: 'Setting verification panel',
      options: [
        {
          name: 'type',
          description: 'Verification type',
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'button',
              value: 'button'
            }
          ],
          required: true
        },
        {
          name: 'role',
          description: 'Roles granted upon completion of verification',
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return this.run(interaction);
  }

  private async run(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();

    await permissionFilter(PermissionFlagsBits.ManageGuild, interaction, 'ManageGuild');

    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    const type = interaction.options.getString('type') as 'button';
    const role = interaction.options.getRole('role');

    switch (type) {
      case 'button':
        interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(client.i18n.__('command.verification.button.panel.title'))
              .setDescription(client.i18n.__('command.verification.button.panel.description'))
              .setColor(Colors.Aqua)
              .setFooter({
                text: client.getUserData().footer,
                iconURL: client.getUserData().icon
              })
          ]
        });

        break;
    }
  }
}
