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
    handleReordering(el, sibling) {
      const elModel = el.model;
      const parent = sibling.getParentCell();
      const cells = parent.getEmbeddedCells();
      const elemPosY = elModel.position().y;
      const siblingPosY = sibling.position().y;
      const indexOfSibling = cells.indexOf(sibling);
      const newIndex = elemPosY <= siblingPosY ? indexOfSibling : indexOfSibling + 1;
      const newOrderArr = [...cells];
      newOrderArr.splice(newIndex, 0, elModel);
      // parent.unembed(parent.getEmbeddedCells());
      newOrderArr.forEach(i => {
        if (i.isEmbeddedIn(parent)) parent.unembed(i);
      })
      newOrderArr.forEach(i => {
        parent.embed(i);
      })
      this.handleChildrenPos(parent);
    },
    manageParent(el) {
      const elModel = el.model;
      const parent = elModel.getParentCell();
      if (parent) {
        this.handleChildrenPos(parent);
      } else {
        const intersectedEl = this.intersectsWithElem(el);
        if (intersectedEl) {
          this.handleReordering(el, intersectedEl);
        } else {
          const elemPos = elModel.position();
          const newParent = this.createParentElement();
          newParent.position(elemPos.x - 15, elemPos.y - 15);
          newParent.embed(elModel);
          newParent.addTo(this.graph);
          elModel.toFront();
        }
      }
    },
    isParentEl(el) {
      return this.parents.includes(el?.model ? el?.model.id : el?.id);
    },
    intersectsWithElem(el) {
      const allElems = this.graph.getCells();
      for (const cell of allElems) {
        if (
            el.getBBox().intersect(cell.getBBox()) &&
            !this.isParentEl(cell) &&
            cell.id !== el.model.id
          ) {
          return cell;
        }
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
        if (!this.isParentEl(el)) this.manageParent(el);
      } else {
        if (isTemplateElem) {
          currentElement.position(15, 15);
        } else {
          if (this.isParentEl(currentElement)) this.removeParentID(currentElement.id);
          currentElement.remove();
        }
      }
      this.watchAllParents();
    },
    removeParentID(id) {
      this.parents.splice(this.parents.indexOf(id), 1);
    },
    watchAllParents() {
      const elems = this.graph.getCells();
      elems.forEach(i => {
        if (this.isParentEl(i)) {
          if (i.getEmbeddedCells()?.length) {
            this.handleChildrenPos(i);
          } else {
            this.removeParentID(i.id);
            i.remove();
          }
        }
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
        cellViewNamespace: this.namespace,
        embeddingMode: true,
        validateEmbedding: (childView, parentView) => {
          if (this.isParentEl(parentView) && !this.isParentEl(childView)) return true;
          return false;
        },
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
              text: 'Drop here to remove',
              fill: 'black'
          }
      });
      this.sidebarRect.addTo(this.graph);
      this.createTemplateRect();
      this.paper.on('element:pointerup', (el) => {
        if (!el.model.get('locked')) this.onElPointerUp(el);
      });
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
}
</style>
