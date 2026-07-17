# PLAN-farmacia-bot: Protótipo de Bot de Atendimento para Farmácias

Este plano descreve a reformulação do projeto **AtendClinical** para criar um protótipo de chatbot de atendimento de farmácia (Assistente Virtual Sofia), simulando o fluxo de atendimento localmente no frontend (com opção de integrar com n8n/webhook).

## 📋 Visão Geral
O objetivo é transformar o frontend atual de agendamento clínico em uma simulação interativa de atendimento de farmácia pelo WhatsApp. A assistente **Sofia** guiará o cliente na consulta de medicamentos, cálculo de dosagem/quantidade para o tratamento, envio de receitas e fechamento de pedidos de delivery, tudo simulado localmente para testes rápidos, mas com arquitetura pronta para conexão com n8n.

---

## 🏗️ Tipo de Projeto
- **Tipo de Projeto:** WEB
- **Agente Principal:** `frontend-specialist` (Skills: `clean-code`, `frontend-design`)

---

## 🏆 Critérios de Sucesso
1. **Interface Temática de Farmácia:** Cores, títulos, avatares e informações adaptados para uma farmácia moderna (tons verdes/médicos, ícones de saúde e medicamentos).
2. **Banco de Dados de Medicamentos Local:** Base simulada com itens de diferentes tarjas (MIP, Tarja Vermelha, Antibióticos, Tarja Preta) para validar as regras de receita.
3. **Calculadora de Posologia Automatizada:** Motor que entende gotas, comprimidos e dias de tratamento, indicando a quantidade de caixas/frascos necessários.
4. **Fluxo Completo de Delivery:** Executar a sequência exata de checkout (Itens → "Mais alguma coisa?" → Endereço → Pagamento → Confirmação Final).
5. **Restrições Regulatórias Simuladas:** Bloqueio de delivery para Tarja Preta e Roacutan, e alerta para coleta de receita em antibióticos.
6. **Modo Híbrido (Simulação / Webhook):** Variável no código que permite alternar entre simulação local instantânea e chamadas reais para o webhook n8n.

---

## 💻 Tech Stack
- **Frontend:** HTML5, Vanilla CSS3 (paleta verde/menta de saúde), Vanilla JavaScript (ES6+).
- **Sem Dependências Pesadas:** Todo o motor de regras e simulação de IA roda localmente no navegador via JavaScript.

---

## 📂 Estrutura de Arquivos

```
atendimento_project/
├── frontend/
│   ├── index.html      # Estrutura do chat, cabeçalho da Farmácia e sidebar atualizados
│   ├── style.css       # Estilização com tema de saúde/farmácia (verde/menta/branco)
│   ├── app.js          # Motor do chatbot Sofia (Banco local, Calculadora, State Machine)
│   └── assets/         # Avatares e recursos (novos ícones/SVGs de farmácia)
└── docs/
    ├── prompt farmacia.md  # Instruções originais da assistente Sofia
    └── PLAN-farmacia-bot.md # Este arquivo de planejamento
```

---

## 🛠️ Cronograma de Tarefas (Task Breakdown)

### 📌 Fase 1: Identidade Visual & UI (Tema de Farmácia)
- [x] **Task 1.1: Adaptação Visual do HTML**
  - **Agente:** `frontend-specialist` (Skill: `frontend-design`)
  - **Ação:** Atualizar `index.html` substituindo títulos ("Clínica Geral"), nomes ("Alice") e descrições para "Farmácia" e "Sofia". Criar e aplicar SVGs genéricos de farmácia (cruz verde, pílula, etc.) em substituição ao avatar da clínica.
  - **INPUT:** `frontend/index.html`
  - **OUTPUT:** `frontend/index.html` atualizado com o tema de farmácia.
  - **VERIFY:** Abrir o arquivo no navegador e verificar se todos os textos e ícones refletem uma farmácia.

- [x] **Task 1.2: Ajuste da Paleta de Cores CSS**
  - **Agente:** `frontend-specialist` (Skill: `frontend-design`)
  - **Ação:** Modificar `style.css` alterando as variáveis de cores de verde escuro/azul clínica para tons modernos de verde médico (ex: HSL 150-165, mint/emerald) e ajustar o design para ficar limpo e convidativo.
  - **INPUT:** `frontend/style.css`
  - **OUTPUT:** `frontend/style.css` atualizado com novas variáveis de cor.
  - **VERIFY:** Checar o contraste visual e visualização geral do layout.

---

