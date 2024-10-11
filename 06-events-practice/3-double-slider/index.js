export default class DoubleSlider {
  element;

  constructor(props = {}) {
    const {
      min = 0, 
      max = 100, 
      formatValue = value => value, 
      selected = {}
    } = props;

    const {from = min, to = max} = selected;

    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.from = from;
    this.to = to;

    this.element = this._createElements();
    this._createThumbsListeners();
  }

  _createThumbsListeners() {
    this.lThumbElement.addEventListener('pointerdown', this._handleThumbPointerDown);
    this.rThumbElement.addEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _removeThumbsListeners() {
    this.lThumbElement.removeEventListener('pointerdown', this._handleThumbPointerDown);
    this.rThumbElement.removeEventListener('pointerdown', this._handleThumbPointerDown);
  }

  _handleThumbPointerDown = (e) => {
    const thumb = e.target;

    let shiftX = e.clientX - thumb.getBoundingClientRect().left;

    this.sliderRect = this.slider.getBoundingClientRect();

    let barrierThumbX;
    if (thumb === this.lThumbElement) { barrierThumbX = this.rThumbElement.getBoundingClientRect().left; }
    else { barrierThumbX = this.lThumbElement.getBoundingClientRect().right; }

    const onPointerMove = (event) => {
      let newLeft = event.clientX - shiftX - this.sliderRect.left;

      if (newLeft < 0) {
        newLeft = 0;
      }

      if (thumb === this.lThumbElement && event.clientX > barrierThumbX) {
        newLeft = barrierThumbX - this.sliderRect.left;
      }

      if (thumb === this.rThumbElement && event.clientX < barrierThumbX) {
        newLeft = barrierThumbX - this.sliderRect.left;
      }

      let rightEdge = this.sliderRect.width;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      if (thumb === this.lThumbElement) {
        this.leftRatio = this._getLeftRatio(newLeft);
        thumb.style.left = this.leftRatio * 100 + "%";
      } else {
        this.rightRatio = this._getRightRatio(newLeft + this.sliderRect.left);
        thumb.style.right = this.rightRatio * 100 + "%";
      }
      

      this._boundsCalc();
      
      this._updateBoundsElements();
      this._updateProgressElement();
    };

    const onDragStart = () => {
      return false;
    };

    const onPointerUp = () => {
      thumb.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointermove', onPointerMove);
    };

    thumb.addEventListener('dragstart', onDragStart);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  _getLeftRatio(pos) {
    return (pos) / this.sliderRect.width;
  }

  _getRightRatio(pos) {
    return (this.sliderRect.right - pos) / this.sliderRect.width;
  }

  _createElements() {
    this._getDefaultRatio();

    const element = document.createElement("div");

    element.innerHTML = `
        <div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress" style="left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%"></span>
                <span class="range-slider__thumb-left" style="left: ${this.leftRatio * 100}%"></span>
                <span class="range-slider__thumb-right" style="right: ${this.rightRatio * 100}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
        </div>
    `;

    this.progressElement = element.querySelector(".range-slider__progress");
    this.lThumbElement = element.querySelector(".range-slider__thumb-left");
    this.rThumbElement = element.querySelector(".range-slider__thumb-right");

    this.slider = element.querySelector(".range-slider__inner");

    const {"0": leftValueElement, "1": rightValueElement } = element.querySelectorAll("div.range-slider > span");

    this.leftValueElement = leftValueElement;
    this.rightValueElement = rightValueElement;

    return element.firstElementChild;
  }

  _getDefaultRatio() {
    this.leftRatio = (this.from - this.min) / (this.max - this.min);
    this.rightRatio = (this.max - this.to) / (this.max - this.min);
  }

  _boundsCalc() {
    this.from = Math.round(this.min + (this.max - this.min) * this.leftRatio);
    this.to = Math.ceil(this.max - (this.max - this.min) * this.rightRatio);
  }

  _updateProgressElement() {
    this.progressElement.style = `left: ${this.leftRatio * 100}%; right: ${this.rightRatio * 100}%`;
  }

  _updateBoundsElements() {
    this.leftValueElement.textContent = this.formatValue(this.from);
    this.rightValueElement.textContent = this.formatValue(this.to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this._removeThumbsListeners();
    this.remove();
  }
}
