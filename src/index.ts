import { Plugin } from "siyuan";
import { 
    addEvent, 
    removeEvent, 
    createTriggerBlock, 
    openListInFloating
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
        const FOLD_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id].li[fold="1"] > .p';
        const PREVIEW_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id][previewList]';
        let foldLists = document.querySelectorAll(FOLD_LIST_SELECTOR);
        let previewList = document.querySelectorAll(PREVIEW_LIST_SELECTOR);
        
        // 检查列表是否恢复未折叠状态，若恢复，则清除事件和触发块
        for (let index = 0; index < previewList.length; index++) {
            let element = previewList[index];
            let isFold = element.getAttribute('fold');
            let childElements = element.children;

            if (isFold === null || isFold === '0') {
                // 清除标记属性
                element.removeAttribute('previewList');
                // 清除触发块
                for (let index = 0; index < childElements.length; index++) {
                    let childElement = childElements[index];
                    if (childElement.hasAttribute('triggerBlock')) {
                        childElement.remove();
                    }
                }
            }
        }
        
        for (let index = 0; index < foldLists.length; index++) {
            let element = foldLists[index];
            // 给每个列表创建一个触发块
            let triggerBlock = createTriggerBlock(element);
            // 重新注册鼠标悬浮事件
            addEvent(triggerBlock, 'mouseenter', this.Listener);
        }
    }

    removeListHoverListener() {
        const FOLD_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id].li[fold="1"] > .p';
        const foldLists = document.querySelectorAll(FOLD_LIST_SELECTOR);
        const PREVIEW_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id][previewList]';
        const previewList = document.querySelectorAll(PREVIEW_LIST_SELECTOR);
        
        // 移除所有触发块
        previewList.forEach((element) => {
            const childElements = element.children;
            // 清除标记属性
            element.removeAttribute('previewList');
            // 清除触发块
            for (let index = 0; index < childElements.length; index++) {
                let childElement = childElements[index];
                if (childElement.hasAttribute('triggerBlock')) {
                    childElement.remove();
                }
            }
        })
        // 移除所有监听器
        foldLists.forEach((element) => {
            const triggerBlock = createTriggerBlock(element);
            removeEvent(triggerBlock, 'mouseenter', this.listener);
        })
    }

    listener(event: Event) {
        let element = event.target as Element;
        // 加载 protyle 窗口不触发展开列表
        if (element.textContent != "siyuan-plugin-fold-list-preview") {
            // 编辑器加载完后，展开折叠的列表块
            this.eventBus.once('loaded-protyle', () => {
                // todo: 有时候切换的太快了，触发不及时会报错，暂时没找到解决方案
                openListInFloating(element);
            });
        }
    }
}
