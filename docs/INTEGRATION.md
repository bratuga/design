# Integrar Orbit

## Escolher componentes

O design pode ser servido por um ESP32, uma aplicação Linux ou integrado num frontend existente. Copiar `orbit.css` para o shell e acrescentar `orbit-controls.css`/`orbit-controls.js` para tema e círculo, ou `orbit-actions.css` para interruptores. Todos os recursos funcionam localmente, sem CDN.

Fixar um commit do Design e registar adaptações. A CSS completa define uma página: num produto existente, restringir seletores ao shell Orbit e conservar os estilos dos cartões particulares. `examples/*` é apenas demonstração; não é lógica de produção.

## Ligar a dados reais

```js
initOrbitTheme('meu-produto-orbit-theme');
const power = createOrbitPower(async enabled => {
  const accepted = await adapter.requestPower(enabled);
  if (!accepted) return false;
  power.update(await adapter.readConfirmedState());
  return true;
});
adapter.onState(state => power.update(state));
adapter.onDisconnect(() => power.update(null));
```

`adapter` é ilustrativo, não uma API fornecida. Usar as APIs e proteções reais do produto. Não inventar um endpoint de alimentação num equipamento sem essa capacidade. Tratar timeout, recusa e perda de ligação; não copiar o pedido para o estado confirmado.

O comando requer `id="railPower"`. O tema requer `id="orbitTheme"`, `role="switch"`, `aria-label="Tema claro"` e `aria-checked="false"`. O exemplo suporta um comando geral por página.

Estrutura mínima para os estilos dos controlos; carregar as folhas de estilo antes do script:

```html
<div class="orbit-rail">
  <button id="railPower" type="button" aria-label="Comando geral"
          aria-disabled="true">—</button>
</div>
<button id="orbitTheme" class="orbit-theme" type="button" role="switch"
        aria-checked="false" aria-label="Tema claro">
  <span class="orbit-theme-track" aria-hidden="true"><span>☾</span><span>☀</span></span>
</button>
```

Os seletores do controlo pressupõem o botão como filho direto de `.orbit-rail`.
Usar os tokens `--orbit-bg`, `--orbit-panel`, `--orbit-text`, `--orbit-muted`,
`--orbit-line` e `--orbit-accent` de `orbit.css` para novos componentes.

```js
power.update({
  powerEnabled: true, // boolean confirmado; desconhecido: null
  canToggle: true,    // false durante bloqueio/proteção
  level: 'ok',       // ok | warning | critical
  label: '',         // texto de aviso/falha
  showCpu: false,    // omitir CPU sem métrica apropriada
  heapUsePct: 39     // percentagem real ou null
});
```

## Adaptar capacidades

Sem armazenamento, não inventar Histórico. Sem KNX, omitir o separador. Sem RTC, identificar relógio de software. Num gateway Linux, rede/NTP podem ser apenas consultados e mantidos fora do painel. Não mostrar zero quando falta uma leitura nem inferir utilização de CPU a partir da frequência.

Técnico reúne rede/hora, backup/restauro, auditoria e atualização. Diagnóstico reúne logs, versão e estado. Hardware contém módulos/pinos existentes. Configurações conserva opções particulares. Esta organização não autoriza operações novas ou administração pública.

## Firmwares e aplicações

Em ESP32, servir por filesystem ou incorporar em flash conforme o projeto; não introduzir Node no dispositivo. Conservar IDs/handlers dos cartões existentes. Medir flash, heap e tempo de carregamento. Credenciais, paragem, configurações e proteções continuam na persistência/controlador.

OTA deve validar produto/modelo/partição no dispositivo. O nome do ficheiro e a verificação no navegador não chegam. Não copiar credenciais para exemplos públicos de integração.

Em Linux/Web, servir recursos junto da aplicação, mantendo acesso e cache existentes. A navegação conserva endereços, Voltar e ligações diretas. Partilhar a chave de tema entre páginas da mesma aplicação.

Não instalar service worker por defeito. O anterior foi retirado do Design; quem já publicou uma versão antiga na mesma origem deve remover o seu registo/cache de forma limitada àquela aplicação. Se o produto precisar de funcionamento offline, versionar e testar a atualização de recursos.

## Validação

- Compilação, testes e tamanho de imagem quando relevante.
- Computador e 360–390 px; dois temas, sem sobreposição de barras.
- Teclado, foco, Escape, Voltar/Avançar e ligações diretas.
- Pedido aceite/rejeitado, espera, timeout, sem ligação e dados antigos.
- Rascunhos preservados; diferenciação entre Guardar e reiniciar.
- Autenticação, CSRF, OTA e persistência continuam nos caminhos reais.
- Display na resolução nativa, sem retirar páginas, alarmes ou atalhos.
- Ensaio físico separado antes de distribuir firmware.

## Migrar da referência anterior

Retirar resets locais de cores que contrariem o tema. Mover o círculo/tema para cima apenas no telemóvel. Conservar cartões. `orbit.html` e `iot.html` redirecionam para as referências atuais; ModernUX e propostas antigas permanecem no histórico Git.
