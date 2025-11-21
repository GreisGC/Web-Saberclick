import {
  Grid,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function FormOpcion() {
  const location = useLocation();
  const preguntaData = location.state?.preguntaData;

  const [opcion, setOpcion] = useState({
    // nombre_tutoria eliminado del estado
    enunciado: "",
    id_insiso: "",
    contenido: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  // Auto completar datos desde Pregunta
  useEffect(() => {
    if (preguntaData) {
      setOpcion((prev) => ({
        ...prev,
        // nombre_tutoria eliminado de la actualización
        enunciado: preguntaData.enunciado || "",
      }));
      setEditing(false);
    }
  }, [preguntaData]);

  // Cargar datos para editar
  const loadOpcion = async (id) => {
    const res = await fetch(`http://localhost:4000/opcion/${id}`);
    const data = await res.json();

    setOpcion({
      // nombre_tutoria eliminado de la carga
      enunciado: data.enunciado_pregunta,
      id_insiso: data.id_insiso,
      contenido: data.contenido,
    });

    setEditing(true);
  };

  useEffect(() => {
    if (params.id) loadOpcion(params.id);
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      let url, method, payload;

      if (editing) {
        // En UPDATE, se envía solo lo necesario
        payload = {
          enunciado: opcion.enunciado,
          id_insiso: opcion.id_insiso,
          contenido: opcion.contenido,
        };

        url = `http://localhost:4000/opcion/${params.id}`;
        method = "PUT";
      } else {
        // En CREATE, se envía solo lo necesario (asumiendo que nombre_tutoria ya no es obligatorio o se obtiene de otra forma en el backend)
        // **IMPORTANTE:** Si `nombre_tutoria` es VITAL para crear una opción en tu backend, deberías enviarlo como parte de `preguntaData` o pedirlo en el formulario.
        // Asumiendo que ahora tu backend recibe `id_pregunta` en el body o infiere la tutoría del `enunciado` o la ruta:
        
        // Si necesitas enviar un valor estático o dummy para `nombre_tutoria`:
        // payload = {
        //   nombre_tutoria: "VALOR_FIJO", 
        //   enunciado: opcion.enunciado,
        //   id_insiso: opcion.id_insiso,
        //   contenido: opcion.contenido,
        // };

        // **Opción más limpia (si tu backend lo permite):**
        payload = {
          enunciado: opcion.enunciado,
          id_insiso: opcion.id_insiso,
          contenido: opcion.contenido,
        };

        url = "http://localhost:4000/opcion";
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const serverMessage = errorData.message || "Error desconocido.";
        setErrorMessage(`Error ${res.status}: ${serverMessage}`);
        throw new Error(serverMessage);
      }

      navigate("/opcion");
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setOpcion({ ...opcion, [e.target.name]: e.target.value });

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

  const allFieldsFilled =
    opcion.id_insiso !== "" && opcion.contenido !== "" && opcion.enunciado !== "";

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
          width: "50vw",
          maxWidth: "1200px",
          backgroundColor: "#1e272e",
          color: "white",
          borderRadius: "1rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          padding: { xs: "1.5rem", md: "3rem" },
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 4 }}>
          {editing ? "Editar Opción" : "Crear Nueva Opción"}
        </Typography>

        {errorMessage && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "#ef535020",
              border: "1px solid #ef5350",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {(preguntaData || editing) && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Datos de Referencia
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                
                <Grid item xs={12}> {/* Cambiado a xs=12 para que ocupe todo el ancho ya que solo queda un campo */}
                  <Typography sx={{ mb: 1 }}>Pregunta:</Typography>
                  <TextField
                    name="enunciado"
                    value={opcion.enunciado}
                    InputProps={{ ...inputBaseProps.InputProps, readOnly: true }}
                    {...inputBaseProps}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          <Box mb={4}>
            <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
              Datos de la Opción
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Inciso:</Typography>
                <TextField
                  name="id_insiso"
                  value={opcion.id_insiso}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Contenido:</Typography>
                <TextField
                  name="contenido"
                  value={opcion.contenido}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
            </Grid>
          </Box>

          <Grid container justifyContent="center">
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
                "Guardar Opción"
              )}
            </Button>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
}

export default FormOpcion;
