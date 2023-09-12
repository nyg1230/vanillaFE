/* inherit */
import NMSideEffect from "main/sideEffect/core/NMSideEffect";
/* common */
import * as util from "main/util/utils.js";
import { Octokit, App } from "octokit";
// import { Octokit } from "https://esm.sh/@octokit/core";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

const apiKey = (function() {
    const keys = ["Z2hwXzRlWWMxNXZGND", "RidWpCaUgzTnJ0d0pvQ", "XJBb25qTzRjaTZQeA=="]
    return keys.reduce((acc, val) => acc += `${val}`);
})();
const apiVersion = NMConst.env.github.apiVersion;

class NMGithubSideEffect extends NMSideEffect {
    #owner;
    #repo;
    #octokit;

    constructor(...arg) {
        super(...arg);
        this.#octokit = new Octokit({ auth: atob(apiKey) }); 
    }

    async #request(url, option) {
        const { owner, repo, headers, ...remain } = { ...option };

        const response = await this.#octokit.request(url, {
            owner,
            repo,
            headers: {
                ...headers,
                "X-GitHub-Api-Version": apiVersion,
            },
            ...remain
        });

        return response;
    }

    getCommitLanguage(params = []) {
        const promiseList = [];
        params.forEach((p) => {
            const url = urlBuilder("commit.repo.languages", p);
            const promise = new Promise((res, rej) => {
                res(this.#request(url, p));
            });
            promiseList.push(promise);
        });

        Promise.all(promiseList).then((result) => {
            console.log(result);
        });
    }
}

const urlBuilder = (key, p) => {
    const { owner, repo } = { ...p };

    const url = {
        commit: {
            list: `GET /repos/${owner}/${repo}/commits`,
            count: {
                weekly: `GET /repos/${owner}/${repo}/stats/participation`,
            },
            repo: {
                languages: `GET /repos/${owner}/${repo}/languages`,
            }
        }
    };

    return util.CommonUtil.find(url, key, "");
};

const githubSideEffect = new NMGithubSideEffect();

export default githubSideEffect;
