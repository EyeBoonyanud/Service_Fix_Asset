const express = require("express");
const oracledb = require("oracledb");
const multer = require("multer");
const path = require("path");
const uploadsPath = path.join(__dirname, "../uploads");
const app = express();
const port = 5000;
app.use(express.json());

// oracledb.initOracleClient({
//   tnsAdmin: "D:\\app\\Administrator\\product\\11.2.0\\client_1\\network\\admin",
//   //process.env.TNS_ADMIN
// });

const AVO = {
  user: "avo",
  password: "avo",
  connectString: "TCIX01",
};

const QAD = {
  user: "qad",
  password: "qad",
  connectString: "TCIX01",
};

const CUSR = {
  user: "cusr",
  password: "cusr",
  connectString: "TCIX01",
};

//CountTransfer
module.exports.getCountTransfer = async function (req, res) {
  try {
    const{UserLogin}=  req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT  COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = T.FRH_FAM_NO
    WHERE 1=1
        AND (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLTR001'
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLTR002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLTR003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLTR004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR005')
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR008')
        OR ( A.FRT_RECEIVE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR009')
        OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR010')
        OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLTR011')
        OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR012')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR092')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR093')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR094')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR095')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR096')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR907')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR908')
        OR (T.FAM_REQ_BY   = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR909')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR910')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR911')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR912'))
        
       AND T.FAM_REQ_TYPE  = 'GP01001'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountTransfer", error.message);
  }
};
 
//CountTransferListALL
module.exports.getCountTransferlistaLL = async function (req, res) {
  try {
    const {UserLogin} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR001' THEN 1 ELSE NULL END) AS T_CREATE,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR002' THEN 1 ELSE NULL END) AS T_WAIT_DM,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR003' THEN 1 ELSE NULL END) AS T_WAIT_SDC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR004' THEN 1 ELSE NULL END) AS T_WAIT_BOI_SC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR005' THEN 1 ELSE NULL END) AS T_WAIT_BOI_M,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR006' THEN 1 ELSE NULL END) AS T_WAIT_FACTORY_M,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR007' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR008' THEN 1 ELSE NULL END) AS T_WAIT_O_C,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR009' THEN 1 ELSE NULL END) AS T_WAIT_RECEIVER_A,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR010' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SUD,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR011' THEN 1 ELSE NULL END) AS T_WAIT_ACC_MGR,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR012' THEN 1 ELSE NULL END) AS T_WAIT_SERVICE_DC
FROM FAM_FLOW_MASTER TT
LEFT JOIN FAM_REQ_HEADER HT ON HT.FAM_REQ_STATUS = TT.FFM_CODE
LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = HT.FRH_FAM_NO
WHERE
    TT.FFM_TYPE = 'TRANSFER'
    AND TT.FFM_STATUS = 'A'
    AND (
        HT.FAM_REQ_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR001'
        OR HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR002'
        OR HT.FAM_SERVICE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR003'
        OR HT.FAM_BOI_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR004'
        OR HT.FAM_BOI_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR005'
        OR HT.FAM_FM_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR006'
        OR HT.FAM_ACC_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR007'
        OR HT.FAM_OWNER_SEND_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR008'
        OR A.FRT_RECEIVE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR009'
        OR HT.FAM_ACC_REC_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR010'
        OR HT.FAM_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR011'
        OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR012' )
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountTransferlistaLL", error.message);
  }
};
//CountTransferListALLname
module.exports.getCountTransferlistaLLname = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC,FFM_SEQ  
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'TRANSFER'
    AND (F.FFM_CODE BETWEEN 'FLTR001' AND 'FLTR012')
    ORDER BY F.FFM_SEQ
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountTransferlistaLLname", error.message);
  }
};

//CountLoss
module.exports.getCountLoss = async function (req, res) {
    try {
      const{UserLogin}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT  COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    WHERE 1=1
        AND (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS001'
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS005')
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS008')
        OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS010')
        OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS011')
        OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS012')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS092')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS093')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS094')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS095')
        OR (T.FAM_REQ_BY   = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS096')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS907')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS908')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS910')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS911')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS912'))
       AND T.FAM_REQ_TYPE  = 'GP01004'
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLoss", error.message);
    }
  };
