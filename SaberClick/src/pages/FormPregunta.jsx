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

function FormPregunta() {
  const location = useLocation();
  const tutoriaData = location.state?.tutoriaData;

  const [pregunta, setPregunta] = useState({
    nombre_tutoria: "",
    nombre_institucion:"",
    nro_pregunta: "",
    enunciado: "",
    resp_correcta: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Autorrellenar campos con los datos del gerente
  useEffect(() => {
    if (tutoriaData) {
      setPregunta((prev) => ({
        ...prev,
        nombre_tutoria: tutoriaData.nombre_tutoria || "",
        nombre_institucion: tutoriaData.nombre_institucion || "",
        
      }));
    }
  }, [tutoriaData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      let url;
      let method;

      if (editing) {
        // ACTUALIZAR
        url = `http://localhost:4000/pregunta/${params.id}`;
        method = "PUT";
        const { nro_pregunta, enunciado, resp_correcta } =
          pregunta;

        res = await fetch(url, {
          method,
          // Solo enviamos los campos de la institución para la actualización
          body: JSON.stringify({
            nro_pregunta,
            enunciado,
            resp_correcta,
          }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // CREAR NUEVA
        url = "http://localhost:4000/pregunta";
        method = "POST";

        // Enviamos todos los datos (incluyendo gerente) para la creación
        res = await fetch(url, {
          method,
          body: JSON.stringify(pregunta),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `Error ${res.status}: ${
            errorData.message || "Error al procesar la solicitud."
          }`
        );
      }

      const data = await res.json();
      console.log(
        `${editing ? "Pregunta actualizada" : "Pregunta creada"}`,
        data
      );

      navigate("/pregunta");
    } catch (error) {
      console.error("Error en la operación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setPregunta({ ...pregunta, [e.target.name]: e.target.value });

  const loadInstitucion = async (id) => {
    const res = await fetch(`http://localhost:4000/pregunta/${id}`);
    const data = await res.json();

    setPregunta({
      nombre_tutoria: "", // Dejamos vacíos los campos de gerente
      nombre_institucion: "",
      nro_pregunta: data.nro_pregunta,
      enunciado: data.enunciado,
      resp_correcta: data.resp_correcta || "",
    });
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      loadInstitucion(params.id);
    }
  }, [params.id]);

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

  const allFieldsFilled = (() => {
    if (editing) {
      // En modo edición, solo valida los campos de la Pregunta
      return (
        pregunta.nro_pregunta &&
        pregunta.enunciado &&
        pregunta.resp_correcta !== ""
      );
    }
    //valida todos los campos del estado 'institucion'
    return Object.values(pregunta).every((v) => v !== "");
  })();
 

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
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          {editing ? "Editar Pregunta" : "Crear Pregunta"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN GERENTE (solo en creación) */}
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Tutoria
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nombre de la Tutoria:</Typography>
                  <TextField
                    name="nombre_tutoria"
                    value={pregunta.nombre_tutoria}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!tutoriaData,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Institucion:</Typography>
                  <TextField
                    name="nombre_institucion"
                    value={pregunta.nombre_institucion}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!tutoriaData,
                    }}
                  />
                </Grid>

              </Grid>
            </Box>
          )}

          {/* INFORMACIÓN INSTITUCIÓN */}
          <Box mb={4}>
            <Typography variant="h6" sx={{ mb: 1.5, color: "#81c784" }}>
              Pregunta
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Nro. Pregunta:</Typography>
                <TextField
                  name="nro_pregunta"
                  value={pregunta.nro_pregunta}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Enunciado:</Typography>
                <TextField
                  name="enunciado"
                  value={pregunta.enunciado}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Respuesta Correcta:</Typography>
                <TextField
                  name="resp_correcta"
                  value={pregunta.resp_correcta}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

            </Grid>
          </Box>

          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                // Usa la lógica corregida: ¡Esto habilitará el botón al editar!
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

export default FormPregunta;