import NMMain from "js/custom/components/view/common/NMMain.js";
import NMLogin from "js/custom/components/view/login/NMLogin.js";
import NMSignIn from "js/custom/components/view/login/NMSignIn.js";
import NMSignUp from "js/custom/components/view/login/NMSignUp.js";
import NMBody from "js/custom/components/view/common/NMBody.js";
import NMHome from "js/custom/components/view/home/NMHome.js";
import NMAccount from "js/custom/components/view/account/NMAccount.js";
import NMAddAccount from "js/custom/components/view/account/NMAddAccount.js";

const route = {
    "main": NMMain,
    "main/login": NMLogin,
    "main/login/signin": NMSignIn,
    "main/login/signup": NMSignUp,
    "main/body": NMBody,
    "main/body/home": NMHome,
    "main/body/account": NMAccount,
    "main/body/account/add": NMAddAccount
};

export default route;
