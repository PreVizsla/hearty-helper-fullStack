import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    id: { type: String, required: true }
})

export default mongoose.model("Session", sessionSchema);