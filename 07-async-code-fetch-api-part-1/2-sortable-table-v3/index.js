import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = false,
    url = '',
  } = {}) {
    super(headersConfig, { data, sorted, isSortLocally, url });

    this.start = 0;
    this.end = 30;

    if (url) {
      this.url = new URL(url, BACKEND_URL);
      this.render();
      this._createScrollListener();
    }
  }

  async _fetchData(start, end, sort, order) {
    this._setSearchParams(start, end, sort, order);
    return await fetchJson(this.url);
  }

  sortOnServer (id, order) {
    this._toggleLoader();
    this._data = [];
    this._updateBody();

    this._fetchData(this.start, this.end, id, order).then((data) => 
    {
      this._data = data;
      this._updateBody();
      this._toggleLoader();
    });
  }

  async render() {
    this._toggleLoader();


    let data;
    try {
      data = await this._fetchData(this.start, this.end, this.id, this.order);
    }
    catch (error) {
      data = [];
    }

    if (data.length === 0) {
      this.subElements.emptyPlaceholder.style.display = "block";
      this._toggleLoader();
      return;
    }

    this._data = data;
    this._updateBody();

    this._toggleLoader();
  }

  _toggleLoader() {
    if (this.subElements.loading.style.display === "") {
      this.subElements.loading.style.display = "block";
    }
    else {
      this.subElements.loading.style.display = "";
    }
  }

  _setSearchParams(start, end, sort, order) {
    this.url.searchParams.set("_start", start);
    this.url.searchParams.set("_end", end);
    this.url.searchParams.set("_sort", sort);
    this.url.searchParams.set("_order", order);
  }

  _createScrollListener() {
    window.addEventListener('scroll', this._handleScroll);
  }

  _removeScrollListener() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll = async () => {
    if (this.isLoading) { return; }

    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    if (windowRelativeBottom > document.documentElement.clientHeight + 100) { return; }

    this.isLoading = true;
    this._toggleLoader();

    this.start = this.end;
    this.end += 30;

    let addData;
    try {
      addData = await this._fetchData(this.start, this.end, this.id, this.order);
      if (addData.length === 0) {
        this._removeScrollListener();
      } else {
        this._data = [...this._data, ...addData];
        this._addToGrid(addData);
      }
    }
    catch (error) {
      throw error;
    }

    this._toggleLoader();
    this.isLoading = false;
    
  }

  _addToGrid(data) {
    const template = this._createDataTemplate(data);
    this.subElements.body.insertAdjacentHTML('beforeend', template);
  }
  
  destroy() {
    super.destroy();
    this._removeScrollListener();
  }
}