//CountScrap
module.exports.getCountScrap = async function (req, res) {
  try {
    const{UserLogin}=  req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    LEFT JOIN FAM_REQ_SCRAP S ON T.FRH_FAM_NO = S.FRSC_FAM_NO
    WHERE 1=1
    AND (
        (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC001')
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC005')
        OR (T.FAM_FM_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC008')
        OR (S.FRSC_ENV_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC009')
        OR (S.FRSC_PLN_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC100')
        OR (S.FRSC_SHP_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC101')
        OR (T.FAM_ACC_REC_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC010')
        OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC011')
        OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC012')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC092')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC093')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC094')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC095')
        OR (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLS096')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC907')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC908')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC910')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC911')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSC912'))
        AND T.FAM_REQ_TYPE  = 'GP01002'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLoss", error.message);
  }
};
//CountSale
module.exports.getCountSale = async function (req, res) {
  try {
    const{UserLogin}=  req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    LEFT JOIN FAM_REQ_SALES S ON T.FRH_FAM_NO = S.FRSL_FAM_NO 
    WHERE 1=1
    AND (
        (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL001')
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL005')
        OR (T.FAM_FM_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL008')
         OR (S.FRSL_ENV1_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL009')
      OR (S.FRSL_PLN1_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL010')
      OR (S.FRSL_IMP1_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL011')
      OR (S.FRSL_BOI1_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL012')
      OR (S.FRSL_IMP2_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL013')
      OR( S.FRSL_PLN2_BY  = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL014')
      OR (S.FRSL_ENV2_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL015' )
      OR (S.FRSL_BOI2_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL016' )
      OR (S.FRSL_ENV3_BY  = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL017' )
      OR (S.FRSL_PLN3_BY  = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL018') 
      OR (S.FRSL_SHP_BY  = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL019' )
      OR (S.FRSL_PLN4_BY  = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL020' )
      OR (T.FAM_ACC_REC_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL021' )
      OR (T.FAM_ACC_MGR_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL022' )
      OR (T.FAM_SERVICE_CLOSE_BY = '${UserLogin}'AND T.FAM_REQ_STATUS = 'FLSL023')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL092')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL093')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL094')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL095')
        OR (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL096')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL097')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL098')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL921')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL922')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL923')
        OR (T.FAM_REQ_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLSL924'))
        AND T.FAM_REQ_TYPE  = 'GP01003'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountSale", error.message);
  }
};
  
 //CountLossListALL
module.exports.getCountLosslistaLL = async function (req, res) {
  try {
    const {UserLogin} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS001' THEN 1 ELSE NULL END) AS T_CREATE,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS002' THEN 1 ELSE NULL END) AS T_WAIT_DM,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS003' THEN 1 ELSE NULL END) AS T_WAIT_SDC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS004' THEN 1 ELSE NULL END) AS T_WAIT_BOI_SC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS005' THEN 1 ELSE NULL END) AS T_WAIT_BOI_M,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS006' THEN 1 ELSE NULL END) AS T_WAIT_FACTORY_M,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS007' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SC,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS008' THEN 1 ELSE NULL END) AS T_WAIT_O_C,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS010' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SUD,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS011' THEN 1 ELSE NULL END) AS T_WAIT_ACC_MGR,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLLS012' THEN 1 ELSE NULL END) AS T_WAIT_SERVICE_DC
FROM FAM_FLOW_MASTER TT
LEFT JOIN FAM_REQ_HEADER HT ON HT.FAM_REQ_STATUS = TT.FFM_CODE
WHERE
    TT.FFM_TYPE = 'LOSS'
    AND TT.FFM_STATUS = 'A'
    AND (
        HT.FAM_REQ_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS001'
        OR HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS002'
        OR HT.FAM_SERVICE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS003'
        OR HT.FAM_BOI_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS004'
        OR HT.FAM_BOI_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS005'
        OR HT.FAM_FM_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS006'
        OR HT.FAM_ACC_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS007'
        OR HT.FAM_OWNER_SEND_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS008'
        OR HT.FAM_ACC_REC_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS010'
        OR HT.FAM_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS011'
        OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLS012' )
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLosslistaLL", error.message);
  }
};
//CountLossListALLname
module.exports.getCountLosslistaLLname = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC,F.FFM_SEQ 
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'LOSS'
    AND (F.FFM_CODE BETWEEN 'FLLS001' AND 'FLLS012')
    ORDER BY F.FFM_SEQ 
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLosslistaLLname", error.message);
  }
};
   

//CountWrite_off
module.exports.getCountWrite_off = async function (req, res) {
    try {
      const{UserLogin}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT  COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    WHERE 1=1
        AND (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLWO001'
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLWO002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLWO003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLWO004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO005')
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO008')
        OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO010')
        OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLWO011')
        OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO012')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO092')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO093')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO094')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO095')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO096')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO907')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO908')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO910')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO911')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLWO912'))
       AND T.FAM_REQ_TYPE  = 'GP01005' 
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountWrite_off", error.message);
    }
  };
//CountWrite_offListALL
module.exports.getCountWrite_offlistaLL = async function (req, res) {
    try {
      const {UserLogin} = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO001' THEN 1 ELSE NULL END) AS T_CREATE,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO002' THEN 1 ELSE NULL END) AS T_WAIT_DM,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO003' THEN 1 ELSE NULL END) AS T_WAIT_SDC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO004' THEN 1 ELSE NULL END) AS T_WAIT_BOI_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO005' THEN 1 ELSE NULL END) AS T_WAIT_BOI_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO006' THEN 1 ELSE NULL END) AS T_WAIT_FACTORY_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO007' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO008' THEN 1 ELSE NULL END) AS T_WAIT_O_C,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO010' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SUD,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO011' THEN 1 ELSE NULL END) AS T_WAIT_ACC_MGR,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLWO012' THEN 1 ELSE NULL END) AS T_WAIT_SERVICE_DC
  FROM FAM_FLOW_MASTER TT
  LEFT JOIN FAM_REQ_HEADER HT ON HT.FAM_REQ_STATUS = TT.FFM_CODE
  WHERE
      TT.FFM_TYPE = 'WRITE-OFF'
      AND TT.FFM_STATUS = 'A'
      AND (
          HT.FAM_REQ_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO001'
          OR HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO002'
          OR HT.FAM_SERVICE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO003'
          OR HT.FAM_BOI_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO004'
          OR HT.FAM_BOI_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO005'
          OR HT.FAM_FM_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO006'
          OR HT.FAM_ACC_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO007'
          OR HT.FAM_OWNER_SEND_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO008'
          OR HT.FAM_ACC_REC_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO010'
          OR HT.FAM_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO011'
          OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLWO012' )
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountWrite_offlistaLL", error.message);
    }
  };
  //CountWrite_offListALLname
  module.exports.getCountWrite_offlistaLLname = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
    SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC,FFM_SEQ   
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'WRITE-OFF'
    AND (F.FFM_CODE BETWEEN 'FLWO001' AND 'FLWO012')
 	  ORDER BY F.FFM_SEQ 
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountWrite_offlistaLLname", error.message);
    }
  };

  
