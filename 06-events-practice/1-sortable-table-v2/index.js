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

    const {
      id = headersConfig.find(item => item.sortable).id, 
      order = "asc"
    } = sorted;

    this.id = id;
    this.order = order;

    this.isSortLocally = isSortLocally;

    this.arrowElement = this._createElem(this._createArrowTemplate());

    this._createListeners();
    this._defaultSort();
  }

  _defaultSort() {
    const sortColumn = this.subElements.header.querySelector(`[data-id=${this.id}]`);
    sortColumn.dataset.order = this.order;
    sortColumn.append(this.arrowElement);
    super.sort(this.id, this.order);
  }

  _toggleOrder = order => {
    const orders = {
      asc: "desc",
      desc: "asc"
    };

    return orders[order];
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
    
    this.id = tableCellElement.dataset.id;
    this.order = this._toggleOrder(this.order);
    
    tableCellElement.dataset.order = this.order;


    this.sort(this.id, this.order);
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

  sortOnClient(field, sortType) {
    super.sort(field, sortType);
  }

  sortOnServer(field, sortType) {
    throw new Error("Not implemented");
  }

  sort(field, sortType) {
    if (this.isSortLocally) {
      this.sortOnClient(field, sortType);
    } else {
      this.sortOnServer(field, sortType);
    }
  }

  destroy() {
    super.destroy();
    this._destroyListeners();
  }

}
