import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Button } from '@mui/material';
import DashboardScreen from './screens/DashboardScreen';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'dark'
    primary: {
      main: '#1976d2', // custom color
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Header/>
        <main className='pt-3'>
          <Routes>
              <Route path='/' element={<LoginScreen />}/>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardScreen />} />
              </Route>
            </Routes>
        </main>
    </Router>
    </ThemeProvider>
  );
}

export default App;
