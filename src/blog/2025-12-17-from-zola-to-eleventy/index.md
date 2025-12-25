---
title: "From Zola to Eleventy"
date: 2025-12-20
descrtiption: "Migrating from Zola to Eleventy for more flexibility. Using Vento templates for JavaScript-like syntax, implementing AVIF image optimization, and simplifying URLs. A breakdown of the migration process and configuration."
---

I have decided to "rewrite" my website using Eleventy. Previously, I was using Zola, which is perfectly fine and I really like it, but from the little experience I had with it, I could just tell that I was going to ~~need~~ want something more flexible in the future. With Zola, I had a hard time understanding Tera (the template engine) and its macros. With Eleventy, you have many options of templates, I have even seen people using two different templates engines in the same project. For example, [Webc](https://www.11ty.dev/docs/languages/webc/) seems particularly nice for web components. But in my case, I'm using [Vento](https://vento.js.org/), which is somewhat new and not that popular. But what made the difference for me was that it's just JavaScript (not really but for the most part it's JS like syntax). You can even insert [JavaScript code](https://vento.js.org/syntax/javascript/). It also has better support for Neovim, unlike the others.

The JavaScript aspect is particularly important, with Tera I would always forget the syntax after a couple of days of not doing anything on my website. Vento feels more intuitive and I can figure out things on my own, with Tera I always need to search how someone else did it.

I was actually going to use [Nunjucks](https://mozilla.github.io/nunjucks/) at the beginning because:

- Eleventy has good documentation for it.
- Among the Eleventy community it seems to be one of if not the most used template engine.

While searching something specific for Nunjucks, this blog post showed up in the recommendations [Vento: My Favourite Template Language for Eleventy](https://helenchong.dev/blog/posts/2025-05-21-vento-in-eleventy/) which talks about Vento's template engine and some of the improvements over the others. From there, this blog post was also linked: [Taking VentoJS for a spin in Eleventy](https://chriskirknielsen.com/blog/taking-vento-js-for-a-spin-in-eleventy/).

Some of the improvements are:

- As mentioned before, syntax is just JavaScript (for the most part). This is a massive benefit in my eyes.
- Better editor integration, including for Neovim through a Tree-sitter grammar called "Vento" for which Nunjucks doesn't have an equivalent.
- Better performance.
- More active development.

After reading those articles I went down the rabbit hole and started to research more about it. Of course, it's not perfect, I also found [this article](https://vrugtehagel.nl/posts/my-doubts-about-vento/) where the author is a bit more critical of it. However, something I did notice in all articles I read, is that the issues they talked about, got addressed rather quickly by the people working on Vento.

There's also this video by the same author of the article being more critical of it, turns out that he's now a Vento user [Vento: the what, the why and the how with vrugtehagel | 11ty Meetup](https://www.youtube.com/watch?v=_854y7c0D-0).

From my point of view, JavaScript syntax and Neovim integration is what makes the difference when compared to others. So that's what I'm going to use.

## Editor setup

One little problem with the editor setup, was that using the Tree-sitter grammar only works on Vento (`.vto`) files. I was using `.html` files and telling Eleventy to run HTML files through the Vento template engine:

```js
export const config = {
    htmlTemplateEngine: "vto",
};
```

The problem with using Vento files is that the HTML LSP server doesn't work, and if you have other HTML specific settings in your config, those obviously won't work either. This is a small inconvenience since it's not like I'm doing a whole lot on template files and I could be perfectly fine without the LSP server running. But just for the sake of it, I decided to get it working and the simplest solution was using `.vto` files and telling the LSP server to include Vento files by adding a local config in the form of `.nvim.lua`.

```lua
vim.lsp.config("html", {
    filetypes = { "html", "vento" },
})
```

Going the other way around of using HTML files, and still getting the syntax highlighting from the Vento Tree-sitter grammar working seemed a little bit more complicated to me. I might be wrong but I think you would need to do Tree-sitter injections, on the other hand, just telling the LSP to include Vento files was easier.

## Templates and collections

Transferring the templates from Tera to Vento was easy for the most part. Just a few things that took me a while to figure out like getting the proper date format I wanted and [this issue](https://www.11ty.dev/docs/dates/#dates-off-by-one-day) on Eleventy where dates are off by one day.

I also got stuck with including a template (e.g the base for all pages) in another template. I was using [include](https://vento.js.org/syntax/include/), but this was causing some problems. It took me an embarrassingly long time to figure out, but it was my fault 100%, I just needed to actually read the documentation instead of skimming through it. You're supposed to use [layout](https://vento.js.org/syntax/layout/).

Collections are relatively similar. Zola automatically creates [sections](https://www.getzola.org/documentation/content/section/) whenever a directory inside `content/` has an `_index.md` file. Then, you can create different collections and iterate over them to create a list.

```html
{% set blog_pages = get_section(path="blog/_index.md") %}

{% for _, posts in blog_pages.pages | group_by(attribute="year") %}
{% for post in posts %}
<li>
    ...
</li>
{% endfor %}
{% endfor %}
```

Since Eleventy doesn't create sections automatically, you have to filter out the base index file (e.g `blog/index.md`) because otherwise it would be included in the collection. I only want a collection of posts without including the base index at the root of the `blog/` folder.

```js .eleventy.js
export default async function(eleventyConfig) {
    eleventyConfig.addCollection("posts", function(CollectionApi) {
        return CollectionApi
            .getFilteredByGlob("./src/blog/**/*.md")
            .filter(page => page.inputPath != "./src/blog/index.md")
            .reverse()
    })
}
```

Then you can iterate over them with your template engine. Also, `collections` is a global variable accessible directly in the template engine.

## External links

Something I feel should just be an option you enable in Eleventy, is opening external links in a new tab. Zola has `external_links_target_blank` which you just enable in the configuration and that's it. With Eleventy it is more verbose to setup. There's a npm package you can install called [eleventy-plugin-external-links](https://github.com/vimtor/eleventy-plugin-external-links). It's only a couple of lines so I just copied it to my configuration. But you still need to install [`node-html-parser`](https://github.com/taoqf/node-html-parser) though.

```js .eleventy.js
// MODIFIED FROM: https://github.com/vimtor/eleventy-plugin-external-links
import { parse } from "node-html-parser"
import { extname } from "node:path"
const openLinksNewTab = (content, outputPath) => {
    if (outputPath && [".html"].includes(extname(outputPath))) {
        const root = parse(content);
        const links = root.querySelectorAll("a");
        const regex = new RegExp('^(([a-z]+:)|(//))', 'i')
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && regex.test(href)) {
                link.setAttribute("target", "_blank");
                link.setAttribute("rel", "noopener");
            }
        });
        return root.toString()
    }
    return content;
}

export default async function(eleventyConfig) {
    eleventyConfig.addTransform("external-links", openLinksNewTab)
}
```

## Image optimization

In the previous version of the website I was not doing any image optimization. But reading Alex's [The Design of This Website](https://turntrout.com/design) and seeing all the things he does to improve his website inspired me to tackle this problem since the beginning.

I decided to go with AVIF image format. After seeing how much better compression it offers compared to other formats like PNG, JPG, and even Webp, there was no excuse to use anything else. Admittedly, my testing was not the most scientific one in the sense that it didn't cover a wide range of cases. I converted a bunch of PNG and JPG images using [avifenc](https://github.com/AOMediaCodec/libavif) and compared them with the original side by side using [Identity](https://apps.gnome.org/Identity/). The difference in file size is massive, between 60%-80% (but it depends on your settings), yet the image quality is almost identical. In most cases I have to zoom in at like 150%-200% to notice a difference, and in other cases it's literally impossible to spot any difference.

All of that file size reduction results in A LOT of bandwidth saved, and I truly want to make an amazing website with a good experience, so the less data that is transmitted, the faster the site loads.

There used to be an argument against AVIF in terms of support. But as of December 2025, browser support is at [94.7%](https://caniuse.com/avif). It also has good support in [all major OS's and other popular applications](https://en.wikipedia.org/wiki/AVIF#Support) so it's pretty much universal at this point. On top of that, the type of content I share is mostly technical (programming, webdev, and so on), and I suppose most people interested in programming and related subjects use up-to-date devices, which means my visitors likely have devices that support AVIF.

The way that I started my image optimization workflow was by creating a script that searches, converts all PNG and JPG files, and deletes the original file. After that I needed to make Eleventy include the images in the build because by default, it was not doing so. The official Eleventy documentation recommends using [HTML transform](https://www.11ty.dev/docs/plugins/image/#html-transform) and you need to install [@11ty/eleventy-img](https://github.com/11ty/eleventy-img). When I added this, turns out that it already compresses and converts all images for you using [sharp](https://sharp.pixelplumbing.com/), so I didn't need to create my own script in the first place. I decided to keep the script since it's still useful for images in the source, Eleventy only converts/compresses images in the final build. This way the git repo doesn't increase that much if I add an image.

The other really nice thing about eleventy-img is that it automatically adds the image width and height to the HTML. This helps to prevent [Cumulative Layout Shift (CLS)](https://web.dev/articles/cls). You can observe a concrete example of Layout Shift in Alex's [example](https://turntrout.com/design#preventing-layout-shift). This was rather nice, just install it and enable it, you link to an image like you normally would in a Markdown file. I suspect this would've been much more difficult to do in Zola.

## Footnotes and header anchors

Once again, just like with [External links](#external-links), I feel like this should be something that comes by default. Anyway, since Eleventy uses [markdown-it](https://github.com/markdown-it/markdown-it) to process Markdown, you can install a plugin for footnotes called [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote). Enable it in your config and that's all. I found this blog post [How To Add Footnotes To Eleventy](https://blog.martin-haehnel.de/blog/2025/02/11/footnotes-in-eleventy) and followed that because I didn't find anything in the official documentation for Eleventy. Only a section of community plugins, one of which was for footnotes but for Liquid... I'm using Vento.

Header anchors are included in the Eleventy package, but you have to [enable it](https://www.11ty.dev/docs/plugins/id-attribute/#usage):

NOTE: The Eleventy package that comes included was not that useful at the end of the day. It was [replaced](https://github.com/rafamadriz/website/commit/a4e54e1a7dc056e36569c8e6a283b810229bc924) for [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor), since the plugin I use for generating table of contents didn't work with it, or maybe it does but I was not able to make it work.

```js
import { IdAttributePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(IdAttributePlugin);
}
```

## URL and titles

I removed the *Devlog #n:* part of the title from that series of articles where I'm documenting the progress in my personal website. Mainly because I want to simplify post titles and URLs.

In the case of using *Devlog #n:* as part of the title, I feel like it was a bit too much. But besides that, as the series progresses, the titles might get too messy. There are many features I want to add to my website, so in the future there might be another sub-series, like for example implementing [IndieWeb](https://indieweb.org/IndieWeb) features. A possible title might end up like *"Devlog #18: Implementing IndieWeb part 2"*, at that point it will look cluttered. I can still provide the information that *Devlog #n:* is supposed convey in the form of a tag (whenever I add them).

I also decided to change the URL from previous posts to simplify them. I really like short and simple URLs, I don't want to go to the extreme of just using a [single word](https://jenson.org/text/), but I still want to simplify them as much as possible, while still conveying meaning as to what the page is related to. By default, Eleventy generates URL based on filename or directory name (in case of using `/post-title/index.html`). I use directories for each post, this allows for better organization when linking images or adding a custom CSS/JS to that post, because you can keep all of those in the same related folder. But I digress, the point is that I add the creation date to the folder, because 1) Never trust that the file metadata (like creation date) will never change and 2) The directories are ordered by default since the name starts with the date, so If you open them in your file manager or use `ls`, they are already sorted in chronological order without you touching anything, which for a list of published articles, it's a really nice default behavior.

With the date in the folder name, I was getting `/blog/2025-07-04-starting-before-its-perfect`. Here's something else that Zola does by default, it ignores the date part of the name for the URL but I had to configure it in Eleventy. But something else I wanted to have was a way of changing the final URL by adding data to the post frontmatter but fallback to the post title if I didn't add it.

This can be accomplished by using [Template and Directory Specific Data Files](https://www.11ty.dev/docs/data-template-dir/). In this case I needed to add data in all `/blog/**/*` files, and since we are going to be computing the final result for the URL, we use a JS data file. I added `/blog/blog.11tydata.js`, which for some reason in Eleventy, JS data files need to have `11tydata.js`, it cannot be just `blog.js` like with JSON. But anyway, I also needed to add a helper function to slugify text since Vento doesn't come with one. Finally in `blog.11tydata.js`:

```js
import slugifyString from "../_utils/slugify.js"

export default function() {
    return {
        layout: "layouts/post.vto",
        eleventyComputed: {
            shortTitle: (data) => {
                if (!data.shortTitle) return data.title
                return data.shortTitle
            },
            permalink: (data) => {
                if (data.page.inputPath === "./src/blog/index.md") {
                    return "/blog/index.html"
                }
                return `/blog/${slugifyString(data.shortTitle)}.html`
            }
        }
    }
}
```

Now in any post frontmatter I can add `shortTitle: "Shorter title"`. A practical example from the [previous post]({{ "hosting-and-css-improvements" |> postUrl }}). I set the `shortTitle: "Hosting and CSS improvements"`, result:

- Before: `/blog/changing-hosting-provider-and-css-improvements`
- After: `/blog/hosting-and-css-improvements`

For posts with an already short title, I don't add anything. I was also pretty close to removing the `blog/` part of the URL and having posts at the root `/`, like for example [Andy Bell's blog](https://bell.bz/blog/). There's still a route `/blog/` that shows all posts, but each post URL is `/post-title` instead of `/blog/post-title`. The URL ends up being shorter and "nicer" but I decided not to do it because I think it ends in a little bit worse user experience. Having `/blog/post-title` is more intuitive because it already tells you right in the URL that there's more content under `/blog/`[^1]. If you visit `/post-title/`, the URL doesn't convey that kind of information (there might be more posts under `/blog/`). All of this might sound silly, but I think details matter. This alone by itself doesn't improve anything significantly, but my goal is to have many little details that I think improve the user experience, and all of that adds up to make a big difference. As the quote goes, *"The devil is in the details"*.

One final change to URLs was removing the trailing slash. I wasn't sure about this because it can cause problems with different hosting providers, most notably Vercel, you can find more information [here](https://www.zachleat.com/web/trailing-slash/). There's also this really good resource [Trailing Slash Guide](https://github.com/slorber/trailing-slash-guide), explaining the behavior of different hosting providers and static site generators. The behavior I like is that folders should have a trailing slash, this also helps to indicate that there's more content under a given URL. And URLs with no more content under them besides a single page shouldn't have a trailing slash[^2].

Ideally, you build your website to be compatible with as many hosting providers as possible, in this sense, always having a trailing slash seems to be the most sensible default for all hosting providers. But I decided to go for my personal preference and remove trailing slashes on pages with no more content under them. Convenient enough, my hosting provider (Cloudflare) behaves exactly like I like. [Here is the documentation to remove trailing slashes on Eleventy](https://www.11ty.dev/docs/permalinks/#remove-trailing-slashes).

```js
export default function(eleventyConfig) {
    // Remove .html from `page.url`
    eleventyConfig.addUrlTransform((page) => {
        if (page.url.endsWith(".html")) {
            return page.url.slice(0, -1 * ".html".length);
        }
    });
};
```

## Design

I was somewhat happy with the previous "design" (if you can call it that, more like a colorscheme). But I felt that I didn't have a good foundation to build on, I wasn't even sure about the colors. Now that I basically rewrote my website I was able to come up with much clearer vision of what I want.

The main tool I used was [InclusiveColors](https://www.inclusivecolors.com/). I highly recommend this tool, it helps you build a color palette that meets the accessibility requirements of WCAG, ADA and Section 508.

It comes with some popular open source color palettes. In my case, I choose IBM Carbon, which is excellent to have as a base for styling all elements that need an accent color. Like for example red for a sidenote meant to be warning and so on. The main background color I settled on is not included in IBM Carbon. It's similar to the previous one (almost black) but tinted with a purple touch. And I *really* like it. Talking about purple, that will be the main accent color for the moment (just like previous version), I might change it to something more similar to indigo (or between purple and blue), But the purple included in IBM Carbon is serving me well and I think it looks pretty good.

The site also works in light mode, thanks to InclusiveColors. If you use the shades it generates, all you have to do is invert them in either dark or light mode and that's it, all colors and contrasts look good and meet the accessibility requirements. But the main mode for which I'm designing is dark mode, it's just that InclusiveColors makes it easy to have a working light mode without doing much.

Another tool I used from the ground up was [Utopia](https://utopia.fyi/), a great tool used for fluid and responsive design. I'm trying to follow the principle of [being the browser’s mentor, not its micromanager](https://www.youtube.com/watch?v=5uhIiI9Ld5M) (great talk by the way, highly recommended).

Besides that, I won't go into too much detail, because well, there aren't many things to explain, the site is still pretty basic at this point. But in the future I would love to make a similar post to Alex's [The Design of This Website](https://turntrout.com/design) or Declan's [The Design of This Site](https://vale.rocks/posts/the-design-of-this-site).

## Conclusion

Zola is pretty good, I would still recommend it. It's especially nice because it's all in a single binary, no extra things to install. It already comes with various options that require more work on Eleventy. Even if I didn't like the template engine, Zola is still a lot simpler than Eleventy.

With Eleventy you get a lot more flexibility, multiple template engines to choose from, community plugins, access to npm packages and much more. That's a double edge sword, having access to npm packages can get out of hand quickly. There is also the whole security aspect of npm packages, where it seems like every week there's a new supply chain attack or malware.

But being able to write plain JS for filters, my own utility functions, plugins, and even the template engine really makes the difference from my point of view. My hope is that I won't be as limited as I would be with Zola for future things I might do in my website. And since I'm more familiar with the technologies used in Eleventy, it will be a lot easier to add features.

If you're curious, here's the [source code](https://github.com/rafamadriz/website).

[^1]: There *should* be more content under `/subdir` when a website has `/subdir/more-here`. But at the end of the day, who knows how others design URLs. I have seen countless `/subdirs` that just give you a 404, even if they have some content inside them.

[^2]: Similar to a UNIX filesystem, trailing slash for folder and no trailing slash for a file. I have seen many people online making the argument that URLs no longer are a representation of file system in the server like they used to be. I suppose that's true for complex API's, but I still think it's a good mental model to have and it just makes sense.
