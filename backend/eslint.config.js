const js = require("@eslint/js");

module.exports = [
    {
        ignores: ["node_modules/**"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly"
            }
        },
        rules: {
            ...js.configs.recommended.rules
        }
    }
];
