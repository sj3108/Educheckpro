import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signin, signup } from '../../actions/auth';
import { getUserFromJWT } from '../../utils/User';
import Swal from 'sweetalert2';
import AuthForm from './AuthForm';
import yourLogo from './authImage.jpg';
import projectLogo from '../../images/logo.png';

const theme = createTheme();

const Auth = () => {
    const [isSignUp, setIsSignUp] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialState = { firstName: '', lastName: '', email: '', password: '', role: '' };
    const [formData, setFormData] = React.useState(initialState);
    const user = getUserFromJWT();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.email || !formData.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please complete all fields!',
            });
        } else {
            if (isSignUp) {
                if (!formData.firstName || !formData.lastName || !formData.role) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Please complete all fields!',
                    });
                } else dispatch(signup(formData, navigate));
            } else {
                dispatch(signin(formData, navigate));
            }
        }
    };

    const switchMode = () => {
        setIsSignUp(!isSignUp);
    };

    React.useEffect(() => {
        if (user) navigate('/');
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container sx={{ height: '100vh' }}>
                <Grid item xs={6} sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    position: 'fixed',
                    overflow: 'hidden',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: '50%',
                    height: '100vh', // Ensure it takes full height of the viewport
                    backgroundImage: `url(${yourLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backdropFilter: 'blur(2px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            zIndex: 0
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1
                        }}
                    >
                        <img src={projectLogo} alt="Project Logo" style={{ width: '780px', height: '290px' }} />
                    </Box>
                </Grid>
                <Grid item xs={6} sx={{ marginLeft: '50%' }}>
                    {/* Right side */}
                    <Box p={4} mt={6}>
                        <Paper elevation={12} sx={{ padding: 4, pb: 5, borderRadius: 5 }}>
                            <AuthForm isSignUp={isSignUp} handleSubmit={handleSubmit} handleChange={handleChange} switchMode={switchMode} />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Auth;
