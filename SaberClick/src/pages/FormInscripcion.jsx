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
import GetSesion from "../tools/GetSesion";

function FormInscripcion() {
  const location = useLocation();
  //  Desestructurar inscripcionData del state 
  const { inscripcionData } = location.state || {}; 
  const [estudianteData,setEstudianteData]=useState({
    nombre:"",
    paterno:"",
    materno:""
  })

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
    
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); 
  const navigate = useNavigate();
  const params = useParams();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); 

    try {
      let res;
      let url;
      let method;

      const payload = editing
        ? {
            fecha_inscripcion: inscripcion.fecha_inscripcion,
            hora_inscripcion: inscripcion.hora_inscripcion,
          
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
        payload.nombre_estudiante=estudianteData.nombre;
        payload.paterno_estudiante=estudianteData.paterno;
        payload.materno_estudiante=estudianteData.materno;
        res = await fetch(url, {
          method,
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        const serverMessage = errorData.message || "Error desconocido en el servidor.";
        
        if (
          serverMessage.includes("Estudiante no existe") ||
          serverMessage.includes("Tutoria no existe") ||
          serverMessage.includes("Institucion no existe")||
          serverMessage.includes("Paralelo no existe")||
          serverMessage.includes("Tutor no existe")
        ) {
          setErrorMessage(serverMessage); 
        } else {
          setErrorMessage(`Error ${res.status}: ${serverMessage}`);
        }
        
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

  const getEstudiante= async()=>{
    try{

      const sesion=GetSesion();
      if(!sesion){
        console.log("No hay sesion del estudiante")
      }
    
      const url=`http://localhost:4000/estudiante/${sesion.id}`;

      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const res=await fetch(url,requestOptions);
      const data= await res.json();
      setEstudianteData({
        materno:data.materno,
        paterno:data.paterno,
        nombre:data.nombre
      })
      return data

      
    }catch(error){
      console.log(error);
      return null
    }
  }

  const handleChange = (e) =>
    setInscripcion({ ...inscripcion, [e.target.name]: e.target.value });

  const loadParalelo = async (id) => {
    const res = await fetch(`http://localhost:4000/inscripcion/${id}`);
    const data = await res.json();

    setInscripcion({
        nombre_tutoria: data.nombre_tutoria || "", 
        nombre_institucion: data.nombre_institucion || "",
        
        // Campos del Paralelo
        nombre_paralelo: data.nombre_paralelo || "",
        fecha_ini: data.fecha_ini || "",
        fecha_fin: data.fecha_fin || "",
        hora_ini: data.hora_ini || "",
        hora_fin: data.hora_fin || "",
        dia: data.dia || "",
        // Campos del Tutor que deben enviarse al backend
        nombre_tutor: data.nombre_tutor || "",
        paterno_tutor: data.paterno_tutor || "",
        materno_tutor: data.materno_tutor || "",
        // Campos del Estudiante que deben enviarse al backend
        nombre_estudiante: data.nombre_estudiante || "",
        paterno_estudiante: data.paterno_estudiante || "",
        materno_estudiante: data.materno_estudiante || "",
        // Campos de Inscripcion que deben enviarse al backend
        fecha_inscripcion: data.fecha_inscripcion || "",
        hora_inscripcion: data.hora_inscripcion || "",
      
    });
    setEditing(true);
  };

 useEffect(() => {
    getEstudiante();

    // Si estamos en modo edición (hay params.id), cargamos los datos
    if (params.id) {
      loadParalelo(params.id);
      return;
    }
    
    // Si estamos en modo creación Y tenemos datos de la navegación
    if (inscripcionData) {
      // Usamos el spread operator para llenar los campos de paralelo y tutor
      setInscripcion(prev => ({ 
        ...prev, 
        ...inscripcionData,
        // Opcional: Auto-completar fecha y hora de inscripción al momento de abrir el form
        fecha_inscripcion: new Date().toISOString().slice(0, 10), // Fecha actual (YYYY-MM-DD)
        hora_inscripcion: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), // Hora actual
      }));
      
      console.log("Datos de inscripción cargados para auto-completado:", inscripcionData);
    }
    
  }, [inscripcionData, params.id]); // Asegúrate de incluir inscripcionData en las dependencias

  // Asegurar que el resto del código está dentro de FormInscripcion 
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


  const allFieldsFilled = (async () => {
    // Campos de Inscripción que se auto-completan (fecha/hora) o se llenan en edición (notas/intentos)
    const requiredCreationInscripcionFields = [
        inscripcion.fecha_inscripcion,
        inscripcion.hora_inscripcion,
    ];

    
    

    if (editing) {
      // En modo edición, valida fecha/hora + notas/intentos
      return [...requiredCreationInscripcionFields].every(v => v !== "");
    }
    
    // En modo creación:
    const requiredCreationFields = [
        
        inscripcion.nombre_tutoria,
        inscripcion.nombre_institucion,
        
        // Campos auto-completados (paralelo, tutor)
        inscripcion.nombre_paralelo,
        inscripcion.fecha_ini,
        inscripcion.fecha_fin,
        inscripcion.hora_ini,
        inscripcion.hora_fin,
        inscripcion.dia,
        inscripcion.nombre_tutor,
        inscripcion.paterno_tutor,
        inscripcion.materno_tutor,
      
        // Campos del estudiante (Estos deben ser llenados por el usuario)
        //inscripcion.nombre_estudiante,
        estudiante.nombre,
        //inscripcion.paterno_estudiante,
        estudiante.paterno,
        //inscripcion.materno_estudiante,
        estudiante.materno,
       
        // Fecha y hora de inscripción (auto-completados)
        ...requiredCreationInscripcionFields
    ];
    
    // Validamos que todos los campos requeridos en creación estén llenos.
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
              backgroundColor: "#ef535020", 
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
                    value={estudianteData.nombre}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno_estudiante"
                    value={estudianteData.paterno}
                    onChange={handleChange}
                    {...inputBaseProps}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno_estudiante"
                    value={estudianteData.materno}
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
                      // Hacemos este campo de solo lectura si está pre-cargado
                      readOnly: !!inscripcionData?.nombre_tutoria,
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
                      readOnly: editing || !!inscripcionData?.nombre_institucion,
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
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.nombre_paralelo && !editing, // Solo lectura en creación si se autocompletó
                    }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Inicio:</Typography>
                <TextField
                  name="fecha_ini"
                  value={inscripcion.fecha_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.fecha_ini && !editing,
                    }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Fecha Fin:</Typography>
                <TextField
                  name="fecha_fin"
                  value={inscripcion.fecha_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.fecha_fin && !editing,
                    }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Ini:</Typography>
                <TextField
                  name="hora_ini"
                  value={inscripcion.hora_ini}
                  onChange={handleChange}
                  {...inputBaseProps}
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.hora_ini && !editing,
                    }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Hora Fin:</Typography>
                <TextField
                  name="hora_fin"
                  value={inscripcion.hora_fin}
                  onChange={handleChange}
                  {...inputBaseProps}
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.hora_fin && !editing,
                    }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Días:</Typography>
                <TextField
                  name="dia"
                  value={inscripcion.dia}
                  onChange={handleChange}
                  {...inputBaseProps}
                  InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.dia && !editing,
                    }}
                />
              </Grid>

            </Grid>
          </Box>
          
          {/* SECCIÓN TUTOR (solo en creación) */}
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
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.nombre_tutor,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
                  <TextField
                    name="paterno_tutor"
                    value={inscripcion.paterno_tutor}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.paterno_tutor,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
                  <TextField
                    name="materno_tutor"
                    value={inscripcion.materno_tutor}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!inscripcionData?.materno_tutor,
                    }}
                  />
                </Grid>

              </Grid>
            </Box>
          )}
          
          {/* SECCIÓN DATOS INSCRIPCION */}
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
                    // NOTA: Para edición, estos campos suelen ser editables
                    // y los campos Nota/Intento también deben ser editables
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
                
                
                {/* CAMPOS QUE SOLO APARECEN EN EDICIÓN */}
                {editing && (
                  <>
                    {/* --------------------- NOTAS --------------------- */}
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

                    {/* --------------------- INTENTOS --------------------- */}
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
                  </>
                )}


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

export default FormInscripcion;