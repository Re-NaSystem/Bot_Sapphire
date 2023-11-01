import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { client } from '../../index';

@ApplyOptions<Listener.Options>({
  name: '',
  event: Events.MessageCreate
})
export class UserEvent extends Listener {
  public async run() {}
}
