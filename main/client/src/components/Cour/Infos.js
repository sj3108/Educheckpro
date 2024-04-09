import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import  secureLocalStorage  from  "react-secure-storage";
export default function Infos() {
  const activeRoom = secureLocalStorage.getItem('activeRoom')
  const {title,tags} = activeRoom.cour
  const numbOfChapters = activeRoom.chapitres.length ;
  return (
    <Card sx={{ minWidth: 275, borderRadius :2 }} elevation={5}>
      <CardContent>
        <Typography sx={{  fontFamily : "Nunito" }} variant='subtitle2' color="text.secondary" gutterBottom>
        General information about the class
        </Typography>

        <Typography variant="h6" component="p" sx={{  fontFamily : "Nunito"  }} >
        title : <span style ={{fontFamily:'Nunito' , fontSize: '17px'}}>{title}</span>
        </Typography>
        <Typography variant="h6" sx={{  fontFamily : "Nunito" }}  >
          Tags : <span style ={{fontFamily:'Nunito' , fontSize: '17px'}}>{tags.map((tag) => `#${tag} `)}</span>
        </Typography>
        {/* <Typography variant="h6" sx={{  fontFamily : "Nunito" }} >
         Nombre des chapitres :<span style ={{fontFamily:'Nunito' , fontSize: '17px'}}>{numbOfChapters}</span>
          <br />
        </Typography> */}
      </CardContent>
    </Card>
  );
}
