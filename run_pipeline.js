/**
 * run_pipeline.js
 * 
 * Pipeline mestre de automação de dados:
 * 1. Executa o scraper autônomo (scraper_easy_automated.js)
 * 2. Processa o JSON gerado e atualiza a base de dados (process_drogasil_scrap.js)
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🔄 INICIANDO PIPELINE COMPLETO DE ATUALIZAÇÃO DA BASE');
console.log('====================================================\n');

try {
  // Passo 1: Raspagem
  console.log('➡️ PASSO 1: Executando Scraper Autônomo...');
  execSync('node scraper_easy_automated.js', { stdio: 'inherit', cwd: __dirname });

  // Passo 2: Processamento e Merge
  console.log('\n➡️ PASSO 2: Processando raspagem e atualizando base de medicamentos...');
  execSync('node process_drogasil_scrap.js', { stdio: 'inherit', cwd: __dirname });

  console.log('\n====================================================');
  console.log('✅ PIPELINE FINALIZADO COM SUCESSO!');
  console.log('====================================================');
} catch (error) {
  console.error('\n❌ ERRO DURANTE A EXECUÇÃO DO PIPELINE:', error.message);
  process.exit(1);
}
