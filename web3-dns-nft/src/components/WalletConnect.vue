<script setup>
defineProps({
  currentAccount: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:account"]);

async function connectWallet() {
  const { ethereum } = window;
  try {
    if (!ethereum) {
      alert("Please install MetaMask");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    emit("update:account", accounts[0]);
    console.log("account: ", accounts[0]);
  } catch (err) {
    console.log("error", err);
    alert(err.message);
  }
}
</script>

<template>
  <div class="cw-container">
    <iframe
      src="https://giphy.com/embed/rPbVaGPnheoQ2dFkND"
      width="200"
      height="200"
      frameBorder="0"
      class="giphy-embed"
      allowFullScreen
    />
    <button @click="connectWallet">Connect Wallet</button>
  </div>
</template>

<style scoped lang="postcss">
.cw-container {
  @apply flex flex-col justify-center items-center;
}
</style>
