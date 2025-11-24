import { Box, Button, Container, Grid } from "@mui/material";
import Navbar from "../../components/Navbar";
import { useContext, useEffect, useState } from "react";
import MostrarNotas from "./MostrarNotas";
import { SesionContext } from "../../context/SesionContext";

/**
 * @typedef {Object} Props
 * @property {number} id_tutoria - ID de la tutoría.
 * @property {number} id_paralelo - ID del paralelo.
 */
const InscripcionParalelo = ({ id_paralelo, id_tutoria }) => {
	const { sesion } = useContext(SesionContext);
	const [inscripcion, setInscripcion] = useState({
		id_inscripcion: 0,
		fecha_inscripcion: "2025-11-21T04:00:00.000Z",
		hora_inscripcion: "09:30:00",
		nota1: "1.00",
		nota2: "0.00",
		nota3: "0.00",
		intento1: "0.00",
		intento2: "0.00",
		intento3: "0.00",
		id_tutoria: 1,
		id_paralelo: 3,
		id_estudiante: 1,
		estado: "Habilitado",
	});
	const [tutoria, setTutoria] = useState({
		id_tutoria: 0,
		nombre_tutoria: "",
		descripcion: "",
		costo: 0,
		id_institucion: 0,
		estado: "",
	});
	const [paralelo, setParalelo] = useState({
		id_paralelo: 0,
		id_tutoria: 0,
		fecha_ini: "",
		fecha_fin: "",
		dia: "",
		modalidad: "",
		enlace: "",
		id_tutor: 0,
		estado: "",
		nombre_paralelo: "",
		hora_ini: "",
		hora_fin: "",
	});

	const getTutoria = () => {
		const requestOptions = {
			method: "GET",
			redirect: "follow",
		};

		fetch("http://localhost:4000/tutoria/" + id_tutoria, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				setTutoria(result);
			})
			.catch((error) => console.error(error));
	};

	const getParalelo = () => {
		const requestOptions = {
			method: "GET",
			redirect: "follow",
		};

		fetch("http://localhost:4000/paralelo/" + id_paralelo, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				setParalelo(result);
			})
			.catch((error) => console.error(error));
	};

	const obtenerInscripcion = () => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			fecha_inscripcion: "2025-11-21",
			hora_inscripcion: "09:30:00",
			nota1: 0,
			nota2: 0,
			nota3: 0,
			intento1: 0,
			intento2: 0,
			intento3: 0,
			id_tutoria: id_tutoria,
			id_paralelo: id_paralelo,
			id_estudiante: sesion.id,
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow",
		};

		fetch("http://localhost:4000/getinscripcion", requestOptions)
			.then((response) => response.json())
			.then((result) => setInscripcion(result.inscripcion))
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getTutoria();
		getParalelo();
	}, []);
	return (
		<>
			<Box
				sx={{
					bgcolor: "#ffffff",
					color: "#333",
					minHeight: "100vh",
					width: "100%",
					overflowX: "hidden",
				}}
			>
				<Navbar />
				<Container maxWidth="lg">
					<div className="text-center">
						<p>Inscripcion de paralelo</p>
						<p>{`Tutoria: ${tutoria.nombre_tutoria}`}</p>
						<p>{`Paralelo: ${paralelo.nombre_paralelo}`}</p>
						<p>{`HORARIO: ${paralelo.dia} De ${paralelo.hora_ini} - ${paralelo.hora_fin}`}</p>
						<p>{`Fecha: ${paralelo.fecha_ini.split("T")[0]} a ${
							paralelo.fecha_fin.split("T")[0]
						}`}</p>
					</div>
					<div className="flex justify-center">
						{inscripcion.id_inscripcion ? (
							<MostrarNotas
								{...inscripcion}
								id_institucion={tutoria.id_institucion}
								onSendNota={()=>{
									obtenerInscripcion();
								}}
							/>
						) : (
							<>
								<Button onClick={obtenerInscripcion}>
									Mi evaluazion
								</Button>
							</>
						)}
					</div>
				</Container>
			</Box>
		</>
	);
};

export default InscripcionParalelo;
