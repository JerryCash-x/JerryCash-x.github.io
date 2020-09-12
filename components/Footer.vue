<template>
 <footer>
     asfasf
        <section class="overflow-hidden w-full">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
            <div class="wave wave4"></div>
        </section>
     safasf
        <div class="container">
            <div class="footer__wrapper">
                <a href="#" class="footer__logo">
                    <img class="header__logo" src="./assets/img/caco-logo.svg" alt="Caco | cash 4 crypto">
                </a>
                <div class="footer__nav d-flex">
                    <div class="footer__items d-flex">
                        <a href="#" class="footer__item">Terms & Conditions</a>
                        <a href="#" class="footer__item">Privacy Policy</a>
                        <a href="#" class="footer__item">Cookie Policy</a>
                    </div>
                    <div class="footer__socials d-flex">
                        <a href="#" class="social__item">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="social__item">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="social__item">
                            <i class="fa fa-vk" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="social__item">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
                <p class="footer__rights text-center">© 2020 Cash4Crypto</p>
            </div>
        </div>
    </footer>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Footer extends Vue {}
</script>

<style scoped>
    .wave{
        position: absolute;;
        bottom: 0;
        left: 0;
        height: 100px;
        background: url(../assets/img/wave.png);
        background-size: 1000px 100px;
    }

    .wave.wave1{
        animation: animate 30s linear infinite;
    }

    @keyframes animate {
        0%{
            background-position-x: 0;
        }

        100%{
            background-position-x: 1000px;
        }
    }
</style>
