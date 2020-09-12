<template>
  <div class="custom-bg hover:cursor-pointer converter__from" v-click-outside="onClickOutside">
    <div>
      <div class="flex items-center justify-between text-margin">
        <div class="d-flex align-items-center">
          <div @click="open = true" v-if="selected" class="coin flex align-center">
            <img v-if="selected.icon" class="coin__logo logo-bts" :src="selected.icon" />
            <span class="coin__name ml-2">{{ selected.name }}</span>
            <i v-if="!open" class="fa fa-arrow-down text-gray-300 ml-2" aria-hidden="true"></i>
            <i v-else class="fa fa-arrow-up text-gray-300 ml-2" aria-hidden="true"></i>
          </div>
          <div
            class="text-white sm:ml-1 md:ml-3 d-flex align-items-center"
            v-if="variant === 'payment_system'"
          >
            <p class="email">{{ email }}</p>
            <img
              v-if="email !== ''"
              src="../assets/img/accept.png"
              alt="Done!"
              class="valid_email_tick"
            />
          </div>
          <div class="text-white ml-3 text-xs" v-if="variant === 'cryptocurrency'">
            Av:
            <span class="text-base d-inline">{{ balance }}</span>
          </div>
        </div>
        <input
          @keypress="onlyNumber"
          v-if="variant === 'cryptocurrency'"
          @click.stop
          @input="updateMoney"
          :class="{ validation: isLimitExceed }"
          placeholder="Enter Amount"
          class="from__input text-white text-right"
          :value="value"
        />
        <span
          v-if="isLimitExceed && variant === 'payment_system'"
          class="validation-result-money"
        >Insufficient Funds</span>
        <div class="flex flex-row items-center mr-2 p-1" v-if="variant === 'payment_system'">
          <!--                    <img class="mr-2 text-xl" src="../assets/img/dollar.svg" alt="">-->
          <i
            v-if="currencyType === 'EUR'"
            class="fas fa-euro-sign text-xl text-color-pink text-2xl md:text-4xl mr-2"
          ></i>
          <i
            v-else-if="currencyType === 'USD'"
            class="fas fa-dollar-sign text-xl text-color-pink mr-2 text-2xl md:text-4xl"
          ></i>
          <span
            class="mr-2 text-xl"
            v-if="variant === 'payment_system'"
            :class="{ 'validation-result-money': +this.value > 100 }"
          >{{ value }}</span>
          <span class="text-sm mr-2">{{ currencyType }}</span>
        </div>
      </div>
      <div v-if="variant === 'cryptocurrency'" class="arrow-down mx-auto mt-16"></div>
      <div class="choices" :class="{ hidden: !open }">
        <div v-show="step === 1">
          <!-- <div class="flex flex-row ml-3 mt-6">
            <i class="fa fa-search text-gray-500" aria-hidden="true"></i>
            <input class="ml-2" placeholder="Search..." v-model="search" />
          </div>-->
          <div class="coins-menu space-y-2 p-3 overflow-auto">
            <div
              v-for="item in filteredItems"
              :key="item.name"
              @click.stop="select(item)"
              :class="{ 'opacity-50': !item.isAllowed }"
              class="coins-item items-center item-bts pl-3"
            >
              <img class="coins__logo logo-bts ml-2" :src="item.icon" />
              <span class="text-coin">{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div v-if="selected" v-show="step === 2" class="h-100 p-3 flex flex-col">
          <div class="flex flex-row my-1">
            <img class :src="selected.icon" />
            <span class="text-gray-main text-2xl">{{ selected.name }}</span>
          </div>
          <div class="ml-1 flex-grow-1 d-flex flex-col justify-content-around">
            <label for="input-email__enter" class="text-gray-main my-1">Add Paypal Email Address</label>
            <input
              v-model="localEmail"
              type="text"
              placeholder="Email:"
              id="input-email__enter"
              class="my-1 mt-3"
            />
            <div class="flex justify-between flex-row items-center mt-3">
              <button
                type="button"
                @click="onBackClicked"
                class="text-gray-main rounded-full px-2 py-1 hover:text-gray-400"
              >Back</button>
              <button type="button" @click="onEmailDone" class="input-email__btn bg-gray-300">Done</button>
            </div>
          </div>
        </div>
        <!-- payment system email address -->
        <!-- --------------------- --------->
        <!--                <PaymentEmailPopup ref="paymentEmailPopup" />-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import CommonSelectbox from "@/interfaces/CommonSelectbox";
import ClickOutside from "vue-click-outside";

type Variant = "cryptocurrency" | "payment_system";

import { Component, Prop, Vue, Emit, Model, Ref } from "vue-property-decorator";
import PaymentEmailPopup from "@/components/PaymentEmailPopup.vue";

@Component({
  name: "Selectbox",
  components: {
    PaymentEmailPopup,
  },
  directives: {
    ClickOutside,
  },
})
export default class Selectbox extends Vue {
  public open = false;

  public step = 1;

  @Ref()
  public readonly paymentEmailPopup!: { open: () => Promise<string> };

  @Model("select") modelValue!: number;

  @Prop()
  public readonly email!: string;

  @Prop() value!: string;
  @Prop() balance!: string;

  public localEmail = "";

  @Prop({ default: "cryptocurrency" }) variant!: Variant;
  @Prop() currencyType!: string;

  @Prop() items!: CommonSelectbox[];
  @Prop() isLimitExceed!: number;

  public search = "";

  public onlyNumber($event: Event) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      $event.preventDefault();
    }
    if (keyCode === 46 && this.value.includes(".")) {
      $event.preventDefault();
    }

    if (
      this.value.length === 1 &&
      keyCode !== 46 &&
      this.value.charAt(0) === "0" &&
      $event.target.value == "0"
    ) {
      $event.preventDefault();
    }
  }

  public paymentEmailPopupIsOpened = false;

  get selected() {
    const found = this.items.find((item) => item.id === this.modelValue);
    if (found) {
      return found;
    }

    return null;
  }

  public onClickOutside() {
    this.open = false;
  }

  @Emit("change-email")
  public changeEmail(email: string) {
    return email;
  }

  public onBackClicked() {
    this.step = 1;
  }

  public async select(item: CommonSelectbox) {
    if (item.isAllowed) {
      if (this.variant === "payment_system") {
        // if(email){
        //     this.changeEmail(email);
        //     this.$emit('select', item.id)
        // }
        this.step = 2;
      } else {
        this.$emit("select", item.id);
        this.open = false;
      }
    }
  }

  public onEmailDone() {
    this.open = false;
    this.changeEmail(this.localEmail);
  }

  get filteredItems() {
    if (!this.search) {
      return this.items;
    }

    return this.items.filter(
      (item) =>
        item.name.includes(this.search) || item.value.includes(this.search)
    );
  }

  @Emit("update-money")
  public updateMoney(event: Event) {
    return (event.target as HTMLInputElement).value;
  }
}
</script>

