<template>
  <div
    v-click-outside="close"
    class="text-center text-xs hover:cursor-pointer relative pt-6 currencySelection"
  >
    <button
      @click.prevent="open = !open"
      :class="open?'button__open':'button__closed'"
      class="bg-color text-white py-2 px-4 currencyButton"
    >
      <span v-if="selected">{{selected.name}}</span>
      <i class="fa fa-arrow-down ml-3"></i>
    </button>
    <div v-show="open" class="flex flex-col absolute bg-white rounded-b-lg w-full">
      <button
        class="p-2 z-50"
        @click.stop="select(currency)"
        v-for="(currency,key) in currencies"
        :key="key"
      >{{currency.name}}</button>
    </div>
  </div>
</template>

<script lang="ts">
type Currency = { id: number; name: string };
import { Component, Model, Prop, Vue, Emit } from "vue-property-decorator";
import ClickOutside from "vue-click-outside";
@Component({
  name: "CurrenciesSelectbox",
  directives: {
    ClickOutside,
  },
})
export default class CurrenciesSelectbox extends Vue {
  public open = false;

  @Model("change")
  public readonly value!: number;

  @Emit("change")
  public select(currency: Currency) {
    this.open = false;
    return currency.id;
  }

  get selected() {
    return this.currencies.find((currency) => currency.id === this.value);
  }

  public close() {
    this.open = false;
  }

  @Prop({ default: () => [] })
  currencies!: Currency[];
}
</script>

<style scoped>
.bg-color {
  background: #fd2c63;
}

.button__open {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.button__closed {
  border-radius: 2rem;
}

.currencyButton {
  transition: none;
}

@media only screen and (min-width: 768px) {
  .currencySelection {
    font-size: 0.875rem;
  }
}
</style>
