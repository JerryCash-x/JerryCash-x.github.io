<template>
  <div id="app">
    <PortalTarget name="modals" />
    <div class="main">
      <header class>
        <div class="container">
          <div class="flex justify-between relative">
            <img src="./assets/img/beta.png" class="absolute header__beta" alt />
            <a href="#" class="header__logo-link p-8">
              <img class="header__logo" src="./assets/img/caco-logo.svg" alt="Caco | cash 4 crypto" />
            </a>
            <CurrenciesSelectbox
              :value="currentCurrency"
              @change="onCurrencyChange"
              :currencies="currencies"
            />
          </div>
        </div>
      </header>

      <TransferModal
        :error="transferError"
        :loading="isTranferModalProcessing"
        :visible="transferModalVisible"
        @close="transferModalVisible = false"
      />

      <!--      <TransferModal-->
      <!--              :error="''"-->
      <!--              :loading="false"-->
      <!--              :visible="true"-->
      <!--      />-->
      <section class="converter">
        <div class="container">
          <div class="converter__wrapp-text">
            <h1 class="converter__title text-center">Fast and simple way to transfer coins for cash</h1>
            <h2 class="converter__title-mobile text-center d-none">Quick Cryptocurrency Withdrawal</h2>
            <p class="converter__text text-center">
              Transfer any coins under the value of $100 and receive cash
              immediately.
            </p>
          </div>
          <!-- On click on btn Donate replace title -->
          <!-- ------------------------------------ -->
          <div class="donate__wrapp-text d-none">
            <h1
              class="donate__title text-center"
            >Donate any unwanted coins and help someone in need.</h1>
            <p class="donate__text text-center">
              You will be given the option to provide your email address, to
              update you on where your coins were used.
            </p>
          </div>
          <div class="menu-options field-bg d-flex">
            <button
              :class="{ 'option-active': activeTab === 'transfer' }"
              @click="setTab('transfer')"
              class="menu-option menu__transfer text-center shadow-none"
            >Transfer</button>
            <button
              :class="{ 'option-active': activeTab === 'donate' }"
              @click="setTab('donate')"
              class="menu-option menu__donate text-center shadow-none"
            >Donate</button>
          </div>
          <div v-if="activeTab === 'transfer'" class="form__wrapper">
            <form action="#" id="converter__form" class>
              <Selectbox
                @update-money="amount = $event"
                :is-limit-exceed="isLimitExceed"
                :value="amount"
                :balance="balance"
                :model-value="selectedCryptoCurrency"
                @select="onCryptoCurrencyChange"
                :items="cryptoCurrencies"
              />
              <Selectbox
                :is-limit-exceed="isLimitExceed"
                variant="payment_system"
                :email="email"
                @change-email="email = $event"
                :currency-type="currencyType"
                :value="resultMoney"
                v-model="selectedDestination"
                :items="paymentSystems"
                class="mb-3"
              />
              <!-- PRIVATE KEY FIELD -->
              <PrivateKeyModal
                :visible="privateKeyModalVisible"
                @close="privateKeyModalVisible = false"
              />
              <div class="gas__row">
                <div class="gas__col">
                  <p class="gas__label">Gas</p>
                  <div class="gas__button__col">
                    <button
                      type="button"
                      :class="{ 'gas__button__selected': selectedGas === 'low' }"
                      @click="setSelectedGas('low')"
                      class="gas__button"
                    >Low</button>
                    <label class="gas__item__label">0.30</label>
                  </div>
                  <div class="gas__button__col">
                    <button
                      type="button"
                      :class="{ 'gas__button__selected': selectedGas === 'med' }"
                      @click="setSelectedGas('med')"
                      class="gas__button"
                    >Med</button>
                    <label class="gas__item__label">0.45</label>
                  </div>
                  <div class="gas__button__col">
                    <button
                      type="button"
                      :class="{ 'gas__button__selected': selectedGas === 'high' }"
                      @click="setSelectedGas('high')"
                      class="gas__button"
                    >High</button>
                    <label class="gas__item__label">0.55</label>
                  </div>
                </div>
              </div>
              <div class="flex flex-col md:flex-row mt-4 justify-between">
                <div class="converter__wallet-complete d-none">
                  <div class="wallet__select d-flex">
                    <div class="wallet__variant text-center"></div>
                  </div>
                </div>
                <ConnectWalletButton :account="account" @change="onAccountChange" class="md:w-1/3" />
                <IButton
                  @click="send"
                  :disabled="transferNowDisabled"
                  class="md:mt-0 md:w-1/3 md:ml-4"
                >Transfer Now</IButton>
              </div>
              <div class="customInfoRow">
                <div class="customInfoCol">
                  <div class="d-flex justify-content-center mt-2">
                    <span class="agree__text">
                      By clicking "Transfer Now" you agree to the
                      <a
                        href="https://drive.google.com/file/d/1P8AhZuP6856r7Pq7UgMKxBjlKseuPn3O/view?usp=sharing"
                        class="agree__link"
                        target="_blank"
                      >Terms & Conditions</a>
                    </span>
                  </div>
                  <label class="checkboxContainer">
                    <p class="agree__text ml-1">Receive updates on CACO developments</p>
                    <input type="checkbox" checked="checked" />
                    <span class="checkboxCheckmark"></span>
                  </label>
                </div>
              </div>
            </form>
            <!-- ------------------------------------------- -->
            <!-- DONATE FIELD-------------------------- -->
            <!-- ------------------------------------------- -->
            <form action="#" id="donate__form" class="d-none">
              <div class="converter__field donate__from">
                <div class="from__wrapper d-flex field">
                  <span class="from__coin field__variant">bts</span>
                  <span class="from__value field__value">0.00000</span>
                </div>
                <!-- --------------------------- -->
                <!-- poppup on click on currency -->
                <div class="choices coins-container d-none">
                  <div class="choices__field-search d-flex">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input type="search" class="coins-search" placeholder="Search" />
                  </div>
                  <div class="coins-menu">
                    <div class="coins-item item-bts">Value 1</div>
                    <div class="coins-item item-eth">Value 2</div>
                    <div class="coins-item item-xrp">Value 3</div>
                    <div class="coins-item item-ada">Value 4</div>
                    <div class="coins-item item-eth">Value 5</div>
                  </div>
                </div>
              </div>
              <div class="converter__field donate__field donate__to">
                <div class="donate-to__wrapper d-flex field">
                  <span class="donate-to__coin field__variant">CACO’s Charities</span>
                  <!-- span "to__from-input" for entered email address -->
                  <!-- ------------------------------ -->
                  <span class="donate-to__from-input d-none"></span>
                  <span class="donate-to__value field__value">
                    bts
                    <span class="currency__value">000.12</span>
                  </span>
                </div>
                <!-- --------------------------- -->
                <!-- poppup on click on currency 'TO' -->
                <div class="choices donate-coins-container d-none">
                  <div class="coins-menu">
                    <div class="coins-item item__pay-pal">Value 1</div>
                    <div class="coins-item item__apple-pay">Value 2</div>
                    <div class="coins-item item__google-pay">Value 3</div>
                    <div class="coins-item item__skrill">Value 4</div>
                  </div>
                </div>
                <!-- payment system email address -->
                <!-- --------------------- --------->
                <div class="converter__input-email donate__input-email d-none">
                  <div class="input-email__wrapper">
                    <div class="converter__selected-system">Value 1</div>
                    <label for="input-email__enter">Add Paypal Email Address</label>
                    <input type="text" placeholder="Email:" id="input-email__enter" />
                    <button class="input-email__btn">Done</button>
                  </div>
                </div>
              </div>
              <div class="converter__btns donate__btns d-flex">
                <button class="converter__wallet donate__wallet">Connect Wallet</button>
                <!-- button CONNECTED -->
                <!-- ---------------- -->
                <button class="converter__wallet-done donate__wallet-done d-none">Connected</button>
                <!-- ------ available wallet -->
                <!-- ----------------------- -->
                <div class="converter__payment-var donate__payment-var d-flex d-none">
                  <div class="wallet__variant wallet-1 text-center"></div>
                  <div class="wallet__variant wallet-2 text-center"></div>
                  <div class="wallet__variant wallet-3 text-center"></div>
                  <div class="wallet__variant wallet-4 text-center">Direct</div>
                  <button class="payment-var-back d-none">Back</button>
                </div>
                <!-- this "converter__wallet-complete" for selected wallet -->
                <!-------------------------------------------------------  -->
                <div class="converter__wallet-complete donate__wallet-complete d-none">
                  <div class="wallet__select d-flex">
                    <div class="wallet__variant text-center"></div>
                  </div>
                </div>
                <button class="converter__transfer donate__btn-donate">Donate Now</button>
              </div>
              <div class="converter__agree donate__agree d-flex">
                <p class="agree__text">By clicking "Transfer Now" you agree to the</p>
                <a
                  href="https://drive.google.com/file/d/1P8AhZuP6856r7Pq7UgMKxBjlKseuPn3O/view?usp=sharing"
                  target="_blank"
                  class="agree__link"
                >Terms & Conditions</a>
              </div>
            </form>
          </div>
          <div class="flex justify-center flex-col items-center" v-else-if="activeTab === 'donate'">
            <img class="w-16 mt-16" src="./assets/img/charities.png" alt />
            <p class="font-bold text-3xl mt-2">Make a difference!</p>
            <p class="text-xl text-center mt-2">
              Soon you will have the opportunity to donate any of your unwanted coins
              to CACO's chosen charities
            </p>
          </div>
        </div>
      </section>
      <!-- <section class="overflow-hidden w-full relative mt-32" style="height: 100px;">
               <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
      </section>-->
      <footer>
        <div class="container">
          <div class="footer__wrapper">
            <!--   <a href="#" class="footer__logo">
            <img class="header__logo" src="./assets/img/caco-logo.svg" alt="Caco | cash 4 crypto" />
            </a>-->
            <!-- <div class="footer__nav d-flex"> -->
            <div class="footer__items d-flex">
              <a href="#" class="footer__item">Contact</a>
              <a
                href="https://drive.google.com/file/d/1P8AhZuP6856r7Pq7UgMKxBjlKseuPn3O/view?usp=sharing"
                target="_blank"
                class="footer__item"
              >Terms & Conditions</a>
              <!-- <a href="#" class="footer__item">Cookie Policy</a>-->
            </div>
            <p class="footer__items">© 2020 Cash4Crypto</p>
            <div class="footer__items flex flex-row justify-around space-x-2 md:w-1/4">
              <a target="_blank" href="https://twitter.com/cacoglobal" class="w-8">
                <img src="./assets/img/Twitter.png" alt />
              </a>
              <a target="_blank" href class="w-8">
                <img src="./assets/img/Telegram.png" alt />
              </a>
              <a target="_blank" href="https://www.reddit.com/user/cacoglobal" class="w-8">
                <img src="./assets/img/Reddit.png" alt />
              </a>
              <a target="_blank" href="https://join.status.im/caco" class="w-8">
                <img src="./assets/img/Status.png" alt />
                <!-- <span style="color: #c9c9c9;">#caco</span> -->
              </a>
            </div>
            <!-- </div> -->
          </div>
        </div>
      </footer>
      <!---------------------- window 'processing'-->
      <!-- --------------------------------------- -->
      <!-- window 'would you like to be notified?' -->
      <!-- -=------------------------------------- -->
      <section class="notified d-none">
        <div class="notified__wrapp">
          <p class="notified__title text-center">
            If you would like to be notified of how your coins helped, enter your
            email below.
          </p>
          <div class="notified__input-wrapp">
            <img src="assets/img/envelope.png" alt class="input__icon" />
            <input
              type="text"
              placeholder="Email Address (Optional)"
              class="notified__email border-grey"
            />
          </div>
          <button class="notified__btn pink-btn">Continue</button>
        </div>
      </section>
      <!-- window THANK'S---------------- -->
      <!-- ------------------------------ -->
      <section class="thanks d-none">
        <div class="thanks__wrapp">
          <img src="assets/img/thank.png" alt class="thanks__img" />
          <p class="thanks__title text-center">Thank you for your donation!</p>
          <p class="thanks__note text-center">Please note:</p>
          <p class="thanks__text text-center">
            As we use an extremley low gas fee, your coins will take some time to
            transfer and could take upwards of 30 Days. You will be notified once
            the transfer has been made.
          </p>
          <button class="pink-btn thanks__btn">Continue</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import MetamaskService from "@/MetamaskService";

