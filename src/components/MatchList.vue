<template>
  <div>
    <ul class="row mb-5 list-unstyled">
      <li class="col" v-for="img in imageList" :key="img">
        <div class="image-box border-gray border-1 border">
          <img
            class="w-100 draggable-image"
            :src="`./imgs/${img}`"
            :alt="img"
            :data-path="img"
            @dragstart="dragstart"
            @drag="throttleMoving"
            @dragend="dragend"
          />
        </div>
      </li>
    </ul>
    <ul class="list-unstyled">
      <li
        class="row mb-2 border-secondary border-1 border"
        v-for="(item, index) in visibleList"
        :key="index"
      >
        <div class="col-3">
          <div
            class="image-box border-primary border-2 border"
            :class="{
              'bg-primary-subtle': index.toString() === dragOverIndex,
              'border': !item.image,
            }"
            :data-index="index"
            @dragenter="dragenter"
            @dragleave="dragleave"
          >
            <img v-show="item.image" class="w-100" :src="`./imgs/${item.image}`" :alt="item.image" />
          </div>
        </div>
        <div class="col-9">
          {{ item.description }}
        </div>
      </li>
    </ul>
    <button type="button" class="btn btn-success" @click="handleCheck">Перевірити</button>
  </div>
</template>

<script>
import { throttle } from "@/services/throttle";

export default {
  props: {
    dataList: Array,
  },
  mounted() {
    this.startGame();
  },
  computed: {
    imageList() {
      const imgs = this.dataList.map((i) => i.image);
      return imgs.sort(() => Math.random() - 0.5)
    },
  },
  data() {
    return {
      throttleMoving: throttle(this.dragMove),
      visibleList: [],
      dragOverIndex: '',
      startedPosition: { x: 0, y: 0 },
    }
  },
  methods: {
    startGame() {
      this.visibleList = this.dataList.map((i) => ({
        ...i,
        image: '',
      }))
    },
    dragstart(e) {
      e.dataTransfer.setDragImage(new Image(), 0, 0);
      const { pageX, pageY } = e;
      this.startedPosition = { x: pageX, y: pageY };
    },
    dragMove(e) {
      const el = e.target;
      const { clientX, clientY } = e;
      const { x, y } = this.startedPosition;
      const diff = { x: +clientX - +x, y: +clientY - +y };
      if (diff.x || diff.y) {
        el.style.transform = `translate(${diff.x}px, ${diff.y}px)`;
        el.style.pointerEvents = 'none';
      }
    },
    dragenter(e) {
      const index = e.target.dataset?.index;
      if (index) this.dragOverIndex = index.toString();
    },
    dragleave() {
      setTimeout(() => {
        this.dragOverIndex = '';
      }, 4)
    },
    dragend(e) {
      const listIndex = this.dragOverIndex;
      const path = e.target.dataset.path;
      const el = e.target;
      if (listIndex.length && path) {
        this.visibleList[listIndex].image = path;
        e.target.remove();
      } else {
        el.style.transform = "";
        el.style.pointerEvents = "";
      }
    },
    handleCheck() {
      const isRight = JSON.stringify(this.dataList) === JSON.stringify(this.visibleList);
      this.$emit(isRight ? 'success' : 'wrong');
    }
  }
}
</script>

<style lang="scss" scoped>
.image-box {
  height: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.draggable-image {
  transition: transform 0.1s;
}
</style>
