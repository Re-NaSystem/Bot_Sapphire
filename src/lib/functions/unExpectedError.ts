import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from "discord.js"
import { client } from "../../index"


async function unExpectedError(interaction: ChatInputCommandInteraction) {
  if (!process.env.DEVELOPERS.includes(interaction.user.id))
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
export { unExpectedError }