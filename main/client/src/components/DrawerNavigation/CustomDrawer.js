import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Avatar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { deepOrange, deepPurple } from '@mui/material/colors';
import * as React from 'react';
import { Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { getUserFromJWT } from '../../utils/User';
import * as CustomStyles from './styles';
import './styles.css';
export default function CustomDrawer() {
  const user = getUserFromJWT()
  const activeRoom = secureLocalStorage.getItem('activeRoom')

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 270 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{ ...CustomStyles.drawerItem, bgcolor: '#f0ece1' }} >
        <Avatar alt='First letter of email' sx={{ bgcolor: deepOrange[500], mr: 1 }}  >{user?.firstName.toUpperCase().charAt(0)}</Avatar>
        {user?.firstName}</Box>
        
      <Typography sx={{ ...CustomStyles.drawerItem }} component={Link} to="/">
        <HomeIcon sx={{ mr: 1, color: "#777a7c" }} fontSize="large" />Courses
      </Typography>

      {/* <Typography sx={{ ...CustomStyles.drawerItem }} component={Link} >
        <EventAvailableIcon sx={{ mr: 1, color: "#777a7c" }} fontSize="large" />Agenda
      </Typography> */}

      <Divider sx={{ bgcolor: '#b2b9be' }} />
      {
        (activeRoom) ? (
          <>
            <Box sx={{ ...CustomStyles.drawerItem }} component={Link} to="/active_cour">
              <Avatar alt='First letter of email' sx={{ bgcolor: deepPurple[500], mr: 1 }} className='gradient-custom-3'  >{activeRoom.cour.title? activeRoom.cour.title.toUpperCase().charAt(0) :''}</Avatar>
              {activeRoom.cour.title? activeRoom.cour.title.toUpperCase().charAt(0) + activeRoom.cour.title.slice(1) : ''}
            </Box>
           
            {
              user?.isProfesseur &&
              <Typography sx={{ ...CustomStyles.drawerItem }} component={Link} to="/statics">
                <AutoGraphIcon sx={{ mr: 1, color: "#777a7c" }} fontSize="large" />Statistiques
              </Typography>
            }
          </>
        )
          : (
            <Box sx={{ ...CustomStyles.drawerItem }} component={Link} to="/">
              <Avatar alt='First letter of email' sx={{ bgcolor: deepPurple[400], mr: 1, fontWeight: 'bold' }}  >!</Avatar>
              {
                user?.isProfesseur ? 'Create or choose yard' : 'Join or choose course'
              }
            </Box>
          )
      }


    </Box>
  );

  return (

    <>
      <MenuOpenIcon fontSize='medium' sx={{ color: 'white' }} onClick={toggleDrawer('left', true)} />
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
    </>

  );
}