### 📌 Fase 2: Banco de Dados de Medicamentos & Lógica Base
- [x] **Task 2.1: Estruturação do Banco Local de Medicamentos**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Inserir em `app.js` uma lista estruturada de medicamentos (JSON) cobrindo todas as classificações do prompt:
    - *MIPs:* Dipirona Gotas (R$ 12,90), Buscopan Composto (R$ 18,50), Tylenol (R$ 15,00), Neosoro (R$ 8,90)
    - *Tarja Vermelha (Receita Simples):* Omeprazol 20mg (R$ 22,00), Losartana 50mg (R$ 14,90), Allegra 120mg (R$ 34,90)
    - *Antibióticos (Receita Retida):* Amoxicilina 500mg (R$ 28,00), Azitromicina 500mg (R$ 24,50)
    - *Tarja Preta (Retida - Sem Delivery):* Rivotril 2mg (R$ 19,90), Ritalina 10mg (R$ 45,00)
    - *Caso Especial:* Roacutan 20mg (R$ 150,00)
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Banco de medicamentos declarado no escopo de `app.js`.
  - **VERIFY:** Verificar se todos os itens estão mapeados com `nome`, `preco`, `categoria`, `precisaReceita` e `permiteDelivery`.

- [x] **Task 2.2: Implementação da Calculadora de Tratamento**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Desenvolver a função auxiliar `calcularQuantidadeNecessaria(medicamento, posologia, dias)` que analisa a dose diária e calcula quantas caixas/frascos são necessários (arredondando para cima), seguindo as regras do prompt (1ml = 20 gotas, etc.).
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Função de cálculo implementada e testada.
  - **VERIFY:** Testar casos como "Amoxicilina 1 comprimido de 8 em 8 horas por 7 dias" resultando em 1 caixa de 21 unidades.

---

### 📌 Fase 3: Motor de Diálogo da Sofia (Simulador de Chat)
- [x] **Task 3.1: Máquina de Estados de Diálogo (Simulação Local)**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Implementar em `app.js` uma máquina de estados conversacional que guie o cliente:
    - *Estado 0: Saudação / Menu Inicial*
    - *Estado 1: Seleção de Medicamentos (pesquisa e subtotal)*
    - *Estado 2: Pergunta Obrigatória "Mais alguma coisa?"*
    - *Estado 3: Coleta de Endereço*
    - *Estado 4: Coleta de Forma de Pagamento*
    - *Estado 5: Confirmação do Pedido (Envio do card detalhado)*
    - *Estado 6: Finalização do Pedido (Envio da mensagem de sucesso)*
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Lógica de estados conversacionais implementada sob a flag `SIMULATION_MODE = true`.
  - **VERIFY:** Simular um fluxo de pedido completo e validar se todos os estados transitam corretamente.

- [x] **Task 3.2: Tratamento de Cenários Especiais e Restrições**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Programar as validações para medicamentos controlados (bloquear delivery se for tarja preta/Roacutan e indicar compra presencial) e antibióticos (alertar sobre a necessidade de entregar a receita física de 2 vias ao entregador).
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Regras de bloqueio e avisos implementadas.
  - **VERIFY:** Tentar adicionar Rivotril ao carrinho e verificar se a mensagem de bloqueio de delivery é acionada. Tentar adicionar Amoxicilina e ver se o alerta de receita é exibido.

---

### 📌 Fase 4: Integração Híbrida & Polimento
- [x] **Task 4.1: Chave de Configuração da Simulação**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Adicionar no topo de `app.js` uma configuração clara `const CONFIG = { simulationMode: true, ... }` para que, se definida como `false`, o chat volte a se comunicar normalmente com a Evolution API / n8n através de chamadas HTTP `POST`.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Configuração de chave híbrida no código.
  - **VERIFY:** Mudar a flag para `false` e certificar-se de que o sistema tenta chamar o endpoint configurado.

---

## 🔍 Plano de Verificação (Fase X)

Após completar as implementações, as seguintes verificações devem ser executadas:

### 1. Verificações Automáticas
- Executar linting e validação se aplicável:
  ```bash
  python .agent/scripts/verify_all.py .
  ```
- Executar scan de segurança para garantir que nenhuma chave real foi exposta:
  ```bash
  python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
  ```

### 2. Testes de Fluxo Manual (Critérios de Aceitação)
- **Fluxo 1 (MIP):** Solicitar "Dipirona gotas", receber preço de R$ 12,90, recusar mais itens, passar endereço fictício, selecionar "Pix", e receber o card de confirmação final correto.
- **Fluxo 2 (Antibiótico):** Solicitar "Amoxicilina", receber o preço, responder "só isso", ver o alerta de receita retida de duas vias, passar endereço e concluir o pedido.
- **Fluxo 3 (Tarja Preta):** Solicitar "Rivotril" ou "Ritalina", e receber a recusa de delivery (orientando a compra presencial).
- **Fluxo 4 (Cálculo de Dose):** Enviar "Ibuprofeno gotas, 10 gotas de 8 em 8 horas por 5 dias" e verificar se o bot calcula corretamente a necessidade de 1 frasco de 20ml.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-07-14
