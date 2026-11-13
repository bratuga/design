# Orbit

Sistema visual para interfaces locais, equipamentos e aplicações. Componentes Web, exemplos de displays e instruções de integração, sem frameworks, fontes remotas ou dependências em execução.

**[Referência Web](index.html) · [Displays](displays.html) · [Integrar noutro produto](docs/INTEGRATION.md) · [Especificação](DESIGN.md)**

Os exemplos usam dados simulados, não controlam equipamentos e não implementam autenticação. As regras de acesso e os comandos pertencem à aplicação que integra o design.

## Executar

Servir a raiz por HTTP:

```sh
python -m http.server 8870 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8870/`. Os seletores Perfil/Estado pertencem à demonstração; não são menus para instalar nos firmwares.

## Estrutura

| Recursos | Finalidade |
|---|---|
| `orbit.css` | Paleta, estrutura responsiva, navegação, formulários, indicadores e tabelas |
| `orbit-controls.css`, `orbit-controls.js` | Tema e comando circular com estado confirmado |
| `orbit-actions.css` | Interruptor e ação Atualizar; herdam a paleta ativa |
| `index.html`, `examples/web-demo.js` | Referência interativa Web |
| `displays.html`, `examples/display-demo.js` | OLED, e-paper, TFT compacto e touch |
| `docs/` | Integração, adaptação e limites |
| `test/`, `.github/workflows/orbit.yml` | Testes dos componentes e exemplos |

`orbit.html` e `iot.html` são redirecionamentos de compatibilidade. `sw.js` apenas retira o antigo cache do testbench; não instala cache offline no Orbit. As experiências ModernUX e os protótipos anteriores foram retirados do conteúdo atual; o histórico Git conserva-os.

## Reutilizar

1. Identificar capacidades reais e escolher componentes, sem copiar a demonstração inteira.
2. Fixar um commit do Design e copiar os recursos necessários para a aplicação.
3. Adaptar o shell à volta dos cartões operacionais existentes.
4. Ligar componentes a dados/comandos reais através de um adaptador. Não distribuir os simuladores como lógica de controlo.
5. Validar os dois temas, navegação, teclado, ecrã pequeno e estados de falha.

Orbit pode servir automação, instrumentação, painéis de serviços e outros firmwares. KNX, NTP, RTC, microSD, comando geral e métricas são capacidades opcionais. Seguir o [guia de integração](docs/INTEGRATION.md) e o [guia de displays](docs/DISPLAYS.md).

## Testar

Dependências apenas de desenvolvimento:

```sh
npm install --prefix .test-deps --no-save --ignore-scripts jsdom@26.1.0
NODE_PATH="$PWD/.test-deps/node_modules" node test/orbit-controls.cjs
NODE_PATH="$PWD/.test-deps/node_modules" node test/reference.cjs
```

Em PowerShell, definir `$env:NODE_PATH` para a pasta `node_modules` antes de executar os comandos Node. Os testes Web não substituem ensaios físicos.

Referência visual: princípios de hierarquia e densidade da análise Linear da biblioteca Awesome DESIGN.md, adaptados ao Orbit verde e aos dois temas. Não é uma reprodução do produto Linear.
