import { Node as _Node } from './../tree/node.js'

export function Node(value,data,parent){
  this.value = value;
  this.data = data;
  this.parent = parent;
  this.height = -1;
  // this is usually defined as this.left and this.right
  // using an array of length 2 to keep it consistent with the general tree
  // and make it work with d3's tree layout.
  this.children = [{value:null},{value:null}];
}

// inherits from non-binary Node
Node.prototype = new _Node();

Node.prototype.left = function(node){
  if(node){
    this.children[0] = node;
    this.children[0].parent = this;
  }
  if(node===null) this.children[0] = new Node(null,{},this);
  return this.children[0];
}

Node.prototype.right = function(node){
  if(node){
    this.children[1] = node;
    this.children[1].parent = this;
  }
  if(node===null) this.children[1] = new Node(null,{},this);
  return this.children[1];
}
