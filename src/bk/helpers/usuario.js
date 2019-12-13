const querys = require('../querys/usuario');
const pool = require('../cnn/database');

module.exports.CerrarSesion = async (idAgente) => {
    const receso=await pool.query(querys.Estaenreceso, [idAgente]); 
    if(receso[0].sts!="RES")
    {
        await pool.query(querys.CerrarSesion, [idAgente]);   
        await pool.query(querys.updateMovimientosUsuario, [idAgente]);  
        const max=await pool.query(querys.calcularIdmonacH, []);  
        await pool.query(querys.InsertarSesionTrabajoHistorial, [max[0].id,idAgente,"","2",""]); 
        await pool.query(querys.actulizarAgenteOutbound, ["NO DISPONIBLE","N",idAgente]);
        await pool.query(querys.actulizarAgenteInbound, ["NO DISPONIBLE","N",idAgente]);        
    }
    return "ok"
}