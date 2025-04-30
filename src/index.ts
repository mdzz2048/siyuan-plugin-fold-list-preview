import { Plugin } from "siyuan"
import { 
    addEvent, 
    removeEvent, 
    getFloatLayerInfo,
    getParagraphInFoldList,
} from "./utils"

let plugin: PreviewList
const throttledHandler = throttle(handleMouseMove, 100) // 100ms 节流

// 原始处理函数（判断坐标并触发弹窗）
function handleMouseMove(event: MouseEvent) {
    
    const rect = this.getBoundingClientRect() // 父元素的位置和尺寸
    const style = getComputedStyle(this) // 获取父元素的样式
    const pseudoWidth = parseFloat(style.getPropertyValue("--pseudo-width"))
    const pseudoHeight = parseFloat(style.getPropertyValue("--pseudo-height"))
  
    // 计算伪元素的左上角相对于父元素的位置
    const pseudoLeft = rect.width - pseudoWidth
    const pseudoTop = rect.height - pseudoHeight
  
    // 获取鼠标相对于父元素的位置
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
  
    // 判断鼠标是否在伪元素区域内
    const isInside = (
        mouseX >= pseudoLeft &&
        mouseX <= pseudoLeft + pseudoWidth &&
        mouseY >= pseudoTop &&
        mouseY <= pseudoTop + pseudoHeight
    )
  
    if (isInside) {
        // console.log("鼠标在伪元素上，触发弹窗！")
        const paragraph = (event.target as Element).parentElement
        const blockId = paragraph.parentElement.getAttribute("data-node-id")
        openFloatLayer(blockId, event)
    } else {
        // console.log("鼠标离开伪元素区域")
    }
}

function throttle(func: { (event: MouseEvent): void; apply?: any }, wait: number) {
    let canRun = true // 节流开关
    return function (...args: any) {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
            func.apply(this, args)
            canRun = true // 重置开关
        }, wait)
    }
}

function openFloatLayer(blockId: string, event: MouseEvent) {
    event.stopPropagation()
    const floatLayerInfo = getFloatLayerInfo()
    const dataOids = floatLayerInfo.dataOids
    const options = {
        ids: [blockId], 
        x: event.clientX, 
        y: event.clientY,  
    }
    // 不重复预览相同列表
    if (dataOids.indexOf(blockId) == -1) { plugin.addFloatLayer(options) }
    // 展开浮窗内折叠列表
    plugin.eventBus.once("loaded-protyle-static", () => {
        const paragraph = (event.target as Element).parentElement
        const previewID = paragraph.parentElement.getAttribute("data-node-id")
        const floatLayerInfo = getFloatLayerInfo()
        const previewElement = floatLayerInfo?.lastFloatLayer?.querySelector(`[data-node-id="${previewID}"]`)
        if (previewElement != null) {
            const isFold = previewElement.getAttribute("fold")
            if (isFold === "1") previewElement.setAttribute("fold", "0")
        } else {
            console.log(floatLayerInfo)
            console.log(previewID)
        }
    })
}

function usePlugin(pluginProps?: PreviewList) {
    if (pluginProps) plugin = pluginProps
    if (!plugin && !pluginProps) console.log("need bind plugin")
    return plugin
}

export default class PreviewList extends Plugin {

    async onload() {
        this.eventBus.once("loaded-protyle-static", () => {
            this.addListHoverListener()
        })
        this.eventBus.on("loaded-protyle-dynamic", () => {
            this.addListHoverListener()
        })
        this.eventBus.on("click-editorcontent", () => {
            this.addListHoverListener()
        })
        plugin = usePlugin(this)
    }
    
    onunload() {
        this.eventBus.once("loaded-protyle-static", () => {
            this.removeListHoverListener()
        })
        this.eventBus.on("loaded-protyle-dynamic", () => {
            this.removeListHoverListener()
        })
        this.eventBus.on("click-editorcontent", () => {
            this.removeListHoverListener()
        })
        console.log(this.i18n.byePlugin)
    }
    
    addListHoverListener() {
        const foldLists = getParagraphInFoldList()
        foldLists.forEach((element) => {
            // 注册监听事件
            addEvent(element.firstElementChild, "mousemove", throttledHandler)
            addEvent(element.firstElementChild, "click", throttledHandler)
            // 设置标记属性，用于后续检查折叠状态
            element.parentElement.setAttribute("preview-list", "true")
        })
    }

    removeListHoverListener() {
        const foldLists = getParagraphInFoldList()
        foldLists.forEach((element) => {
            // 移除所有监听事件
            removeEvent(element.firstElementChild, "mousemove", throttledHandler)
            removeEvent(element.firstElementChild, "click", throttledHandler)
            // 移除所有标记属性
            element.parentElement.removeAttribute("preview-list")
        })
    }
}