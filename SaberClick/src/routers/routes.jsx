import { Routes, Route} from "react-router-dom";
import {UsuarioForm, UsuarioNav } from "../index";
import Usuarios from "../pages/Usuarios";
export function MyRoutes (){
    return (
        
             <Routes>
                <Route path='/usuarios' element={ <Usuarios />}/>
                <Route path='/formulariousuario' element={ <UsuarioForm />}/>
                <Route path='/navUsuario' element={ <UsuarioNav />}/>
            </Routes>
      
    )
    
}