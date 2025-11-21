import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from 'prop-types';

// Acepta una nueva propiedad 'context' (ej: 'estudiante', 'tutor', 'gerente')
export default function UsuarioNav({ context }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Mapeo para saber el texto y la ruta de navegación directa
  const contextMap = {
    estudiante: { text: "Estudiante", route: "/usuarios/new/Estudiante" },
    tutor: { text: "Tutor", route: "/tutor/new" },
    gerente: { text: "Gerente", route: "/usuarios/new/Gerente" },
    administrador: { text: "Administrador", route: "/usuarios/new/Administrador" },
    institucion: { text: "Institucion", route: "/usuarios/new/Institucion" },
    tutoria: { text: "Tutoria", route: "/usuarios/new/Tutoria" },
    tema: { text: "Tema", route: "/usuarios/new/Tema" },
    paralelo: { text: "Paralelo", route: "/usuarios/new/Paralelo" },
    pregunta: { text: "Pregunta", route: "/usuarios/new/Pregunta" },
    opcion: { text: "Opcion", route: "/usuarios/new/Opcion" },
    inscripcion: { text: "Inscripcion", route: "/usuarios/new/Inscripcion" },

  };

  const isListContext = context && contextMap[context.toLowerCase()];
  const buttonText = isListContext ? `Nuevo ${isListContext.text}` : "Nuevo Usuario";

  // Función de acción del botón principal
  const handleMainButtonClick = () => {
    if (isListContext) {
      // 2. Si es una lista específica, navega directamente al formulario de creación.
      navigate(isListContext.route);
    } else {
      // 3. Si no es un contexto específico (ej. en la página /usuarios), abre el modal.
      handleOpen();
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Esta función solo se usa si el modal está abierto (en el contexto general de /usuarios)
  const handleSelect = (tipo) => {
    setOpen(false);
    // Asumo que la ruta general de creación sigue siendo /usuarios/new/:tipo
    navigate(`/usuarios/new/${tipo.toLowerCase()}`); 
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Container>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link
                to="/usuarios"
                style={{ textDecoration: "none", color: "#eee" }}
              >
                Saber Click
              </Link>
            </Typography>

            {/* Botón Principal (DINÁMICO) */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleMainButtonClick} // Llama a la nueva función de acción
            >
              {buttonText} {/* Muestra el texto dinámico */}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- Dialog / Modal (Solo se renderiza si NO estamos en un contexto específico de lista) --- */}
      {/* El Dialog se muestra solo si no estamos en una lista específica (isListContext es falso) */}
      {!isListContext && (
        <Dialog open={open} onClose={handleClose}>
            {/* ... (Contenido del Dialog/Modal, sin cambios) ... */}
            <DialogTitle sx={{textAlign: "center", fontWeight: "bold", backgroundColor: "#1e272e", color: "white"}}>
                Crear Usuario
            </DialogTitle>
            <DialogContent
                sx={{backgroundColor: "#2f3640", padding: "1.5rem", display: "flex", justifyContent: "center"}}>
                <Stack spacing={2} sx={{ width: "100%", maxWidth: "300px" }}>
                    <Button variant="contained" color="primary" onClick={() => handleSelect("Administrador")}>
                        Usuario Administrador
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleSelect("Gerente")}>
                        Usuario Gerente
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: "#00b894" }} onClick={() => handleSelect("Tutor")}>
                        Usuario Tutor
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: "#0984e3" }} onClick={() => handleSelect("Estudiante")}>
                        Usuario Estudiante
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions sx={{justifyContent: "center", backgroundColor: "#1e272e", paddingBottom: "1rem"}}>
                <Button onClick={handleClose} sx={{color: "white", borderColor: "white", border: "1px solid", "&:hover": {backgroundColor: "#636e72",},}}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

  // 1. Determina si estamos en un contexto de lista específico
  UsuarioNav.propTypes = {
  // context es una cadena de texto (string). Como en el componente general no lo pasas, es opcional.
  context: PropTypes.string,
};