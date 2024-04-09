import mongoose from "mongoose";

const ChapitreSchema = mongoose.Schema({
    title : { type : String , required : true} ,
    contenu : { type : String , required : true} ,
    createdAt : {type : Date , default : new Date()} , 
    file : {  type : String, required : true},
    TotalMarks : {type : Number}
})
export default mongoose.model('Chapitre',ChapitreSchema )