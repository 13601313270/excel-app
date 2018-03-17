// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        // 'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue', 'html'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "indent": [2, 4, {
            "SwitchCase": 1
        }],
        // 大括号样式
        "brace-style": ['off'],
        // 要求调用无参构造函数时带括号
        'new-parens': 'error',
        // 函数定义时括号前面要不要有空格
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "never"
        }],
        'semi':["off", "always"],
        'no-eval':['off']
    }
}
