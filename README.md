# ModernUX-UI Device Testbench

Laboratório visual e responsivo do ModernUX-UI.

## Objetivo

Esta página existe apenas para testar o design system em vários dispositivos e resoluções:
- HD
- Full HD
- 4K
- iPhone
- Samsung Galaxy S23
- tablets
- browser desktop

Não é uma aplicação de produção.

## Inclui

- Dashboard e mosaicos
- Gráficos
- Tabelas
- Formulários e configuração
- Processo com validação de dados
- Dark mode
- Densidade compact / comfortable / spacious
- Menu lateral compacto com botão circular e expansão em leque
- Modo Web e modo App
- Dados fictícios locais
- Sem dependências externas

## Executar

Servir a pasta por HTTP, por exemplo com Python:

    python -m http.server 8080

Abrir http://localhost:8080


## IoT Lab

Abrir `iot.html` para testar OLED 128×64, e-paper, TFT 320×240 e touch 480×320, com telemetria e controlos simulados.

## Controlos Orbit reutilizáveis

`orbit-actions.css` contém o interruptor com estado visível e o botão Atualizar
com ícone SVG. Há uma demonstração em `iot.html`. O interruptor usa um botão
com `role="switch"` e `aria-checked`, atualizado após a confirmação do
equipamento em aplicações reais. O botão Atualizar executa a leitura pedida
sem alterar o estado do interruptor. Cada projeto pode ajustar as cores pelos
tokens de tema.
