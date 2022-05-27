<template>
    <div style="display:flex;">
        <div class="tabs-left">
            <FlowChart :codeTree="codeTree"></FlowChart>
        </div>
        <div class="tabs-right">
            <MonacoEditor :codeTree="codeTree" :key="codeTree.toText()"></MonacoEditor>
        </div>
    </div>
</template>
<script>
import MonacoEditor from '@/components/monacoEditor/MonacoEditor.vue'
import FlowChart from '@/components/flowChart/FlowChart.vue'
export default {
    components: {
        MonacoEditor,
        FlowChart
    },
    props: {
            codeTree: {
                type: Object
            },
    }
}
</script>
<style scoped>
.tabs-left {
    width: 33%;
    border-right: 1px solid black;
    background-color:rgb(40,44,52);
    height: 90.9vh;
    overflow: auto;
}

.tabs-right {
    width: 67%;
    height: 90.9vh;
    background-color:rgb(40,44,52);
    overflow: auto;
    /* padding-top:15px; */
}
</style>