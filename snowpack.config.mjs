// Example: snowpack.config.mjs
// The added "@type" comment will enable TypeScript type information via VSCode, etc.

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    exclude: ['**/server/**/*', '**/idea/**/*'],
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2020',
    },
};