# Orbit em displays

Funcionalidade e leitura têm prioridade sobre o aspeto. Os exemplos em [displays.html](../displays.html) são desenhos no navegador; não são drivers ou firmware pronto a instalar.

| Tipo | Prioridade | Evitar |
|---|---|---|
| OLED 128×32/64 | Valor principal, unidade, estado essencial | Cards Web reduzidos, depender de cor |
| E-paper | Composição estável e idade da leitura | Animação e atualização contínua |
| TFT pequeno | Valores grandes e fundo semântico | Cabeçalho/rodapé que retiram área útil |
| Touch | Alvos grandes e confirmação junto do comando | Botões pequenos e gestos sem alternativa |

## StamPLC

- Canvas lógico 240×135, cor própria por sensor, temperatura/humidade em destaque.
- A curto percorre páginas; A durante 3 s alterna configuração/normal.
- B/C alteram Modo, Setpoint, Bypass e percentagens. Alterar percentagem em Auto seleciona Manual. Conservar rampas, níveis e proteções.
- Auto mantém o horário Noite; Noite é uma indicação desse estado, não um modo novo.
- Preservar Estado, Modo, Setpoint, Bypass, Ar novo, Insuflação, Extração, Rejeição, percentagens e temperatura interna/tensão.
- Dados inválidos nunca se convertem em zero aparentemente válido. Manter alarmes e feedback.

Não copiar os valores, incrementos ou limites do simulador para o firmware. São exemplos de apresentação; as regras existentes do controlador prevalecem.

## Hardware

Usar o driver, pinos, orientação, brilho e barramentos já validados. No StamPLC existente, o brilho usa `M5StamPLC.setBacklight`; uma chamada genérica pode interferir com o barramento. Uma fotografia de OLED não determina os pinos.

Se a alteração visual não puder ser validada sem arriscar funções existentes, manter o display atual e registar a diferença. Não ativar um display por semelhança entre placas.

## Verificação

Na resolução nativa, verificar todas as páginas, textos longos, valores extremos, indisponibilidade e alarmes. Ensaiar pressões curtas/longas, cancelamento e transições de modo. Confirmar memória, tempo de redesenho e ausência de interferência com o controlo. A compilação não substitui o ensaio físico.
