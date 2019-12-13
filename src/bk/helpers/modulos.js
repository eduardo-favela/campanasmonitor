const querys = require('../querys/modulos');
const pool = require('../cnn/database');

module.exports.getUsuario = async (usuarioid) => 
{
    var objUsuario={};
    const alUsuarios = await pool.query(querys.getUsuarioValido, [usuarioid.trim()]);
    const areas = await pool.query(querys.getAreas, [usuarioid.trim()]);
    objUsuario.CNUSERID=alUsuarios[0].SSUSRID;
    objUsuario.CNUSERDSC=alUsuarios[0].SSUSRDSC;
    objUsuario.CNCDIRID=alUsuarios[0].CNCDIRID;
	objUsuario.CNUSERDSCL=alUsuarios[0].CNUSERDSCL;
	objUsuario.AREAS= areas;
	objUsuario.CNUSERACC=alUsuarios[0].CNUSERACC; 
	objUsuario.CNUSERESTATUS=alUsuarios[0].CNUSERESTATUS;
	objUsuario.CNUSERCATCOL=alUsuarios[0].CNUSERCATCOL;
	objUsuario.SMSUSERNOM=alUsuarios[0].SMSUSERNOM;
	objUsuario.SMSUSERKEY=alUsuarios[0].SMSUSERKEY;
	objUsuario.code= "";
	objUsuario.descripcion= "";
	objUsuario.success= "";							
    return objUsuario; 
}

module.exports.getModulosArea = async (datos) => 
{
    const modulosAres = await pool.query(querys.getModulosAreas, [datos.RPFARESID,datos.RPFLINEA]);
    var modulosAreas={};
    return modulosAreas.modulosAreas=modulosAres;
}

module.exports.getArbol = async (datos) => 
{
    var configuracion = await pool.query(querys.tieneConfiguracion, [datos.CNESMNID,datos.RPFLINEA]);
    if(configuracion.length>0){
        configuracion = await pool.query(querys.getMenuArbolConf, [datos.CNESMNID,datos.RPFLINEA]);
    }else{
        configuracion = await pool.query(querys.getMenuArbol, [datos.CNESMNID]);
    }
    return configuracion;
}
