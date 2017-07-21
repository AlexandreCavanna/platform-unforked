module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/flowtype', 'prettier/react'],
  parser: 'babel-eslint',
  plugins: ['flowtype', 'import', 'react', 'jsx-a11y', 'jest'],
  globals: {
    $: true,
    screen: true,
    google: true,
    CKEDITOR: true,
    document: true,
    window: true,
    FormData: true,
    location: true,
    File: true,
    localStorage: true,
    fetch: true,
    Modernizr: true,
    jQuery: true,
    __SERVER__: true,
    ReactIntlLocaleData: true,
    // Flow vars
    HTMLInputElement: true,
    Element: true,
  },
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'flowtype/boolean-style': ['error', 'boolean'],
    'flowtype/define-flow-type': 1,
    'flowtype/generic-spacing': ['error', 'never'],
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-weak-types': ['error', { Object: false, Function: false }],
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-parameter-type': ['off'],
    'flowtype/require-return-type': [
      'off',
      'always',
      { annotateUndefined: 'never' },
    ],
    'flowtype/require-valid-file-annotation': 'error',
    'flowtype/semi': ['error', 'always'],
    'flowtype/space-after-type-colon': ['error', 'always'],
    'flowtype/space-before-generic-bracket': ['error', 'never'],
    'flowtype/space-before-type-colon': ['error', 'never'],
    'flowtype/type-id-match': 'off',
    'flowtype/union-intersection-spacing': ['error', 'always'],
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/require-default-props': 'off',
    'react/no-children-prop': 'off',
    'react/no-array-index-key': 'off',
    'react/no-unescaped-entities': 'off',
    'no-plusplus': 'off',
    'react/no-danger': 'off',
    'jsx-a11y/label-has-for': 'off',
    'react/forbid-prop-types': 'off',
    'class-methods-use-this': 'off',
    'react/no-unused-prop-types': 'off',
    'no-restricted-syntax': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'import/no-named-as-default': 'off',
    'import/imports-first': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/no-find-dom-node': 'off',
    'react/no-string-refs': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/self-closing-comp': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-no-bind': 'off',
    'no-duplicate-imports': 'off', // for flow type import
    'react/prefer-stateless-function': 'off',
    'react/require-extension': 'off',
    'react/prefer-es6-class': 'off',
    'no-underscore-dangle': 'off',
    'no-confusing-arrow': 'off',
    'no-nested-ternary': 'off',
    'arrow-body-style': 'off',
    'max-len': 'off',
    'react/style-prop-object': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'no-return-assign': 'off',
    'flowtype/define-flow-type': 'warn',
    'flowtype/use-flow-type': 1,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
};
