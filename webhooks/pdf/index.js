const pdfMakePrinter = require('pdfmake/src/printer');

async function generatePdf(docDefinition, callback) {
  const fonts = {
    Roboto: {
      normal: './fonts/Lato-Regular.ttf',
      bold: './fonts/Lato-Medium.ttf',
      italics: './fonts/Lato-Italic.ttf',
      bolditalics: './fonts/Lato-MediumItalic.ttf'
    }
  };
  const printer = new pdfMakePrinter(fonts);
  const doc = printer.createPdfKitDocument(docDefinition);

  let chunks = [];
  let result;

  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  await doc.on('end', () => {
    result = Buffer.concat(chunks);
    callback('data:application/pdf;base64,' + result.toString('base64'));
  });
  doc.end();
};

module.exports = generatePdf;