const getAfterCommaSigns = (x: number) =>
  x.toString().includes(".") ? x.toString().split(".").pop().length : 0;
// @ts-nocheck
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Header from "./components/Header.vue";
import axios from "axios";
import TrezorConnect from "trezor-connect";
import { Wallet } from "@/interfaces/Wallet";
import Selectbox from "@/components/Selectbox.vue";
import IModal from "@/components/IModal.vue";
import TransferModal from "@/components/modals/TransferModal.vue";
import Web3 from "web3";
import PrivateKeyModal from "@/components/modals/PrivateKeyModal.vue";
import ConnectWalletButton from "@/components/ConnectWalletButton.vue";
import IButton from "@/components/IButton.vue";
import CurrenciesSelectbox from "@/components/CurrenciesSelectbox.vue";
import * as signalR from "@microsoft/signalr";
import Entity from "./interfaces/Entity";
import CommonSelectbox from "@/interfaces/CommonSelectbox";
import ConnectedWalletEntity from "@/interfaces/ConnectedWalletEntity";
import { erc20TokenContractAbi } from "@/constants";
type AppTab = "transfer" | "donate";
type Gas = "low" | "med" | "high";

const ethEnabled = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return true;
  }
  return false;
};

const baseURL = "https://api-cash4crypto.azurewebsites.net/api";

