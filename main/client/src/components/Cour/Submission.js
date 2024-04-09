import { Avatar, Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { delete_comment } from '../../actions/comments';
import { getUserFromJWT } from '../../utils/User';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

function Submission({ submission }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  // const submissions = secureLocalStorage.getItem('CurrentSubmissions')
  //const user = JSON.parse(localStorage.getItem('user'))
  const user = getUserFromJWT()
  const navigate = useNavigate()
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

const toDetail = () => {
  const currentSubmissions = secureLocalStorage.setItem('CurrentSubmission', submission)
  navigate(`/active_cour/chaptire/submission/${submission._id}`)
 
  console.log("I'M CLICKEDS")
}


  return (
    <>
      <ListItem alignItems="flex-start" sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }} onClick={toDetail}  >
        <>
          <ListItemAvatar>
            <Avatar sx={{ color: "#fff", backgroundColor: "#78a" }} >{submission?.owner.firstName.charAt(0).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={submission?.owner.firstName + " " + submission?.owner.lastName}
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {moment(submission?.createdAt).format("DD MMM YYYY , h:mm:ss a")}
                </Typography>
                <br />
                <Typography component="span" style={{ wordBreak: 'break-word' }}>
                  {
                    submission?.file
                  }
                </Typography>

              </>
            }
          />
        </>

        {
          user?.isProfesseur && (

            <div >
              {/* MARKS OBTAINED HERE */}
              <>marks obtained/total marks</>
              {/* <ListItemButton onClick={handleOpenMenu}>
                <MoreVertOutlinedIcon />
              </ListItemButton> */}
            </div>
          )
        }
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {/* <MenuItem onClick={handleDelete}>Supprimer</MenuItem> */}
        </Menu>



      </ListItem>
      <Divider variant="inset" />
    </>
  )
}

export default Submission