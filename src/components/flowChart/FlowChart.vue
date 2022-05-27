<template>
<div>
    <CodeTreeList v-if="codeTree" class="item" :model="codeTree"></CodeTreeList>
    <!-- <CodeTreeList class="item" :model="treeDataObject"></CodeTreeList> -->
</div>
</template>

<script>
import CodeTreeList from "./CodeTreeList";
import {CodeTree} from './CodeTree'
import {mapGetters} from 'vuex'

export default {
    components: {
        CodeTreeList,
    },

    props: {
            codeTree: {
                type: Object
            },
    },
    created(){
        // console.log("created!")
        //let response = new CodeTree(treeData)
        //console.log("response ", typeof(response))
        //this.treeDataObject = response
        // this.$store.dispatch('setDataOnCreatedAction', response.children)
        // await this.$store.dispatch('setTreeDataAction', response.children)
        //this.$store.dispatch('setTreeDataAction2', treeData)
    },
    mounted(){
        // this.$store.dispatch('setTreeDataAction2', treeData)
        // this.treeDataObject = new CodeTree(treeData)
        // this.$store.dispatch('setTreeDataAction', treeData)
        // this.treeDataObject = new CodeTree(this.getTreeDataArray)
        // console.log("array: ", Array.isArray(this.treeDataObject))
        // console.log('getTreeDataObject ', this.getTreeDataObject)
        // this.$store.dispatch('setTreeDataAction', this.treeDataObject.children) 
        // console.log("getTreeDataObject ", this.getTreeDataObject)
    },
    computed:{
        ...mapGetters([
            'getTreeDataArray',
            'getTreeDataObject',
            'getTreeDataObject2'
        ]),
    }, 
    methods:{ 

    }
};
</script>

<style>
.item {
    cursor: pointer;
    line-height: 1.5;
}

.bold {
    font-weight: bold;
}
</style>
