
const express = require("express");
const oracledb = require("oracledb");
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const nodemailer = require(
  'nodemailer'
  );
const bodyParser = require('body-parser'); 
const multer = require("multer");
const upload = multer();
const app = express();
const port = 5000;
app.use(express.json());
const Login =require("./Login/Login.cjs")
const Transaction =require("./Transaction/Transection.cjs")
const ReportSystem=require("./report/Report_system.cjs")
const VIEW_Fammaster =require("./Monitoring/Monitorind.cjs")
const PDF_Fammaster =require("./PDF_fam_master/PDF_fammaster_service.cjs")
const Homepage =require('./Server/Homepage.cjs')
const Mail =require("./Mail/Mail.cjs")
oracledb.initOracleClient({
  // tnsAdmin: "D:\\app\\Administrator\\product\\11.2.0\\client_1\\network\\admin",
tnsAdmin: process.env.TNS_ADMIN,
});


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());
app.use(express.json({ type: 'text/html' }));
// app.get("/Login", Login.login);
app.post("/Login", Login.login);
app.get("/getmenu", Login.menu);
app.get("/getmainmenu",Login.mainmenu);
app.get("/gethome_page",Transaction.gethome_page);
app.post("/getsubmenu",Login.submenu);
app.get("/getemp",Transaction.emp);
app.get("/getfactory",Transaction.factory);
app.post("/getdept",Transaction.dept);
app.get("/getcost",Transaction.cost);
app.get("/gettype",Transaction.type);
app.post("/findsts",Transaction.findsts);
app.post("/getby",Transaction.by);
app.post("/getstatus",Transaction.status);
app.post("/getsearch",Transaction.search);
app.post("/getsearch2",Transaction.search2);
app.post("/getfixcode",Transaction.fixcode);
app.post("/getfac_insert",Transaction.fac_insert);
app.post("/getcost_insert",Transaction.cost_insert);
app.post("/getfix_group",Transaction.fix_group);
app.post("/getid_service",Transaction.id_service);
app.post("/getfind_service",Transaction.find_service);
//
app.post("/find_fix_groub",Transaction.find_fix_groub);
///
app.post("/getfamno",Transaction.fam_no);
app.post("/get_gen_famno",Transaction.insert_tranfer);
app.post("/create_date",Transaction.create_date);
app.post("/update_date",Transaction.update_date);
app.post("/get_asset_transfer",Transaction.insert_asset_transfer);
app.post("/ins_REQ_DETAIL",Transaction.insert_FAM_REQ_DETAIL);
app.post("/ins_from_Boi",Transaction.ins_from_Boi);
// app.get("/select_BOI_from",Transaction.select_BOI_from);
app.post("/select_BOI_from",Transaction.select_BOI_from);
app.post("/new_owner",Transaction.new_owner);
app.get("/cc_for_transfer",Transaction.cc);
app.post("/level",Transaction.level_mana);
app.post("/service_by",Transaction.service_by);
app.post("/boi_staff",Transaction.boi_staff);
app.post("/boi_manager",Transaction.boi_manager);
app.post("/fac_manager",Transaction.fac_manager);
app.post("/acc_check",Transaction.acc_check);
app.post("/acc_manager",Transaction.acc_manager);
app.post("/ins_transfer",Transaction.ins_transfer);
app.post("/routing_tran",Transaction.routing_tran);
app.post("/receiver_tranfer",Transaction.receiver_tranfer);
app.get("/header",Transaction.header);
app.post("/close_routing_tran",Transaction.close_routing_tran);
app.post("/update_submit",Transaction.update_submit);
app.post("/Id_owner",Transaction.Id_owner);
app.post("/fix_code_find",Transaction.fix_code_find);
app.post("/get_COMP",Transaction.get_COMP);
app.post("/update_new_cc",Transaction.update_new_cc);
app.post("/update_for_date_trans",Transaction.update_for_date_trans);
app.post("/searchFamMaster",Transaction.searchFamMaster);
app.post("/namefile",Transaction.namefile);
app.post("/find_asset_fixdata",Transaction.find_asset_fixdata);
//Donation 
app.post("/date_certificate",Transaction.date_certificate);
app.post("/getEditdate_certaficate",Transaction.getEditdate_certaficate);

