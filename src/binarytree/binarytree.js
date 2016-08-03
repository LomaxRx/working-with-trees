import { Node } from './node.js';

export function BinaryTree() {
    this.root = null;
}

BinaryTree.prototype.insert = function(value,data) {

  var n = new Node(value,data);
  if (this.root === null){
      this.root = n;
  } else {
    var current = this.root;
    while (true){
      if (value < current.value) {
        if(current.left().value === null){
            current.left(n);
            break;
        } else {
          current = current.left();
        }
      } else if( value > current.value ){
        if(current.right().value === null){
            current.right(n);
            break;
        } else {
          current = current.right();
        }
      } else {
        break;
      }
    }
  }
}

BinaryTree.prototype.inOrder = function(callback) {
    (function traverse(node){
      if(node.value) {
          traverse(node.left());
          callback(node);
          traverse(node.right());
      }
    })(this.root);

}
BinaryTree.prototype.preOrder = function(callback) {
  (function traverse(node){
    if(node.value) {
        callback(node);
        traverse(node.left());
        traverse(node.right());
    }
  })(this.root);
}

BinaryTree.prototype.postOrder = function(callback){
  (function traverse(node){
    if(node.value){
        traverse(node.left());
        traverse(node.right());
        callback(node);
    }
  })(this.root);
}

BinaryTree.prototype.rotateLeft = function(node){

}

BinaryTree.prototype.rotateRight = function(node){

}

BinaryTree.prototype.sortedArray = function(){
  var nodes = [];
  this.inOrder(function(node){
    nodes.push(node);
  });
  return nodes;
}

BinaryTree.prototype.balance = function(){

}