<style scoped>
.validation {
  border: 1px solid #ff0030;
}

.text-color-pink {
  color: #fd2c63;
}

.text-gray-main {
  color: #c9c9c9;
}
.validation-result-money {
  color: #ff0030;
}
.choices {
  position: absolute;
  top: 3.4rem;
  left: 0;
  /* height: 16.6rem; */
  width: 15.8rem;
  border-radius: 22px;
  background: #ffffff;
  z-index: 99;
}

.choices__field-search {
  position: relative;
  padding: 1.25rem 1.25rem 0 1.25rem;
}

.choices__field-search::after {
  content: "";
  position: absolute;
  display: block;
  margin: 0 auto;
  top: 50px;
  left: 20px;
  width: 80%;
  height: 1px;
  background: #ebebeb;
}

.choices__field-search i {
  position: absolute;
  top: 1.6rem;
  left: 1.5rem;
  color: #cecece;
  font-size: 0.9em;
}

.coins__search {
  display: block;
  width: 90%;
  padding-left: 1.6rem;
  font: 300 1.125em "Lato", sans-serif;
  border: none;
}

.coins-menu {
  width: 100%;
  margin: 1.15rem auto 0;
  height: 200px;
  border: none;
  outline: none;
  overflow: scroll;
}

.coins-item {
  position: relative;
  display: flex;
  height: 2.55rem;
  margin-bottom: 5px;
  line-height: 2.5em;
  text-indent: 60px;
}

