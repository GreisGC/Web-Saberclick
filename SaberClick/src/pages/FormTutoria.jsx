import { Grid, Card, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function FormTutoria() {
  const [tutoria, setTutoria] = useState({
    nombre_institucion: "",
    nombre_tutoria: "",
    descripcion: "",
    costo: "",
  });

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation(); // ✅ para recibir el state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = editing ? `http://localhost:4000/tutoria/${params.id}` : "http://localhost:4000/tutoria";
      let method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(tutoria),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al procesar la solicitud.");
      }

      const data = await res.json();
      console.log(editing ? "Tutoria actualizada" : "Tutoria creada", data);

      navigate("/tutoria"); 
    } catch (error) {
      console.error("Error en la operación:", error);
      alert(`Ocurrió un error al guardar/actualizar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => 
    setTutoria({ ...tutoria, [e.target.name]: e.target.value });

  // Cargar datos si estamos editando
  const loadTutoria = async (id) => {
    const res = await fetch(`http://localhost:4000/tutoria/${id}`);
    const data = await res.json();
    setTutoria({
      nombre_institucion: data.nombre_institucion,
      nombre_tutoria: data.nombre_tutoria,
      descripcion: data.descripcion,
      costo: data.costo,
    });
    setEditing(true);
  };

  useEffect(() => {
    if (params.id) {
      loadTutoria(params.id);
    } else if (location.state?.gerenteData) {
      // ✅ Si venimos desde "Add tutoria", precargar nombre de institución
      setTutoria((prev) => ({
        ...prev,
        nombre_institucion: location.state.gerenteData.nombre_institucion,
      }));
    }
  }, [params.id, location.state]);

  const inputBaseProps = {
    InputProps: { sx: { "& .MuiInputBase-input": { padding: "14px 34px", fontSize: "1.05rem" } } },
    sx: { backgroundColor: "#2f3640", borderRadius: "6px", mb: 2 },
    inputProps: { style: { color: "white" } },
    variant: "filled",
    fullWidth: true,
  };

  const allFieldsFilled = Object.values(tutoria).every((v) => v !== "");

  return (
    <Grid container alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundColor: "#121212", padding: "2rem" }}>
      <Card sx={{ width: "94vw", maxWidth: "1200px", backgroundColor: "#1e272e", color: "white", borderRadius: "1rem", boxShadow: "0 8px 25px rgba(0,0,0,0.4)", padding: { xs: "1.5rem", md: "3rem" } }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
          {editing ? "Editar Tutoria" : "Crear Tutoria"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombre de Institución :</Typography>
              <TextField
                name="nombre_institucion"
                value={tutoria.nombre_institucion}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Nombre:</Typography>
              <TextField
                name="nombre_tutoria"
                value={tutoria.nombre_tutoria}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography sx={{ mb: 1 }}>Costo:</Typography>
              <TextField
                name="costo"
                value={tutoria.costo}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ mb: 1 }}>Descripción:</Typography>
              <TextField
                name="descripcion"
                value={tutoria.descripcion}
                onChange={handleChange}
                {...inputBaseProps}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!allFieldsFilled || loading}
                sx={{ width: { xs: "70vw", sm: "300px" }, fontSize: "1rem", paddingY: 1.4, borderRadius: "8px", mt: 2 }}
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

export default FormTutoria;
