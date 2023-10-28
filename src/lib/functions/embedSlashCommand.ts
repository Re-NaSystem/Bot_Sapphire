import { client } from '../../index';

function embedSlashCommand(commandName: string) {
  const command = client.application?.commands.cache.find((command) => command.name === commandName);

  if (!command) throw new Error('Command not found');
  return `</${command.name}:${command.id}>`;
}

export { embedSlashCommand };
