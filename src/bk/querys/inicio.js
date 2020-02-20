module.exports.consultarAgentesOut = "SELECT btAgenteOutId id,btAgenteOutNombre nom,btAgenteOutExt ext,btagenteOutStsExt sts " +
    "FROM bstntrn.btagenteoutbound A " +
    "LEFT JOIN bstntrn.btestagnt B ON A.btAgenteOutId = B.BTESTAGNTUSR " +
    "LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = A.btAgenteOutClienteId and C.btcontactocmpid = A.btagentecmpid) " +
    "where btAgenteOutSesion ='S' AND btAgenteCmpId=? and btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?);";

module.exports.getAllCampanas = "SELECT btcampanaid ID, CONCAT(btcampanaid, '-', btcampanadescripcion) DSC, btcampanauniverso UNI FROM bstntrn.btcampanas where bstnCanalId = 'IBD' ";

module.exports.getAllCampanasOut = " SELECT btcampanas.btcampanaid ID,Concat(btcampanas.btcampanaid,'-',btcampanadescripcion) DSC,btcampanauniverso UNI, " +
    "ifnull(DATE_FORMAT(btfechahoraprimronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultprim, " +
    "ifnull(DATE_FORMAT(btfechahoraprimrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultprimdet, " +
    "ifnull(DATE_FORMAT(btfechahorasegronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultseg, " +
    "ifnull(DATE_FORMAT(btfechahorasegrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultsegdet, " +
    "ifnull(DATE_FORMAT(btfechahoraterronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultter, " +
    "ifnull(DATE_FORMAT(btfechahoraterrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultterdet, " +
    "ifnull(btusuariorondas,'') ultusuario, " +
    "ifnull(bstnCanalId,'') canal " +
    "FROM bstntrn.btcampanas " +
    "LEFT JOIN bstntrn.btsupervisordet as a on a.btcampanaid=btcampanas.btcampanaid " +
    "LEFT JOIN bstntrn.btsupervisor on a.btsupervisoidn=btsupervisor.btsupervisoidn " +
    "WHERE bstnCanalId in ('OBD','WCAL','CALL') and btsupervisor.btsupervisonomp= ?;";


module.exports.getcmpcallback = "SELECT btcampanas.btcampanaid FROM bstntrn.btcampanas WHERE bstnCanalId in ('WCAL','CALL');";


module.exports.getstatcmplnz = "SELECT btcampanaid ID,Concat(btcampanaid,'-',btcampanadescripcion) DSC,btcampanauniverso UNI, " +
    "ifnull(DATE_FORMAT(btfechahoraprimronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultprim, " +
    "ifnull(DATE_FORMAT(btfechahoraprimrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultprimdet, " +
    "ifnull(DATE_FORMAT(btfechahorasegronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultseg, " +
    "ifnull(DATE_FORMAT(btfechahorasegrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultsegdet, " +
    "ifnull(DATE_FORMAT(btfechahoraterronda,'%d/%m/%Y %H:%i:%s'),'') fechahoraultter, " +
    "ifnull(DATE_FORMAT(btfechahoraterrondadet,'%d/%m/%Y %H:%i:%s'),'') fechahoraultterdet, " +
    "ifnull(btusuariorondas,'') ultusuario FROM bstntrn.btcampanas WHERE btcampanaid = ?;";

module.exports.updatecontcallback = "UPDATE bstntrn.btcontacto SET btcontactosts = 'CANCELADO' where btcontactofecha is not null AND DATE_FORMAT(btcontactofecha,'%Y-%m-%d')=(SELECT (DATE(NOW()) - INTERVAL 1 DAY)) and btcontactosts = 'PENDIENTE';";

module.exports.getnocontactoscmp = "select count(btContactoConsecutivo) nocontactos, ifnull(btcampanaid, ?) ID FROM bstntrn.btcontacto " +
    "inner join bstntrn.btcampanas on btcontacto.btContactoCmpId=btcampanas.btcampanaid " +
    "where btcampanaid= ? and btContactoSts in('ASIGNADA','ATENDIDA', 'CANCELADO') and bstnCanalId in ('OBD','WCAL','CALL');";

module.exports.getnocontactosasign = "select count(btContactoConsecutivo) nocontactos, ifnull(btcampanaid,?) ID FROM bstntrn.btcontacto " +
    "inner join bstntrn.btcampanas on btcontacto.btContactoCmpId=btcampanas.btcampanaid " +
    "where btcampanaid=? and bstnCanalId in ('OBD','WCAL','CALL');";

module.exports.getduracioncampanaprimronda = "select ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btfechahoraprimronda,now())), '')" +
    " duracion from bstntrn.btcampanas WHERE bstnCanalId in ('OBD','WCAL','CALL') and btcampanaid=? ;";

module.exports.getduracioncampanasegronda = "select ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btfechahorasegronda,now())), '')" +
    " duracion, btcampanaid ID from bstntrn.btcampanas WHERE bstnCanalId in ('OBD','WCAL','CALL') and btcampanaid=? ;";

module.exports.getduracioncampanaterronda = "select ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btfechahoraterronda,now())), '')" +
    " duracion, btcampanaid ID from bstntrn.btcampanas WHERE bstnCanalId in ('OBD','WCAL','CALL') and btcampanaid=? ;";

module.exports.getrellamar = "UPDATE bstntrn.btcontacto SET btContactoSts = 'PENDIENTE'  WHERE btContactoCmpId=? and btContactoConsecutivo in (SELECT idcontacto from " +
    "(SELECT btContactoConsecutivo idcontacto, btContactoCmpId idcampana, btContactoSts stat," +
    "(SELECT btcontactotip2 FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1 ) as tipificacion2, " +
    "(SELECT btcontactotip1 FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1) as tipificacion1, " +
    "(SELECT btcontactotipid FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1) as idtipi " +
    "from bstntrn.btcontacto where btContactoCmpId = ?) as i where i.tipificacion2 in (SELECT ifnull(sptllamtipid,'0') statip FROM bstntrn.sptllamtip where sptllamtip.sptremarcar=1) and i.stat <> 'CANCELADO');";


module.exports.getrellamarcallbacks = "UPDATE bstntrn.btcontacto SET btContactoSts = 'PENDIENTE'  WHERE btContactoCmpId=? and btContactoConsecutivo in (SELECT idcontacto from " +
    "(SELECT btContactoConsecutivo idcontacto, btContactoCmpId idcampana, btContactoSts stat, (btContactoCountTel01+btContactoCountTel02+btContactoCountTel03) countel, " +
    "(SELECT btcontactotip2 FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1 ) as tipificacion2, " +
    "(SELECT btcontactotip1 FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1) as tipificacion1, " +
    "(SELECT btcontactotipid FROM bstntrn.btcontactotip where btcontactotipclienteid = btContactoConsecutivo and btcontactotipcamp = btContactoCmpId order by btcontactotipid desc limit 1) as idtipi " +
    "from bstntrn.btcontacto where btContactoCmpId = ?) as i where i.tipificacion2 in (SELECT ifnull(sptllamtipid,'0') statip FROM bstntrn.sptllamtip where sptllamtip.sptremarcar=1) and i.stat <> 'CANCELADO' and i.countel<3);";


module.exports.getuniverso = "SELECT count(*) universo FROM bstntrn.btcontacto inner join bstntrn.btcampanas on btcontacto.btContactoCmpId=btcampanas.btcampanaid where btcontactocmpid =? and bstnCanalId=?;";


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