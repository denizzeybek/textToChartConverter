<template>
<div style="max-width: 360px;margin-left:5px;margin-top:10px;">
    <div class="d-flex justify-content-between align-items-center" style="margin-bottom:10px; margin-left:12px;">
        <div class="d-flex align-items-center">
            <!-- <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" /> -->
            <input v-on:keyup="onEnterSearch" v-model="searchData"  class="search-input" placeholder="Search" />
            <div @click="clearSearch()" class="search-cross-divider">
                <i class="search-cross fa-solid fa-xmark"></i>
            </div>

        </div>
        <!-- yukarıdaki search un yanındaki ikonlar -->
        <div class="d-flex align-items-center justify-content-center">
            <a href="#" @click="getFromArchive" class="archive-btn-a">
                <i class="archive-btn-top fa-solid fa-box-archive"></i>
                <span class="archive-count">
                    <span class="archive-number">{{getArchiveCount}} </span>
                </span>
            </a>
            <a v-if="!isOnArchivePage" class="add-folder-btn" id="add-folder" @click="addNode">
                <i class="add-folder-top fa-solid fa-plus"></i>
            </a>
        </div>

        <div>

        </div>
    </div>
    <div v-if="isOnArchivePage" class="archive-general-div" style="">
        <a @click="getFromArchive" class="toggle-archive-btn" href="#">
            <i class="fa-solid fa-arrow-left"></i>
            Archived Projects
        </a>
    </div>
    <vue-tree-list @click="onClick" @change-name="onChangeName" @drop="onDrop" @delete-node="onDel" @add-node="onAddNode" :model="data" default-tree-node-name="new folder" default-leaf-node-name="new file" v-bind:default-expanded="false">
        <template v-slot:leafNameDisplay="slotProps">
            <span  class="d-flex justify-content-center align-items-center">
                {{ slotProps.model.name }}
                <!-- Bu archive i buraya koyma sebebim hover da slot eksik -->
                <span v-if="slotProps.model.nodeType == 'Project'" class="icon add-to-archive-hover" @click="toggleToArchive" title="Add Archive"><i v-if="!isOnSearchPage" class="icon-archive-project fa-solid fa-box-archive"></i></span>
                <span class="muted">#{{ slotProps.model.id }}</span>
            </span>
        </template>
        <!-- <button @click="dropdownFunc" class="dropbtn">...</button> -->
        <!-- <div id="myDropdown" class="dropdown-content"> -->
        <span class="icon" slot="editNodeIcon" title="Edit" style="margin-left: 8px"><i v-if="!isOnSearchPage" class="fa-solid fa-pen-to-square"></i></span>
        <span class="icon" slot="delNodeIcon" title="Delete" style="margin-left: 8px; color: red"><i v-if="!isOnSearchPage" class="fa-solid fa-trash-can"></i></span>
        <span class="icon" slot="addTreeNodeIcon" title="Add Folder" style="margin-left: 8px"><i v-if="!isOnSearchPage" class="fa-solid fa-folder"></i></span>
        <span class="icon" slot="addLeafNodeIcon" title="Add File" style="margin-left: 8px"><i v-if="!isOnSearchPage" class="fa-solid fa-file-lines"></i></span>
        <!-- </div> -->

        <!-- bu file eklediğindeki icon-->
        <span class="icon" slot="leafNodeIcon" style="margin-right: 8px">
            <i class="fa-solid fa-file-code"></i>
        </span>
        <span class="icon" slot="treeNodeIcon" style="margin-right: 8px">
            <i class="fa-solid fa-gears"></i>
        </span>

        <template v-slot:treeNodeIcon="slotProps">
            <span class="icon" v-if="slotProps.model.nodeType == 'Project'">
                <i class="fa-solid fa-gears" style="margin-right:4px;"> </i>
            </span>
            <span class="icon" v-else-if="slotProps.model.nodeType == 'Sources'">
                <i class="fa-solid fa-file-lines" style="margin-right:4px;"> </i>
            </span>
            <span class="icon" v-else-if="slotProps.model.nodeType == 'Views'">
                <i class="fa-solid fa-display" style="margin-right:4px;"> </i>
            </span>
            <span class="icon" v-else-if="slotProps.model.nodeType == 'Setting'">
                <i class="fa-solid fa-wrench" style="margin-right:4px;"> </i>
            </span>
        </template>

        <template v-slot:leafNodeIcon="slotProps">
            <span class="icon" v-if="slotProps.model.nodeType == 'SourceFile'">
                <i class="fa-solid fa-file-code" style="margin-right:4px;"> </i>
            </span>
            <span class="icon" v-else-if="slotProps.model.nodeType == 'ViewFile'">
                <i class="fa-solid fa-table" style="margin-right:4px;"></i>
            </span>
            <span class="icon" v-else-if="slotProps.model.nodeType == 'SettingFile'">
                <i class="fa-solid fa-pen-to-square" style="margin-right:4px;"> </i>
            </span>
        </template>
    </vue-tree-list>

    <!-- <button @click="getNewTree">Get Tree List As JSON</button>
    <pre style="color:red;">
    {{ newTree }}
    </pre> -->
