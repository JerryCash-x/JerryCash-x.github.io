<template>
    <button :class="bgClass" type="button" @click="$emit('click')" class="text-xl py-3 px-16 text-white rounded-full"> <slot /></button>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    @Component({
        name: 'IButton'
    })
    export default class IButton extends Vue {
        @Prop({default:'bg-color'})
        public readonly bgClass!:string;
    }
</script>

<style scoped>
    .bg-color{
        background: #FD2C63;
    }
    .bg-color:disabled{
        background: #5E6062;
    }
</style>
