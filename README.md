# Projeto Conecta+ para recomendação e indicação

## Visão Geral

    O Saúde em Movimento (Conny) é mais do que um app, é um convite.
    Criado para quem quer começar, recomeçar ou simplesmente se sentir bem, o aplicativo conecta pessoas a atividades físicas, eventos esportivos e experiências reais. O projeto foi desenvolvido para proporcionar uma experiência moderna, responsiva e multilíngue, com interfaces distintas para desktop e mobile, além de animações e transições suaves. Esse projeto não é só tecnologia. É saúde pública com roupinha de inovação. Estamos falando de uma solução que pode ser usada por prefeituras, planos de saúde, empresas que querem promover bem-estar para seus funcionários.  

---

## Estrutura dos Arquivos

### 1. `index.html`
Interface principal para desktop, composta por:
- **Branding**: Bloco lateral com logo e texto explicativo sobre o propósito do app.
- **Card de Login/Cadastro**: Formulários animados para autenticação e registro de usuários, com transições entre login e cadastro.
- **Seleção de Idioma**: Menu no rodapé para alternar entre Português, Inglês, Japonês e Coreano, alterando dinamicamente os textos da interface.
- **Footer Profissional**: Informações institucionais, links de privacidade, ajuda e sobre.
- **Redirecionamento Automático**: Script que detecta a largura da tela e redireciona para a versão mobile se necessário.

### 2. `mobile.html`
Interface otimizada para dispositivos móveis:
- **Header Fixo**: Logo e idioma no topo.
- **Formulários**: Login e cadastro com transição animada entre telas, campos simplificados e botões de ação.
- **Footer Compartilhado**: Links institucionais e logo.
- **Redirecionamento Automático**: Script que garante que usuários mobile permaneçam na versão correta.

### 3. `app.js`
Script principal para a interface desktop:
- **Internacionalização (i18n)**: Gerencia traduções dos textos da interface conforme seleção de idioma.
- **Transição Login/Cadastro**: Alterna entre os formulários de login e cadastro com animações.
- **Validação Simples de Login**: Exemplo funcional que redireciona para `home.html` se usuário e senha forem "teste".
- **Atualização Dinâmica de Textos**: Todos os textos do card e rodapé são atualizados conforme o idioma selecionado.

### 4. `css/estilos.css`
Estilos para a interface desktop:
- **Layout Flexível**: Estrutura centralizada, com branding à esquerda e card à direita.
- **Animações e Transições**: Efeitos de entrada/saída entre login e cadastro, fundos rotativos e blur.
- **Responsividade**: Media queries para adaptar o layout em diferentes resoluções, mantendo animações intactas.
- **Footer Profissional**: Rodapé fixo, estilizado e adaptável para telas largas e estreitas.
- **Paleta de Cores**: Tons de verde, branco e azul, transmitindo modernidade e saúde.

### 5. `style.css`
Estilos para a interface mobile:
- **Container Centralizado**: Card responsivo, com header e footer fixos.
- **Transições Suaves**: Animações entre telas de login e cadastro.
- **Campos e Botões Modernos**: Inputs arredondados, botões com efeito hover e feedback visual.
- **Footer Compartilhado**: Links institucionais e logo, adaptados para mobile.
- **Responsividade Total**: Adaptação para diferentes tamanhos de tela, priorizando usabilidade.

---

## Intenção do Projeto

O objetivo do Conecta+ é criar uma plataforma digital que incentive a conexão entre pessoas, promovendo saúde, bem-estar e reconhecimento por meio de indicações. A interface foi desenhada para ser intuitiva, acessível e multilíngue, com foco em experiência do usuário tanto em desktop quanto em mobile. O projeto serve como base para futuras integrações com sistemas de autenticação, banco de dados e funcionalidades avançadas de recomendação.

---

## Funcionalidades Principais

- **Login/Cadastro Animado**: Experiência fluida para autenticação de usuários.
- **Internacionalização**: Suporte a múltiplos idiomas, com atualização dinâmica dos textos.
- **Responsividade**: Layouts distintos para desktop e mobile, com redirecionamento automático.
- **Design Moderno**: Uso de animações, paleta de cores e tipografia profissional.
- **Footer Institucional**: Informações e links relevantes para o usuário.

---

## Como Executar

1. Abra o arquivo `index.html` para acessar a versão desktop.
2. Abra o arquivo `mobile.html` em dispositivos móveis ou redimensione a janela para testar o redirecionamento.
3. O login de exemplo utiliza usuário e senha "teste" para fins de demonstração.

---

## Observações Técnicas

- O projeto não possui backend integrado; autenticação é apenas ilustrativa.
- As traduções podem ser expandidas facilmente no objeto `translations` do `app.js`.
- O layout e animações podem ser customizados conforme necessidade do cliente.

---

## Estrutura de Pastas

- `index.html` — Interface desktop
- `mobile.html` — Interface mobile
- `home.html` — Página de destino pós-login (exemplo)
- `app.js` — Lógica de interface desktop
- `css/estilos.css` — Estilos desktop
- `style.css` — Estilos mobile
- `img/` — Imagens e logos
- `fonts/` — Fontes customizadas

---

## Licença

Este projeto é de uso privado e institucional. Para uso comercial, consulte o autor.
