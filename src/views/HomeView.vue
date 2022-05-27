<template>
<div>
    <HomeHeader></HomeHeader>
    <div class=" d-flex">
        <HomeLeftPanel></HomeLeftPanel>
        <div class="general-split-view">
            <SplitView></SplitView>
        </div>
    </div>
</div>
</template>

<script>
import HomeHeader from '../components/Home/HomeHeader.vue'
import HomeLeftPanel from '../components/Home/HomeLeftPanel.vue'
import SplitView from '../components/Home/SplitView.vue'
export default {
    components: {
        HomeHeader,
        HomeLeftPanel,
        SplitView
    }
}
</script>

<style scoped>
@import '@/assets/styles/style.css';
.general-split-view{
    width: 100%;
}
</style>
