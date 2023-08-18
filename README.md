The plug-in adds a preview function to the collapsed list.

1. Add the following code in the code snippet to add the list collapse enhancement style

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

2. Open the plug-in, move the mouse to the list enhancement style, the plug-in will automatically open the hover window to preview the collapsed list content

Trigger mechanism:

1. Background auto-trigger, about 5s once
2. Click the editor trigger

Reference has been removed theme [HBuilderX-Light](https://github.com/UFDXD/HBuilderX-Light) production