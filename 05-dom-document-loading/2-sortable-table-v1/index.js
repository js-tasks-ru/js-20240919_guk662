export default class SortableTable {
  element;
  subElements = {}

  constructor(headerConfig = [], data = []) {
    this._headerConfig = headerConfig;
    this._data = data;

    this._collator = new Intl.Collator(['ru', 'en']);

    this.element = this._createElement();

    this.selectSubElements();
  }

  _createElement() {
    const element = document.createElement('div');

    const headerTemplate = this._createHeaderTemplate();

    const dataTemplate = this._createDataTemplate(this._data);

    element.innerHTML = `
        <div data-element="productsContainer" class="products-list__container">
          <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
              ${headerTemplate}
            </div>
            <div data-element="body" class="sortable-table__body">
              ${dataTemplate}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
              <div>
                <p>No products satisfies your filter criteria</p>
                <button type="button" class="button-primary-outline">Reset all filters</button>
              </div>
            </div>
          </div>
        </div>
      `;

    return element.firstElementChild;
  }

  _createDataTemplate(data) {
    return data.map(item => {
      let dataCellTemplate = `<a href="products/${item.id}" class="sortable-table__row">`;

      for (const cell of this._headerConfig) {
        if (cell.template) {
          dataCellTemplate += cell.template(item[cell.id]);
        }
        else {
          dataCellTemplate += `<div class="sortable-table__cell">${item[cell.id]}</div>`;
        }
      }

      dataCellTemplate += `</a>`;

      return dataCellTemplate;
    }).join('');

  }

  _createHeaderTemplate() {
    return this._headerConfig.map(item => {
      return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
            <span>${item.title}</span>
          </div>
        `;
    }).join('');
  }

  _updateBody() {
    const bodyElement = this.element.querySelector('.sortable-table__body');
    bodyElement.innerHTML = this._createDataTemplate(this._data);
  }

  _stringComparer(a, b) {
    return this._collator.compare(a, b);
  }

  _numberComparer(a, b) {
    return a - b;
  }

  sort(field, sortType) {
    const fieldConfig = this._headerConfig.find(item => item.id === field);

    if (!fieldConfig.sortable) { return; }

    const comparer = fieldConfig.sortType === 'string' ? this._stringComparer : this._numberComparer;

    if (sortType === 'asc') {
      this._data.sort((a, b) => comparer.call(this, a[field], b[field]));
    } else if ('desc') {
      this._data.sort((a, b) => comparer.call(this, b[field], a[field]));
    }

    this._updateBody();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }
}

