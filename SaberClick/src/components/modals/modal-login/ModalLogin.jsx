import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Alert, AlertTitle, TextField, CircularProgress } from "@mui/material"; 
import { jwtDecode } from "jwt-decode";
import { SesionContext } from "../../../context/SesionContext";


const PRIMARY_BLUE = "#1976d2"; 
const ACCENT_COLOR = "#e8a13e"; 


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: '90%', sm: 400 }, 
    bgcolor: "background.paper",
    borderRadius: 3, 
    boxShadow: 22,
    p: 4,
};

const ModalLogin = () => {
    // --- FUNCIONALIDAD (NO TOCADA) ---
    const { sesion, setSesionI } = React.useContext(SesionContext);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState({
        show: false,
        title: "",
        descripcion: "",
    });
    const [correo, setCorreo] = React.useState("");
    const [password, setPassword] = React.useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const iniciarSesion = () => {
        const url = `http://localhost:4000/usuario/login`;
        const sesion = {
            correo,
            password,
        };
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify(sesion);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        setIsLoading(true);
        fetch(url, requestOptions)
            .then((response) => {
                if (response.status === 401) {
                    setShowAlert({
                        descripcion: "Usuario o contraseña incorrecta",
                        title: "Error al iniciar sesión",
                        show: true,
                    });
                } else if (response.status === 200) {
                    setShowAlert({
                        descripcion: "",
                        title: "",
                        show: false,
                    });
                    return response.json();
                } else {
                    setShowAlert({
                        descripcion: "Ocurrió un error con el servidor",
                        title: "Error",
                        show: true,
                    });
                }
            })
            .then((result) => {
                if (result && result.token) {
                    localStorage.setItem("x-token", result.token);
                    const decode = jwtDecode(result.token);
                    const data = decode.data;
                    setSesionI({
                        rol: data.rol,
                        username: data.username,
                        id: data.id,
                        id_usuario: data.id_usuario,
                    });
                    setOpen(false);
                }
            })
            .catch((error) => {
                setShowAlert({
                    descripcion: "error: " + error.message,
                    title: "Error de Conexión",
                    show: true,
                });
            })
            .finally(() => setIsLoading(false));
    };
    
    return (
        <>
           
            
<Button
    
    variant="outlined" 
    size="large"
    onClick={handleOpen}
    sx={{
        flexGrow: 1,
        color: ACCENT_COLOR, 
        borderColor: ACCENT_COLOR, 
        bgcolor: 'transparent', 
        borderRadius: "10px",
        textTransform: "uppercase",
        fontSize: "1rem",
        fontWeight: "bold",
        py: 1.5,
        
        "&:hover": {
            backgroundColor: ACCENT_COLOR + '15', 
            borderColor: ACCENT_COLOR,
           
        }
    }}
>
    Iniciar Sesión
</Button>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-login-title"
                aria-describedby="modal-login-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-login-title"
                        variant="h4" // Título más grande
                        component="h2"
                        fontWeight="bold"
                        color={PRIMARY_BLUE}
                        sx={{ mb: 3, textAlign: 'center' }}
                    >
                        INICIAR SESIÓN
                    </Typography>
                    
                    {/* Campos de Texto */}
                    <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                        <TextField
                            fullWidth
                            id="input-correo"
                            label="Correo Electrónico"
                            variant="outlined"
                            type="email"
                            color="primary"
                            onChange={(event) => {
                                setCorreo(event.target.value);
                            }}
                        />
                        <TextField
                            fullWidth
                            id="input-password"
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            color="primary"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </Box>
                    
                    {/* Alerta de Error */}
                    {showAlert.show && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <AlertTitle>{showAlert.title}</AlertTitle>
                            {showAlert.descripcion}
                        </Alert>
                    )}
                    
                    {/* Botón de Acción */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={iniciarSesion}
                            disabled={isLoading || !correo || !password}
                            size="large"
                            sx={{ 
                                bgcolor: PRIMARY_BLUE,
                                py: 1.5,
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
                        </Button>
                    </Box>
                    
                    
                </Box>
            </Modal>
        </>
    );
};

export default ModalLogin;