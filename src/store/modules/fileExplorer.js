
import api from '@/services/api'
import request from '@/services/request'

const state = {
    sidebarOpen: true,
    activeSideBar: 'filesystem',
    newProject: [],
    projectList: null,
    archivedProjectList: null,
    archiveCount: 0,
    isOnArchivepage: false,
    searchData: null
}

const getters = {
    getNewProject(state) {
        return state.newProject
    },
    getSearchProjects(state) {
        return state.searchData
    },
    getDeleteAction(state) {
        return state.activeSideBar
    },
    getProjectList(state) {
        return state.projectList
    },
    getArchivedProjectList(state) {
        return state.archivedProjectList
    },
    getArchiveCount(state) {
        return state.archiveCount
    },
    getIsOnArchivePage(state) {
        return state.isOnArchivepage
    }
}

const mutations = {
    // setMutateHandler(state, data, type) {
        // state[type] = data;
    // },
    setAddProjectAction(state, data) {
        const propertyNames = Object.keys(data);
        state.projectList.push(data)
        state.newProject.push(data)
        // console.log("projects: ", state.projectList)
        // const mergedObject = {...state.projectList, ...state.newProject}
        // console.log("new projects: ", state.newProject)
        console.log("projects propertyNames: ", propertyNames)
    },
    setDeleteProjectAction(state, node) {
        let projectListVar = state.projectList
        let archivedProjectListVar = state.archivedProjectList
        var index
        let matchBool = false
        for (let i = 0, len = projectListVar.length; i < len; i++) {
            if (projectListVar[i].id === node.id) {
                // console.log("parent.children[i] ", projectListVar[i])
                // console.log("node ", node)
                index = i
                matchBool = true
                break
            }
        }
        if (matchBool) {
            projectListVar.splice(index, 1)
            matchBool = false
        }
        for (let i = 0, len = archivedProjectListVar.length; i < len; i++) {
            if (archivedProjectListVar[i].id === node.id) {
                index = i
                matchBool = true
                break
            }
        }
        if (matchBool) {
            archivedProjectListVar.splice(index, 1)
            matchBool = false
        }
    },
    setChangeName(state, data) {

    },
    setIsOnArchivePage(state, data) {
        state.isOnArchivepage = data
    },
    setProjects(state, data) {
        if (data.isOnArchivePageData == true) {
            // console.log("archived", data.responseData)
            state.archivedProjectList = data.responseData
        }
        else {
            // console.log("projects", data.responseData)
            state.projectList = data.responseData
        }
    },
    setToggle(state, data) {
        console.log("state project list: ", state.projectList)
        let arr = state.projectList
        console.log("state project list count: ", typeof (arr))
        console.log("data.node: ", data.node)
        if (data.isOnArchivePage == true) {
            // arşiv true ise aslında ben projeyi arşivden çıkartıcam, projects e ekliycem
            console.log(state.projectList, "projects mutation")
            state.archivedProjectList.pop(data.node)
            state.projectList.push(data.node)
        }
        else {
            // burda da projects'den çıkartıp arşive ekliycem
            console.log(state.archivedProjectList, "archivedProjects mutation")
            state.projectList.pop(data.node)
            state.archivedProjectList.push(data.node)
        }
        // let archivedProjectLength = state.archivedProjectList.length
        // if(archivedProjectLength){
        //     state.archiveCount = archivedProjectLength
        //     console.log("state.archive ", state.archivedProjectList)
        //     console.log("state.archiveCount ", state.archiveCount)
        // }
        state.archiveCount = data.archiveCount
    },
    setEmptyNewProjectAction(state) {
        state.newProject = []
    },
    setArchiveCount(state, data) {
        state.archiveCount = data
    },
    setSearchData(state, data) {
        state.searchData = data
    }
}

