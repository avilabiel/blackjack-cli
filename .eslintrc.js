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
    // No way to not await in loop in a card game... or is there?
    'no-await-in-loop': 0,
    // TODO: Refactor class methods in order to not reassign params
    'no-param-reassign': [0, { props: false }],
    /*
      TODO: Check if we should refactor the while loops in main.ts & giving-cards.ts
      in order to not ignore this rule
    */
    'no-continue': 0,
    // TODO: Transform the violations for this rule into helper functions
    'class-methods-use-this': 0,
  },
};
