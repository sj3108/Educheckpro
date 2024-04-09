import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button } from '@mui/material';


function PopupDoc(fileDetail) {
  const handleClick =()=>{
    // Define dimensions for the popup window
    const width = 1000;
    const height = 1000;
    const left = (window.innerWidth) ;
    const top = (window.innerHeight);

    // Open the PDF file in a popup window
    window.open(fileDetail.uri[0].uri, 'PDF_Popup', `width=${width}, height=${height}, left=${left}, top=${top}`);
  }
  return(
  <>
  <Button onClick={handleClick} >{fileDetail.uri[0].fileName}</Button>
  {/* <Popup trigger={<button> Trigger</button>} position="right center">
    <div>
  
    </div>
  </Popup> */}
  </>
  )
};

export default PopupDoc