/** @type {import("prettier").Config} */
module.exports = {
    tabWidth: 4,
    semi: false,
    printWidth: 80,
    trailingComma: "all",
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
    tailwindConfig: "./tailwind.config.cjs",
};
