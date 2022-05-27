<template>
<div>
    <div class="root">
        <div class="root-general">
            <div class="scroll-container">
                <div class="grid-row">
                    <div class="row-group">

                        <CodeTreeListNode v-for="m in model.children" :model="m" :key="m.id">
                        </CodeTreeListNode>

                        <!-- <div>
                            <CodeTreeList class="item" :model="treeDataObject"></CodeTreeList>
                        </div> -->

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import CodeTreeListNode from './CodeTreeListNode.vue'
export default {
    name: 'CodeTreeList', // necessary for self-reference
    components: {
        CodeTreeListNode
    },
    props: {
            model: {
                type: Object
            },
    }

}
</script>

<style scoped>
.root {
    height: 80vh;
}

.root-general {
    height: 100%;
    position: relative;
}

.scroll-container {
    overflow: visible;
    width: 0px;
    height: 0px;
}

.grid-row {
    box-sizing: border-box;
    direction: ltr;
    height: 80vh;
    position: relative;
    width: 1044px;
    will-change: transform;
    outline: none;
    overflow: auto !important;
}

.row-group {
    width: auto;
    height: 558px;
    max-width: 1044px;
    max-height: 558px;
    overflow: hidden;
    position: relative;
    overflow: visible !important;
    box-sizing: border-box;
}

</style>
