import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";
import GetSesion from "../tools/GetSesion";

function Institucion() {
  const [institucion, setInstitucion] = useState([]);
  
  const navigate = useNavigate();


  const loadInstitucion = async () => {
    try {
      const sesion=GetSesion();
	    let url="http://localhost:4000/institucion";

      if(sesion && sesion.rol=="gerente"){
        url="http://localhost:4000/institucionByGerente/"+sesion.id
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setInstitucion(data); 
    } catch (error) {
      console.error("Error al cargar Institucion:", error);
    }
  };


  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idInstitucion) => {
      // ... (código handleEliminar)
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este Institucion? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/institucion/${idInstitucion}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setInstitucion((prevInstitucion) => 
              prevInstitucion.map((ins) => {
                  if (ins.id_institucion === idInstitucion) {
                      return { ...ins, estado: 'Deshabilitado' };
                  }
                  return ins;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar institucion:", error);
          alert("Ocurrió un error al intentar deshabilitar al institucion.");
        }
      }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadInstitucion(); 
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
      <UsuarioNav context="institucion"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Instituciones 
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
                "ID_Institucion", "ID_Gerente", "Nombre", "Direccion", "Celular", "Descripcion", "Estado", "Accion" 
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
            {institucion.map((ins) => (
              <TableRow key={ins.id_institucion}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_institucion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.id_gerente}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.nombre_institucion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.direccion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.celular}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.descripcion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{ins.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/institucion/${ins.id_institucion}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(ins.id_institucion)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    // 1. Envía el objeto 'ger' como 'state'
                    onClick={() => navigate(`/usuarios/new/tutoria`, { 
                        state: { gerenteData: ins } 
                    })}
                  >
                    Add tutoria
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

export default Institucion;