@Component({
  components: {
    CurrenciesSelectbox,
    IButton,
    ConnectWalletButton,
    PrivateKeyModal,
    TransferModal,
    IModal,
    Selectbox,
    HelloWorld,
    Header,
  },
})
export default class App extends Vue {
  public activeTab: AppTab = "transfer";
  public selectedGas: Gas = "low";

  public setTab(tab: AppTab) {
    this.activeTab = tab;
  }

  public setSelectedGas(gas: Gas) {
    this.selectedGas = gas;
  }

  public paymentSystems: CommonSelectbox[] = [
    {
      id: 1,
      name: "PayPal",
      value: "paypal",
      icon: require("./assets/img/paypal.svg"),
      isAllowed: true,
    },
    {
      id: 2,
      name: "Google Pay",
      value: "googlepay",
      icon: require("./assets/img/googlepay.svg"),
      isAllowed: false,
    },
    {
      id: 3,
      name: "Apple Pay",
      value: "applepay",
      icon: require("./assets/img/applepay.svg"),
      isAllowed: false,
    },
  ];

  public connectedWallet: ConnectedWalletEntity | null = null;

  public currentCurrencyAmount = 0;

  public loading = false;

  public visible = true;

  public email = "";

  public account = "";

  public balance = 0;

  public selectedCryptoCurrency = 3;

