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
    getCommitLanguages(p = []) {
        githubSideEffect.getCommitLanguages(p);
    }

    getWeeklyCommitCount(p = []) {
        githubSideEffect.getWeeklyCommitCount(p);
    }

    getCommitLists(p = []) {
        githubSideEffect.getCommitLists(p);
    }
}

const githubIntent = new NMGithubIntent();

export default githubIntent;
