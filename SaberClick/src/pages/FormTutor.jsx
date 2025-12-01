import {
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TutorForm() {
  const { id } = useParams(); // Detectar si estamos editando
  const [loading, setLoading] = useState(false);

  const [tutor, settutor] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    celular: "",
    fecha_naci: "",
    especialidad: "",
    anos_experiencia: "",
    password: "",
    cv: null,
  });

  const navigate = useNavigate();

  // cargar tutor si estamos editando
  useEffect(() => {
    if (!id) return;

    const loadTutor = async () => {
      try {
        const res = await fetch(`http://localhost:4000/tutor/${id}`);
        const data = await res.json();

        settutor({
          nombre: data.nombre,
          paterno: data.paterno,
          materno: data.materno,
          correo: data.correo,
          celular: data.celular,
          fecha_naci: data.fecha_naci?.slice(0, 10),
          especialidad: data.especialidad,
          anos_experiencia: data.anos_experiencia,
          password: "",
          cv: null, // solo si carga nuevo
        });
      } catch (error) {
        console.error("Error cargando tutor:", error);
      }
    };

    loadTutor();
  }, [id]);

  // manejar texto
  const handleChange = (e) => {
    settutor({ ...tutor, [e.target.name]: e.target.value });
  };

  // manejar archivo PDF
  const handleFileChange = (e) => {
    settutor({ ...tutor, cv: e.target.files[0] });
  };

  // enviar formulario (POST o PUT)
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    Object.keys(tutor).forEach((key) => {
      if (tutor[key] !== null && tutor[key] !== "") {
        formData.append(key, tutor[key]);
      }
    });

    let url = "http://localhost:4000/tutor";
    let method = "POST";

    if (id) {
      url = `http://localhost:4000/tutor/${id}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const data = await res.json();
    console.log("Respuesta:", data);

    // Redirigir a la lista de tutores después de crear o editar
    navigate("/tutor");

  } catch (error) {
    console.error("Error guardando:", error);
  } finally {
    setLoading(false);
  }
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
          padding: { xs: "1.5rem", md: "3rem" },
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          {id ? "Editar Tutor" : "Crear Tutor"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Fila 1 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography>Nombres:</Typography>
              <TextField
                name="nombre"
                value={tutor.nombre}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography>Apellido Paterno:</Typography>
              <TextField
                name="paterno"
                value={tutor.paterno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography>Apellido Materno:</Typography>
              <TextField
                name="materno"
                value={tutor.materno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          {/* Fila 2 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>Correo Electrónico:</Typography>
              <TextField
                name="correo"
                value={tutor.correo}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography>Celular:</Typography>
              <TextField
                name="celular"
                value={tutor.celular}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          {/* Fila 3 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography>Fecha de Nacimiento:</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                value={tutor.fecha_naci}
                onChange={handleChange}
                {...inputBaseProps}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography>Especialidad:</Typography>
              <TextField
                name="especialidad"
                value={tutor.especialidad}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography>Años de Experiencia:</Typography>
              <TextField
                name="anos_experiencia"
                value={tutor.anos_experiencia}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          {/* PDF */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography>Currículum (PDF):</Typography>
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
              }}
            />
          </Grid>

          {/* Password solo en creación */}
          {!id && (
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <Typography>Password:</Typography>
              <TextField
                name="password"
                value={tutor.password}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          )}

          {/* Botón */}
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                width: { xs: "70vw", sm: "300px" },
                fontSize: "1rem",
                mt: 3,
              }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={22} />
              ) : id ? (
                "Guardar Cambios"
              ) : (
                "Crear Tutor"
              )}
            </Button>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
}

export default TutorForm;