</div>
</template>

<script>
import {
    VueTreeList,
    Tree,
    TreeNode
} from '@/components/vueTreeList'
import {
    mapGetters
} from 'vuex'
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
} 

function getprojectId(node){
    let parent = node.parent;
    while (parent != null){
        if(parent.projectId!=null)
            return parent.projectId;
        parent = parent.parent;
    }
    return null;
}

export default {
    components: {
        VueTreeList,
    },
    async created() {
        //TODO!:
        // const onCreatedIsOnArchivePage = false;
        await this.$store.dispatch('getProjectAction', false)
        await this.$store.dispatch('getProjectAction', true)
        await this.$store.dispatch('archiveCountAction')
        this.archiveCount = this.getArchiveCount

        if(this.getProjectList){
            this.data = new Tree(this.getProjectList)
        }
        this.isOnArchivePage = this.getIsOnArchivePage
    },
    data() {
        return {
            newTree: {},
            data: new Tree([]),
            changeNameData: {},
            isOnArchivePage: false,
            archiveCount: 0,
            addToArchiveProjectId: null,
            node: null,
            root: null,
            searchData: '',
            isOnSearchPage: false
        };
    },
    methods: {
        async onEnterSearch(){
            if(this.searchData){
                this.isOnSearchPage = true
                console.log("search data ", this.searchData);
                console.log("type", typeof(this.searchData));
                await this.$store.dispatch('searchAction', this.searchData)
                console.log('!here')
                this.data = new Tree(this.getSearchProjects)  
            }
            else{
                this.isOnSearchPage = false
                await this.$store.dispatch('getProjectAction', false)
                this.data = new Tree(this.getProjectList)
            }
        },
        async clearSearch(){
            await this.$store.dispatch('getProjectAction', false)
            this.data = new Tree(this.getProjectList)
        },
        dropdownFunc() {
            document.getElementById("myDropdown").classList.toggle("show");
        },
        toggleToArchive() {
            // projectId yi gönder ve tree'den node u sil
            // archived ve normal arşive al butonları birbirinden bağımsız olmalı
            setTimeout(() => {
                ///TODO: projeden arşive yolladığında bir action çalıştır ve nodu yolla,
                // o node u git state de güncelle
                // sonra da delNode daki gibi node u fe den sil
                let data = {
                    "isOnArchivePage" : this.isOnArchivePage,
                    "node" : this.node,
                    "projectId" : this.node.projectId
                }
                this.$store.dispatch('toggleArchiveAction', data)

                const parent = this.root
                // const index = parent.findChildIndex(this.node)
                var index
                for (let i = 0, len = parent.children.length; i < len; i++) {
                    if (parent.children[i].id === this.node.id) {
                        // console.log("parent.children[i] ", parent.children[i])
                        // console.log("node ", this.node)
                        index = i
                        break
                    }
                }
                parent.children.splice(index, 1)
                
                // this.$store.dispatch('archiveCountAction')
                this.archiveCount = this.getArchivedProjectList
                console.log("this.archiveCount ", this.archiveCount.length)
                // this.archiveCount = this.getArchivedProjectList
            }, 150);

        },
        async onClick(params) {
            console.log("onClick", params);
            if(params.projectId){
                this.addToArchiveProjectId = params.projectId.toString()
                this.node = params
                this.root = params.parent
            }
        },
        async getFromArchive() {
            this.isOnArchivePage = !this.isOnArchivePage
            //TODO!:
            console.log("getFromArchive")
            await this.$store.dispatch('changeIsOnArchivePageAction', this.isOnArchivePage)
            if (this.isOnArchivePage) {
                // await this.$store.dispatch('getProjectAction', true)
                this.data = new Tree(this.getArchivedProjectList)
                this.isOnArchivePage = this.getIsOnArchivePage
            } else {
                // await this.$store.dispatch('getProjectAction', false)
                this.data = new Tree(this.getProjectList)
                this.isOnArchivePage = this.getIsOnArchivePage
            } 
        }, 
        onDel(node) {
            console.log("onDel", node); 
            node.remove();

            var data; 
            let isProject = node.parent.name 
            if(isProject == 'root'){
                data = {
                    "projectId" : node.projectId,
                    "node" : node
                }
                console.log("root")
                this.$store.dispatch('deleteProjectAction', data)
            }
            else{
                let projectId = getprojectId(node);
                data = {
                    "projectId":  projectId,
                    "nodeId": node.id, 
                    "node" : node
                }
                this.$store.dispatch('deleteNodeAction', data)
                console.log("node")
            }
        },
        async onChangeName(params) {
            console.log("params ", params)
            if (params.eventType == 'blur') {
                let projectId = getprojectId(params.node);
                if(projectId == null){
                    projectId =params.node.projectId
                }

                let isProject = params.node.parent.name
                console.log("isProject", isProject)
                if(isProject == 'root'){
                    this.changeNameData = {
                        'projectId': projectId,
                        'newProjectName': params.newName,
                        'nodeId' : params.id
                    }
                    // console.log('here!');
                    await this.$store.dispatch('changeProjectNameAction', this.changeNameData);
                }
                else{
                    console.log("node change name")
                    this.changeNameData = {
                        "projectId": projectId,
                        "newNodeName": params.newName,
                        "nodeId": params.id
                    }
                    await this.$store.dispatch('changeNodeNameAction', this.changeNameData);

                }
                
            }
        }, 
        async onAddNode(params) {
            // isLeaf == true ise file, false ise folder eklemiş oluyorsun
            // circular structutre json da sürekli kendine loop ettiği için convert edemiyor
            var data; 
            console.log("params", params)
            let projectId = getprojectId(params)
            if(projectId == null){
                console.log("id null")
            }
            if (params.isLeaf) {
                // console.log("add file", params);
                var nodeType = "CodeFile";
                if(params.parent.name == "Sources"){
                    nodeType = "CodeFile"
                }
                else if(params.parent.name == "Views"){
                    nodeType = "ViewFile"
                }
                else{
                    nodeType = "CodeFile"
                }
                data = {
                    "projectId": projectId,
                    "parentNodeId": params.pid,
                    "nodeName": "New File",
                    "nodeType": nodeType,
                    "nodeId": params.id
                }
                // console.log("fileData", data)

            } 
            else {
                // console.log("add folder", params);
                
                data = {
                    "projectId": projectId,
                    "parentNodeId": params.pid,
                    "nodeName": "New Folder",
                    "nodeType": "Folder",
                    "nodeId": params.id
                }
                // console.log("folderData", data)
            }
            await this.$store.dispatch('addNodeAction', data)
        },
        async addNode() { 
            await this.$store.dispatch('createProjectAction', "new project 4")

            let node = new Tree(this.getNewProject)

            if (!this.data.children) {
                this.data.children = [];
            }
            this.data.addChildren(node.children[0]);
            // this.data.addChildren(node);
            console.log("node: ", node.children[0])
            this.$store.dispatch("emptyNewProjectAction")
        },
        getNewTree() {
            var vm = this;

            function _dfs(oldNode) {
                var newNode = {};

                for (var k in oldNode) {
                    if (k !== "children" && k !== "parent") {
                        newNode[k] = oldNode[k];
                    }
                }

                if (oldNode.children && oldNode.children.length > 0) {
                    newNode.children = [];
                    for (var i = 0, len = oldNode.children.length; i < len; i++) {
                        newNode.children.push(_dfs(oldNode.children[i]));
                    }
                }
                return newNode;
            }

            vm.newTree = _dfs(vm.data);
        }, 
        async onDrop(params){
            console.log("drop!", params)
            let projectId = getprojectId(params.node)
            let targetProjectId = getprojectId(params.target)

            let data = { 
                "copied": false,
                "projectId": projectId,
                "targetProjectId": targetProjectId,
                "targetId": params.target.id,
                "nodeId": params.node.id
            }
            await this.$store.dispatch('moveNodeAction', data)
        },
    },
    computed: {
        ...mapGetters([
            'getNewProject',
            'getProjectList',
            'getArchivedProjectList',
            'getArchiveCount',
            'getIsOnArchivePage',
            'getSearchProjects'
        ])
    },
};
</script>

<style scoped>
@import '@/assets/styles/style.css';
@import '@/assets/styles/home/fileExplorer/fileExplorer.css'; 
.muted{
    display:none;
}
</style>
