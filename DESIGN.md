# Orbit — padrão IoT

Referência: `bratuga/iot-vmc-controler`, main `754e3b0`, observado em 10-11-2026. [Demonstração](orbit.html). O laboratório usa dados simulados e não controla equipamentos.

## Estrutura

- Barra lateral de 142–148 px no computador; navegação inferior com colunas flexíveis abaixo de 760 px. Sem a linha decorativa curva. Cabeçalho curto, nome do dispositivo e rodapé discreto com versão/data.
- Painel, sensores, gráficos/histórico e comandos separados da configuração administrativa. O acesso real depende do firmware; esta demonstração não implementa autenticação.
- Configuração: Técnico, Diagnóstico, Hardware, KNX e Configurações. Formulários em duas colunas, empilhados no telemóvel. Agrupar por função; não repetir navegação.
- Preservar a composição dos cartões operacionais, coletores e termóstatos. A identidade de cada firmware mantém-se nas suas cores. Ilustrações da VMC, bypass e filtros são específicas desse equipamento, não capacidades a atribuir aos outros.

## Tokens e componentes

`orbit-controls.css` e `orbit-controls.js` são a referência reutilizável para tema e botão circular. `orbit-actions.css` mantém o interruptor operacional e o botão de atualização com SVG. Não existem dependências externas.

Tokens: `--orbit-bg`, `--orbit-panel`, `--orbit-raised`, `--orbit-line`, `--orbit-ink`, `--orbit-muted`, `--orbit-accent`, `--orange`, `--red`. Usar superfícies discretas, bordas finas, cartões de 16–18 px e campos de 9–12 px de raio. A cor de destaque pertence ao projeto: verde na referência VMC/sensores; azul no LusoSol atual.

### Tema

Botão com lua/sol, `role="switch"`, `aria-checked` e foco visível. O tema claro é o estado checked. A preferência fica no armazenamento local do navegador por projeto e é partilhada entre painel e configuração da mesma origem. Sem armazenamento disponível, o botão continua funcional. Não envia comandos ao equipamento.

### Botão circular

- Pressionar durante 1,5 s, por ponteiro ou Espaço/Enter. Clique curto não envia comandos. Soltar, arrastar para fora, perder foco, ocultar a página ou Escape cancelam.
- Anel com progresso durante a pressão e pedido pendente. Um pedido em curso não pode ser repetido. Não assumir sucesso pela aparência do botão.
- Normal: anel em movimento lento, CPU e memória. Desligado: símbolo de alimentação e anel neutro. Aviso: âmbar e texto; falha: vermelho e texto; sem ligação: — e comando indisponível.
- Respeitar `prefers-reduced-motion`. Os estados têm nomes acessíveis; não dependem apenas da cor. No telemóvel, preservar o botão e o tema na navegação inferior.
- `createOrbitPower(sendPower)` recebe estados por `update(state,busy)`. Campos: `powerEnabled`, `level`, `label`, `canToggle`, `cpuUsePct`, `cpuMHz`, `heapUsePct`. Um estado desconhecido deve ser `null`, nunca um falso OFF.
- `sendPower` pede a alteração e lê novamente o estado. Resolver `true` significa pedido aceite; só uma leitura confirmada muda o estado. Falhas mantêm o último estado confirmado e apresentam aviso.
- A ação pertence ao firmware. Para LusoSol e sensores, o proprietário pediu parar **todas as saídas**, incluindo relés independentes, e recuperar o estado anterior ao ligar. Rede e leitura de sensores continuam. Não contornar proteções, sequências de paragem nem feedback KNX. OFF deve persistir após reinício/falha de energia até novo comando Ligar. A interface distingue paragem pedida, confirmação pendente e saídas confirmadas OFF; não confundir o bloqueio geral com alimentação física do ESP.

### Métricas

CPU significa percentagem de utilização apenas quando os contadores reais estão disponíveis. Nos perfis Arduino ESP32 2.0.17 atuais, os contadores FreeRTOS não estão ativados: mostrar frequência em **MHz**, com indicação acessível de que a utilização está indisponível. Não inferir percentagens pela frequência ou inventar zero. Memória é a percentagem usada do heap interno de 8 bits, não toda a RAM física. Leitura desconhecida: —.

## Padrões observados na VMC

- Interruptor com estado confirmado e ação Atualizar separada; comando aceite não equivale a feedback físico.
- Temperaturas com uma casa decimal e unidade; percentagens e potência com unidade junto ao valor. Fonte/idade/indisponibilidade acompanham leituras quando relevantes.
- Histórico com seleção 24 h/7 dias; não ligar séries através de dados inválidos. Exportação e ferramentas específicas só onde suportadas.
- Painel NTP: servidor principal, alternativo, fuso e três estados resumidos. Sincronização apresenta pendente, confirmação ou falha; relógio previamente válido não comprova nova resposta NTP. Não sincronizar um rascunho por guardar.
- Rede, backup/restauro e atualização no Técnico; logs e versão em Diagnóstico; hardware/pinos no Hardware; teste da ligação e telegramas no KNX. Evitar títulos explicativos longos.
- Capacidades reais: não apresentar RTC, microSD, KNX, filtros, bypass ou funções de meteorologia como disponíveis por copiar o desenho.

## Validação

Testar tema e persistência, teclado, pressão curta/longa/cancelada, pedido único, recusa e estado sem ligação. Rever pelo menos computador e 360–390 px, os dois temas, navegação, formulários e ausência de sobreposição. A demonstração não constitui ensaio elétrico ou de atuação física.