//CountLending
module.exports.getCountLending = async function (req, res) {
    try {
      const{UserLogin}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT  COUNT(T.FRH_FAM_NO)
      FROM FAM_REQ_HEADER T
      LEFT JOIN FAM_REQ_LENDING LD ON LD.FRL_FAM_NO  = T.FRH_FAM_NO
      WHERE 1=1
          AND (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLD001'
          OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLD002')
          OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLD003')
          OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLD004')
          OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD005')
          OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD006')
          OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD007')
          OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD008')
          OR (LD.FRL_ACC_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD009')
          OR (LD.FRL_OWNER_RETURN_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD100')
          OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD010')
          OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLLD011')
          OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD012')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD092')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD093')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD094')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD095')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD096')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD907')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD908')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD909')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD109')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD910')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD911')
          OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLD912'))
         AND T.FAM_REQ_TYPE  = 'GP01006' 
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLending", error.message);
    }
  };

  //CountLendingListALL
module.exports.getCountLendinglistaLL = async function (req, res) {
    try {
      const {UserLogin} = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD001' THEN 1 ELSE NULL END) AS T_CREATE,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD002' THEN 1 ELSE NULL END) AS T_WAIT_DM,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD003' THEN 1 ELSE NULL END) AS T_WAIT_SDC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD004' THEN 1 ELSE NULL END) AS T_WAIT_BOI_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD005' THEN 1 ELSE NULL END) AS T_WAIT_BOI_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD006' THEN 1 ELSE NULL END) AS T_WAIT_FACTORY_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD007' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD008' THEN 1 ELSE NULL END) AS T_WAIT_O_C,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD009' THEN 1 ELSE NULL END) AS T_WAIT_ACC_RE,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD100' THEN 1 ELSE NULL END) AS T_WAIT_O_RE,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD010' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SUD,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD011' THEN 1 ELSE NULL END) AS T_WAIT_ACC_MGR,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLLD012' THEN 1 ELSE NULL END) AS T_WAIT_SERVICE_DC
  FROM FAM_FLOW_MASTER TT
  LEFT JOIN FAM_REQ_HEADER HT ON HT.FAM_REQ_STATUS = TT.FFM_CODE
  LEFT JOIN FAM_REQ_LENDING LD ON LD.FRL_FAM_NO  = HT.FRH_FAM_NO
  WHERE
      TT.FFM_TYPE = 'LENDING'
      AND TT.FFM_STATUS = 'A'
      AND (
          HT.FAM_REQ_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD001'
          OR HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD002'
          OR HT.FAM_SERVICE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD003'
          OR HT.FAM_BOI_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD004'
          OR HT.FAM_BOI_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD005'
          OR HT.FAM_FM_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD006'
          OR HT.FAM_ACC_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD007'
          OR HT.FAM_OWNER_SEND_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD008'
          OR LD.FRL_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD009'
          OR LD.FRL_OWNER_RETURN_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD100'
          OR HT.FAM_ACC_REC_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD010'
          OR HT.FAM_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD011'
          OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLLD012' )
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLendinglistaLL", error.message);
    }
  };
  //CountLendingListALLname
  module.exports.getCountLendinglistaLLname = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC,FFM_SEQ   
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'LENDING'
    AND (F.FFM_CODE BETWEEN 'FLLD001' AND 'FLLD012')
    OR F.FFM_CODE = 'FLLD100'
 	ORDER BY F.FFM_SEQ
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountLendinglistaLLname", error.message);
    }
  };


