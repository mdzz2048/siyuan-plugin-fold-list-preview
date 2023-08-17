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

    private customTab: () => IModel;
    private isMobile: boolean;

    async onload() {

        console.log('hello world')
        // this.eventBus.on('ws-main', (event) => {
        //     if (event.detail['cmd'] === 'backgroundtask') {
        //         console.log('背景触发事件')
        //         console.log(event);
        //     } else {
        //         console.log(event);
        //     }
        // })
        // this.eventBus.on('loaded-protyle', (event) => {
        //     console.log('编辑器加载: ');
        //     console.log(event);
        // })
        // this.eventBus.on('click-editorcontent', (event) => {
        //     console.log('编辑器点击: ');
        //     // console.log(event);
        // })
        // todo: 设置触发条件
        this.addListHoverListener();
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
        const FOLD_LIST_SELECTOR = '.protyle-wysiwyg [data-node-id].li[fold="1"] > .p'
        let fold_lists = document.querySelectorAll(FOLD_LIST_SELECTOR);
        let eventBus = this.eventBus;
        fold_lists.forEach(function (element) {
            console.log(element);
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

    removeListHoverListener() {
        // 遍历标记过的折叠列表，移除鼠标悬浮监听事件

    }
}
