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

function FormEstudiante() {
  const [estudiante, setestudiante] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    celular: "",
    fecha_naci: "",
	password:"",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      let url;
      let method;
      
      if (editing) {
        // Operación de ACTUALIZACIÓN (PUT)
        url = `http://localhost:4000/estudiante/${params.id}`;
        method = "PUT";
      } else {
        // Operación de CREACIÓN (POST)
        url = "http://localhost:4000/estudiante";
        method = "POST";
      }

      res = await fetch(url, {
        method: method,
        body: JSON.stringify(estudiante),
        headers: { "Content-Type": "application/json" },
      });

      // Verificar si la respuesta fue exitosa (código 2xx)
      if (!res.ok) {
        // Aquí puedes leer la respuesta de error del backend si existe
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || 'Error al procesar la solicitud.'}`);
      }

      const data = await res.json();
      console.log(`${editing ? 'Estudiante actualizado' : 'Estudiante creado'}`, data);
      
      // Navegar a la lista de estudiantes
      // CORRECCIÓN: Usar /estudiante, asumiendo que es la lista principal.
      navigate("/estudiante"); 

    } catch (error) {
      console.error("Error en la operación:", error);
      alert(`Ocurrió un error al guardar/actualizar: ${error.message}`);
    } finally {
      // Se ejecuta siempre, asegurando que loading se ponga en false
      setLoading(false);
    }
  };


  const handleChange = (e) => 
    setestudiante({ ...estudiante, [e.target.name]: e.target.value });

  const loadEstudiante = async (id) =>{
    const res = await fetch(`http://localhost:4000/estudiante/${id}`)
    const data = await res.json ()
    const fechaFormateada = data.fecha_naci 
        ? data.fecha_naci.split('T')[0] 
        : "";
    setestudiante({
        nombre: data.nombre, 
        paterno: data.paterno, 
        materno: data.materno, 
        correo: data.correo,
        celular: data.celular,
        fecha_naci: fechaFormateada,
    })
    setEditing(true)
  };
  
  useEffect(()=>{
    if(params.id){
        loadEstudiante(params.id)
    }
  }, [params.id])


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
  const allFieldsFilled = Object.values(estudiante).every((v) => v !== "");

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
          {editing ? "Editar Estudiante" : "Crear Usuario Estudiante"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* ---- Fila 1 ---- */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombres:</Typography>
              <TextField
                name="nombre"
                value={estudiante.nombre}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
              <TextField
                name="paterno"
                value={estudiante.paterno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
              <TextField
                name="materno"
                value={estudiante.materno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Fecha de Nacimiento</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                value={estudiante.fecha_naci || ""}
                onChange={handleChange}
                {...inputBaseProps}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8}>
              <Typography sx={{ mb: 1 }}>Correo Electrónico:</Typography>
              <TextField
                name="correo"
                value={estudiante.correo}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Celular:</Typography>
              <TextField
                name="celular"
                value={estudiante.celular}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Password:</Typography>
              <TextField
                name="password"
                value={estudiante.password}
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

export default FormEstudiante;