  public selectedDestination = 1;

  public currentCurrency = 1;

  public connection: signalR.HubConnection | null = null;

  public amount = "";

  public currencies: Entity[] = [];

  public privateKeyModalVisible = false;

  public transferModalVisible = false;

  public isTranferModalProcessing = false;

  public transferError = "";

  public cryptoCurrencies: (CommonSelectbox & {
    contractAddress: string;
  })[] = [];

  public currencyExchangeRate = 0;

  public async loadCurrencies() {
    const response = await axios.get(`${baseURL}/supported-tokens/currencies`);

    this.currencies = response.data;
  }

  public async onCryptoCurrencyChange(cryptocurrency: number) {
    if (this.connection) {
      await this.connection.invoke(
        "Unsubscribe",
        this.selectedCryptoCurrency,
        this.currentCurrency
      );

      this.selectedCryptoCurrency = cryptocurrency;

      await this.connection.invoke(
        "Subscribe",
        this.selectedCryptoCurrency,
        this.currentCurrency
      );

      const coin = this.cryptoCurrencies.find(
        (crypto) => crypto.id === this.selectedCryptoCurrency
      );
      if (coin) {
        const balance = await MetamaskService.getBalance(this.account, coin);
        this.balance = parseFloat(parseFloat(balance.toString()).toFixed(4));
      }
    }
  }

  get transferNowDisabled() {
    // return false;
    return (
      !this.account ||
      (this.resultMoney && this.resultMoney > 100) ||
      this.isLimitExceed ||
      !this.selectedDestination ||
      !this.email ||
      !this.amount ||
      !Number(this.amount) ||
      +this.amount <= 0
    );
  }

