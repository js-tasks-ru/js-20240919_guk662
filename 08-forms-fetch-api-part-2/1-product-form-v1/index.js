import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com/3/image';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;

  constructor (productId) {
    this.productId = productId;

    this.url = new URL(BACKEND_URL);
    this.imgurUrl = new URL(IMGUR_URL);
    this.imgurClientId = IMGUR_CLIENT_ID;

    this.subElements = {};
  }

  _createListeners() {
    this.subElements.uploadImage.addEventListener('click', this._uploadImageHandler);
    this.subElements.imageList.addEventListener('click', this._deleteImageHandler);
    this.subElements.productForm.addEventListener('submit', this._submitHandler);
  }

  _removeListeners() {
    this.subElements.uploadImage.removeEventListener('click', this._uploadImageHandler);
    this.subElements.imageList.removeEventListener('click', this._deleteImageHandler);
    this.subElements.productForm.removeEventListener('submit', this._submitHandler);
  }

  _submitHandler = async (e) => {
    e.preventDefault();
    this.save();
  }

  _deleteImageHandler = (e) => {
    if (!e.target.hasAttribute('data-delete-handle')) { return; }
    e.target.closest('li').remove();
  }

  _uploadImageHandler = async () => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'image';
    input.type = 'file';
    form.append(input);

    const changeHanlder = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData(form);

      try {
        this.subElements.uploadImage.classList.add("is-loading");

        const response = await fetchJson(this.imgurUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID ' + this.imgurClientId
          },
          body: formData
        });

        if (response.status === 200) {
          this._addImageToForm(file.name, response.data.link);
        }
      }
      catch (error) {
        throw error;
      }
      finally {
        this.subElements.uploadImage.classList.remove("is-loading");
      }

      input.removeEventListener('change', changeHanlder);
    };

    input.addEventListener('change', changeHanlder);
    input.click();
  }

  _addImageToForm(source, url) {
    const image = [{source, url}];
    
    const template = this._createImagesTemplate(image);
    const imageElement = document.createElement('div');
    imageElement.innerHTML = template;

    this.subElements.imageList.append(imageElement.firstElementChild);
  }

  async _getCategories(sort, refs) {
    const url = new URL('/api/rest/categories', this.url);
    url.searchParams.set('_sort', sort);
    url.searchParams.set('_refs', refs);

    return await fetchJson(url);
  }

  async _getProduct(productId) {
    const url = new URL('/api/rest/products', this.url);
    url.searchParams.set('id', productId);

    return await fetchJson(url);
  }

  _createCategoriesTemplate(categories, currentSubCategoryId) {
    return categories.map(category => {
      let categoriesTemplate = '';
      for (const sub of category.subcategories) {
        categoriesTemplate += `
          <option value="${escapeHtml(sub.id)}" ${sub.id === currentSubCategoryId ? 'selected' : ''}>${escapeHtml(category.title)} > ${escapeHtml(sub.title)}</option>
        `;
      }

      return categoriesTemplate;
    }).join('');
  }

  _createImagesTemplate(images) {
    return images.map(image => `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${escapeHtml(image.url)}">
        <input type="hidden" name="source" value="${escapeHtml(image.source)}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" referrerpolicy="no-referrer" src="${escapeHtml(image.url)}">
          <span>${escapeHtml(image.source)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `).join('');
  }

  _createElement(product, categories) {
    const element = document.createElement('div');
    element.innerHTML = `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input value="${escapeHtml(product?.title) ?? ''}" id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(product?.description) ?? ''}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul data-element="imageList" class="sortable-list">
                ${product?.images ? this._createImagesTemplate(product.images) : ''}
              </ul>
            </div>
            <button type="button" name="uploadImage" data-element="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
              ${this._createCategoriesTemplate(categories, product?.subcategory)}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" value="${escapeHtml(product?.price?.toString()) ?? ''}" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" value="${escapeHtml(product?.discount?.toString()) ?? ''}" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" value="${escapeHtml(product?.quantity?.toString()) ?? ''}" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              <option ${product?.status === 1 ? 'selected' : ''} value="1">Активен</option>
              <option ${product?.status === 0 ? 'selected' : ''} value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;

    return element.firstElementChild;
  }

  _createEmptyElement() {
    const element = document.createElement('div');
    element.className = "product-form";
    element.innerHTML = `
      <h1 class="page-title">Страница не найдена</h1>
      <p>Извините, данный товар не существует</p>
    `;

    return element;
  }

  _getProductObject() {
    const numberFields = ['discount', 'price', 'quantity', 'status'];
    const stringFields = ['description', 'subcategory', 'title'];

    const product = {images: []};

    numberFields.forEach(item => {
      product[item] = +this.subElements.productForm.querySelector(`#${item}`).value;
    });

    stringFields.forEach(item => {
      product[item] = this.subElements.productForm.querySelector(`#${item}`).value;
    });

    this.subElements.imageList.querySelectorAll('li').forEach(el => {
      const url = el.querySelector('input[name="url"]').value;
      const source = el.querySelector('input[name="source"]').value;

      product.images.push({url, source});
    });

    return product;
  }

  async productSave(product, method = "PUT") {

    const url = new URL('/api/rest/products', this.url);

    let newProduct;
    try {
      newProduct = await fetchJson(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
    } catch (error) {
      throw error;
    }

    return newProduct;
  }
  
  async render () {
    this.categories = await this._getCategories('weight', 'subcategory');
    if (this.productId) {
      const products = (await this._getProduct(this.productId));
      if (!products || products.length === 0) {
        this.element = this._createEmptyElement();
        return this.element;
      } else {
        this.product = products[0];
      }
    }

    this.element = this._createElement(this.product, this.categories);
    this.selectSubElements();
    this._createListeners();
    return this.element;
  }

  async save() {
    const product = this._getProductObject();

    if (this.product) {
      product.id = this.productId;
      this.product = await this.productSave(product, "PATCH");
      const event = new Event('product-updated');
      this.element.dispatchEvent(event);
    } else {
      this.product = await this.productSave(product);
      const event = new Event('product-saved');
      this.element.dispatchEvent(event);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeListeners();
    this.remove();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }
}
