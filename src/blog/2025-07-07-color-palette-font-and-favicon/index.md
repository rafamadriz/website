---
title: "Adding color palette, custom font and favicon"
date: 2025-07-07
description: "Documenting my website improvements with accessibility in mind - implementing semantic HTML, color palettes for light and dark mode, custom fonts, and creating a favicon"
---

**NOTE:** This is the first part of a series of posts where I'm going to be documenting the process of improving my website, or at least creating something that's more my taste.

My plan was to have some consideration for accessibility. Initially I wanted to follow the [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/), which is an awesome resource I found some time ago and decided to save for times like this.

The first part of the guide comes down to installing software like screen readers and other helper tools for accessibility. However, due to time constraints and compatibility issues, I decided to skip that part and focus more on the [*Knowledge*](https://www.accessibility-developer-guide.com/knowledge/) section. Maybe in the future I'll come back to it and setup a virtual machine, since I use Linux and most of the recommended software from the guide is Windows only. There wasn't much I could apply since my website is still pretty small, though the guide will be helpful for the future.

One recommendation I was able to make use of was trying to avoid elements with no semantic meaning. There are two elements in HTML that provide no meaning: `<div>` and `<span>`. In my case I was using `<span>` for dates, like in the archive list or below the title of a post for publication date. Now I use `<time>` which is exactly for that and the `datetime` attribute, which [translates dates into machine-readable format, allowing for better search engine results or custom features such as reminders](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time). Another small change was adding `<main>`, which is used for the main content of the body and is part of the structural elements for separating sections of a page into header, main content and footer.

The most notable change, is that now I'm using a color palette that respects light and dark mode (surprisingly easy nowadays with `prefers-color-scheme`). I found [this](https://www.inclusivecolors.com) website, which is for creating color palettes that meet WCAG contrast accessibility guidelines. I went with a color that's kind like blue or teal and I'm really happy with how it looks.

<style>
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 1px;
  max-width: 100%;
  margin-bottom: 1.25rem;
}

.color {
  width: 100%;
  box-shadow: 0 0 0 1px var(--text-muted);
}

.swatch {
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
}
</style>

<section class="palette-grid">
  <div class="color">
    <figure class="swatch" style="background-color: #eef6fb"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #d0e5f2"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #aedbf4"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #78d1fb"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #09b7e9"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #0098c2"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #00799b"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #005a74"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #003f53"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #022a38"></figure>
  </div>
  <div class="color">
    <figure class="swatch" style="background-color: #081921"></figure>
  </div>
</section>

The second major change is the font. I really like [Atkinson](https://www.brailleinstitute.org/freefont) from the Braille Institute, due to the legibility of all letters and numbers. The variable version is only 78.4 kB, which doesn't add much size to the website (depends on who you ask) and in consequence affecting loading times. I also did some optimization by preloading the font. I found this while looking at the source of the [Piccalilli](https://piccalil.li) website.

```html
<link rel="preload" href="./path/to/your/font" as="font" type="font/woff2" crossorigin="anonymous">
```

Basically:

- `rel="preload"`: Tells the browser to load the font early, even before it's used.
- `as="font"`: Tells the browser to download this resource as a font, helping prioritize accordingly.
- `type="font/woff2"`: Declares the MIME type.
- `crossorigin="anonymous"`: Necessary for font loading from different origins or for cache reuse.

The thing that took me the most time was creating a favicon. I have zero designing skills, and it was difficult coming up with something I was happy with. My main inspiration was [Daudix's favicon](https://daudix.one/), which is animated and looks really nice. I was also doing something animated initially but decided to keep it simpler for the moment. Maybe in the future I'll do something more elaborate.

Finally, to reset some browser defaults, I stole some stuff from both [A (more) Modern CSS Reset](https://piccalil.li/blog/a-more-modern-css-reset) by Andy Bell and [A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/) by Josh Comeau. Another minor addition was setting the viewport to the device width for better responsiveness.

## Things I learned

- You should always try to use HTML elements that add semantic meaning.
- To improve responsiveness, set the viewport to device width.
- You can use `prefers-color-scheme` for following the system's dark or light mode.
- Preloading resources in `link` elements with `rel="preload"`.
- You can define your own custom fonts in CSS with `@font-face`, including using whatever name you want.
- There's an `include` keyword in the Tera templating engine, which contrary to extends, uses the current context.

## Planned

- Fixing wrapping in codeblock.
- Working more on the styling in general:
  - Quotes that look more like quotes, right now the text style is the same as the rest.
  - Improving padding between elements.
  - Centering media.
- Headers should have a link.
- Table of contents.

There's more I want, but that's probably what I'll work on next.
