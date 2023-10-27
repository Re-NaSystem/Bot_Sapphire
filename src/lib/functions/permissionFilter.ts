import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionResolvable,
} from "discord.js"
import { client } from "../../index"

async function permissionFilter(
  perm: PermissionResolvable,
  interaction: ChatInputCommandInteraction,
  require: string
) {
  if (
    interaction.guild?.members.cache
      .get(interaction.user.id)
      ?.permissions.has(perm)
  ) {
    return;
  } else {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(client.i18n.__("error.missingpermissions.title"))
          .setDescription(
            client.i18n.__("error.missingpermissions.description").replace("{permission}", require)
          )
          .setColor(Colors.Red)
          .setFooter({
            iconURL: client.getUserData().icon,
            text: client.getUserData().footer,
          }),
      ],
    })
  }
}

async function developerFilter(interaction: ChatInputCommandInteraction) {
  if (!process.env.DEVELOPERS.includes(interaction.user.id))
  return await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("権限が不足しています")
        .setDescription(
          `このコマンドはBot管理者専用コマンドです`
        )
        .setColor(Colors.Red)
        .setFooter({
          iconURL: client.getUserData().icon,
          text: client.getUserData().footer,
        }),
    ],
  })
}
export { permissionFilter, developerFilter }