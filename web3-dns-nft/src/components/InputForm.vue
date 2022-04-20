<script setup>
import { ref, onMounted, watch } from "vue";
import { ethers } from "ethers";
import contractAbi from "../../../artifacts/contracts/Domains.sol/Domains";

console.log(contractAbi);

const domain = ref("");
const record = ref("");
const tld = ref("mrth2");
const CONTRACT_ADDRESS = "0xb0CA81E8f21C427BbF68627BC97dF6Adcc6Fad38";

const domainRef = ref();
const recordRef = ref();
async function mintDomain() {
  if (!domain.value) {
    domainRef.value.setCustomValidity("Please enter a domain name");
    domainRef.value.reportValidity();
    return;
  }
  if (!record.value) {
    recordRef.value.setCustomValidity("Please enter a record");
    recordRef.value.reportValidity();
    return;
  }

  if (domain.value.length < 3) {
    alert("Domain name must be at least 3 characters long");
    return;
  }

  const price =
    domain.value.length === 3
      ? "0.5"
      : domain.value.length === 4
      ? "0.3"
      : "0.1";
  console.log("minting domain", domain.value, "with price", price);

  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );

      console.log("call blockchain to register domain");
      let tx = await contract.register(domain.value, {
        value: ethers.utils.parseEther(price),
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log(
          "domain minted https://mumbai.polygonscan.com/tx/" + tx.hash
        );
      }
      // save the record to blockchain contract
      tx = await contract.setRecord(domain.value, record.value);

      await tx.wait();
      record.value = "";
      domain.value = "";

      console.log("record set! https://mumbai.polygonscan.com/tx/" + tx.hash);
    } else {
      alert("Transaction failed, please try again!");
    }
  } catch (error) {
    console.log("error", error);
    alert(error.message);
  }
}
const tldRef = ref();
const domainRight = ref(0);
function checkFontLoaded() {
  return document.fonts.check("20px NftOpenSea");
}
function updateDomainRight() {
  if (!checkFontLoaded() || !tldRef.value) {
    setTimeout(updateDomainRight, 100);
  } else {
    domainRight.value = tldRef.value.clientWidth + 10;
  }
}
onMounted(() => {
  updateDomainRight();
});
</script>

<template>
  <form @submit.prevent="mintDomain" class="form-container">
    <div class="form-group">
      <label for="domain">Domain</label>
      <input
        ref="domainRef"
        type="text"
        class="form-input"
        :style="{ paddingRight: domainRight + 'px' }"
        id="domain"
        v-model="domain"
        placeholder="Enter domain name"
      />
      <p ref="tldRef" class="tld">.{{ tld }}</p>
    </div>
    <div class="form-group">
      <label for="record">Record</label>
      <input
        ref="recordRef"
        type="text"
        class="form-input"
        id="record"
        v-model="record"
        placeholder="Enter record"
      />
    </div>
    <div class="form-group">
      <button type="submit" class="mint-button">Mint Domain</button>
    </div>
  </form>
</template>

<style scoped lang="postcss">
.form-container {
  @apply flex flex-col justify-center items-center w-full px-10 text-white font-medium;
}
.form-group {
  @apply mt-4 flex flex-row justify-center items-center w-full gap-3;
}
.tld {
  @apply self-end absolute text-black right-2 top-1;
}
.form-input {
  @apply h-9 w-full px-2 text-black;
}
</style>
