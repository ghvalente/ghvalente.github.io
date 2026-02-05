# CLAUDE.md

## Preferências de Comunicação

- **Idioma**: Sempre responder em Português do Brasil

## Visão Geral do Projeto

Site pessoal de Gustavo Valente hospedado no GitHub Pages em [gustavovalente.com](https://gustavovalente.com).

## Stack Tecnológica

- **Plataforma**: GitHub Pages
- **Gerador de Site Estático**: Jekyll
- **Tema**: jekyll-theme-minimal

## Estrutura do Projeto

```
/
├── _config.yml    # Configuração do Jekyll
├── CNAME          # Configuração do domínio personalizado
├── index.md       # Conteúdo da página principal
└── CLAUDE.md      # Este arquivo
```

## Desenvolvimento

### Desenvolvimento Local

Para rodar localmente com Jekyll:

```bash
bundle install
bundle exec jekyll serve
```

Depois acesse `http://localhost:4000`

### Adicionando Conteúdo

- Edite `index.md` para atualizar a página principal
- Adicione novos arquivos `.md` para páginas adicionais
- O Jekyll processa automaticamente arquivos Markdown com front matter

### Configuração

- `_config.yml` - Configurações do Jekyll e do tema
- `CNAME` - Domínio personalizado (gustavovalente.com)

## Deploy

Alterações enviadas para a branch principal são automaticamente publicadas via GitHub Pages.
