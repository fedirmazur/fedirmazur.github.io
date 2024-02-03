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
            @touchstart.prevent="dragstart"
            @drag="throttleMoving"
            @touchmove="throttleMoving"
            @dragend="dragend"
            @touchend="dragend"
          />
        </div>
      </li>
    </ul>
    <ul class="list-unstyled">
      <li
        class="row mb-2 border-secondary border-1 border"
        v-for="(item, index) in visibleList"
        :key="item.description"
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
            @touchstart="dragenter"
            @dragleave="dragleave"
            @touchleave="dragleave"
          >
            <img
              v-show="item.image"
              :key="item.image"
              class="w-100 draggable-image"
              :src="`./imgs/${item.image}`"
              :alt="item.image"
            />
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
      /** hide ghost */
      if (e.dataTransfer) {
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        img.width = 0;
        img.height = 0;
        img.opacity = 0;
        e.dataTransfer.setDragImage(img, 0, 0);
      }
      const { pageX, pageY } = e.touches?.[0] ?? e;
      this.startedPosition = { x: pageX, y: pageY };
    },
    dragMove(e) {
      const el = e.target;
      const { clientX, clientY } = e.touches?.[0] ?? e;
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
      const { clientX, clientY } = e.changedTouches?.[0] ?? e;
      const bottomElement = document?.elementFromPoint(clientX, clientY);
      if (bottomElement) {
        const index = bottomElement.dataset?.index;
        if (index) this.dragOverIndex = index.toString();
      }
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
      this.dragOverIndex = '';
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
  user-select: none;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
  }
}
.draggable-image {
  transition: transform 0.1s;
}
</style>
