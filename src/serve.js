const esbuild = require("esbuild");
const config = require("./conf/config")

const args = (() => {
    const args = new Map();

    process.argv.forEach((d) => {
        try {
            const [k, v] = [...d.split("=")];
            args.set(k, v);
        } catch {}
    });

    return args;
})();

const buildContext = async (context = {}) => {
    return await esbuild.context(context);
};

const buildSync = (sync) => {
    esbuild.buildSync(sync);
};

const serve = async (context, option) => {
    await context.watch();
    await context.serve(option);
};

const getConfig = () => {
    const profile = args.get("--profile");
    return config(profile);
};

(async () => {
    try {
        const conf = getConfig();
        console.log(conf)
        const { context: _context, serve: _serve, sync: _sync } = { ...conf };
        buildSync(_sync);
        const context = await buildContext(_context);
        serve(context, _serve);
    } catch (err) {
        console.error("Failed to build client:", err);
        process.exit(1);
    }
})();
