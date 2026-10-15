const { execSync } = require('child_process');
const http = require('http');

// Simple test script to verify CIE-11 database items and search function
const { buscarCIE11, CIE11_DATABASE, CIE11_CAPITULOS } = require('../lib/cie11Data.ts');

console.log('Total CIE-11 items in database:', CIE11_DATABASE.length);
console.log('Total CIE-11 chapters:', CIE11_CAPITULOS.length);

const testSearch1 = buscarCIE11('asma');
console.log('Search "asma":', testSearch1.map(i => `[${i.codigo}] ${i.titulo}`));

const testSearch2 = buscarCIE11('hipertension');
console.log('Search "hipertension":', testSearch2.map(i => `[${i.codigo}] ${i.titulo}`));

const testSearch3 = buscarCIE11('CA40');
console.log('Search "CA40":', testSearch3.map(i => `[${i.codigo}] ${i.titulo}`));
