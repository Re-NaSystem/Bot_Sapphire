import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import {
	ApplicationCommandOptionType,
	ChannelType,
	Colors,
	EmbedBuilder,
	GuildMember,
	Message,
	PermissionFlagsBits,
	PermissionsBitField
} from 'discord.js';
import model from '../lib/models/language';
import { client } from '../index';
import { permissionFilter } from '../lib/functions/permissionFilter';
import { unExpectedError } from '../lib/functions/unExpectedError';

@ApplyOptions<Command.Options>({
	name: 'purge',
	description: 'Purge the specified number of messages.'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: 'purge',
			description: 'Purge the specified number of messages.',
			options: [
				{
					name: 'amount',
					description: 'Number of messages to delete(Default: 10).',
					maxValue: 100,
					min_value: 1,
					type: ApplicationCommandOptionType.Number,
					required: false
				}
			]
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return this.run(interaction);
	}

	private async run(interaction: Command.ChatInputCommandInteraction) {
		const data = await model.findOne({ GuildID: interaction.guild?.id });
		if (data) client.i18n.setLocale(data.Language as string);

		const member: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;

		if (!member || interaction.channel?.type !== ChannelType.GuildText) return unExpectedError(interaction);
		await permissionFilter(PermissionFlagsBits.ManageMessages, interaction, 'ManageMessages');

		await interaction.channel.bulkDelete(interaction.options.getNumber('amount') || 10);

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(client.i18n.__('command.purge.success.title'))
					.setDescription(
						client.i18n
							.__('command.purge.success.description')
							.replace('{messages}', `${interaction.options.getNumber('amount') || '10'}`)
					)
					.setColor(Colors.Green)
					.setFooter({
						text: client.getUserData().footer,
						iconURL: client.getUserData().icon
					})
			]
		});
	}
}
