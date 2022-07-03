<template>
  <div class="graph-page">
    <div ref="graphPaper" class="graph-page__graph-paper"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      elementsCounter: 0,
      templateRectId: null,
      parents: [],
      j: null,
      namespace: null,
      graph: null,
      paper: null,
      sidebarRect: null
    }
  },
  methods: {
    createTemplateRect() {
      const rect = new this.j.shapes.standard.Rectangle();
      rect.position(15, 15);
      rect.resize(150, 44);
      rect.attr({
          body: {
              fill: 'blue'
          },
          label: {
              text: 'Template elem',
              fill: 'white'
          }
      });
      this.templateRectId = rect.id;
      rect.addTo(this.graph);
    },
    createParentElement() {
      const parentRect = new this.j.shapes.standard.Rectangle();
      parentRect.resize(180, 74);
      parentRect.attr({
        body: {
            fill: 'pink'
        }
      });
      this.parents.push(parentRect.id);
      return parentRect;
    },
    manageParent(el) {
      const parent = el.getParentCell();
      if (!parent) {
        const elemPos = el.position();
        const newParent = this.createParentElement();
        newParent.position(elemPos.x - 15, elemPos.y - 15);
        newParent.embed(el);
        newParent.addTo(this.graph);
        el.toFront();
      } else {
        this.handleChildrenPos(parent);
      }
    },
    handleChildrenPos(parent) {
      const parentPos = parent.position();
      const constX = parentPos.x + 15;
      const cells = parent.getEmbeddedCells();
      parent.fitEmbeds({padding: 15});
      for (let i = 0, lim = cells.length; i < lim; i += 1) {
        const cell = cells[i];
        const yPos = parentPos.y + 15 + (44 * i) + (i ? (8 * i) : 0);
        cell.position(constX, yPos);
      }
      parent.fitEmbeds({padding: 15});
    },
    removeElement(el) {
      el.remove();
    },
    onElPointerUp(el) {
      const currentElement = el.model;
      const isTemplateElem = currentElement.id === this.templateRectId
      if (currentElement.position()?.x > 180) {
        if (isTemplateElem) {
          this.elementsCounter += 1;
          currentElement.attr({
            label: {
                text: `Element #${this.elementsCounter}`
            }
          });
          this.createTemplateRect();
        }
        if (!this.parents.includes(currentElement.id)) this.manageParent(currentElement);
      } else {
        if (isTemplateElem) {
          currentElement.position(15, 15);
        } else {
          this.removeElement(currentElement);
        }
      }
      this.fitAllParents()
    },
    fitAllParents() {
      const elems = this.graph.getCells();
      elems.forEach(i => {
        if (this.parents.includes(i.id)) i.fitEmbeds({padding: 15});
      })
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
              text: 'Drag here to remove',
              fill: 'black'
          }
      });
      this.sidebarRect.addTo(this.graph);
      this.createTemplateRect();
      this.paper.on('element:pointerup', (el) => {
        if (!el.model.get('locked')) this.onElPointerUp(el);
      });
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
