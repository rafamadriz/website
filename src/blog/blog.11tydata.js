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
                if (data.page.inputPath === "./src/blog/index.md") return "/blog/index.html"
                return `/blog/${slugifyString(data.shortTitle)}.html`
            }
        }
    }
}
