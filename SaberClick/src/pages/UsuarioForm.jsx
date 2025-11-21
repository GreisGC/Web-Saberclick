import {
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const inputBaseProps = {
    InputProps: {
      sx: {
        "& .MuiInputBase-input": {
          padding: "14px 34px",
          fontSize: "1.05rem",
        },
      },
    },
    sx: {
      backgroundColor: "#2f3640",
      borderRadius: "6px",
      mb: 2,
    },
    inputProps: { style: { color: "white" } },
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
        backgroundColor: "#121212",
        padding: "2rem",
      }}
    >
      <Card
        sx={{
          width: "94vw",
          maxWidth: "1200px",
          backgroundColor: "#1e272e",
          color: "white",
          borderRadius: "1rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          padding: { xs: "1.5rem", md: "3rem" },
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          Crear Usuario Administrador
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* ---- Fila 1 ---- */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombres:</Typography>
              <TextField
                name="nombre"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
              <TextField
                name="paterno"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
              <TextField
                name="materno"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Fecha de Nacimiento</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                onChange={handleChange}
                {...inputBaseProps}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* ---- Fila 2 ---- */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8}>
              <Typography sx={{ mb: 1 }}>Correo Electrónico:</Typography>
              <TextField
                name="correo"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Celular:</Typography>
              <TextField
                name="celular"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Cargo:</Typography>
              <TextField
                name="cargo"
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          
          {/* ---- Botón centrado debajo ---- */}
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!allFieldsFilled || loading}
                sx={{
                  width: { xs: "70vw", sm: "300px" },
                  fontSize: "1rem",
                  paddingY: 1.4,
                  borderRadius: "8px",
                  mt: 2,
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  "Guardar"
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


