/**
 * 获取所有折叠列表
 * @returns 折叠列表段落集合
 */
export function getFoldList(): NodeListOf<Element> {
    const FOLD_LIST_SELECTOR = ".protyle-wysiwyg [data-node-id][fold='1'].li"
    return document.querySelectorAll(FOLD_LIST_SELECTOR)
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
    const floatLayers = Array.from(document.querySelectorAll(".block__popover"))
    const dataOids = floatLayers.map(node => node.getAttribute("data-oid"))
    // const dataLevels = floatingArray.map(node => parseInt(node.getAttribute("data-level")))
    // const maxIndex = dataLevels.indexOf(Math.max(...dataLevels))
    // const lastLevel = dataLevels[maxIndex]
    // const lastDataOid = dataOids[maxIndex]
    let floatLayerInfo: FloatLayerInfo = {
        floatLayers: floatLayers, 
        maxDataLevel: 0, 
        dataOids: dataOids, 
        lastDataOid: null, 
        lastFloatLayer: null, 
    }
    if (floatLayers.length > 0) {
        // 在 2.10.7 快速触发两个浮窗时，data-level 可能会重复
        const lastFloatLayer = floatLayers[floatLayers.length - 1]
        floatLayerInfo.lastFloatLayer = lastFloatLayer
        floatLayerInfo.lastDataOid = lastFloatLayer.getAttribute("data-oid")
        floatLayerInfo.maxDataLevel = parseInt(lastFloatLayer.getAttribute("data-level"))
    }
    return floatLayerInfo
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
        const options: AddEventListenerOptions = { passive: true }
        element.addEventListener(type, fun, options)
    } else if (element["attachEvent"]) {
        //判断浏览器有没 有attachEvent IE8的方法	
        element["attachEvent"]("on" + type, fun)
    } else {
        //如果都没有则使用 元素.事件属性这个基本方法
        element["on" + type] = fun
    }
}

/**
 * 为元素解绑监听事件
 * @param element   注册事件元素对象
 * @param type      注册事件名(不加on 如"click")
 * @param fun       回调函数
 */
export function removeEvent(element: Element, type: string, fun: EventListener) {
    if (element["addEventListener"]) {
        // 判断浏览器有没有addEventListener方法(addEventListener 方法专用删除方法)
        element.removeEventListener(type, fun)
    } else if (element["attachEvent"]) {
        // 判断浏览器有没有attachEvent IE8的方法(attachEvent 方法专用删除事件方法)
        element["detachEvent"]("on" + type, fun)
    } else {
        // 如果都没有则使用 元素.事件属性这个基本方法(删除事件用null)
        element["on" + type] = null
    }
}