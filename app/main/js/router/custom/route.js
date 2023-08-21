import NMMain from "main/component/custom/view/common/NMMain.js";
import NMBody from "main/component/custom/view/common/NMBody.js";
import NMHome from "main/component/custom/view/home/NMHome.js";

const route = {
    "main": NMMain,
    "main/body": NMBody,
    "main/body/home": NMHome,
    // "main/body/boards": NMBoardList,
    // "main/body/board": NMBoard,
    // "main/body/statistics": NMStatistics
    // "main/modal"
};

export default route;
