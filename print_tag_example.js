// print_tag_example.js
// For USB-connected printers on macOS (uses the CUPS "lp" command).

const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Load the ZPL template from the same folder as this script.
const template = fs.readFileSync(
  path.join(__dirname, 'jewellery_tag_template.zpl'),
  'utf8'
);

function buildLabel(product) {
  return template
    .replace('{{LEFT_1}}', product.left1)
    .replace('{{LEFT_2}}', product.left2)
    .replace('{{LEFT_3}}', product.left3)
    .replace('{{LEFT_4}}', product.left4)
    .replace('{{PRICE}}', product.price)
    .replace('{{COMPANY_NAME}}', product.companyName)
    .replace('{{NET_WEIGHT}}', product.netWeight)
    .replace('{{DIAMOND_WEIGHT}}', product.diamondWeight)
    .replace('{{GOLD_KARAT}}', product.goldKarat)
    .replace(/{{BARCODE_VALUE}}/g, product.barcodeValue);
}

// printerName must exactly match the name shown by: lpstat -p
function printTagMac(product, printerName) {
  const zpl = buildLabel(product);
  const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.zpl`);

  fs.writeFileSync(tempFile, zpl, 'utf8');

  // -o raw sends ZPL directly to the printer without converting it to text.
  const cmd = `lp -d "${printerName}" -o raw "${tempFile}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlink(tempFile, () => {});

    if (err) {
      console.error('Print failed:', stderr || err.message);
      return;
    }

    console.log('Label sent to printer.');
    if (stdout) console.log(stdout.trim());
  });
}

// Example product data.
printTagMac(
  {
    left1: 'ER0141',
    left2: 'AED 41,500',
    left3: 'D-3.0',
    left4: 'G-7.72',
    price: 'AED 42,500',
    companyName: 'PC0141',
    netWeight: '8.2',
    diamondWeight: '1.55',
    goldKarat: '22K',
    barcodeValue: '4587120033',
  },
  process.env.PRINTER_NAME || 'Zebra_Technologies_ZTC_ZD220_203dpi_ZPL'
);
