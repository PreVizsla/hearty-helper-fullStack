import mongoose from 'mongoose';


// expireAt will automatically remove the data from the mongo cluster
const sessionSchema = mongoose.Schema({
    sid: { type: String, required: true },
    id: { type: String },
    
    expireAt: {
        type: Date,
        default: Date.now,
        index: {expires: '20s'}
    }

})

export default mongoose.model("Session", sessionSchema);