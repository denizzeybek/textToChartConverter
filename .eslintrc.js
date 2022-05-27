module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    //"vue", "standard", "plugin:vue/recommended"
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  //"plugins": ["import", "vue"],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    "vue/no-unused-components": "off",
    // "no-unused-vars": "off",
    "vue/no-unused-vars": "off"
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