.coins-item:focus,
.coins-menu:focus,
.coins-menu:focus,
.coins-search:focus {
  outline: none;
}

.field__value {
  display: block;
  margin-right: 2.5rem;
  text-transform: uppercase;
  font: 400 1.875em "Lato", sans-serif;
}

@media screen and (min-width: 320px) and (max-width: 375px) {
  .field__value {
    margin-right: 1rem;
    font-size: 0.9em;
    line-height: 1.2em;
  }
}

.text-margin {
  @apply mt-0;
}

@media (min-width: 768px) {
  .text-margin {
    @apply mt-3;
  }
}

@media screen and (min-width: 375px) and (max-width: 749px) {
  .field__value {
    margin-right: 1rem;
    font-size: 1.4em;
    line-height: 2.07em;
  }
}

.field__variant {
  display: block;
  position: relative;
  margin-left: 1.25rem;
  text-transform: uppercase;
  font: 400 1.875em "Lato", sans-serif;
}

@media screen and (min-width: 320px) and (max-width: 749px) {
  .field__variant {
    margin-left: 0.7rem;
    font-size: 0.95em;
    line-height: 1.6em;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .field__variant {
    margin-left: 0.7rem;
    font-size: 1.4em;
    line-height: 2.07em;
  }
}

.converter__from,
.converter__to {
  position: relative;
  width: 100%;
  height: 8.43rem;
  margin: 0.92rem 0 3.75rem;
  background: #595b5e;
  border: 33px solid rgba(67, 69, 72, 1);
  border-radius: 85px;
}

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .converter__from,
  .converter__to {
    margin: 1.25rem auto;
    height: 6.9rem;
    padding: 0.7rem 0;
    border-radius: 55px;
    border: 30px solid rgba(67, 69, 72, 1);
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .converter__from,
  .converter__to {
    padding: 0.15rem 0;
  }
}

.coins__logo {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 2.55rem;
  height: 2.55rem;
}

.coin {
  align-items: center;
  margin-left: 1.25rem;
  transition: 0.1s ease-in;
}

.coin:active {
  transform: scale(1.06);
}

.coin__logo {
  width: 2.57rem;
  height: 2.5rem;
}

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .coin__logo {
    width: 1.57rem;
    height: 1.6rem;
  }
}

/* .coin__name {
        margin-left: 3rem;
        font-size: .9em;
    } */

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .coin__name {
    margin-left: 0.4rem;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .coin__name {
    font-size: 1.4em;
    line-height: 0;
  }
}

/*.coin__name::after {*/
/*    content: "\f107";*/
/*    display: block;*/
/*    position: absolute;*/
/*    top: .17rem;*/
/*    left: 4.8rem;*/
/*    width: .625rem;*/
/*    height: .625rem;*/
/*    font: 1.1em 'FontAwesome';*/
/*}*/

