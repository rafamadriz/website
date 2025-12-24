import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.56";
import textLoader from "lume/core/loaders/text.ts";
import lume from "lume/mod.ts";
import sass from "lume/plugins/sass.ts";
import { MarkedEngine } from "./marked.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import relativeUrls from "lume/plugins/relative_urls.ts";

const site = lume({
    src: "./src",
    dest: "public",
});

site.use(sass())
site.use(slugifyUrls())
site.use(relativeUrls())

site.add("css/main.scss")
site.copy("static", "static")
site.copy([".avif"])

site.loadPages([ ".md" ], {
    loader: textLoader,
    engine: new MarkedEngine()
})

const getHeadingsList = (headers: { level: number; text: string; id: string | null; children: never[]; }[]) => {
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
    const tree = []
    const stack = []

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
