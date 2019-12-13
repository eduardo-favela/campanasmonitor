module.exports.consultarAgentes = " SELECT 'I' area, btAgenteInbId id,btAgenteInbNombre nom,btAgenteInbExt ext, btagenteInbtStsExt sts, " +
    " CASE WHEN btagenteInbtStsExt = 'RECESO' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, " +
    " CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteIdLlamada,'') ELSE '' END idllamada, " +
    " ifnull(B.BTESTAGNTT, 'DIS') stsrec,CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN btagenteNumeroCli ELSE '' END Telefono,  " +
    " CASE WHEN ifnull(B.BTESTAGNTT, 'DIS') = 'DIS' THEN '' ELSE BTESTAGNTMOTIVO END permiso, DATE_FORMAT(now(), '%d/%m/%Y') fecha,  " +
    " CASE WHEN btagenteInbtStsExt = 'RECESO' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, " +
    " CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteNombreCli,'') ELSE '' END nombreCliente " +
    " FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR " +
    " INNER JOIN siogen01.cnuser as D on A.btAgenteInbId=D.CNUSERID " +
    " where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%') " +
    " and btagenteIdSupervis=? AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)";

module.exports.consultarAgentesOut = " SELECT 'O' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteOutExt ext,btagenteOutStsExt sts," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(B.BTESTAGNTCALLID,'') else '' END idllamada,ifnull(B.BTESTAGNTT, 'DIS') stsrec," +
    " btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISO permiso,DATE_FORMAT(now(), '%d/%m/%Y') fecha," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente " +
    " FROM bstntrn.btagenteoutbound A " +
    " LEFT JOIN bstntrn.btestagnt B ON A.btAgenteOutId = B.BTESTAGNTUSR " +
    " LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = A.btAgenteOutClienteId and C.btcontactocmpid = A.btagentecmpid) " +
    " where btAgenteOutSesion = 'S' AND btAgenteCmpId like concat('%',?,'%') and btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)";

module.exports.getAllCampanas = "SELECT btcampanaid ID, CONCAT(btcampanaid, '-', btcampanadescripcion) DSC, btcampanauniverso UNI FROM bstntrn.btcampanas where bstnCanalId = 'IBD' ";

module.exports.getAllCampanasOut = " SELECT btcampanaid ID,Concat(btcampanaid,'-',btcampanadescripcion) DSC,btcampanauniverso UNI " +
    " FROM bstntrn.btcampanas WHERE bstnCanalId in ('OBD','WCAL','CALL') ";


//ConsultaSupervisores
module.exports.consultarSupervisores = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor  where btsupervisonomp = ? ";

module.exports.getAllEstatus = "SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor limit 3";

module.exports.getEstatusRes = "SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor WHERE btestatusmonitorId = 'ALL'" +
    "UNION SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor WHERE btestatusmonitorDsc LIKE concat('%','receso','%')";

module.exports.getAllColas = "SELECT '' ID, 'Todas' DSC union SELECT btcolaesperaid ID, btcolaesperadsc DSC FROM bstntrn.btcolaespera";

module.exports.getSupervisor = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor  where btsupervisonomp = ?"

module.exports.getAllSupervisores = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor"

//Indicadores
module.exports.conIndicadores = "SELECT btagenteInbtStsExt estatus,sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0) ) Disponible,SUM(IF (btagenteInbtStsExt = 'EN LLAMADA',1,0) )llamada, " +
    " sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0)  + (IF (btagenteInbtStsExt = 'EN LLAMADA',1,0))) Operacion, " +
    " SUM(IF (BTESTAGNTT = 'SOLAUT',1,0)) solAut, SUM(IF (BTESTAGNTT = 'SOL',1,0)) Sol, SUM(IF (BTESTAGNTT = 'RES',1,0)) Res " +
    " FROM bstntrn.btagenteinbound inner join bstntrn.btestagnt on btagenteinbound.btAgenteInbId=bstntrn.btestagnt.BTESTAGNTUSR " +
    " where btAgenteCmpId like concat('%',?,'%') AND btagenteCola like concat('%',?,'%') " +
    " and btagenteIdSupervis=? AND btagenteInbtStsExt like concat('%',?,'%') AND bstntrn.btestagnt.BTESTAGNTT like concat('%',?) ";

//Indicadores de llamada
module.exports.getConsultarMetricas = "SELECT btmetcontestadas contestadas,btmetabandonadas abandonadas,btmetrecibidas recibidas,btmetespera enespera,btmetivr enivr FROM bstntrn.btmetricas where btmetricasid = 1000;";

