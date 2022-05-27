<template>
<div>
    <div @click="addItem">
    </div>
    <div class="tabs">
        <div class="tabs-file">
            <GeneralFileSystem></GeneralFileSystem>
        </div>
        <div class="tabs-content ">
            <TabPanel></TabPanel>
            <CodeTreeEditor :codeTree="treeDataObject"></CodeTreeEditor>

        </div>
    </div>
</div>
</template>

<script>

const treeData = [
    {
        shapeType:'process',
        iconType:'comment',
        text:'Verileri yükle',
        children:[
            {
                shapeType:'process',
                iconType:'table',
                text:'("DataFileName") dosyasini yükle',
                children:[
                    {
                        shapeType:'condition',
                        iconType:'table',
                        text:'Varsa',
                        children:[
                            {
                                shapeType:'process',
                                iconType:'table',
                                text:'("Firmalar") sekmesini ("CompanyTable") tablosuna yükle',
                            }
                        ]
                    },
                ]
            },
        ]
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Başvurulari İndir',
        children:[
            {
                shapeType:'process',
                iconType:'comment',
                text:'TİTCK sitesinde oturum aç',
                children:[
                    {
                        shapeType:'process',
                        iconType:'web',
                        text:'("https://ebs.titck.gov.tr/Login/LoginView") adresine git'
                    },
                    {
                        shapeType:'process',
                        iconType:'cursor',
                        text:'("Web nesnesi") nesnesine tikla'
                    }
                ]
            }
        ]
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Cevaplanan başvurulari indir',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Cevaplanan başvurularin giden başvurularini indir',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Giden başvurulari indir',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Son bir aydaki başvurulari indir',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Başvurulari siniflandir',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'Dosyalari arşivle',
    },
    {
        shapeType:'process',
        iconType:'comment',
        text:'E-Postalari gönder',
    }
]
import TabPanel from '@/components/Home/TabPanel.vue'
import GeneralFileSystem from '@/components/FileSystem/GeneralFileSystem.vue'
import CodeTreeEditor from '@/components/codeTreeEditor/CodeTreeEditor.vue'
import { CodeTree } from '../flowChart/CodeTree'

export default {
    components: {
        TabPanel,
        CodeTreeEditor,
        GeneralFileSystem,
    },
    data() {
        return {
            treeDataObject:{}
        };
    },
    methods:{
        addItem:function(){
            // console.log("addItem")

            treeData.push({
                shapeType:'process',
                iconType:'comment',
                text:'Başvurulari siniflandir',
            });
            this.treeDataObject = new CodeTree(treeData)
        },
    },
    created(){
        // console.log("created!")
        let response = new CodeTree(treeData)
        console.log("response ", typeof(response))
        this.treeDataObject = response
        // this.$store.dispatch('setDataOnCreatedAction', response.children)
        // await this.$store.dispatch('setTreeDataAction', response.children)
        //this.$store.dispatch('setTreeDataAction2', treeData)
    },
}
</script>

<style scoped>
.splitpanes__pane {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Helvetica, Arial, sans-serif;
    color: rgba(255, 255, 255, 0.6);
    font-size: 5em;
}

.active {
    color: black !important;
}

.tabs {
    width: 100%;
    height: 96vh;
    display: flex;
}

.tabs-file {
    width: 20%;
    border-right: 1px solid black;
    height: 96vh;
    background-color: rgb(33, 37, 43);
}

.tabs-content {
    width: 80%;
    height: 90.9vh;
}
</style>
