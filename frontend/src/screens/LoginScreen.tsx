import { Box, Container, Paper, Typography } from '@mui/material'
import { GoogleLogin, CredentialResponse  } from '@react-oauth/google'
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';


function LoginScreen() {
    const navigate = useNavigate();
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const token = credentialResponse.credential;
            if (!token) return;

            const user = await loginUser(token);
            console.log('Logged in user:', user);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <Paper elevation={3} sx={{ p: 4, width: 350, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Sign In
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Use your Google account to continue
                </Typography>
                <Box mt={2}>
                    <GoogleLogin onSuccess={handleSuccess} theme="filled_black" onError={() => console.log('Login failed')}/>
                </Box>
                </Paper>
            </Box>
            </Container>
    )
}

export default LoginScreen
