import { Button } from "@mui/material";
import { useState } from "react";
import BodyRespuestas from "./BodyRespuestas";

const ViewEvaluacion = ({
	id_institucion,
	id_tutoria,
	onSendNota,
	id_inscripcion,
}) => {
	const [notaTotal, setNotaTotal] = useState(null);
	const [nroPregunta, setNroPregunta] = useState(0);
	const [listaPreguntas, setListaPreguntas] = useState([]);
	const [preguntaActual, setPreguntaActual] = useState(null);
	const [respuestas, setRespuestas] = useState([]);

	const getEvaluacion = () => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			id_institucion: id_institucion,
			id_tutoria: id_tutoria,
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow",
		};

		fetch("http://localhost:4000/pregunta/listarPreguntas", requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if (result.preguntas.leng) {
					setListaPreguntas([]);
					return;
				}
				setListaPreguntas(result.preguntas);
				setPreguntaActual(result.preguntas[0]);
				setNroPregunta(0);
			})
			.catch((error) => console.error(error));
	};

	const sendNroIntento = (notaT) => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			id_inscripcion: id_inscripcion,
			nota: notaT,
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow",
		};

		fetch("http://localhost:4000/updateNota", requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	};
	return (
		<>
			{listaPreguntas.length > 0 && preguntaActual ? (
				<>
					<BodyRespuestas
						{...listaPreguntas[nroPregunta]}
						onSelectPregunta={(
							respuestaCorrecta,
							respuestaElegida,
							respondioBien
						) => {
							setRespuestas((v) => {
								v.push({
									respuestaCorrecta,
									respuestaElegida,
									respondioBien,
								});
								return v;
							});
							setNroPregunta((n) => n + 1);
							if (nroPregunta >= listaPreguntas.length - 1) {
								const correcto = respuestas.filter(
									(r) => r.respondioBien
								);
								const t =
									(correcto.length / respuestas.length) * 100;
								sendNroIntento(t);
								setNotaTotal(t);
								setListaPreguntas([]);
								onSendNota();
								return;
							}
						}}
					/>
					{notaTotal != null ? (
						<div className="grid">
							<p className="font-bold">{`Nota total: ${notaTotal}`}</p>
							{respuestas.map((r, index) => (
								<div
									className="grid"
									key={r.respuestaCorrecta + index}
								>
									<p>{`Pregunta ${index + 1}`}</p>
									<p>
										{`Respuesta correcta: ${r.respuestaCorrecta}`}
									</p>
									<p>
										{`Respuesta elegida: ${r.respuestaElegida}`}
									</p>
									-----------------------------------------------
								</div>
							))}
						</div>
					) : (
						<></>
					)}
				</>
			) : (
				<>
					<Button
						size="small"
						onClick={() => {
							getEvaluacion();
						}}
					>
						Comenzar Evaluacion
					</Button>
				</>
			)}
		</>
	);
};

export default ViewEvaluacion;
