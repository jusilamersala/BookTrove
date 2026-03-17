const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, filePath) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // 1. Header i Dyqanit
  doc.fillColor('#444444').fontSize(20).text('BookTrove Store', 50, 50);
  doc.fontSize(10).text('Faturë Zyrtare', 50, 80);
  doc.text(`Nr. Porosisë: ${order._id}`, 50, 95);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 50, 110);
  doc.moveDown();

  // 2. Tabela me produkte
  const tableTop = 170;
  doc.font('Helvetica-Bold');
  doc.text('Libri', 50, tableTop);
  doc.text('Sasia', 300, tableTop);
  doc.text('Çmimi', 400, tableTop);
  doc.text('Totali', 500, tableTop);
  
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  doc.font('Helvetica');

  let i = 0;
  order.items.forEach((item) => {
    const y = tableTop + 30 + (i * 25);
    doc.text(item.titulli, 50, y);
    doc.text(item.sasia.toString(), 300, y);
    doc.text(`${item.cmimi}€`, 400, y);
    doc.text(`${(item.sasia * item.cmimi).toFixed(2)}€`, 500, y);
    i++;
  });

  // 3. Totali Përfundimtar
  const totalY = tableTop + 30 + (i * 25) + 20;
  doc.moveTo(50, totalY).lineTo(550, totalY).stroke();
  doc.fontSize(15).font('Helvetica-Bold').text(`TOTALI: ${order.total.toFixed(2)}€`, 400, totalY + 20);

  doc.end();
  doc.pipe(fs.createWriteStream(filePath));
};

module.exports = { generateInvoice };