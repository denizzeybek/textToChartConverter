<template>
<div>
    <div class="navigation">
        <div class="navigation-top">
            <a @click="fileOpener" class="nav-icon nav-icon-filesystem active">
                <!-- <font-awesome-icon :icon="['fa', 'file']" /> -->
                <i class="fa-icon fa-regular fa-file"></i>
            </a>

            <a @click="activitiesOpener" class="nav-icon nav-icon-activities">
                <!-- <font-awesome-icon :icon="['fa', 'bolt']" /> -->
                <i class="fa-icon fa-solid fa-bolt"></i>
            </a>
        </div>

        <div class="navigation-bottom">
            <a class="nav-icon nav-icon-settings">
                <!-- <font-awesome-icon :icon="['fa', 'gear']" /> -->
                <i class="fa-icon fa-solid fa-gear"></i>
            </a>

            <a class="nav-icon nav-icon-profile">
                <i class="fa-icon fa-regular fa-circle-user"></i>
                <!-- <font-awesome-icon :icon="['fa', 'circle-user']" /> -->
            </a>
        </div>
    </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    mounted(){
        this.activeSideBar = this.getActiveSideBar 
    },
    data(){
        return{
            activeSideBar:''
        }
    },
    methods:{ 
        fileOpener(){
            document.querySelector('.nav-icon-filesystem').classList.add('active');
            if(this.activeSideBar == "filesystem"){
                this.sidebarOpen = !this.sidebarOpen;
            }
            else{
                document.querySelector('.nav-icon-activities').classList.remove('active');
            }
            this.activeSideBar = 'filesystem'; 
            this.$store.dispatch('changeActiveSideBar', this.activeSideBar);
            // eventBus.$emit('sidebarOpen', this.sidebarOpen); // bunu homeHeader'da image i ayarlamak için kullanmışım
        },
        activitiesOpener(){
            document.querySelector('.nav-icon-activities').classList.add('active');
            if(this.activeSideBar == "activities"){
                this.sidebarOpen = !this.sidebarOpen;
            }
            else{
                document.querySelector('.nav-icon-filesystem').classList.remove('active');
            }
            this.activeSideBar = 'activities';
            this.$store.dispatch('changeActiveSideBar', this.activeSideBar);
        },   
    },
    computed:{
        ...mapGetters([
            'getActiveSideBar'
        ])
    }
}
</script>

<style scoped>
@import '@/assets/styles/home/sideBar/sidebar.css';

.active{
    color:white !important; 
}
</style>
