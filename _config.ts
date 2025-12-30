import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.56";
import lume from "lume/mod.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import sass from "lume/plugins/sass.ts";
import extractDate from "lume/plugins/extract_date.ts";
import { imageSizeFromFile } from "npm:image-size@2.0.2/fromFile"
import { walk } from "jsr:@std/fs@1.0.21/walk";
import { basename } from "jsr:@std/path@1.1.3/basename";
import smartypants from "npm:smartypants@0.2.2"
import inline from "lume/plugins/inline.ts";
import purgecss from "lume/plugins/purgecss.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";

import remark from "lume/plugins/remark.ts";
import remarkAttributes from "npm:remark-attributes@0.3.2"
import remarkSmartypants from "npm:remark-smartypants@3.0.2";
import rehypeSlug from "npm:rehype-slug@^6.0.0";

// https://github.com/lumeland/lume/issues/58
Deno.env.set("TZ", "Z");

const site = lume({
    src: "./src",
    dest: "public",
});

site.use(remark({
    remarkPlugins: [ remarkAttributes, remarkSmartypants ],
    rehypePlugins: [ rehypeSlug ]

}))

site.use(date())
site.use(sass())
site.use(extractDate())
site.use(checkUrls({
    output: "broken_links.json",
}))
site.use(purgecss({
    options: {
        variables: true,
    }
}))
site.use(inline())
site.use(minifyHTML())

site.add("css")
site.copy("static", "static")
site.copy([".avif"], (file) => {
    const filename = file.split("/")[file.split("/").length - 1]
    return "/static/images/" + filename
})

site.preprocess([".md"], (pages) => {
  pages.forEach((page) => page.data.templateEngine = ["vto", "md"])
})

site.process( [".html"], async (pages) => {
    for (const page of pages) {
        page.document.querySelectorAll("a[href^='http']").forEach(a => {
            a.setAttribute("target", "_blank")
            a.setAttribute("rel", "noopener")
        })

        const images = page.document.querySelectorAll("p > img")
        for (const img of images) {
            const p = img.parentElement
            const filename = basename(img.getAttribute("src")!)
            for await (const entry of walk("./", { skip: [/^public\//], exts: [ "avif" ] })) {
                if (filename === entry.name) {
                    const dimensions = await imageSizeFromFile(entry.path)
                    img.setAttribute("width", String(dimensions.width))
                    img.setAttribute("height", String(dimensions.height))
                }
            }
            const figure = page.document.createElement("figure")
            figure.appendChild(img)
            p?.replaceWith(figure)
        }
    }
})

site.filter("smartypants", (string: string) => {
    return smartypants(string)
})

site.filter("postUrl", (name: string) => {
    const page = site.pages.find(page => {
        if (page.data.basename === name) return page
    })
    const pageUrl = page?.data.basename
    return `https://rafaelmadriz.com/blog/${pageUrl}`
})

type HeaderNode = { level: number; text: string; id: string | null; children: HeaderNode[] }
const getHeadingsList = (headers: HeaderNode[]) => {
    let html = ""

    for (const header of headers) {
        html += `<li><a href="#${header.id}">${header.text}</a>`

        if (header.children && header.children.length > 0) {
            html += "<ul>"
            html += getHeadingsList(header.children)
            html += "</ul>"
        }

        html += "</li>"
    }

    return html
}

site.filter("toc", (content) => {
    const contentDOM = new DOMParser().parseFromString(content, "text/html")
    const headings = contentDOM.querySelectorAll("h1, h2, h3, h4")
    const tree: HeaderNode[] = []
    const stack: HeaderNode[] = []

    for (const header of headings) {
        const level = Number(header.tagName[1])
        const node = {
            level: level,
            text: header.textContent,
            id: header.id || null,
            children: [],
        }

        while (stack.length && stack[stack.length - 1].level >= level) {
            stack.pop()
        }

        if (stack.length === 0) {
            tree.push(node)
        } else {
            stack[stack.length - 1].children.push(node)
        }

        stack.push(node)
    }

    if (tree && tree.length < 3) return { length: tree.length, list: "" }

    return { length: tree.length, list: `<ul>${getHeadingsList(tree)}</ul>` }
})

export default site;