//Lending
app.post("/insert_leading",Transaction.insert_leading)
app.post("/getEdit_lenging",Transaction.getEdit_lenging);
app.post("/update_lending",Transaction.update_lending);
app.post("/update_leading_acc_return",Transaction.update_leading_acc_return);
app.post("/update_leading_own_return",Transaction.update_leading_own_return);
app.post("/update_for_nullLending",Transaction.update_for_nullLending);
//Scrap 
app.post("/pte_env_data",Transaction.pte_env_data);
app.post("/pln_staff_data",Transaction.pln_staff_data);
app.post("/shipping_data",Transaction.shipping_data);
app.post("/insert_scrap",Transaction.insert_scrap);
app.post("/update_scrap",Transaction.update_scrap);
app.post("/getEdit_scrap",Transaction.getEdit_scrap);
app.post("/update_scrap_pte",Transaction.update_scrap_pte);
app.post("/update_scrap_pln",Transaction.update_scrap_pln);
app.post("/update_scrap_shipping",Transaction.update_scrap_shipping);
// app.post("/update_scrap_shipping",Transaction.update_scrap_shipping);
app.post("/get_weights",Transaction.get_weights);
app.post("/get_size",Transaction.get_size);
app.post("/get_unitprice",Transaction.get_unitprice);
app.post("/get_inv_no",Transaction.get_inv_no);
app.post("/update_for_nullScarp",Transaction.update_for_nullScarp);
//sale
app.post("/import_boi",Transaction.import_boi);
app.post("/update_sale",Transaction.update_sale);
app.post("/insert_sale",Transaction.insert_sale);
app.post("/getEdit_sale",Transaction.getEdit_sale);
app.post("/update_for_nullSale",Transaction.update_for_nullSale);

app.post("/update_sale_ws",Transaction.update_sale_ws);
app.post("/update_sale_pln_staff_boi",Transaction.update_sale_pln_staff_boi);
app.post("/update_import_boi_prepare",Transaction.update_import_boi_prepare);
app.post("/update_boi_input_data",Transaction.update_boi_input_data);
app.post("/update_thai_catergorise",Transaction.update_thai_catergorise);
app.post("/update_pln_bidding",Transaction.update_pln_bidding);
app.post("/update_pte_contact_dept",Transaction.update_pte_contact_dept);
app.post("/update_boi_make_clearance",Transaction.update_boi_make_clearance);
app.post("/update_pte_upload_file_clearance",Transaction.update_pte_upload_file_clearance);
app.post("/update_pln_request_invoice",Transaction.update_pln_request_invoice);
app.post("/update_shipping_inv",Transaction.update_shipping_inv);
app.post("/update_pln_upload_final",Transaction.update_pln_upload_final);






app.post("/insert_weight",Transaction.insert_weight);
app.post("/insert_size",Transaction.insert_size);
app.post("/insert_unit_price",Transaction.insert_unit_price);
app.post("/insert_invoice",Transaction.insert_invoice);



//MAY 
app.post("/ins_FILE_FROM_REQUEST", Transaction.insertFile_from_request); 
app.post("/get_seq_request", Transaction.get_run_seq_request);
app.post("/get_run_owner_file", Transaction.get_run_owner_file);
app.post("/get_run_owner_file_return", Transaction.get_run_owner_file_return);
app.post("/get_run_owner_file_pte", Transaction.get_run_owner_file_pte);
app.post("/get_run_owner_file_pln", Transaction.get_run_owner_file_pln);
app.post("/get_run_owner_file_shipping", Transaction.get_run_owner_file_shipping);

app.post("/ins_FILE_FROM_REQUEST_TO_PROJECT_ME", Transaction.insertFile_from_request_to_project_me);
//
app.post("/new_boi",Transaction.new_boi);
//
app.post("/getEdit_request_show",Transaction.getEdit_Request_Show);
app.post("/getEdit_FixAsset",Transaction.getEdit_FixAsset);
app.get("/getEdit_FileUpload",Transaction.getEdit_FileUpload);
app.post("/getEdit_Trans",Transaction.getEdit_Trans);
app.post("/getEdit_routing",Transaction.getEdit_routing);
app.post("/Update_For_Req_All",Transaction.Update_For_Req_All);
app.post("/Update_For_Trans_All",Transaction.Update_For_Trans_All);

