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

function FormGerente() {
  const [gerente, setGerente] = useState({
    nombre: "",
    paterno: "",
    materno: "",
    correo: "",
    celular: "",
    fecha_naci: "",
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
        url = `http://localhost:4000/gerente/${params.id}`;
        method = "PUT";
      } else {
        // Operación de CREACIÓN (POST)
        url = "http://localhost:4000/gerente";
        method = "POST";
      }

      res = await fetch(url, {
        method: method,
        body: JSON.stringify(gerente),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${res.status}: ${errorData.message || 'Error al procesar la solicitud.'}`);
      }

      const data = await res.json();
      console.log(`${editing ? 'Gerente actualizado' : 'Gerente creado'}`, data);
      
      navigate("/gerente"); 

    } catch (error) {
      console.error("Error en la operación:", error);
      alert(`Ocurrió un error al guardar/actualizar: ${error.message}`);
    } finally {
      // Se ejecuta siempre, asegurando que loading se ponga en false
      setLoading(false);
    }
  };


  const handleChange = (e) => 
    setGerente({ ...gerente, [e.target.name]: e.target.value });

  const loadGerente = async (id) =>{
    const res = await fetch(`http://localhost:4000/gerente/${id}`)
    const data = await res.json ()
    const fechaFormateada = data.fecha_naci 
        ? data.fecha_naci.split('T')[0] 
        : "";
    setGerente({
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
        loadGerente(params.id)
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
  const allFieldsFilled = Object.values(gerente).every((v) => v !== "");

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
          {editing ? "Editar Gerente" : "Crear Usuario Gerente"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* ---- Fila 1 ---- */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombres:</Typography>
              <TextField
                name="nombre"
                value={gerente.nombre}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Apellido Paterno:</Typography>
              <TextField
                name="paterno"
                value={gerente.paterno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Apellido Materno:</Typography>
              <TextField
                name="materno"
                value={gerente.materno}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Typography sx={{ mb: 1 }}>Fecha de Nacimiento</Typography>
              <TextField
                type="date"
                name="fecha_naci"
                value={gerente.fecha_naci || ""}
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
                value={gerente.correo}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Celular:</Typography>
              <TextField
                name="celular"
                value={gerente.celular}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Password:</Typography>
              <TextField
                name="password"
                value={gerente.password}
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

export default FormGerente;