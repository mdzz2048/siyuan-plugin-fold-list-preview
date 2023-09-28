该插件为折叠列表添加预览功能。

鼠标移动到 "· · ·" 的位置，或点击这个图标就可以在悬浮窗预览折叠列表的内容。

插件内置折叠列表样式，可通过代码片段、主题修改，元素选择器如下：

```css
.protyle-wysiwyg [data-node-id].li[fold="1"]>.p>[spellcheck]:not(.fn__flex-1.history__text.protyle  [data-node-id].li[fold="1"]>.p>[spellcheck])::after
```

已知插件会对编辑器产生的影响：

在下图这种情况下：

正常编辑按一次 ↑ 会跳到上一个列表的开头(“折叠列表测试”)，使用插件后需要按两次。

正常编辑按一次 ← 会跳到上一个列表的结尾，使用插件后需要按两次。

![Alt text](./public/image.png)

参考已下架主题 [HBuilderX-Light](https://github.com/UFDXD/HBuilderX-Light) 制作