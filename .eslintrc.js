module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'import/extensions': 0,
    // TODO: Create dedicated logger & get rid of this ESLint disable
    'no-console': 0,
    'no-await-in-loop': 0,
    'no-param-reassign': [0, { props: false }],
    'no-continue': 0,
    // TODO: Transform the violations from this rule into helper functions
    'class-methods-use-this': 0,
  },
};
