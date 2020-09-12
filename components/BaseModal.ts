import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import IModal from './IModal.vue'

@Component
export default class BaseModal extends Vue {
    @Prop({ required: true })
    readonly visible!: boolean;

    @Ref()
    public modal!: IModal;

    @Emit('close')
    public close() {
        return false;
    }

    public closeWithCallback(callback: Function) {
        this.modal.$once('close', callback);
        this.close();
    }
}
