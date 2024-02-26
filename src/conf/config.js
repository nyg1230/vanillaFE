const config = (profile) => {
    return merge(
        {
            context: {
                bundle: true,
                sourcemap: true,
                logLevel: "info",
            },
            serve: {
                host: "0.0.0.0",
                port: 8000,
            }
        },
        getProfile(profile)
    );
};

const getProfile = (profile) => {
    let conf;

    try {
        conf = require(`./${profile}`);
    } catch {
        conf = {};
        console.log("not exist profile...");
    }

    return conf;
}

const merge = (...args) => {
    const [o, ...objs] = [...args];

    objs.forEach((obj) => {
        Object.entries(obj).forEach(([k, v]) => {
            typeof v !== "object" || v.length ? (o[k] = v) : (!o[k] && (o[k] = {})) & merge(o[k], v);
        });
    });

    return o;
}

module.exports = config;
