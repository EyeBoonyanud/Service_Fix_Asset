const express = require("express");
const oracledb = require("oracledb");
const path = require("path");
const uploadsPath = path.join(__dirname, "../uploads");
const app = express();
const port = 5000;
app.use(express.json());

oracledb.initOracleClient({
  tnsAdmin: "D:\\app\\Administrator\\product\\11.2.0\\client_1\\network\\admin",
  //process.env.TNS_ADMIN
});

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
/// May
module.exports.getFamDetailReport = async function (req, res) {
  try {
    const{Fac,CC, RequestType,FAMNo_From,FamNo_To,OwnerID }=  req.body;
    console.log(Fac,CC, RequestType,FAMNo_From,FamNo_To,OwnerID)
    const connect = await oracledb.getConnection(AVO);
    const query = `
    SELECT DISTINCT *
    FROM
    (
        SELECT
          CF.FACTORY_NAME AS FACTORY ,
          H.FAM_ASSET_CC,
          H.FRH_FAM_NO,
          1 AS iSEQ,
          D.FRD_ASSET_CODE,
          D.FRD_COMP,
          D.FRD_OWNER_CC,
          D.FRD_ASSET_NAME,
          D.FRD_CODE_NO,
          D.FRD_BOI_PROJ,
          D.FRD_QTY,
          D.FRD_INV_NO,
          TO_CHAR( D.FRD_INV_DATE, 'DD/MM/YYYY' ) AS FRD_INV_DATE,
          TRIM(TO_CHAR(D.FRD_ACQ_COST, '999,999,999,999,999,999,999.99')) AS FRD_ACQ_COST,
          D.FRD_BOOK_VALUE,
          D.FRD_NEW_CC,
          R.FRT_TO_PROJ,
          D.FRD_REMARK,
          M.FFM_FLG,
          H.FAM_REQ_STATUS
        FROM
        FAM_REQ_HEADER H
          LEFT JOIN FAM_REQ_DETAIL D ON   D.FRD_FAM_NO = H.FRH_FAM_NO
          LEFT JOIN FAM_REQ_TRANSFER R ON R.FRT_FAM_NO = H.FRH_FAM_NO
        LEFT JOIN CUSR.CU_FACTORY_M CF ON CF.FACTORY_CODE = H.FAM_FACTORY
        LEFT JOIN FAM_FLOW_MASTER M ON M.FFM_CODE = H.FAM_REQ_STATUS
        WHERE 1=1 
          AND(CF.FACTORY_CODE = '${Fac}' OR '${Fac}' IS NULL )
          AND(D.FRD_OWNER_CC = '${CC}' OR '${CC}' IS NULL )
          AND(H.FAM_REQ_TYPE = '${RequestType}' OR '${RequestType}' IS NULL )
          AND(H.FAM_REQ_OWNER = '${OwnerID}'  OR '${OwnerID}' IS NULL )
          AND (H.FRH_FAM_NO >= '${FAMNo_From}' OR '${FAMNo_From}' IS NULL)
          AND (H.FRH_FAM_NO <= '${FamNo_To}' || 'Z' OR '${FamNo_To}' IS NULL)
          AND (FAM_REQ_STATUS NOT IN ('FLTR001','FLLS001','FLWO001','FLDN001','FLLD001','FLSC001') )
          AND (FFM_FLG NOT IN ('R','F','D') OR FFM_FLG IS NULL)
        UNION ALL
        SELECT
          CF.FACTORY_NAME AS FACTORY ,
          H.FAM_ASSET_CC,
          H.FRH_FAM_NO,
          1 AS iSEQ,
          D.FRD_ASSET_CODE,
          D.FRD_COMP,
          D.FRD_OWNER_CC,
          D.FRD_ASSET_NAME,
          D.FRD_CODE_NO,
          D.FRD_BOI_PROJ,
          D.FRD_QTY,
          D.FRD_INV_NO,
          TO_CHAR( D.FRD_INV_DATE, 'DD/MM/YYYY' ) AS FRD_INV_DATE,
          TRIM(TO_CHAR(D.FRD_ACQ_COST, '999,999,999,999,999,999,999.99')) AS FRD_ACQ_COST,
          D.FRD_BOOK_VALUE,
          D.FRD_NEW_CC,
          R.FRT_TO_PROJ,
          D.FRD_REMARK,
          M.FFM_FLG,
          H.FAM_REQ_STATUS
        FROM
        FAM_REQ_HEADER H
          LEFT JOIN FAM_REQ_DETAIL D ON   D.FRD_FAM_NO = H.FRH_FAM_NO
          LEFT JOIN FAM_REQ_TRANSFER R ON R.FRT_FAM_NO = H.FRH_FAM_NO
        LEFT JOIN CUSR.CU_FACTORY_M CF ON CF.FACTORY_CODE = H.FAM_FACTORY
        LEFT JOIN FAM_FLOW_MASTER M ON M.FFM_CODE = H.FAM_REQ_STATUS
        WHERE 1=1
          AND(CF.FACTORY_CODE = '${Fac}' OR '${Fac}' IS NULL )
          AND(D.FRD_OWNER_CC = '${CC}' OR '${CC}' IS NULL )
          AND(H.FAM_REQ_TYPE = '${RequestType}' OR '${RequestType}' IS NULL )
          AND(H.FAM_REQ_OWNER = '${OwnerID}'  OR '${OwnerID}' IS NULL )
          AND (H.FRH_FAM_NO >= '${FAMNo_From}' OR '${FAMNo_From}' IS NULL)
          AND (H.FRH_FAM_NO <= '${FamNo_To}' || 'Z' OR '${FamNo_To}' IS NULL)
          AND (FAM_REQ_STATUS NOT IN ('FLTR001','FLLS001','FLWO001','FLDN001','FLLD001') )
          AND (FFM_FLG NOT IN ('R','F','D') OR FFM_FLG IS NULL)
        )
    ORDER BY 1,2,3
         
     `;
     console.log(query);
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
   
  module.exports.getRequstType = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT T.FCM_CODE,T.FCM_DESC FROM FAM_CODE_MASTER T WHERE T.FCM_GROUP_ID = 'GP01' AND T.FCM_STATUS = 'A' ORDER BY T.FCM_SORT,T.FCM_DESC
       `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
    }
  };
   
  module.exports.getFAM_FILE_ATTACH = async function (req, res) {
    try {
       const{FamNo}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT T.FFA_FAM_NO,T.FFA_ATT_FROM,T.FFA_FILE_SEQ,T.FFA_FILE_NAME,FFA_FILE_SERVER                                                                      
      FROM FAM_FILE_ATTACH T WHERE T.FFA_FAM_NO = '${FamNo}' AND FFA_ATT_FROM ='REQUEST'                                                                      
      ORDER BY T.FFA_FAM_NO,T.FFA_ATT_FROM,T.FFA_FILE_SEQ,T.FFA_FILE_NAME
       `;
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
    }
  };

  module.exports.getFAM_FILE_DATA = async function (req, res) {
    console.log("g-hk")
    try {
       const{FamNo,ATT_FROM}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT T.FFA_FAM_NO,T.FFA_ATT_FROM,T.FFA_FILE_SEQ,T.FFA_FILE_NAME,FFA_FILE_SERVER                                                                      
      FROM FAM_FILE_ATTACH T WHERE T.FFA_FAM_NO = '${FamNo}' AND FFA_ATT_FROM ='${ATT_FROM}'                                                                      
      ORDER BY T.FFA_FAM_NO,T.FFA_ATT_FROM,T.FFA_FILE_SEQ,T.FFA_FILE_NAME
       `;
       console.log(query)
      const result = await connect.execute(query);
      connect.release();
      res.json(result.rows);
    } catch (error) {
      console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
    }
  };
  
  module.exports.getWeight_Size_Unit_INV = async function (req, res) {
    try {
       const{famno}=  req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
	FRD_ENV_WEIGHT,
	FRD_ENV_SIZE,
	FRD_PLN_UNITPRICE,
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
      console.error("getWeight_Size_Unit_INV error:", error.message);
    }
  };