class NMIntent {
    model;

    constructor() {}

    set(props, value) {
        try {
            this.model.set(props, value);
        } catch {}
    }
}

export default NMIntent;
