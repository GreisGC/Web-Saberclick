import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Gerente() {
  const [gerente, setGerente] = useState([]);
  const navigate = useNavigate();


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const loadGerente = async () => {
    try {
      const response = await fetch("http://localhost:4000/gerente");
      const data = await response.json();
      setGerente(data); 
    } catch (error) {
      console.error("Error al cargar Gerente:", error);
    }
  };



  const handleEliminar = async (idGerente) => {
    
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este gerente? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/gerente/${idGerente}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setGerente((prevGerente) => 
              prevGerente.map((ger) => {
                  if (ger.id_estudiante === idGerente) {
                      return { ...ger, estado: 'Deshabilitado' };
                  }
                  return ger;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar Gerente:", error);
          alert("Ocurrió un error al intentar deshabilitar al gerente.");
        }
      }
  };


  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadGerente(); 
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
      <UsuarioNav context="gerente"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Gerentes
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
                "ID_Gerente", "ID_Usuario", "Nombre", "Paterno", "Materno", "Correo", "Rol", "Celular", "F. Nacimiento", "F. Registro", "Estado", "Acciones",
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
            {gerente.map((ger) => (
              <TableRow key={ger.id_estudiante}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.id_gerente}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.id_usuario}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.nombre}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.paterno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.materno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.correo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.rol}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.celular}</TableCell>
                
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(ger.fecha_naci)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(ger.fecha_registro)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ger.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    // OPCIONAL: Usar handleEditar o directamente navigate
                    onClick={() => navigate(`/gerente/${ger.id_gerente}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(ger.id_gerente)}
                  >
                    Eliminar
                  </Button>

                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    // 1. Envía el objeto 'ger' como 'state'
                    onClick={() => navigate(`/usuarios/new/Institucion`, { 
                        state: { gerenteData: ger } 
                    })}
                  >
                    Add Institucion
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

export default Gerente;