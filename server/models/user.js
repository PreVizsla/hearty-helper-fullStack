import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    uid: { type: String },
    name: { type: String, required: true},
    email: {type: String, required:true},
    password: { type: String, required: true},
    sessionHistory: [],

})

export default mongoose.model("User", userSchema);