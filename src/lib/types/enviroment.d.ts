declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string;
			MONGODB_CONNECTION_STRING: string;
			DEVELOPERS: string[];
		}
	}
}

export {};
