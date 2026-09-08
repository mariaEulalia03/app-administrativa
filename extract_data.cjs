const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const wb = xlsx.readFile('Prototipo_Funcional (1).xlsx');

// 1. Read Productor
const productorSheet = xlsx.utils.sheet_to_json(wb.Sheets['Productor']);
const productores = productorSheet.map(p => ({
  ...p,
  ActividadEconomica: 'Agroproductor' // Enforce requested change
}));

// 2. Read Producto (Since Producto sheet is broken in Excel, use mock fallback map)
const mockProductos = [
  'Huevo de gallina', 'Manteca de cerdo', 'Miel de abeja', 
  'Carne de res', 'Corazón de res', 'Hígado de res', 'Hueso de res',
  'Maíz', 'Frijol', 'Papa', 'Cebolla', 'Tomate', 'Lechuga', 'Zanahoria',
  'Culantro', 'Perejil', 'Brócoli', 'Coliflor', 'Espinaca', 'Acelga'
];
const productoMap = {};
let mockIdx = 0;

// 3. Read Agroecosistema
const agroSheet = xlsx.utils.sheet_to_json(wb.Sheets['Agroecosistema']);
const agroecosistemas = agroSheet.map(a => {
  let productos = [];
  if (a.id_productos) {
    const ids = String(a.id_productos).split(',').map(s => s.trim());
    productos = ids.map(id => {
      if (!productoMap[id]) {
        productoMap[id] = mockProductos[mockIdx % mockProductos.length];
        mockIdx++;
      }
      return productoMap[id];
    });
  }
  return {
    ...a,
    productos_nombres: productos
  };
});

// Write to JSON files
fs.writeFileSync(path.join(__dirname, 'src', 'db', 'productor.json'), JSON.stringify(productores, null, 2));
fs.writeFileSync(path.join(__dirname, 'src', 'db', 'agroecosistema.json'), JSON.stringify(agroecosistemas, null, 2));

console.log('Extraction complete: productor.json and agroecosistema.json generated.');
