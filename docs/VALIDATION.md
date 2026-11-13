# Validação da referência Orbit

Revisão de 13 de novembro de 2026. Os exemplos são locais e usam dados simulados.

- Testes Node: pressão/cancelamento/teclado, estados indisponível/ocupado/recusa, métricas e tema; navegação, rascunhos, capacidades e histórico.
- Navegador Chromium: configuração em 320, 390 e 1440 px, temas claro e escuro, sem transbordo global; navegação entre áreas conserva campos alterados.
- Sincronização desativada enquanto há alterações por guardar; Descartar repõe os valores; resultado de sincronização identificado como simulado.
- Tema reposicionado relativamente à barra de controlo em ecrãs estreitos, sem depender da altura do cabeçalho de demonstração.
- Displays: desenho inicial de OLED, e-paper e TFT; avanço com A e entrada/saída da configuração mantendo A durante três segundos.
- Migração do antigo service worker observada: após atualização e recarregamento, a referência Orbit substitui o testbench antigo.

Não valida APIs de produção, autenticação, eletrónica, comunicações ou atuação em equipamentos. Cada integração deve executar os seus testes e ensaios físicos.
