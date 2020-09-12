<template>
    <div v-if="opened" class="converter__input-email shadow-md border border-gray-100">
        <div class="input-email__wrapper">
<!--            <div class="converter__selected-system">Value 1</div>-->
            <label for="input-email__enter">Add Paypal Email Address</label>
            <input v-model="value" type="text" placeholder="Email:" id="input-email__enter">
            <button type="button" @click="success" class="input-email__btn">Done</button>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue, Emit, Model} from "vue-property-decorator";
    import ClickOutside from 'vue-click-outside';
    @Component({
        name:'PaymentEmailPopup',
        directives: {
            ClickOutside
        }
    })
    export default class PaymentEmailPopup extends Vue {
        public value = '';

        public opened = false;

        @Emit('close')
        public close(result: string | null){
            return result;
        }

        public success(){
            this.close(this.value);
        }

        public failure(){
            this.close(null);
        }

        public open(){
            this.opened = true;
            return new Promise(resolve => {
                this.$on('close', (result:  string | null) => {
                    this.opened = false;
                    resolve(result);
                })
            })

        }


    }
    </script>

<style scoped>

</style>
