import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import { gfmHeadingId } from "https://cdn.jsdelivr.net/npm/marked-gfm-heading-id@4.1.3/+esm"


marked.use(gfmHeadingId())
export class MarkedEngine implements Lume.Engine {
    render(content: string, _data: Record<string, unknown>, _filename: string) {
        return marked(content);
    }

    deleteCache() {}

    addHelper() {}
}
