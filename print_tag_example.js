// print_tag_example.js
const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const template = fs.readFileSync(
  path.join(__dirname, 'jewellery_tag_template.zpl'),
  'utf8'
);

function buildLabel(product) {
  return template
    .replace(/{{LEFT_1}}/g, product.left1 || '')
    .replace(/{{LEFT_2}}/g, product.left2 || '')
    .replace(/{{LEFT_3}}/g, product.left3 || '')
    .replace(/{{LEFT_4}}/g, product.left4 || '')
    .replace(/{{PRICE}}/g, product.price || '')
    .replace(/{{COMPANY_NAME}}/g, product.companyName || '')
    .replace(/{{NET_WEIGHT}}/g, product.netWeight || '')
    .replace(/{{DIAMOND_WEIGHT}}/g, product.diamondWeight || '')
    .replace(/{{GOLD_KARAT}}/g, product.goldKarat || '')
    .replace(/{{BARCODE_VALUE}}/g, product.barcodeValue || '');
}

function printTagMac(product, printerName) {
  const zpl = buildLabel(product);
  const tempFile = path.join(os.tmpdir(), `label_${Date.now()}.zpl`);

  fs.writeFileSync(tempFile, zpl, 'utf8');

  // -o raw passes direct ZPL to thermal printers without macOS rasterizing it
  const cmd = `lp -d "${printerName}" -o raw "${tempFile}"`;

  exec(cmd, (err, stdout, stderr) => {
    fs.unlink(tempFile, () => {});

    if (err) {
      console.error('Print failed:', stderr || err.message);
      return;
    }

    console.log('Label sent to printer successfully.');
    if (stdout) console.log(stdout.trim());
  });
}

// Example Trigger
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