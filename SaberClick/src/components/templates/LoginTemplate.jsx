import styled from "styled-components";
import {Title, InputText2, Btnsave, Linea, Footer} from "../../index";
import {v} from "../../styles/variables";
import {Device} from "../../styles/breakpoints";

export function LoginTemplate() {
    return(
        <Container>
                <div className="card">
                    <Title $paddingbottom="20px">Ingresar</Title>
                    <form>
                        <InputText2>
                            <input className="form__field" placeholder="email" type="text"/>
                            
                        </InputText2>

                        <InputText2>
                            <input 
                                className="form__field" 
                                placeholder="contraseña" 
                                type="password"
                            />
                        </InputText2>
                        <Btnsave 
                            titulo="INGRESAR" 
                            bgcolor="#1CB0F6" 
                            color="255, 255, 255" 
                            width="100%"
                        />
                    </form>
                    <Linea>
                        <span>0</span>
                    </Linea>
                    <Btnsave titulo="Google" bgcolor="fff" icono={<v.iconogoogle/>}/>
                    
                </div>
                <Footer/>
        </Container>);
}
const Container =styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    
        .card{
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            width: 100%;
            margin: 20px;
            @media ${Device.tablet}{
                width: 400px;
            }
        }
`