const actions = {
    async createProjectAction({ commit }, name) {
        const { data, error } = await request(`/FileExplorer/addProject`, 'post', { name })

        if (data) {
            commit('setAddProjectAction', { ...data })
        }

        console.log(data, error)

        // await api.post(`/FileExplorer/addProject`, {
        //     name
        // })
        //     .then(response => {
        //         console.log("response ", response)
        //         // let obj = [{...response.data}]
        //         if(response !== undefined) {
        //             let obj = {...response.data}
        //             // commit('setAddProjectAction', obj)
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
    },
    async deleteProjectAction({ commit },{ projectId, node }) {
        await api.post(`/FileExplorer/deleteProject`, { projectId })
            .then(response => {
                if (response !== undefined) {
                    commit('setDeleteProjectAction', node)
                    console.log("response:", node)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    async deleteNodeAction({ commit }, data) {
        console.log("data projectId", data.projectId)
        await api.post(`/FileExplorer/deleteNode`, {
            projectId: data.projectId,
            nodeId: data.nodeId,
        })
            .then(response => {

                // commit('setDeleteProjectAction', data.node)
                console.log("response delete Node:", response)
            })
            .catch(error => {
                console.log(error);
            });
    },
    async changeProjectNameAction({ commit }, data) {
        console.log("data", data)
        await api.post(`/FileExplorer/editProject`, {
            projectId: data.projectId,
            newProjectName: data.newProjectName,
            nodeId: data.nodeId
        })
            .then(response => {
                console.log("response:", response)
            })
            .catch(error => {
                console.log(error);
            });
        // commit('setChangeName', data)
    },
    async changeNodeNameAction({ commit }, data) {
        console.log("data", data)
        await api.post(`/FileExplorer/editNode`, {
            projectId: data.projectId,
            newNodeName: data.newNodeName,
            nodeId: data.nodeId
        })
            .then(response => {
                console.log("response:", response)
            })
            .catch(error => {
                console.log(error);
            });
        // commit('setChangeName', data)
    },
    async addFolderAction({ commit }, data) {
        await api.post(`/FileExplorer/addFolder`, {
            projectId: data.projectId,
            parentFolderId: data.parentFolderId,
            folderName: data.folderName
        })
            .then(response => {
                console.log("response:", response.data)
            })
            .catch(error => {
                console.log(error);
            });
    },
    async addFileAction({ commit }, data) {
        await api.post(`/FileExplorer/addFile`, {
            projectId: data.projectId,
            folderId: data.folderId,
            fileName: data.fileName
        })
            .then(response => {
                console.log("response:", response.data)
            })
            .catch(error => {
                console.log(error);
            });
    },
    async getProjectAction({ commit }, isOnArchivePageData) {
        var onArchivePageData = isOnArchivePageData
        await api.post(`/FileExplorer/getProjects`, {
            archived: onArchivePageData
        })
            .then(response => {
                if (response !== undefined) {
                    let data = {
                        "responseData": response.data,
                        "isOnArchivePageData": onArchivePageData
                    }
                    console.log("getProjectData :", data)
                    commit('setProjects', data)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    async changeIsOnArchivePageAction({ commit }, isOnArchivePageData) {
        var onArchivePageData = isOnArchivePageData
        await api.post(`/FileExplorer/getProjects`, {
            archived: onArchivePageData
        })
            .then(response => {
                if (response !== undefined) {

                    let data = {
                        "responseData": response.data,
                        "isOnArchivePageData": onArchivePageData
                    }
                    commit('setProjects', data)
                    commit('setIsOnArchivePage', isOnArchivePageData)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    async toggleArchiveAction({ commit }, data) {
        await api.post(`/FileExplorer/toggleArchive`, {
            projectId: data.projectId
        })
            .then(response => {
                if (response !== undefined) {

                    console.log("response:", response)
                    let newData = {
                        "isOnArchivePage": data.isOnArchivePage,
                        "node": data.node,
                        "projectId": data.node.projectId,
                        "archiveCount": response.data
                    }
                    console.log("toggle response ", response.data)
                    commit("setToggle", newData)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    async archiveCountAction({ commit }) {
        await api.post(`/FileExplorer/archiveCount`, {})
            .then(response => {
                if (response !== undefined) {
                    commit('setArchiveCount', response.data)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    emptyNewProjectAction({ commit }) {
        commit('setEmptyNewProjectAction')
    },
    async addNodeAction({ commit }, data) {
        await api.post(`/FileExplorer/addNode`, {
            projectId: data.projectId,
            parentNodeId: data.parentNodeId,
            nodeName: data.nodeName,
            nodeType: data.nodeType,
            nodeId: data.nodeId
        })
            .then(response => {
                console.log("response:", response.data)
            })
            .catch(error => {
                console.log(error);
            });
    },
    async searchAction({ commit }, queryData) {
        console.log("queryData", queryData)
        await api.post(`/FileExplorer/search`, {
            query: queryData
        })
            .then(response => {
                if (response !== undefined) {
                    console.log("response:", response.data)
                    commit('setSearchData', response.data)
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    async moveNodeAction({ commit }, data) {
        await api.post(`/FileExplorer/moveNode`, {
            copied: data.copied,
            projectId: data.projectId,
            targetProjectId: data.targetProjectId,
            targetId: data.targetId,
            nodeId: data.nodeId
        })
            .then(response => {
                console.log("response:", response)
            })
            .catch(error => {
                console.log(error);
            });
    }


}

export default {
    state, getters, mutations, actions
}