export default class SortableList {
    element;
    constructor({ items = [] } = {}) {
      this.items = items;

      this.element = this.createElement();
      this.createEventListeners();
    }

    createElement() {
      const element = document.createElement('ul');
      element.className = 'sortable-list';

      for (const item of this.items) {
        item.classList.add('sortable-list__item');
        element.appendChild(item);
      }

      return element;
    }

    addElement(element) {
      element.classList.add('sortable-list__item');
      this.element.appendChild(element);
    }

    createEventListeners() {
      this.element.addEventListener('pointerdown', this.elementDragHandler);
      this.element.addEventListener('pointerdown', this.elementDeleteHandler);
    }

    removeEventListeners() {
      this.element.removeEventListener('pointerdown', this.elementDragHandler);
      this.element.removeEventListener('pointerdown', this.elementDeleteHandler);
    }

    elementDeleteHandler = (e) => {
      if (!e.target.hasAttribute('data-delete-handle')) { return; }
      e.target.closest('li').remove();
    };

    elementDragHandler = (e) => {
      if (!e.target.hasAttribute('data-grab-handle')) { return; }
      
      const item = e.target.closest('li');
      if (!item) { return; }

      e.target.ondragstart = () => {
        return false;
      };

      const ul = item.closest('ul');
      item.classList.add('sortable-list__item_dragging');

      let shiftX = e.clientX - item.getBoundingClientRect().left;
      let shiftY = e.clientY - item.getBoundingClientRect().top;
      
      item.style.width = ul.getBoundingClientRect().width + 'px';
      item.style.height = item.getBoundingClientRect().height + 'px';

      const placeholder = this.addPlaceholder(item);

      moveAt(e.clientX, e.clientY);

      function moveAt(clientX, clientY) {
        item.style.left = clientX - shiftX - window.scrollX + 'px';
        item.style.top = clientY - shiftY - window.scrollY + 'px';
      }

      const onPointerMove = (e) => {
        moveAt(e.clientX, e.clientY);

        const nearestElement = this.getNearestElement(item, ul);
        if (nearestElement.getBoundingClientRect().y > item.getBoundingClientRect().y) {
          nearestElement.before(placeholder);
        } else {
          nearestElement.after(placeholder);
        }
      };

      const onPointerUp = () => {
        item.style.left = item.style.top = item.style.width = item.style.height = '';
        placeholder.after(item);

        placeholder.remove();
        item.classList.remove('sortable-list__item_dragging');
        
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    getNearestElement(item, ul) {
      const currentY = item.getBoundingClientRect().y;
      const list = [...ul.children].filter(i => i != item);

      const nearestElement = list.reduce((a, b) => {
        const aY = a.getBoundingClientRect().y;
        const bY = b.getBoundingClientRect().y;

        const diff1 = Math.abs(aY - currentY);
        const diff2 = Math.abs(bY - currentY);

        if (diff1 > diff2) { return b; }
        else { return a; }
      });

      return nearestElement;
    }

    addPlaceholder(item) {
      const placeholderElement = document.createElement('div');
      placeholderElement.className = 'sortable-list__placeholder';
      placeholderElement.style.height = item.style.height;
      placeholderElement.style.width = item.style.width;

      item.after(placeholderElement);

      return placeholderElement;
    }

    remove() {
      this.element.remove();
    }

    destroy() {
      this.removeEventListeners();
      this.remove();
    }
}
