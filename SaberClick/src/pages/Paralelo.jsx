import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Paralelo() {
  const [paralelo, setParalelo] = useState([]);
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
      const response = await fetch("http://localhost:4000/paralelo");
      const data = await response.json();
      setParalelo(data); 
    } catch (error) {
      console.error("Error al cargar Paralelo:", error);
    }
  };


  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idParalelo) => {
    
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este paralelo? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/paralelo/${idParalelo}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setParalelo((prevParalelo) => 
              prevParalelo.map((par) => {
                  if (par.id_paralelo === idParalelo) {
                      return { ...par, estado: 'Deshabilitado' };
                  }
                  return par;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar Paralelo:", error);
          alert("Ocurrió un error al intentar deshabilitar al paralelo.");
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
      <UsuarioNav context="paralelo"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Paralelos
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
                "ID_Paralelo", "ID_Tutoria",  "ID_Tutor", "Paralelo", "Fecha Inicio", "Fecha Fin", "Días", "Hora Inicio", "Hora Fin", "Modalidad", "Enlace", "Estado", "Acciones",
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
            {paralelo.map((par) => (
              <TableRow key={par.id_paralelo}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.id_paralelo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.id_tutoria}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.id_tutor}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.nombre_paralelo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(par.fecha_ini)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(par.fecha_fin)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.dia}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.hora_ini}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.hora_fin}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.modalidad}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.enlace}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{par.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    // OPCIONAL: Usar handleEditar o directamente navigate
                    onClick={() => navigate(`/gerente/${par.id_paralelo}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(par.id_paralelo)}
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

export default Paralelo;