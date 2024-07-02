const express = require("express");
const oracledb = require("oracledb");
const path = require("path");
const app = express();
app.use(express.json());

// oracledb.initOracleClient({
//   tnsAdmin: "D:\\app\\Administrator\\product\\11.2.0\\client_1\\network\\admin",
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


  //แก้ API  หมดแล้ว
  module.exports.getData_Hearder_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT DISTINCT  T.FRH_FAM_NO,
      TO_CHAR(T.FAM_REQ_DATE, 'DD/MM/YYYY') AS FRT_PLAN_MOVE_DATE,
     R.USER_EMP_ID ||' : ' || R.USER_FNAME||' ' || R.USER_SURNAME AS REQ_BY,
     T.FAM_REQ_TEL,
     T.FAM_REQ_OWNER,
     T.FAM_REQ_OWNER_CC,
     S.ENAME || '  ' || S.ESURNAME AS NAME_SURNAME ,
     T.FAM_REQ_OWNER_TEL,
     M.FACTORY_NAME AS FACTORYNAME,
     T.FAM_REQ_DEPT ,
     T.FAM_REQ_TYPE ,
     -- FR.FRC_GROUP AS ASSET_GROUP,
     DECODE(FR.FRC_SERVICE_DEPT, 'EACH CC', 'OWNER COST CENTER',FR.FRC_SERVICE_DEPT) AS TDESCC, 
     T.FAM_ASSET_CC,
     FL.FFM_DESC AS REQ_STATUS,
     T.FAM_REQ_REMARK,
     T.FAM_REQ_STATUS 
     FROM FAM_REQ_HEADER T 
     LEFT JOIN FAM_FLOW_MASTER F ON F.FFM_CODE = T.FAM_REQ_STATUS 
     LEFT JOIN CUSR.CU_FACTORY_M M ON  M.FACTORY_CODE  =  T.FAM_FACTORY 
     LEFT JOIN CUSR.CU_USER_M R ON R.USER_LOGIN = T.FAM_REQ_BY 
     LEFT JOIN CUSR.CU_USER_HUMANTRIX S  ON S.EMPCODE = T.FAM_REQ_OWNER 
     --LEFT JOIN FAM_RUNNING_CONTROL FR ON T.FAM_ASSET_GROUP = FR.FRC_CHK_PREFIX 
     LEFT JOIN FAM_RUNNING_CONTROL FR_1 ON T.FAM_FACTORY  = FR_1.FRC_FACTORY
     LEFT JOIN FAM_RUNNING_CONTROL FR ON T.FAM_ASSET_GROUP = FR.FRC_PIC_CC  
     LEFT JOIN FAM_FLOW_MASTER FL ON FL.FFM_CODE  = T.FAM_REQ_STATUS 
     WHERE T.FRH_FAM_NO = '${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("getData_Hearder_show_VIEW error", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_Detail_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT 
            FRD_FAM_NO,
            FRD_ASSET_CODE,
            FRD_COMP,
            FRD_OWNER_CC,
            FRD_ASSET_NAME,
            FRD_BOI_PROJ,
            FRD_QTY,
            FRD_INV_NO,
            FRD_ACQ_COST,
            FRD_BOOK_VALUE ,
            FRD_NEW_CC AS NEW_CC,
            FRT_TO_PROJ AS ToProject,
            FRD_ENV_WEIGHT AS Weight_Detail,
            FRD_ENV_SIZE AS SIZE_Detail ,
            FRD_PLN_UNITPRICE AS Unit_price,
            FRD_SHP_INVOICE AS Inv_No
            FROM FAM_REQ_DETAIL
            LEFT JOIN FAM_REQ_TRANSFER ON FRD_FAM_NO =FRT_FAM_NO
            WHERE FRD_FAM_NO = '${famno}'
            ORDER BY 2,3
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("getData_Detail_show_VIEW error", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_NewCC_Toproject = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT FRD_NEW_CC AS NEW_CC,
      FRT_TO_PROJ AS NEW_PROJ
      FROM FAM_REQ_DETAIL FRD 
      INNER JOIN FAM_REQ_TRANSFER ON FRT_FAM_NO =FRD_FAM_NO
      WHERE FRD_FAM_NO ='${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("getData_NewCC_Toproject error", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_Routing_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT FAM_MGR_DEPT ,
      FAM_MGR_JUD,
      TO_CHAR(FAM_MGR_DATE, 'DD/MM/YYYY'),
      FAM_MGR_CMMT,
      FAM_SERVICE_DEPT ||' : ' ||FAM_ASSET_CC_NAME,
      FAM_SERVICE_TEL,
      FAM_SERVICE_BY,
      FAM_SERVICE_JUD,
      TO_CHAR(FAM_SERVICE_DATE, 'DD/MM/YYYY'),
      FAM_SERVICE_CMMT,
      FAM_BOI_CHK_BY,FAM_BOI_CHK_JUD,
      TO_CHAR(FAM_BOI_CHK_DATE, 'DD/MM/YYYY'),
      FAM_BOI_CHK_CMMT,
      FAM_BOI_MGR_BY,
      FAM_BOI_MGR_JUD,
      TO_CHAR(FAM_BOI_CHK_DATE, 'DD/MM/YYYY'),
      FAM_BOI_MGR_CMMT,
      FAM_FM_BY,
      FAM_FM_JUD,
      TO_CHAR(FAM_FM_DATE, 'DD/MM/YYYY'),
      FAM_FM_CMMT,
      FAM_ACC_CHK_BY,
      FAM_ACC_CHK_JUD,
      TO_CHAR(FAM_ACC_CHK_DATE, 'DD/MM/YYYY'),
      FAM_ACC_CHK_CMMT,
      FAM_OWNER_SEND_BY,
      FAM_OWNER_SEND_JUD,
      TO_CHAR(FAM_OWNER_SEND_DATE, 'DD/MM/YYYY'),
      FAM_OWNER_SEND_CMMT,
      FAM_ACC_REC_BY,
      FAM_ACC_REC_JUD,
      TO_CHAR(FAM_ACC_REC_DATE, 'DD/MM/YYYY'),
      FAM_ACC_REC_CMMT,
      FAM_ACC_MGR_BY,
      FAM_ACC_MGR_JUD,
      TO_CHAR(FAM_ACC_MGR_DATE, 'DD/MM/YYYY'),
      FAM_ACC_MGR_CMMT,
      FAM_SERVICE_CLOSE_BY,
      FAM_SERVICE_CLOSE_JUD,
      TO_CHAR(FAM_SERVICE_CLOSE_DATE, 'DD/MM/YYYY'),
      FAM_SERVICE_CLOSE_CMMT,
      TO_CHAR(FAM_ACC_CHK_CER_DATE, 'DD/MM/YYYY')
      FROM FAM_REQ_HEADER WHERE FRH_FAM_NO = '${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("getData_Routing_show_VIEW error", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_Transfer_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT F.FRT_FROM_PROJ,
       M.FACTORY_NAME AS FACTORYNAME,
       F.FRT_TO_CC,
       F.FRT_TO_PROJ,
       R.USER_EMP_ID ||' : ' || R.USER_FNAME||' ' || R.USER_SURNAME AS NEW_OWNER,
       F.FRT_RECEIVER_TEL,
       TO_CHAR(F.FRT_PLAN_MOVE_DATE, 'DD/MM/YYYY') AS FRT_PLAN_MOVE_DATE,
       F.FRT_ABNORMAL_REASON,
       F.FRT_RECEIVE_BY AS RECEIVER,
       F.FRT_RECEIVER_JUD,
       TO_CHAR(F.FRT_RECEIVE_DATE, 'DD/MM/YYYY') AS FRT_PLAN_MOVE_DATE,
       FRT_RECEIVE_CMMT
       FROM FAM_REQ_TRANSFER F
       LEFT JOIN CUSR.CU_FACTORY_M M ON  M.FACTORY_CODE  =  F.FRT_TO_FACTORY
       LEFT JOIN CUSR.CU_USER_M R ON R.USER_LOGIN = F.FRT_RECEIVE_BY
       WHERE FRT_FAM_NO = '${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_showName = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
           S.ENAME || '  ' || S.ESURNAME AS NAME_SURNAME 
           FROM FAM_REQ_HEADER T 
           LEFT JOIN CUSR.CU_USER_HUMANTRIX S  ON S.EMPCODE = T.FAM_REQ_OWNER 
           WHERE T.FRH_FAM_NO = '${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("getData_showName error :", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_Transfer_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT F.FRT_FROM_PROJ,
       M.FACTORY_NAME AS FACTORYNAME,
       F.FRT_TO_CC,
       F.FRT_TO_PROJ,
       R.USER_EMP_ID ||' : ' || R.USER_FNAME||' ' || R.USER_SURNAME AS NEW_OWNER,
       F.FRT_RECEIVER_TEL,
       TO_CHAR(F.FRT_PLAN_MOVE_DATE, 'DD/MM/YYYY') AS FRT_PLAN_MOVE_DATE,
       F.FRT_ABNORMAL_REASON,
       F.FRT_RECEIVE_BY AS RECEIVER,
       F.FRT_RECEIVER_JUD,
       TO_CHAR(F.FRT_RECEIVE_DATE, 'DD/MM/YYYY') AS FRT_PLAN_MOVE_DATE,
       FRT_RECEIVE_CMMT
       FROM FAM_REQ_TRANSFER F
       LEFT JOIN CUSR.CU_FACTORY_M M ON  M.FACTORY_CODE  =  F.FRT_TO_FACTORY
       LEFT JOIN CUSR.CU_USER_M R ON R.USER_LOGIN = F.FRT_RECEIVE_BY
       WHERE FRT_FAM_NO = '${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  module.exports.getData_Scrap_show_VIEW = async (req, res) => {
    try {
      const { famno } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT
      FRSC_ENV_BY ,
      FRSC_ENV_DATE,
      FRSC_ENV_CMMT,
      FRSC_PLN_BY,
      FRSC_PLN_DATE,
      FRSC_PLN_CMMT,
      FRSC_SHP_BY,
      FRSC_SHP_DATE,
      FRSC_SHP_CMMT
      FROM FAM_REQ_SCRAP 
      WHERE FRSC_FAM_NO ='${famno}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error getData_Scrap_show_VIEW", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  