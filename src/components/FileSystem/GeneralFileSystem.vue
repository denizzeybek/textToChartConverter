<template>
<div>
    <!-- <div v-if="sidebarOpen" class="sidebar-container"> -->
    <div class="sidebar-container">

        <div v-if="activeSideBar == 'filesystem'">
            <!-- <FileExplorer></FileExplorer> -->
            <TreeApp></TreeApp>
        </div>

        <div v-else-if="activeSideBar == 'activities'">
            <!-- <Activities></Activities> -->
        </div>

        <div v-else-if="activeSideBar == 'git'">
            <!-- <Git></Git> -->
        </div>

        <div v-else-if="activeSideBar == 'view-designer'">
            <!-- <ViewDesigner></ViewDesigner> -->
        </div>

    </div>
</div>
</template>

<script>
// import FileExplorer from '@/components/FileSystem/FileExplorer.vue'
import TreeApp from '@/components/vueTreeList/TreeApp.vue'
export default {
    components:{
        // FileExplorer,
        TreeApp
    },
    data(){
        return{ 
            activeSideBar:'filesystem',
        }
    }
}
</script>

<style scoped>

</style>
