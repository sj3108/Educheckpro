// const fs = require('fs');
import fs from "fs";


const createDirectory= (directoryPath)=> {
    directoryPath= 'D:/MY OWN PROJECT/classroom/main/server/uploads/'+directoryPath
    console.log("zzzzzzz",directoryPath)

    fs.mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
        } else {
            console.log('Directory created successfully');
        }
    });
}

// Example usage:
export default createDirectory
