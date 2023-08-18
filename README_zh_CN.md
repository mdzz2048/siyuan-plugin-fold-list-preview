该插件为折叠列表添加预览功能。

1. 在代码片段加入以下代码，添加列表折叠增强样式

  ```css
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h1>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h1>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h2>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h2>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h3>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h3>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h4>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h4>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h5>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h5>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.h6>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.h6>[spellcheck])::after,
  .protyle-wysiwyg [data-node-id].li[fold="1"]>.p>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.p>[spellcheck])::after {
      content: "  · · ·  ";
      font-family: "Trebuchet MS";
      display: inline;
      font-weight: bold;
      vertical-align: 5%;
      font-size: 75%;
      color: rgb(95, 99, 104);  
      word-break: break-all;
      border: 1px solid rgb(95, 99, 104);
      margin-left: 9px;
      border-radius: 5px;
  }
  ```

2. 开启本插件，将鼠标移动至列表增强样式处，插件会自动打开悬浮窗以预览折叠列表内容

触发机制：

1. 后台自动触发，大约 5s 一次
2. 点击编辑器触发