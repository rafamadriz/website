import { VentoPlugin } from "eleventy-plugin-vento"
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img"
import footnote_plugin from "markdown-it-footnote"
import { InputPathToUrlTransformPlugin } from "@11ty/eleventy"
import pluginTOC from "@uncenter/eleventy-plugin-toc"
import markdownItAnchor from "markdown-it-anchor"

// CUSTOM PLUGINS/UTILS
import sassPlugin from "./src/_11ty/sassPlugin.js"
import slugifyString from "./src/_utils/slugify.js"

// SOURCE: https://github.com/vimtor/eleventy-plugin-external-links
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
    // COPY TO OUTPUT FOLDER
    eleventyConfig.addPassthroughCopy("src/static")

    // FILTERS
    eleventyConfig.addFilter("slugify", slugifyString)

    // TRANSFORMS
    eleventyConfig.addTransform("external-links", openLinksNewTab)
    // Remove .html from `page.url`
    eleventyConfig.addUrlTransform((page) => {
        if (page.url.endsWith(".html")) {
            return page.url.slice(0, -1 * ".html".length)
        }
    })

    // COLLECTIONS
    eleventyConfig.addCollection("posts", function(CollectionApi) {
        return CollectionApi
            .getFilteredByGlob("./src/blog/**/*.md")
            .filter(page => page.inputPath != "./src/blog/index.md")
            .reverse()
    })

    // PLUGINS
    eleventyConfig.addPlugin(sassPlugin)
    eleventyConfig.addPlugin(pluginTOC, {
        ul: true,
        wrapper: (toc) => {
            if (parse(toc).querySelectorAll("li").length < 3) return ""
            return `${toc}`
        }
    })
    eleventyConfig.addPlugin(InputPathToUrlTransformPlugin)
    eleventyConfig.amendLibrary("md", (mdLib) => {
        mdLib.use(footnote_plugin)
        mdLib.use(markdownItAnchor)
    })
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        formats: [ "avif" ],
        sharpOptions: {
            animated: true,
        },
    }),
    eleventyConfig.addPlugin(VentoPlugin) // recommended to load as the last plugin
}

export const config =  {
    dir: {
        input:  "src",
        output: "public",
    },
    // SOURCE: https://learn-eleventy.pages.dev/lesson/3/#getting-started-with-nunjucks
    markdownTemplateEngine: "vto",
    htmlTemplateEngine:     "vto",
}
