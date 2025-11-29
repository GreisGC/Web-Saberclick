import {
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
   // Importamos Box para contenedores simples
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🎨 Definición de Colores de Marca
const PRIMARY_BLUE = "#1976d2"; // Color principal para botones y acentos
const CARD_BACKGROUND = "#212121"; // Fondo de la tarjeta (más oscuro)
const PAGE_BACKGROUND = "#121212"; // Fondo general de la página
const FIELD_BG = "#303030"; // Fondo de los campos de texto
const LIGHT_TEXT = "#e0e0e0"; // Texto principal
const ACCENT_TEXT = "#ff9800"; // Naranja/ámbar para acentos sutiles

function UsuarioForm() {
  const [administrador, setadministrador] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    celular: "",
    fecha_naci: "",
    cargo: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:4000/administrador", {
      method: "POST",
      body: JSON.stringify(administrador),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log(data);
    setLoading(false);
    navigate("/usuarios");
  };

  const handleChange = (e) => {
    setadministrador({ ...administrador, [e.target.name]: e.target.value });
  };

  // ⭐️ ESTILOS BASE PARA INPUTS MEJORADOS ⭐️
  const inputBaseProps = {
    // 1. Estilos del contenedor del TextField
    sx: {
      backgroundColor: FIELD_BG,
      borderRadius: "8px",
      mb: 2, // Espacio entre campos
      // Estilo de enfoque (focus)
      "& .MuiFilledInput-root": {
        "&.Mui-focused": {
          backgroundColor: FIELD_BG, // Mantener el color de fondo al enfocar
        },
      },
    },
    // 2. Estilos del Input (para padding y color de texto)
    InputProps: {
      sx: {
        borderRadius: "8px",
        padding: "0", // Ajustar el padding por defecto del filled input
        "& .MuiInputBase-input": {
          padding: "14px 16px",
          fontSize: "1rem",
        },
      },
    },
    // 3. Estilos del campo de entrada
    inputProps: { style: { color: LIGHT_TEXT } },
    variant: "filled",
    fullWidth: true,
  };

  // Validación dinámica
  const allFieldsFilled = Object.values(administrador).every((v) => v !== "");

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: PAGE_BACKGROUND,
        padding: "2rem",
      }}
    >
      <Card
        sx={{
          width: "94vw",
          maxWidth: "1000px", // Hacemos la tarjeta un poco más estrecha
          backgroundColor: CARD_BACKGROUND,
          color: LIGHT_TEXT,
          borderRadius: "16px", // Bordes más suaves
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          padding: { xs: "2rem", md: "3rem 4rem" }, // Más padding horizontal
        }}
      >
        <Typography
          variant="h3" // Título más grande
          component="h1"
          fontWeight="bold"
          sx={{ 
            textAlign: "center", 
            mb: 1, 
            color: PRIMARY_BLUE 
          }}
        >
          Registro de Administrador
        </Typography>
        <Typography
          variant="body1"
          sx={{ 
            textAlign: "center", 
            mb: 4, 
            color: ACCENT_TEXT 
          }}
        >
          Ingrese los datos para la creación de la cuenta de usuario.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* ---- Fila 1: Datos personales ---- */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Nombres:</Typography>
              <TextField
                name="nombre"
                onChange={handleChange}
                placeholder="Nombre(s)"
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Apellido Paterno:</Typography>
              <TextField
                name="paterno"
                onChange={handleChange}
                placeholder="Paterno"
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Apellido Materno:</Typography>
              <TextField
                name="materno"
                onChange={handleChange}
                placeholder="Materno"
                {...inputBaseProps}
              />
            </Grid>
          </Grid>
          
          {/* ---- Fila 2: Contacto y Nacimiento ---- */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Correo Electrónico:</Typography>
              <TextField
                name="correo"
                type="email"
                onChange={handleChange}
                placeholder="ejemplo@dominio.com"
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Celular:</Typography>
              <TextField
                name="celular"
                type="tel"
                onChange={handleChange}
                placeholder="Ej: 70012345"
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Fecha de Nacimiento:</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                onChange={handleChange}
                {...inputBaseProps}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          
          {/* ---- Fila 3: Cargo (Separador) ---- */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5, color: LIGHT_TEXT }}>Cargo:</Typography>
              <TextField
                name="cargo"
                onChange={handleChange}
                placeholder="Ej: Director, Coordinador de Área"
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          {/* ---- Botón centrado debajo ---- */}
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                // ⭐️ Color de botón principal (Azul) ⭐️
                sx={{
                  width: "100%",
                  bgcolor: PRIMARY_BLUE,
                  fontSize: "1.1rem",
                  paddingY: 1.5,
                  borderRadius: "10px",
                  mt: 3,
                  fontWeight: 'bold',
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                  "&.Mui-disabled": {
                    bgcolor: FIELD_BG,
                    color: '#9e9e9e',
                  }
                }}
                color="primary"
                type="submit"
                disabled={!allFieldsFilled || loading}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Registrar Usuario"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
}

export default UsuarioForm;


