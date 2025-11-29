// src/components/Navbar.jsx

import { AppBar, Toolbar, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import ModalLogin from "./modals/modal-login/ModalLogin";
import { useContext, useEffect } from "react";
import { SesionContext } from "../context/SesionContext";
import MenuSesion from "./MenuSesion";

const Navbar = () => {
    const { sesion } = useContext(SesionContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(sesion);
    }, [sesion]);

    // ⭐️ FUNCIÓN CLAVE PARA REDIRECCIÓN ⭐️
    const handleRegisterClick = () => {
        // Asumiendo que la ruta para UsuarioForm es /UsuarioForm
        navigate('/UsuarioForm'); 
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: "white", color: "text.primary", py: 1 }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* LOGO (SIN CAMBIOS) */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            component="a"
                            href="/"
                            sx={{
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                mr: 2,
                                textDecoration: "none",
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="Logo Saber Click"
                                sx={{
                                    height: 50, 
                                    width: "auto",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* LINKS CENTRALES (SIN CAMBIOS) */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            gap: 3,
                        }}
                    >
                        {[
                            "Inicio",
                            "Quiénes somos",
                            "Qué hacemos",
                            "Instituciones",
                        ].map((page) => (
                            <Button
                                key={page}
                                onClick={() =>
                                    navigate(
                                        page === "Inicio"
                                            ? "/"
                                            : `/${page
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`
                                    )
                                }
                                sx={{
                                    my: 2,
                                    color: "#555",
                                    display: "block",
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {/* BOTONES DERECHA */}
                    <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
                        
                        {/* Se mantiene el ModalLogin para abrir el inicio de sesión */}
                        {!sesion && <ModalLogin />}
                        {sesion && <MenuSesion/>}
                        
                        {/* ⭐️ BOTÓN REGISTRARSE (Solo visible si NO hay sesión) ⭐️ */}
                        {!sesion && (
                            <Button
                                variant="contained"
                                // ⭐️ ASIGNAMOS LA FUNCIÓN DE REDIRECCIÓN ⭐️
                                onClick={handleRegisterClick} 
                                sx={{
                                    bgcolor: "#5e3b97",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    "&:hover": { bgcolor: "#4a2e7c" },
                                }}
                            >
                                Registrarse
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;