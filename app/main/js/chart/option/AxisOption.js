const option = {
    column: {
        chart: {},
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
                    text: ["첫번째", "두번째", "매지막"]
                }
            },
            y: {
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
                    option: {
                        position: "lc"
                    }
                },
                mark: {
                    major: {
                        unit: -1
                    },
                    minor: {
                        use: false,
                        unit: -1
                    }
                }
            }
        }
    }
};

export default option;
