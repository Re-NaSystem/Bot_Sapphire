import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, Colors, EmbedBuilder, Message } from 'discord.js';
import model from '../lib/models/language';
import { client } from '../index';

@ApplyOptions<Command.Options>({
  name: 'ping',
  description: 'Measure the response speed of the bot.'
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return this.run(interaction);
  }

  private async run(interaction: Command.ChatInputCommandInteraction) {
    const data = await model.findOne({ GuildID: interaction.guild?.id });
    if (data) client.i18n.setLocale(data.Language as string);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__('command.ping.title'))
          .setDescription(client.i18n.__('command.ping.description').replace('{ping}', client.ws.ping.toString()))
          .setColor(Colors.Aqua)
          .setFooter({
            text: client.getUserData().footer,
            iconURL: client.getUserData().icon
          })
      ],
      allowedMentions: {
        parse: []
      }
    });
  }
}