  public async onAccountChange(account: string) {
    this.account = account;
    const coin = this.cryptoCurrencies.find(
      (crypto) => crypto.id === this.selectedCryptoCurrency
    );
    if (coin) {
      const balance = await MetamaskService.getBalance(this.account, coin);
      this.balance = parseFloat(parseFloat(balance.toString()).toFixed(4));
    }
  }

  get isLimitExceed() {
    return this.balance && +this.amount > this.balance;
  }

  public rounded(num: number) {
    return Math.round(num * 100) / 100;
  }

  get resultMoney() {
    return this.rounded(
      MetamaskService.getAmountMinusFee(
        +this.amount * this.currencyExchangeRate
      )
    );
  }

  get currencyType() {
    const found = this.currencies.find(
      (currency) => currency.id === this.currentCurrency
    );
    if (found) {
      return found.name;
    }

    return "";
  }

  public async onCurrencyChange(currency: number) {
    if (this.connection) {
      await this.connection.invoke(
        "Unsubscribe",
        this.selectedCryptoCurrency,
        this.currentCurrency
      );

      this.currentCurrency = currency;

      await this.connection.invoke(
        "Subscribe",
        this.selectedCryptoCurrency,
        this.currentCurrency
      );
    }
  }

  public async loadCryptoCurrencies() {
    const response = await axios.get<Entity[]>(
      `${baseURL}/supported-tokens/cryptocurrencies`
    );
    console.log(response);

    this.cryptoCurrencies = response.data
      .filter((crypto) =>
        ["eth", "dai", "usdc"].includes(crypto.name.toLowerCase())
      )
      .map((crypto) => ({
        ...crypto,
        value: crypto.name.toLowerCase(),
        icon: require(`./assets/img/${crypto.name.toLowerCase()}.svg`),
        isAllowed: true,
      }));

    this.selectedCryptoCurrency = this.cryptoCurrencies[0].id;
    if (this.connection) {
      await this.connection.invoke(
        "Subscribe",
        this.selectedCryptoCurrency,
        this.currentCurrency
      );
    }

    // this.currencies = response.data;
  }
  async created() {
    // TrezorConnect.manifest({
    //     email: 'goodfokin@gmail.com',
    //     appUrl: 'http://localhost:8000'
    // })

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseURL}/exchangeRateHub`)
      .build();

    this.connection.on("NewExchangeRate", (data) => {
      if (
        this.selectedCryptoCurrency === data.cryptocurrency &&
        this.currentCurrency === data.currency
      ) {
        this.currencyExchangeRate = +data.amount;
      }
    });

    await this.connection.start();

    await this.loadCurrencies();

    await this.loadCryptoCurrencies();

    // const response = await axios.get('https://localhost:5001/supportedtokens/cryptocurrencies')
    // console.log(response)
  }

  public getContractInstance(contractAddress: string) {
    const tokenContract = new web3.eth.Contract(
      erc20TokenContractAbi,
      contractAddress
    );

    return tokenContract;
  }

  public async getAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
  }

  public send() {
    console.log(this.amount, (Number(this.amount) * 1000 * 100000).toString());
    if (Number.isNaN(+this.amount)) {
      return;
    }
    this.sendMoney();
  }

  public async sendMoney() {
    this.transferError = "";
    // const transaction = await TrezorConnect.composeTransaction({
    //     outputs: [
    //         { amount, address: "37s3qGWXjwPeKkgAe1BjBbETUHWLUkLr2o" }
    //     ],
    //     coin,
    //     push: true
    // });
    this.isTranferModalProcessing = true;
    this.transferModalVisible = true;

    // TODO: add gas money here
    const response = await axios.post(`${baseURL}/prepare-transfer`, {
      email: this.email,
      currency: this.currentCurrency,
      cryptocurrency: this.selectedCryptoCurrency,
      destination: this.selectedDestination,
    });
    console.log(response);
    const receiver = response.data;
    const accounts = await window.web3.eth.getAccounts();
    const sender = accounts[0];
    console.log(sender);
    const callback = (err, res) => {
      if (err) {
        this.transferError = "Transfer cancelled";
      }
      this.isTranferModalProcessing = false;
    };
    const coin = this.cryptoCurrencies.find(
      (crypto) => crypto.id === this.selectedCryptoCurrency
    );

    if (coin) {
      const balance = await MetamaskService.getBalance(sender, coin);
      console.log(balance);
    }

    if (coin.value.toLowerCase() === "eth") {
      // const gasFee = await window.web3.eth.estimateGas({
      //   to: receiver,
      //   from: sender,
      //   value: window.web3.utils.toWei(this.amount, "ether"),
      // });
      // const gasPrice = await window.web3.eth.getGasPrice();

      window.web3.eth.sendTransaction(
        {
          to: receiver,
          from: sender,
          gas: 21000,
          value: window.web3.utils.toWei(this.amount, "ether"),
        },
        callback
      );
    } else {
      const contractInstance = this.getContractInstance(coin.contractAddress);

      let countAfterComma = getAfterCommaSigns(+this.amount);
      const decimals = coin.value === "usdc" ? 6 : 18;
      const tokenDecimals = window.web3.utils.toBN(decimals);
      const tokenAmountToTransfer = window.web3.utils.toBN(
        +this.amount * 10 ** countAfterComma
      );
      const calculatedTransferValue = tokenAmountToTransfer
        .mul(window.web3.utils.toBN(10).pow(tokenDecimals))
        .div(window.web3.utils.toBN(10 ** countAfterComma));

      try {
        const gas = await contractInstance.methods
          .transfer(receiver, calculatedTransferValue)
          .estimateGas();
        const result = await contractInstance.methods
          .transfer(receiver, calculatedTransferValue)
          .send({
            from: sender,
            gas,
          });
      } catch (e) {
        this.transferError = "Transfer cancelled";
        this.isTranferModalProcessing = false;
      }
    }
  }
}
</script>

<style scoped>
section .wave {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100px;
  width: 100%;
  background: url(./assets/img/wave.png);
  background-size: 1500px 100px;
}

section .wave.wave1 {
  animation: animate 80s linear infinite;
  z-index: 1000;
  opacity: 0.7;
  bottom: 0;
  animation-delay: 0s;
}

section .wave.wave2 {
  animation: animate2 40s linear infinite;
  z-index: 999;
  opacity: 0.4;
  bottom: 0;
  animation-delay: -5s;
}

section .wave.wave3 {
  animation: animate2 40s linear infinite;
  z-index: 998;
  opacity: 0.2;
  bottom: 15;
  animation-delay: -2s;
}

section .wave.wave4 {
  animation: animate2 40s linear infinite;
  z-index: 997;
  opacity: 0.1;
  bottom: 20;
  animation-delay: -1s;
}

@keyframes animate {
  0% {
    background-position-x: 0;
  }

  100% {
    background-position-x: 1500px;
  }
}

@keyframes animate2 {
  0% {
    background-position-x: 0;
  }

  100% {
    background-position-x: -1500px;
  }
}
.validation {
  border: 1px solid #ff0030;
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
  background: rgba(67, 69, 72, 0.3);
  padding: 0.3rem 0.3rem 0.5rem 1rem;
  font-size: 1.2rem;
  color: #fff;
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
  color: #fff;
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
  background: url(./assets/img/dollar.svg) no-repeat center top;
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

.customInfoRow {
  display: flex;
  justify-content: flex-end;
}

.customInfoCol {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.checkboxContainer {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  cursor: pointer;
  color: #fff;
  margin: 5px auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.checkboxContainer input {
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkboxCheckmark {
  height: 15px;
  width: 15px;
  color: #fff;
  border-color: #fff;
  border-style: solid;
  border-width: 0.1rem;
}
.checkboxContainer:hover input ~ .checkboxCheckmark {
  background-color: #ccc;
}

.checkboxContainer input:checked ~ .checkboxCheckmark {
}

.checkboxCheckmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkboxContainer input:checked ~ .checkboxCheckmark:after {
  display: block;
}

.checkboxContainer .checkboxCheckmark:after {
  width: 5px;
  height: 8px;
  margin-left: 3px;
  border: solid white;
  border-width: 0 1px 1px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

@media screen and (max-width: 768px) {
  .customInfoCol {
    width: 100%;
  }
}
</style>
