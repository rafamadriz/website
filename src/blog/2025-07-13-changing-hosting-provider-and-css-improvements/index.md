---
title: "Changing hosting provider and CSS improvements"
shortTitle: "Hosting and CSS improvements"
date: 2025-07-13
description: "My journey migrating from Fastmail to Cloudflare for website hosting, plus CSS enhancements including better typography, code blocks, font declarations, and anchor links"
---

My plan was to use Fastmail's feature for [hosting websites](https://www.fastmail.help/hc/en-us/articles/1500000280141-How-to-set-up-a-website), since I'm already hosting my email with them (amazing service by the way), and changing hosting would mean modifying nameservers and messing with DNS settings that I don't want to mess with because I'm no expert and anything wrong can cause some downtime for your email, which is not good if someone happens to send you an important email during that time.

But by the time I published my second [post](https://rafaelmadriz.com/blog/adding-color-palette-custom-font-and-favicon/), I was already getting a bit frustrated with the Fastmail workflow. I had to setup [`rclone`](https://rclone.org/) to update the website from the command line and avoid manually uploading thorough Fastmail's interface. However, in my experience this was a bit unreliable, sometimes the files wouldn't sync correctly, and I had to manually update the files anyway, not really sure if the issue was related to Webdav or what, but I even had to delete the folder in Fastmail multiple times to get it working again. So after going through this with just two posts, I was like *"Yeah I'm not dealing with this every time I publish something"*.

I went straight into Cloudflare without looking anywhere else. From what I've seen, people always have positive things to say about them (for the most part) and it's always one of the top recommendations. First, I needed to change the nameservers to Cloudflare's, and keep all of my email working with minimal downtime. This was surprisingly easy because Cloudflare automatically detected all of my DNS settings and preserved them. The only problem was that the settings for DKIM[^1] had a different proxy, so after a minor tweak, it was all good for my email again.

After that, it was time to host the website. I started to look into the documentation of [Cloudflare Pages](https://pages.cloudflare.com/) which is similar to [Github Pages](https://pages.github.com/) and is frequently recommended for personal sites or simple projects. But it turns out that now they want you to use [Workers](https://workers.cloudflare.com/); there's a big banner on top of all the documentation for Pages where they recommend Workers for new projects and offer migration guides for old ones. Now, call me crazy but I interpret that as "We are going to kill Cloudflare Pages at some point, so better use this new service". The issue with this is that they have documentation on [deploying a website with Zola](https://developers.cloudflare.com/pages/framework-guides/deploy-a-zola-site/) on Pages, but not for Workers. Luckily I was not the first one trying to do this and found a helpful [forum post](https://www.answeroverflow.com/m/1387403036439089215) after a bit of searching. The script was originally made for Hugo so [I did some modifications](https://github.com/rafamadriz/website/blob/main/build.sh) to get it working with [Zola](https://www.getzola.org).

Once I made sure that my website was deploying correctly, I needed to point `rafaelmadriz.com` to Cloudflare's DNS. This became problematic because Cloudflare imported all of my settings from Fastmail, resulting in this error:

`Hostname 'rafaelmadriz.com' already has externally managed DNS records (A, CNAME, etc). Either delete them, try a different hostname, or use the option 'override_existing_dns_record' to override.`

It might be obvious but it took me a bit of time to figure out. I simply needed to delete a bunch of `A` records that were still pointing to Fastmail's servers. And that was it, my website is now hosted on Cloudflare with automatic deployments when commits are pushed to the [main branch on Github](https://github.com/rafamadriz/website/). 

One nice feature is [Preview URLs](https://developers.cloudflare.com/workers/configuration/previews/). If you push commits to any branch, Cloudflare will generate a URL in the following domain `<VERSION_PREFIX OR ALIAS>-<WORKER_NAME>.cloudflare.workers.dev`. This allows you to push to a non-production branch, get the generated URL, and then use it for testing. It's true that almost every static site generator will have a server to preview changes locally, but with this generated URL, you can share it with others worldwide and get feedback before actually deploying to your domain. Maybe not that helpful for a personal website, but for other projects I can imagine this is extremely handy.

## CSS Improvements

I did some CSS tweaks to progressively improve my website. 

- Codeblocks now overflow with a scrollbar. Previously the whole page would get a scrollbar making it look weird on small displays.

- I added proper `@font-face` declarations for normal and italic styles:

  ```css
   @font-face {
       font-family: "Atkinson";
       src: url('./fonts/AtkinsonHyperlegibleNextVF-Variable.woff2') format('woff2-variations');
       font-weight: 200 800;
       font-style: normal;
       font-display: swap;
   }

   @font-face {
       font-family: "Atkinson";
       src: url('./fonts/AtkinsonHyperlegibleNextVF-Variable.woff2') format('woff2-variations');
       font-weight: 200 800;
       font-style: italic;
       font-display: swap;
   }
    ```

    Before that, I was only configuring the `font-family` name and the source. [The font weight range is used by the browser to select the appropriate font when a CSS rule sets a desired font weight](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight). Without this range, browsers assumes that only the default weight (usually 400) is available and requests for other weights might be ignored, faked (synthesized bold), or fallback to another font.

    You also need to declare the italic style, otherwise the browser will fall back to a faux[^2] italic style or a fallback font because no italic face is declared. Finally the `swap` property makes the browser show a fallback font until the custom font is downloaded.

- I added `text-wrap: pretty` which is not available in all browsers, but this can be considered a progressive enhancement since there's no effect in case it's an unsupported browser, but just a nice extra in case it's supported. This helps to prevent what's known as an “orphan” in typography, where a single word is left alone in a line at the end of a paragraph. I got this from a [Josh Comeau](https://www.joshwcomeau.com/css/browser-support/#one-the-fallback-experience-1) article.

- Headings now feature anchor links that become more visible on hover. This commonly used for when you want to share a link to a specific section of an article. Related to this, visited links now have a different color, this helps recognizing which links have you already visited. Only downside is that `:visited` selector is not supported on some Chromium browsers, well it is supported but apparently, it has some strict limitations due to privacy and security concerns. It does work on Brave, so it's not all Chromium based browsers.

    I also added color to links with the `focus` event, another nice feature to always know what was the last link you clicked. I noticed this on [Protesilaos Stavrou's](https://protesilaos.com/) website and really liked it. Finally, external links are opened in a new tab; this is my personal preference. Every time I'm reading an article and they share a link to another interesting article, I get annoyed when the page gets replaced. I know it's easy to open links in a new tab (middle click on the mouse does that), but on mobile you have to hold and then select the "open in a new tab" option. I simply prefer opening links in a new tab by default.

That's it for now, once again I learned a bunch of stuff. If you are interested in the source code, you can find it on [here](https://github.com/rafamadriz/website).

[^1]: DKIM helps receivers know your message is not spam, by electronically signing your email to verify it was sent by you.

[^2]: Faux italics are artificially created italic styles that browsers generate when the actual italic font file is not available.
