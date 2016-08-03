import { Node } from './node.js';

export function Tree(data){
  this.root = new Node(1,data);
}

Tree.prototype.add = function(value,parentVal,data,strategy){
  var child = value instanceof Node ? value : new Node(value,data),
      parent = null;

  if(!strategy) strategy = 'breadthFirst';
  this[strategy](function(node){
    if( node.value == parentVal ) parent = node;
  });

  if(parent){
    if(!parent.children) parent.children = [];
    parent.children.push(child);
    child.parent = parent;
  } else {
    throw new Error( 'No node found with value ' + parentVal );
  }
}


Tree.prototype.remove = function(value,parentVal,strategy){
  var child, removed, parent = null;
  if(!strategy) strategy = 'breadthFirst';
  this[stategy](function(node){
    if( node.value == parentVal ) parent = node;
  });

  if(parent){
    removed = parent.remove(value);
  } else {
    throw new Error( 'No parent node found with value ' + parentVal );
  }

  return removed;

}

Tree.prototype.breadthFirst = function(callback){
  var queue = [];

  var node = this.root;

  while(node){
    if(node.children){
      for( var i=0;i<node.children.length; i++){
        queue.push(node.children[i]);
      }
    }
    callback(node);
    node = queue.shift();

  }
}

Tree.prototype.depthFirst = function(callback,order){
  (function search(node){
    if(order=='pre') callback(node);

    if(node.children)
      for( var i = 0; i<node.children.length;i++)
        search(node.children[i]);

    if(order != 'pre' ) callback(node);

  })(this.root);
}

Tree.prototype.flatten = function(strategy){
  if(!strategy) strategy = 'breadthFirst';
  var arr = [];

  this[strategy](function(node){
    arr.push(node);
  });

  return arr;

}