app.post("/delete_FAM_REQ_DETAIL",Transaction.delete_FAM_REQ_DETAIL);
app.post("/getFixcode",Transaction.getFixcode);
//delete all
app.post("/delect_all_fam_header",Transaction.delect_all_fam_header);
app.post("/delect_all_fam_details",Transaction.delect_all_fam_details);
app.post("/delect_all_fam_transfer",Transaction.delect_all_fam_transfer);
app.post("/delete_all_file",Transaction.delete_all_file);
// For File Delete 1 to 1
app.post("/deletefile",Transaction.deletefile);

// Update For Radio 
app.post("/update_manager_dept",Transaction.update_manager_dept);
app.post("/update_service_by",Transaction.update_service_by);
app.post("/update_boi_staff",Transaction.update_boi_staff);
app.post("/update_boi_mana",Transaction.update_boi_mana);
app.post("/update_facmanager",Transaction.update_facmanager);
app.post("/update_acccheck",Transaction.update_acccheck);
app.post("/update_owner",Transaction.update_owner);
app.post("/update_recode",Transaction.update_recode);
app.post("/update_accmanager",Transaction.update_accmanager);
app.post("/update_service_close",Transaction.update_service_close);
app.post("/update_receiver",Transaction.update_receiver);
// Update All Routing (For Reject)
app.post("/update_for_nullRouting_All",Transaction.update_for_nullRouting_All);
app.post("/update_All_for_receive",Transaction.update_All_for_receive);
// Person and BOI
app.post("/getData_UserLogin_Person",Transaction.getData_UserLogin_Person);
app.post("/Search_Person_Maintain",Transaction.search_person_maintain);
app.post("/Search_Person_Maintain_Edit",Transaction.getEdit_Person_Show);
app.get("/get_BOI_project",Transaction.get_BOI_project);
app.post("/search_BOI_project",Transaction.search_BOI_project);
app.post("/Search_BOI_Maintain_Edit",Transaction.getEdit_BOI_Show);
app.get("/getlevel",Transaction.level_person_maintain);
app.get("/get_BOI_project_name",Transaction.get_BOI_project_name);

// app.post("/getCountTransfer",Transaction.getCountTransfer);
// app.post("/getCountLoss",Transaction.getCountLoss);
// app.post("/getCountTransferlistaLL",Transaction.getCountTransferlistaLL);
// app.get("/getCountTransferlistaLLname",Transaction.getCountTransferlistaLLname);

// Homepage 
app.post("/getCountTransfer",Homepage.getCountTransfer);
app.post("/getCountScrap",Homepage.getCountScrap);
app.post("/getCountSale",Homepage.getCountSale);
app.post("/getCountLoss",Homepage.getCountLoss);
app.post("/getCountWrite_off",Homepage.getCountWrite_off);
app.post("/getCountLending",Homepage.getCountLending);
app.post("/getCountDonation",Homepage.getCountDonation);
app.post("/getCountTransferlistaLL",Homepage.getCountTransferlistaLL);
app.get("/getCountTransferlistaLLname",Homepage.getCountTransferlistaLLname);
app.post("/getCountLosslistaLL",Homepage.getCountLosslistaLL);
app.get("/getCountLosslistaLLname",Homepage.getCountLosslistaLLname);
app.post("/getCountWrite_offlistaLL",Homepage.getCountWrite_offlistaLL);
app.get("/getCountWrite_offlistaLLname",Homepage.getCountWrite_offlistaLLname);
app.post("/getCountLendinglistaLL",Homepage.getCountLendinglistaLL);
app.get("/getCountLendinglistaLLname",Homepage.getCountLendinglistaLLname);
app.post("/getCountDonationlistaLL",Homepage.getCountDonationlistaLL);
app.get("/getCountScraplistaLLname",Homepage.getCountScraplistaLLname);
app.post("/getCountScraplistaLL",Homepage.getCountScraplistaLL);
app.get("/getCountSalelistaLLname",Homepage.getCountSalelistaLLname);
app.post("/getCountSalelistaLL",Homepage.getCountSalelistaLL);




