const express = require("express");
const oracledb = require("oracledb");
const multer = require("multer");
const path = require("path");
// const uploadsPath = path.join(__dirname, "../uploads");
const uploadsPath = path.join("/data/eye/FixAsset-System/FixAssetSystem/FixAsset/Uploads/");
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

//EmpID
module.exports.emp = async function (req, res) {
  try {
    const EmpID = req.query.empID;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT M.FACTORY_NAME,
    T.USER_FNAME,
    T.USER_SURNAME,
    T.USER_SITE ,
    T.USER_FNAME||'  ' ||T.USER_SURNAME AS USER_LOGIN
    FROM  CU_USER_M T 
    INNER JOIN  CU_FACTORY_M M ON M.FACTORY_CODE  = T.USER_SITE
     WHERE  T.USER_EMP_ID = '${EmpID}' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//Homepage
module.exports.gethome_page = async function (req, res) {
  try {
    const User_login = req.query.user_for_login;
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
        HT.FAM_REQ_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR001'
        OR HT.FAM_MGR_DEPT = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR002'
        OR HT.FAM_SERVICE_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR003'
        OR HT.FAM_BOI_CHK_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR004'
        OR HT.FAM_BOI_MGR_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR005'
        OR HT.FAM_FM_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR006'
        OR HT.FAM_ACC_CHK_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR007'
        OR HT.FAM_OWNER_SEND_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR008'
        OR A.FRT_RECEIVE_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR009'
        OR HT.FAM_ACC_REC_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR010'
        OR HT.FAM_ACC_MGR_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR011'
        OR HT.FAM_SERVICE_CLOSE_BY = '${User_login}' AND HT.FAM_REQ_STATUS = 'FLTR012'
    )`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// Factory
module.exports.factory = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
        SELECT T.FACTORY_CODE,T.FACTORY_NAME 
        FROM CUSR.CU_FACTORY_M T 
        WHERE T.FACTORY_STATUS = 'A' 
        ORDER BY T.FACTORY_CODE
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.dept = async function (req, res) {
  try {
    const { id_fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FDM_DEPT_SHORT 
      FROM FAM_DEPT_MASTER T 
      WHERE T.FDM_FACTORY = '${id_fac}'
      AND T.FDM_STATUS = 'A' 
      ORDER BY T.FDM_SORT,T.FDM_DEPT_SHORT
           `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//CostCenter
module.exports.cost = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT DISTINCT T.CC_CTR,
      T.CC_DESC FROM CUSR.CU_MFGPRO_CC_MSTR T 
      WHERE  T.CC_ACTIVE = '1' ORDER BY T.CC_CTR
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//RequestType
module.exports.type = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT T.FCM_CODE,T.FCM_DESC
      FROM FAM_CODE_MASTER T 
      WHERE T.FCM_GROUP_ID = 'GP01'
      AND T.FCM_STATUS = 'A' 
      ORDER BY T.FCM_SORT,T.FCM_DESC
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//Status
module.exports.findsts = async function (req, res) {
  try {
    const { Type } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT FFM_CODE ,FFM_DESC  FROM FAM_FLOW_MASTER WHERE FFM_TYPE = '${Type}'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// RequestBy
module.exports.by = async function (req, res) {
  try {
    const { By } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT  H.EMPCODE,H.ENAME,H.ESURNAME,T.USER_LOGIN
    ,H.EMPCODE || ' : ' || H.ENAME || ' ' || H.ESURNAME
    FROM CU_USER_HUMANTRIX H 
    LEFT JOIN  CU_USER_M T  ON  T.USER_EMP_ID = H.EMPCODE
   WHERE  T.USER_LOGIN = '${By}' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//Search
module.exports.search = async function (req, res) {
  try {
    const {
      UserLogin,
      FacCode,
      DeptCode,
      FamNo,
      FamTo,
      Costcenter,
      // FixAsset,
      ReType,
      ReDate,
      ReDateTo,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    DISTINCT M.FACTORY_NAME AS FACTORY,
    T.FAM_REQ_OWNER_CC AS COSTCENTER,
    T.FRH_FAM_NO AS FAMNO,
    TO_CHAR(T.FAM_REQ_DATE, 'DD/MM/YYYY') AS ISSUEDATE,
    T.FAM_REQ_BY AS ISSUEBY,
    R.FCM_DESC AS RETYPE,
--(SELECT TO_CHAR(WM_CONCAT(DISTINCT CD.FRD_ASSET_CODE))FROM FAM_REQ_DETAIL CD WHERE CD.FRD_FAM_NO = T.FRH_FAM_NO ) AS FIXED_CODE,
    F.FFM_DESC AS STATUS
  FROM
    FAM_REQ_HEADER T
  LEFT JOIN CUSR.CU_FACTORY_M M ON M.FACTORY_CODE = T.FAM_FACTORY
  LEFT JOIN FAM_CODE_MASTER R ON R.FCM_CODE = T.FAM_REQ_TYPE
  LEFT JOIN FAM_FLOW_MASTER F ON F.FFM_CODE = T.FAM_REQ_STATUS
  LEFT JOIN FAM_REQ_DETAIL C ON C.FRD_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = T.FRH_FAM_NO
  WHERE  T.FAM_REQ_BY = '${UserLogin}' AND  F.FFM_FLG  IN ('C','R')
    AND (T.FAM_FACTORY = '${FacCode}' OR '${FacCode}' IS NULL)
    AND (TRIM(T.FAM_REQ_DEPT) = '${DeptCode}' OR '${DeptCode}' IS NULL)
    AND (T.FRH_FAM_NO >= '${FamNo}' OR '${FamNo}' IS NULL)
    AND (T.FRH_FAM_NO <= '${FamTo}' OR '${FamTo}'IS NULL)
    AND (TRIM(T.FAM_ASSET_CC) = '${Costcenter}' OR '${Costcenter}' IS NULL)
    AND (T.FAM_REQ_TYPE = '${ReType}' OR '${ReType}' IS NULL)
   -- AND ( 'fixcode' IS NULL OR C.FRD_ASSET_CODE IN (SELECT TRIM(REGEXP_SUBSTR('fixcode', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('fixcode', ',') + 1))
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') >= '${ReDate}' OR '${ReDate}' IS NULL)
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') <= '${ReDateTo}' OR '${ReDateTo}' IS NULL)
    ORDER BY T.FRH_FAM_NO DESC
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// Serach Approve
module.exports.search2 = async function (req, res) {
  try {
    const {
      UserLogin,
      FacCode,
      DeptCode,
      FamNo,
      FamTo,
      Costcenter,
      // FixAsset,
      ReType,
      ReDate,
      ReDateTo,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT
    DISTINCT M.FACTORY_NAME AS FACTORY,
    T.FAM_REQ_OWNER_CC AS COSTCENTER,
    T.FRH_FAM_NO AS FAMNO,
    TO_CHAR(T.FAM_REQ_DATE, 'DD/MM/YYYY') AS ISSUEDATE,
    T.FAM_REQ_BY AS ISSUEBY,
    R.FCM_DESC AS RETYPE,
--(SELECT TO_CHAR(WM_CONCAT(DISTINCT CD.FRD_ASSET_CODE))FROM FAM_REQ_DETAIL CD WHERE CD.FRD_FAM_NO = T.FRH_FAM_NO ) AS FIXED_CODE,
    F.FFM_DESC AS STATUS
  FROM
    FAM_REQ_HEADER T
  LEFT JOIN CUSR.CU_FACTORY_M M ON M.FACTORY_CODE = T.FAM_FACTORY
  LEFT JOIN FAM_CODE_MASTER R ON R.FCM_CODE = T.FAM_REQ_TYPE
  LEFT JOIN FAM_FLOW_MASTER F ON F.FFM_CODE = T.FAM_REQ_STATUS
  LEFT JOIN FAM_REQ_DETAIL C ON C.FRD_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN FAM_REQ_LENDING L ON L.FRL_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN FAM_REQ_SCRAP S ON S.FRSC_FAM_NO  =T.FRH_FAM_NO 
  LEFT JOIN FAM_REQ_SALES SA ON SA.FRSL_FAM_NO =T.FRH_FAM_NO 
  WHERE  1=1
  AND((T.FAM_MGR_DEPT = '${UserLogin}' AND T.FAM_REQ_STATUS IN ('FLTR002','FLWO002','FLLS002','FLDN002','FLLD002','FLSC002','FLSL002'))
    OR (T.FAM_SERVICE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR003','FLWO003','FLLS003','FLDN003','FLLD003','FLSC003','FLSL003'))
    OR (T.FAM_BOI_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR004','FLWO004','FLLS004','FLDN004','FLLD004','FLSC004','FLSL004'))
    OR (T.FAM_BOI_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR005','FLWO005','FLLS005','FLDN005','FLLD005','FLSC005','FLSL005'))
    OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR006','FLWO006','FLLS006','FLDN006','FLLD006','FLSC006','FLSL006'))
    OR (T.FAM_ACC_CHK_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR007','FLWO007','FLLS007','FLDN007','FLLD007','FLSC007','FLSL007'))
    OR (T.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR008','FLWO008','FLLS008','FLDN008','FLLD008','FLSC008','FLSL008'))
    OR ( A.FRT_RECEIVE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR009'))
    OR (T.FAM_ACC_REC_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR010','FLWO010','FLLS010','FLDN010','FLLD010','FLSC010','FLSL021'))
    OR (T.FAM_ACC_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR011','FLWO011','FLLS011','FLDN011','FLLD011','FLSC011','FLSL022'))
    OR (T.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLTR012','FLWO012','FLLS012','FLDN012','FLLD012','FLSC012','FLSL023'))
    OR (L.FRL_ACC_MGR_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLLD009'))
    OR (S.FRSC_ENV_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSC009'))
    OR (S.FRSC_PLN_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSC100'))
    OR (S.FRSC_SHP_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSC101'))
    OR (SA.FRSL_ENV1_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL009'))
    OR (SA.FRSL_PLN1_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL010'))
    OR (SA.FRSL_IMP1_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL011'))
    OR (SA.FRSL_BOI1_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL012'))
    OR (SA.FRSL_IMP2_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL013'))
    OR (SA.FRSL_PLN2_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL014'))
    OR (SA.FRSL_ENV2_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL015'))
    OR (SA.FRSL_BOI2_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL016'))
    OR (SA.FRSL_ENV3_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL017'))
    OR (SA.FRSL_PLN3_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL018'))
    OR (SA.FRSL_SHP_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL019'))
    OR (SA.FRSL_PLN4_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLSL020'))
    OR (L.FRL_OWNER_RETURN_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS IN ('FLLD100')))
    AND (T.FAM_FACTORY = '${FacCode}' OR '${FacCode}' IS NULL)
    AND (TRIM(T.FAM_REQ_DEPT) = '${DeptCode}' OR '${DeptCode}' IS NULL)
    AND (T.FRH_FAM_NO >= '${FamNo}' OR '${FamNo}' IS NULL)
    AND (T.FRH_FAM_NO <= '${FamTo}' OR '${FamTo}'IS NULL)
    AND (TRIM(T.FAM_ASSET_CC) = '${Costcenter}' OR '${Costcenter}' IS NULL)
    AND (T.FAM_REQ_TYPE = '${ReType}' OR '${ReType}' IS NULL)
   -- AND ( 'fixcode' IS NULL OR C.FRD_ASSET_CODE IN (SELECT TRIM(REGEXP_SUBSTR('fixcode', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('fixcode', ',') + 1))
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') >= '${ReDate}' OR '${ReDate}' IS NULL)
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') <= '${ReDateTo}' OR '${ReDateTo}' IS NULL)
    ORDER BY T.FRH_FAM_NO DESC
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.fixcode = async function (req, res) {
  try {
    const { Fixcode, asset_cc, fixgroup } = req.body;
    const fixgroupString = fixgroup.map((value) => `'${value}'`).join(", ");
    const connect = await oracledb.getConnection(QAD);
    const query = `
    SELECT 
    KM.KFA_CODE,
    KD.KFAD_COMP,
    KD.KFAD_CC,
    KD.KFAD_COMP_NAME,
    KM.KFA_SEARCH3,
    CD.CODE_CMMT,
    KD.KFAD_QTY,
    KFD.KFIN_DOC_NO,
    KFD.KFIN_REF_DATE,
    KD.KFAD_ACQ_COST,
    KD.KFAD_SVG_VAL
FROM 
    KFA_MSTR KM
    JOIN KFAD_DET KD ON KM.KFA_CODE = KD.KFAD_CODE AND KM.KFA_DOMAIN = KD.KFAD_DOMAIN
    JOIN KFIN_DET KFD ON KD.KFAD_CODE = KFD.KFIN_FA_CODE AND KFD.KFIN_DOMAIN = KD.KFAD_DOMAIN
    JOIN CODE_MSTR CD ON KM.KFA_OBLG = CD.CODE_VALUE AND KM.KFA_DOMAIN = CD.CODE_DOMAIN
WHERE 1=1
AND (KM.KFA_CODE = KD.KFAD_CODE)
AND (KM.KFA_DOMAIN = KD.KFAD_DOMAIN)
AND (KD.KFAD_CODE = KFD.KFIN_FA_CODE)
AND (KFD.KFIN_DOMAIN = KD.KFAD_DOMAIN)
AND (KM.KFA_OBLG = CD.CODE_VALUE)
AND (KM.KFA_DOMAIN = CD.CODE_DOMAIN)
AND (KD.KFAD_COMP = KFD.KFIN_INFO_SEQ)
    AND SUBSTR(KM.KFA_CODE, 1, 1) IN (${fixgroupString})
    AND KM.KFA_CODE = '${Fixcode}'
    AND KD.KFAD_CC = '${asset_cc}'
    AND UPPER(CD.CODE_FLDNAME) = 'KFA_OBLG'
    AND KD.KFAD_BOOK = 'SL'
    AND UPPER(KM.KFA_DOMAIN) = '9000'
    AND KD.KFAD_SEQ = '0'
ORDER BY 
    KM.KFA_CODE, KD.KFAD_COMP
         `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//FactoryForInsert
module.exports.fac_insert = async function (req, res) {
  try {
    const { Fac_Login } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT
    F.FACTORY_NAME,
    T.USER_SITE
  FROM CU_USER_M T
  INNER JOIN CU_FACTORY_M F ON F.FACTORY_CODE = T.USER_SITE
  WHERE T.USER_LOGIN = '${Fac_Login}' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//Costcenter
module.exports.cost_insert = async function (req, res) {
  try {
    const { Cost_Login } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT H.COST_CENTER 
    FROM CU_USER_M T
    INNER JOIN CU_USER_HUMANTRIX H
    ON H.EMPCODE = T.USER_EMP_ID  
    WHERE  T.USER_LOGIN ='${Cost_Login}' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// Fixed Asset Group
// SELECT T.FRC_CHK_PREFIX AS inpCode,
// T.FRC_GROUP AS ShowDesc
// FROM FAM_RUNNING_CONTROL T
// WHERE T.FRC_FACTORY = '${Asset_group}'
// ORDER BY T.FRC_FACTORY,T.FRC_CHK_PREFIX,T.FRC_GROUP
module.exports.fix_group = async function (req, res) {
  try {
    const { Asset_group } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT 
    T.FRC_PIC_CC,
    DECODE(T.FRC_SERVICE_DEPT, 'EACH CC', 'OWNER COST CENTER', T.FRC_SERVICE_DEPT) AS TDESCC 
FROM 
    FAM_RUNNING_CONTROL T 
WHERE 
    T.FRC_FACTORY = '${Asset_group}' 
ORDER BY 
    T.FRC_PIC_CC
     `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล fix_group:", error.message);
  }
};
//Status
module.exports.status = async function (req, res) {
  try {
    const { type } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FFM_CODE, T.FFM_DESC 
    FROM FAM_FLOW_MASTER T 
    WHERE T.FFM_TYPE = '${type}' 
    AND T.FFM_SEQ = 1 AND T.FFM_STATUS = 'A' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//หา Service  AssetGroup
module.exports.id_service = async function (req, res) {
  try {
    const { fac, fixgroub } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT T.FRC_PIC_CC,
    T.FRC_PIC_CC||' : '||T.FRC_SERVICE_DEPT ,
    T.FRC_SERVICE_DEPT 
    FROM FAM_RUNNING_CONTROL T WHERE T.FRC_FACTORY = '${fac}'
    AND T.FRC_PIC_CC  = '${fixgroub}' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//หา Service Find_asset Cost
module.exports.find_service = async function (req, res) {
  try {
    const { asset_find } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT T.CC_CTR ,
    T.CC_CTR||' : '||T.CC_DESC ,
    T.CC_DESC
    FROM CUSR.CU_MFGPRO_CC_MSTR T 
    WHERE  T.CC_ACTIVE = '1' 
    AND T.CC_CTR = '${asset_find}'  
    ORDER BY T.CC_CTR `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// หา fix-group

module.exports.find_fix_groub = async function (req, res) {
  try {
    const { fac, servicedept } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FRC_CHK_PREFIX FROM FAM_RUNNING_CONTROL T
WHERE FRC_FACTORY = '${fac}'
AND T.FRC_PIC_CC = '${servicedept}'
ORDER BY FRC_PIC_CC ,FRC_SERVICE_DEPT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล find_fix_groub:", error.message);
  }
};
// หา FAM NO.
module.exports.fam_no = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX (FRH_FAM_NO)  
     FROM FAM_REQ_HEADER WHERE FRH_FAM_NO LIKE '${famno}-%'`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// insert FAM NO.สำหรับ การได้ เอกสารครั้งแรก

module.exports.insert_tranfer = async function (req, res) {
  try {
    const {
      tranfer,
      reqby,
      reTel,
      fac,
      cc,
      dept,
      type,
      assetgroup,
      assetcc,
      assetname,
      status,
      remark,
      user_log,
      owner_id,
      owner_CC,
      owner_Tel,
    } = req.body;

    const connect = await oracledb.getConnection(AVO); // Assuming AVO is your connection details object
    const query = `
      INSERT INTO FAM_REQ_HEADER 
      (FRH_FAM_NO, FAM_REQ_DATE, FAM_REQ_BY, FAM_REQ_TEL, FAM_FACTORY, FAM_REQ_CC,
      FAM_REQ_DEPT, FAM_REQ_TYPE, FAM_ASSET_GROUP, FAM_ASSET_CC, FAM_ASSET_CC_NAME, FAM_REQ_STATUS, FAM_REQ_REMARK, FAM_CREATE_BY, FAM_CREATE_DATE, FAM_REQ_OWNER, FAM_REQ_OWNER_CC, FAM_REQ_OWNER_TEL)
      VALUES 
      (:tranfer, SYSDATE, :reqby, :reTel, :fac, :cc, :dept, :type, :assetgroup, :assetcc, :assetname, :status, :remark, :user_log, SYSDATE, :owner_id, :owner_CC, :owner_Tel)
    `;

    const data = {
      tranfer,
      reqby,
      reTel,
      fac,
      cc,
      dept,
      type,
      assetgroup,
      assetcc,
      assetname,
      status,
      remark,
      user_log,
      owner_id,
      owner_CC,
      owner_Tel,
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true }); // send response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.create_date = async function (req, res) {
  try {
    const { tranfer } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER 
    SET FAM_CREATE_DATE = SYSDATE
    WHERE FRH_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_date = async function (req, res) {
  try {
    const { tranfer } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER 
    SET FAM_UPDATE_DATE = SYSDATE
    WHERE FRH_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.insert_asset_transfer = async function (req, res) {
  try {
    const { tranfer, reqby, assetcc } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      INSERT INTO FAM_REQ_TRANSFER (FRT_FAM_NO, FRT_FROM_CC, FRT_CREATE_DATE, FRT_CREATE_BY)
VALUES (:tranfer,:assetcc, SYSDATE,:reqby)
    `;

    const data = {
      tranfer,
      reqby,
      assetcc,
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// insert_FAM_DETAIL
module.exports.insert_FAM_REQ_DETAIL = async function (req, res) {
  try {
    const {
      famno,
      assetcode,
      assetname,
      comp,
      cc,
      boi,
      qty,
      inv,
      cost,
      val,
      by,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    MERGE INTO AVO.FAM_REQ_DETAIL dest
    USING (
        SELECT
            :FRD_FAM_NO AS FRD_FAM_NO,
            :FRD_ASSET_CODE AS FRD_ASSET_CODE,
            :FRD_ASSET_NAME AS FRD_ASSET_NAME,
            :FRD_COMP AS FRD_COMP,
            :FRD_OWNER_CC AS FRD_OWNER_CC,
            :FRD_BOI_PROJ AS FRD_BOI_PROJ,
            :FRD_QTY AS FRD_QTY,
            :FRD_INV_NO AS FRD_INV_NO,
            :FRD_ACQ_COST AS FRD_ACQ_COST,
            :FRD_BOOK_VALUE AS FRD_BOOK_VALUE,
            :FRD_CREATE_BY AS FRD_CREATE_BY,
            SYSDATE AS FRD_CREATE_DATE, -- ปรับเป็นการเพิ่ม SYSDATE เข้าไปตรงนี้
            SYSDATE AS FRD_INV_DATE -- เพิ่มการเพิ่ม SYSDATE เข้าไปเพื่อให้เป็นส่วนของคำสั่ง SQL
        FROM dual
    ) src
    ON (dest.FRD_FAM_NO = src.FRD_FAM_NO
        AND dest.FRD_ASSET_CODE = src.FRD_ASSET_CODE
        AND dest.FRD_COMP = src.FRD_COMP
    ) 
    WHEN MATCHED THEN
        UPDATE SET
            dest.FRD_ASSET_NAME = src.FRD_ASSET_NAME,
            dest.FRD_OWNER_CC = src.FRD_OWNER_CC,
            dest.FRD_BOI_PROJ = src.FRD_BOI_PROJ,
            dest.FRD_QTY = src.FRD_QTY,
            dest.FRD_INV_NO = src.FRD_INV_NO,
            dest.FRD_ACQ_COST = src.FRD_ACQ_COST,
            dest.FRD_BOOK_VALUE = src.FRD_BOOK_VALUE
    WHEN NOT MATCHED THEN
        INSERT (
            FRD_FAM_NO,
            FRD_ASSET_CODE,
            FRD_ASSET_NAME,
            FRD_COMP,
            FRD_OWNER_CC,
            FRD_BOI_PROJ,
            FRD_QTY,
            FRD_INV_NO,
            FRD_ACQ_COST,
            FRD_BOOK_VALUE,
            FRD_CREATE_DATE,
            FRD_CREATE_BY,
            FRD_INV_DATE
        ) VALUES (
            src.FRD_FAM_NO,
            src.FRD_ASSET_CODE,
            src.FRD_ASSET_NAME,
            src.FRD_COMP,
            src.FRD_OWNER_CC,
            src.FRD_BOI_PROJ,
            src.FRD_QTY,
            src.FRD_INV_NO,
            src.FRD_ACQ_COST,
            src.FRD_BOOK_VALUE,
            SYSDATE,
            src.FRD_CREATE_BY,
            SYSDATE
        )
    `;
    const data = {
      FRD_FAM_NO: famno,
      FRD_ASSET_CODE: assetcode,
      FRD_ASSET_NAME: assetname,
      FRD_COMP: comp,
      FRD_OWNER_CC: cc,
      FRD_BOI_PROJ: boi,
      FRD_QTY: qty,
      FRD_INV_NO: inv,
      FRD_ACQ_COST: cost,
      FRD_BOOK_VALUE: val,
      FRD_CREATE_BY: by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//Delete  Fixed Assets Code
module.exports.delete_FAM_REQ_DETAIL = async function (req, res) {
  try {
    const { famno, fixcode } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE FROM FAM_REQ_DETAIL 
     WHERE FRD_FAM_NO = :famno
     AND FRD_ASSET_CODE = :fixcode 
    `;
    const data = {
      famno,
      fixcode,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// FROM_BOI_PROJ (UPDATE ค่า From_BOI )
module.exports.ins_from_Boi = async function (req, res) {
  try {
    const { running_no, from_boi } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_TRANSFER 
    SET FRT_FROM_PROJ  = :from_boi 
    WHERE FRT_FAM_NO = :running_no
`;
    const data = {
      running_no,
      from_boi,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//Select ข้อมูลส่วนของ Transfer Detail
module.exports.new_boi = async function (req, res) {
  try {
    const { fac, cc } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FBMC_BOI_PROJ FROM FAM_BOIPROJ_MAP_CC T WHERE T.FBMC_COST_CENTER = '${cc}'
    AND T.FBMC_FACTORY = '${fac}' AND T.FBMC_STATUS = 'A' ORDER BY T.FBMC_COST_CENTER `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.select_BOI_from = async (req, res) => {
  try {
    const { running } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT FRD_BOI_PROJ  FROM FAM_REQ_DETAIL frd 
    WHERE FRD_FAM_NO = '${running}'
    `;

    const result = await connect.execute(query);

    connect.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "An error occurred while sending email" });
  }
};

// new Owner
module.exports.new_owner = async function (req, res) {
  try {
    const { fac, cc } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    M.USER_EMP_ID ||' : ' ||T.FPM_USER_LOGIN  AS NEW_OWNER
    FROM FAM_PERSON_MASTER T
    INNER JOIN CUSR.CU_USER_M M ON 
    M.USER_LOGIN = T.FPM_USER_LOGIN
    WHERE T.FPM_LEVEL = 'GP02001'
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = '${cc}'
    AND T.FPM_PERSON_STS = 'A' `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// cc มี ALL
module.exports.cc = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT T.CC_CTR, T.CC_DESC,1
    FROM CUSR.CU_MFGPRO_CC_MSTR T 
    WHERE T.CC_ACTIVE = '1'
    UNION ALL
    SELECT 'ALL' AS CC_CTR, 'ALL' AS CC_DESC,0
    FROM DUAL
    ORDER BY  1
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D7 Department Manager
module.exports.level_mana = async function (req, res) {
  try {
    const { level, cc } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02002'
    AND T.FPM_FACTORY = '${level}'
    AND T.FPM_CC = '${cc}'
    AND T.FPM_PERSON_STS = 'A'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D8 Service By
module.exports.service_by = async function (req, res) {
  try {
    const { level, cc } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02003'
    AND T.FPM_FACTORY = '${level}'
    AND T.FPM_CC = '${cc}'
    AND T.FPM_PERSON_STS = 'A'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D9 BOI Staff
module.exports.boi_staff = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02004'
    AND T.FPM_FACTORY = '${fac}' 
    AND T.FPM_CC = 'ALL' 
    AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//D10 BOI Manager
module.exports.boi_manager = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02005'
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = 'ALL' 
    AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D11 Factory Manager
module.exports.fac_manager = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T
    WHERE T.FPM_LEVEL = 'GP02006' 
    AND T.FPM_FACTORY =  '${fac}'  
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D12 ACC Check
module.exports.acc_check = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02007'
    AND T.FPM_FACTORY = ${fac} 
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN

         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//D13 ACC Manager
module.exports.acc_manager = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T
     WHERE T.FPM_LEVEL = 'GP02012' 
     AND T.FPM_FACTORY = '${fac}'
     AND T.FPM_CC = 'ALL' 
     AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// D14 PTE(ENV)
module.exports.pte_env_data = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN 
    FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02008' 
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล pte_env_data :", error.message);
  }
};
// D15 PLN_Staff
module.exports.pln_staff_data = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02009' 
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล pln_staff_data :", error.message);
  }
};
// D15.1 Import & BOI prepare
module.exports.import_boi = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02010' 
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล import_boi :", error.message);
  }
};
// D16 Shipping

module.exports.shipping_data = async function (req, res) {
  try {
    const { fac } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FPM_USER_LOGIN FROM FAM_PERSON_MASTER T 
    WHERE T.FPM_LEVEL = 'GP02011' 
    AND T.FPM_FACTORY = '${fac}'
    AND T.FPM_CC = 'ALL' AND T.FPM_PERSON_STS = 'A'
    ORDER BY T.FPM_PRIORITY,T.FPM_USER_LOGIN
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล shipping_data :", error.message);
  }
};
module.exports.ins_transfer = async function (req, res) {
  try {
    const {
      running_no,
      date_plan,
      fac,
      cc,
      to_proj,
      by_re,
      tel,
      status,
      abnormal,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_TRANSFER F
    SET
      F.FRT_PLAN_MOVE_DATE = TO_DATE(:date_plan, 'YYYY-MM-DD'),
      F.FRT_TO_FACTORY = :fac,
      F.FRT_TO_CC = :cc,
      F.FRT_TO_PROJ = :to_proj,
      F.FRT_RECEIVE_BY = :by_re,
      F.FRT_RECEIVER_TEL = :tel,
      F.FRT_ABNORMAL_STS = :status,
      F.FRT_ABNORMAL_REASON = :abnormal,
      F.FRT_RECEIVE_DATE = SYSDATE
    WHERE F.FRT_FAM_NO = :running_no
    `;

    const data = {
      running_no,
      date_plan,
      fac,
      cc,
      to_proj,
      by_re,
      tel,
      status,
      abnormal,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    res.json(result);
    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

//ROUTING_For_request
module.exports.routing_tran = async function (req, res) {
  try {
    const {
      running_no,
      m_dept,
      s_dept,
      s_tel,
      s_by,
      chk_by,
      boi_by,
      fmby,
      acc_by,
      own_by,
      acc_record,
      acc_manager,
      service_close_by,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER H
    SET
         H.FAM_MGR_DEPT  = :m_dept,
         H.FAM_SERVICE_DEPT = :s_dept,
         H.FAM_SERVICE_TEL =:s_tel,
         H.FAM_SERVICE_BY =:s_by ,
         H.FAM_BOI_CHK_BY =:chk_by,
         H.FAM_BOI_MGR_BY =:boi_by,
         H.FAM_FM_BY =:fmby,
         H.FAM_ACC_CHK_BY =:acc_by,
         H.FAM_OWNER_SEND_BY =:own_by,
         H.FAM_ACC_REC_BY = :acc_record,
         H.FAM_ACC_MGR_BY = :acc_manager,
         H.FAM_SERVICE_CLOSE_BY = :service_close_by,
         H.FAM_UPDATE_DATE = SYSDATE
      WHERE H.FRH_FAM_NO= :running_no
    `;

    const data = {
      running_no,
      m_dept,
      s_dept,
      s_tel,
      s_by,
      chk_by,
      boi_by,
      fmby,
      acc_by,
      own_by,
      acc_record,
      acc_manager,
      service_close_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    res.json(result);
    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

//Receiver for Tranfers
module.exports.receiver_tranfer = async function (req, res) {
  try {
    const { famno, receiver } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_TRANSFER  T
    SET
    T.FRT_RECEIVE_BY  = :FRT_RECEIVE_BY
    WHERE T.FRT_FAM_NO= :FRT_FAM_NO
    `;

    const data = {
      FRT_FAM_NO: famno,
      FRT_RECEIVE_BY: receiver,
    };
    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      console.error("Error: Unexpected result from the database");
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
// Close Routing
module.exports.close_routing_tran = async function (req, res) {
  try {
    const { famno, acc_record, acc_manager, service_close_by } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      UPDATE FAM_REQ_HEADER T
      SET
       
      WHERE T.FRH_FAM_NO = :FAM_NO
    `;

    const data = {
      FAM_NO: famno,
      FAM_ACC_REC_BY: acc_record,
      FAM_ACC_MGR_BY: acc_manager,
      FAM_SERVICE_CLOSE_BY: service_close_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      console.error("Error: Unexpected result from the database");
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

// HEADER
module.exports.header = async function (req, res) {
  try {
    const FAM_NO = req.query.famno;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT * FROM FAM_REQ_HEADER 
    WHERE FRH_FAM_NO = '${FAM_NO}'
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//update submit
module.exports.update_submit = async function (req, res) {
  try {
    const { famno, sts_submit } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      UPDATE FAM_REQ_HEADER T
      SET
        T.FAM_REQ_STATUS = :FAM_REQ_STATUS
      WHERE T.FRH_FAM_NO = :FAM_NO
    `;

    const data = {
      FAM_NO: famno,
      FAM_REQ_STATUS: sts_submit,
    };

    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      //  console.error("Error: Unexpected result from the database");
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    console.error("Error in querying data :", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
//upload
let fam_file_server = "";
module.exports.insertFile_from_request = async function (req, res) {
  try {
    const fam_no = req.query.FAM_no;
    const fam_from = req.query.FAM_from;
    const fam_file_seq = req.query.FAM_file_seq;
    const fam_file_name = req.query.FAM_file_name;
    fam_file_server = req.query.FAM_file_server;
    const fam_create = req.query.FAM_create;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    
MERGE INTO FAM_FILE_ATTACH T
USING (SELECT :fam_no AS FFA_FAM_NO, 
              :fam_from AS FFA_ATT_FROM, 
              :fam_file_seq AS FFA_FILE_SEQ, 
              :fam_file_name AS FFA_FILE_NAME, 
              :fam_file_server AS FFA_FILE_SERVER, 
              :fam_create AS FFA_CREATE_BY, 
              SYSDATE AS FFA_CREATE_DATE, 
              :fam_create AS FFA_UPDATE_BY, 
              SYSDATE AS FFA_UPDATE_DATE 
       FROM DUAL) S
ON (T.FFA_FAM_NO = S.FFA_FAM_NO AND T.FFA_ATT_FROM = S.FFA_ATT_FROM  AND T.FFA_FILE_SEQ = S.FFA_FILE_SEQ)
WHEN MATCHED THEN
  UPDATE SET 
             T.FFA_FILE_NAME = S.FFA_FILE_NAME,
             T.FFA_FILE_SERVER = S.FFA_FILE_SERVER,
             T.FFA_UPDATE_BY = S.FFA_UPDATE_BY,
             T.FFA_UPDATE_DATE = S.FFA_UPDATE_DATE
WHEN NOT MATCHED THEN
  INSERT (FFA_FAM_NO, FFA_ATT_FROM, FFA_FILE_SEQ, FFA_FILE_NAME, FFA_FILE_SERVER, FFA_CREATE_BY, FFA_CREATE_DATE, FFA_UPDATE_BY, FFA_UPDATE_DATE)
  VALUES (S.FFA_FAM_NO, S.FFA_ATT_FROM, S.FFA_FILE_SEQ, S.FFA_FILE_NAME, S.FFA_FILE_SERVER, S.FFA_CREATE_BY, S.FFA_CREATE_DATE, S.FFA_UPDATE_BY, S.FFA_UPDATE_DATE)

         `;
    const data = {
      fam_no,
      fam_from,
      fam_file_seq,
      fam_file_name,
      fam_file_server,
      fam_create,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).send("YESSSSSSSSSSSSSSSSSSSs");
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
    res.status(500).send("no");
  }
};

// get run seq request
module.exports.get_run_seq_request = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'REQUEST'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// get run ownersend
module.exports.get_run_owner_file = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'OWNER CHECK'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// get run ownersend_return
module.exports.get_run_owner_file_return = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'OWNER RETURN'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//get run pte_file
module.exports.get_run_owner_file_pte = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'ENV CHECK'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_run_owner_file_pte error:", error.message);
  }
};
// get run ptn
module.exports.get_run_owner_file_pln = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'PLN CHECK'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_run_owner_file_pte error:", error.message);
  }
};
// get run shipping
module.exports.get_run_owner_file_shipping = async function (req, res) {
  try {
    const { FAM_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT MAX(T.FFA_FILE_SEQ) AS RUN_SEQ_MAX 
    FROM FAM_FILE_ATTACH T
    WHERE T.FFA_FAM_NO = :FAM_no
    AND T.FFA_ATT_FROM = 'SHP CHECK'
    ORDER BY T.FFA_FILE_SEQ ASC

         `;
    const data = {
      FAM_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_run_owner_file_pte error:", error.message);
  }
};
//UPLOAD
module.exports.insertFile_from_request_to_project_me = async function (
  req,
  res
) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsPath);
    },
    filename: function (req, file, cb) {
      cb(null, fam_file_server); // Use the original filename
    },
  });

  const upload = multer({ storage: storage });
  try {
    // Handle the file upload logic here
    await upload.array("files")(req, res, (err) => {
      if (err) {
        res.status(500).send("Error uploading files");
      } else {
        res.send("Files uploaded successfully");
      }
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).send("Error handling file upload");
  }
};
// Show
module.exports.getEdit_Request_Show = async function (req, res) {
  try {
    const { FamNo } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    
    SELECT T.FRH_FAM_NO ,
    TO_CHAR(T.FAM_REQ_DATE, 'DD/MM/YYYY') AS FAM_REQ_DATE,
    T.FAM_REQ_BY ,
    T.FAM_REQ_TEL ,
    M.FACTORY_NAME ,
    T.FAM_REQ_CC ,
    T.FAM_REQ_DEPT ,
    T.FAM_REQ_TYPE ,
    T.FAM_ASSET_GROUP, 
    T.FAM_ASSET_CC, 
    T.FAM_REQ_STATUS,
    F.FFM_DESC, 
    T.FAM_REQ_REMARK,
    T.FAM_ASSET_CC_NAME,
    T.FAM_FACTORY,
    R.USER_EMP_ID ||' : ' || R.USER_FNAME||' ' || R.USER_SURNAME AS REQ_BY,
    F.FFM_FLG,
    T.FAM_REQ_OWNER,
    T.FAM_REQ_OWNER_CC,
    T.FAM_REQ_OWNER_TEL,
    S.ENAME || '  ' || S.ESURNAME AS NAME_SURNAME,
    MF.CC_CTR||' : '||MF.CC_DESC 
FROM FAM_REQ_HEADER T 
LEFT JOIN FAM_FLOW_MASTER F ON F.FFM_CODE = T.FAM_REQ_STATUS 
LEFT JOIN CUSR.CU_FACTORY_M M ON  M.FACTORY_CODE  =  T.FAM_FACTORY 
LEFT JOIN CUSR.CU_USER_M R ON R.USER_LOGIN = T.FAM_REQ_BY 
LEFT JOIN CUSR.CU_USER_HUMANTRIX S  ON S.EMPCODE = T.FAM_REQ_OWNER
LEFT JOIN CUSR.CU_MFGPRO_CC_MSTR MF ON MF.CC_CTR  =T.FAM_REQ_OWNER_CC

WHERE T.FRH_FAM_NO = :FamNo
          `;
    const data = {
      FamNo,
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();

    const flatArray = result.rows.map((item) => Object.values(item)).flat();
    res.json(flatArray);
  } catch (error) {
    // console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//show FixAsset
module.exports.getEdit_FixAsset = async function (req, res) {
  try {
    const { FamNo } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT 
    FRD_ASSET_CODE AS FRD_ASSET_CODE,
    FRD_COMP AS FRD_COMP, 
    FRD_OWNER_CC AS FRD_OWNER_CC,
    FRD_ASSET_NAME AS FRD_ASSET_NAME, 
    FRD_CREATE_BY AS FRD_CREATE_BY,
    FRD_BOI_PROJ AS FRD_BOI_PROJ,
    FRD_QTY AS FRD_QTY,
    FRD_INV_NO AS FRD_INV_NO,
    FRD_CREATE_BY AS FRD_CREATE_BY,
    FRD_ACQ_COST AS FRD_ACQ_COST,
    FRD_BOOK_VALUE AS FRD_BOOK_VALUE,
    FRD_NEW_CC AS NewCC,
    FRT_TO_PROJ AS ToProject
    FROM FAM_REQ_DETAIL  
    LEFT JOIN FAM_REQ_TRANSFER ON FRD_FAM_NO = FRT_FAM_NO
    WHERE FRD_FAM_NO = '${FamNo}'
     ORDER BY 1,2 ASC
    `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("getEdit_FixAsset error");
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getEdit_FileUpload = async function (req, res) {
  try {
    const fam_no = req.query.FamNo;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT FFA_FILE_NAME 
    FROM FAM_FILE_ATTACH
     WHERE FFA_FAM_NO = '${fam_no}'
    `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

//Edit Trans
module.exports.getEdit_Trans = async function (req, res) {
  try {
    const { FamNo } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    F.FRT_TO_FACTORY ,
    F.FRT_TO_CC ,
    F.FRT_TO_PROJ ,
    F.FRT_RECEIVE_BY AS NEW_OWNER ,
    F.FRT_RECEIVER_TEL,
    TO_CHAR(F.FRT_PLAN_MOVE_DATE, 'YYYY-MM-DD') AS FRT_PLAN_MOVE_DATE,
    F.FRT_ABNORMAL_REASON,
    F.FRT_RECEIVE_BY AS RECEIVER,
    F.FRT_FAM_NO,
    M.USER_EMP_ID ||' : ' ||F.FRT_RECEIVE_BY  AS NEW_OWNER,
    F.FRT_RECEIVER_JUD,
    TO_CHAR(F.FRT_RECEIVE_DATE, 'DD/MM/YYYY') AS FRT_RECEIVE_DATE,
    F.FRT_RECEIVE_CMMT,
    A.FACTORY_NAME,
    F.FRT_ABNORMAL_STS
    

  FROM
    FAM_REQ_TRANSFER F 
    LEFT JOIN  CUSR.CU_USER_M M ON 
    M.USER_LOGIN =  F.FRT_RECEIVE_BY
    LEFT JOIN CUSR.CU_FACTORY_M A ON
    A.FACTORY_CODE = F.FRT_TO_FACTORY 
    WHERE F.FRT_FAM_NO = '${FamNo}'
    `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//Edit Trans
module.exports.getEdit_routing = async function (req, res) {
  try {
    const { FamNo } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
	FAM_MGR_DEPT,
	TO_CHAR(FAM_MGR_DATE, 'DD/MM/YYYY') AS FAM_MGR_DATE,
	FAM_MGR_JUD,
	FAM_MGR_CMMT,
	FAM_SERVICE_DEPT,
	FAM_SERVICE_BY,
	TO_CHAR(FAM_SERVICE_DATE, 'DD/MM/YYYY') AS FAM_SERVICE_DATE,
	FAM_SERVICE_TEL,
	FAM_BOI_CHK_BY,
	TO_CHAR(FAM_BOI_CHK_DATE, 'DD/MM/YYYY') AS FAM_BOI_CHK_DATE,
	FAM_BOI_CHK_JUD,
	FAM_BOI_CHK_CMMT,
	FAM_BOI_MGR_BY,
	TO_CHAR(FAM_BOI_MGR_DATE, 'DD/MM/YYYY') AS FAM_BOI_MGR_DATE,
	FAM_BOI_MGR_JUD,
	FAM_BOI_MGR_CMMT,
	FAM_FM_BY,
	TO_CHAR(FAM_FM_DATE, 'DD/MM/YYYY') AS FAM_FM_DATE,
	FAM_FM_JUD,
	FAM_FM_CMMT,
	FAM_ACC_CHK_BY,
	TO_CHAR(FAM_ACC_CHK_DATE, 'DD/MM/YYYY') AS FAM_ACC_CHK_DATE,
	FAM_ACC_CHK_JUD,
	FAM_ACC_CHK_CMMT,
	FAM_ACC_REC_BY,
	TO_CHAR(FAM_ACC_REC_DATE, 'DD/MM/YYYY') AS FAM_ACC_REC_DATE,
	FAM_ACC_REC_JUD,
	FAM_ACC_REC_CMMT,
	FAM_ACC_MGR_BY,
	TO_CHAR(FAM_ACC_MGR_DATE, 'DD/MM/YYYY') AS FAM_ACC_MGR_DATE,
	FAM_ACC_MGR_JUD,
	FAM_ACC_MGR_CMMT,
	FAM_OWNER_SEND_BY,
	TO_CHAR(FAM_OWNER_SEND_DATE, 'DD/MM/YYYY') AS FAM_OWNER_SEND_DATE,
	FAM_OWNER_SEND_JUD,
	FAM_OWNER_SEND_CMMT,
	FAM_SERVICE_CLOSE_BY,
	TO_CHAR(FAM_SERVICE_CLOSE_DATE, 'DD/MM/YYYY') AS FAM_SERVICE_CLOSE_DATE,
	FAM_SERVICE_CLOSE_CMMT,
	FAM_CREATE_BY,
	FAM_UPDATE_BY,
	FAM_SERVICE_JUD,
	FAM_SERVICE_CMMT,
	FAM_SERVICE_CLOSE_JUD
  
FROM
	AVO.FAM_REQ_HEADER WHERE FRH_FAM_NO = '${FamNo}'
    `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Update For Req_All
module.exports.Update_For_Req_All = async function (req, res) {
  try {
    const {
      famno,
      dept,
      tel,
      remark,
      mrg_dept,
      serviceby,
      servicetel,
      boisff,
      boimrg,
      fmby,
      accchk,
      accmrg,
      updateby,
      record_by,
      owner_id,
      owner_dept,
      owner_tel,
      service_close,
      owner_by,
      service_dt,
    } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
      UPDATE
        FAM_REQ_HEADER R
      SET
        R.FAM_REQ_DEPT = :FAM_REQ_DEPT,
        R.FAM_REQ_TEL = :FAM_REQ_TEL,
        R.FAM_REQ_REMARK = :FAM_REQ_REMARK,
        R.FAM_REQ_SUBMIT_DATE = SYSDATE,
        R.FAM_MGR_DEPT = :FAM_MGR_DEPT,
        R.FAM_SERVICE_BY = :FAM_SERVICE_BY,
        R.FAM_SERVICE_TEL = :FAM_SERVICE_TEL,
        R.FAM_BOI_CHK_BY = :FAM_BOI_CHK_BY,
        R.FAM_BOI_MGR_BY = :FAM_BOI_MGR_BY,
        R.FAM_FM_BY = :FAM_FM_BY,
        R.FAM_ACC_CHK_BY = :FAM_ACC_CHK_BY,
        R.FAM_ACC_MGR_BY = :FAM_ACC_MGR_BY,
        R.FAM_UPDATE_DATE = SYSDATE,
        R.FAM_UPDATE_BY = :FAM_UPDATE_BY,
        R.FAM_ACC_REC_BY = :FAM_ACC_REC_BY,
        R.FAM_REQ_OWNER =:FAM_REQ_OWNER,
        R.FAM_REQ_OWNER_CC =:FAM_REQ_OWNER_CC,
        R.FAM_REQ_OWNER_TEL =:FAM_REQ_OWNER_TEL,
        R.FAM_SERVICE_CLOSE_BY = :FAM_SERVICE_CLOSE_BY,
        R.FAM_OWNER_SEND_BY = :FAM_OWNER_SEND_BY,
        R.FAM_SERVICE_DEPT = :FAM_SERVICE_DEPT
      WHERE
        FRH_FAM_NO = :FAM_NO
    `;

    const data = {
      FAM_NO: famno,
      FAM_REQ_DEPT: dept,
      FAM_REQ_TEL: tel,
      FAM_REQ_REMARK: remark,
      FAM_MGR_DEPT: mrg_dept,
      FAM_SERVICE_BY: serviceby,
      FAM_SERVICE_TEL: servicetel,
      FAM_BOI_CHK_BY: boisff,
      FAM_BOI_MGR_BY: boimrg,
      FAM_FM_BY: fmby,
      FAM_ACC_CHK_BY: accchk,
      FAM_ACC_MGR_BY: accmrg,
      FAM_UPDATE_BY: updateby,
      FAM_ACC_REC_BY: record_by,
      FAM_REQ_OWNER: owner_id,
      FAM_REQ_OWNER_CC: owner_dept,
      FAM_REQ_OWNER_TEL: owner_tel,
      FAM_SERVICE_CLOSE_BY: service_close,
      FAM_OWNER_SEND_BY: owner_by,
      FAM_SERVICE_DEPT: service_dt,
    };

    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      //  console.error("Error: Unexpected result from the database");
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
//Update For Transfer
module.exports.Update_For_Trans_All = async function (req, res) {
  try {
    const {
      famno,
      date_plan,
      fac_trans,
      cc_trans,
      to_proj,
      rec_by,
      tel,
      sts_for,
      abnormal_for,
      create_by,
    } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_TRANSFER
  SET
    FRT_PLAN_MOVE_DATE = TO_DATE(:FRT_PLAN_MOVE_DATE, 'YYYY-MM-DD'),
    FRT_TO_FACTORY = :FRT_TO_FACTORY,
    FRT_TO_CC = :FRT_TO_CC,
    FRT_TO_PROJ = :FRT_TO_PROJ,
    FRT_RECEIVE_BY = :FRT_RECEIVE_BY,
    FRT_RECEIVER_TEL = :FRT_RECEIVER_TEL,
    FRT_ABNORMAL_STS = :FRT_ABNORMAL_STS,
    FRT_ABNORMAL_REASON = :FRT_ABNORMAL_REASON,
    FRT_CREATE_BY = :FRT_CREATE_BY
  WHERE
    FRT_FAM_NO = :FRT_FAM_NO
    `;

    const data = {
      FRT_FAM_NO: famno,
      FRT_PLAN_MOVE_DATE: date_plan,
      FRT_TO_FACTORY: fac_trans,
      FRT_TO_CC: cc_trans,
      FRT_TO_PROJ: to_proj,
      FRT_RECEIVE_BY: rec_by,
      FRT_RECEIVER_TEL: tel,
      FRT_ABNORMAL_STS: sts_for,
      FRT_ABNORMAL_REASON: abnormal_for,
      FRT_CREATE_BY: create_by,
    };

    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      //  console.error("Error: Unexpected result from the database");
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

module.exports.getFixcode = async function (req, res) {
  try {
    const fam_no = req.query.Fam;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT 
    FRD_ASSET_CODE AS FRD_ASSET_CODE,
    FRD_COMP AS FRD_COMP, 
    FRD_OWNER_CC AS FRD_OWNER_CC,
    FRD_ASSET_NAME AS FRD_ASSET_NAME, 
    FRD_CREATE_BY AS FRD_CREATE_BY,
    FRD_BOI_PROJ AS FRD_BOI_PROJ,
    FRD_QTY AS FRD_QTY,
    FRD_INV_NO AS FRD_INV_NO,
    FRD_CREATE_BY AS FRD_CREATE_BY,
    FRD_ACQ_COST AS FRD_ACQ_COST,
    FRD_BOOK_VALUE AS FRD_BOOK_VALUE 
    FROM FAM_REQ_DETAIL  WHERE FRD_FAM_NO = '${fam_no}'`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// DELETE ALL
module.exports.delect_all_fam_header = async function (req, res) {
  try {
    const FRH_FAM_NO = req.query.famno;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE FROM FAM_REQ_HEADER 
     WHERE FRH_FAM_NO = :fam
     
    `;
    const data = {
      fam: FRH_FAM_NO,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.delect_all_fam_details = async function (req, res) {
  try {
    const FRD_FAM_NO = req.query.famno;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE FROM FAM_REQ_DETAIL 
     WHERE FRD_FAM_NO = :fam
     
    `;
    const data = {
      fam: FRD_FAM_NO,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//อันเก่า ก่อนแก้วันที่ 29/03
// module.exports.delect_all_fam_transfer = async function (req, res) {
//   try {

//     const FRT_FAM_NO = req.query.famno;
//     const connect = await oracledb.getConnection(AVO);
//     const query = `
//     DELETE FROM FAM_REQ_TRANSFER
//      WHERE FRT_FAM_NO = :fam

//     `;
//     const data = {
//       fam: FRT_FAM_NO,
//     };
//     const result = await connect.execute(query, data, { autoCommit: true });
//     connect.release();
//     res.json(result);
//   } catch (error) {
//     console.error("Error in querying data:", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };
module.exports.delect_all_fam_transfer = async function (req, res) {
  try {
    const { famno, idsts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
  FAM_REQ_STATUS = :FAM_REQ_STATUS
  WHERE
    FRH_FAM_NO = :FRH_FAM_NO
    `;

    const data = {
      FRH_FAM_NO: famno,
      FAM_REQ_STATUS: idsts,
    };

    const result = await connect.execute(query, data, { autoCommit: true });

    if (result) {
      res.json(result);
    } else {
      res.status(500).send("Internal Server Error");
    }

    connect.release();
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};

module.exports.delete_all_file = async function (req, res) {
  try {
    const { famno } = req.body;

    //const FFA_FAM_NO = req.query.famno;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE FROM FAM_FILE_ATTACH 
     WHERE FFA_FAM_NO = :famno
    `;
    const data = {
      famno,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
module.exports.deletefile = async function (req, res) {
  try {
    const { famno, name_for_file } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE FROM FAM_FILE_ATTACH 
     WHERE FFA_FAM_NO = :famno
     AND FFA_FILE_NAME =:name_for_file
    `;
    const data = {
      famno,
      name_for_file,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Update Manager Department
module.exports.update_manager_dept = async function (req, res) {
  try {
    const { famno, mgrjud, mgrcmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER
    SET 
        FAM_MGR_DATE = SYSDATE ,
        FAM_MGR_JUD = :mgrjud,
        FAM_MGR_CMMT = :mgrcmmt,
        FAM_REQ_STATUS = :sts
    WHERE FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      mgrjud,
      mgrcmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Update Service_by
module.exports.update_service_by = async function (req, res) {
  try {
    const { famno, serjud, sercmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER
SET 
    FAM_SERVICE_DATE  = SYSDATE ,
    FAM_SERVICE_JUD  = :serjud,
    FAM_SERVICE_CMMT  = :sercmmt,
    FAM_REQ_STATUS = :sts
WHERE FRH_FAM_NO = :famno
  `;
    const data = {
      famno,
      serjud,
      sercmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Update BOI staff
module.exports.update_boi_staff = async function (req, res) {
  try {
    const { famno, stff_jud, stff_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_HEADER
    SET 
        FAM_BOI_CHK_DATE = SYSDATE,
        FAM_BOI_CHK_JUD = :stff_jud,
        FAM_BOI_CHK_CMMT = :stff_cmmt,
        FAM_REQ_STATUS = :sts
    WHERE FRH_FAM_NO = :famno
    
  `;

    const data = {
      famno,
      stff_jud,
      stff_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//uUpdate BOI manager
module.exports.update_boi_mana = async function (req, res) {
  try {
    const { famno, boimana_jud, boimana_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_BOI_MGR_DATE = SYSDATE,
    FAM_BOI_MGR_JUD = :boimana_jud,
    FAM_BOI_MGR_CMMT = :boimana_cmmt,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      boimana_jud,
      boimana_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update fac_manager
module.exports.update_facmanager = async function (req, res) {
  try {
    const { famno, fm_jud, fm_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_FM_DATE  = SYSDATE,
    FAM_FM_JUD  = :fm_jud,
    FAM_FM_CMMT  = :fm_cmmt,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  
  `;

    const data = {
      famno,
      fm_jud,
      fm_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update acc check
module.exports.update_acccheck = async function (req, res) {
  try {
    const { famno, chk_jud, chk_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_ACC_CHK_DATE = SYSDATE,
    FAM_ACC_CHK_JUD = :chk_jud,
    FAM_ACC_CHK_CMMT = :chk_cmmt,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  
  `;

    const data = {
      famno,
      chk_jud,
      chk_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update owner
module.exports.update_owner = async function (req, res) {
  try {
    const { famno, owner_jud, owner_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_OWNER_SEND_DATE    = SYSDATE,
    FAM_OWNER_SEND_JUD    = :owner_jud,
    FAM_OWNER_SEND_CMMT    = :owner_cmmt,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      owner_jud,
      owner_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update Recode
module.exports.update_recode = async function (req, res) {
  try {
    const { famno, rec_jud, rec_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_ACC_REC_DATE  = SYSDATE,
    FAM_ACC_REC_JUD  = :rec_jud,
    FAM_ACC_REC_CMMT  = :rec_cmmt,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      rec_jud,
      rec_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// update Acc Manager
module.exports.update_accmanager = async function (req, res) {
  try {
    const { famno, acc_manajud, acc_manacmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
    FAM_ACC_MGR_DATE   = SYSDATE,
    FAM_ACC_MGR_JUD   = :acc_manajud ,
    FAM_ACC_MGR_CMMT   = :acc_manacmmt ,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      acc_manajud,
      acc_manacmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update service close by
module.exports.update_service_close = async function (req, res) {
  try {
    const { famno, cls_jud, cls_cmmt, sts } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER
  SET
  FAM_SERVICE_CLOSE_DATE    = SYSDATE,
  FAM_SERVICE_CLOSE_JUD    = :cls_jud  ,
  FAM_SERVICE_CLOSE_CMMT    = :cls_cmmt  ,
    FAM_REQ_STATUS = :sts
  WHERE
    FRH_FAM_NO = :famno
  `;

    const data = {
      famno,
      cls_jud,
      cls_cmmt,
      sts,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// update receiver
module.exports.update_receiver = async function (req, res) {
  try {
    const { famno, receiver_jud, receiver_cmmt } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
	FAM_REQ_TRANSFER 
  SET
	FRT_RECEIVE_DATE  = SYSDATE,
	FRT_RECEIVER_JUD  = :receiver_jud,
	FRT_RECEIVE_CMMT  = :receiver_cmmt
WHERE
	FRT_FAM_NO  = :famno

  `;

    const data = {
      famno,
      receiver_jud,
      receiver_cmmt,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// update for Reject Reture To New Status
module.exports.update_for_nullRouting_All = async function (req, res) {
  try {
    const { famno, user_a } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_HEADER A
  SET
  A.FAM_MGR_DATE = NULL,
  A.FAM_MGR_JUD = NULL ,
  A.FAM_MGR_CMMT = NULL ,
  A.FAM_SERVICE_DATE = NULL ,
  A.FAM_BOI_CHK_DATE = NULL ,
  A.FAM_BOI_CHK_JUD = NULL ,
  A.FAM_BOI_CHK_CMMT = NULL ,
  A.FAM_BOI_MGR_DATE = NULL ,
  A.FAM_BOI_MGR_JUD = NULL ,
  A.FAM_BOI_MGR_CMMT = NULL ,
  A.FAM_FM_DATE = NULL ,
  A.FAM_FM_JUD = NULL ,
  A.FAM_FM_CMMT = NULL ,
  A.FAM_ACC_CHK_DATE = NULL ,
  A.FAM_ACC_CHK_JUD = NULL ,
  A.FAM_ACC_CHK_CMMT = NULL ,
  A.FAM_ACC_REC_DATE = NULL ,
  A.FAM_ACC_REC_JUD = NULL ,
  A.FAM_ACC_REC_CMMT = NULL ,
  A.FAM_ACC_MGR_DATE = NULL ,
  A.FAM_ACC_MGR_JUD = NULL ,
  A.FAM_ACC_MGR_CMMT = NULL ,
  A.FAM_OWNER_SEND_DATE = NULL ,
  A.FAM_OWNER_SEND_JUD = NULL ,
  A.FAM_OWNER_SEND_CMMT = NULL ,
  A.FAM_SERVICE_CLOSE_DATE = NULL ,
  A.FAM_SERVICE_CLOSE_CMMT = NULL ,
  A.FAM_UPDATE_BY = :user_a ,
  A.FAM_SERVICE_JUD = NULL ,
  A.FAM_SERVICE_CMMT = NULL ,
  A.FAM_SERVICE_CLOSE_JUD = NULL 
  WHERE
  A.FRH_FAM_NO = :famno 
    
  `;

    const data = {
      famno,
      user_a,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//
module.exports.update_All_for_receive = async function (req, res) {
  try {
    const { famno, user_re } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
        UPDATE
        FAM_REQ_TRANSFER A
      SET
      A.FRT_UPDATE_DATE = NULL,
      A.FRT_UPDATE_BY = :user_re,
      A.FRT_RECEIVE_CMMT = NULL,
      A.FRT_RECEIVER_JUD = NULL 
      WHERE
      FRT_FAM_NO = :famno 
        
      `;

    const data = {
      famno,
      user_re,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// get level
module.exports.level_person_maintain = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FCM_CODE,t.fcm_desc 
    FROM FAM_CODE_MASTER T 
    WHERE T.FCM_GROUP_ID = 'GP02' 
    AND T.FCM_STATUS = 'A' 
    ORDER BY T.FCM_SORT,T.FCM_DESC
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

/// get show data user login Person maintain
module.exports.getData_UserLogin_Person = async (req, res) => {
  try {
    const { user_log } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT '(' || H.EMPCODE || ') ' || H.ENAME || ' ' || H.ESURNAME AS ENAME, T.USER_EMAIL
      FROM CUSR.CU_USER_HUMANTRIX H, CUSR.CU_USER_M T
      WHERE H.EMPCODE = T.USER_EMP_ID
      AND UPPER(T.USER_LOGIN) = UPPER('${user_log}')
    `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
};

module.exports.insertPerson_Maintain = async (req, res) => {
  try {
    const {
      FPM_factory,
      FPM_level,
      FPM_cost_center,
      FPM_user_login,
      FPM_email,
      FPM_status,
      FPM_create_by,
      FPM_update_by,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);

    const query = `
      INSERT INTO FAM_PERSON_MASTER (FPM_FACTORY, FPM_LEVEL, FPM_CC, FPM_USER_LOGIN, FPM_PERSON_STS, FPM_EMAIL, FPM_CREATE_BY, FPM_CREATE_DATE, FPM_UPDATE_BY, FPM_UPDATE_DATE)
      VALUES (:FPM_factory, :FPM_level, :FPM_cost_center, :FPM_user_login, :FPM_status, :FPM_email, :FPM_create_by, SYSDATE, :FPM_update_by, SYSDATE)
    `;

    const data = {
      FPM_factory,
      FPM_level,
      FPM_cost_center,
      FPM_user_login,
      FPM_status,
      FPM_email,
      FPM_create_by,
      FPM_update_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
};

module.exports.updatePerson_Maintain = async (req, res) => {
  try {
    const {
      FPM_factory,
      FPM_level,
      FPM_cost_center,
      FPM_user_login,
      FPM_email,
      FPM_status,
      FPM_update_by,
    } = req.body;

    const connect = await oracledb.getConnection(AVO);

    const query = `
    UPDATE
    FAM_PERSON_MASTER
  SET
    FPM_EMAIL = :FPM_email,
    FPM_PERSON_STS = :FPM_status,
    FPM_UPDATE_BY = :FPM_update_by,
    FPM_UPDATE_DATE = SYSDATE
  WHERE
    FPM_FACTORY = :FPM_factory
    AND FPM_LEVEL = :FPM_level
    AND FPM_CC = :FPM_cost_center
    AND FPM_USER_LOGIN = :FPM_user_login
         
    `;

    const data = {
      FPM_factory,
      FPM_level,
      FPM_cost_center,
      FPM_user_login,
      FPM_status,
      FPM_email,
      FPM_update_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
};
module.exports.search_person_maintain = async function (req, res) {
  try {
    const { FPM_factory, FPM_level, FPM_cost_center, FPM_user_login } =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT 
    C.FACTORY_NAME AS FACTORY, 
    T.FPM_FACTORY AS FACTORY_CC,	
         CM.FCM_DESC AS LEVEL_DESC ,
         T.FPM_LEVEL  AS LEVEL_CC,
         CMCC.CC_DESC  AS COST_CENTER,
         T.FPM_CC AS COST_CENTER_CC,
         T.FPM_USER_LOGIN , 
    (SELECT
      '(' || HH.EMPCODE || ') ' || HH.ENAME || ' ' || HH.ESURNAME AS ENAME
      FROM CUSR.CU_USER_HUMANTRIX HH, CUSR.CU_USER_M TE 		
      WHERE HH.EMPCODE = TE.USER_EMP_ID
        AND UPPER(TE.USER_LOGIN) = UPPER(T.FPM_USER_LOGIN)) AS NAME_SURNAME,
    T.FPM_EMAIL, 
    CASE 
      WHEN T.FPM_PERSON_STS = 'A' THEN 'Active'
      WHEN T.FPM_PERSON_STS = 'I' THEN 'In Active'
      ELSE T.FPM_PERSON_STS 
    END AS PERSON_STATUS,
    T.FPM_UPDATE_BY, 
    TO_CHAR(T.FPM_UPDATE_DATE, 'DD/MM/YYYY') AS UPDATE_DATE
  FROM 
    FAM_PERSON_MASTER T
  LEFT JOIN 
    CUSR.CU_FACTORY_M C ON C.FACTORY_CODE = T.FPM_FACTORY 
  LEFT JOIN 
    FAM_CODE_MASTER CM ON CM.FCM_CODE = T.FPM_LEVEL 
  LEFT JOIN 
    CUSR.CU_MFGPRO_CC_MSTR CMCC ON CMCC.CC_CTR = T.FPM_CC 
  WHERE 
    (T.FPM_FACTORY = '${FPM_factory}' OR '${FPM_factory}' IS NULL)
    AND (T.FPM_LEVEL = '${FPM_level}' OR '${FPM_level}' IS NULL)
    AND (TRIM(T.FPM_CC) = '${FPM_cost_center}' OR '${FPM_cost_center}' IS NULL)
    AND (UPPER(T.FPM_USER_LOGIN) = UPPER('${FPM_user_login}') OR UPPER('${FPM_user_login}') IS NULL)
    ORDER BY  C.FACTORY_NAME,CM.FCM_DESC,CMCC.CC_DESC,T.FPM_USER_LOGIN DESC
           `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.getEdit_Person_Show = async function (req, res) {
  try {
    const { FPM_factory, FPM_level, FPM_cost_center, FPM_user_login } =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT   
        T.FPM_FACTORY,
        CU.FACTORY_NAME,
        T.FPM_LEVEL,
        FCM.FCM_DESC ,
        T.FPM_CC ,
        CTM.CC_DESC ,
        T.FPM_USER_LOGIN,
        T.FPM_EMAIL,
        T.FPM_PERSON_STS,
        T.FPM_CREATE_BY,
        TO_CHAR(T.FPM_CREATE_DATE , 'DD/MM/YYYY') AS FPM_CREATE_DATE_E,
        T.FPM_UPDATE_BY,
        TO_CHAR(T.FPM_UPDATE_DATE , 'DD/MM/YYYY') AS FPM_UPDATE_DATE_E
       FROM FAM_PERSON_MASTER T 
        LEFT JOIN CUSR.CU_FACTORY_M CU ON CU.FACTORY_CODE = T.FPM_FACTORY 
        LEFT JOIN FAM_CODE_MASTER FCM ON FCM.FCM_CODE = T.FPM_LEVEL 
        LEFT JOIN CUSR.CU_MFGPRO_CC_MSTR CTM ON CTM.CC_CTR =  T.FPM_CC 
      WHERE T.FPM_FACTORY = '${FPM_factory}'
      AND T.FPM_LEVEL = '${FPM_level}'
      AND T.FPM_CC = '${FPM_cost_center}'
      AND T.FPM_USER_LOGIN = '${FPM_user_login}'
           `;
    const result = await connect.execute(query);
    connect.release();
    // res.json(result.rows);
    const flatArray = result.rows.map((item) => Object.values(item)).flat();
    res.json(flatArray);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

// Delete Person Maintain
module.exports.deletePerson_Maintain = async (req, res) => {
  try {
    const {
      FPM_factory_delete,
      FPM_level_delete,
      FPM_cost_center_delete,
      FPM_user_login_delete,
    } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
          DELETE FROM FAM_PERSON_MASTER T
      WHERE T.FPM_FACTORY = :FPM_factory_delete
      AND T.FPM_LEVEL = :FPM_level_delete 
      AND T.FPM_CC = :FPM_cost_center_delete
      AND T.FPM_USER_LOGIN = :FPM_user_login_delete
          `;

    const data = {
      FPM_factory_delete,
      FPM_level_delete,
      FPM_cost_center_delete,
      FPM_user_login_delete,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
};

//BOI Project
module.exports.get_BOI_project = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
        DISTINCT T.FBMC_BOI_PROJ
    FROM
        FAM_BOIPROJ_MAP_CC T
    ORDER BY
        T.FBMC_BOI_PROJ
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//Search BOI Project
module.exports.search_BOI_project = async function (req, res) {
  try {
    // const factory = req.query.FBMC_factory;
    // const cost_center = req.query.FBMC_cost_center;
    // const BOI_Project = req.query.FBMC_BOI_project;
    const { FBMC_factory, FBMC_cost_center, FBMC_BOI_project } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT
    DISTINCT 
                      T.FBMC_FACTORY AS FACTORY_CC,
    C.FACTORY_NAME AS FACTORY ,
    CMCC.CC_DESC AS COST_CENTER,
    T.FBMC_COST_CENTER AS COST_CENTER_CC,
    T.FBMC_BOI_PROJ,
  CASE
      WHEN T.FBMC_STATUS = 'A' THEN 'Active'
      WHEN T.FBMC_STATUS = 'I' THEN 'In Active'
      ELSE T.FBMC_STATUS
  END AS BOI_STATUS,
    T.FBMC_UPDATE_BY,
  TO_CHAR(T.FBMC_UPDATE_DATE, 'DD/MM/YYYY') AS UPDATE_DATE
FROM
    FAM_BOIPROJ_MAP_CC T
LEFT JOIN CUSR.CU_FACTORY_M C ON
    C.FACTORY_CODE = T.FBMC_FACTORY
LEFT JOIN CUSR.CU_MFGPRO_CC_MSTR CMCC ON
    CMCC.CC_CTR = T.FBMC_COST_CENTER
WHERE
    (T.FBMC_FACTORY = '${FBMC_factory}'
        OR '${FBMC_factory}' IS NULL)
    AND (TRIM(T.FBMC_COST_CENTER) = '${FBMC_cost_center}'
        OR '${FBMC_cost_center}' IS NULL)
    AND (T.FBMC_BOI_PROJ = '${FBMC_BOI_project}'
        OR '${FBMC_BOI_project}' IS NULL)
ORDER BY
    C.FACTORY_NAME,
    CMCC.CC_DESC,
    T.FBMC_BOI_PROJ DESC
    `;

    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// insert BOI project
module.exports.insertBOI_Maintain = async function (req, res) {
  try {
    const {
      FBMC_cost_center,
      FBMC_factory,
      FBMC_BOI_Project,
      FBMC_status,
      FBMC_comment,
      FBMC_create_by,
      FBMC_update_by,
    } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    INSERT INTO FAM_BOIPROJ_MAP_CC (FBMC_COST_CENTER,FBMC_FACTORY,FBMC_BOI_PROJ,FBMC_STATUS,FBMC_COMMENT,FBMC_CREATE_DATE,FBMC_CREATE_BY,FBMC_UPDATE_DATE,FBMC_UPDATE_BY)
    VALUES (:FBMC_cost_center,:FBMC_factory,:FBMC_BOI_Project,:FBMC_status,:FBMC_comment,SYSDATE,:FBMC_create_by,SYSDATE,:FBMC_update_by)

         `;
    const data = {
      FBMC_cost_center,
      FBMC_factory,
      FBMC_BOI_Project,
      FBMC_status,
      FBMC_comment,
      FBMC_create_by,
      FBMC_update_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการบันทึกข้อมูล:", error.message);
  }
};

// update BOI maintian
module.exports.updateBOI_Maintain = async function (req, res) {
  try {
    const {
      FBMC_cost_center,
      FBMC_factory,
      FBMC_BOI_Project,
      FBMC_status,
      FBMC_comment,
      FBMC_update_by,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
        FAM_BOIPROJ_MAP_CC
    SET
        FBMC_FACTORY = :FBMC_factory,
        FBMC_STATUS = :FBMC_status,
        FBMC_COMMENT = :FBMC_comment,
        FBMC_UPDATE_DATE = SYSDATE,
        FBMC_UPDATE_BY = :FBMC_update_by
    WHERE
        FBMC_COST_CENTER = :FBMC_cost_center
        AND FBMC_BOI_PROJ = :FBMC_BOI_Project
         `;
    const data = {
      FBMC_cost_center,
      FBMC_factory,
      FBMC_BOI_Project,
      FBMC_status,
      FBMC_comment,
      FBMC_update_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการบันทึกข้อมูล:", error.message);
  }
};

// get show data edit BOI
module.exports.getEdit_BOI_Show = async function (req, res) {
  try {
    const { FBMC_cost_center, FBMC_BOI_Project } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT 
    T.FBMC_COST_CENTER,
    CTM.CC_DESC, 
    T.FBMC_FACTORY,
    CU.FACTORY_NAME,
    T.FBMC_BOI_PROJ,
    T.FBMC_STATUS,
    T.FBMC_COMMENT,
     TO_CHAR(T.FBMC_CREATE_DATE , 'DD/MM/YYYY') AS CREATE_E,
    T.FBMC_CREATE_BY,
    TO_CHAR(T.FBMC_UPDATE_DATE , 'DD/MM/YYYY') AS UPDATE_E,
    T.FBMC_UPDATE_BY
FROM
    FAM_BOIPROJ_MAP_CC T
    LEFT JOIN CUSR.CU_FACTORY_M CU ON CU.FACTORY_CODE = T.FBMC_FACTORY 
    LEFT JOIN CUSR.CU_MFGPRO_CC_MSTR CTM ON CTM.CC_CTR = T.FBMC_COST_CENTER 
WHERE
    T.FBMC_COST_CENTER = '${FBMC_cost_center}'
    AND T.FBMC_BOI_PROJ = '${FBMC_BOI_Project}'
    `;
    const result = await connect.execute(query);
    connect.release();
    const flatArray = result.rows.map((item) => Object.values(item)).flat();
    res.json(flatArray);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// get show data Project name BOI
module.exports.get_BOI_project_name = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(QAD);
    const query = `
      SELECT
      DISTINCT CD.CODE_CMMT
    FROM
      KFA_MSTR KM,
      KFAD_DET KD,
      CODE_MSTR CD
    WHERE
      KM.KFA_CODE = KD.KFAD_CODE
      AND KM.KFA_DOMAIN = KD.KFAD_DOMAIN
      AND KM.KFA_OBLG = CD.CODE_VALUE
      AND KM.KFA_DOMAIN = CD.CODE_DOMAIN
      AND upper(CD.CODE_FLDNAME) = 'KFA_OBLG'
      AND KD.KFAD_BOOK = 'SL'
      AND UPPER(KM.KFA_DOMAIN) = '9000'
      AND KD.KFAD_SEQ = '0'
    ORDER BY
      CD.CODE_CMMT 
             `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

// Delete BOI Maintain
module.exports.deleteBOI_Maintain = async function (req, res) {
  try {
    const { FBMC_cost_center_delete, FBMC_BOI_Project_delete } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    DELETE
    FROM
      FAM_BOIPROJ_MAP_CC T
    WHERE
      T.FBMC_COST_CENTER = :FBMC_cost_center_delete
      AND T.FBMC_BOI_PROJ = :FBMC_BOI_Project_delete  
         `;
    const data = {
      FBMC_cost_center_delete,
      FBMC_BOI_Project_delete,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการบันทึกข้อมูล:", error.message);
  }
};

//CountTransfer

module.exports.getCountTransfer = async function (req, res) {
  try {
    const { UserLogin } = req.body;

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
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLTR096')
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
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.getCountLoss = async function (req, res) {
  try {
    const { UserLogin } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT  COUNT(T.FRH_FAM_NO)
    FROM FAM_REQ_HEADER T
    LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = T.FRH_FAM_NO
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
        OR (T.FAM_FM_BY  = '${UserLogin}'  AND T.FAM_REQ_STATUS = 'FLLS096')
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
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
//CountTransferListALL
module.exports.getCountTransferlistaLL = async function (req, res) {
  try {
    const { UserLogin } = req.body;

    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    COUNT(CASE WHEN TT.FFM_CODE = 'FLTR001'
    OR TT.FFM_CODE = 'FLTR092'
    OR TT.FFM_CODE = 'FLTR093'
    OR TT.FFM_CODE = 'FLTR094'
    OR TT.FFM_CODE = 'FLTR095'
    OR TT.FFM_CODE = 'FLTR096'
    OR TT.FFM_CODE = 'FLTR907'
    OR TT.FFM_CODE = 'FLTR908'
    OR TT.FFM_CODE = 'FLTR909'
    OR TT.FFM_CODE = 'FLTR910'
    OR TT.FFM_CODE = 'FLTR911'
    OR TT.FFM_CODE = 'FLTR912'
    THEN 1 ELSE NULL END) AS T_CREATE,
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
        OR (HT.FAM_MGR_DEPT = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR002')
        OR (HT.FAM_SERVICE_BY  = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR003')
        OR (HT.FAM_BOI_CHK_BY  = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR004')
        OR (HT.FAM_BOI_MGR_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR005')
        OR (HT.FAM_FM_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR006')
        OR (HT.FAM_ACC_CHK_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR007')
        OR (HT.FAM_OWNER_SEND_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR008')
        OR ( A.FRT_RECEIVE_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR009')
        OR (HT.FAM_ACC_REC_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR010')
        OR (HT.FAM_ACC_MGR_BY  = '${UserLogin}' AND HT.FAM_REQ_STATUS = 'FLTR011')
        OR (HT.FAM_SERVICE_CLOSE_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR012')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR092')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR093')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR094')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR095')
        OR (HT.FAM_FM_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR096')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR907')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR908')
        OR (HT.FAM_REQ_BY   = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR909')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR910')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR911')
        OR (HT.FAM_REQ_BY  = '${UserLogin}'  AND HT.FAM_REQ_STATUS = 'FLTR912')
        )
    
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//CountTransferListALLname
module.exports.getCountTransferlistaLLname = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT F.FFM_CODE, F.FFM_TYPE, F.FFM_DESC  
    FROM FAM_FLOW_MASTER F
    WHERE F.FFM_TYPE = 'TRANSFER'
    AND (F.FFM_CODE BETWEEN 'FLTR001' AND 'FLTR012')
         `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
/// Owner Id
module.exports.Id_owner = async function (req, res) {
  try {
    const { owner_id } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
     SELECT T.EMPCODE ,
       T.ENAME || '  ' || T.ESURNAME AS NAME_SURNAME ,
       SUBSTR(T.COST_CENTER, 1, 4) AS COST_CENTER_PREFIX
FROM CU_USER_HUMANTRIX T
WHERE T.EMPCODE = :owner_id    
           `;
    const data = {
      owner_id,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// Fix Asset
module.exports.fix_code_find = async function (req, res) {
  try {
    const { assetcode } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT T.FRH_FAM_NO ,
    F.FRD_ASSET_CODE , 
    F.FRD_COMP ,T.FAM_REQ_STATUS 
    FROM FAM_REQ_DETAIL F 
    LEFT JOIN FAM_REQ_HEADER T ON T.FRH_FAM_NO = F.FRD_FAM_NO 
    WHERE F.FRD_ASSET_CODE  = :assetcode 
    AND T.FAM_REQ_STATUS NOT IN ('FLTR013', 'FLTR999', 
    'FLDN013', 'FLDN999',
  'FLLD013', 'FLLD999', 
  'FLLS013', 'FLLS999',
  'FLSC013', 'FLSC999', 
  'FLWO013', 'FLWO999')
    ORDER BY FRD_COMP ASC
           `;
    const data = {
      assetcode,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// get comp
module.exports.get_COMP = async function (req, res) {
  const { fam_no } = req.body;
  try {
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT FD.FRD_COMP ,FD.FRD_ASSET_NAME,FD.FRD_FAM_NO,FD.FRD_ASSET_CODE  
    FROM AVO.FAM_REQ_HEADER FH 
    INNER JOIN AVO.FAM_REQ_DETAIL FD ON FD.FRD_FAM_NO = FH.FRH_FAM_NO 
    WHERE SUBSTR(FD.FRD_FAM_NO, 1, 6) = SUBSTR('${fam_no}', 1, 6)
        AND FH.FAM_REQ_STATUS NOT IN ('FLTR013', 'FLTR999', 
        'FLDN013', 'FLDN999',
      'FLLD013', 'FLLD999', 
      'FLLS013', 'FLLS999',
      'FLSC013', 'FLSC999', 
      'FLWO013', 'FLWO999')
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// insert for detail new cc
module.exports.update_new_cc = async function (req, res) {
  try {
    const { fam, New_cc, updateby } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_DETAIL
    SET FRD_NEW_CC = :New_cc,
    FRD_UPDATE_DATE = SYSDATE,
    FRD_UPDATE_BY = :updateby
    WHERE FRD_FAM_NO = :fam
  `;

    const data = {
      fam,
      New_cc,
      updateby,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
//update by กับ date tran
module.exports.update_for_date_trans = async function (req, res) {
  try {
    const { fam, updateby } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_TRANSFER
    SET FRT_UPDATE_DATE = SYSDATE,
    FRT_UPDATE_BY = :updateby
    WHERE FRT_FAM_NO = :fam
  `;

    const data = {
      fam,
      updateby,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Fam Master
module.exports.searchFamMaster = async function (req, res) {
  try {
    const {
      Fac,
      OwnerCC,
      FamFrom,
      FamTo,
      Dept,
      AssetCC,
      ReqType,
      // FixCode,
      DateFrom,
      DateTo,
      ByID,
      StsID,
    } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT M.FACTORY_NAME AS FACTORY,
    T.FAM_REQ_OWNER_CC  AS COSTCENTER,
    T.FRH_FAM_NO AS FAMNO,
    TO_CHAR(T.FAM_REQ_DATE, 'DD/MM/YYYY') AS ISSUEDATE,
    T.FAM_REQ_BY AS ISSUEBY,
    R.FCM_DESC AS RETYPE,
    --(SELECT TO_CHAR(WM_CONCAT(DISTINCT CD.FRD_ASSET_CODE))FROM FAM_REQ_DETAIL CD WHERE CD.FRD_FAM_NO = T.FRH_FAM_NO ) AS FIXED_CODE,
    F.FFM_DESC AS STATUS,
    T.FAM_REQ_TYPE 
  FROM
    FAM_REQ_HEADER T
  LEFT JOIN CUSR.CU_FACTORY_M M ON M.FACTORY_CODE = T.FAM_FACTORY
  LEFT JOIN FAM_CODE_MASTER R ON R.FCM_CODE = T.FAM_REQ_TYPE
  LEFT JOIN FAM_FLOW_MASTER F ON F.FFM_CODE = T.FAM_REQ_STATUS
  LEFT JOIN FAM_REQ_DETAIL C ON C.FRD_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN FAM_REQ_TRANSFER A ON A.FRT_FAM_NO = T.FRH_FAM_NO
  LEFT JOIN CUSR.CU_USER_HUMANTRIX MH ON MH.EMPCODE = T.FAM_REQ_OWNER
  LEFT JOIN FAM_FLOW_MASTER TR ON TR.FFM_CODE = T.FAM_REQ_STATUS 
  WHERE 1=1
    AND (T.FAM_FACTORY = '${Fac}' OR '${Fac}' IS NULL)
    AND ('${OwnerCC}' IS NULL OR T.FAM_REQ_OWNER_CC  IN (SELECT TRIM(REGEXP_SUBSTR('${OwnerCC}', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('${OwnerCC}', ',') + 1))
    AND (T.FRH_FAM_NO >= '${FamFrom}' OR '${FamFrom}' IS NULL)
    AND (T.FRH_FAM_NO <= '${FamTo}' OR '${FamTo}' IS NULL)
    AND ('${Dept}' IS NULL OR T.FAM_REQ_DEPT  IN (SELECT TRIM(REGEXP_SUBSTR('${Dept}', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('${Dept}', ',') + 1))
    AND ('${AssetCC}' IS NULL OR T.FAM_ASSET_CC  IN (SELECT TRIM(REGEXP_SUBSTR('${AssetCC}', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('${AssetCC}', ',') + 1))
    AND ('${ReqType}' IS NULL OR T.FAM_REQ_TYPE  IN (SELECT TRIM(REGEXP_SUBSTR('${ReqType}', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('${ReqType}', ',') + 1))
   -- AND ('fixcode' IS NULL OR C.FRD_ASSET_CODE IN (SELECT TRIM(REGEXP_SUBSTR('fixcode', '[^,]+', 1, LEVEL)) FROM DUAL CONNECT BY LEVEL <= REGEXP_COUNT('fixcode', ',') + 1))
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') >= '${DateFrom}' OR '${DateFrom}' IS NULL)
    AND (TO_CHAR(T.FAM_REQ_DATE , 'YYYY-MM-DD') <= '${DateTo}' OR '${DateTo}' IS NULL)
    AND (T.FAM_REQ_BY = '${ByID}' OR '${ByID}' IS NULL) 
    AND (T.FAM_REQ_STATUS = '${StsID}' OR '${StsID}' IS NULL)
    ORDER BY T.FRH_FAM_NO ASC  `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);

  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
// namefile
module.exports.namefile = async function (req, res) {
  try {
    const { fam_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
      SELECT FFA_FILE_SERVER  
      FROM FAM_FILE_ATTACH WHERE FFA_FAM_NO = '${fam_no}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.find_asset_fixdata = async function (req, res) {
  try {
    const { assetcode } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT  F.FRD_ASSET_CODE, F.FRD_COMP, T.FAM_REQ_STATUS
    FROM FAM_REQ_DETAIL F
    LEFT JOIN FAM_REQ_HEADER T ON T.FRH_FAM_NO = F.FRD_FAM_NO
    WHERE F.FRD_ASSET_CODE = :assetcode AND T.FAM_REQ_STATUS <> 'FLTR013'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//Donation
module.exports.date_certificate = async function (req, res) {
  try {
    const { famno, date_cer } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
UPDATE FAM_REQ_HEADER  
SET FAM_ACC_CHK_CER_DATE = TO_DATE(:date_cer, 'YYYY-MM-DD')
WHERE FRH_FAM_NO = :famno
  `;
    const data = {
      famno,
      date_cer,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getEditdate_certaficate = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
     TO_CHAR(FAM_ACC_CHK_CER_DATE, 'YYYY-MM-DD') AS FAM_ACC_CHK_CER_DATE
FROM FAM_REQ_HEADER frh WHERE FRH_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

//Leading
module.exports.insert_leading = async function (req, res) {
  try {
    const { tranfer, acc_return, req_reuturn, req_reuturn_by } = req.body;
  
    const connect = await oracledb.getConnection(AVO);
    const query = `
    INSERT INTO FAM_REQ_LENDING
    (FRL_FAM_NO,
    FRL_ACC_MGR_BY,
    FRL_OWNER_RETURN_BY,
    FRL_CREATE_DATE,
    FRL_CREATE_BY
    )
  VALUES(
  :tranfer,
  :acc_return,
  :req_reuturn,
  SYSDATE,
  :req_reuturn_by ) `;

    const data = {
      tranfer,
      acc_return,
      req_reuturn,
      req_reuturn_by,
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true }); // send response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_lending = async function (req, res) {
  try {
    const { tranfer, acc_return, req_reuturn, req_reuturn_by } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_LENDING 
    SET 
    FRL_ACC_MGR_BY = :acc_return ,
    FRL_OWNER_RETURN_BY = :req_reuturn,
    FRL_UPDATE_DATE = SYSDATE ,
    FRL_UPDATE_BY= :req_reuturn_by
    WHERE FRL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,
      acc_return,
      req_reuturn,
      req_reuturn_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getEdit_lenging = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT FRL_FAM_NO , FRL_ACC_MGR_BY,TO_CHAR(FRL_ACC_MGR_DATE, 'DD/MM/YYYY') 
    ,TO_CHAR(FRL_ACC_MGR_RETURN, 'YYYY-MM-DD')  ,FRL_ACC_MGR_JUD ,FRL_ACC_MGR_CMMT ,FRL_OWNER_RETURN_BY ,
    TO_CHAR(FRL_OWNER_DATE, 'DD/MM/YYYY') ,FRL_OWNER_CMMT ,
    TO_CHAR(FRL_ACC_MGR_RETURN, 'DD/MM/YYYY') AS SHOW_FAM_MASTER_LIST
    FROM FAM_REQ_LENDING WHERE FRL_FAM_NO  = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports.update_leading_acc_return = async function (req, res) {
  try {
    const { tranfer, return_date_acc, acc_return_jud, acc_return_cmmt } =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_LENDING 
    SET 
    FRL_ACC_MGR_DATE = SYSDATE ,
    FRL_ACC_MGR_RETURN = TO_DATE(:return_date_acc, 'YYYY-MM-DD'),
    FRL_ACC_MGR_JUD = :acc_return_jud ,
    FRL_ACC_MGR_CMMT= :acc_return_cmmt
    WHERE FRL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,
      return_date_acc,
      acc_return_jud,
      acc_return_cmmt,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_leading_own_return = async function (req, res) {
  try {
    const { tranfer, own_return_cmmt } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_LENDING 
    SET 
    FRL_OWNER_DATE = SYSDATE ,
    FRL_OWNER_CMMT= :own_return_cmmt
    WHERE FRL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,
      own_return_cmmt,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Scrap
module.exports.insert_scrap = async function (req, res) {
  try {
    const { famno, pte_env, pln_staff, shipping, create_by } = req.body;
    const connect = await oracledb.getConnection(AVO); // Assuming AVO is your connection details object
    const query = `
    INSERT INTO FAM_REQ_SCRAP 
    (FRSC_FAM_NO,
    FRSC_ENV_BY,
    FRSC_PLN_BY,
    FRSC_SHP_BY,
    FRSC_CREATE_DATE,
    FRSC_CREATE_BY
  )
VALUES 
    (:famno,
    :pte_env,
    :pln_staff,
    :shipping,
    SYSDATE,
  :create_by)

    `;

    const data = {
      famno,
      pte_env,
      pln_staff,
      shipping,
      create_by,
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true }); // send response
  } catch (error) {
    console.error("Error: insert_scrap", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports.update_scrap = async function (req, res) {
  try {
    const { famno, pte_env, pln_staff, shipping, update_by } = req.body;
    
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SCRAP 
    SET FRSC_ENV_BY = :pte_env,
    FRSC_PLN_BY = :pln_staff,
    FRSC_SHP_BY = :shipping,
    FRSC_UPDATE_BY = :update_by,
    FRSC_UPDATE_DATE = SYSDATE 
    WHERE FRSC_FAM_NO = :famno
  `;

    const data = {
      famno,
      pte_env,
      pln_staff,
      shipping,
      update_by,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in update_scrap:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getEdit_scrap = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    FRSC_FAM_NO ,
    FRSC_ENV_BY,
    TO_CHAR(FRSC_ENV_DATE, 'DD/MM/YYYY') ,
      FRSC_ENV_CMMT,
      FRSC_PLN_BY,
    TO_CHAR(FRSC_PLN_DATE, 'DD/MM/YYYY') ,
    FRSC_PLN_CMMT ,
    FRSC_SHP_BY ,
    TO_CHAR(FRSC_SHP_DATE, 'DD/MM/YYYY') ,
    FRSC_SHP_CMMT,
      TO_CHAR(FRSC_SCRAP_DATE, 'YYYY-MM-DD') ,
      TO_CHAR(FRSC_SCRAP_DATE, 'DD/MM/YYYY')
  FROM
    FAM_REQ_SCRAP
  WHERE
    FRSC_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("getEdit_scrap Error:", error.message);
  }
};
module.exports.update_scrap_pte = async function (req, res) {
  try {
    const { tranfer, pte_env_cmmt ,date_scrap} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SCRAP 
    SET 
    FRSC_ENV_CMMT = :pte_env_cmmt ,
    FRSC_ENV_DATE = SYSDATE,
     FRSC_SCRAP_DATE = TO_DATE(:date_scrap, 'YYYY-MM-DD')
    WHERE FRSC_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pte_env_cmmt,date_scrap
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.update_scrap_pln = async function (req, res) {
  try {
    const { tranfer, pln_staff_cmmt} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SCRAP 
    SET 
    FRSC_PLN_CMMT = :pln_staff_cmmt ,
    FRSC_PLN_DATE = SYSDATE
    WHERE FRSC_FAM_NO = :tranfer
  `;

    const data = {
      tranfer, pln_staff_cmmt
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_scrap_pln", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_scrap_shipping = async function (req, res) {
  try {
    const { tranfer, shipping_staff_cmmt} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SCRAP 
    SET 
    FRSC_SHP_CMMT = :shipping_staff_cmmt ,
    FRSC_SHP_DATE = SYSDATE
    WHERE FRSC_FAM_NO = :tranfer
  `;

    const data = {
      tranfer, shipping_staff_cmmt
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.insert_weight = async function (req, res) {
  try {
    const { famno,idfix_asset,namefixasset,weight_fix } = req.body;
   
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_DETAIL 
    SET FRD_ENV_WEIGHT = :weight_fix
    WHERE FRD_FAM_NO = :famno
    AND FRD_ASSET_CODE =:idfix_asset 
    AND FRD_ASSET_NAME =:namefixasset
  `;
    const data = {
      famno,idfix_asset,namefixasset,weight_fix,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_weight:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.insert_size = async function (req, res) {
  try {
    const { famno,idfix_asset,namefixasset,size_fix } = req.body;
   
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_DETAIL 
    SET FRD_ENV_SIZE = :size_fix
    WHERE FRD_FAM_NO = :famno
    AND FRD_ASSET_CODE =:idfix_asset 
    AND FRD_ASSET_NAME =:namefixasset
  `;
    const data = {
      famno,idfix_asset,namefixasset,size_fix,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_size:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.insert_unit_price = async function (req, res) {
  try {
    const { famno,idfix_asset,namefixasset,unit_pri } = req.body;
   
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_DETAIL 
    SET FRD_PLN_UNITPRICE = :unit_pri
    WHERE FRD_FAM_NO = :famno
    AND FRD_ASSET_CODE =:idfix_asset 
    AND FRD_ASSET_NAME =:namefixasset
  `;
    const data = {
      famno,idfix_asset,namefixasset,unit_pri,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_unit_price:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.insert_invoice = async function (req, res) {
  try {
    const { famno,idfix_asset,namefixasset,invoice_no } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_DETAIL 
    SET FRD_SHP_INVOICE = :invoice_no
    WHERE FRD_FAM_NO = :famno
    AND FRD_ASSET_CODE =:idfix_asset 
    AND FRD_ASSET_NAME =:namefixasset
  `;
    const data = {
      famno,idfix_asset,namefixasset,invoice_no,
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_invoice:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.get_weights = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    FRD_ENV_WEIGHT 
  FROM
    FAM_REQ_DETAIL
  WHERE
    FRD_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("getEdit_scrap Error:", error.message);
  }
};
module.exports.get_size = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    FRD_ENV_SIZE 
  FROM
    FAM_REQ_DETAIL
  WHERE
    FRD_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_size Error:", error.message);
  }
};

module.exports.get_unitprice = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    FRD_PLN_UNITPRICE 
  FROM
    FAM_REQ_DETAIL
  WHERE
    FRD_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_unitprice Error:", error.message);
  }
};

module.exports.get_inv_no = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT
    FRD_SHP_INVOICE 
  FROM
    FAM_REQ_DETAIL
  WHERE
    FRD_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("get_inv_no Error:", error.message);
  }
};
module.exports.update_for_nullScarp = async function (req, res) {
  try {
    const {famno} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_SCRAP A
  SET
  A.FRSC_ENV_DATE = NULL,
  A.FRSC_ENV_CMMT = NULL ,
  A.FRSC_PLN_DATE = NULL ,
  A.FRSC_PLN_CMMT = NULL ,
  A.FRSC_SHP_DATE = NULL ,
  A.FRSC_SHP_CMMT = NULL 
  WHERE
  A.FRSC_FAM_NO = :famno 
  `;
    const data = {
      famno
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_invoice:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.update_for_nullLending = async function (req, res) {
  try {
    const {famno} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_LENDING
SET
  FRL_ACC_MGR_DATE = NULL,
  FRL_ACC_MGR_RETURN = NULL,
  FRL_ACC_MGR_JUD = NULL,
  FRL_ACC_MGR_CMMT = NULL,
  FRL_OWNER_DATE = NULL,
  FRL_OWNER_CMMT = NULL
WHERE
  FRL_FAM_NO = :famno

  `;
    const data = {
      famno
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_for_nullLending:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Sales
module.exports.update_sale = async function (req, res) {
  try {
    const { famno, updateinput_ws, update_plnboi, updateboi_prerare, updatedata_import,
      updatethai_catergories,updatebidding,updateindustrial,updateclerance,update_upload_file_after,
      updatereq_inv,updateinput_in,updatepayment,update_by
     } = req.body;
    
    const connect = await oracledb.getConnection(AVO);
    const query = `
   UPDATE FAM_REQ_SALES 
    SET FRSL_ENV1_BY = :updateinput_ws,
    FRSL_PLN1_BY = :update_plnboi,
    FRSL_IMP1_BY = :updateboi_prerare,
    FRSL_BOI1_BY = :updatedata_import,
    FRSL_IMP2_BY = :updatethai_catergories ,
    FRSL_PLN2_BY = :updatebidding,
    FRSL_ENV2_BY = :updateindustrial,
    FRSL_BOI2_BY = :updateclerance,
    FRSL_ENV3_BY = :update_upload_file_after,
    FRSL_PLN3_BY = :updatereq_inv ,
    FRSL_SHP_BY = :updateinput_in,
    FRSL_PLN4_BY = :updatepayment,
    FRSL_UPDATE_BY =:update_by,
    FRSL_UPDATE_DATE = SYSDATE 
    WHERE FRSL_FAM_NO = :famno
  `;

    const data = {
      famno, updateinput_ws, update_plnboi, updateboi_prerare, updatedata_import,
      updatethai_catergories,updatebidding,updateindustrial,updateclerance,update_upload_file_after,
      updatereq_inv,updateinput_in,updatepayment,update_by
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in update_scrap:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.insert_sale = async function (req, res) {
  try {
    const {famno, 
      createinput_ws, 
      create_plnboi, 
      createboi_prerare, 
      createdata_import,
      createthai_catergories,
      createbidding,
      createindustrial,
      createclerance,
      create_upload_file_after,
      createreq_inv,
      createinput_in,
      createpayment,
      create_by} = req.body;
  
     
    const connect = await oracledb.getConnection(AVO);
    const query = `
   INSERT INTO FAM_REQ_SALES 
    (FRSL_FAM_NO,
    FRSL_ENV1_BY,
    FRSL_PLN1_BY,
    FRSL_IMP1_BY,
    FRSL_BOI1_BY,
    FRSL_IMP2_BY,
    FRSL_PLN2_BY,
    FRSL_ENV2_BY,
    FRSL_BOI2_BY,
    FRSL_ENV3_BY,
    FRSL_PLN3_BY,
    FRSL_SHP_BY,
    FRSL_PLN4_BY,
    FRSL_CREATE_BY,
    FRSL_CREATE_DATE
  )
VALUES 
    (:famno,
:createinput_ws,
    :create_plnboi,
    :createboi_prerare,
    :createdata_import,
    :createthai_catergories,
  :createbidding,
  :createindustrial,
  :createclerance,
  :create_upload_file_after,
  :createreq_inv,
  :createinput_in,
  :createpayment,
  :create_by,
  SYSDATE)

    `;

    const data = {
      famno, 
      createinput_ws, 
      create_plnboi, 
      createboi_prerare, 
      createdata_import,
      createthai_catergories,
      createbidding,
      createindustrial,
      createclerance,
      create_upload_file_after,
      createreq_inv,
      createinput_in,
      createpayment,
      create_by
    };

    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.status(200).json({ success: true }); 
  } catch (error) {
    console.error("Error: insert_sale", error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.getEdit_sale = async function (req, res) {
  try {
    const { famno } = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
   
 SELECT
	FRSL_FAM_NO ,
	FRSL_ENV1_BY,
	TO_CHAR(FRSL_ENV1_DATE, 'DD/MM/YYYY') ,
	FRSL_ENV1_CMMT,
	FRSL_PLN1_BY,
	TO_CHAR(FRSL_PLN1_DATE, 'DD/MM/YYYY') ,
	FRSL_PLN1_CMMT ,
	FRSL_IMP1_BY ,
	TO_CHAR(FRSL_IMP1_DATE, 'DD/MM/YYYY') ,
	FRSL_IMP1_CMMT,
	FRSL_BOI1_BY ,
	TO_CHAR(FRSL_BOI1_DATE, 'DD/MM/YYYY') ,
	FRSL_BOI1_CMMT,
	FRSL_IMP2_BY ,
	FRSL_IMP2_CATEGORY,
	TO_CHAR(FRSL_IMP2_DATE, 'DD/MM/YYYY') ,
	FRSL_IMP2_CMMT,
	FRSL_PLN2_BY ,
	TO_CHAR(FRSL_PLN2_DATE, 'DD/MM/YYYY') ,
	FRSL_PLN2_BIDDING,
	FRSL_PLN2_CMMT,
	FRSL_ENV2_BY,
	TO_CHAR(FRSL_ENV2_CONTACT_DATE, 'YYYY-MM-DD') ,
	TO_CHAR(FRSL_ENV2_DATE, 'DD/MM/YYYY') ,
	FRSL_ENV2_CMMT,
	FRSL_BOI2_BY ,
  TO_CHAR(FRSL_BOI2_CLEAR_DATE, 'YYYY-MM-DD') ,
	TO_CHAR(FRSL_BOI2_DATE, 'DD/MM/YYYY') ,
	FRSL_BOI2_CMMT,
	FRSL_ENV3_BY ,
  TO_CHAR(FRSL_ENV3_CONTACT_DATE, 'YYYY-MM-DD') ,
	TO_CHAR(FRSL_ENV3_DATE, 'DD/MM/YYYY') ,
	FRSL_ENV3_CMMT,
	FRSL_PLN3_BY ,
	TO_CHAR(FRSL_PLN3_DATE, 'DD/MM/YYYY') ,
	FRSL_PLN3_CMMT,
	FRSL_SHP_BY ,
	TO_CHAR(FRSL_SHP_DATE, 'DD/MM/YYYY') ,
	FRSL_SHP_CMMT,
	FRSL_PLN4_BY ,
	TO_CHAR(FRSL_PLN4_DATE, 'DD/MM/YYYY') ,
  TO_CHAR(FRSL_PLN4_MOVE_DATE, 'YYYY-MM-DD') ,
	FRSL_PLN4_CMMT,
	TO_CHAR(FRSL_ENV2_CONTACT_DATE, 'DD/MM/YYYY'),
	TO_CHAR(FRSL_BOI2_CLEAR_DATE, 'DD/MM/YYYY'),
	TO_CHAR(FRSL_ENV3_CONTACT_DATE, 'DD/MM/YYYY'),
	TO_CHAR(FRSL_PLN4_MOVE_DATE, 'DD/MM/YYYY'),
  TO_CHAR(FRSL_SALE_DATE, 'YYYY-MM-DD') ,
  TO_CHAR(FRSL_SALE_DATE, 'DD/MM/YYYY')
FROM
	FAM_REQ_SALES
WHERE
	FRSL_FAM_NO = '${famno}'
           `;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("getEdit_sale Error:", error.message);
  }
};
module.exports.update_for_nullSale = async function (req, res) {
  try {
    const {famno} = req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE
    FAM_REQ_SALES 
  SET
  FRSL_ENV1_DATE = NULL,
  FRSL_ENV1_CMMT = NULL ,
  FRSL_PLN1_DATE = NULL ,
  FRSL_PLN1_CMMT = NULL ,
  FRSL_IMP1_DATE = NULL ,
  FRSL_IMP1_CMMT = NULL ,
  FRSL_BOI1_DATE= NULL,
  FRSL_BOI1_CMMT= NULL,
  FRSL_IMP2_CATEGORY= NULL,
  FRSL_IMP2_DATE= NULL,
  FRSL_IMP2_CMMT= NULL,
  FRSL_PLN2_DATE= NULL,
  FRSL_PLN2_BIDDING= NULL,
  FRSL_PLN2_CMMT= NULL,
  FRSL_ENV2_CONTACT_DATE= NULL,
  FRSL_ENV2_DATE= NULL,
  FRSL_ENV2_CMMT= NULL,
  FRSL_BOI2_CLEAR_DATE= NULL,
  FRSL_BOI2_DATE= NULL,
  FRSL_BOI2_CMMT= NULL,
  FRSL_ENV3_CONTACT_DATE= NULL,
  FRSL_ENV3_DATE= NULL,
  FRSL_ENV3_CMMT= NULL,
  FRSL_PLN3_DATE= NULL,
  FRSL_PLN3_CMMT= NULL,
  FRSL_SHP_DATE= NULL,
  FRSL_SHP_CMMT= NULL,
  FRSL_PLN4_DATE= NULL,
  FRSL_PLN4_MOVE_DATE= NULL,
  FRSL_PLN4_CMMT= NULL
  WHERE
  FRSL_FAM_NO = :famno 
  `;
    const data = {
      famno
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error insert_invoice:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_sale_ws = async function (req, res) {
  try {
    const { tranfer, updateinput_ws_cmmt} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_ENV1_CMMT = :updateinput_ws_cmmt ,
    FRSL_ENV1_DATE = SYSDATE
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updateinput_ws_cmmt
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_sale_pln_staff_boi = async function (req, res) {
  try {
    const { tranfer, updatepln_staff_boi_cmmt} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_PLN1_CMMT = :updatepln_staff_boi_cmmt ,
    FRSL_PLN1_DATE = SYSDATE
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updatepln_staff_boi_cmmt
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error in querying data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_import_boi_prepare = async function (req, res) {
  try {
    const { tranfer, updateimport_boi_prepare} =
      req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_IMP1_CMMT = :updateimport_boi_prepare ,
    FRSL_IMP1_DATE = SYSDATE
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updateimport_boi_prepare
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_import_boi_prepare:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_boi_input_data = async function (req, res) {
  try {
    const { tranfer, updateboi_input_data} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_BOI1_CMMT = :updateboi_input_data ,
    FRSL_BOI1_DATE = SYSDATE
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updateboi_input_data
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_boi_input_data", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_thai_catergorise = async function (req, res) {
  try {
    const { tranfer, updatethai_catergorise,update_input_thaicatergory} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_IMP2_CMMT = :updatethai_catergorise ,
    FRSL_IMP2_DATE = SYSDATE,
    FRSL_IMP2_CATEGORY =:update_input_thaicatergory
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updatethai_catergorise,update_input_thaicatergory
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_thai_catergorise", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_pln_bidding = async function (req, res) {
  try {
    const { tranfer, pln_bidding,pln_bidding_result} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_PLN2_CMMT = :pln_bidding ,
    FRSL_PLN2_DATE = SYSDATE,
    FRSL_PLN2_BIDDING =:pln_bidding_result
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pln_bidding,pln_bidding_result
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_pln_bidding", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_pte_contact_dept = async function (req, res) {
  try {
    const { tranfer, pte_contact_dept,date_pte_contact_dept} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_ENV2_CMMT = :pte_contact_dept ,
    FRSL_ENV2_DATE = SYSDATE,
    FRSL_ENV2_CONTACT_DATE = TO_DATE(:date_pte_contact_dept, 'YYYY-MM-DD')
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pte_contact_dept,date_pte_contact_dept
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_pte_contact_dept", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.update_boi_make_clearance = async function (req, res) {
  try {
    const { tranfer, boi_make_clearance,date_export} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_BOI2_CMMT = :boi_make_clearance ,
    FRSL_BOI2_DATE = SYSDATE,
    FRSL_BOI2_CLEAR_DATE = TO_DATE(:date_export, 'YYYY-MM-DD')

    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,boi_make_clearance,date_export
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error pte_upload_file_clearance", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_pte_upload_file_clearance = async function (req, res) {
  try {
    const { tranfer, pte_upload_file_clearance,date_pte_upload_file_clearance} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_ENV3_CMMT = :pte_upload_file_clearance ,
    FRSL_ENV3_DATE = SYSDATE,
    FRSL_ENV3_CONTACT_DATE = TO_DATE(:date_pte_upload_file_clearance, 'YYYY-MM-DD')
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pte_upload_file_clearance,date_pte_upload_file_clearance
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_boi_make_clearance", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_pln_request_invoice = async function (req, res) {
  try {
    const { tranfer, pln_request_invoice,date_sale} =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_PLN3_CMMT = :pln_request_invoice ,
    FRSL_PLN3_DATE = SYSDATE ,
    FRSL_SALE_DATE = TO_DATE(:date_sale, 'YYYY-MM-DD')
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pln_request_invoice,date_sale
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_pln_request_invoice", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_shipping_inv = async function (req, res) {
  try {
    const { tranfer, updateshipping_inv } =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_SHP_CMMT = :updateshipping_inv ,
    FRSL_SHP_DATE = SYSDATE 
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,updateshipping_inv
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_shipping_inv", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.update_pln_upload_final = async function (req, res) {
  try {
    const { tranfer, pln_upload_final,move_date } =req.body;
    const connect = await oracledb.getConnection(AVO);
    const query = `
    UPDATE FAM_REQ_SALES 
    SET 
    FRSL_PLN4_CMMT = :pln_upload_final ,
    FRSL_PLN4_DATE = SYSDATE,
    FRSL_PLN4_MOVE_DATE = TO_DATE(:move_date, 'YYYY-MM-DD')
    WHERE FRSL_FAM_NO = :tranfer
  `;

    const data = {
      tranfer,pln_upload_final,move_date
    };
    const result = await connect.execute(query, data, { autoCommit: true });
    connect.release();
    res.json(result);
  } catch (error) {
    console.error("Error update_pln_upload_final", error.message);
    res.status(500).send("Internal Server Error");
  }
};