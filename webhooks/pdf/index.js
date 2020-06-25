const pdfMakePrinter = require('pdfmake/src/printer');

function generatePdf(docDefinition, callback) {
  try {
    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    };
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      callback(Buffer.concat(chunks));
    });
    doc.end();

  } catch(err) {
    throw(err);
  }
};

const docDefinition = {
  content: ['This will show up in the file created']
};

const createPdfLabels = (ctx, next) => {
  //const docDefinition = webhook.payload
  
  console.log('\n------ post:/pdf ------');
  var dd = '';
  ctx.req.on('data', function (chunk) {
    dd += chunk;
  })
  ctx.req.on('end', function (chunk) {
    ctx.res.statusCode = 200;
    ctx.set('Content-Type', 'application/json');
    ctx.body = {message: 'hello', received: JSON.stringify(dd)};
  })
  ctx.req.end();

  //generatePdf(docDefinition, (response) => {
  //  res.setHeader('Content-Type', 'application/pdf');
  //  res.send(response); // Buffer data
  //});
};

module.exports = createPdfLabels;

