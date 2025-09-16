// Arquivo: models/EmailSubscription.js

import mongoose from 'mongoose'; // Use import

const EmailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,

    match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const EmailSubscription = mongoose.model('EmailSubscription', EmailSubscriptionSchema);


export default EmailSubscription; 

