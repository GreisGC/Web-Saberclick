import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Estudiante() {
  const [estudiante, setEstudiante] = useState([]);
  const navigate = useNavigate();

  // Función para formatear fechas 
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

 
  const loadEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:4000/estudiante");
      const data = await response.json();
      setEstudiante(data); // Establece el array completo
    } catch (error) {
      console.error("Error al cargar Estudiante:", error);
    }
  };

  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idEstudiante) => {
    
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este estudiante? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/estudiante/${idEstudiante}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setEstudiante((prevEstudianrte) => 
              prevEstudianrte.map((est) => {
                  if (est.id_estudiante === idEstudiante) {
                      return { ...est, estado: 'Deshabilitado' };
                  }
                  return est;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar estudiante:", error);
          alert("Ocurrió un error al intentar deshabilitar al estudiante.");
        }
      }
  };


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadEstudiante(); 
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
      <UsuarioNav context="estudiante"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Estudiantes
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
                "ID_Estudiante", "ID_Usuario", "Nombre", "Paterno", "Materno", "Correo", "Rol", "Celular", "F. Nacimiento", "F. Registro", "Estado", "Acciones",
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
            {estudiante.map((est) => (
              <TableRow key={est.id_estudiante}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.id_estudiante}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.id_usuario}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.nombre}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.paterno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.materno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.correo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.rol}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{est.celular}</TableCell>
                
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(est.fecha_naci)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(est.fecha_registro)}</TableCell>

                <TableCell style={{ color: "white", textAlign: "center" }}>{est.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    // OPCIONAL: Usar handleEditar o directamente navigate
                    onClick={() => navigate(`/est/${est.id_estudiante}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(est.id_estudiante)}
                  >
                    Eliminar
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

export default Estudiante;