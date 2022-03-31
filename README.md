# CD-VUE-TEMPLATE

> vue3 项目构建模板，基于模板进行 vue3 PC 端项目开发。

## 相关 plugin

- @vitejs/plugin-vue-jsx -D (提供单文件 jsx 支持)
- vite-svg-loader -D

## 配置 ui 组件

> vite 中手动导入插件 unplugin-element-plus

- pnpm add element-plus unplugin-element-plus -D

## 配置 axios

- pnpm add axios

## 配置 css 预处理器及 sass/scss

> Vite 内部已帮我们集成了相关的 loader，不需要额外配置

- pnpm add sass -D

> 配置 css @import 内联和变基 css 配置

- pnpm add postcss postcss-import postcss-html autoprefixer -D
- 配置 postcss.config.js

## 代码规范约束

### EditorConfig 规范约束

1. 在本地创建.editorconfig 文件并配置
2. vscode 搜索下载 EditorConfig for VS Code 插件

### 集成 Prettier 配置

1. pnpm add prettier -D

2. 根目录增加.prettierrc.js 配置

### 集成 ESLint 配置

1. pnpm add eslint -D
2. npx eslint --init 来创建配置文件
3. pnpm add i @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-prettier eslint-plugin-vue vue-eslint-parser @vue/eslint-config-prettier @vue/eslint-config-typescript -D

### 集成 husky

1. pnpm add husky -D
2. npx husky install

值 描述
feat 新增一个功能
fix 修复一个 Bug
docs 文档变更
style 代码格式（不影响功能，例如空格、分号等格式修正）
refactor 代码重构
perf 改善性能
test 测试
build 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）
ci 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等
chore 变更构建流程或辅助工具
revert 代码回退

### 配置 lint-staged

> lint-staged 这个工具一般结合 husky 来使用，它可以让 husky 的 hook 触发的命令只作用于 git add 那些文件（即 git 暂存区的文件），而不会影响到其他文件。

- pnpm add lint-staged -D

### 配置 style lint

- pnpm add stylelint stylelint-config-prettier stylelint-config-standard stylelint-order -D
- 配置.stylelintignore 文件
- packagejson 中增加配置
- .husky\lintstagedrc.js 和 stylelint.config.js 中增加配置

### 配置 pretty-quick

> 使用 pretty-quick 来进行 commit 校验，在这之前需要下载 commitlint 的相关依赖及 pretty-quick

- pnpm add pretty-quick -D
- pnpm add @commitlint/config-conventional @commitlint/cli -D
- packagejson 增加"lint:pretty": "pretty-quick --staged"命令行
- .husky\pre-commit 增加 pnpm lint:pretty 指令

### 进场动画

- @vueuse/motion

### 配置公共状态管理器

- pnpm add pinia

<!-- ### 可选链语法配置

如若需要可选链语法需要配置babel插件 -->

### 配置 Icon

安装

```
pnpm add @iconify/iconify --save
pnpm add vite-plugin-purge-icons @iconify/json -D
```

装配

```
import PurgeIcons from 'vite-plugin-purge-icons'

export default {
  plugins: [
    PurgeIcons({
      /* PurgeIcons Options */
    })
  ]
}
```

### 主题色样式配置方案

> 借助 vite 插件 ： @zougt/vite-plugin-theme-preprocessor 。 其本质原理可以简单认知为：每一种配色方案都在指定的 class 下，通过修改绑定在 body 下的类名实现样式的替换。在 vite 控制下进行热更新。

```js
pnpm add @zougt/vite-plugin-theme-preprocessor -D

// 配置修改element-plus公共参数所需插件
pnpm add css-color-function rgb-hex @ctrl/tinycolor
```
