import { Schema, model } from 'mongoose';

export default model(
  'language',
  new Schema({
    GuildID: String,
    Language: String
  })
);
