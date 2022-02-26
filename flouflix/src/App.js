import logo from './logo.svg';
import './App.css';
import Box from "@mui/material/Box"
import { CircularProgress, Typography } from '@mui/material';
import Nav from "./components/Nav";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </header>
      <body>
        <Nav />
        <Box>

          <Typography variant="h1" component="h1">FlouFlix</Typography>
          <Typography variant="h2" component="h2">Work In Progress</Typography>
          <CircularProgress />
        </Box>
      </body>
    </div>
  );
}

export default App;
