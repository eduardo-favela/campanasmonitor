module.exports.Estaenreceso =  "SELECT BTESTAGNTT sts FROM bstntrn.btestagnt where  BTESTAGNTUSR = ? and BTESTAGNTMOTIVOID != 'FJLA' ";

module.exports.CerrarSesion =  "DELETE FROM bstntrn.monac WHERE monacID=?";

module.exports.updateMovimientosUsuario =  " UPDATE  bstntrn.btmpersonal "
                    +" SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = CURDATE() ,btmpersonalHFIN= current_time(),btmpersonalDUR = SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) "
                    +" WHERE SIOUSUARIOID= ?  and btmpersonalRECID= 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";
      
module.exports.calcularIdmonacH =   "SELECT COALESCE(MAX(monacHID)+1,1) AS id FROM bstntrn.monach";

module.exports.InsertarSesionTrabajoHistorial= "INSERT INTO bstntrn.monach"
+"   (monacHID,monacID,"
 +"  monacAP,"
 +"   monacF,"
 +"  monacH,"
+"  monacUA,"
+"  monacIP,"
+"  monacEST,"
+"  monacOD,"
+"  monacIDEQUIPO,"
+"  monacRAN)"
+"  VALUES"
+" (?,?,'Agente',CURDATE(),current_time(),'Programa del agente',?,?,'',?,'0')";

module.exports.actulizarAgenteOutbound="UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = ?,btAgenteOutSesion = ? WHERE btAgenteOutId = ? ";
module.exports.actulizarAgenteInbound="UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";