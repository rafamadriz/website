const url = (page) => {
    if (page.src.path === "/blog/index") return "/blog/index.html"
    if (page.data.shortTitle) {
        return `/blog/${page.data.shortTitle}/`
    } else {
        return `/blog/${page.data.title}/`
    }
}

export default { layout: "layouts/post.vto", templateEngine: [ "vto", "md" ], url }
