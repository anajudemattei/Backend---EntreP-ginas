const { execSync } = require('child_process');

/**
 * Utilitário para liberar uma porta no Windows
 * Execute com: node killPort.js NUMERO_DA_PORTA
 */
const killProcessOnPort = (port) => {
  try {
    // Encontra o PID (Process ID) que está usando a porta
    const findPIDCommand = `netstat -ano | findstr :${port}`;
    const result = execSync(findPIDCommand, { encoding: 'utf8' });
    
    // Extrai o PID do resultado
    const lines = result.split('\n');
    if (lines.length > 0) {
      const pidPattern = /\s+(\d+)$/;
      for (const line of lines) {
        const match = line.match(pidPattern);
        if (match && match[1]) {
          const pid = match[1];
          console.log(`Processo encontrado na porta ${port}: PID ${pid}`);
          
          // Mata o processo
          console.log(`Tentando encerrar o processo ${pid}...`);
          execSync(`taskkill /F /PID ${pid}`);
          console.log(`✅ Processo ${pid} encerrado com sucesso!`);
          return true;
        }
      }
    }
    console.log(`Nenhum processo encontrado usando a porta ${port}`);
    return false;
  } catch (error) {
    console.error(`❌ Erro ao tentar liberar a porta ${port}:`, error.message);
    return false;
  }
};

// Obtém a porta da linha de comando
const port = process.argv[2];
if (!port) {
  console.log('⚠️ Por favor, especifique uma porta como argumento.');
  console.log('Exemplo: node killPort.js 4002');
} else {
  killProcessOnPort(port);
}
