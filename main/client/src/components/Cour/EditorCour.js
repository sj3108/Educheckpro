import React, { useState, useRef, useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Stack, TextField } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useDispatch } from 'react-redux';
import { addChapitreToRoom } from '../../actions/rooms';
import { updateChapitre } from '../../actions/chapitres';
import JoditEditor from 'jodit-react';
import { getUserFromJWT } from '../../utils/User'



function EditorCour({ currentChapId, setCurrentChapId, currentChapitre, activeRoom }) {

  useEffect(() => {

    if (currentChapitre) {
      setTitreChap(currentChapitre?.title)
      setHtmlContent(currentChapitre?.contenu)
    }
  }, [currentChapitre]);


  const editor = useRef(null);
  const config =
  {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    height: 400,
    "uploader": {
      "insertImageAsBase64URI": false,

    },
    "disablePlugins": "file,about"
    // apres il faut faire "disablePlugins": "file,about,video" 
    // supprimer insertImageAsBase64URI et uploader car taille va etre  tres grande de chap crees cela ghy2tar 3la performance
    // dik localstorage securestorage adom limite !!!!!!!!
  }

  const [htmlContent, setHtmlContent] = useState('')

  const [titreChap, setTitreChap] = useState('')
  const [totalMark, setTotalMark] = useState('')
  const [error, setError] = useState('')
  const [file, setFile] = useState()
  const dispatch = useDispatch()
  const user = getUserFromJWT()

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSend = async () => {
    // if (!file) {
    //   console.log("no file selected")
    //   return
    // }
    let uname = user.firstName + '_' + user.lastName
    if (titreChap.trim().length < 1) setError('The title must not be empty.')
    else if (htmlContent.length > 0) {
      setError('')
      if (currentChapId === 0) {
        dispatch(addChapitreToRoom({ idRoom: activeRoom._id, title: titreChap, contenu: htmlContent, isProfesseur: user.isProfesseur, username: uname, totalMark: totalMark, file: file }))
      }
      else dispatch(updateChapitre({ idRoom: activeRoom, title: titreChap, contenu: htmlContent, id: currentChapitre._id, isProfesseur: user.isProfesseur, username: uname, totalMark: totalMark, file: file }))
    }
  }

  const handleClear = () => {
    setHtmlContent('')
    setTitreChap('')
    setCurrentChapId(0)
    setTotalMark('')
  }

  return (
    <Box >
      <TextField fullWidth variant='outlined' label="Add title" required style={{ marginBottom: '20px' }}
        value={titreChap}
        onChange={(e) => setTitreChap(e.target.value)}
        helperText={error}
      />
      <TextField fullWidth variant='outlined' label="Total Marks" required style={{ marginBottom: '20px' }}
        value={totalMark}
        onChange={(e) => setTotalMark(e.target.value)}
        helperText={error}
      />

      {/* <TextField
        fullWidth  label="Add Content" required style={{ marginBottom: '10px' , height:'6.0em' }}
        ref={editor}
        value={htmlContent}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setHtmlContent(newContent)} // preferred to use only this option to update the content for performance reasons
      /> */}
      <JoditEditor
        ref={editor}
        value={htmlContent}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setHtmlContent(newContent)} // preferred to use only this option to update the content for performance reasons
      />
      <div style={{ marginTop: '20px' }}>
        <input type='file' style={{ display: 'none' }} id='fileInput' onChange={handleFileSelect} />
        <label htmlFor='fileInput' style={{ cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>{file ? file.name : 'Choose File'} </label>
      </div>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", marginTop: 2 }} >
        <Button variant="contained" endIcon={<HighlightOffOutlinedIcon />} color="error" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="contained" endIcon={<SendIcon />} color="success" onClick={handleSend}>
          {currentChapId ? 'Update' : "send"}
        </Button>
      </Stack>

    </Box>
  )
}

export default EditorCour