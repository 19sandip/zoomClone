import {Schema} from "mongoose";


const meetingSchema = new Schema({
    title : {
        type : String,
        requred : true
    },
    user_id : {
        type : String,
        required : true
    },
    meetingCode : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
         default : Date.now,
          required : true
    }

})

const Meeting = mongoose.model("meeting", meetingSchema);
export {
    Meeting
}