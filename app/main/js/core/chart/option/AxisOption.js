const option = {
    axis: {
        x: {
            title: {
                text: "",
                param: {
                    style: {
                        font: "bold 18px auto"
                    },
                    option: {
                        position: "cc"
                    }
                }
            },
            label: {
                style: {
                    font: "bold 12px auto"
                },
                option: {
                    position: "lc",
                    rotate: 315
                }
            },
            tooltip: {
                text: []
            }
        },
        ly: {
            title: {
                text: "",
                param: {
                    style: {
                        font: "bold 18px auto"
                    }
                }
            },
            label: {
                style: {
                    font: "bold 14px auto"
                },
                option: {}
            },
            mark: {
                unit: "",
                format: "",
                major: {
                    value: -1
                },
                minor: {
                    use: false,
                    value: -1
                }
            },
            info: {
                min: Number.MAX_SAFE_INTEGER,
                max: -Number.MAX_SAFE_INTEGER
            }
        },
        ry: {
            title: {
                text: "",
                param: {
                    style: {
                        font: "bold 18px auto"
                    }
                }
            },
            label: {
                style: {
                    font: "bold 14px auto"
                },
                option: {}
            },
            mark: {
                unit: "",
                format: "",
                major: {
                    value: -1
                },
                minor: {
                    use: false,
                    value: -1
                }
            },
            info: {
                min: Number.MAX_SAFE_INTEGER,
                max: -Number.MAX_SAFE_INTEGER
            }
        }
    }
};

export default option;
