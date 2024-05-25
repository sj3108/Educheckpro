import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import decode from 'jwt-decode';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { LOGOUT } from '../../constants/actionTypes';
import logo from '../../images/logo.png';
import { getUserFromJWT } from '../../utils/User';
import CustomDrawer from '../DrawerNavigation/CustomDrawer';
import * as CustomStyles from './styles';

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUserFromJWT()
  const dispatch = useDispatch()


  useEffect(() => {

    let token = secureLocalStorage.getItem('token')
    if (token) {
      const decodedToken = decode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logOut()
      }
    }
  }, [location])

  const logOut = () => {
    dispatch({ type: LOGOUT })
    // user = null 
    navigate('/auth')
  }


  return (
    <>
      {user && (
        <AppBar sx={{ ...CustomStyles.appBar }} position="static" color="inherit" >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {user && (
              <IconButton sx={{ ...CustomStyles.absoluteBtnDrawer }} className='gradient-custom'  >
                <CustomDrawer />
              </IconButton>
            )
            }
            <div style={{ ...CustomStyles.brandContainer }} >
              <img style={{ objectFit: 'cover', marginLeft: 9, cursor: "pointer" }} src={logo} alt="logo" height="62px" onClick={() => navigate('/')} />
            </div>
          </div>
          <Toolbar>
            {user && (
              <Box sx={{ ...CustomStyles.profile }} >
                <Avatar sx={{ ...CustomStyles.purple }}  >{user?.firstName.charAt(0).toUpperCase()}</Avatar>
                <Typography sx={{ ...CustomStyles.userName }} variant='h6'>
                  {user?.firstName + " " + user?.lastName.charAt(0).toUpperCase() + "."}
                </Typography>
                <Button variant='contained' sx={{ ...CustomStyles.logout }} color='secondary' onClick={logOut} >Logout</Button>
              </Box>
            )
            }
          </Toolbar>
        </AppBar>
      )}
    </>
  )
}

export default Navbar