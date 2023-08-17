import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Setting,
    fetchPost,
    Protyle
} from "siyuan";
import { 
    createTriggerBlock, 
    openListInFloating
} from "./utils";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {

    async onload() {

        console.log('hello world')
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
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    onunload() {
        console.log(this.i18n.byePlugin);
        showMessage("Goodbye SiYuan Plugin");
        console.log("onunload");
    }

    addListHoverListener() {
        // 遍历折叠列表，添加鼠标悬浮监听事件
        const FOLD_LIST_SELECTOR = '.fn__flex .protyle-wysiwyg [data-node-id].li[fold="1"] > .p'
        let fold_lists = document.querySelectorAll(FOLD_LIST_SELECTOR);
        let eventBus = this.eventBus;
        fold_lists.forEach(function (element) {
            // 给每个列表创建一个触发块
            let triggerBlock = createTriggerBlock(element);
            // 监听鼠标移动到触发块事件
            triggerBlock.addEventListener('mouseenter', () => {
                eventBus.once('loaded-protyle', () => {
                    // 展开折叠的列表块
                    openListInFloating(element);
                });
            });
        })
    }
}
