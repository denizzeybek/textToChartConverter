<template>
<div> 

    <div class="node " :class="{'active-position':model.position, 'selected-position':model.selected}">
        <div class="carot-icons" style="margin-right:40px;">
            <span  class="line-number" :class="{'active-line-number':model.position}"> {{model.lineNumber}} </span>
        </div>
        <div class="carot-icons" @click="toggleNode" v-show="model.hasChildren" style="left:23px;">
            <font-awesome-icon :icon="caretClass" />
        </div>

        <div class="line-block" :class="lineBlockClass(depth)"  v-for="depth in model.depth - 1" :key="depth" :style="{left: 48 + ((depth - 1) * 4) + 'px'}">
        </div>
        <div class="node-content-shape" :style="{left:model.depth * 48 + 'px'}">
            <div style="height:100%">
                <div class="line-children " :class="{'line-top' : !model.isTop, 'line-bottom':!model.isBottom}"></div>
                
                <div @click="addSiblingToNode(model.id)" v-if="!model.isBottom" class="hover-line-horizontal" style="color:blue">
                    <div class="add-between-lines">
                    </div>
                    <div class="line-plus">
                        <font-awesome-icon class="line-plus-icon" icon="plus" />
                    </div>
                </div>

                <div @click="addSiblingToNode(model.id)"  v-if="model.isBottom" class="hover-line-vertical" style="color:red">
                    <div class="add-vertical-lines">
                    </div>
                    <div class="line-plus-vertical">
                        <font-awesome-icon class="line-plus-icon" icon="plus" />
                    </div>
                </div>

                <div @click="addChildToNode(model.id)" v-if="model.isBottom && !model.hasChildren" class="hover-line-horizontal2">
                    <div class="add-between-lines2">
                    </div>
                    <div class="line-plus2">
                        <font-awesome-icon class="line-plus-icon" icon="plus" />
                    </div>
                </div>

                <div class="row-wrapper">
                    <!-- <div class="move-handle cIcon-hex"> <i class="shape-icon fa-solid fa-comment-dots"></i></div> -->
                    <div class="move-handle" :class="model.shapeTypeCss">
                        <font-awesome-icon class="shape-icon" :icon="model.iconTypeCss" />
                    </div>
                    <div class="line-children-connector" v-if="model.hasChildren && model.expanded"></div>
                </div>
            </div>
        </div>

        
    </div>
    <div v-if="model.hasChildren && model.expanded">
        <CodeTreeListNode v-for="m in model.children" :model="m" :key="m.id">
        </CodeTreeListNode>
    </div>

</div>
</template>

<script>
//"fa-comment", "table":'fa-table', "web":"fa-globe"
import { CodeTreeNode } from '../flowChart/CodeTree'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown,faAngleRight,faComment,faTable,faGlobe,faMousePointer, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleDown, faAngleRight, faComment, faTable, faGlobe,faMousePointer, faPlus)

