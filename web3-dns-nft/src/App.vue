<script setup>
import { onMounted, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import WalletConnect from "./components/WalletConnect.vue";
import InputForm from "./components/InputForm.vue";

const currentAccount = ref(null);

async function checkIfWalletIsConnected() {
  const { ethereum } = window;
  if (!ethereum) {
    // console.log('error');
    return;
  } else {
    console.log("ethereum", ethereum);
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });
  console.log(accounts);
  if (accounts.length !== 0) {
    const account = accounts[0];
    currentAccount.value = account;
  } else {
    console.log("no authorized account");
  }
}

onMounted(checkIfWalletIsConnected);
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.png"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="Welcome!" />
    </div>
  </header>

  <main>
    <WalletConnect v-if="!currentAccount" v-model:account="currentAccount" />
    <InputForm />
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  @apply mb-5 sm:mb-0;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
