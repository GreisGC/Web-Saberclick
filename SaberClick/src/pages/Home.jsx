import { useState, useEffect, useContext } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/modals/modal-login/ModalLogin";
import { SesionContext } from "../context/SesionContext";

// IMPORTA TUS IMÁGENES
import bgImage from "../assets/pensador.jpeg"; 
import bgImage2 from "../assets/pensador_2.jpeg"; 
import bgImage3 from "../assets/pensador_3.jpeg"; 
import logo1 from "../assets/logo1.png"; 

import defaultCardImage from "../assets/pensador_2.jpeg"; 

const API_URL = "http://localhost:4000"; 


const Home = () => {
    const [institutions, setInstitutions] = useState([]);
    const { sesion, setInstitucionI } = useContext(SesionContext);
    const navigate = useNavigate();
    
    const [scrollY, setScrollY] = useState(0);
	
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // === Obtener instituciones del backend ===
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                
                const response = await fetch(`${API_URL}/institucion`); 
                if (!response.ok) {
                    throw new Error('Error al cargar las instituciones');
                }
                const data = await response.json();
                setInstitutions(data);
            } catch (error) {
                console.error("Fallo la carga de instituciones:", error);
            }
        };

        fetchInstitutions();
    }, []);

   
    const centerScale = Math.max(0.40, 1 - scrollY * 0.0020);
    const sideOpacity = Math.min(1, (1 - centerScale) * 1.8);
    const sideTranslateX = Math.max(0, (1 - centerScale) * 100); 
    const borderRadiusValue = scrollY > 50 ? "24px" : "0px";

    return (
        <Box
            sx={{
                bgcolor: "#2e7d32", 
                color: "#333",
                minHeight: "100vh",
                width: "100%",
                overflowX: "hidden",
                position: "relative"
            }}
        >
            
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 100 }}>
                <Navbar />
            </Box>

           
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", 
                }}
            >
                
                <Box
                    component="img"
                    src={logo1}
                    alt="Logo Decorativo"
                    sx={{
                        position: "absolute",
                        top: { xs: 80, md: 100 }, 
                        right: { xs: 20, md: 60 }, 
                        width: { xs: 80, md: 120 }, 
                        height: 'auto',
                        zIndex: 10, 
                        opacity: Math.max(0.3, 1 - scrollY * 0.005), 
                        transition: 'opacity 0.2s ease-out'
                    }}
                />
                
                
                <Box
                    sx={{
                        position: "absolute",
                        left: "2%",
                        width: "28%",
                        height: "60vh",
                        backgroundImage: `url(${bgImage2})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "16px",
                        zIndex: 1,
                        opacity: sideOpacity,
                        transform: `translateX(-${50 - sideTranslateX}px)`,
                        transition: "all 0.1s linear",
                    }}
                />

                {/*IMAGEN (FONDO) */}
                <Box
                    sx={{
                        position: "absolute",
                        right: "2%",
                        width: "28%",
                        height: "60vh",
                        backgroundImage: `url(${bgImage3})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "16px",
                        zIndex: 1,
                        opacity: sideOpacity,
                        transform: `translateX(${50 - sideTranslateX}px)`,
                        transition: "all 0.1s linear",
                    }}
                />

                {/*IMAGEN CENTRAL  */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 5,
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: `scale(${centerScale})`, 
                        borderRadius: borderRadiusValue,
                        transition: "transform 0.1s linear, border-radius 0.3s ease",
                        boxShadow: scrollY > 50 ? "0 20px 50px rgba(0,0,0,0.8)" : "none",
                    }}
                >
                   
                    <Box sx={{ position: "absolute", width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.4)" }} />
                </Box>

                {/* (TEXTO Y BOTONES SOBRE LA IMAGEN) */}
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        position: "absolute", 
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center", 
                        pointerEvents: "none",
                        pr: { xs: 2, md: 10 } 
                    }}
                >
                    <Grid container justifyContent="flex-end">
                        
                        <Grid item xs={12} md={5} lg={4} sx={{ pointerEvents: "auto" }}> 
                            
                            <Box 
                                sx={{ 
                                    p: { xs: 3, md: 5 }, 
                                    textAlign: "left",
                                    color: "#fff",
                                    backgroundColor: "rgba(0,0,0,0.0)", 
                                    backdropFilter: "blur(2px)", 
                                    opacity: Math.max(0, 1 - scrollY * 0.008), 
                                    transition: 'opacity 0.1s'
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    sx={{ 
                                        color: "#fff", 
                                        mb: 2,
                                        fontSize: { xs: "2rem", md: "3rem" } 
                                    }}
                                >
                                    Empieza tu tutoría
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{ 
                                        color: "#f0f0f0", 
                                        mb: 4, 
                                        fontSize: "1.8rem", 
                                        lineHeight: 1.2
                                    }}
                                >
                                   Despeja tus dudas al instante. <br />
                                   Con Saber Click, el conocimiento de los <br />grandes pensadores está a un click de tu éxito.
                                </Typography>

                                {!sesion && (
                                    <Box 
                                        sx={{ 
                                            display: "flex", 
                                            flexDirection: "row", 
                                            gap: 2,
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                flexGrow: 1, 
                                                bgcolor: "#5e3b97", 
                                                color: "#fff",
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                py: 1.5,
                                                "&:hover": {
                                                    bgcolor: "#4a2c7a"
                                                }
                                            }}
                                        >
                                            Registrarse
                                        </Button>

                                       
                                        <Box 
                                            sx={{ 
                                                width: "100%", 
                                                flexGrow: 1 
                                            }}
                                        >
                                            <div style={{ width: "100%" }}>
                                                <ModalLogin />
                                            </div>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

           

            {/*SECCIÓN INSTITUCIONES */}
            <Box
                sx={{
                    bgcolor: "#f5f5f5",
                    pt: 4, 
                    pb: 10,
                    borderTopLeftRadius: "60px",
                    borderTopRightRadius: "60px",
                    position: "relative",
                    zIndex: 20, 
                    mt: -5, 
                }}
            >
                <Container maxWidth="lg" sx={{ 
                    position: "relative", 
                    zIndex: 20, 
                    mt: 8 
                }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        align="center"
                        fontWeight="bold"
                        color="#333" 
                        sx={{ mb: 1 }}
                    >
                        Saber Click
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        align="left"
                        fontWeight="bold"
                        color="#333"
                        sx={{ mb: 4 }} 
                    >
                        Instituciones
                    </Typography>
                </Container>

                <Container maxWidth="lg">
                    {/* AJUSTE DE GRID PARA 3 CARDS POR FILA Y MISMA ALTURA */}
                    <Grid 
                        container 
                        spacing={4} 
                        justifyContent="center" 
                        alignItems="stretch"
                    >
                        {/* ITERACIÓN CON DATOS REALES */}
                        {institutions.map((inst) => (
                            //  md={4}: 12 / 4 = 3 tarjetas por fila en escritorio
                            <Grid item key={inst.id_institucion} xs={12} sm={6} md={4}> 
                                <Card
                                    sx={{
                                        height: "100%", 
                                        minHeight: 380, 
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between", 
                                        borderRadius: "16px",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                                        p: 2,
                                        transition: "transform 0.2s",
                                        "&:hover": { 
                                            transform: "translateY(-5px)" 
                                        }
                                    }}
                                >
                                    <Typography variant="h6" align="center" fontWeight="bold">
                                        {inst.nombre_institucion} 
                                    </Typography>
                                    
                                    {/* IMAGEN POR DEFECTO */}
                                    <Box 
                                        component="img"
                                        src={defaultCardImage} 
                                        alt={`Logo de ${inst.nombre_institucion}`}
                                        sx={{ 
                                            height: 140, 
                                            width: '100%',
                                            objectFit: 'cover', 
                                            borderRadius: "8px", 
                                            mb: 2,
                                            mt: 1 
                                        }}
                                    />
                                    
                                    <CardContent sx={{ flexGrow: 1, p: 0, pb: '0 !important' }}>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary" 
                                            align="center"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3, 
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '4.5em' 
                                            }}
                                        >
                                            {inst.descripcion}
                                        </Typography>
                                    </CardContent>
                                    
                                    <CardActions sx={{ justifyContent: "center" }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
												setInstitucionI({
													id_institucion:inst.id_institucion,
													nombre_institucion:inst.nombre_institucion,
													descripcion:inst.descripcion })
												navigate(`/TutoriasHome`,
												{ 
                                                    state: { 
                                                        id: inst.id_institucion,
                                                        nombre: inst.nombre_institucion,
														descripcion:inst.descripcion 
                                                    } 
                                                }
											)}}
                                            sx={{
                                                color: "#ff9800",
                                                borderColor: "#ff9800",
                                                borderRadius: "20px",
                                                px: 4,
                                                textTransform: "none",
                                                fontWeight: "bold",
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