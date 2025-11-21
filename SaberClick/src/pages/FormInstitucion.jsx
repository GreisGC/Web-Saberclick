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

function FormInstitucion() {
  const location = useLocation();
  const gerenteData = location.state?.gerenteData;

  const [institucion, setInstitucion] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    nombre_institucion: "",
    direccion: "",
    celular: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Autorrellenar campos con los datos del gerente
  useEffect(() => {
    if (gerenteData) {
      setInstitucion((prev) => ({
        ...prev,
        nombre: gerenteData.nombre || "",
        paterno: gerenteData.paterno || "",
        materno: gerenteData.materno || "",
        celular: gerenteData.celular || "", // Si también lo precargas
      }));
    }
  }, [gerenteData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      let url;
      let method;

      if (editing) {
        // ACTUALIZAR
        url = `http://localhost:4000/institucion/${params.id}`;
        method = "PUT";
        const { nombre_institucion, direccion, celular, descripcion } =
          institucion;

        res = await fetch(url, {
          method,
          // Solo enviamos los campos de la institución para la actualización
          body: JSON.stringify({
            nombre_institucion,
            direccion,
            celular,
            descripcion,
          }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // CREAR NUEVA
        url = "http://localhost:4000/institucion";
        method = "POST";

        // Enviamos todos los datos (incluyendo gerente) para la creación
        res = await fetch(url, {
          method,
          body: JSON.stringify(institucion),
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
        `${editing ? "Institución actualizada" : "Institución creada"}`,
        data
      );

      navigate("/institucion");
    } catch (error) {
      console.error("Error en la operación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setInstitucion({ ...institucion, [e.target.name]: e.target.value });

  const loadInstitucion = async (id) => {
    const res = await fetch(`http://localhost:4000/institucion/${id}`);
    const data = await res.json();

    setInstitucion({
      nombre: "", // Dejamos vacíos los campos de gerente
      paterno: "",
      materno: "",
      nombre_institucion: data.nombre_institucion,
      direccion: data.direccion,
      celular: data.celular,
      descripcion: data.descripcion || "",
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
      // En modo edición, solo valida los campos de la Institución
      return (
        institucion.nombre_institucion &&
        institucion.direccion &&
        institucion.celular &&
        institucion.descripcion !== ""
      );
    }
    //valida todos los campos del estado 'institucion'
    return Object.values(institucion).every((v) => v !== "");
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
          {editing ? "Editar Institución" : "Crear Institución"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN GERENTE (solo en creación) */}
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Gerente de la Institución
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nombres:</Typography>
                  <TextField
                    name="nombre"
                    value={institucion.nombre}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!gerenteData,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno"
                    value={institucion.paterno}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!gerenteData,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno"
                    value={institucion.materno}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!gerenteData,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* INFORMACIÓN INSTITUCIÓN */}
          <Box mb={4}>
            <Typography variant="h6" sx={{ mb: 1.5, color: "#81c784" }}>
              Información de la Institución
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Nombre de la Institución:</Typography>
                <TextField
                  name="nombre_institucion"
                  value={institucion.nombre_institucion}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Celular:</Typography>
                <TextField
                  name="celular"
                  value={institucion.celular}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Dirección:</Typography>
                <TextField
                  name="direccion"
                  value={institucion.direccion}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Descripción:</Typography>
                <TextField
                  name="descripcion"
                  value={institucion.descripcion}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  {...inputBaseProps}
                  InputProps={{
                    sx: {
                      "& .MuiInputBase-input": {
                        padding: "16px",
                        fontSize: "1.05rem",
                      },
                    },
                  }}
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

export default FormInstitucion;