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

function TutorForm() {
  const [tutor, settutor] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    celular: "",
    fecha_naci: "",
    especialidad: "",
    anos_experiencia: "",
    cv: null, // PDF en Base64
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Maneja los cambios de texto
  const handleChange = (e) => {
    settutor({ ...tutor, [e.target.name]: e.target.value });
  };

  // Maneja el archivo PDF y lo convierte a Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // solo la parte Base64
      settutor({ ...tutor, cv: base64String });
    };
    reader.readAsDataURL(file);
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
  const allFieldsFilled =
    Object.values(tutor).slice(0, 8).every((v) => v !== "") && tutor.cv;

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tutor),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al guardar tutor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "#121212", padding: "2rem" }}
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
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
          Crear Usuario Tutor
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Fila 1 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombres:</Typography>
              <TextField name="nombre" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
              <TextField name="paterno" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
              <TextField name="materno" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Fecha de Nacimiento:</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                onChange={handleChange}
                {...inputBaseProps}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Fila 2 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8}>
              <Typography sx={{ mb: 1 }}>Correo Electrónico:</Typography>
              <TextField name="correo" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Celular:</Typography>
              <TextField name="celular" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ mb: 1 }}>Especialidad:</Typography>
              <TextField name="especialidad" onChange={handleChange} {...inputBaseProps} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ mb: 1 }}>Años de Experiencia:</Typography>
              <TextField name="anos_experiencia" onChange={handleChange} {...inputBaseProps} />
            </Grid>
          </Grid>

          {/* Fila 3: CV */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography sx={{ mb: 1 }}>Currículum (PDF):</Typography>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "#2f3640",
                  color: "white",
                  border: "none",
                }}
              />
            </Grid>
          </Grid>

          {/* Botón */}
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
                {loading ? <CircularProgress color="inherit" size={22} /> : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
}

export default TutorForm;

