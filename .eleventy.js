import { VentoPlugin } from "eleventy-plugin-vento"

// CUSTOM PLUGINS
import sassPlugin from "./src/_11ty/sassPlugin.js"

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
        const newContent = root.toString();
        return `<!DOCTYPE html>${newContent}`
    }
    return content;
}

export default async function(eleventyConfig) {
    // TRANSFORMS
    eleventyConfig.addTransform("external-links", openLinksNewTab)

    // COLLECTIONS
    eleventyConfig.addCollection("posts", function(CollectionApi) {
        return CollectionApi
            .getFilteredByGlob("./src/blog/**/*.md")
            .filter(page => page.inputPath != "./src/blog/index.md")
            .reverse()
    })

    // PLUGINS
    eleventyConfig.addPlugin(sassPlugin),
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
