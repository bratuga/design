# Orbit — especificação 2026.11

Interface legível e coerente, com navegação simples, comando circular e estados explícitos. A funcionalidade prevalece sobre a uniformidade visual.

## Estrutura e escala

- Computador: barra lateral, comando circular quando suportado e tema. Sem curva decorativa.
- Até 760 px: no máximo quatro destinos na barra inferior; comando circular de pelo menos 76 px e tema no topo. Respeitar a área segura do ecrã.
- Destinos comuns: Painel, Sensores, Histórico e Configuração, apenas quando forem vistas distintas. Ajuda e estado público continuam acessíveis fora da administração.
- Administração: Técnico, Diagnóstico, Hardware, KNX e Configurações; omitir capacidades inexistentes e conservar opções particulares.
- Cabeçalho curto e versão/data discretas no rodapé. Preservar a composição dos cartões VMC, aquecimento, termóstatos e energia.
- Fonte do sistema; corpo 14 px, secções 16 px, título 26–28 px. Espaçamento 4/8/12/16/24/32 px; raios 8 px em controlos e 12 px em painéis. Alvos de toque de pelo menos 44 px.
- Conter deslocação horizontal em tabelas/gráficos/separadores, sem transbordo da página inteira.

## Tokens

| Token | Escuro | Claro |
|---|---|---|
| `--orbit-bg` | `#0b1119` | `#f1f5f3` |
| `--orbit-panel` | `#111b27` | `#ffffff` |
| `--orbit-raised` | `#182532` | `#eaf1ed` |
| `--orbit-line` | `#293a49` | `#cedbd4` |
| `--orbit-ink` | `#e9f0f7` | `#192f28` |
| `--orbit-muted` | `#a1b2c2` | `#536b60` |
| `--orbit-accent` | `#61d5b0` | `#18755f` |

Âmbar indica aviso; vermelho indica falha. Cores de sensores/circuitos conservam o significado original. Texto acompanha a cor. Componentes herdam tokens; não substituir cores localmente por valores fixos de outro tema.

## Tema e acessibilidade

`initOrbitTheme(key)` liga `#orbitTheme`, com `role="switch"`, nome «Tema claro» e `aria-checked`. Tema claro corresponde a `body.light`. A chave é partilhada entre páginas da mesma aplicação. Falha de armazenamento não impede mudar de tema.

Foco visível, navegação por teclado, `aria-current` na página atual e Escape nos diálogos. Diálogos devolvem foco à origem. Respeitar movimento reduzido. Mensagens de recusa e confirmação permanecem visíveis no telemóvel.

## Comando circular

- Apenas onde exista uma ação geral real. No Moxa, monitorização não equivale a desligar o Linux.
- Pressão de 1,5 s por ponteiro ou Espaço/Enter; clique curto não comanda. Soltar antes, sair da área, perder foco, ocultar a página ou Escape cancelam.
- Pedido aceite não confirma as saídas. Mostrar espera, confirmação e falha; conservar o último estado conhecido se falhar. Estado desconhecido é `null`, nunca um falso OFF.
- `createOrbitPower(sendPower).update(state,busy)` recebe `powerEnabled`, `level`, `label`, `canToggle`, `cpuUsePct`, `cpuMHz`, `heapUsePct` e `showCpu`.
- `showCpu:false` omite CPU também do nome acessível; perfil LusoSol. MHz não é percentagem de utilização. Explicar qual a memória efetivamente medida.
- Proteções, sequência de relés, persistência de OFF e significado de Ligar/Desligar pertencem ao firmware, não à animação.

## Dados e formulários

Valores ausentes aparecem como —; dados antigos mantêm idade/estado explícitos. Diferenciar estado pretendido, comunicado e confirmado. Histórico, período e tabela usam os mesmos dados; não desenhar linhas através de amostras inválidas.

Rótulos persistentes, ajuda curta e validação junto dos campos. Distinguir Guardar, Aplicar e reiniciar e Sincronizar; conservar a semântica do produto. Preservar rascunhos entre secções e avisar antes de os perder.

NTP: servidor principal, alternativo, fuso e estados reais. Sincronização usa configuração guardada; relógio previamente válido não confirma nova resposta. Atualização: equipamento, versão atual e ficheiro proposto; a validação de compatibilidade tem de ocorrer no dispositivo.

## Limites

O Design não fornece autenticação, autorização, KNX, validação de firmware nem drivers. Trocar CSS não deve mudar estas políticas. Na casa, o padrão de acesso distingue consulta/comandos locais de administração protegida; divergências do firmware exigem resolução e validação explícitas.

Displays seguem [regras próprias](docs/DISPLAYS.md). Não mudar pinos, barramentos, modos, atalhos ou proteções para obter o aspeto do exemplo.