export default {
    name: 'CodeTreeListNode',
    components: {'font-awesome-icon': FontAwesomeIcon},
    props: {
            model: {
                type: CodeTreeNode
            },
    },
    data() {
        return {
            node:this.model,
            caretClass:"angle-down" , 
            plusIcon:"plus"
        }
    },
    methods: {
        toggleNode() {
            this.node.expanded = !this.node.expanded;
            this.caretClass= this.node.expanded? "angle-down" : "angle-right";
            // console.log("caret",this.node.expanded);
        },
        lineBlockClass(depth){
            let parent =this.node.parent;
            while(parent!=null){
            if( parent.isBottom && parent.depth ==depth)
                    return "line-block-hidden";
                parent=parent.parent;
            }
            return "";
        },
        addSiblingToNode(nodeId){
            this.model.parent.insertChild(nodeId,new CodeTreeNode({
                shapeType:'process',
                iconType:'comment',
                text:'Hello siniflandir',
            }))
            this.$emit('model')
        },
        addChildToNode(nodeId){
            this.model.parent.addChild(nodeId,new CodeTreeNode({
                shapeType:'process',
                iconType:'comment',
                text:'Hello siniflandir',
            }))
            this.$emit('model')

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

.node {
    /* height: 62px; */
    height: 52px;
    left: 0px;
    position: absolute;
    top: 0px;
    width: 100%;
    min-width: 100%;
    white-space: nowrap;
    position: relative;
    text-align: left;
    box-sizing: border-box;
}
/* .node:hover{
    background-color:rgb(44, 49, 60);
} */
.node.active-position{
    background-color:rgb(44, 49, 60);
}
.node.selected-position{
    background-color:rgb(51, 58, 70);
}
.node:active{
    background-color:rgb(51, 58, 70);
}
.line-number{
    color:rgb(72, 77, 92) ;
}
.active-line-number{
    color: rgb(167, 173,185);
}
.line-number:active{
    color: rgb(167, 173,185);
}
.active-node{
    background-color:rgb(51, 58, 70);
}
.carot-icons {
    position: absolute;
    top: 20px;
    margin-right: 20px;
}

.node-content-shape {
    position: absolute;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    z-index:150;
}

.row-wrapper {
    padding: 10px 10px 10px 0;
    height: 100%;
}

.node-row {
    opacity: 1;
    height: 100%;
    white-space: nowrap;
    display: flex;
    box-sizing: border-box;
}

.line-children {
    width: 44px;
    box-sizing: border-box;
    height: 100%;
    display: inline-block;
    position: absolute;
    /* margin-left:4px; */
}
.line-bottom::after {
    content: "";
    position: absolute;
    background-color: white;
    width: 1px;
    left: 50%;
    bottom: -8px;
    height: 18px;
}

.line-top::before {
    content: "";
    position: absolute;
    background-color: white;
    width: 1px;
    left: 50%;
    bottom: 45px;
    height: 18px;
}
.node:hover .line-top{
    display:block;
    z-index:11;
    position: absolute;
    bottom:-10px;
}


/*#region hover'da sağdan sola giden ekle */
.add-between-lines {
    width: 44px;
    box-sizing: border-box;
    height: 100%;
    display: none;
    position: absolute;
    /* margin-left:4px; */
}
.add-between-lines::before {
    height: 1px;
    top: 50px;
    /* right: 21px; */
    left: 23px;
    width: 55%;
    position: absolute;
    content: "";
    z-index:11;
    background-color: white;
}
.line-plus{
    position: absolute;
    top:44px;
    /* left:-10px; */
    left:44px;
    border:1px solid white;
    border-radius:50%;
    z-index:13;
    background-color:white;
    display:flex;justify-content:center;align-items:center;
    display:none;
}
.line-plus-icon{
    font-size:12px; 
    z-index:13;
}
.line-plus-icon:hover{
    font-size:14px;
}
.line-plus-icon:hover .line-plus{
    left:42px;
}
.node:hover .line-plus{
    display:flex;
}
.node:hover .add-between-lines{
    display:inline-block;
} 

/*#endregion */

/*#region hover'da aşağı giden ekle */
.add-vertical-lines {
    width: 44px;
    box-sizing: border-box;
    height: 100%;
    display: none;
    position: absolute;
    /* margin-left:4px; */
}
.add-vertical-lines::before {
    height: 24px;
    top: 45px;
    right: 21px;
    width: 1px;
    position: absolute;
    content: "";
    z-index:11;
    background-color: white;
}
.line-plus-vertical{
    position: absolute;
    top:63px;
    left:16px;
    border:1px solid white;
    border-radius:50%;
    z-index:13;
    background-color:white;
    display:flex;justify-content:center;align-items:center;
    display:none;
}
.line-plus-icon{
    font-size:12px; 
    z-index:13;
}
.line-plus-icon:hover .line-plus-vertical{
    left:12px;
}
.node:hover .line-plus-vertical{
    display:flex;
}
.node:hover .add-vertical-lines{
    display:inline-block;
} 

/*#endregion */ 

/*#region hover horizontal line2 */
.add-between-lines2 {
    width: 44px;
    box-sizing: border-box;
    height: 100%;
    display: none;
    position: absolute;
    /* margin-left:4px; */
}
.add-between-lines2::before {
    height: 1px;
    top: 30px;
    right: -18px;
    width: 55%;
    position: absolute;
    content: "";
    z-index:11;
    background-color: white;
}
.line-plus2{
    position: absolute;
    top:24px;
    left:60px;
    border:1px solid white;
    border-radius:50%;
    z-index:13;
    background-color:white;
    display:flex;justify-content:center;align-items:center;
    display:none;
}
.line-plus-icon{
    font-size:12px; 
    z-index:13;
}
.node:hover .line-plus2{
    display:flex;
}
.node:hover .add-between-lines2{
    display:inline-block;
} 


/*#endregion */


.line-block {
    width: 44px;
    height: 100%;
    position: relative;
    left: 48px;
    display: inline-block;
    box-sizing: border-box;
}

.line-block::after {
    width: 1px;
    left: 50%;
    top: 0;
    height: 100%;
    position: absolute;
    content: "";
    background-color: white;
}

.line-block-hidden::after {
    background-color: transparent;
}

.line-children-connector {
    width: 132px;
    /* height: 100%;
    position: relative;
    display: inline-block;
    box-sizing: border-box; */
}
.carot-icons{
    color:white;
    margin-left:10px;
}
.line-children-connector::before {
    height: 1px;
    top: 50%;
    right: 71px;
    width: 25%;
    position: absolute;
    content: "";
    background-color: white;
}

.line-children-connector::after {
    width: 1px;
    left: 49.4%;
    top: 26px;
    height: 78%;
    position: absolute;
    content: "";
    background-color: white;
}

.move-handle {
    height: 100%;
    width: 44px;
    cursor: move;
    border-radius: 1px;
    z-index: 1;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    height: 40px;
    margin-left: 3px;
}
.move-handle::before{
    position: absolute;
    width:1px;
    height:9px;
    color:red;
    left:0px;
    z-index: 15;
}
.cIcon-hex {
    font-size: 56px;
    filter: invert(90%) sepia(77%) saturate(434%) hue-rotate(323deg) brightness(109%) contrast(106%); 
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3Csvg data-name='Layer 1' id='Layer_1' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle/%3E%3Cpath d='M202.26,56.51l48,83.11,6.87,11.89v-3l-48,83.11-6.87,11.89,2.59-1.49H95.15l2.59,1.49-48-83.11-6.87-11.89v3l48-83.11,6.87-11.89L95.15,58h109.7c3.86,0,3.87-6,0-6H107.54c-3.9,0-8.47-.66-12.34,0-3.29.57-4.93,5.45-6.43,8.05l-28.1,48.68-23,39.76a3,3,0,0,0,0,3l35.54,61.56L90.93,243.7c1.16,2,1.8,3.86,4.32,4.3s5.68,0,8.3,0h98.74c2.3,0,3.78.16,5.36-1.85,1.82-2.32,3.1-5.37,4.57-7.91l9.44-16.35,40.63-70.37a3,3,0,0,0,0-3l-48-83.11-6.87-11.89C205.51,50.14,200.32,53.16,202.26,56.51Z'/%3E%3Cpath d='M193.6,71.51l40.32,69.84,5.87,10.16v-3l-40.32,69.84-5.87,10.16,2.59-1.49H103.81l2.59,1.49L66.08,158.65l-5.87-10.16v3l40.32-69.84,5.87-10.16L103.81,73h92.38c3.86,0,3.87-6,0-6h-82c-3.28,0-7.1-.55-10.35,0-3,.51-4.34,4.45-5.73,6.86L74.4,114.94,55,148.49a3,3,0,0,0,0,3L84.77,203l15.14,26.22c1.07,1.85,1.61,3.32,4,3.76,2.08.38,4.59,0,6.69,0H183c3.9,0,13,1.8,15.85-1.68,1.54-1.91,2.61-4.52,3.83-6.64L210.61,211,245,151.51a3,3,0,0,0,0-3L204.65,78.65l-5.87-10.16C196.85,65.14,191.66,68.16,193.6,71.51Z'/%3E%3C/svg%3E");
    position:relative;
    z-index: 15;
}

.cIcon-rectangle {
    font-size: 56px;
    filter: invert(89%) sepia(87%) saturate(4699%) hue-rotate(171deg) brightness(96%) contrast(89%);
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3Csvg data-name='Layer 1' id='Layer_1' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle/%3E%3Cpath d='M247,244H53l3,3V53l-3,3H247l-3-3V247c0,3.86,6,3.87,6,0V53a3,3,0,0,0-3-3H53a3,3,0,0,0-3,3V247a3,3,0,0,0,3,3H247C250.86,250,250.87,244,247,244Z'/%3E%3Cpath d='M230,227H70l3,3V70l-3,3H230l-3-3V230c0,3.86,6,3.87,6,0V70a3,3,0,0,0-3-3H70a3,3,0,0,0-3,3V230a3,3,0,0,0,3,3H230C233.86,233,233.87,227,230,227Z'/%3E%3C/svg%3E");
    position:relative;
    z-index: 15;
}

.cIcon-circle {
    font-size: 56px;
    filter: invert(92%) sepia(12%) saturate(433%) hue-rotate(113deg) brightness(89%) contrast(93%);
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3Csvg data-name='Layer 1' id='Layer_1' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle/%3E%3Cpath d='M227,150c-.28,32.13-20.51,61.67-51,72.51a77.81,77.81,0,0,1-85.3-23.37C70,174.34,67.35,138,84,110.38s49.49-42.24,81-35.93c35.85,7.18,61.69,39.16,62,75.55,0,3.86,6,3.87,6,0a84,84,0,0,0-54.15-77.84C146.24,60,108.13,70.24,86,97.12s-25.21,65.65-7.26,95.53a83.87,83.87,0,0,0,87.14,38.82c38.75-7.41,66.74-42.34,67.08-81.47C233,146.14,227,146.13,227,150Z'/%3E%3Cpath d='M242.57,150.57c-.28,38.32-24.46,73.57-60.76,86.57A93,93,0,0,1,79.38,208.87C55,179.3,51.93,136.22,71.57,103.38c19.81-33.12,59.47-50.77,97.34-43,42.59,8.75,73.34,46.87,73.65,90.18,0,3.86,6,3.87,6,0-.29-40.67-25.72-77.61-63.92-91.9C146.16,44.27,101.27,56.35,75.14,88s-29.86,77.48-8.75,112.76c21,35.13,62.61,53.63,102.79,46,45.79-8.69,79.05-49.94,79.39-96.22C248.59,146.7,242.59,146.7,242.57,150.57Z'/%3E%3C/svg%3E");
    position:relative;
    z-index: 15;
}

.cIcon-diamond {
    font-size: 56px;
    filter: invert(64%) sepia(9%) saturate(1291%) hue-rotate(227deg) brightness(81%) contrast(90%);
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' %3F%3E%3Csvg data-name='Layer 1' fill='currentColor' id='Layer_1' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle/%3E%3Cpath d='M152.59,261.62l-85-112.14v3l85-114.14h-5.18l82,115.14v-3l-82,111.14c-2.29,3.11,2.91,6.11,5.18,3l82-111.14a2.9,2.9,0,0,0,0-3l-82-115.14a3.05,3.05,0,0,0-5.18,0l-85,114.14a2.89,2.89,0,0,0,0,3l85,112.14C149.71,267.69,154.93,264.7,152.59,261.62Z'/%3E%3Cpath d='M153.59,284.66,51,149.26v3L153.59,14.47h-5.18l99,139v-3l-99,134.2c-2.29,3.11,2.91,6.11,5.18,3l99-134.2a2.9,2.9,0,0,0,0-3l-99-139a3.05,3.05,0,0,0-5.18,0L45.77,149.26a2.89,2.89,0,0,0,0,3l102.64,135.4C150.71,290.73,155.93,287.74,153.59,284.66Z'/%3E%3C/svg%3E");
    position:relative;
    z-index: 15;
}

.shape-icon {
    font-size: 14px;
    position: relative;
    bottom: 35px;
    left: 13px;
}
</style>
