(function () {
  'use strict';

  function _Node(value,data){
    this.value = value;
    this.data = data;
    this.children = [];
    this.parent = null;
  }

  _Node.prototype.find = function(value){
    var index;
    if( !this.children ) return index;
    for(var i=0; i<this.children.length;i++){
      if( value == this.children[i].value ){
        index = i;
        break;
      }
    }
    return index;
  }

  _Node.prototype.remove = function(value){
    var i = this.find(value);
    if( !i ) throw new Error( 'No node with value ' + value + 'found on node ' + this.value );
    else return this.children.splice(i,1);
  }

  function Tree(data){
    this.root = new _Node(1,data);
  }

  Tree.prototype.add = function(value,parentVal,data,strategy){
    var child = value instanceof _Node ? value : new _Node(value,data),
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

  function Viz(el,opts){
     opts = opts ? opts : {};
     this.el = el;
     this.isResponsive = true;

     if( typeof el == 'object' ) this.$el = el;
     else this.$el = document.querySelector( el );

     this.svg = d3.select( el ).append( 'svg' );

     this.margin = {
       top: 25, bottom: 25,
       left: 25, right: 25
     };
     this.height = opts.height;
     this.width = opts.width;

     size(this);

     this.chart = this.svg.append( 'g' )
      .attr( 'transform', this.innerTranslation() );

  }

  Viz.prototype.outerHeight = function(){
    return this.margin.top + this.margin.bottom + this.height;
  };

  Viz.prototype.outerWidth = function(){
    return this.margin.left + this.margin.right + this.width;
  };

  Viz.prototype.innerTranslation = function(){
    return 'translate(' + this.margin.left + ',' + this.margin.top + ')';
  };

  Viz.prototype.viewBox = function(){
    return '0 0 ' + this.outerWidth() + ' ' + this.outerHeight()
  };

  function size(viz){

    if( !viz.height ) viz.height = viz.$el.offsetHeight - viz.margin.top - viz.margin.bottom;
    if( !viz.width ) viz.width = viz.$el.offsetWidth - viz.margin.left - viz.margin.right;

    if( viz.isResponsive )
      viz.svg.attr( 'viewBox', viz.viewBox() );
    else
      viz.svg.attr( 'height', viz.outerHeight() )
        .attr( 'width', viz.outerWidth() );
  }

  function translate(x,y){
    return 'translate(' + x + ',' + y + ')';
  }

  function linkNodes(d){
    return "M" + d.x + "," + d.y
        + "C" + d.x + "," + (d.y + d.parent.y) / 2
        + " " + d.parent.x  + "," + (d.y + d.parent.y) / 2
        + " " + d.parent.x + "," + d.parent.y;
  }

  // copy of d3.hiearchy.descendants
  // https://github.com/d3/d3-hierarchy/blob/master/src/hierarchy/descendants.js
  // https://github.com/d3/d3-hierarchy/blob/master/src/hierarchy/each.js
  function descendants(root) {
    var nodes = [];
    each(root,function(node) {
      nodes.push(node);
    });
    return nodes;
  }

  function each(root,callback) {
    var node = root, current, next = [node], children, i, n;
    do {
      current = next.reverse(), next = [];
      while (node = current.pop()) {
        callback(node), children = node.children;
        if (children) for (i = 0, n = children.length; i < n; ++i) {
          next.push(children[i]);
        }
      }
    } while (next.length);
    return this;
  }

  function copyNodeProps(d3Nodes,nodes){
    for(var i=0;i<d3Nodes.length;i++){
      var dN = d3Nodes[i];
      for(var j=0;j<nodes.length;j++){
        var n = nodes[j];
        if(dN.value == n.value ){
          copy(dN,n);
          break;
        }
      }
    }
  }

  function copy(d3Node,node){
    node.x = d3Node.x;
    node.y = d3Node.y;
    node.height = d3Node.height;
  }

  var tree = new Tree({});

  var n = Math.floor(Math.random()*25) + 25;

  // random data assigned to random parent
  /// this most likely results in an unbalanced tree
  for( var val=2; val<n; val++){
    var parentVal = Math.floor(1+Math.random()*(val-1));
    tree.add(val,parentVal);
  }

  var viz = new Viz('#tree', {height:350,width:800});

  var treeLayout = d3.tree()
    .size([viz.width,viz.height]);

  var root = d3.hierarchy(tree.root);
  treeLayout(root);
  // d3.hierarchy changes Node class, stripping prototype and nesting original data
  // I just need x, y, and height values from d3.hiearchy.
  copyNodeProps(root.descendants(),descendants(tree.root));

  var data = descendants(tree.root).filter(function(d){
    return d.value !== 0 && d.value !== null;
  });

  viz.link = viz.chart.selectAll('.link')
    .data(data.slice(1))
  .enter().append('path')
    .attr('class','link')
    .attr('d',linkNodes);

  viz.node = viz.chart.selectAll('.node')
    .data(data)
  .enter().append('g')
    .attr('class','node')
    .attr('transform',function(d){
      return translate(d.x,d.y);
    });

  viz.node.append('circle')
    .attr('r',5);

  viz.node.append('text')
    .attr('dy','-1em')
    .attr('text-anchor', 'middle' )
    .text(function(d){
      return d.value;
    });

  viz.scanner = viz.chart.append('circle')
    .attr('class', 'scanner')
    .attr( 'r', 20 )
    .attr( 'cx', 0 )
    .attr( 'cy', 0 );

  function refresh(_root){

    root = d3.hierarchy(_root);
    treeLayout(root);
    copyNodeProps(root.descendants(),descendants(_root));

    data = descendants(_root)
      .filter(function(d){
        return d.value !== 0 && d.value !== null;
      });

    viz.link = viz.link.data(data.slice(1))
      .transition().attr('d', linkNodes );

    viz.node = viz.node.data(data);
    viz.node.transition().attr('transform',function(d){
        return translate(d.x,d.y);
      });

   viz.node.selectAll('text').remove();
   viz.node.append('text')
     .attr('dy','-1em')
     .attr('text-anchor', 'middle' )
     .text(function(d){
       return d.value;
     });

    return _root;
  }

  function Node(value,data,parent){
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

  function BinaryTree() {
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

  var traversal = 0;
  var queue = [];
  var BT;
  window.traverse = function(strategy,order){
    reset();

    tree[strategy](function(node){
      queue.push(node);
    },order);

    timeout(0);

  }

  window.traverseBT = function(strategy){
    reset();
    if(!BT) insert();

    BT[strategy](function(node){
      queue.push(node);
    });

    timeout(0);
  }

  window.insert = function(){
    reset();
    if(BT) return;
    var nodes = [];
    BT = new BinaryTree();
    tree.breadthFirst(function(node){
        BT.insert(node.value,{});
    });
    BT.balance();
    refresh(BT.root);
    console.log(BT.root);
  }

  window.avlBalance = function(){
    //TODO
    reset();
    if(!BT) insert();
    BT.balance();
  }

  window.selectExample = function(selector){
    if(selector=='order'||selector=='insert'){
        document.getElementsByClassName('binary')[0].classList.remove('hide');
        document.getElementsByClassName('general')[0].classList.add('hide');
    } else {
      document.getElementsByClassName('binary')[0].classList.add('hide');
      document.getElementsByClassName('general')[0].classList.remove('hide');
    }

    var codes = document.getElementsByClassName('code'),
        links = document.getElementsByClassName('example-link');

    for(var i=0;i<codes.length;i++)
      codes[i].classList.remove('on');

    for(var i=0;i<links.length;i++)
      links[i].classList.remove('on');

    this.classList.add('on');
    var examples = document.getElementsByClassName(selector);

    for(var i=0;i<examples.length;i++)
      examples[i].classList.add('on');
  }

  function reset(){
    viz.chart.selectAll('.node')
      // basically a clearTimeout for d3 transitions:
      .transition()
      .attr('class', 'node' );

    viz.scanner.transition()
      .attr('cx',0)
      .attr('cy',0);

    queue = [];

    clearTimeout(traversal);
  }

  function timeout(i){
    var node = queue[i];
    traversal = setTimeout(function(){
      viz.node
        .filter(function(){
          return d3.select(this).datum() == node;
        }).transition().delay(375)
        .attr('class','visited node');

      viz.scanner.transition()
        .attr('cx', node.x )
        .attr('cy', node.y);

      if(i<queue.length-1) timeout(i+1);
    },750);
  }

}());