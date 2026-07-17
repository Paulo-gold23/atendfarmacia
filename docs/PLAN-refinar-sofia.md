# PLAN-refinar-sofia: Refinamento da Assistente Sofia e Protocolos Farmacêuticos

Este plano descreve o aprimoramento do protótipo de atendimento de farmácia, elevando o comportamento da assistente **Sofia** e a base de produtos ao nível de uma operação real (CPF/Fidelidade, Substituição por Genéricos, Upsell, Retirada vs. Delivery e Simulação de Receita).

## 📋 Visão Geral
Queremos tornar o protótipo extremamente realista, imitando a experiência de redes de farmácias brasileiras (como Drogasil, Raia, Pague Menos). Sofia deixará de ser um bot transacional básico e passará a oferecer economia (sugestão de genéricos), conveniência (retirada em loja física e upsells inteligentes) e segurança (validação de CPF para descontos e verificação simulada de receitas médicas enviadas).

---

## 🏗️ Tipo de Projeto
- **Tipo de Projeto:** WEB
- **Agente Principal:** `frontend-specialist` (Skills: `clean-code`, `frontend-design`)

---

## 🏆 Critérios de Sucesso
1. **Validação de CPF / Fidelidade**: Sofia perguntará o CPF do cliente no início da conversa ou na cotação para simular descontos de programas de fidelidade (reduzindo os preços dos medicamentos de 10% a 30%).
2. **Intercambialidade de Medicamentos (Sugestão de Genéricos)**: Ao buscar um remédio de referência (ex: Novalgina, Tylenol), Sofia perguntará proativamente se o cliente prefere o genérico correspondente (Dipirona, Paracetamol) para economizar.
3. **Simulação de Leitura de Receita (OCR)**: Se o usuário simular o envio de um arquivo/imagem no chat (usando o botão de clipe ou digitando "enviar foto da receita"), o bot simulará o escaneamento e listará os itens extraídos da receita automaticamente.
4. **Escolha de Retirada ou Delivery**: Opção de retirar na loja (grátis, pronto em 30 min) ou delivery (R$ 5,00, 30-50 min).
5. **Upsell e Venda Cruzada Inteligente**: Se o cliente comprar remédios para gripe (Cimegripe/Resfenol), Sofia oferecerá lenços de papel ou Vitamina C. Se comprar analgésicos, perguntará se precisa de termômetro.
6. **Aprimoramento do Prompt do Agente**: Atualizar o arquivo `docs/prompt farmacia.md` documentando todas as novas regras de comportamento da Sofia para que fiquem salvas no projeto.

---

## 💻 Tech Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript (sem dependências externas).
- **Armazenamento de Sessão:** `localStorage` para persistir o CPF, carrinho e preferências de entrega.

---

## 📂 Estrutura de Arquivos

```
atendimento_project/
├── docs/
│   ├── prompt farmacia.md    # [MODIFICAR] Prompt de identidade e regras refinado
│   └── PLAN-refinar-sofia.md # [NOVO] Este plano de tarefas
├── frontend/
│   ├── app.js                # [MODIFICAR] Implementação do CPF, Generics, Upsell e OCR
│   ├── style.css             # [MODIFICAR] Ajustes visuais para os cards de receitas e CPF
│   └── index.html            # [MODIFICAR] Adaptações nas mensagens iniciais e botões
```

---

## 🛠️ Cronograma de Tarefas (Task Breakdown)

### 📌 Fase 1: Atualização da Documentação & Prompt
- [ ] **Task 1.1: Refinamento do Prompt Mestre**
  - **Agente:** `documentation-writer` (Skill: `clean-code`)
  - **Ação:** Modificar `docs/prompt farmacia.md` adicionando as novas seções de comportamento:
    - Regra de Fidelidade/CPF.
    - Regra de Substituição por Genéricos.
    - Regra de Cross-selling e Venda Cruzada.
    - Protocolo de simulação de receitas médicas (OCR).
  - **INPUT:** `docs/prompt farmacia.md`
  - **OUTPUT:** `docs/prompt farmacia.md` refinado.
  - **VERIFY:** Ler o prompt e verificar se as diretrizes de atendimento real estão claras.

---

