import { Schema, model } from 'mongoose';

export default model(
  'language',
  new Schema({
    GuildID: {
      type: String,
      required: true
    },
    ChannelID: {
      type: String,
      required: true
    },
    Webhook: {
      type: {
        WebhookURL: {
          type: String,
          required: true
        },
        WebhookToken: {
          type: String,
          required: true
        },
        WebhookID: {
          type: String,
          required: true
        }
      },
      required: true
    }
  })
);
