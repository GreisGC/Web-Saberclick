import { useState } from "react";
import { SesionContext } from "./SesionContext";

const SesionProvider = ({ children }) => {
	const [sesion, setSesion] = useState(null);
	const [id_paraleloI, setId_paraleloI] = useState(null);
	const [id_tutoriaI, setId_tutoriaI] = useState(null);
	const [institucion, setInstitucion] = useState({
		id_institucion: 0,
		nombre_institucion: "",
		descripcion: "",
	});

	const [tutoria, setTutoria] = useState({
		id_tutoria: 0,
		nombre_tutoria: "",
		descripcion: "",
		costo: 0,
	});
	const [paralelo, setParalelo] = useState({
		id_paralelo: 0,
		id_tutoria: 0,
		id_tutor: 0,
		nombre_paralelo: "",
		hora_ini: "",
		hora_fin: "",
		fecha_ini: "",
		fecha_fin: "",
		dia: "",
		modalidad: "",
		enlace: "",
	});

	const [tema, setTema] = useState({
		id_tema: 0,
		descripcion: "",
		contenido: "",
	});

	const [tutor, setTutor] = useState({
		id_tutor: 0,
		id_usuario: 0,
		especialidad: "",
		anos_experiencia: "",
		cv: "",
	});

	const setInstitucionI = (s) => {
		setInstitucion(s);
	};
	const setTutoriaI = (s) => {
		setTutoria(s);
	};
	const setParaleloI = (s) => {
		setParalelo(s);
	};
	const setTemaI = (s) => {
		setTema(s);
	};
	const setTutorI = (s) => {
		setTutor(s);
	};
	const setSesionI = (s) => {
		setSesion(s);
	};
	const setId_paraleloII = (s) => {
		setId_paraleloI(s);
	};
	const setId_tutoriaII = (s) => {
		setId_tutoriaI(s);
	};

	return (
		<SesionContext.Provider
			value={{
				sesion,
				setSesionI,
				institucion,
				setInstitucionI,
				tutoria,
				setTutoriaI,
				paralelo,
				setParaleloI,
				tema,
				setTemaI,
				tutor,
				setTutorI,
				id_paraleloI,
				id_tutoriaI,
				setId_paraleloII,
				setId_tutoriaII,
			}}
		>
			{children}
		</SesionContext.Provider>
	);
};

export default SesionProvider;
