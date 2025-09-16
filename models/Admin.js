// models/Admin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const adminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, adicione um nome'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, adicione um email'],
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
      'Por favor, adicione um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, adicione uma senha'],
    minlength: 6, 
    select: false, 
  },
}, {

  timestamps: true 
});


adminSchema.pre('save', async function(next) {

  if (!this.isModified('password')) {
    next();
  }


  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function(enteredPassword) {

  return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model('Admin', adminSchema);

