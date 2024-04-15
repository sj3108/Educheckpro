
import Submission from '../models/submission.js';
import { uploadFile } from './checker.js';
import axios from 'axios'
// res(``)

const url2 = 'http://127.0.0.1:5000/upload';

// await uploadFile(filePath, url2)
//     .then(response => {
//        gp = response.GrammerAndSpellingErrorPercent
//        gc  =response.GrammerAndSpellingErrorCount
//         console.log('File uploaded successfully', response.GrammerAndSpellingErrorCount ,"  ", response.GrammerAndSpellingErrorPercent);
//      });
//      console.log("ppppppppppp", gc , " ",gp)
//      const SubmissionObj = new Submission({
//        owner:idUser,
//        chapitre:idChapitre,
//        file,
//        GrammerErrorPercent: gp,
//        GrammerErrorCount : gc
//      })
//      await SubmissionObj.save();

// =======================

export const languageModels=async(filePath, submissionId)=>{
    let gp=0
    let gc= 0
    let extractedText=""
    try {
    await uploadFile(filePath, url2)
    .then(response => {
               console.log("DDDDDD",response)
               extractedText = response.ExtractedText
                gp = response.GrammerAndSpellingErrorPercent
                gc  =response.GrammerAndSpellingErrorCount
               console.log('File uploaded successfully');
              });
              console.log("ppppppppppp", typeof(gc) , " ",typeof(gp) )
              await Submission.findByIdAndUpdate(submissionId, {$set:{GrammerErrorPercent : gp ,GrammerErrorCount: gc}}, { new: true })
    // let comparedUrlResult =await res(extractedText)
    const response = await axios.post('http://localhost:4000/check-plagiarism', {
      text: extractedText
    });
    const comparedUrlResult = response.data;
    console.log("LLLLLL", response)
    console.log("BBBBBBBBBB",comparedUrlResult)


    // return comparedUrlResult;

    await Submission.findByIdAndUpdate(submissionId, {$set:{ ExternalPlagrism : comparedUrlResult }}, { new: true })
    const sub= await Submission.findById(submissionId)
   console.log("FFFFFFUCK", sub)

   } catch (error) {
    console.log("Error : ", error)     
  }
}
// =======
