import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Opcion() {
  const [opcion, setOpcion] = useState([]);
  const navigate = useNavigate();

 
  const loadOpcion= async () => {
    try {
      const response = await fetch("http://localhost:4000/opcion");
      const data = await response.json();
      setOpcion(data); 
    } catch (error) {
      console.error("Error al cargar Opcion:", error);
    }
  };


  // Eliminación (Deshabilitación) 
  const handleEliminar = async (idOpcion) => {
  const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR esta opción?");

  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:4000/opcion/${idOpcion}`, { 
      method: "DELETE" 
    });

    if (!response.ok) {
      throw new Error(`Error al deshabilitar: ${response.statusText}`);
    }

    // Actualizar tabla
    setOpcion((prev) =>
      prev.map((opc) =>
        opc.id_opcion === idOpcion
          ? { ...opc, estado: "Deshabilitado" }
          : opc
      )
    );
  } catch (error) {
    console.error("Error al deshabilitar Opcion:", error);
    alert("Ocurrió un error al intentar deshabilitar la opción.");
  }
};



  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadOpcion(); 
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
      <UsuarioNav context="opcion"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Opciones
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
                "ID_Opcion", "Enunciado Pregunta", "ID_Inciso", "Contenido", "Estado", "Acciones",
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
            {opcion.map((opc) => (
              <TableRow key={opc.id_opcion}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{opc.id_opcion}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{opc.enunciado_pregunta}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{opc.id_insiso}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{opc.contenido}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{opc.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/opcion/${opc.id_opcion}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(opc.id_opcion)}
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

export default Opcion;