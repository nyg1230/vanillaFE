/* inherit */
import NMIntent from "main/intent/core/NMIntent.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* side effect */
import githubSideEffect from "main/sideEffect/custom/NMGithubSideEffect.js";
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMGithubIntent extends NMIntent {
    getCommitLanguage(p = []) {
        githubSideEffect.getCommitLanguage(p);
    }
}

const githubIntent = new NMGithubIntent();

export default githubIntent;
