import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box, Container } from "@mui/material";
import ViewEvaluacion from "./Evaluacion/ViewEvaluacion";
import { useEffect, useState } from "react";
import CardNotas from "../components/card/CardNotas";

const Evaluacion = () => {
	const [inscripcion, setInscripcion] = useState({
		id_inscripcion: 0,
		fecha_inscripcion: "",
		hora_inscripcion: "",
		nota1: "",
		nota2: null,
		nota3: null,
		intento1: "",
		intento2: null,
		intento3: null,
		id_tutoria: 0,
		id_paralelo: 0,
		id_estudiante: 0,
		estado: "",
	});
	const location = useLocation();
	const { idTutoria, idInstitucion, idInscripcion } = location.state || {};
	const navigate = useNavigate();

	const getInscripcion = () => {
		const requestOptions = {
			method: "GET",
			redirect: "follow",
		};

		fetch(
			"http://localhost:4000/inscripcion/" + idInscripcion,
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => {
				setInscripcion(result);
			})
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		getInscripcion();
	}, []);
	return (
		<>
			<Box
				sx={{
					bgcolor: "white",
					color: "#333",
					minHeight: "100vh",
					width: "100%",
					overflowX: "hidden",
					position: "relative",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						zIndex: 100,
					}}
				>
					<Navbar />
				</Box>
				<Container>
					<div className="mt-28">
						<CardNotas
							intento1={inscripcion.intento1}
							intento2={inscripcion.intento2}
							intento3={inscripcion.intento3}
							nota1={inscripcion.nota1}
							nota2={inscripcion.nota2}
							nota3={inscripcion.nota3}
							onUpdate={()=>{getInscripcion()}}
						/>
					</div>
					<ViewEvaluacion
						id_tutoria={idTutoria}
						id_inscripcion={idInscripcion}
						id_institucion={idInstitucion}
						onSendNota={() => {
							getInscripcion();
						}}
					/>
				</Container>
			</Box>
		</>
	);
};

export default Evaluacion;
