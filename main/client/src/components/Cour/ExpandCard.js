import React, { useState } from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import * as Colors from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import SyncIcon from '@mui/icons-material/Sync';
import { useDispatch } from 'react-redux';
import secureLocalStorage from "react-secure-storage";
import { generer_nouveau_codeRoom } from '../../actions/rooms';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListeImages from './ListeImages';
import Swal from 'sweetalert2';
import { updateTheme } from '../../actions/cours';
import { getUserFromJWT } from '../../utils/User';

// Style
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function ExpandCard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentTheme, setCurrentTheme] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const user = getUserFromJWT();
    const activeRoom = secureLocalStorage.getItem('activeRoom');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentTheme(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClickVariant = (variant) => () => {
        navigator.clipboard.writeText(activeRoom?.code_room);
        enqueueSnackbar('Copied to clipboard!', { variant });
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const generateNewCode = () => {
        dispatch(generer_nouveau_codeRoom({ idRoom: activeRoom?._id }));
    };

    const handlePersonnaliseTheme = (event) => {
        if (currentTheme) {
            dispatch(updateTheme({ theme: currentTheme, idRoom: activeRoom?._id, idCour: activeRoom?.cour._id }));
        } else {
            Swal.fire('Choose a theme!', '', 'error');
        }
        handleClose();
        setCurrentTheme(null);
    };

    return (
        <Card sx={{ borderRadius: 5, maxHeight: '600px' }} elevation={4}>
            <CardContent style={{ position: 'relative', padding: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '10px', backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: Colors.red[500], marginLeft: '10px', fontSize: '24px' }} aria-label="cour">
                                {activeRoom.cour.title ? activeRoom.cour.title.toUpperCase().charAt(0) : ''}
                            </Avatar>
                        }
                        title={<Typography variant="h5">{activeRoom?.cour?.title}</Typography>}
                        subheader={<Typography variant="subtitle1" style={{ fontSize: '13px' }}>{moment(activeRoom?.cour?.createdAt).format('DD MMM YYYY')}</Typography>}
                        style={{ padding: '5px' }}
                    />
                </div>
                <div style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
                    <img
                        src={activeRoom?.cour?.theme || 'https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg?size=626&ext=jpg'}
                        alt="Theme of class"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', marginBottom: '-9px' }}
                    />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 5, right: 15, width: '100%', padding: 0 }}>
                    <CardActions disableSpacing style={{ backdropFilter: 'blur(0.1px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', marginLeft: '-5px' }}>
                        {user?.isProfesseur && (
                            <>
                                <IconButton onClick={handleClickVariant('success')} >
                                    <Tooltip title="Copy the class code" arrow={true} >
                                        <ContentCopyTwoToneIcon style={{ fontWeight: 'bold' }} />
                                    </Tooltip>
                                </IconButton>
                                <IconButton aria-label="reload_code" onClick={generateNewCode}>
                                    <Tooltip title="Request a new class code." arrow={true} >
                                        <SyncIcon style={{ fontWeight: 'bold' }} />
                                    </Tooltip>
                                </IconButton>
                                <Button
                                    startIcon={<BorderColorIcon />}
                                    variant="outlined"
                                    onClick={handleClick}
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.7)', // Slight black
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight white with transparency
                                        backdropFilter: 'blur(0.1px)', // Background blur effect
                                        borderRadius: '5px', // Rounded corners
                                    }}
                                >
                                    Customise
                                </Button>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <ListeImages setCurrentTheme={setCurrentTheme} currentTheme={currentTheme} />
                                    <div id="actionPopover" >
                                        <Button variant='contained' style={{ color: '#fff', backgroundColor: Colors.green[500] }} onClick={handlePersonnaliseTheme}>Change</Button>
                                        <Button variant='contained' style={{ color: '#fff', backgroundColor: Colors.orange[500] }} onClick={handleClose} >Cancel</Button>
                                    </div>
                                </Popover>
                            </>
                        )}
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                </div>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent style={{ marginLeft: '15px' }}>
                    {user?.isProfesseur && (
                        <Typography variant='h6' color="crimson" ><u>Class code</u> : <span style={{ color: 'black', fontSize: '16px' }}>{activeRoom?.code_room}</span></Typography>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography variant='h6' color="crimson" style={{ marginRight: '10px' }}><u>Description</u> : </Typography>
                        <Typography paragraph style={{ marginTop: '15px', fontSize: '17px', textAlign: 'center' }}>{activeRoom?.cour.description ? activeRoom?.cour.description : "No description"}</Typography>
                    </div>
                </CardContent>
            </Collapse>
        </Card >
    );
}

export default ExpandCard;
