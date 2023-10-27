import './lib/setup';
import { ExtendedClient } from './lib/Client';
import { EmbedBuilder, Colors } from 'discord.js';

export const client = new ExtendedClient()

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();

client.player.events.on('playerStart', (queue, track) => {
  queue.metadata.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(
          client.i18n
            .__('command.track.event.playing')
            .replace('{track}', track.title)
        )
        .setThumbnail(track.thumbnail)
        .setColor(Colors.Green)
        .setFooter({
          text: client.getUserData().footer,
          iconURL: client.getUserData().icon,
        }),
    ],
  });
});