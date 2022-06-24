import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    sid: { type: String, required: true },
    id: { type: String }

})

export default mongoose.model("Session", sessionSchema);