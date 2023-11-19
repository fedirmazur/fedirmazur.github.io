<template>
  <main>
    <h1>Заголовок</h1>
    <MatchList :data-list="matchSet" @success="onSuccess"  @wrong="onWrong" />
  </main>
</template>

<script>
import { MATCH_LIST, MATCH_QUANTITY } from "@/constants";
import MatchList from "@/components/MatchList.vue";
import router from "@/router";

export default {
  components: { MatchList },
  beforeMount() {
    this.getNewMatchSet();
  },
  data() {
    return {
      matchSet: []
    }
  },
  methods: {
    getNewMatchSet() {
      const listLength = MATCH_LIST.length;
      const indexList = new Set();

      while (indexList.size < MATCH_QUANTITY) {
        const randomIndex = Math.floor(Math.random() * listLength);
        indexList.add(randomIndex);
      }
      const indexListArr = [...indexList];
      this.matchSet = MATCH_LIST.filter((i, index) => indexListArr.includes(index));
    },
    onSuccess() {
      router.push({ path: '/success' });
    },
    onWrong() {
      router.push({ path: '/repeat' });
    }
  },
}
</script>


