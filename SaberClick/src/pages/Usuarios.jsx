import { useEffect, useState } from "react";
import Menu from './UsuarioNav';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Obtener usuarios
  const loadUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:4000/usuario");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Eliminar usuario
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (confirmar) {
      try {
        await fetch(`http://localhost:4000/usuario/${id}`, { method: "DELETE" });
        setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  // Editar usuario
  const handleEditar = (id) => {
    console.log("Editar usuario con ID:", id);
  };

  useEffect(() => {
    // Eliminamos los márgenes del body y html por si tu App los tiene
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    loadUsuarios();
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
      <Menu/>
      <Typography
        variant="h4"
        align="center"
        style={{
          color: "white",
          margin: "1rem 0",
          flexShrink: 0,
        }}
      >
        Lista de Usuarios
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
                "ID",
                "Nombre",
                "Paterno",
                "Materno",
                "Correo",
                "Rol",
                "Celular",
                "F. Nacimiento",
                "F. Registro",
                "Estado",
                "Acciones",
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
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.id_usuario}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.nombre}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.paterno}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.materno}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.correo}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.rol}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.celular}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.fecha_naci}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.fecha_registro}
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {usuario.estado}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleEditar(usuario.id_usuario)}
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(usuario.id_usuario)}
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

export default Usuarios;
