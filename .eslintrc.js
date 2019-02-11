// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    node: true
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  rules: {
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    "no-param-reassign": [
      "error",
      {
        props: true
      }
    ],
    "lines-between-class-members": ["off"],
    "@typescript-eslint/explicit-member-accessibility": ["off"],
    "@typescript-eslint/no-useless-constructor": ["warning"],
    "no-useless-constructor": ["off"],
    "import/no-unresolved": ["off"],
    "import/prefer-default-export": ["off"],
    // allow optionalDependencies
    "no-mixed-operators": ["off"],
    "arrow-parens": ["warn", "as-needed"],
    "comma-dangle": ["warn", "never"],
    "no-underscore-dangle": ["off"],
    "no-continue": ["off"],
    "no-restricted-syntax": [
      "error",
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
      }
    ],
    quotes: [
      "warn",
      "single",
      {
        allowTemplateLiterals: true
      }
    ],
    "max-len": ["warn", { code: 120 }],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
