import mongoose from 'mongoose';


// expireAt will automatically remove the data from the mongo cluster
const sessionSchema = mongoose.Schema({
    creator: { type: String, required: true},
    patientName: { type: String, required: true},
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    token: { type: String, required: true},

})

// sessionSchema.index({expireAt: 1}, {expireAfterSeconds:0});

//TODO functions
// 1. generate token
// 2. self-check status per second

export default mongoose.model("Session", sessionSchema);   