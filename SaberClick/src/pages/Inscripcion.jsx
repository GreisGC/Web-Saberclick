import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Inscripcion() {
  const [inscripcion, setInscripcion] = useState([]);
  const navigate = useNavigate();

  // Función para formatear fechas (Correcta)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const loadParalelo = async () => {
    try {
      const response = await fetch("http://localhost:4000/inscripcion");
      const data = await response.json();
      setInscripcion(data); 
    } catch (error) {
      console.error("Error al cargar Inscripcion:", error);
    }
  };


  // Eliminación (Deshabilitación) 

 const handleEliminar = async (idInscripcion) => {
    
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este inscripcion? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/paralelo/${idInscripcion}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setInscripcion((prevInscripcion) => 
              prevInscripcion.map((par) => {
                  if (par.id_inscripcion === idInscripcion) {
                      return { ...par, estado: 'Deshabilitado' };
                  }
                  return par;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar Inscripcion:", error);
          alert("Ocurrió un error al intentar deshabilitar la inscripcion.");
        }
      }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadParalelo(); 
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
      <UsuarioNav context="inscripcion"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Inscritos
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
                "ID_Inscripcion","ID_Turoria","ID_paralelo","ID_Estudiante", "Fecha",  "Hora", "Nota 1", "Nota 2", "Nota 3", "Intento N1", "Intento N2", "IntentoN3", "Estado", "Acciones",
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
            {inscripcion.map((ins) => (
              <TableRow key={ins.id_inscripcion}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_inscripcion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_tutoria}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_paralelo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_estudiante}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(ins.fecha_inscripcion)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(ins.hora_inscripcion)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.nota1}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.nota2}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.nota3}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.intento1}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.intento2}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.intento3}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    // OPCIONAL: Usar handleEditar o directamente navigate
                    onClick={() => navigate(`/gerente/${ins.id_inscripcion}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(ins.id_inscripcion)}
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

export default Inscripcion;