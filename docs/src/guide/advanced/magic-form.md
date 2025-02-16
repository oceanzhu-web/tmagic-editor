# Magic-Form
魔方的表单配置，核心就是使用了 magic-form 来作为渲染器。magic-form 是一个 npm 包，可以安装它，在你想使用的地方单独使用。

Magic-Form 接受一个表单配置，详细配置可参考[表单api](/docs/api/form.md)。

## 安装

```bash
# 最新稳定版
$ npm install @tmagic/form@next
```

```bash
$ npm install element-plus
```

## 快速上手

本节将介绍如何在项目中使用 MagicForm。

### 引入 Magic-Form

MagicForm使用了element-ui库

在 main.js 中写入以下内容：

```javascript
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import MagicForm from '@tmagic/form';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementUI);
app.use(MagicForm);
app.mount('#app');
```

在 App.Vue 中写入以下内容：

```html
<m-form :config="config" :init-values="initValue"></m-form>

<script>
export default {
  data() {
    return {
      config: [{
        text: '文本',
        name: 'text'
      }, {
        type: 'number',
        text: '计数器',
        name: 'number'
      }, {
        type: 'row',
        items: [{
          type: 'date',
          text: '日期',
          name: 'date'
        }, {
          type: 'checkbox',
          text: '多选框',
          name: 'checkbox'
        }]
      }, {
        type: 'fieldset',
        name: 'fieldset',
        legend: '分组',
        items: [{
          type: 'select',
          text: '下拉选项',
          name: 'select',
          options: [
            { text: '选项1', value: 1 },
            { text: '选项2', value: 2 }
          ]
        }]
      }],
      initValue: {
        text: '文本',
        number: 10,
        fieldset: {
          select: 1
        }
      }
    }
  }
}
</script>
```

以上代码便完成了 MagicForm 的引入。需要注意的是，ElementUI的样式文件需要单独引入。

### 开始使用

至此，一个基于 Vue 和 MagicForm 的开发环境已经搭建完毕，现在就可以编写代码了。


### 示例

<demo-block type="form" :config="[{
  text: '文本',
  name: 'text'
}, {
  type: 'number',
  text: '计数器',
  name: 'number'
}, {
  type: 'row',
  items: [{
    type: 'date',
    text: '日期',
    name: 'date'
  }, {
    type: 'checkbox',
    text: '多选框',
    name: 'checkbox'
  }]
}, {
  type: 'fieldset',
  name: 'fieldset',
  legend: '分组',
  items: [{
    type: 'select',
    text: '下拉选项',
    name: 'select',
    options: [
      { text: '选项1', value: 1 },
      { text: '选项2', value: 2 }
    ]
  }]
}]">
</demo-block>
