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

function FormInscripcion() {
  const location = useLocation();
  const tutoriaData = location.state?.tutoriaData;

  const [inscripcion, setInscripcion] = useState({
    nombre_tutoria: "",
    nombre_institucion:"",
    
    // Campos del Paralelo
    nombre_paralelo:"",
    fecha_ini: "",
    fecha_fin: "",
    hora_ini: "",
    hora_fin: "",
    dia: "",
    // Campos del Tutor que deben enviarse al backend
    nombre_tutor: "",
    paterno_tutor: "",
    materno_tutor: "",
     // Campos del Estudiante que deben enviarse al backend
    nombre_estudiante: "",
    paterno_estudiante: "",
    materno_estudiante: "",
    // Campos de Inscripcion que deben enviarse al backend
    fecha_inscripcion: "",
    hora_inscripcion: "",
    nota1: "",
    nota2: "",
    nota3: "",
    intento1: "",
    intento2: "",
    intento3: "",
    
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Nuevo estado para mensajes de error
  const navigate = useNavigate();
  const params = useParams();

  
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
            // Solo campos de la Inscripcion para actualización
            fecha_inscripcion: inscripcion.fecha_inscripcion,
            hora_inscripcion: inscripcion.hora_inscripcion,
            nota1: inscripcion.nota1,
            nota2: inscripcion.nota2,
            nota3: inscripcion.nota3,
            intento1: inscripcion.intento1,
            intento2: inscripcion.intento2,
            intento3: inscripcion.intento3,
    
          }
        : {
            ...inscripcion
          };

      if (editing) {
        // ACTUALIZAR (PUT)
        url = `http://localhost:4000/inscripcion/${params.id}`;
        method = "PUT";

        res = await fetch(url, {
          method,
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // CREAR NUEVA (POST)
        url = "http://localhost:4000/inscripcion";
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
          serverMessage.includes("Estudiante no existe") ||
          serverMessage.includes("Tutoria no existe") ||
          serverMessage.includes("Institucion no existe")||
          serverMessage.includes("Paralelo no existe")||
          serverMessage.includes("Tutor no existe")
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
        `${editing ? "Inscripcion actualizado" : "Inscripcion creado"}`,
        data
      );

      navigate("/inscripcion");
    } catch (error) {
      console.error("Error en la operación:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setInscripcion({ ...inscripcion, [e.target.name]: e.target.value });

  const loadParalelo = async (id) => {
    const res = await fetch(`http://localhost:4000/inscripcion/${id}`);
    const data = await res.json();

    setInscripcion({
        nombre_tutoria: "",
        nombre_institucion:"",
        
        // Campos del Paralelo
        nombre_paralelo:"",
        fecha_ini: "",
        fecha_fin: "",
        hora_ini: "",
        hora_fin: "",
        dia: "",
        // Campos del Tutor que deben enviarse al backend
        nombre_tutor: "",
        paterno_tutor: "",
        materno_tutor: "",
        // Campos del Estudiante que deben enviarse al backend
        nombre_estudiante: "",
        paterno_estudiante: "",
        materno_estudiante: "",
        // Campos de Inscripcion que deben enviarse al backend
        fecha_inscripcion: data.fecha_inscripcion,
        hora_inscripcion: data.hora_inscripcion,
        nota1: data.nota1,
        nota2: data.nota2,
        nota3: data.nota3,
        intento1: data.intento1,
        intento2: data.intento2,
        intento3: data.intento3|| "",
      
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
    const requiredInscripcionFields = [
        inscripcion.fecha_inscripcion,
        inscripcion.hora_inscripcion,
        inscripcion.nota1,
        inscripcion.nota2,
        inscripcion.nota3,
        inscripcion.intento1,
        inscripcion.intento2,
        inscripcion.intento3,
    ];

    if (editing) {
      // En modo edición, solo valida los campos del Paralelo
      return requiredInscripcionFields.every(v => v !== "");
    }
    
    // En modo creación, valida los campos del Paralelo MÁS los de Tutoria e Tutor
    const requiredCreationFields = [
        inscripcion.nombre_tutoria,
        inscripcion.nombre_institucion,
        inscripcion.nombre_paralelo,
        inscripcion.fecha_ini,
        inscripcion.fecha_fin,
        inscripcion.hora_ini,
        inscripcion.hora_fin,
        inscripcion.dia,
        inscripcion.nombre_tutor,
        inscripcion.paterno_tutor,
        inscripcion.materno_tutor,
      
        inscripcion.nombre_estudiante,
        inscripcion.paterno_estudiante,
        inscripcion.materno_estudiante,
       
        ...requiredInscripcionFields
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
          {editing ? "Editar Inscripcion" : "Crear Inscripcion"}
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
        
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Datos Estudiante
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nombre Estudiante:</Typography>
                  <TextField
                    name="nombre_estudiante"
                    value={inscripcion.nombre_estudiante}
                    onChange={handleChange}
                    {...inputBaseProps}
                    // Quité el readOnly para que siempre se puedan introducir/modificar estos datos
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno_estudiante"
                    value={inscripcion.paterno_estudiante}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno_estudiante"
                    value={inscripcion.materno_estudiante}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

              </Grid>
            </Box>
          )}        
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
                    value={inscripcion.nombre_tutoria}
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
                    value={inscripcion.nombre_institucion}
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
                  value={inscripcion.nombre_paralelo}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Inicio:</Typography>
                <TextField
                  name="fecha_ini"
                  value={inscripcion.fecha_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Fin:</Typography>
                <TextField
                  name="fecha_fin"
                  value={inscripcion.fecha_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Ini:</Typography>
                <TextField
                  name="hora_ini"
                  value={inscripcion.hora_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Fin:</Typography>
                <TextField
                  name="hora_fin"
                  value={inscripcion.hora_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Días:</Typography>
                <TextField
                  name="dia"
                  value={inscripcion.dia}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

            </Grid>
          </Box>
          
          {/* SECCIÓN TUTOR (solo en creación, o se podría mantener en edición si el backend lo permite) */}
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Datos de Tutor 
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nombre Tutor:</Typography>
                  <TextField
                    name="nombre_tutor"
                    value={inscripcion.nombre_tutor}
                    onChange={handleChange}
                    {...inputBaseProps}
                    // Quité el readOnly para que siempre se puedan introducir/modificar estos datos
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno_tutor"
                    value={inscripcion.paterno_tutor}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno_tutor"
                    value={inscripcion.materno_tutor}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

              </Grid>
            </Box>
          )}
          
          {!editing && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 1.5, color: "#90caf9" }}>
                Datos Inscripcion
              </Typography>
              <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Fecha Inscripcipcion:</Typography>
                  <TextField
                    name="fecha_inscripcion"
                    value={inscripcion.fecha_inscripcion}
                    onChange={handleChange}
                    {...inputBaseProps}
                    // Quité el readOnly para que siempre se puedan introducir/modificar estos datos
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Hora Inscripcion:</Typography>
                  <TextField
                    name="hora_inscripcion"
                    value={inscripcion.hora_inscripcion}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nota 1:</Typography>
                  <TextField
                    name="nota1"
                    value={inscripcion.nota1}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

                 <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nota 2:</Typography>
                  <TextField
                    name="nota2"
                    value={inscripcion.nota2}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                 <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Nota 3:</Typography>
                  <TextField
                    name="nota3"
                    value={inscripcion.nota3}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
               
                 <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Intento N1:</Typography>
                  <TextField
                    name="intento1"
                    value={inscripcion.intento1}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Intento N2:</Typography>
                  <TextField
                    name="intento2"
                    value={inscripcion.intento2}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Intento N3:</Typography>
                  <TextField
                    name="intento3"
                    value={inscripcion.intento3}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

              </Grid>
            </Box>
          )}

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

export default FormInscripcion;