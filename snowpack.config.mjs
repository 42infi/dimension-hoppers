export default {
    exclude: ['**/server/**/*', '**/.idea/**/*', '**/.git/**/*'],
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2020',
    },
};