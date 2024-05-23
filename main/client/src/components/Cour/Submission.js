import { Box, Avatar, Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { blue, green, orange, pink, purple, red, yellow } from '@mui/material/colors';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { delete_comment } from '../../actions/comments';
import { getUserFromJWT } from '../../utils/User';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios'

const getRandomColor = () => {
  const colors = [blue[500], green[500], orange[500], pink[500], purple[500], red[500], yellow[500]];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};


function Submission({ submission }) {
  const color = getRandomColor();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [submissionsArray, setSubmissionsArray] = useState([submission]);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch()
  // const submissions = secureLocalStorage.getItem('CurrentSubmissions')
  //const user = JSON.parse(localStorage.getItem('user'))
  const user = getUserFromJWT()
  const navigate = useNavigate()


  const toDetail = () => {
    const currentSubmissions = secureLocalStorage.setItem('CurrentSubmission', submission)
    navigate(`/active_cour/chaptire/submission/${submission._id}`)
  }

  const fetchSubmissionData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rooms/getSubmissionById/${submission._id}`);
      console.log(response.data.submission.ObtainedMarks);
      setSubmissionData(response.data.submission.ObtainedMarks);
      //console.log(submissionsArray);
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (!user) navigate('/auth')
    fetchSubmissionData();
    setSubmissionsArray((prevSubmissions) => {
      if (!prevSubmissions.some((sub) => sub._id === submission._id)) {
        return [...prevSubmissions, submission];
      }
      return prevSubmissions;
    });
  }, [submission, fetchSubmissionData, navigate])

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <ListItem alignItems="flex-start" sx={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }} onClick={toDetail}  >
        <>
          <ListItemAvatar>
            <Avatar sx={{ color: "#fff", backgroundColor: color }} >{submission?.owner.firstName.charAt(0).toUpperCase()}</Avatar>
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
                  marginLeft={'5px'}
                >
                  Subimtted at: {moment(submission?.createdAt).format("DD MMM YYYY , h:mm:ss a")}
                </Typography>
                <br />
              </>
            }
          />
        </>
        {
          user?.isProfesseur && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                top: '13px',
                width: '200px', // Fixed width to ensure the box remains in the same position
                gap: '10px'
              }}
            >
              <Box
                sx={{
                  whiteSpace: 'nowrap', // Prevents text from wrapping
                  marginRight: '10px',
                }}
              >
                <Typography variant="body1">Marks Obtained:</Typography>
              </Box>
              <Box>
                <Typography variant="body1">
                  {submissionData ? submissionData : 'N/A'}
                </Typography>
              </Box>
            </Box>
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
      <Divider variant="middle" />
    </>
  )
}

export default Submission