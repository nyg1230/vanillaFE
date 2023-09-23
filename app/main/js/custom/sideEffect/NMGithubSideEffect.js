/* inherit */
import NMSideEffect from "js/core/sideEffect/NMSideEffect";
/* common */
import * as util from "js/core/util/utils.js";
import { Octokit, App } from "octokit";
// import { Octokit } from "https://esm.sh/@octokit/core";
/* component */
/* model */
import NMGithubModel from "js/custom/model/NMGithubModel.js";
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

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

    #getPromiseList(key, params = []) {
        const promiseList = [];

        params.forEach((p) => {
            const { ext, ...remain } = { ...p };
            const url = urlBuilder(key, remain);
            const promise = new Promise((res, rej) => {
                res(this.#request(url, remain));
            });
            promiseList.push(promise);
        });

        return promiseList;
    }

    #getGithubData(key, promiseList = [], parse) {
        Promise.all(promiseList).then((result) => {
            const parseData = util.CommonUtil.isFunction(parse) ? parse(result) : result;
            NMGithubModel.set(key, parseData);
        });
    }

    getCommitLanguages(params = []) {
        const promiseList = this.#getPromiseList("commit.repo.languages", params);
        const parse = (list) => {
            const [d] = [...list];
            const { data } = { ...d };

            return data;
        };
        this.#getGithubData("commitLanguages", promiseList, parse);
    }

    getWeeklyCommitCount(params = []) {
        const promiseList = this.#getPromiseList("commit.count.weekly", params);
        const parse = (list = []) => {
            const d = [];

            list.forEach((l, idx) => {
                const { data } = { ...l };
                const { owner } = { ...data };
                const { ext } = { ...params[idx] };
                const { name } = { ...ext };
                const result = { name, data: owner.reverse() };

                d.push(result);
            });

            return d;
        };
        this.#getGithubData("weeklyCommitLists", promiseList, parse);
    }

    getCommitLists(params = []) {
        const promiseList = this.#getPromiseList("commit.list", params);
        const parse = (list = []) => {
            const result = [];

            list.forEach((l, idx) => {
                const { data } = { ...l };
                const { ext } = { ...params[idx] };
                const { name, limit = -1 } = { ...ext };
                const commitList = [];
                const _data = limit > 0 ? [...data].splice(0, limit) : [ ...data];

                _data.forEach((d) => {
                    const { commit } = { ...d };
                    const { author, message } = { ...commit };
                    const { name, date } = { ...author };
                    const result = { name, date, message };
                    commitList.push(result);
                });
                const info = { name, commitList };
                result.push(info);
            });

            return result;
        };
        this.#getGithubData("commitList", promiseList, parse);
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
