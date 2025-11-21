import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
} from "@mui/material";

function Administrador() {
  const [administrador, setAdministrador] = useState([]);
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

  const loadAdministrador = async () => {
    try {
      const response = await fetch("http://localhost:4000/administrador");
      const data = await response.json();
      setAdministrador(data); // Establece el array completo
    } catch (error) {
      console.error("Error al cargar Administrador:", error);
    }
  };


  // Eliminación (Deshabilitación) (Correcta)
  const handleEliminar = async (idAdministrador) => {
      // ... (código handleEliminar)
      const confirmar = window.confirm("¿Seguro que deseas DESHABILITAR este administrador? Su estado se cambiará a 'Deshabilitado'.");
      
      if (confirmar) {
        try {
          const response = await fetch(`http://localhost:4000/administrador/${idAdministrador}`, { 
              method: "DELETE" 
          });

          if (!response.ok) {
              throw new Error(`Error al deshabilitar: ${response.statusText}`);
          }
          
          setAdministrador((prevAdministrador) => 
              prevAdministrador.map((admin) => {
                  if (admin.id_admin === idAdministrador) {
                      return { ...admin, estado: 'Deshabilitado' };
                  }
                  return admin;
              })
          );
        } catch (error) {
          console.error("Error al deshabilitar administrador:", error);
          alert("Ocurrió un error al intentar deshabilitar al estudiante.");
        }
      }
  };


  //llamar a loadAdminstrador()
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadAdministrador(); 
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
      <UsuarioNav context="administrador"/> 
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Administradores 
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
                "ID_Administrador", "ID_Usuario", "Nombre", "Paterno", "Materno", "Correo", "Rol", "Celular", "F. Nacimiento", "F. Registro", "Cargo", "Estado", "Acciones",
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
            {administrador.map((admin) => (
              <TableRow key={admin.id_admin}>
                {/* ... (Celdas de la tabla) ... */}
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.id_admin}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.id_usuario}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.nombre}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.paterno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.materno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.correo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.rol}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.celular}</TableCell>
                
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(admin.fecha_naci)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{formatDate(admin.fecha_registro)}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.cargo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{admin.estado}</TableCell>
                
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/administrador/${admin.id_admin}/edit`)} 
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(admin.id_admin)}
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

export default Administrador;