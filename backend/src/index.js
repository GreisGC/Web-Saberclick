const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

const institucionRoutes = require('./routes/institucion.routes')
const usuarioRoutes = require('./routes/usuario.routes')
const tutorRoutes = require('./routes/tutor.routes')
const estudianteRoutes = require('./routes/estudiante.routes')
const gerenteRoutes = require('./routes/gerente.routes')
const administradorRoutes = require('./routes/administrador.routes')
const tutoriaRoutes = require('./routes/tutoria.routes')
const pagoRoutes = require('./routes/pago.routes')
const paraleloRoutes = require('./routes/paralelo.routes')
const temaRoutes = require('./routes/tema.routes') 
const preguntaRoutes = require('./routes/pregunta.routes')
const opcionRoutes = require('./routes/opcion.routes')
const inscripcionRoutes = require('./routes/inscripcion.routes')
const respuestaRoutes = require('./routes/respuesta.routes')

const app = express()
// cors permite comunicar ambos servidores
app.use(cors()); 
app.use(morgan('dev'))
app.use(express.json());
app.use('/upload', express.static('upload'));


app.use(institucionRoutes)
app.use(usuarioRoutes)
app.use(tutorRoutes)
app.use(estudianteRoutes)
app.use(gerenteRoutes)
app.use(administradorRoutes)
app.use(tutoriaRoutes)
app.use(pagoRoutes)
app.use(paraleloRoutes)
app.use(temaRoutes)
app.use(preguntaRoutes)
app.use(opcionRoutes)
app.use(inscripcionRoutes)
app.use(respuestaRoutes)

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000)
console.log('Server on port 4000')