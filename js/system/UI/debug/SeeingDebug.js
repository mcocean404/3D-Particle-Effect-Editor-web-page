export class SeeingDebug {
    
    static {

        $('body').append(`<div class="SeeDebugBoard"><button>copy</button><p></p></div>`)
    }

    test(content) {
        if (content.includes('NaN', 'null')) {
            return 0
        } else {
            return content
        }
    }
}