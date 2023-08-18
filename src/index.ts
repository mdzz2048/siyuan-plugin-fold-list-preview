import {
    Plugin,
    App,
    I18N
} from "siyuan";
import { 
    addEvent, 
    removeEvent, 
    createTriggerBlock, 
    openListInFloating
} from "./utils";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {
    constructor(app: App, name: string, i18n: I18N) {
        super({
            app: app,
            name: name,
            i18n: i18n
        });
        this.listener = this.listener.bind(this);
    }

    async onload() {
        this.eventBus.on('ws-main', (event) => {
            if (event.detail['cmd'] === 'backgroundtask') {
                this.addListHoverListener();
            }
        })
        this.eventBus.on('click-editorcontent', () => {
            this.addListHoverListener();
        })
    }

    onLayoutReady() {
        this.loadData(STORAGE_NAME);
    }
    
    onunload() {
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
            removeEvent(triggerBlock, 'mouseenter', this.listener);
            addEvent(triggerBlock, 'mouseenter', this.listener);
        }
    }

    listener(event: Event) {
        let element = event.target as Element;
        // 编辑器加载完后，展开折叠的列表块
        this.eventBus.once('loaded-protyle', () => {
            setTimeout(() => { 
                openListInFloating(element) 
            }, 100);
        });
    }
}
