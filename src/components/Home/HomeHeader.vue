<template>
    <div class="header-div">
        <!-- <div :style="toggleSidebar"  class="logo-div">
            <img v-if="sidebarOpen" :src="require(`../../assets/images/ecl-lg.png`)" width="90" :alt="sidebarOpen">
            <img v-else :src="require(`../../assets/images/ecl-sm.png`)" width="30" :alt="sidebarOpen">
        </div> -->
        <div class="logo-div">
            <!-- <img :src="require(`@/assets/images/ecl-lg.png`)" width="90" :alt="sidebarOpen"> -->
            <img :src="require(`@/assets/images/ecl-sm2.png`)" width="25" :alt="sidebarOpen">
            <span class="logo-ecl">Eclone</span>
        </div>
        <div class="debug-div">
            <a class="" href="#">
                <!-- <font-awesome-icon :icon="['fa', 'play']" /> -->
                <i class="fa-solid fa-play play-icon"></i>
            </a>

            <a class="" href="#">
                <span class="step-over-icon"></span>
                <!-- <img class="debug-icon" :src="require(`@/assets/images/debug-step-over.png`)" width="18" :alt="sidebarOpen"> -->
                <!-- <font-awesome-icon :icon="['fa', 'floppy-disk']" /> -->
            </a>

            <a class="" href="#">
                <span class="step-into-icon"></span>
                <!-- <font-awesome-icon :icon="['fa', 'circle-stop']" /> -->
            </a>

            <a class="" href="#">
                <span class="step-out-icon"></span>
                <!-- <font-awesome-icon :icon="['fa', 'circle-arrow-left']" /> -->
            </a>

            <a class="" href="#">
                <i class="fa-regular fa-square pause-icon"></i>
                <!-- <font-awesome-icon :icon="['fa', 'circle-arrow-up']" /> -->
            </a>
        </div>
    </div>
</template>

<script>
// import {eventBus} from '../../main'
export default {
    created(){
        // eventBus.$on('sidebarOpen', (value) => {
        //     this.sidebarOpen = value
        // })
    },
    data(){
        return{
            sidebarOpen:true,
        }
    },
    methods:{
        getImgUrl(){
            return require('@/assets/images/ecl-lg.png')
        }
    },
    computed:{
        toggleSidebar(){
            return {
                width:this.sidebarOpen ? '360px' :  '52px',
                // transition:'width  ease-out'
            }
        }
    }
}
</script>

<style scoped>
@import '@/assets/styles/home/homeHeader/homeHeader.css';
@import '@/assets/styles/style.css';
a{
    color: white;
}
/* .logo-div{
    background-color:white;
} */
</style>