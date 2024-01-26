const Quill = require('quill');
const BlockEmbed = Quill.import('blots/block/embed')

export class ImageBlot extends BlockEmbed {
  static create(value) { 
    let node = super.create()
    node.setAttribute('src', value.src)
    node.setAttribute('style', value.style)
    node.setAttribute('alt', value.alt)
    return node;
  }
  static value(node) {
    return {
      src: node.getAttribute('src'),
      style: node.getAttribute('style'),
      alt: node.getAttribute('alt')
    };
  }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
ImageBlot.className = 'ql-img';