import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioNav from './UsuarioNav'; 
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Link, List, ListItem
} from "@mui/material";

function Tutor() {
  const [tutor, setTutor] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:4000/upload/";

  const loadTutor = async () => {
    try {
      const response = await fetch("http://localhost:4000/tutor");
      const data = await response.json();
      setTutor(data);
    } catch (error) {
      console.error("Error al cargar Tutor:", error);
    }
  };

  const handleEliminar = async (idTutor) => {
    console.log(`Deshabilitar tutor ${idTutor}`);

    try {
      const response = await fetch(`http://localhost:4000/tutor/${idTutor}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar");
      }

      setTutor((prev) =>
        prev.map((t) =>
          t.id_tutor === idTutor ? { ...t, estado: "Deshabilitado" } : t
        )
      );

    } catch (error) {
      console.error("Error al eliminar Tutor:", error);
    }
  };

  useEffect(() => {
    loadTutor();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <UsuarioNav context="tutor" />

      <Typography
        variant="h4"
        align="center"
        style={{ color: "white", margin: "1rem 0" }}
      >
        Lista de Tutores
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          backgroundColor: "#1e272e",
          width: "100%",
          height: "100%",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "ID_Tutor", "ID_Usuario", "Nombre", "Paterno", "Materno",
                "Correo", "Rol", "Celular", "F. Nacimiento", "F. Registro",
                "Curriculum", "Estado", "Acciones"
              ].map((columna) => (
                <TableCell
                  key={columna}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#1e272e",
                    borderBottom: "2px solid #2f3640",
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tutor.map((t) => (
              <TableRow key={t.id_tutor}>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.id_tutor}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.id_usuario}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.nombre}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.paterno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.materno}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.correo}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.rol}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.celular}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.fecha_naci}</TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>{t.fecha_registro}</TableCell>

                {/* ------ CURRICULUM (CORREGIDO) ------ */}
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  {t.cv ? (
                    typeof t.cv === "string" ? (
                      /* Cuando CV es solo 1 archivo */
                      <Link
                        href={t.cv.includes("://") ? t.cv : `${BASE_URL}${t.cv}`}
                        target="_blank"
                        rel="noopener"
                        sx={{ color: "#1e90ff", wordBreak: "break-word" }}
                      >
                        {t.cv.split("/").pop()}
                      </Link>
                    ) : Array.isArray(t.cv) ? (
                      /* Cuando CV es un array */
                      <List dense sx={{ textAlign: "left", p: 0 }}>
                        {t.cv.map((item, index) => {
                          const url = item.includes("://") ? item : `${BASE_URL}${item}`;
                          const fileName = item.split("/").pop();
                          return (
                            <ListItem key={index} style={{ padding: "2px 0" }}>
                              <Link
                                href={url}
                                target="_blank"
                                sx={{ color: "#1e90ff", wordBreak: "break-word" }}
                              >
                                {fileName}
                              </Link>
                            </ListItem>
                          );
                        })}
                      </List>
                    ) : (
                      "No hay archivos"
                    )
                  ) : (
                    "No hay archivos"
                  )}
                </TableCell>

                <TableCell style={{ color: "white", textAlign: "center" }}>{t.estado}</TableCell>

                <TableCell style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => navigate(`/tutor/${t.id_tutor}/edit`)}
                    style={{ marginRight: "8px" }}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleEliminar(t.id_tutor)}
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

export default Tutor;
