<template>
  <IModal ref="modal" :visible="visible" @close="close">
      <div v-if="loading" class="flex flex-col items-center ">
          <div class="processing__cycle">
              <i  class="fas fa-circle-notch"></i>
          </div>
          <p class="text-gray-custom font-bold text-3xl text-center">Processing…</p>
      </div>
      <div class="text-center flex flex-col items-center" v-else-if="error">
          <img class="w-64" src="../../assets/img/error.png" alt="">
          <p class="text-gray-custom font-bold text-3xl">Error...</p>
          <p class="text-gray-custom">{{error}}</p>
      </div>
      <div v-else class="flex flex-col items-center justify-center">
          <img src="../../assets/img/accept.png" alt="Done!" class="complete__img">
          <p class="text-gray-custom text-center font-bold text-3xl">Transfer Complete!</p>
<!--          <button class="pink-btn text-center">Continue</button>-->
          <IButton class="mt-8" @click="close">Continue</IButton>
      </div>
  </IModal>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Portal } from 'portal-vue';
    import IModal from "../IModal.vue";
    import BaseModal from "../BaseModal";
    import IButton from '@/components/IButton.vue';

    @Component({ name: 'TransferModal', components: {IButton, IModal, Portal } })
    export default class TransferModal extends BaseModal {

        @Prop({required: true})
        public readonly loading!: boolean;

        @Prop({required: true})
        public readonly error!: string;
    }
</script>
