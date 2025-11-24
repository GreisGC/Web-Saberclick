import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const BodyRespuestas = ({
	id_institucion,
	id_tutoria,
	id_pregunta,
	nro_pregunta,
	enunciado,
	resp_correcta,
	estado,
	onSelectPregunta,
}) => {
	const [listIncisos, setListIncisos] = useState([]);
	const getPreguntas = () => {
		const requestOptions = {
			method: "GET",
			redirect: "follow",
		};

		fetch(
			"http://localhost:4000/pregunta/incisos/" + id_pregunta,
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => setListIncisos(result.incisos ?? []))
			.catch((error) => console.error(error));
	};
	useEffect(() => {
		getPreguntas();
	}, [id_pregunta]);
	return (
		<div className="grid">
			<p>{enunciado}</p>
			<br />
			<div className="grid">
				{listIncisos.map((li) => {
					return (
						<Button
							key={li.id_opcion}
							onClick={() => {
								const respuestaCorrecta = resp_correcta;
								const respuestaElegida = li.contenido;
								const respondioBien =
									respuestaCorrecta.trim() ==
									respuestaElegida.trim();

								onSelectPregunta(
									respuestaCorrecta,
									respuestaElegida,
									respondioBien
								);
							}}
						>{`${li.id_insiso}.- ${li.contenido}`}</Button>
					);
				})}
			</div>
		</div>
	);
};

export default BodyRespuestas;
