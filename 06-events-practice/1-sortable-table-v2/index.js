import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {
    super(headersConfig, data);

    this.headersConfig = headersConfig;
    this.data = data;

    const { id, order = "asc"} = sorted;

    this.isSortLocally = isSortLocally;

    this.arrowElement = this._createElem(this._createArrowTemplate());

    this._createListeners();

    if (id) {
      this._defaultSortField(id, order);
    }
  }

  _defaultSortField(id, order) {
    const pointerdown = new MouseEvent('pointerdown', {
      bubbles: true
    });
    this.currentOrder = order;
    const tdCell = this.subElements.header.querySelector(`[data-id=${id}]`);
    tdCell.dispatchEvent(pointerdown);
  }

  _orderToggle(id) {
    if (id !== this.currentId) {
      if (this.currentId) { this.currentOrder = "desc"; }
      this.currentId = id;
      return;
    }

    if (this.currentOrder === "asc") {
      this.currentOrder = "desc";
    } else {
      this.currentOrder = "asc";
    }

    this.currentId = id;
    return;
  }

  _createListeners() {
    this.subElements.header.addEventListener('pointerdown', this._handleHeaderClick);
  }

  _destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this._handleHeaderClick);
  }

  _handleHeaderClick = (e) => {
    const tableCellElement = e.target.closest(".sortable-table__cell");
    if (!tableCellElement) {
      return;
    }
    
    if (tableCellElement.dataset.sortable === 'false') {
      return;
    }

    tableCellElement.append(this.arrowElement);
    
    const sortField = tableCellElement.dataset.id;
    this._orderToggle(sortField);
    
    tableCellElement.dataset.order = this.currentOrder;


    this.sort(sortField, this.currentOrder);
  }

  _createElem(template) {
    const element = document.createElement("div");
    element.innerHTML = template;

    return element.firstElementChild;
  }

  _createArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  _sortOnClient(field, sortType) {
    super.sort(field, sortType);
  }

  _sortOnServer(field, sortType) {
    throw new Error("Not implemented");
  }

  sort(field, sortType) {
    if (this.isSortLocally) {
      this._sortOnClient(field, sortType);
    } else {
      this._sortOnServer(field, sortType);
    }
  }

  destroy() {
    super.destroy();
    this._destroyListeners();
  }

}
