import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Pregunta() {
  const [pregunta, setPregunta] = useState([]);
  const navigate = useNavigate();

 
  const loadPregunta= async () => {
    try {
      const response = await fetch("http://localhost:4000/pregunta");
      const data = await response.json();
      setPregunta(data); 
    } catch (error) {
      console.error("Error al cargar Pregunta:", error);
    }
  };


  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idPregunta) => {
    
      // **IMPORTANTE**: Reemplazamos window.confirm/alert con manejo de consola o un modal MUI customizado
      console.log(`Paso 1: Solicitud de deshabilitación para la pregunta ID: ${idPregunta}`);
      const confirmar = true; // Simulación de confirmación positiva
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/pregunta/${idPregunta}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Error al deshabilitar: ${errorData.message || response.statusText}`);
          }
          
          setPregunta((prevPregunta) => 
              prevPregunta.map((preg) => {
                  if (preg.id_pregunta === idPregunta) {
                      return { ...preg, estado: 'Deshabilitado' };
                  }
                  return preg;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar Pregunta:", error);
          // Implementar aquí lógica de visualización de error en la UI
        }
      }
  };

  // Función para manejar la navegación a 'Crear Opción'
  const handleAddOpcion = (pre) => {
    // Pasar los datos necesarios de la pregunta como 'state'
    navigate(`/usuarios/new/opcion`, {
      state: {
        preguntaData: {
          id_pregunta: pre.id_pregunta,
          enunciado: pre.enunciado,
          // Asumo que tu backend en getAllPregunta debe incluir nombre_tutoria
          nombre_tutoria: pre.nombre_tutoria || 'Tutoria Desconocida', 
        }
      }
    });
  };


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadPregunta(); 
  }, []);

  return (

    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <UsuarioNav context="pregunta"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Preguntas
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#1e272e",
          width: "100%",
          height: "100%",
          borderRadius: 0,
          margin: 0,
          boxShadow: "none",
          flexGrow: 1,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "ID_Pregunta", "ID_Tutoria", "Nro. Pregunta", "Enunciado", "Res. Correcta", "Estado", "Acciones",
              ].map((columna) => (
                <TableCell
                  key={columna}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderBottom: "2px solid #2f3640",
                    backgroundColor: "#1e272e",
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pregunta.map((pre) => (
              <TableRow key={pre.id_pregunta}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.id_pregunta}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.id_tutoria}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.nro_pregunta}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.enunciado}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.resp_correcta}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{pre.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/pregunta/${pre.id_pregunta}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(pre.id_pregunta)}
                    style={{ marginRight: "8px" }}
                  >
                    Eliminar
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    // LLAMAMOS A LA NUEVA FUNCIÓN QUE PASA DATOS
                    onClick={() => handleAddOpcion(pre)}
                  >
                    Add Opcion
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Pregunta;