//CountDonation
module.exports.getCountDonation = async function (req, res) {
    try {
      const{UserLogin}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT  COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    WHERE 1=1
        AND (T.FAM_REQ_BY = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLDN001'
        OR (T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLDN002')
        OR (T.FAM_SERVICE_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLDN003')
        OR (T.FAM_BOI_CHK_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLDN004')
        OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN005')
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN006')
        OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN007')
        OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN008')
        OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN010')
        OR (T.FAM_ACC_MGR_BY  = '${UserLogin}' AND T.FAM_REQ_STATUS = 'FLDN011')
        OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN012')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN092')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN093')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN094')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN095')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN096')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN907')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN908')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN910')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN911')
        OR (T.FAM_REQ_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLDN912'))
       AND T.FAM_REQ_TYPE  = 'GP01007' 
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountDonation", error.message);
    }
  };
    //CountDonationListALL
module.exports.getCountDonationlistaLL = async function (req, res) {
    try {
      const {UserLogin} = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN001' THEN 1 ELSE NULL END) AS T_CREATE,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN002' THEN 1 ELSE NULL END) AS T_WAIT_DM,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN003' THEN 1 ELSE NULL END) AS T_WAIT_SDC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN004' THEN 1 ELSE NULL END) AS T_WAIT_BOI_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN005' THEN 1 ELSE NULL END) AS T_WAIT_BOI_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN006' THEN 1 ELSE NULL END) AS T_WAIT_FACTORY_M,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN007' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SC,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN008' THEN 1 ELSE NULL END) AS T_WAIT_O_C,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN010' THEN 1 ELSE NULL END) AS T_WAIT_ACC_SUD,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN011' THEN 1 ELSE NULL END) AS T_WAIT_ACC_MGR,
      COUNT(CASE WHEN TT.FFM_CODE = 'FLDN012' THEN 1 ELSE NULL END) AS T_WAIT_SERVICE_DC
  FROM FAM_FLOW_MASTER TT
  LEFT JOIN FAM_REQ_HEADER HT ON HT.FAM_REQ_STATUS = TT.FFM_CODE
  WHERE
      TT.FFM_TYPE = 'DONATION'
      AND TT.FFM_STATUS = 'A'
      AND (
          HT.FAM_REQ_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN001'
          OR HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN002'
          OR HT.FAM_SERVICE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN003'
          OR HT.FAM_BOI_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN004'
          OR HT.FAM_BOI_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN005'
          OR HT.FAM_FM_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN006'
          OR HT.FAM_ACC_CHK_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN007'
          OR HT.FAM_OWNER_SEND_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN008'
          OR HT.FAM_ACC_REC_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN010'
          OR HT.FAM_ACC_MGR_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN011'
          OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLDN012' )
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountDonationlistaLL", error.message);
    }
  };
  
  //CountDonationListALLname
  module.exports.getCountDonationlistaLLname = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC,FFM_SEQ   
      FROM FAM_FLOW_MASTER F
      WHERE F.FFM_TYPE = 'DONATION'
      AND (F.FFM_CODE BETWEEN 'FLDN001' AND 'FLDN012')
      ORDER BY F.FFM_SEQ
           `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountDonationlistaLLname", error.message);
    }
  };
// CountScrap
module.exports.getCountScraplistaLLname = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC, F.FFM_SEQ
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'SCRAP'
    AND F.FFM_CODE NOT IN 
    ('FLSC092', 'FLSC093', 'FLSC094', 'FLSC095',
    'FLSC096', 'FLSC907', 'FLSC908', 'FLSC899', 
    'FLSC910', 'FLSC911', 'FLSC912', 'FLSC999')
    ORDER BY F.FFM_SEQ
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountScraplistaLLname", error.message);
  }
};
module.exports.getCountScraplistaLL = async function (req, res) {
  try {
    const {UserLogin} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC001' THEN 1 ELSE NULL END) AS S_Create,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC002' THEN 1 ELSE NULL END) AS Wait_Department_manager,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC003' THEN 1 ELSE NULL END) AS Wait_Service_Dept,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC004' THEN 1 ELSE NULL END) AS Wait_BOI_Staff,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC005' THEN 1 ELSE NULL END) AS Wait_BOI_Manager,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC006' THEN 1 ELSE NULL END) AS Wait_Factory_Manager,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC007' THEN 1 ELSE NULL END) AS Wait_ACC_Staff_CHECK,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC008' THEN 1 ELSE NULL END) AS Wait_Requester_Owner,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC009' THEN 1 ELSE NULL END) AS Wait_ENV_Engineer,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC100' THEN 1 ELSE NULL END) AS Wait_PLN_Staff,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC101' THEN 1 ELSE NULL END) AS Wait_Shipping_Staff,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC010' THEN 1 ELSE NULL END) AS Wait_ACC_staff,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC011' THEN 1 ELSE NULL END) AS Wait_ACC_Mgr,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSC012' THEN 1 ELSE NULL END) AS Wait_Service_Dept_closer
  FROM
    FAM_FLOW_MASTER TT
  LEFT JOIN FAM_REQ_HEADER HT ON
    HT.FAM_REQ_STATUS = TT.FFM_CODE
  LEFT JOIN FAM_REQ_SCRAP S ON
    S.FRSC_FAM_NO = HT.FRH_FAM_NO
  WHERE
    TT.FFM_TYPE = 'SCRAP'
    AND TT.FFM_STATUS = 'A'
    AND (
            HT.FAM_REQ_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC001'
      OR HT.FAM_MGR_DEPT = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC002'
      OR HT.FAM_SERVICE_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC003'
      OR HT.FAM_BOI_CHK_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC004'
      OR HT.FAM_BOI_MGR_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC005'
      OR HT.FAM_FM_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC006'
      OR HT.FAM_ACC_CHK_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC007'
      OR HT.FAM_OWNER_SEND_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC008'
      OR S.FRSC_ENV_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC009'
      OR S.FRSC_PLN_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC100'
      OR S.FRSC_SHP_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC101'
      OR HT.FAM_ACC_REC_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC010'
      OR HT.FAM_ACC_MGR_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC011'
      OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}'
      AND HT.FAM_REQ_STATUS = 'FLSC012' )
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountScraplistaLL", error.message);
  }
};
// Count Sale
module.exports.getCountSalelistaLLname = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
   SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC, F.FFM_SEQ
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'SALES'
    AND F.FFM_CODE NOT IN 
    ('FLSL092', 'FLSL093', 'FLSL094', 'FLSL095',
    'FLSL096', 'FLSL097', 'FLSC908', 'FLSL098', 
    'FLSL921', 'FLSL922', 'FLSL923', 'FLSL924', 'FLSL899')
    ORDER BY F.FFM_SEQ
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:getCountSalelistaLLname", error.message);
  }
};
module.exports.getCountSalelistaLL = async function (req, res) {
  try {
    const {UserLogin} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL001' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL002' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL003' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL004' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL005' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL006' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL007' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL008' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL009' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL010' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL011' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL012' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL013' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL014' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL015' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL016' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL017' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL018' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL019' THEN 1 ELSE NULL END),
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL020' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL021' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL022' THEN 1 ELSE NULL END) ,
    COUNT(CASE WHEN TT.FFM_CODE = 'FLSL023' THEN 1 ELSE NULL END) 
  FROM
    FAM_FLOW_MASTER TT
  LEFT JOIN FAM_REQ_HEADER HT ON
    HT.FAM_REQ_STATUS = TT.FFM_CODE
  LEFT JOIN FAM_REQ_SALES S ON
    S.FRSL_FAM_NO = HT.FRH_FAM_NO
  WHERE
    TT.FFM_TYPE = 'SALES'
    AND TT.FFM_STATUS = 'A'
    AND (
            HT.FAM_REQ_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL001'
      OR HT.FAM_MGR_DEPT = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL002'
      OR HT.FAM_SERVICE_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL003'
      OR HT.FAM_BOI_CHK_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL004'
      OR HT.FAM_BOI_MGR_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL005'
      OR HT.FAM_FM_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL006'
      OR HT.FAM_ACC_CHK_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL007'
      OR HT.FAM_OWNER_SEND_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL008'
      OR S.FRSL_ENV1_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL009'
      OR S.FRSL_PLN1_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL010'
      OR S.FRSL_IMP1_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL011'
      OR S.FRSL_BOI1_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL012'
      OR S.FRSL_IMP2_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL013'
      OR S.FRSL_PLN2_BY  = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL014'
      OR S.FRSL_ENV2_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL015' 
      OR S.FRSL_BOI2_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL016' 
      OR S.FRSL_ENV3_BY  = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL017' 
      OR S.FRSL_PLN3_BY  = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL018' 
      OR S.FRSL_SHP_BY  = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL019' 
      OR S.FRSL_PLN4_BY  = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL020' 
      OR HT.FAM_ACC_REC_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL021' 
      OR HT.FAM_ACC_MGR_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL022' 
      OR HT.FAM_SERVICE_CLOSE_BY = '${UserLogin}'AND HT.FAM_REQ_STATUS = 'FLSL023' )
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล: getCountSalelistaLL", error.message);
  }
};
