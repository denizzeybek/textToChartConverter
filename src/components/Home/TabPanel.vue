<template>
<vue-tabs-chrome v-model="tab" :tabs="tabs" />
</template>

<script>
import Vue from 'vue'
import VueTabsChrome from 'vue-tabs-chrome'

export default {
    components: {
        VueTabsChrome
    },
    data() {
        return {
            tab: 'google',
            tabs: [{
                    label: 'Main.e1',
                    key: 'google',
                    favicon: require('@/assets/images/gear.jpg')
                },
                {
                    label: 'Scenerio.test',
                    key: 'facebook',
                    favicon: require('@/assets/images/gear.jpg')
                },
                {
                    label: 'New Tab',
                    key: 'any-string-key',
                    favicon: (h, {
                        tab,
                        index
                    }) => {
                        return h('span', "N")
                    }
                }
            ]
        }
    }
}
</script>

<style scoped>
</style>
