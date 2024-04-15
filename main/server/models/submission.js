import mongoose from "mongoose";

const SubmissionSchema = mongoose.Schema({
    owner : { type : mongoose.Schema.Types.ObjectId ,ref : 'User', required : true} ,
    chapitre : {type : mongoose.Schema.Types.ObjectId ,ref : 'Chapitre', required : true} ,
    createdAt : {type : Date , default : new Date()} , 
    file : {  type : String, required : true},
    GrammerErrorPercent:{ type : Number},
    GrammerErrorCount:{ type : String },
    ExternalPlagrism:{ type :[Object]},
    ObtainedMarks:{ type: Number}
})
export default mongoose.model('Submission',SubmissionSchema )

