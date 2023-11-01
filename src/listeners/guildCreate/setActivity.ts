import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Colors, EmbedBuilder, Guild } from 'discord.js';
import { client } from '../..';

@ApplyOptions<Listener.Options>({
  name: 'setActivity',
  event: Events.GuildCreate
})
export class UserEvent extends Listener {
  public async run(guild: Guild) {
    this.changeStatus();
  }

  private async changeStatus() {
    client.user?.setActivity({
      name: `/help | ${client.guilds.cache.size} servers`
    });
  }
}
