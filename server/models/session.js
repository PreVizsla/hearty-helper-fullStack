import mongoose from 'mongoose';


// expireAt will automatically remove the data from the mongo cluster
const sessionSchema = mongoose.Schema({
    sid: { type: String, required: true },
    id: { type: String },

    duration: {type: Number},
    // expireAt: {
    //     type: Date,
    //     default: Date.now,
    //     index: {expires: '120s'}
    // }

    expireAt: {
        type: Date,
        default: undefined
    }
})

sessionSchema.index({expireAt: 1}, {expireAfterSeconds:0});

export default mongoose.model("Session", sessionSchema);   