
/**
 * 用来设置鼠标样式
 */
export default class Cursor {
    /**
     * 鼠标样式
     */
    #type = 'pointer';

    /**
     * 元素
     */
    #dom_html_element;

    /**
     * 
     * 构造函数
     * 
     * @param {*} element 
     */
    constructor(element) {
        this.#dom_html_element = element;
    }

    /**
     * 获取鼠标样式
     */
    get type() {
        return this.#type;
    }

    /**
     * 
     * 设置鼠标的样式
     * 
     * none
     * pointer
     * pointer-3d
     * add
     * link
     * curve-move
     * curve
     * highlight
     * pen
     * pen-point
     * scissor
     * hand
     * hand-closed
     * knife
     * pencil
     * 
     * @param {string} type 
     */
    setCursor(type) {
        let type_lowercase = type.toLocaleLowerCase();
        if (type_lowercase === this.#type) {
            return;
        }
        this.#dom_html_element.classList.remove('cursor-' + this.#type);

        switch (type_lowercase) {
        case 'none':
            this.#dom_html_element.classList.add('cursor-none');
            break;

        case 'pointer':
            this.#dom_html_element.classList.add('cursor-pointer');
            break;

        case 'pointer-3d':
            this.#dom_html_element.classList.add('cursor-pointer-3d');
            break;

        case 'add':
            this.#dom_html_element.classList.add('cursor-add');
            break;

        case 'link':
            this.#dom_html_element.classList.add('cursor-link');
            break;

        case 'curve-move':
            this.#dom_html_element.classList.add('cursor-curve-move');
            break;

        case 'curve':
            this.#dom_html_element.classList.add('cursor-curve');
            break;

        case 'highlight':
            this.#dom_html_element.classList.add('cursor-highlight');
            break;

        case 'pen':
            this.#dom_html_element.classList.add('cursor-pen');
            break;
        
        case 'pen-point':
            this.#dom_html_element.classList.add('cursor-pen-point');
            break;

        case 'scissor':
            this.#dom_html_element.classList.add('cursor-scissor');
            break;
        
        case 'hand':
            this.#dom_html_element.classList.add('cursor-hand');
            break;
        
        case 'hand-closed':
            this.#dom_html_element.classList.add('cursor-hand-closed');
            break;
        
        case 'knife':
            this.#dom_html_element.classList.add('cursor-knife');
            break;
            
        case 'pencil':
            this.#dom_html_element.classList.add('cursor-pencil');
            break;
        
        default:
            type_lowercase = 'pointer';
            this.#dom_html_element.classList.add('cursor-pointer');
        }
        
        this.#type = type_lowercase;
    }

    /**
     * 设置默认的鼠标样式
     */
    setCurosrDefault() {
        this.setCursor('pointer');
    }
}
