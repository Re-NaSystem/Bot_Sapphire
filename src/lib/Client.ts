import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, User } from 'discord.js';
import { I18n } from 'i18n';
import { Player } from 'discord-player';
import mongoose from 'mongoose';
import { AppleMusicExtractor, ReverbnationExtractor, SoundCloudExtractor, SpotifyExtractor, VimeoExtractor } from '@discord-player/extractor';

export class ExtendedClient extends SapphireClient {
	constructor() {
		super({
			defaultPrefix: 're:',
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			intents: [
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates
			],
			loadMessageCommandListeners: true
		});

		this.connect();
	}

	public i18n = new I18n({
		locales: ['ja_jp', 'en_us'],
		defaultLocale: 'ja_jp',
		directory: __dirname + '/../i18n',
		objectNotation: true
	});

	public player = new Player(this);

	public connect() {
		if (!process.env.MONGODB_CONNECTION_STRING) return false;
		return mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
	}

	public getUserData(userId?: string) {
		const user: User | undefined = this.users.cache.get(userId || '1004365048887660655');

		return {
			icon: user?.avatarURL(),
			username: user?.username,
			usertag: user?.tag,
			userId: user?.id,
			footer: `Produced by ${user?.tag}`
		} as {
			icon: string;
			username: string;
			usertag: string;
			userId: string;
			footer: string;
		};
	}
}
