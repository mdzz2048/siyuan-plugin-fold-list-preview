import { Plugin } from "siyuan";
import { 
    addEvent, 
    removeEvent, 
    createTriggerBlock, 
    getFloatLayerInfo,
    openListInFloating,
    getFoldList,
    getPreviewList,
    removeTriggerBlock
} from "./utils";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {

    Listener = this.listener.bind(this);

    async onload() {
        this.eventBus.once('loaded-protyle', () => {
            this.addListHoverListener();
        })
        this.eventBus.on('loaded-protyle-dynamic', () => {
            this.addListHoverListener();
        })
        this.eventBus.on('click-editorcontent', () => {
            this.addListHoverListener();
        })
    }

    onLayoutReady() {
        this.loadData(STORAGE_NAME);
    }
    
    onunload() {
        this.eventBus.once('loaded-protyle', () => {
            this.removeListHoverListener();
        })
        this.eventBus.on('loaded-protyle-dynamic', () => {
            this.removeListHoverListener();
        })
        this.eventBus.on('click-editorcontent', () => {
            this.removeListHoverListener();
        })
        console.log(this.i18n.byePlugin);
    }
    
    addListHoverListener() {
        const foldLists = getFoldList();
        const previewLists = getPreviewList();
        
        // 更新触发块: 列表展开后，清除事件和触发块
        previewLists.forEach((element) => {
            const isFold = element.getAttribute('fold');
            removeTriggerBlock(element, isFold === null || isFold === '0');
        })
        // 注册监听事件
        foldLists.forEach((element) => {
            const triggerBlock = createTriggerBlock(element);
            addEvent(triggerBlock, 'mouseenter', this.Listener);
            addEvent(triggerBlock, 'click', this.Listener);
        })
    }

    removeListHoverListener() {
        const foldLists = getFoldList();
        const previewLists = getPreviewList();
        
        // 移除所有触发块
        previewLists.forEach((element) => {
            removeTriggerBlock(element, true);
        })
        // 移除所有监听事件
        foldLists.forEach((element) => {
            const triggerBlock = createTriggerBlock(element);
            removeEvent(triggerBlock, 'mouseenter', this.Listener);
            removeEvent(triggerBlock, 'click', this.Listener);
        })
    }

    listener(event: MouseEvent) {
        let element = event.target as Element;
        // 加载 protyle 窗口不重复触发显示窗口
        if (element.textContent != "siyuan-plugin-fold-list-preview") {
            const blockId = element.parentElement.getAttribute('data-node-id');
            this.showPreviewList(blockId, event);
            this.eventBus.once('loaded-protyle', () => {
                //todo: 有时候悬浮窗打开太慢了，触发不及时会报错，暂时没找到解决方案
                openListInFloating(element)
            })
        }
    }

    showPreviewList(blockId: BlockId, event: MouseEvent) {
        // 通过悬浮窗预览
        event.stopPropagation();
        const floatLayerInfo = getFloatLayerInfo();
        const dataOids = floatLayerInfo.dataOids;
        const options = {
            ids: [blockId], 
            x: event.clientX, 
            y: event.clientY,  
        }
        // 不重复预览相同列表
        if (dataOids.indexOf(blockId) == -1) { this.addFloatLayer(options) }
    }
}
