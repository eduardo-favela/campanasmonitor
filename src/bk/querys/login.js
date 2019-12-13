
module.exports.validaUsuario = "SELECT a.SSUSRID, a.SSUSRDSC, a.SSUSRPSW, a.SSUSRKEY "
+" FROM siogen01.ssusri a  INNER JOIN cnuser b  ON b.CNUSERID = a.SSUSRID WHERE a.SSUSRID = ?";

module.exports.nombreUsuario = "SELECT A.SSUSRID,A.SSUSRDSC,A.SSUSRPSW,ifnull(A.SSUSRKEY,-1) SSUSRKEY,ifnull(B.CNCDIRID,-1) CNCDIRID, ifnull(B.CNUSERACC,'si') CNUSERACC ,ifnull(B.CNUSERESTATUS,'1') CNUSERESTATUS , ifnull(B.CNUSERCATCOL,'no') CNUSERCATCOL,B.CNUSERFOTO,"+
" ifnull(C.SMSUSERNOM,-1) SMSUSERNOM, ifnull(C.SMSUSERKEY,-1) SMSUSERKEY FROM SSUSRI A"+
" INNER JOIN CNUSER B ON B.CNUSERID = A.SSUSRID "+
"  LEFT JOIN SMSUSER C ON B.SMSUSERID = C.SMSUSERID" +
" WHERE A.SSUSRID = ?";

module.exports.consultarPorId= " SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound,"+      
                            +" CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor "
                            +" FROM siogen01.cnuser a  "
                            +" left join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn"
                            +" left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid "
                            +" left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid "
                            +" left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId "
                            +" left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " 
                            +" WHERE cnuserID = ?  and CNUSERBAJA='N' ";

module.exports.insertarMovimientos="INSERT INTO bstntrn.btmpersonal (btmpersonalIDN, SIOUSUARIOID, btmpersonalRECID, btmpersonalFINI,btmpersonalHINI,BTCRECESONOMC) "
+" VALUES (?,?,'SBSC', CURDATE(),current_time(),'SESION SC')";

module.exports.actulizarAgenteOutbound= "UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = ?,btAgenteOutSesion = ? WHERE btAgenteOutId = ? ";

module.exports.actulizarAgenteInbound= "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = ?,btAgenteInbSesion = ?  WHERE btAgenteInbId = ? ";

module.exports.updateMovimientosRecesoUsuario= " UPDATE  bstntrn.btmpersonal "
    +" SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = CURDATE() ,btmpersonalHFIN= current_time(), btmpersonalDUR= SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) "
    +" WHERE SIOUSUARIOID= ? and btmpersonalRECID <> 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";

module.exports.actulizarRecesos= "UPDATE bstntrn.btestagnt SET BTESTAGNTT = 'DIS' WHERE BTESTAGNTUSR = ? ";

module.exports.consultarPorId=  " SELECT cnuserid id, cnuserdsc nombre, btAgenteInbExt extension,CNUSERSERIN servidorin,ifnull(servin.servidorespasedominio,'0') domin,btAgenteOutExt extensionOutbound,"+   
" CNUSERSEROUT servidorout,ifnull(servout.servidorespasedominio,'0') domout, b.btsupervisonoml supervisor "+
" FROM siogen01.cnuser a  "+
" left join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn"+
" left join espejoshistoricos.servidorespase servin on a.CNUSERSERIN = servin.servidorespaseid "+
" left join espejoshistoricos.servidorespase servout on a.CNUSERSEROUT = servout.servidorespaseid "+
" left join bstntrn.btagenteinbound ain on a.cnuserid = ain.btAgenteInbId "+
" left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " +
" WHERE cnuserID = ?  and CNUSERBAJA='N' ";


module.exports.calcularIdbtmpersonal= "SELECT COALESCE(MAX(btmpersonalIDN)+1,1) AS id FROM bstntrn.btmpersonal";

module.exports.Estaenreceso =  "SELECT BTESTAGNTT sts FROM bstntrn.btestagnt where  BTESTAGNTUSR = ? and BTESTAGNTMOTIVOID != 'FJLA' ";

module.exports.infoReceso =  "select BTMPERSONALHINI,BTCRECESONOMC from bstntrn.btmpersonal where SIOUSUARIOID=? and BTMPERSONALFINI=curdate() and BTMPERSONALHFIN IS NULL";
