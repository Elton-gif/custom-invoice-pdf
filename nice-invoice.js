// Required packages
const fs = require("fs");
const PDFDocument = require("pdfkit");

let niceInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: "A4", margin: 40 });

  header(doc, invoice);
  customerInformation(doc, invoice);
  invoiceTable(doc, invoice);
  footer(doc, invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

let header = (doc, invoice) => {

    if (fs.existsSync(invoice.header.company_logo)) {
      doc.image(invoice.header.company_logo, 50, 45, { width: 50 })
      .fontSize(20)
      .text(invoice.header.company_name, 110, 57)
      .moveDown();
    }else{
      doc.fontSize(20)
      .text(invoice.header.company_name, 50, 45)
      .moveDown();
    }

    if(invoice.header.company_address.length!==0){
      companyAddress(doc, invoice.header.company_address);
    }
    
}

let customerInformation = (doc, invoice)=>{
  doc.fillColor("#444444")
  .fontSize(20)
  .text("Receipt", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

    doc.fontSize(10)
    .text("Receipt Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.order_number, 150, customerInformationTop)
    .font("Helvetica")
    .text("Paid Date:", 50, customerInformationTop + 15)
    .text(invoice.date.Paid_date, 150, customerInformationTop + 15)
    .text("Recorded Date:", 50, customerInformationTop + 30)
    .text(invoice.date.Recorded_date, 150, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.admissionnumber, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.grade +
        ", " +
        invoice.shipping.term +
        ", " +
        invoice.shipping.stampDate,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

let invoiceTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 330;
  const currencySymbol = invoice.currency_symbol;

  doc.font("Helvetica-Bold");
  tableRow(
    doc,
    invoiceTableTop,
    "Description",
    "Reference",
    "Amount(KSh)",
    "Means",
    "Total",
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    tableRow(
      doc,
      position,
      item.description,
      item.reference,
      formatCurrency(item.amount, currencySymbol),
      item.means,
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  doc.font("Helvetica-Bold");
  totalTable(
    doc,
    subtotalPosition,
    "Prev Bal (Ksh)",
    formatCurrency(invoice.subtotal, currencySymbol)
  );

  const paidToDatePosition = subtotalPosition + 20;
  doc.font("Helvetica-Bold");
  totalTable(
    doc,
    paidToDatePosition,
    "New Bal (Ksh)",
    formatCurrency(invoice.total, currencySymbol)
  );
}

let footer = (doc, invoice) => {
  if(invoice.footer.text.length!==0){
    doc.fontSize(10).text(invoice.footer.text, 50, 780, { align: "center", width: 500 });
  } 
}

let totalTable = (
  doc,
  y,
  name,
  description
)=>{
    doc.fontSize(10)
    .text(name, 400, y,{ width: 90, align: "right" })
    .text(description, 0, y, { align: "right" })
}

let tableRow = (
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
)=>{
    doc.fontSize(10)
    .text(item, 50, y)
    .text(description, 130, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 405, y, { width: 90, align: "right" })
    .text(lineTotal, 40, y,{ width: 90, align: "right" })
}

let generateHr = (doc, y) => {
    doc.strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

let formatCurrency = (cents, symbol) => {
  console.log(cents,symbol)
  return symbol + cents;
}

let getNumber =  str =>  { 
  if(str.length!==0){
    var num = str.replace(/[^0-9]/g, ''); 
  }else{
    var num = 0;
  }
  
  return num; 
}

let checkIfTaxAvailable = tax => {
  let validatedTax = getNumber(tax);
  if(Number.isNaN(validatedTax) === false && validatedTax <= 100 && validatedTax > 0){
    var taxValue = tax;  
  }else{
    var taxValue = '---';
  }
  
  return taxValue;
}

let applyTaxIfAvailable = (amount, quantity, tax) => {
  
  let validatedTax = getNumber(tax);
  if(Number.isNaN(validatedTax) === false && validatedTax <= 100){
    let taxValue = '.'+validatedTax;
    var itemamount = (amount * quantity) * (1 + taxValue);  
  }else{
    var itemamount = (amount * quantity) * (1 + taxValue);
  }
  
  return itemamount;
}

let companyAddress = (doc, address) => {
  let str = address;
  let chunks = str.match(/.{0,25}(\s|$)/g);
  let first = 50;
  chunks.forEach(function (i,x) {
    doc.fontSize(10).text(chunks[x], 200, first, { align: "right" });
    first = +first +  15;
  });
}

module.exports = {niceInvoice};
