import {CodeTree} from '@/components/flowChart/CodeTree'
const state = {
    treeData : [],
    treeData2 : {},
    stateData : []
}

const getters = {
    getTreeDataObject(state){
        let children = []
        children.push(...state.treeData)
        let obj = {'children': children}
        return obj
    },
    getTreeDataObject2(state){
        return state.treeData2
    },
    getTreeDataArray(state){
        return state.treeData
    },
}

const mutations = {
    setTreeData(state, data){
        data.push(
            {
                shapeType:'loop',
                iconType:'table',
                text:'("Firmalar") sekmesini ("CompanyTable") tablosuna yükle',
            }
        )
        // console.log("data", data)
        state.treeData = data
        // console.log("state isArray", Array.isArray(state.treeData))
    },
    setTreeData2(state, data){
        let response = new CodeTree(data)
        state.treeData2 = response
    },
    addNewSibling(state, nodeId){
        let treeDataObject = state.treeData2
        // console.log("treeDataObject", treeDataObject)
        var treeDataArray = treeDataObject.children
        var matchedElement = treeDataArray.find(element => element.id == nodeId)
        // console.log("cloneTreeDataArray", cloneTreeDataArray)
        if(matchedElement === undefined){
            for(let i = 0; i < treeDataArray.length; i++){
                var cloneTreeDataArray = treeDataArray
                while(matchedElement === undefined){
                    for (let i = 0; i < cloneTreeDataArray.length; i++){
                        cloneTreeDataArray = cloneTreeDataArray[i].children
                        matchedElement = cloneTreeDataArray.find(element => element.id == nodeId)
                        if(matchedElement) break;
                        // console.log("matchedElement ", matchedElement)
                    }
                    break;
                }
                if(matchedElement) break;
            }
        }
        console.log("find: ", matchedElement)
        let indexOfMatchedElement = treeDataArray.indexOf(matchedElement)
        // console.log("index: ", indexOfMatchedElement)
        // // şimdi bu index + 1 e yeni bir eleman ekliycem ve son durumu state içerisindeki data ya set edicem
        const newArray = [{
            shapeType:"condition",
            iconType:"table",
            text:"deneme",
        }]
        let arrayResponse = new CodeTree(newArray)
        // console.log("arrayResponse ", arrayResponse.children[0])
        treeDataArray.splice(indexOfMatchedElement+1, 0, arrayResponse.children[0])
        let children = []
        children.push(...treeDataArray)
        let obj = {'children': children}
        state.treeData2 = obj
    },
    setDataOnCreated(state, data){
        state.stateData = data
    }
}

const actions = {
    setTreeDataAction({commit}, data){
        commit('setTreeData', data)
    },
    setTreeDataAction2({commit}, data){
        commit('setTreeData2', data)
    },
    addSiblingAction({commit}, nodeId){
        commit('addNewSibling', nodeId)
    },
    setDataOnCreatedAction({commit}, data){
        commit('setDataOnCreated', data)
    }
}

export default {
    state, getters, mutations, actions
}