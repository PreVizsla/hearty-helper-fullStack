import mongoose from 'mongoose';

const CounterSchema = mongoose.Schema({
    seq_value: {type: Number}
})

export default mongoose.model("Counter", CounterSchema);