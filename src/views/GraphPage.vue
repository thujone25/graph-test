<template>
  <div class="graph-page">
    <div ref="graphPaper" class="graph-page__graph-paper"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      j: null,
      namespace: null,
      graph: null,
      paper: null,
      sidebarRect: null
    }
  },
  mounted() {
    this.j = window.joint;
    if (this.j) {
      this.namespace = this.j.shapes;
      this.graph = new this.j.dia.Graph({}, { cellNamespace: this.namespace });
      this.paper = new this.j.dia.Paper({
        el: this.$refs.graphPaper,
        model: this.graph,
        width: '100%',
        height: '100%',
        gridSize: 1,
        embeddingMode: true,
        cellViewNamespace: this.namespace,
        interactive: (cellView) => {
          if (cellView.model.get('locked')) {
            return {
              elementMove: false
            };
          }
          return true;
        }
      });
      this.sidebarRect = new this.j.shapes.standard.Rectangle();
      this.sidebarRect.set('locked', true);
      this.sidebarRect.position(0, 0);
      this.sidebarRect.resize(180, 1000);
      this.sidebarRect.attr({
          body: {
              fill: 'yellow'
          },
          label: {
              text: 'Template',
              fill: 'black'
          }
      });
      this.sidebarRect.addTo(this.graph);
      // var rect = new this.j.shapes.standard.Rectangle();
      // rect.position(100, 30);
      // rect.resize(100, 40);
      // rect.attr({
      //     body: {
      //         fill: 'blue'
      //     },
      //     label: {
      //         text: 'Hello',
      //         fill: 'white'
      //     }
      // });
      // rect.addTo(this.graph);

      // var rect2 = rect.clone();
      // rect2.translate(300, 0);
      // rect2.attr('label/text', 'World!');
      // rect2.addTo(this.graph);

      // var link = new this.j.shapes.standard.Link();
      // link.source(rect);
      // link.target(rect2);
      // link.addTo(this.graph);
    }
  }
};
</script>

<style scoped>
.graph-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.graph-page__graph-paper {
  flex-grow: 1;
  border: 5px solid green;
}
</style>
