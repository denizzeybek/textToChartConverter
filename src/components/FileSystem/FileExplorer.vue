<template>
<div style="max-width: 360px;margin-left:5px;margin-top:10px;">
    <div class="d-flex justify-content-between align-items-center" style="margin-bottom:10px; margin-left:12px;margin-right:12px;">
        <div>
            <!-- <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" /> -->
            <input class="search-input" placeholder="Search" />
        </div>
        <!-- yukarıdaki search un yanındaki ikonlar -->
        <div class="d-flex align-items-center justify-content-center">
            <a href="#" @click="getFromArchive" class="archive-btn-a">
                <i class="archive-btn-top fa-solid fa-box-archive"></i>
                <span class="archive-count">
                    <span class="archive-number">{{getArchiveCount}} </span>
                </span>
            </a>
            <a class="add-folder-btn" id="add-folder" @click="addNode">
                <i class="add-folder-top fa-solid fa-plus"></i>
            </a>
        </div>

    </div>
    <div v-if="isOnArchivePage" class="archive-general-div" style="">
        <a @click="getFromArchive" class="toggle-archive-btn" href="#">
            <i class="fa-solid fa-arrow-left"></i>
            Archived Projects
        </a>
    </div>
    <vue-tree-list @click="onClick" @change-name="onChangeName" @delete-node="onDel" @add-node="onAddNode" :model="data" default-tree-node-name="new folder" default-leaf-node-name="new file" v-bind:default-expanded="false">
        <template v-slot:leafNameDisplay="slotProps">
            <span class="d-flex justify-content-center align-items-center">
                {{ slotProps.model.name }}
                <!-- Bu archive i buraya koyma sebebim hover da slot eksik -->
                <span v-if="slotProps.model.nodeType == 'Project'" class="icon add-to-archive-hover" @click="toggleToArchive" title="Add Archive"><i class="icon-archive-project fa-solid fa-box-archive"></i></span>
                <span class="muted">#{{ slotProps.model.id }}</span>
            </span>
        </template>
        <!-- <button @click="dropdownFunc" class="dropbtn">...</button> -->
        <!-- <div id="myDropdown" class="dropdown-content"> -->
        <span class="icon" slot="editNodeIcon" title="Edit" style="margin-left: 8px"><i class="fa-solid fa-pen-to-square"></i></span>
        <span class="icon" slot="delNodeIcon" title="Delete" style="margin-left: 8px; color: red"><i class="fa-solid fa-trash-can"></i></span>
        <span class="icon" slot="addTreeNodeIcon" title="Add Folder" style="margin-left: 8px"><i class="fa-solid fa-folder"></i></span>
        <span class="icon" slot="addLeafNodeIcon" title="Add File" style="margin-left: 8px"><i class="fa-solid fa-file-lines"></i></span>
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
    <!-- <button @click="dropdownFunc" class="dropbtn">...</button> -->
    <!-- <div id="myDropdown" class="dropdown-content"> -->
    <!-- <span class="icon" slot="addTreeNodeIcon" title="Add Archive" style="margin-left: 8px"><i class="fa-solid fa-box-archive"></i></span>
        <span class="icon" slot="editNodeIcon" title="Edit" style="margin-left: 8px"><i class="fa-solid fa-pen-to-square"></i></span>
        <span class="icon" slot="delNodeIcon" title="Delete" style="margin-left: 8px; color: red"><i class="fa-solid fa-trash-can"></i></span>
        <span class="icon" slot="addTreeNodeIcon" title="Add Folder" style="margin-left: 8px"><i class="fa-solid fa-folder"></i></span>
        <span class="icon" slot="addLeafNodeIcon" title="Add File" style="margin-left: 8px"><i class="fa-solid fa-file-lines"></i></span> -->
    <!-- </div> -->

    <button @click="getNewTree">Get Tree List As JSON</button>
    <pre style="color:red;">
    {{ newTree }}
    </pre>
</div>
</template>

<script>
// import {
//     VueTreeList,
//     Tree,
//     TreeNode
// } from "vue-tree-list";
// import {
//     mapGetters
// } from 'vuex'
// window.onclick = function (event) {
//     if (!event.target.matches('.dropbtn')) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// } 
// function innerObject(o) { 
//     return Object.keys(o).reduce(function (r, k) { 
//         return typeof o[k] === 'object' ? innerObject(o[k]) : (r[k] = o[k], r) 
//     }, {}) 
// } 
// export default {
//     components: {
//         VueTreeList,
//     },
//     async created() {
//         await this.$store.dispatch('getProjectAction', false)
//         await this.$store.dispatch('archiveCountAction')
//         this.archiveCount = this.getArchiveCount
//         this.data = new Tree(this.getAllProjects)
//         this.isOnArchivePage = this.getIsOnArchivePage
//     },
//     data() {
//         return {
//             newTree: {},
//             data: new Tree([]),
//             changeNameData: {},
//             isOnArchivePage: false,
//             archiveCount: 0,
//             addToArchiveProjectId: null,

