import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { client } from '../../index';
import { CacheType, Channel, ChannelType, Guild, GuildBasedChannel, Interaction } from 'discord.js';

@ApplyOptions<Listener.Options>({
  name: 'inviteLogButton',
  event: Events.InteractionCreate
})
export class UserEvent extends Listener {
  public async run(interaction: Interaction<CacheType>) {
    this.createInvite(interaction)
  }

  private async createInvite(interaction: Interaction<CacheType>) {
    if (
      !interaction.isButton() ||
      interaction.channel?.id !== process.env.INVITE_LOG_CHANNEL
    )
      return
    const data = interaction.customId.split("-")
    switch (data[0]) {
      case "invite":
        const guildId = data[1]
        const guild = client.guilds.cache.get(guildId) as Guild
        const channels = guild.channels.cache
          .filter(
            (channel: GuildBasedChannel) =>
              channel
                .permissionsFor(guild.members.me?.id as string)
                ?.has("CreateInstantInvite") &&
              channel.type === ChannelType.GuildText
          )
          .map((channel: Channel) => channel.id)
  
        const channel = client.channels.cache.get(channels[0])
        if (channel?.type !== ChannelType.GuildText || !channel) return
  
        const invite = await channel.createInvite({
          maxAge: 10,
          maxUses: 1,
        })
  
        interaction.reply({
          content: `https://discord.gg/${invite.code}`,
          ephemeral: true,
        })
        break
      case "serverId":
        interaction.reply({
          content: data[1],
          ephemeral: true,
        })
      }
  }
}