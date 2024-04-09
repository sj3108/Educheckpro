import axios from 'axios';
import FormData from 'form-data';
import fs from "fs";

// const FormData = require('form-data');
// const fs = require('fs');

export const uploadFile= async(filePath, url)=>{
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    // Additional headers you want to set
    const headers = {
        'Content-Type': 'multipart/form-data', // Ensure the correct content type for multipart form data
    };
   console.log("HIIII")
   const result =await axios.post(url, formData, {
    headers: {
        ...formData.getHeaders(), // Include proper headers for multipart form data
        ...headers // Include additional headers
    }
   });
//    console.log(result.data)
    // Make a POST request to the specified URL
    return result.data
}

// export default uploadFile
