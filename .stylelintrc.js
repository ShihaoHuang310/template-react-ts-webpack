// @see: https://stylelint.io
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      // 命名规范 -
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case'
      }
    ],
    'string-quotes': 'double', // 单引号
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': null,
    'at-rule-name-case': 'lower', // 指定@规则名的大小写
    'length-zero-no-unit': true, // 禁止零长度的单位（可自动修复）
    'shorthand-property-no-redundant-values': true, // 简写属性
    'number-leading-zero': 'always', // 小数不带0
    'declaration-block-no-duplicate-properties': true, // 禁止声明快重复属性
    'no-descending-specificity': true, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器。
    'selector-max-id': null, // 限制一个选择器中 ID 选择器的数量
    'max-nesting-depth': 10,
    'declaration-block-single-line-max-declarations': 1,
    'block-opening-brace-space-before': 'always',
    'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],
    indentation: [
      2,
      {
        // 指定缩进  warning 提醒
        severity: 'warning'
      }
    ],
    'order/order': ['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'],
    'order/properties-order': [
      // 规则顺序
      // ...  这块太长，去我 github repo 找吧
    ]
  }
}
