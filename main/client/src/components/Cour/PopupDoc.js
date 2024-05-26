import React from 'react';
import { Button } from '@mui/material';
import sad from '../../images/sad.png';

function PopupDoc(fileDetail) {
  const handleClick = async () => {
    const file = fileDetail.uri[0];
    const { uri, fileName } = file;
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
      case 'jpg':
      case 'jpeg':
      case 'png':
        // Open these files in a new window/tab
        window.open(uri, 'File_Popup', 'width=1000,height=1000');
        break;
      case 'pptx':
      case 'docx':
        displayNoPreviewAvailable(uri, fileName);
        break;
      default:
        alert('Unsupported file type');
    }
  };

  const displayNoPreviewAvailable = (uri, fileName) => {
    const win = window.open('', 'File_Popup', 'width=700,height=500');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>No Preview Available</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .container {
                padding: 20px;
                text-align: center;
                background-color: #fff; /* White background for the content */
                border-radius: 10px; /* Rounded corners */
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Shadow effect */
                animation: shake 0.5s ease-in-out; /* Animation added here */
              }
              /* Add the animation keyframes here */
            @keyframes shake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              50% { transform: translateX(5px); }
              75% { transform: translateX(-5px); }
              100% { transform: translateX(0); }
            }
              h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 10px;
              }
              .message {
                color: #555;
                font-size: 18px;
                margin-bottom: 20px;
              }
              .button-container {
                margin-top: 20px;
              }
              .file-name {
                color: #007bff; /* Blue color */
                font-style: italic; /* Italic style */
                text-decoration: none; /* Remove underline */
                cursor: default; /* Default cursor */
              }
              button {
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
              }
              button:hover {
                background-color: #0056b3;
              }
              .download-icon {
                font-size: 1.2em;
              }
              .sad-image {
                width: 35px; /* Adjust size as needed */
                margin-right: 5px; /* Add margin for spacing */
                vertical-align: middle;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1><img src="${sad}" alt="Sad Icon" class="sad-image"/> <span>No Preview Available</span></h1>
              <p class="message">Filename: <span class="file-name">${fileName}</span></p>
              <p class="message">File type not supported for preview.</p>
              <div class="button-container">
                <a href="${uri}" download="${fileName}" style="text-decoration: none;">
                  <button>
                  <span class="download-icon">\u2B07</span> Download ${fileName}
                  </button>
                </a>
              </div>
            </div>
          </body>
        </html>
      `);
    } else {
      alert('Please allow pop-ups to download the file.');
    }
  };




  return (
    <>
      <Button onClick={handleClick} style={{ color: 'blue' }}>
        {fileDetail.uri[0].fileName}
      </Button>
    </>
  );
}

export default PopupDoc;
