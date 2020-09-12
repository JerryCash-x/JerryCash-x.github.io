<template>
  <header>
    <div class="container">
      <div class="header__wrap d-flex">
        <a href="main.html" class="header__logo col-2">
          <img
            class="header__logo"
            src="../assets/img/CACO_LOGO_Copy2.svg"
            alt="Caco | cash 4 crypto"
          />
        </a>
        <div class="header__currency text-center"  @click="open = !open">
            <button class="currency-active">
                USD
                <i class="fal fa-angle-down"></i>
            </button>
            <div class="" :class="{'hidden':!open}">
              <button class="">EUR</button>
              <button class="">UKR</button>
            </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Header extends Vue {}
</script>