### 📌 Fase 2: Lógicas de Fidelidade e Genéricos
- [ ] **Task 2.1: Fluxo de CPF / Convênio**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Programar em `app.js` a interceptação inicial da conversa para perguntar o CPF (se não cadastrado). Salvar o CPF e aplicar um desconto randômico de 10% a 30% em medicamentos de marca se o CPF for informado.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Variável `state.cpf` e lógica de descontos fidelidade em funcionamento.
  - **VERIFY:** Informar um CPF válido e ver se Sofia recalcula o preço da cotação com desconto.

- [ ] **Task 2.2: Intercambialidade (Sugestão de Genéricos)**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Adicionar mapeamento em `MEDICINES_DB` ligando remédios de referência a genéricos. Em `handleIdleState`, se o cliente solicitar um remédio de referência (ex: Buscopan), Sofia responderá informando o preço da referência e o preço do genérico correspondente, perguntando qual ele prefere.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Mapeamento de intercambialidade e lógica de oferta ativa de genéricos.
  - **VERIFY:** Digitar "quero Novalgina" e ver se o bot sugere ativamente Dipirona por um valor menor.

---

### 📌 Fase 3: Simulação de Receitas (OCR) e Venda Cruzada
- [ ] **Task 3.1: Simulação de Envio e Leitura de Receita**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Ajustar o manipulador de clique no botão de anexo ("btn-attach") ou o texto do chat para simular o upload de receita. Quando o usuário anexar qualquer imagem/arquivo ou digitar *"enviei a foto da receita"*, Sofia simulará um escaneamento OCR (exibindo "Escaneando receita...") e listará 2 medicamentos extraídos (ex: Amoxicilina + Ibuprofeno) para ele confirmar se quer cotar.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Evento de anexo capturado e simulação visual/texto de leitura de receita integrada.
  - **VERIFY:** Clicar em anexar e ver se o bot inicia a leitura simulada listando os remédios extraídos da receita fictícia.

- [ ] **Task 3.2: Upsell & Venda Cruzada Contextual**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** Mapear categorias de remédios para ofertas cruzadas (ex: gripe ➔ lenço/vitamina C; dor ➔ termômetro). No estado `'more_items'`, em vez de apenas perguntar "Mais alguma coisa?", Sofia fará uma sugestão ativa baseada no que está no carrinho.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Regras de upsell em `handleMoreItemsState`.
  - **VERIFY:** Adicionar Cimegripe e verificar se Sofia sugere ativamente adicionar Vitamina C ao carrinho.

---

### 📌 Fase 4: Entrega vs. Retirada & Confirmação Final
- [ ] **Task 4.1: Fluxo de Retirada na Loja**
  - **Agente:** `frontend-specialist` (Skill: `clean-code`)
  - **Ação:** No momento de checkout, perguntar se o cliente prefere receber por **Delivery** ou fazer **Retirada na Loja**. Se for Retirada, zerar a taxa de entrega e informar que estará pronto para buscar em 30 minutos.
  - **INPUT:** `frontend/app.js`
  - **OUTPUT:** Lógica de escolha de modalidade de entrega no checkout.
  - **VERIFY:** Escolher "Retirada" e checar se o resumo final zera a taxa de R$ 5,00 e altera a previsão de tempo.

---

## 🔍 Plano de Verificação (Fase X)

Após completar as implementações, executar:

### 1. Verificações Automáticas
- Executar linting e validação:
  ```bash
  $env:PYTHONIOENCODING="utf-8"; python .agent/scripts/checklist.py .
  ```

### 2. Testes de Fluxo Manual (Critérios de Aceitação)
- **Fidelidade CPF:** Enviar "quero Novalgina". Sofia deve pedir o CPF. Ao informar o CPF, deve aplicar o desconto fidelidade na cotação.
- **Oferta de Genérico:** Enviar "gostaria de comprar Tylenol". Sofia deve cotar o Tylenol e sugerir o Paracetamol como alternativa mais barata.
- **Simulação de Receita:** Enviar uma imagem ou digitar "foto da receita". Sofia deve fingir escaneamento e sugerir a cotação dos medicamentos da receita simulada.
- **Venda Cruzada:** Adicionar Benegrip e ver se Sofia sugere ativamente incluir Vitamina C ou lenços de papel.
- **Retirada:** Fazer o checkout, escolher "Retirada" e conferir no card final se o frete está zerado e se o local é para retirada presencial.

## ✅ PHASE X COMPLETE
- Lint: [Pending]
- Security: [Pending]
- Build: [Pending]
- Date: [Pending]