module.exports.actualizarMetricas = "update bstntrn.btmetricas set " +
    " btmetcontestadas =(select count(*) Total from asteriskcdrdb.cdr where calldate >= curdate() and  disposition = 'ANSWERED'  and lastapp = 'Dial'" +
    " and dst not in ('300','400','s','i','hang') AND  recordingfile not LIKE '%out-%')," +
    " btmetabandonadas=(select count(*) Total from asteriskcdrdb.cdr where calldate >= curdate() and dstchannel ='' and lastapp = 'Queue' and disposition = 'ANSWERED')" +
    " where btmetricasid = 1000; ";
module.exports.ActualizarIvr = "update bstntrn.btmetricas set btmetrecibidas = btmetcontestadas+btmetabandonadas, btmetivr = ? where btmetricasid = 1000;";
module.exports.ActualizarEspera = "update bstntrn.btmetricas set btmetrecibidas = btmetcontestadas+btmetabandonadas,btmetespera = ? where btmetricasid = 1000;";

//Busca si el agente solicitó receso
module.exports.agenteReceso = "SELECT * FROM bstntrn.btestagnt WHERE BTESTAGNTT = 'SOL' AND BTESTAGNTUSR=?";
//Autorizar Receso
module.exports.autorizaReceso = " UPDATE BSTNTRN.BTESTAGNT SET BTESTAGNTT='SOLAUT' WHERE BTESTAGNTUSR=?";
//Rechazar Receso
module.exports.rechazarReceso = " UPDATE BSTNTRN.BTESTAGNT SET BTESTAGNTT='DIS' WHERE BTESTAGNTUSR=?";

//Cerrar sesion agente
module.exports.cerrarSesionAgt = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = 'NO DISPONIBLE', btAgenteInbSesion = 'N' WHERE btAgenteInbId  = ? ";

module.exports.cerrarSesionAgtOut = "UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = 'NO DISPONIBLE', btAgenteOutSesion = 'N' WHERE btAgenteOutId  = ? ";

//configurar video
module.exports.getAgenteVideo = "SELECT * FROM bstntrn.bstnstatusllamada where userid = ?";

//insertar configuracion
module.exports.newConfiguracion = "INSERT INTO bstntrn.bstnstatusllamada (extension,estatusLlamada,configuraGrabacion,valor,userid) VALUES (?,?,?,?,?)";

//configuracion numLlamadas
module.exports.configuracionNumLlamadas = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion =?, valor = ?,conteLlamada = 0, contador=0, fechaHoraFinal = now() WHERE  userid = ?"
    //configuracion numTiempo
module.exports.configuracionNumTiempo = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = ?,fechaHoraFinal = DATE_ADD(now(), interval '0' ? DAY_SECOND) WHERE  userid = ?"
    //configuracion numDias
module.exports.configuracionNumDias = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = ?, fechaHoraFinal = DATE_ADD(now(), interval ? DAY) WHERE  userid = ?"
    //configuracion siempre o no guardar
module.exports.configuracionVideo = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = 0 WHERE  userid = ?"

//universo
module.exports.universo = "SELECT count(*) universo FROM bstntrn.btcontacto where btcontactocmpid like concat('%',?,'%') ";
// en atencion

// nivel de servicio

//  realizadas
module.exports.realizadas = "SELECT COUNT(*) realizadas FROM asteriskcdrdb.cdr a where (calldate>curdate()  and  curtime()<'23:59:59') and recordingfile like '%out%'  and disposition = 'ANSWERED' " +
    " and lastapp =  'dial' and SUBSTR(peeraccount,1,3) like concat('%',?,'%') ";
// exitosas
module.exports.exitosas = "select count(*) exitosas from bstntrn.btcontactotip where btcontactotip1 = '1' and btcontactotipfecha >= curdate() and btcontactotipcamp like concat('%',?,'%')";
// no exitosas
module.exports.noExitosas = "select count(*) noExitosas from bstntrn.btcontactotip where btcontactotip1 = '2' and btcontactotipfecha >= curdate() and btcontactotipcamp like concat('%',?,'%')";
// rellamar 
module.exports.rellamar = "select count(*) reLlamar from bstntrn.btcontactotip where btcontactotipfecha >= curdate() and btcontactotip1 = '3' and btcontactotipcamp like concat('%',?,'%') ";
// rondas de llamadas
module.exports.guardarRondas = " ? ";