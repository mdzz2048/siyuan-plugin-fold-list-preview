/**
 * 获取所有折叠列表元素，用于创建触发块
 * @returns 折叠列表集合
 */
export function getFoldList(): NodeListOf<Element> {
    const FOLD_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id].li[fold="1"] > .p';
    return document.querySelectorAll(FOLD_LIST_SELECTOR);
}

/**
 * 获取所有被标记的列表块，用于在悬浮窗预览
 * @returns 列表块集合
 */
export function getPreviewList(): NodeListOf<Element> {
    const PREVIEW_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id][preview-list]';
    return document.querySelectorAll(PREVIEW_LIST_SELECTOR);
}

type FloatLayerInfo = {
    floatLayers: Element[], 
    maxDataLevel?: number, 
    dataOids?: string[],
    lastDataOid?: string, 
    lastFloatLayer?: Element, 
}
/**
 * 获取悬浮窗信息
 * @returns FloatLayerInfo
 */
export function getFloatLayerInfo(): FloatLayerInfo {
    const floatLayers = Array.from(document.querySelectorAll('.block__popover'));
    const dataOids = floatLayers.map(node => node.getAttribute('data-oid'));
    // const dataLevels = floatingArray.map(node => parseInt(node.getAttribute('data-level')));
    // const maxIndex = dataLevels.indexOf(Math.max(...dataLevels));
    // const lastLevel = dataLevels[maxIndex];
    // const lastDataOid = dataOids[maxIndex];
    let floatLayerInfo: FloatLayerInfo = {
        floatLayers: floatLayers, 
        maxDataLevel: 0, 
        dataOids: dataOids, 
        lastDataOid: null, 
        lastFloatLayer: null, 
    }
    if (floatLayers.length > 0) {
        // 在 2.10.7 快速触发两个浮窗时，data-level 可能会重复
        const lastFloatLayer = floatLayers[floatLayers.length - 1];
        floatLayerInfo.lastFloatLayer = lastFloatLayer;
        floatLayerInfo.lastDataOid = lastFloatLayer.getAttribute('data-oid');
        floatLayerInfo.maxDataLevel = parseInt(lastFloatLayer.getAttribute('data-level'));
    }
    return floatLayerInfo;
}

/**
 * 给指定折叠列表元素创建一个用于触发悬浮窗口的触发块
 * @param element   折叠列表元素，使用 querySelectorAll 获取
 * @returns         触发块
 */
export function createTriggerBlock(element: Element) {
    // 创建触发块
    let parentElement = element.parentElement;
    let previewID = parentElement.getAttribute('data-node-id');
    let triggerBlock = parentElement.lastElementChild.id === `preview-${previewID}`
        ? parentElement.lastElementChild
        : insertElement(parentElement, 'span', `preview-${previewID}`);
    // 触发块定位: 显示在 (· · ·) 位置
    let childElement = element.firstElementChild;
    let locationBlock = insertElement(childElement, 'span');
    let left = locationBlock.offsetLeft;
    let top = locationBlock.offsetTop;
    locationBlock.remove();
    
    // `left: 39px` 说明：.protyle-action 图标宽度: 34 px, 折叠样式 margin-left: 5 px
    triggerBlock.setAttribute('style', `top: ${top}px; left: ${left + 39}px;`)
    // 设置标记属性，用于后续检查折叠状态
    triggerBlock.setAttribute('trigger-block', 'true')
    parentElement.setAttribute('preview-list', 'true');
    
    return triggerBlock;
}

/**
 * 移除预览标记/触发块
 * @param element   标记的列表块
 * @param removeAll 移除触发块
 */
export function removeTriggerBlock(element: Element, removeAll: boolean) {
    // 清除标记属性
    element.removeAttribute('preview-list');
    // 清除触发块
    if (removeAll) {
        const childElements = element.children;
        for (let index = 0; index < childElements.length; index++) {
            let childElement = childElements[index];
            if (childElement.hasAttribute('trigger-block')) {
                childElement.remove();
            }
        }
    }
}

/**
 * 展开折叠列表
 * @param element   折叠列表元素，使用 querySelectorAll 获取
 */
export function openListInFloating(element: Element) {
    // 获取最后打开的悬浮窗 (data-level 最大值)
    const floatLayerInfo = getFloatLayerInfo();
    const previewID = element.parentElement.getAttribute('data-node-id');
    const previewElement = floatLayerInfo.lastFloatLayer.querySelector(`[data-node-id="${previewID}"]`);
    if (previewElement != null) {
        const isFold = previewElement.getAttribute('fold');
        if (isFold === '1') previewElement.setAttribute('fold', '0');
    } else {
        // console.log(floatLayerInfo);
        // console.log(previewID);
    }
}

/**
 * 为元素注册监听事件
 * @param element   监听元素
 * @param type      需要监听的事件
 * @param fun       回调函数
 */
export function addEvent(element: Element, type: string, fun: EventListener) {
    if (element.addEventListener) {
        //判断浏览器有没有addEventListener方法
        const options: AddEventListenerOptions = {
            passive: true
        }
        element.addEventListener(type, fun, options);
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
export function removeEvent(element: Element, type: string, fun: EventListener) {
    if (element['addEventListener']) {
        // 判断浏览器有没有addEventListener方法(addEventListener 方法专用删除方法)
        element.removeEventListener(type, fun);
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