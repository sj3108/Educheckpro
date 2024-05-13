import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TopicIcon from '@mui/icons-material/Topic';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import secureLocalStorage from 'react-secure-storage';
import { getUserFromJWT } from '../../utils/User';
import Chapitres from './Chapitres';
import EditorCour from './EditorCour';
import EditorNotes from './EditorNotes';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function BasicTabs() {
    const [currentChapId, setCurrentChapId] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const activeRoom = secureLocalStorage.getItem('activeRoom')
    const currentChapitre = currentChapId ? activeRoom.chapitres.find((chap) => chap._id === currentChapId) : null;

    const user = getUserFromJWT()
    const isProfesseur = user?.isProfesseur


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleAddAssignmentClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleAddAssignmentClose = () => {
        setAnchorEl(null);
    };
    const handleAddAssignmentRedirect = () => {


    };

    return (
        <div >
            {
                isProfesseur ? <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="gestion cours">
                            <Tab icon={<TopicIcon fontSize='large' />} label="Class" sx={{ minWidth: "33%", fontFamily: 'Nunito' }} />
                            <Tab
                                icon={<AddRoundedIcon fontSize='large' />}
                                label="Add Assignment"
                                aria-controls="add-assignment-menu"
                                aria-haspopup="true"
                                onClick={handleAddAssignmentClick}
                                sx={{ minWidth: "33%", fontFamily: 'Nunito' }}
                            />
                            <Tab
                                icon={<AddRoundedIcon fontSize='large' />}
                                label="Add Notes"
                                aria-controls="add-assignment-menu"
                                aria-haspopup="true"
                                onClick={handleAddAssignmentClick}
                                sx={{ minWidth: "33%", fontFamily: 'Nunito' }}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0} >
                        <Chapitres setCurrentChapId={setCurrentChapId} setValue={setValue} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <EditorCour currentChapitre={currentChapitre} currentChapId={currentChapId} setCurrentChapId={setCurrentChapId} activeRoom={activeRoom} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <EditorNotes currentChapitre={currentChapitre} currentChapId={currentChapId} setCurrentChapId={setCurrentChapId} activeRoom={activeRoom} />
                    </TabPanel>
                </Box>
                    :
                    <div style={{ marginTop: "20px" }}>
                        <Chapitres />
                    </div>
            }
        </div>
    )
}
