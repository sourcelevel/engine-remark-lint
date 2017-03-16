module.exports = {
  'env': {
    'node': true,
    'mocha': true
  },
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  'rules': {
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'indent': ['error', 2, { 'VariableDeclarator': 2 }],
    'camelcase': 'error',
    'no-multi-spaces': 'off',
    'no-shadow': 'error',
    'no-eq-null': 'error',
    'no-extra-parens': 'error',
    'no-lonely-if': 'error',
    'no-nested-ternary': 'error',
    'no-param-reassign': 'error',
    'no-self-compare': 'error',
    'no-throw-literal': 'error',
    'no-void': 'error',
    'no-undef': 'error',
    'no-extra-semi': 'error',
    'no-underscore-dangle': 'off',
    'eqeqeq': 'error',
    'comma-style': ['error', 'last']
  }
};
