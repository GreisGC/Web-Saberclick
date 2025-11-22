import { useState } from "react";
import { SesionContext } from "./SesionContext";

const SesionProvider = ({ children }) => {
	const [sesion, setSesion] = useState(null);

	const setSesionI = (s) => {
		setSesion(s);
	};

	return (
		<SesionContext.Provider value={{ sesion, setSesionI }}>
			{children}
		</SesionContext.Provider>
	);
};

export default SesionProvider;
