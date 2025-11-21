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

function FormTema() {
  const location = useLocation();
  const tutoriaData = location.state?.tutoriaData;

  const [tema, setTema] = useState({
    nombre_tutoria: "",
    nombre_institucion:"",
    titulo: "",
    descripcion: "",
  });
  // Nuevo estado para manejar la selección de archivos
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Autorrellenar campos con los datos de la tutoria
  useEffect(() => {
    if (tutoriaData) {
      setTema((prev) => ({
        ...prev,
        nombre_tutoria: tutoriaData.nombre_tutoria || "",
        nombre_institucion: tutoriaData.nombre_institucion || "",
      }));
    }
  }, [tutoriaData]);

  // Manejador para campos de texto
  const handleChange = (e) =>
    setTema({ ...tema, [e.target.name]: e.target.value });

  // Manejador para la subida de archivos (campo 'contenido')
  const handleFileChange = (e) => {
    // Almacena la lista de archivos seleccionados
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url;
      let method;
      
      // Creamos un objeto FormData para enviar archivos y texto juntos
      const formData = new FormData();
      
      if (editing) {
        // ACTUALIZAR (PUT)
        url = `http://localhost:4000/tema/${params.id}`;
        method = "PUT";

        // Solo enviamos los campos de texto para la actualización
        formData.append("titulo", tema.titulo);
        formData.append("descripcion", tema.descripcion);
        
        // NOTA: Si se envían archivos en la actualización, aquí se incluirían,
        // pero el backend actual solo maneja la actualización de 'contenido' como string/JSON en PUT.
        // Si necesitas actualizar archivos en PUT, el backend debe modificarse.
        // Por ahora, solo mandamos los campos de texto:
        // Si no se envían archivos, 'contenido' en el backend se actualizará con un valor null/vacío
        // o si tienes un campo de texto para URL, podrías usarlo.
        // Asumiendo que `contenido` es solo archivos en creación, lo omitimos en la actualización de texto.
        // Si hay archivos seleccionados, los enviamos como un array, aunque la lógica del backend `PUT` necesite ser adaptada.
        if (selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                // Usamos 'archivos' como nombre de campo para que coincida con el backend
                formData.append("archivos", file);
            });
        }
        
      } else {
        // CREAR NUEVA (POST)
        url = "http://localhost:4000/tema";
        method = "POST";

        // Campos de texto
        formData.append("nombre_tutoria", tema.nombre_tutoria);
        formData.append("nombre_institucion", tema.nombre_institucion);
        formData.append("titulo", tema.titulo);
        formData.append("descripcion", tema.descripcion);

        // Archivos (contenido)
        if (selectedFiles.length === 0) {
             throw new Error("Debe seleccionar al menos un archivo para el contenido.");
        }
        selectedFiles.forEach((file) => {
            // Es CRUCIAL que este nombre ("archivos") coincida con la configuración de Multer en el backend
            formData.append("archivos", file); 
        });
      }

      // IMPORTANTE: Cuando se usa FormData, NO se usa 'JSON.stringify'
      // y NO se establece el 'Content-Type': 'application/json'. El navegador lo hace automáticamente
      // como 'multipart/form-data'.

      const res = await fetch(url, {
        method,
        body: formData,
        // Eliminamos la cabecera "Content-Type"
      });


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
        `${editing ? "Tema actualizado" : "Tema creado"}`,
        data
      );

      navigate("/tema");
    } catch (error) {
      console.error("Error en la operación:", error);
      // Opcional: Mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  const loadInstitucion = async (id) => {
    const res = await fetch(`http://localhost:4000/tema/${id}`);
    const data = await res.json();

    setTema({
      nombre_tutoria: "", 
      nombre_institucion: "",
      titulo: data.titulo,
      // Nota: No precargamos archivos en el estado de archivos, 
      // solo la referencia para editar si fuera un campo de texto.
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
    // Campos de texto obligatorios
    const requiredTextFilled = tema.titulo && tema.descripcion;
    
    if (editing) {
      // En modo edición, solo valida los campos de texto
      return requiredTextFilled;
    }
    // En modo creación, valida campos de texto + tutoria + archivos
    return (
        tema.nombre_tutoria &&
        tema.nombre_institucion &&
        requiredTextFilled &&
        selectedFiles.length > 0 // Al menos un archivo debe ser seleccionado
    );
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
          {editing ? "Editar Tema" : "Crear Tema"}
        </Typography>

        {/* Importante: El formulario DEBE usar el atributo enctype="multipart/form-data" 
            cuando se trabaja con FormData, aunque fetch lo infiere, es una buena práctica. 
            Aquí lo hacemos a través de FormData en JS. */}
        <form onSubmit={handleSubmit}>
          {/* SECCIÓN Tutoria e Institucion  */}
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
                    value={tema.nombre_tutoria}
                    onChange={handleChange}
                    {...inputBaseProps}
                    InputProps={{
                      ...inputBaseProps.InputProps,
                      readOnly: !!tutoriaData,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1 }}>Institucion:</Typography>
                  <TextField
                    name="nombre_institucion"
                    value={tema.nombre_institucion}
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

          {/* INFORMACIÓN TEMA */}
          <Box mb={4}>
            <Typography variant="h6" sx={{ mb: 1.5, color: "#81c784" }}>
              Tema
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: "#424242" }} />

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Titulo Tema:</Typography>
                <TextField
                  name="titulo"
                  value={tema.titulo}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1 }}>Descripcion:</Typography>
                <TextField
                  name="descripcion"
                  value={tema.descripcion}
                  onChange={handleChange}
                  {...inputBaseProps}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }}>Material de Avance:</Typography>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#2f3640",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple // Permite seleccionar múltiples archivos
                    onChange={handleFileChange}
                    style={{ color: "white" }}
                  />
                </Box>
                {selectedFiles.length > 0 && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        {selectedFiles.length} archivo(s) seleccionado(s)
                    </Typography>
                )}
                {editing && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Nota: Al editar, los archivos seleccionados reemplazarán el contenido anterior.
                    </Typography>
                )}
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

export default FormTema;