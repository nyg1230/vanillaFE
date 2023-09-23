import NMMain from "js/custom/components/view/common/NMMain.js";
import NMBody from "js/custom/components/view/common/NMBody.js";
import NMHome from "js/custom/components/view/home/NMHome.js";

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