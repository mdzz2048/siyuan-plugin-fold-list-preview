/**
 * 给指定折叠列表元素创建一个用于触发悬浮窗口的触发块
 * @param element   折叠列表元素，使用 querySelectorAll 获取
 * @returns         触发块
 */
export function createTriggerBlock(element: Element) {
    // 创建触发块
    let parentElement = element.parentElement;
    let triggerBlock = insertElement(parentElement, 'div');
    let previewID = parentElement.getAttribute('data-node-id');
    
    // 触发块内创建思源超链接
    triggerBlock.innerHTML = `<span data-type='a' class='list-A' data-href=siyuan://blocks/${previewID}>####</span>`
    
    // 触发块定位: 显示在 (· · ·) 位置
    let childElement = element.firstElementChild;
    let locationBlock = insertElement(childElement, 'span');
    let left = locationBlock.offsetLeft;
    let top = locationBlock.offsetTop;
    locationBlock.remove();

    triggerBlock.style.display = 'flex';
    triggerBlock.style.position = 'absolute';
    triggerBlock.style.top = top + 'px';
    // .protyle-action 图标宽度: 34 px, 折叠样式 margin-left: 9 px
    triggerBlock.style.left = (left + 43) + 'px';  
    triggerBlock.style.opacity = '0';   // 默认隐藏超链接

    return triggerBlock;
}

/** */
export function openListInFloating(element: Element) {
    // 在悬浮窗打开折叠的列表
    let previewID = element.parentElement.getAttribute('data-node-id');
    let previewElement = document.querySelector(`.block__popover .protyle-wysiwyg [data-node-id="${previewID}"]`);
    previewElement.setAttribute('fold', '0');
}

/**
 * 为元素注册监听事件
 * @param element   监听元素
 * @param type      需要监听的事件
 * @param fun       回调函数
 */
export function addEvent(element: HTMLElement, type: string, fun: EventListenerObject) {
    if (element.addEventListener) {
        //判断浏览器有没有addEventListener方法
        element.addEventListener(type, fun, false);
    } else if (element['attachEvent']) {
        //判断浏览器有没 有attachEvent IE8的方法	
        element['attachEvent']("on" + type, fun);
    } else {
        //如果都没有则使用 元素.事件属性这个基本方法
        element["on" + type] = fun;
    }
}

/**
 * 为元素解绑监听事件
 * @param element   注册事件元素对象
 * @param type      注册事件名(不加on 如"click")
 * @param fun       回调函数
 */
export function removeEvent(element: HTMLElement, type: string, fun: EventListenerObject) {
    if (element['addEventListener']) {
        // 判断浏览器有没有addEventListener方法(addEventListener 方法专用删除方法)
        element.removeEventListener(type, fun, false);
    } else if (element['attachEvent']) {
        // 判断浏览器有没有attachEvent IE8的方法(attachEvent 方法专用删除事件方法)
        element['detachEvent']("on" + type, fun);
    } else {
        // 如果都没有则使用 元素.事件属性这个基本方法(删除事件用null)
        element["on" + type] = null;
    }
}

/**
 * 向指定父级创建追加一个子元素，并可选添加ID,
 * @param parentElement 父级元素
 * @param addElementTag 要创建的元素标签
 * @param setId         设置元素 ID
 */
export function insertElement(parentElement: Node, addElementTag: string, setId: string = null) {
    if (!parentElement) console.error("指定元素对象不存在！");
    if (!addElementTag) console.error("未指定字符串！");

    let element = document.createElement(addElementTag);

    if (setId) element.id = setId;

    parentElement.appendChild(element);

    return element;
}