app.post("/ins_PERSON_MAINTAIN",Transaction.insertPerson_Maintain);
app.post("/update_PERSON_MAINTAIN",Transaction.updatePerson_Maintain);
app.post("/dlt_PERSON_MAINTAIN",Transaction.deletePerson_Maintain);
app.post("/ins_BOI_MAINTAIN",Transaction.insertBOI_Maintain);
app.post("/update_BOI_MAINTAIN",Transaction.updateBOI_Maintain);
app.post("/dlt_BOI_MAINTAIN",Transaction.deleteBOI_Maintain);

//Report 
app.post("/FamDetailReport",ReportSystem.getFamDetailReport)
app.post("/RequstType",ReportSystem.getRequstType)
app.post("/FAM_FILE_ATTACH",ReportSystem.getFAM_FILE_ATTACH)
//Donation 
app.post("/getFAM_FILE_DATA",ReportSystem.getFAM_FILE_DATA)
// //Lending
// app.post("/getFAM_FILE_Req_Return",ReportSystem.getFAM_FILE_Req_Return)
// //Scrap
// app.post("/getFAM_FILE_PTE_ENV",ReportSystem.getFAM_FILE_PTE_ENV)
// app.post("/getFAM_FILE_PLN_Staff",ReportSystem.getFAM_FILE_PLN_Staff)
// app.post("/getFAM_FILE_Shipping",ReportSystem.getFAM_FILE_Shipping)
// app.post("/getWeight_Size_Unit_INV",ReportSystem.getWeight_Size_Unit_INV)
// //Sale
// app.post("/getFAM_FILE_ENV1_SALE",ReportSystem.getFAM_FILE_ENV1_SALE)
// app.post("/getFAM_FILE_PLN1_SALE",ReportSystem.getFAM_FILE_PLN1_SALE)
// app.post("/getFAM_FILE_IMP1_SALE",ReportSystem.getFAM_FILE_IMP1_SALE)
// app.post("/getFAM_FILE_BOI1_SALE",ReportSystem.getFAM_FILE_BOI1_SALE)
// app.post("/getFAM_FILE_IMP2_SALE",ReportSystem.getFAM_FILE_IMP2_SALE)
// app.post("/getFAM_FILE_PLN2_SALE",ReportSystem.getFAM_FILE_PLN2_SALE)
// app.post("/getFAM_FILE_ENV2_SALE",ReportSystem.getFAM_FILE_ENV2_SALE)
// app.post("/getFAM_FILE_BOI2_SALE",ReportSystem.getFAM_FILE_BOI2_SALE)
// app.post("/getFAM_FILE_ENV3_SALE",ReportSystem.getFAM_FILE_ENV3_SALE)
// app.post("/getFAM_FILE_PLN3_SALE",ReportSystem.getFAM_FILE_PLN3_SALE)
// app.post("/getFAM_FILE_SHP_CHECK",ReportSystem.getFAM_FILE_SHP_CHECK)
// app.post("/getFAM_FILE_PLN4_SALE",ReportSystem.getFAM_FILE_PLN4_SALE)

// PDF Fammaster
// app.post("/getData_Hearder_show_PDF",PDF_Fammaster.getData_Hearder_show_PDF);
// app.post("/getData_Loop_show_Detail",PDF_Fammaster.getData_Loop_show_Detail);
// app.post("/getData_show_number_left",PDF_Fammaster.getData_show_number_left);
// app.post("/getData_show_number_right",PDF_Fammaster.getData_show_number_right);
// app.post("/SumCost",PDF_Fammaster.SumCost);
// app.post("/getSum_Data_total",PDF_Fammaster.getSum_Data_total);
// VIEW Fammaster หลังแก้
app.post("/getData_Hearder_show_VIEW",VIEW_Fammaster.getData_Hearder_show_VIEW);
app.post("/getData_Detail_show_VIEW",VIEW_Fammaster.getData_Detail_show_VIEW);
app.post("/getData_Routing_show_VIEW",VIEW_Fammaster.getData_Routing_show_VIEW);
app.post("/getData_Transfer_show_VIEW",VIEW_Fammaster.getData_Transfer_show_VIEW);
app.post("/getData_showName",VIEW_Fammaster.getData_showName);
app.post("/getData_NewCC_Toproject",VIEW_Fammaster.getData_NewCC_Toproject);
app.post("/getData_Scrap_show_VIEW",VIEW_Fammaster.getData_Scrap_show_VIEW);


