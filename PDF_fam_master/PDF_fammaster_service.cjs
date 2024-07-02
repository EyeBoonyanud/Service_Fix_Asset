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

console.log(AVO,"-------------------- connect secess --------------------")

// getData_Hearder_show_PDF
module.exports.getData_Hearder_show_PDF = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const{FamNo}=  req.body;
      const query = `
      SELECT F.FRH_FAM_NO AS FAMNO ,
      C.USER_FNAME||'  ' ||C.USER_SURNAME AS REQ_NAME_AND_SUR,
      S.USER_FNAME||'  ' ||S.USER_SURNAME AS OWNER_NAME_AND_SUR,
      F.FAM_REQ_DEPT  AS USER_DEPT,
      F.FAM_REQ_TEL AS TEL_REQ,
      F.FAM_REQ_OWNER_TEL AS TEL_OWN,
      FA.FACTORY_NAME AS FAC,
      F.FAM_REQ_OWNER_CC AS CC_OWN,
      F.FAM_REQ_TYPE AS TYPE_REQ,
      F.FAM_REQ_REMARK AS REMASK,
      TO_CHAR(T.FRT_PLAN_MOVE_DATE, 'DD/MM/YYYY') AS PLANDATE,
      T.FRT_RECEIVE_BY AS REC_PLAN,
      T.FRT_TO_CC AS FRT_CC,
      TO_CHAR(T.FRT_RECEIVE_DATE , 'DD/MM/YYYY') AS REC_DATE,
      F.FAM_MGR_DEPT AS MANAGER,
      F.FAM_MGR_DATE AS DATE_MANAGER,
      F.FAM_BOI_MGR_BY AS BOI ,
      F.FAM_BOI_MGR_DATE AS DATE_BOI,
      F.FAM_FM_BY AS FM_BY,
      TO_CHAR(F.FAM_FM_DATE , 'DD/MM/YYYY') AS DATE_FM,
      F.FAM_ACC_MGR_BY AS ACC_BY,
      TO_CHAR(F.FAM_ACC_MGR_DATE,'DD/MM/YYYY') AS DATE_ACC,
      F.FAM_OWNER_SEND_BY AS OWN_SEND_BY,
      TO_CHAR(F.FAM_OWNER_SEND_DATE,'DD/MM/YYYY') AS OWN_SEND_DATE,
      T.FRT_RECEIVE_BY AS REC_BY,
      TO_CHAR(T.FRT_RECEIVE_DATE,'DD/MM/YYYY') AS DATE_REC,
      F.FAM_SERVICE_BY AS SERVICE_BY,
      F.FAM_SERVICE_DATE AS DATE_SERVICE,
      TO_CHAR(FRSC_SCRAP_DATE,'DD/MM/YYYY')  AS DATE_SCRAP,
      FRSL_PLN4_BY AS SALE_CHECK ,
      TO_CHAR(FRSL_PLN4_DATE,'DD/MM/YYYY') AS SUBMIT_DATE_SALE,
      F.FAM_ACC_REC_BY AS SCRAP_CHECK,
      TO_CHAR(F.FAM_ACC_REC_DATE,'DD/MM/YYYY')  AS SUMBIT_DATE_SCRAP
      
      FROM FAM_REQ_HEADER F
      LEFT JOIN CUSR.CU_USER_M C ON C.USER_LOGIN = F.FAM_REQ_BY
      LEFT JOIN CUSR.CU_USER_M S ON S.USER_EMP_ID  =F.FAM_REQ_OWNER
      LEFT JOIN FAM_REQ_TRANSFER T ON T.FRT_FAM_NO =F.FRH_FAM_NO
      LEFT JOIN CUSR.CU_MFGPRO_CC_MSTR M ON M.CC_CTR =F.FAM_REQ_DEPT
      LEFT JOIN CUSR.CU_FACTORY_M FA ON FA.FACTORY_CODE  =F.FAM_FACTORY
      LEFT JOIN FAM_REQ_SCRAP ON FRSC_FAM_NO =F.FRH_FAM_NO
      LEFT JOIN FAM_REQ_SALES frs ON FRSL_FAM_NO =  F.FRH_FAM_NO
      WHERE F.FRH_FAM_NO = '${FamNo}' `;
      const result = await connect.execute(query);
    connect.release();
    const rows = result.rows;
    res.json(rows);
    } catch (error) {
      console.error("Error fetching department data:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  //getData_Loop_show_Detail

  module.exports.getData_Loop_show_Detail = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const{FamNo}=  req.body;
      const query = `
      SELECT
      D.FRD_ASSET_CODE ,
      D.FRD_COMP ,
      D.FRD_OWNER_CC ,
      D.FRD_ASSET_NAME ,
      D.FRD_BOI_PROJ ,
      D.FRD_QTY ,
      D.FRD_INV_NO ,
      D.FRD_ACQ_COST ,
      D.FRD_BOOK_VALUE ,
      D.FRD_NEW_CC
      FROM FAM_REQ_DETAIL D
      WHERE D.FRD_FAM_NO = '${FamNo}'
      ORDER BY D.FRD_ASSET_CODE ,D.FRD_COMP ASC
    `;
    const result = await connect.execute(query);
    connect.release();
    const rows = result.rows;
    res.json(rows);
    } catch (error) {
      console.error("Error fetching department data:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };

//   module.exports.getData_Loop_show_Detail = async function (req, res) {
//     try {
//       const connection = await oracledb.getConnection(QAD);
//       const result = await connection.execute(`
//       SELECT KM.KFA_CODE,
//       KD.KFAD_COMP,
//       KD.KFAD_CC,
//       KD.KFAD_COMP_NAME,
//       CD.CODE_CMMT,
//       KD.KFAD_QTY,
//       KFD.KFIN_DOC_NO,
//       KD.KFAD_ACQ_COST,
//       KD.KFAD_SVG_VAL
//  FROM KFA_MSTR KM, KFAD_DET KD, KFIN_DET KFD, CODE_MSTR CD
// WHERE (KM.KFA_CODE = KD.KFAD_CODE)
//   AND (KM.KFA_DOMAIN = KD.KFAD_DOMAIN)
//   AND (KD.KFAD_CODE = KFD.KFIN_FA_CODE)
//   AND (KFD.KFIN_DOMAIN = KD.KFAD_DOMAIN)
//   AND (KM.KFA_OBLG = CD.CODE_VALUE)
//   AND (KM.KFA_DOMAIN = CD.CODE_DOMAIN)
//   AND (KD.KFAD_COMP = KFD.KFIN_INFO_SEQ)
//   AND ((SUBSTR(KM.KFA_CODE,1,1) = 'C')
//   --AND ((KM.KFA_CODE = :FixAssetCode) 
//  AND KD.KFAD_CC = 'R400'
//       AND (upper(CD.CODE_FLDNAME) = 'KFA_OBLG') AND (KD.KFAD_BOOK = 'SL') AND
//       (UPPER(KM.KFA_DOMAIN) = '9000') AND (KD.KFAD_SEQ = '0')
//       AND KM.KFA_CODE BETWEEN 'CU01-10000189' AND 'CU02-CUR-NA200900008')
// ORDER BY KM.KFA_CODE, KD.KFAD_COMP
//     `);
//     connection.release();
//     const rows = result.rows;
//     res.json(rows);
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       res.status(500).json({ error: "An error occurred" });
//     }
//   };
  
  // getData_show_number_left
  module.exports.getData_show_number_left = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT T.FCM_DESC
      FROM FAM_CODE_MASTER T
      WHERE T.FCM_STATUS = 'A' 
      AND T.FCM_GROUP_ID = 'GP04'
    `;
    const result = await connect.execute(query);
    connect.release();
    const rows = result.rows;
    res.json(rows);
    } catch (error) {
      console.error("Error fetching department data:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
  // getData_show_number_right
  module.exports.getData_show_number_right = async function (req, res) {

    try {
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT T.FCM_DESC
      FROM FAM_CODE_MASTER T 
      WHERE T.FCM_STATUS = 'A' 
      AND T.FCM_GROUP_ID = 'GP03'
    `;
    const result = await connect.execute(query);
    connect.release();
    const rows = result.rows;
    res.json(rows);
    } catch (error) {
      console.error("Error fetching department data:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };

  module.exports.SumCost = async function (req, res) {
    try {
      const connect = await oracledb.getConnection(AVO);
      const{FamNo}=  req.body;
      const query = `
  SELECT
  SUM(D.FRD_ACQ_COST) SUMASS_COST,
  SUM(D.FRD_BOOK_VALUE) AS SUMBOOK
  FROM FAM_REQ_DETAIL D
  WHERE D.FRD_FAM_NO = '${FamNo}'
  `;
  const result = await connect.execute(query);
  connect.release();
      const rows = result.rows;
      res.json(rows);
    } catch (error) {
      console.error("Error fetching Material_Trace:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  };

    // getSum_Data_total
    module.exports.getSum_Data_total = async function (req, res) {
      try {
        const connect = await oracledb.getConnection(AVO);
        const{FamNo}=  req.body;
        const query = `
        SELECT
        SUM(ROUND(D.FRD_ACQ_COST, 2)) AS Total_FRD_ACQ_COST,
        SUM(ROUND(D.FRD_BOOK_VALUE, 2)) AS Total_FRD_BOOK_VALUE
        FROM FAM_REQ_DETAIL D
        WHERE D.FRD_FAM_NO = '${FamNo}'
      `;
      const result = await connect.execute(query);
      connect.release();
      const rows = result.rows;
      res.json(rows);
      } catch (error) {
        console.error("Error fetching department data:", error);
        res.status(500).json({ error: "An error occurred" });
      }
    };