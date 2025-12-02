
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home'; 
import TutoriasHome from './pages/TutoriasHome'; 
import ParaleloHome from './pages/ParaleloHome'; 


import Usuarios from './pages/Usuarios'; 
import UsuarioForm from './pages/UsuarioForm';
import FormGerente from './pages/FormGerente';
import FormEstudiante from './pages/FormEstudiante';
import FormTutor from './pages/FormTutor';
import Estudiante from './pages/Estudiante';
import Administrador from './pages/Administrador';
import Gerente from './pages/Gerente';
import FormAdministrador from './pages/FormAdministrador';
import Institucion from './pages/Institucion';
import FormInstitucion from './pages/FormInstitucion';
import Tutoria from './pages/Tutoria';
import FormTutoria from './pages/FormTutoria';
import Tema from './pages/Tema';
import Paralelo from './pages/Paralelo';
import Pregunta from './pages/Pregunta';
import Tutor from './pages/Tutor'
//import Menu from './pages/UsuarioNav';
//import {Container} from '@mui/material';
import FormPregunta from './pages/FormPregunta';
import Opcion from './pages/opcion';
import FormParalelo from './pages/FormParalelo';
import FormTema from './pages/FormTema';
import FormOpcion from './pages/FormOpcion';
import Inscripcion from './pages/Inscripcion';
import FormInscripcion from './pages/FormInscripcion';
import { useContext, useEffect } from 'react';
import { SesionContext } from './context/SesionContext';
import { jwtDecode } from 'jwt-decode';
import Evaluacion from './pages/Evaluacion';





function App() {
  const { sesion, setSesionI } = useContext(SesionContext);
  const recuperarSesionDeLocalStorage=()=>{
	const token=localStorage.getItem("x-token");
	if(!token) return;
	const decode = jwtDecode(token);
	const data = decode.data;
	setSesionI({
		rol: data.rol,
		username: data.username,
		id: data.id,
	});
  }
  useEffect(()=>{
	recuperarSesionDeLocalStorage();
  },[])
  return (
	
	<BrowserRouter>
		{/* <Menu/> */}
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/TutoriasHome" element={<TutoriasHome />} />
			<Route path="/ParaleloHome" element={<ParaleloHome />} />
			<Route path="/usuarios" element={<Usuarios />} />
			<Route path="/estudiante" element={<Estudiante />} />
			<Route path="/administrador" element={<Administrador />} />
			<Route path="/gerente" element={<Gerente />} />
			<Route path="/institucion" element={<Institucion />} />
			<Route path="/tutor" element={<Tutor />} /> 
			<Route path="/tema" element={<Tema />} />
			<Route path="/paralelo" element={<Paralelo />} />
			<Route path="/tutoria" element={<Tutoria />} />
			<Route path="/pregunta" element={<Pregunta />} />
			<Route path="/opcion" element={<Opcion />} />
			<Route path="/inscripcion" element={<Inscripcion />} />

			<Route path="/usuarios/new/Usuario" element={<UsuarioForm/>}/>
			<Route path="/usuarios/new/Gerente" element={<FormGerente/>}/>
			<Route path="/usuarios/new/Estudiante" element={<FormEstudiante/>}/>
			<Route path="/usuarios/new/Tutor" element={<FormTutor/>}/>
			<Route path="/usuarios/new/Administrador" element={<FormAdministrador/>}/>
			<Route path="/usuarios/new/Institucion" element={<FormInstitucion/>}/>
			<Route path="/usuarios/new/Tutoria" element={<FormTutoria/>}/>
			<Route path="/usuarios/new/Pregunta" element={<FormPregunta/>}/>
			<Route path="/usuarios/new/Paralelo" element={<FormParalelo/>}/>
			<Route path="/usuarios/new/Tema" element={<FormTema/>}/>
			<Route path="/usuarios/new/Opcion" element={<FormOpcion/>}/>
			<Route path="/usuarios/new/Inscripcion" element={<FormInscripcion/>}/>
			
			
			<Route path="/estudiante/:id/edit" element={<FormEstudiante />}/>
			<Route path="/administrador/:id/edit" element={<FormAdministrador/>}/>
			<Route path="/gerente/:id/edit" element={<FormGerente/>}/>
			<Route path="/institucion/:id/edit" element={<FormInstitucion/>}/>
			<Route path="/tutoria/:id/edit" element={<FormTutoria/>}/>
			<Route path="/pregunta/:id/edit" element={<FormPregunta/>}/>
			<Route path="/paralelo/:id/edit" element={<FormParalelo/>}/>
			<Route path="/tema/:id/edit" element={<FormTema/>}/>
			<Route path="/opcion/:id/edit" element={<FormOpcion/>}/>
			<Route path="/inscripcion/:id/edit" element={<FormInscripcion/>}/>
			<Route path="/tutor/:id/edit" element={<FormTutor/>}/>

			<Route path="/evaluacion" element={<Evaluacion/>}/>
		</Routes>
	</BrowserRouter>
    
  );
}

export default App;