//         };
//     },
//     methods: {
//         dropdownFunc() {
//             document.getElementById("myDropdown").classList.toggle("show");
//         },
//         toggleToArchive() {
//             setTimeout(() => {
//                 console.log("here!", this.addToArchiveProjectId);
//                 this.$store.dispatch('toggleArchiveAction', this.addToArchiveProjectId)

//                 // getAllProjects yerine aarchivedProjects ve olmayan olarka state'de tutup ona göre çekmem gerekir
//                 this.$store.dispatch('getProjectAction', this.isOnArchivePage)
//                 this.data = new Tree(this.getAllProjects)

//                 this.$store.dispatch('archiveCountAction')
//                 this.archiveCount = this.getArchiveCount
//             }, 500);

//         },
//         async onClick(params) {
//             console.log("onClick", params);
//             if(params.projectId){
//                 this.addToArchiveProjectId = params.projectId.toString()
//             }
//         },
//         async getFromArchive() {
//             this.isOnArchivePage = !this.isOnArchivePage
//             await this.$store.dispatch('changeIsOnArchivePage', this.isOnArchivePage)
//             if (this.isOnArchivePage) {
//                 await this.$store.dispatch('getProjectAction', true)
//             } else {
//                 await this.$store.dispatch('getProjectAction', false)
//             }
//             let allProjects = this.getAllProjects
//             this.data = new Tree(allProjects)

//         },
//         onSearch(value) {
//             console.log("onSearch", value);
//         },
//         onDel(node) {
//             console.log("onDel", node);
//             // alert(" Deleted");
//             let data = node.projectId.toString()
//             node.remove();
//             this.$store.dispatch('deleteAction', data)
//         },
//         async onChangeName(params) {
//             // console.log("onchangeName", params)
//             if (params.node) {
//                 this.changeNameData = {
//                     'id': params.node.projectId,
//                     'newName': params.newName,
//                 }
//             }
//             if (params.eventType == 'blur') {
//                 console.log('here!')
//                 await this.$store.dispatch('changeNameAction', this.changeNameData)
//             }
//         },
//         onAddNode(params) {
//             // isLeaf == true ise file, folse ise folder eklemiş oluyorsun
//             // console.log("add file/folder", JSON.stringify(params));
//             console.log("add file/folder", (params));
//             // let xx = innerObject(params)
//             // console.log("xx", xx)
//             if (params.isLeaf == true) {
                
//                 let folderData = {
//                     "projectId": params.parent.projectId,
//                     "parentFolderId": "string",  
//                     "folderName": params.parent.name
//                 }
//             } else {
//                 console.log("add folder", params);
//                 let fileData = {
//                     "projectId": params.parent.projectId,
//                     "folderId": "string",
//                     "fileName": "string"
//                 }
//             }
//         },
//         async addNode() {
//             await this.$store.dispatch('createProjectAction', "New Project2")

//             // let node = this.getNewProject
//             var node = new Tree([this.getNewProject])

//             if (!this.data.children) {
//                 this.data.children = [];
//             }
//             this.data.addChildren(node.children[0]);
//             // this.data.addChildren(node);
//             console.log("node: ", node.children[0])
//         },
//         getNewTree() {
//             var vm = this;

//             function _dfs(oldNode) {
//                 var newNode = {};

//                 for (var k in oldNode) {
//                     if (k !== "children" && k !== "parent") {
//                         newNode[k] = oldNode[k];
//                     }
//                 }

//                 if (oldNode.children && oldNode.children.length > 0) {
//                     newNode.children = [];
//                     for (var i = 0, len = oldNode.children.length; i < len; i++) {
//                         newNode.children.push(_dfs(oldNode.children[i]));
//                     }
//                 }
//                 return newNode;
//             }

//             vm.newTree = _dfs(vm.data);
//         }, 
//     },
//     computed: {
//         ...mapGetters([
//             'getNewProject',
//             'getAllProjects',
//             'getArchiveCount',
//             'getIsOnArchivePage',
//         ])
//     },
// };
</script>

<style scoped>
/* @import '@/assets/styles/style.css'; */
/* @import '@/assets/styles/home/fileExplorer/fileExplorer.css'; */
</style>
