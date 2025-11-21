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

function FormParalelo() {
  const location = useLocation();
  const tutoriaData = location.state?.tutoriaData;

  const [paralelo, setParalelo] = useState({
    nombre_tutoria: "",
    nombre_institucion:"",
    // Campos del Tutor que deben enviarse al backend
    nombre: "",
    paterno: "",
    materno: "",
    // Campos del Paralelo
    nombre_paralelo:"",
    fecha_ini: "",
    fecha_fin: "",
    hora_ini: "",
    hora_fin: "",
    dia: "",
    modalidad: "",
    enlace:"",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Nuevo estado para mensajes de error
  const navigate = useNavigate();
  const params = useParams();

  // Autorrellenar campos con los datos de la tutoria (si vienen del state)
  useEffect(() => {
    if (tutoriaData) {
      setParalelo((prev) => ({
        ...prev,
        nombre_tutoria: tutoriaData.nombre_tutoria || "",
        nombre_institucion: tutoriaData.nombre_institucion || "",
        // Asume que los datos del tutor no se pre-cargan aquí a menos que tengas el ID
      }));
    }
  }, [tutoriaData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Limpiar cualquier mensaje de error anterior

    try {
      let res;
      let url;
      let method;

      // Definir el cuerpo de la solicitud (payload)
      const payload = editing
        ? {
            // Solo campos del paralelo para actualización
            nombre_paralelo: paralelo.nombre_paralelo,
            fecha_ini: paralelo.fecha_ini,
            fecha_fin: paralelo.fecha_fin,
            hora_ini: paralelo.hora_ini, 
            hora_fin: paralelo.hora_fin, 
            dia: paralelo.dia, 
            modalidad: paralelo.modalidad,
            enlace: paralelo.enlace,
          }
        : {
            // Todos los campos para la creación, incluyendo Tutor, Tutoria e Institucion para validación
            ...paralelo
          };

      if (editing) {
        // ACTUALIZAR (PUT)
        url = `http://localhost:4000/paralelo/${params.id}`;
        method = "PUT";

        res = await fetch(url, {
          method,
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // CREAR NUEVA (POST)
        url = "http://localhost:4000/paralelo";
        method = "POST";

        res = await fetch(url, {
          method,
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        const serverMessage = errorData.message || "Error desconocido en el servidor.";
        
        // ** Manejo de errores específicos solicitados **
        if (
          serverMessage.includes("tutor no existe") ||
          serverMessage.includes("tutoria no existe") ||
          serverMessage.includes("institucion no existe")
        ) {
          // Mostrar el mensaje exacto del backend
          setErrorMessage(serverMessage); 
        } else {
          // Mostrar un error general si no coincide con los específicos
          setErrorMessage(`Error ${res.status}: ${serverMessage}`);
        }
        
        // Lanzar el error para que se registre en la consola
        throw new Error(serverMessage);
      }

      const data = await res.json();
      console.log(
        `${editing ? "Paralelo actualizado" : "Paralelo creado"}`,
        data
      );

      navigate("/paralelo");
    } catch (error) {
      console.error("Error en la operación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setParalelo({ ...paralelo, [e.target.name]: e.target.value });

  const loadParalelo = async (id) => {
    const res = await fetch(`http://localhost:4000/paralelo/${id}`);
    const data = await res.json();

    setParalelo({
      // Al editar, no se cargan datos de Tutoria/Tutor ya que solo se edita el Paralelo
      nombre_tutoria: "", 
      nombre_institucion: "",
      nombre: "",
      paterno: "",
      materno: "",
      // Datos del Paralelo
      nombre_paralelo: data.nombre_paralelo,
      fecha_ini: data.fecha_ini,
      fecha_fin: data.fecha_fin,
      hora_ini: data.hora_ini, 
      hora_fin: data.hora_fin, 
      dia: data.dia, 
      modalidad: data.modalidad,
      enlace: data.enlace || "",
    });
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      loadParalelo(params.id);
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
    // Campos requeridos en todos los casos
    const requiredParaleloFields = [
        paralelo.nombre_paralelo,
        paralelo.fecha_ini,
        paralelo.fecha_fin,
        paralelo.hora_ini,
        paralelo.hora_fin,
        paralelo.dia,
        paralelo.modalidad,
        paralelo.enlace
    ];

    if (editing) {
      // En modo edición, solo valida los campos del Paralelo
      return requiredParaleloFields.every(v => v !== "");
    }
    
    // En modo creación, valida los campos del Paralelo MÁS los de Tutoria e Tutor
    const requiredCreationFields = [
        paralelo.nombre_tutoria,
        paralelo.nombre_institucion,
        paralelo.nombre,
        paralelo.paterno,
        paralelo.materno,
        ...requiredParaleloFields
    ];
    
    return requiredCreationFields.every(v => v !== "");
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
          {editing ? "Editar Paralelo" : "Crear Paralelo"}
        </Typography>

        {/* Muestra el mensaje de error si existe */}
        {errorMessage && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "#ef535020", // Rojo suave
              border: "1px solid #ef5350",
              borderRadius: "4px",
              textAlign: "center"
            }}
          >
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN TUTORIA (solo en creación) */}
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Tutoria
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1 }}>Nombre de la Tutoria:</Typography>
                  <TextField
                    name="nombre_tutoria"
                    value={paralelo.nombre_tutoria}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      // Si viene pre-cargada, hacerla de solo lectura
                      readOnly: !!tutoriaData,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1 }}>Institucion:</Typography>
                  <TextField
                    name="nombre_institucion"
                    value={paralelo.nombre_institucion}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      // Si viene pre-cargada, hacerla de solo lectura
                      readOnly: !!tutoriaData,
                    }}
                  />
                </Grid>

              </Grid>
            </Box>
          )}
          
          {/* SECCIÓN TUTOR (solo en creación, o se podría mantener en edición si el backend lo permite) */}
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Datos del Tutor 
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nombre Tutor:</Typography>
                  <TextField
                    name="nombre"
                    value={paralelo.nombre}
                    onChange={handleChange}
                    {...inputBaseProps}
                    // Quité el readOnly para que siempre se puedan introducir/modificar estos datos
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno"
                    value={paralelo.paterno}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno"
                    value={paralelo.materno}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

              </Grid>
            </Box>
          )}
          
          {/* INFORMACIÓN PARALELO */}
          <Box mb={4}>
            <Typography variant="h6" sx={{ mb: 1.5, color: "#81c784" }}>
              Paralelo
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Paralelo:</Typography>
                <TextField
                  name="nombre_paralelo"
                  value={paralelo.nombre_paralelo}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Inicio:</Typography>
                <TextField
                  name="fecha_ini"
                  value={paralelo.fecha_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Fin:</Typography>
                <TextField
                  name="fecha_fin"
                  value={paralelo.fecha_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Ini:</Typography>
                <TextField
                  name="hora_ini"
                  value={paralelo.hora_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Fin:</Typography>
                <TextField
                  name="hora_fin"
                  value={paralelo.hora_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Días:</Typography>
                <TextField
                  name="dia"
                  value={paralelo.dia}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

            </Grid>
          </Box>
      
          <Box mb={4}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Modalidad:</Typography>
                <TextField
                  name="modalidad"
                  value={paralelo.modalidad}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Enlace:</Typography>
                <TextField
                  name="enlace"
                  value={paralelo.enlace}
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

export default FormParalelo;