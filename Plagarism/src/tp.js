// hooke = require("hookejs")
// // plagiarisedText=`helloooo , I'm siddhi`
// // plagiarisedText =``
// var resultSourceSite=[]
// res=async( plagiarisedText)=>{
//     await hooke.matchPrint({text: plagiarisedText}, resultSourceSite)
//     // console.log(resultSourceSite)
//     // Extract scores and clip them between 0 and 100 
//    let comparedUrlResult = resultSourceSite.map(url => {
//         let parts = url.split("     SCORE   ");
//         let score = parseFloat(parts[1]);
//         return {
//           url: parts[0].trim(),
//           score: Math.min(Math.max(score, 0), 100) // Clip score between 0 and 100
//         };
//       });
      
//       // Sort the array in descending order based on scores
//       comparedUrlResult.sort((a, b) => b.score - a.score);
      
//       // Print the sorted array
//     //   comparedUrl.forEach(item => {
//     //     console.log(`${item.url}     SCORE   ${item.score}`);
//     //   });
//     // console.log("GGGGGGGGGGGGG", comparedUrlResult)
//     return comparedUrlResult

// }



// module.exports = res


// ==============================
const express = require('express')
const hooke = require('hookejs');
const cors= require("cors")
// import cors from 'cors'

const app = express();
const port = 4000;
app.use(cors())
app.use(express.json());

// const res = async (plagiarisedText) => {
//     var resultSourceSite = [];
//     await hooke.matchPrint({text: plagiarisedText}, resultSourceSite);

//     let comparedUrlResult = resultSourceSite.map(url => {
//         let parts = url.split("     SCORE   ");
//         let score = parseFloat(parts[1]);
//         return {
//           url: parts[0].trim(),
//           score: Math.min(Math.max(score, 0), 100) // Clip score between 0 and 100
//         };
//     });
    
//     comparedUrlResult.sort((a, b) => b.score - a.score);
    
//     return comparedUrlResult;
// };

app.post('/check-plagiarism', async (req, res) => {
    try {
        const plagiarisedText = req.body.text;
        var resultSourceSite = [];
         await hooke.matchPrint({text: plagiarisedText}, resultSourceSite);
         let comparedUrlResult = resultSourceSite.map(url => {
          let parts = url.split("     SCORE   ");
          let score = parseFloat(parts[1]);
          return {
            url: parts[0].trim(),
            score: Math.min(Math.max(score, 0), 100) // Clip score between 0 and 100
          };
      });
      comparedUrlResult.sort((a, b) => b.score - a.score);
      console.log("KKKKKKKKK", comparedUrlResult)
        // const result = await res(plagiarisedText);
      res.status(200).json({comparedUrlResult});
    } catch (error) {
        console.log("AAAAAAAAAAA",error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
