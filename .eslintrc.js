module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    // Ref sugar (take 2)
    $: "readonly",
    $$: "readonly",
    $ref: "readonly",
    $shallowRef: "readonly",
    $computed: "readonly",

    // index.d.ts
    // global.d.ts
    Fn: "readonly",
    PromiseFn: "readonly",
    RefType: "readonly",
    LabelValueOptions: "readonly",
    EmitType: "readonly",
    TargetContext: "readonly",
    ComponentElRef: "readonly",
    ComponentRef: "readonly",
    ElRef: "readonly",
    global: "readonly",
    ForDataType: "readonly",
    ComponentRoutes: "readonly",

    // script setup
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/eslint-config-typescript"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // any
    "no-debugger": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", // setup()
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-explicit-emits": "off",
    "vue/multi-word-component-names": "off",
    // 开发阶段暂时隐去无用参数的规则，项目完整后开启
    // "@typescript-eslint/no-unused-vars": [
    //   "warning",
    //   {
    //     argsIgnorePattern: "^_",
    //     varsIgnorePattern: "^_"
    //   }
    // ],
    // "no-unused-vars": [
    //   "error",
    //   {
    //     argsIgnorePattern: "^_",
    //     varsIgnorePattern: "^_"
    //   }
    // ]
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ]
  }
};
