import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, ListItem, Typography } from '@mui/material';
import Comment from './Comment';
import Submission from './Submission';
import { useNavigate } from 'react-router-dom';
import "../../../src/index.css";


export default function ListSubmission({submissions}) {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate()
  const handleClick = () => {
    setOpen(!open);
  };
//   const toDetail = () => {
//     navigate(`/active_cour/chaptire/submission/${submissions._id}`)
//  }

  return (
    <List
      sx={{ width: '100%' }}
      component="div"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" sx={{display:"flex",justifyContent:"space-between" ,flexDirection:"row",alignItems:"center"}} >
          <Typography variant='h6' sx={{fontFamily:"Nunito"}}>Submissions</Typography> 
          <Box>
          <ListItemButton onClick={handleClick}>
          {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          </Box>
        </ListSubheader>
      }
      
    >
      <Divider variant="inset"  />

      <Collapse in={open} timeout="auto" unmountOnExit >
        <List component="div" disablePadding sx={{ maxHeight: 300,overflow: 'auto'}} >
        { 
         
            submissions?.length > 0 ? (
            submissions?.slice().reverse().map((item)=> 
            <Submission key={item._id} submission={item}   className="hover-component" />)
      //       className="hover-component"
      // key={item._id}
      // onClick={() => toDetail(item)}
           ) :
           (
           <ListItem>
             More
           </ListItem>
           )
          }
      </List>
      </Collapse>
    </List>
  );
}