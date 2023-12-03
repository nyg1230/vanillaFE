import NMMain from "js/custom/components/view/common/NMMain.js";
import NMLogin from "js/custom/components/view/login/NMLogin.js";
import NMSignIn from "js/custom/components/view/login/NMSignIn.js";
import NMBody from "js/custom/components/view/common/NMBody.js";
import NMHome from "js/custom/components/view/home/NMHome.js";

const route = {
    "main": NMMain,
    "main/login": NMLogin,
    "main/login/signin": NMSignIn,
    "main/body": NMBody,
    "main/body/home": NMHome
};

export default route;
