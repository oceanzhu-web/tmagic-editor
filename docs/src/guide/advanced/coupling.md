# 联动原理
魔方的联动，指这两种情况：
- 在编辑器中，组件的表单配置项之间需要联动。
- 页面中的组件之间，需要联动触发行为。

## 表单联动
表单的详细内容，可以参考[Magic-Form](/docs/guide/advanced/magic-form)。我们通过 [JS Schema](/docs/guide/advanced/js-schema) 描述的表单配置，实现联动的方式，就是写一个简单 js 函数。

比如下面的例子，我们希望改变选项时，同时改变文本框的内容。

<demo-block type="form" :config="`[{
  text: '文本',
  name: 'text'
}, {
  type: 'select',
  text: '下拉选项',
  name: 'select',
  options: [
    { text: '选项1', value: 1 },
    { text: '选项2', value: 2 }
  ],
  onChange: (vm, value, { model }) => {
    model.text = value;
  }
}]`">
</demo-block>

在经过表单渲染器时，所有指出函数 API 都会传入当前渲染的**表单组件实例(vm)**，**当前项目(value)**，**当前表单model**，**表单值formValue**，model 即 vue 的[表单输入绑定](https://cn.vuejs.org/v2/guide/forms.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model)，可以通过修改他来实现值联动。

当然我们也可以通过上述的参数传入，以及其他函数 API 实现更多灵活的表单联动，具体参考[表单 API](/docs/api/base-config)。

## 组件联动
魔方在 @tencent/magic-core 中，实现了组件的事件绑定/分发机制。在组件渲染时，每个组件在 Magic-UI 中经过基础组件渲染时，会被基础组件注入公共方法的实现。如下对按钮配置了**点击使文本隐藏**的联动事件，那么在对应按钮被点击时，将会触发对应绑定文本的隐藏。

<img src="https://image.video.qpic.cn/oa_88b7d-10_2117738923_1637238863127559">

### 添加组件自定义事件
如何开发一个完整组件可以参考[组件开发](/docs/component/introduction)，这一节我们主要讲述如何配置定义事件。

在组件开发过程中，我们可以通过声明组件中的 event 文件，在文件中描述当前组件可以配置的事件名，和可以被触发的动作。
```javascript
// event.js
export default {
  events: [
    {
      label: '完成某事件',
      value: 'yourComponent:finishSomething',
    },
  ],
  methods: [
    {
      label: '弹出 Toast',
      value: 'toast',
    },
  ],
};

```
其中，events 的 value 是个事件名，是 `string` 类型，未了避免和其他组件事件名重复，应该添加上一些前缀。

而 methods 中的 value 则是一个挂载在组件上的可执行函数。我们会在事件触发时，分发到对应组件上，并执行对应组件实例上的方法。

配置了上述内容的组件，在编辑器中选中当前组件，要触发其他组件的联动事件时，会有如下选项

<img src="https://image.video.qpic.cn/oa_88b7d-32_1191352525_1637240258489761">

在被其他组件选中为联动组件，要触发联动事件，会有如下选项

<img src="https://image.video.qpic.cn/oa_fd3c9c-3_214972289_1637240375129207">

### 组件中的代码实现
如上面提到的，我们定制了**完成某件事**这个事件，以及要提供一个**弹出 Toast**的方法。在组件中必要的实现内容如下。

#### vue 版本实现
我们主要讲解 vue3 的 setup 实现。vue2 可以根据 vue3 同理转换成 options api 实现即可。

```vue
<!-- Test.vue -->
<template>
  <div @click="onClick">
    <!-- your component code -->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'magic-ui-test',

  setup(props) {
    const app: Core | undefined = inject('app');
    const hoc = inject('hoc');

    // 此处实现事件动作
    // 由于组件在 Magic-UI 中通过基础组件 Component 来封装，即每个组件其实都被 Component 包裹
    // 实际触发时，会触发到当前组件的直属父组件 Component 上，我们会 provide 这个父组件为高阶组件 hoc
    // 所以将 toast 方法挂载到当前组件的父组件上
    hoc.toast = (/*接收触发事件组件传进来的参数*/) => {
      toast('测试 vue3')
    };

    return {
      // 此处实现触发事件
      onClick: () => {
        // app.emit 第一个参数为事件名，其余参数为你要传给接受事件组件的参数
        app?.emit("yourComponent:finishSomething", /*可以传参给接收方*/);
      },
    };
  },
});
</script>
```

::: tip 
在用 vue 实现的 组件中，我们通过 inject 方式来提供核心 app 和高阶组件 hoc。调用联动事件方法时，魔方是通过组件的 ref，并直接调用当前组件的方法。
:::

#### react 版本实现
在 react 的实现中，由于魔方提供的 Magic-UI react 版本是用 hook 实现的。所以组件开发我们也相应的需要使用 hook 方式。

```jsx
import React from 'react';

import { useApp } from '@tencent/magic-ui-react';

function Test({ config }) {
  // react 和 vue 实现不同，我们通过 useApp 这个 hook 来提供 app, ref 等核心内容
  // 其中 ref 需要绑定到你的组件上作为 ref。因为一些公共事件会需要使用到你的组件 dom
  // 同时这个 ref 也会在魔方的高级函数钩子中，将你的组件 dom 作为参数提供给自定义钩子
  const { app, ref } = useApp({
    config,
    // 此处实现事件动作
    // 通过向 useApp 这个 hook 提供 methods 方法
    // 魔方会将该事件注册到事件机制中，在对应事件响应被触发时调用对应方法
    methods: {
      toast: (/*接收触发事件组件传进来的参数*/) => {
        toast('测试 react');
      },
    },
  });

  const onClickFunc = () => {
    // app.emit 第一个参数为事件名，其余参数为你要传给接受事件组件的参数
    app?.emit("yourComponent:finishSomething", /*可以传参给接收方*/);
  }

  return (
    <div 
      ref={ref}
      id={config.id}
      style={app.transformStyle(config.style || {})}
      onClick={onClick}
    >
      // your component code
    </div>
  );
}

export default Test;
```

::: tip 
react 的实现方式需要开发者通过 useApp 来获得我们提供的核心 app 和一个 ref，这个 ref 是需要开发者绑定到组件上的。和 vue 不同，react 的 dom 实例需要用户指定。

而需要这个 ref 的原因，是在公共事件执行时，可能会需要 dom 实例来进行操作；或者用户使用高级函数时，我们会向用户传入组件的 dom 实例给开发者使用。
:::

按照上述实现触发事件和事件动作，就可以完成组件的联动事件分发响应。


