// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Grid, 
    Card, 
    CardContent, 
    CardActions 
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import hombre from '../assets/hombre_con_celular.png';

const Home = () => {
    const [institutions, setInstitutions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const mockData = [
            { id: 1, name: "Instituto Alfa", description: "Lorem ipsum dolor sit amet." },
            { id: 2, name: "Colegio Beta", description: "Consectetur adipiscing elit." },
            { id: 3, name: "Universidad Gamma", description: "Sed do eiusmod tempor incididunt." }
        ];
        setInstitutions(mockData); 
    }, []);

    return (
        <Box sx={{ 
            bgcolor: '#ffffff', 
            color: '#333', 
            minHeight: '100vh', 
            width: '100%',
            overflowX: 'hidden'
        }}>
            <Navbar />

            {/* HERO SECTION */}
            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                <Grid container spacing={4} alignItems="center">
                    
                    {/* IZQUIERDA - TEXTO */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#000' }}>
                            Empieza tu tutoría
                        </Typography>

                        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                            Lorem ipsum es simplemente el texto de relleno de las imprentas y archivos de texto.
                            Encuentra el tutor ideal para ti hoy mismo.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                size="large"
                                sx={{ bgcolor: '#5e3b97', borderRadius: '8px', textTransform: 'none' }}
                            >
                                Registrarse
                            </Button>

                            <Button 
                                variant="outlined" 
                                size="large"
                                sx={{ 
                                    color: '#ff9800', 
                                    borderColor: '#ff9800', 
                                    borderRadius: '8px', 
                                    textTransform: 'none' 
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </Box>
                    </Grid>

                    {/* DERECHA - IMAGEN + CÍRCULO */}
                    <Grid 
                        item xs={12} md={6} 
                        sx={{ 
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Círculo Amarillo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '430px',
                                height: '430px',
                                bgcolor: '#fff9c4',
                                borderRadius: '50%',
                                zIndex: 0
                            }}
                        />

                        {/* Imagen */}
                        <Box
                            component="img"
                            src={hombre}
                            alt="Persona con celular"
                            sx={{
                                width: '320px',
                                height: '380px',
                                zIndex: 1,
                                objectFit: 'cover'
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>


            {/* SECCIÓN INSTITUCIONES */}
            <Box sx={{ 
                bgcolor: '#7986cb',
                pt: 8, 
                pb: 10,
                borderTopLeftRadius: '60px',
                borderTopRightRadius: '60px',
                mt: 5
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        {institutions.map((inst) => (
                            <Grid item key={inst.id} xs={12} sm={6} md={4}>
                                <Card sx={{ 
                                    height: 300,      // ✔️ TODAS LAS CARDS MISMO TAMAÑO
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    p: 2
                                }}>
                                    <Typography variant="h6" align="center" fontWeight="bold">
                                        {inst.name}
                                    </Typography>

                                    {/* Imagen placeholder */}
                                    <Box sx={{ 
                                        bgcolor: '#d1c4e9',
                                        height: 120,
                                        borderRadius: '8px',
                                        mb: 2
                                    }} />

                                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {inst.description}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: 'center', mt: 'auto' }}>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => navigate(`/tutorias`)}
                                            sx={{ 
                                                color: '#ff9800', 
                                                borderColor: '#ff9800',
                                                borderRadius: '20px',
                                                px: 4,
                                                textTransform: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Tutorías
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;
