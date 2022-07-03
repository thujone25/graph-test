<template>
  <div class="graph-page">
    <header class="graph-page__header">
      <button class="g-button graph-page__btn" @click="saveGraph">
        Save graph!
      </button>
      <button class="g-button graph-page__btn" @click="logout">Logout</button>
    </header>
    <div ref="graphPaper" class="graph-page__graph-paper"></div>
  </div>
</template>

<script>
import { Logout } from "@/utils/authUtil";

export default {
  data() {
    return {
      elementsCounter: 0,
      templateRectId: null,
      parents: [],
      j: null,
      graph: null,
      portTemplate: {
        position: {
          name: "left",
        },
        attrs: {
          portBody: {
            magnet: true,
            r: 6,
            fill: "#E6A502",
            stroke: "#023047",
          },
        },
        markup: [
          {
            tagName: "circle",
            selector: "portBody",
          },
        ],
      },
    };
  },
  methods: {
    saveGraph() {
      const elems = this.graph.getElements();
      elems.forEach((e) => {
        if (e.id === this.templateRectId || e.get("locked")) {
          e.remove();
        }
      });
      const graph = JSON.stringify(this.graph.toJSON());
      localStorage.setItem("app_saved_graph", graph);
      this.createSidebar();
    },
    logout() {
      Logout();
      this.$router.push("/");
    },
    getPorts() {
      const leftPort = JSON.parse(JSON.stringify(this.portTemplate));
      const rightPort = JSON.parse(JSON.stringify(this.portTemplate));
      leftPort.position.name = "left";
      rightPort.position.name = "right";
      return [leftPort, rightPort];
    },
    createTemplateRect() {
      const ports = this.getPorts();
      const rect = new this.j.shapes.standard.Rectangle({
        position: { x: 15, y: 15 },
        size: { width: 150, height: 44 },
        ports: {
          groups: {
            left: ports[0],
            right: ports[1],
          },
        },
        attrs: {
          body: {
            fill: "blue",
          },
          label: {
            text: "Template elem",
            fill: "white",
          },
        },
      });
      this.templateRectId = rect.id;
      rect.addTo(this.graph);
    },
    createParentElement() {
      const parentRect = new this.j.shapes.standard.Rectangle();
      parentRect.resize(180, 74);
      parentRect.attr({
        body: {
          fill: "pink",
        },
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
      const newIndex =
        elemPosY <= siblingPosY ? indexOfSibling : indexOfSibling + 1;
      const newOrderArr = [...cells];
      newOrderArr.splice(newIndex, 0, elModel);
      newOrderArr.forEach((i) => {
        if (i.isEmbeddedIn(parent)) parent.unembed(i);
      });
      newOrderArr.forEach((i) => {
        parent.embed(i);
      });
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
      const allElems = this.graph.getElements();
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
      parent.fitEmbeds({ padding: 15 });
      for (let i = 0, lim = cells.length; i < lim; i += 1) {
        const cell = cells[i];
        const yPos = parentPos.y + 15 + 44 * i + (i ? 8 * i : 0);
        cell.position(constX, yPos);
      }
      parent.fitEmbeds({ padding: 15 });
    },
    onElPointerUp(el) {
      const currentElement = el.model;
      const isTemplateElem = currentElement.id === this.templateRectId;
      if (currentElement.position()?.x > 180) {
        if (isTemplateElem) {
          this.elementsCounter += 1;
          currentElement.attr({
            label: {
              text: `Element #${this.elementsCounter}`,
            },
          });
          currentElement.addPorts([{ group: "left" }, { group: "right" }]);
          this.createTemplateRect();
        }
        if (!this.isParentEl(el)) this.manageParent(el);
      } else {
        if (isTemplateElem) {
          currentElement.position(15, 15);
        } else {
          if (this.isParentEl(currentElement))
            this.removeParentID(currentElement.id);
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
      elems.forEach((i) => {
        if (this.isParentEl(i)) {
          if (i.getEmbeddedCells()?.length) {
            this.handleChildrenPos(i);
          } else {
            this.removeParentID(i.id);
            i.remove();
          }
        }
      });
    },
    parseSavedGraph() {
      this.graph.fromJSON(JSON.parse(localStorage.getItem("app_saved_graph")));
      const elems = this.graph.getElements();
      elems.forEach((e) => {
        if (e.getEmbeddedCells().length) {
          this.parents.push(e.id);
        }
      });
    },
    createSidebar() {
      const sidebarRect = new this.j.shapes.standard.Rectangle();
      sidebarRect.set("locked", true);
      sidebarRect.position(0, 0);
      sidebarRect.resize(180, 1000);
      sidebarRect.attr({
        body: {
          fill: "yellow",
        },
        label: {
          text: "Drop here to remove",
          fill: "black",
        },
      });
      sidebarRect.addTo(this.graph);
      this.createTemplateRect();
    },
  },
  mounted() {
    this.j = window.joint;
    if (this.j) {
      const namespace = this.j.shapes;
      this.graph = new this.j.dia.Graph({}, { cellNamespace: namespace });
      const paper = new this.j.dia.Paper({
        el: this.$refs.graphPaper,
        model: this.graph,
        width: "100%",
        height: "100%",
        gridSize: 1,
        cellViewNamespace: namespace,
        linkPinning: false,
        embeddingMode: true,
        validateEmbedding: (childView, parentView) => {
          if (this.isParentEl(parentView) && !this.isParentEl(childView))
            return true;
          return false;
        },
        interactive: (cellView) => {
          if (cellView.model.get("locked")) {
            return {
              elementMove: false,
            };
          }
          return true;
        },
      });
      paper.on("element:pointerup", (el) => {
        if (!el.model.get("locked")) this.onElPointerUp(el);
      });
      if (localStorage.getItem("app_saved_graph")) {
        this.parseSavedGraph();
      }
      this.createSidebar();
    }
  },
};
</script>

<style scoped>
.graph-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.graph-page__header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: 0 16px;
  height: 60px;
  border-bottom: 2px solid gray;
}
.graph-page__btn {
  width: 150px;
}
.graph-page__btn ~ .graph-page__btn {
  margin-left: 16px;
}
.graph-page__graph-paper {
  flex-grow: 1;
}
</style>
