---
title: Log for all features
layout: layouts/base.vto
customCSS: /css/todo.css
---

<header>

# Log for all features

</header>

This is a continuously updated documented where I'm tracking and documenting all the enhancements I would like to add at some point.

## Frontend, Content & SEO

- [ ] Add about me page. _**[ Added: 2025-12-27 ]**_

- [ ] Add portfolio. _**[ Added: 2025-12-27 ]**_

- [x] Add publishing dates to blog posts. _**[ Added: 2025-12-27 ] [{{ "5c29dd8b" |> todoCompleted }}]**_

- [ ] Better use of space in desktops by adding left sidebar with table of contents in posts. Table of contents should be sticky. _**[ Added: 2025-12-27 ]**_

- [ ] Improve quotes. Right now they look like normal text from a paragraph, there's no visual distinction. _**[ Added: 2025-12-28 ]**_

- [ ] Add footer. _**[ Added: 2025-12-28 ]**_

- [ ] Add admonitions cards. [Some inspiration](https://turntrout.com/test-page#admonitions). _**[ Added: 2025-12-28 ]**_

- [ ] Add tags to posts. _**[ Added: 2025-12-28 ]**_

- [ ] Add search functionality. _**[ Added: 2025-12-28 ]**_

- [x] Design a favicon/logo. _**[ Added: 2025-12-28 ] [{{ "3c48eb7c" |> todoCompleted }}]**_

- [ ] Improvements to code blocks:
    - [x] Add syntax highlighting to multiline code blocks. _**[ Added: 2025-12-29 ] [{{ "a728861b" |> todoCompleted }}]**_
    - [ ] Add line numbers, and an option to start at specific line number. See [Issue #3](https://github.com/shikijs/shiki/issues/3). _**[ Added: 2025-12-30 ]**_
    - [ ] Add option to add filename to code block. _**[ Added: 2025-12-30 ]**_

- [ ] Add more meta tags to pages:
  - [ ] Descriptions. _**[ Added: 2025-12-27 ]**_
  - [ ] Open graph tags for social sharing. _**[ Added: 2025-12-28 ]**_

- [ ] Implement some of the [IndieWeb](https://indieweb.org/) features:
  - [ ] Add [rel-me](https://indieweb.org/rel-me) links. _**[ Added: 2025-12-27 ]**_
  - [ ] Add [h-entry](https://indieweb.org/h-entry) to posts. _**[ Added: 2025-12-27 ]**_
  - [ ] Explore [Syndication models](https://indieweb.org/syndication-models) and [cross-posting](https://indieweb.org/cross-posting). _**[ Added: 2025-12-27 ]**_

## Local Development

- [ ] Automate adding date to new posts when site is deployed. I think the simplest solution is to only add post to the git history when they are published, and just use the [Git Created](https://lume.land/docs/creating-pages/page-data/#date) value in the frontmatter. _**[ Added: 2025-12-27 ]**_

- [ ] Setup formatting files. _**[ Added: 2025-12-30 ]**_

- [ ] Add testing for dead (404) external links. _**[ Added: 2025-12-30 ]**_
