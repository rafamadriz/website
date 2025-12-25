import markedFootnote from "npm:marked-footnote@1.4.0"
import { gfmHeadingId } from "npm:marked-gfm-heading-id@4.1.3"
import { marked } from "npm:marked@17.0.1"
import { markedSmartypants } from "npm:marked-smartypants@1.1.11"

marked.use(markedFootnote({
    footnoteDivider: true,
    sectionClass: "footnotes prose"
}))

marked.use(gfmHeadingId())
marked.use(markedSmartypants())

export class MarkedEngine implements Lume.Engine {
    render(content: string, _data: Record<string, unknown>, _filename: string) {
        return marked(content);
    }

    deleteCache() {}

    addHelper() {}
}