@media screen and (min-width: 320px) and (max-width: 749px) {
  .coin__name::after {
    left: 2rem;
    top: 0.2rem;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .coin__name::after {
    left: 3.1rem;
    top: -0.68rem;
  }
}

.from__wrapper {
  margin-top: 0.9rem;
}

@media screen and (min-width: 320px) and (max-width: 750px) {
  .from__wrapper {
    margin-top: 0;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .from__wrapper {
    margin-top: 0.37rem;
  }
}

.from__input {
  width: 35%;
  margin-right: 2.5rem;
  border-radius: 20px;
  background: inherit;
  padding: 0.3rem 0.3rem 0.5rem 1rem;
  font-size: 1.2rem;
  color: rgb(43, 45, 48);
}

@media screen and (min-width: 320px) and (max-width: 749px) {
  .from__input {
    font-size: 0.9em;
    margin-right: 1rem;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .from__input {
    margin-right: 1rem;
  }
}

.from__input::placeholder {
  font-size: 0.9em;
  color: white;
}

.text-coin {
  color: #9a9a9a;
  font-size: 1.7em;
  line-height: 1.5em;
  text-indent: 3rem;
}

/* -------------converter__to-------------------- */

@media screen and (min-width: 1100px) {
  .converter__to {
    margin-bottom: 1.875rem;
  }
}

@media screen and (max-width: 750px) {
  .to__wrapper {
    align-items: center;
  }
}

/* ------------ TO FIELD------ */

.to__wrapper::before {
  content: "to";
  position: absolute;
  top: -1.56rem;
  left: 2.5rem;
  font-family: "Lato";
  font-size: 0.75em;
  font-weight: 400;
  text-transform: uppercase;
  color: #fff;
}

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .to__wrapper::before {
    top: -1.3rem;
    left: 1rem;
    font-size: 0.6em;
  }
}

.to__coin {
  margin-left: 2.5rem;
}

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .to__coin {
    margin-left: 1.25rem;
  }
}

.to__coin::after {
  content: "\f107";
  display: block;
  position: absolute;
  top: 0.2rem;
  left: 7.5rem;
  width: 0.625rem;
  height: 0.625rem;
  font: 1.1em "FontAwesome";
}

@media screen and (min-width: 320px) and (max-width: 749px) {
  .to__coin::after {
    left: 3.5rem;
    top: 0.26rem;
  }
}

@media screen and (min-width: 750px) and (max-width: 849px) {
  .to__coin::after {
    left: 5.3rem;
    top: 0.7rem;
  }
}

@media screen and (min-width: 850px) and (max-width: 1100px) {
  .to__coin::after {
    left: 5.4rem;
    top: 0.7rem;
  }
}

.to__from-input {
  display: block;
  align-self: center;
  font: 400 1.25em "Lato", sans-serif;
}

@media screen and (min-width: 320px) and (max-width: 1100px) {
  .to__from-input {
    font-size: 0.625em;
    margin-top: 0;
  }
}

@media screen and (min-width: 320px) and (max-width: 419px) {
  .to__from-input {
    overflow: hidden;
    width: 25%;
  }
}

@media screen and (min-width: 420px) and (max-width: 1100px) {
  .to__from-input {
    font-size: 0.8em;
    width: 33%;
    overflow: hidden;
  }
}

@media screen and (min-width: 500px) and (max-width: 1100px) {
  .to__from-input {
    font-size: 1em;
  }
}

.to__value {
  position: relative;
}

@media screen and (min-width: 320px) and (max-width: 749px) {
  .to__value {
    padding-top: 0.25rem;
  }
}

@media screen and (min-width: 750px) and (max-width: 1100px) {
  .to__value {
    margin: 0 0.93rem 0 0;
    font-size: 1.4em;
  }
}

.to__value::before {
  content: "";
  display: block;
  position: absolute;
  top: -0.3rem;
  left: -2.8rem;
  background: url(../assets/img/dollar.svg) no-repeat center top;
  width: 2.81rem;
  height: 2.81rem;
  background-size: contain;
}

@media screen and (min-width: 320px) and (max-width: 499px) {
  .to__value::before {
    top: 0;
    left: -0.95rem;
    width: 0.75rem;
    height: 1.3rem;
  }
}

@media screen and (min-width: 375px) and (max-width: 499px) {
  .to__value::before {
    top: 1rem;
  }
}

@media screen and (min-width: 500px) and (max-width: 849px) {
  .to__value::before {
    top: 0.8rem;
    left: -1.5rem;
    width: 1.56rem;
    height: 2.56rem;
    background-size: 0.7em;
  }
}

@media screen and (min-width: 750px) and (max-width: 849px) {
  .to__value::before {
    top: 0;
    padding-right: 0.5rem;
  }
}

@media screen and (min-width: 850px) and (max-width: 1100px) {
  .to__value::before {
    top: 0;
    left: -1.8rem;
    width: 1.56rem;
    height: 2rem;
    background-size: 0.7em;
  }
}

.currency__value {
  color: #ffffff;
  font-family: Lato;
  font-size: 0.75em;
  font-weight: 300;
  text-transform: uppercase;
}

@media screen and (min-width: 360px) and (max-width: 1100px) {
  .currency__value {
    font-size: 0.5em;
  }
}

.email {
  display: none;
}

@media only screen and (min-width: 768px) {
  .email {
    display: inline-block;
  }
}

.valid_email_tick {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
}
</style>