app.post("/getData_Hearder_show_PDF",PDF_Fammaster.getData_Hearder_show_PDF);
app.post("/getData_Loop_show_Detail",PDF_Fammaster.getData_Loop_show_Detail);
app.post("/getData_show_number_left",PDF_Fammaster.getData_show_number_left);
app.post("/getData_show_number_right",PDF_Fammaster.getData_show_number_right);
app.post("/SumCost",PDF_Fammaster.SumCost);
app.post("/getSum_Data_total",PDF_Fammaster.getSum_Data_total);

//Mail
// app.post("/sendEmail",Mail.sendEmail)
app.post("/getMailshow",Mail.getMailshow);
app.post("/getType_mail",Mail.getType_mail);
// app.post("/getFile_Mail",Mail.getFile_Mail);
app.post("/getName_To",Mail.getName_To);
app.post("/getStatus_Mail",Mail.getStatus_Mail);
app.post("/get_req_mail",Mail.get_req_mail);


// const transporter = nodemailer.createTransport({
//   service: '',
//   auth: {
//     user: 'boonyanuch.phan@gmail.com',
//     pass: 'vecw nlzo xown vscs',
//   },
// });
// const transporter = nodemailer.createTransport({
//   host: 'boonyanud.p@th.fujikura.com',
//   secure: false, // ถ้าไม่ใช้ SSL/TLS
// });
const smtpConfig = {
  host: '10.17.220.200', // แทนที่ด้วยที่อยู่ IP ของเซิร์ฟเวอร์ SMTP
  port: 25, // แทนที่ด้วยพอร์ตของเซิร์ฟเวอร์ SMTP
  secure: false, // กำหนดเป็น true หากต้องการใช้ SSL/TLS
  auth: {
    user: 'FAMsystem@th.fujikura.com', // แทนที่ด้วยที่อยู่อีเมลของคุณ
    pass: '' // แทนที่ด้วยรหัสผ่านอีเมลของคุณ
  }
};

const transporter = nodemailer.createTransport(smtpConfig);


app.post("/sendEmail", async (req, res) => {
  try {

    const mailOptions = {
      from: "FAMsystem@th.fujikura.com",
      to: req.body.toEmail,
      subject: req.body.subject,
      html: req.body.emailMessage
    };
 
    console.log("Email Sended",req.body.toEmail,req.body.subject);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email $$$$$$ :", error);
    res.status(500).json({ error: "An error occurred while sending email" });
  }
});
//app.use('/downloads', express.static('/data/Api/Component/uploads/'));
app.use('/downloads', express.static(__dirname));
//getFAM_FILE_ATTACH
app.get('/downloads', (req, res) => {
  const fileName = req.query.filename;
  const filePath = path.join(__dirname, '../Uploads', fileName);
  console.log(filePath)
  // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  if (fs.existsSync(filePath)) {
    // ส่งไฟล์กลับไปยังผู้ใช้
    res.sendFile(filePath);
    console.log(filePath)
    // res.sendFile(filePath);
  } else {
    // ถ้าไม่พบไฟล์, ส่งข้อความแจ้งเตือน
    res.status(404).send('File not found');
  }
});
app.delete('/deleteFile', (req, res) => {

  const fileName = req.query.data; 
  const filePath = path.join(__dirname, '../Uploads', fileName);
  fs.unlink(filePath, (err) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error deleting file');
          return;
      }
      res.status(200).send('File deleted successfully');
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
