// src/components/Navbar.jsx

import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png';


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', py: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* Puedes reemplazar esto con tu etiqueta <img src="..." /> */}
            <Box
            component="a"
            href="/"
            sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                mr: 2,
                textDecoration: 'none'
            }}
            >
            <Box
                component="img"
                src={logo}
                alt="Logo Saber Click"
                sx={{
                height: 50,   // puedes ajustar el tamaño
                width: 'auto'
                }}
            />
            </Box>

          </Box>

          {/* LINKS CENTRALES */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {['Inicio', 'Quiénes somos', 'Qué hacemos', 'Instituciones'].map((page) => (
              <Button
                key={page}
                onClick={() => navigate(page === 'Inicio' ? '/' : `/${page.toLowerCase().replace(' ', '-')}`)}
                sx={{ my: 2, color: '#555', display: 'block', textTransform: 'none', fontWeight: 500 }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* BOTONES DERECHA */}
          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                sx={{ 
                    color: '#ff9800', 
                    borderColor: '#ff9800', 
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#f57c00', bgcolor: '#fff3e0' }
                }}
            >
              Iniciar Sesión
            </Button>
            <Button 
                variant="contained" 
                sx={{ 
                    bgcolor: '#5e3b97', 
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#4a2e7c' }
                }}
            >
              Registrarse
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;