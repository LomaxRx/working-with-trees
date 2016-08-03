import { tree, viz, refresh as refreshViz } from './viz.js';
import { BinaryTree } from './binarytree/binarytree.js';

var traversal = 0, queue = [], BT;

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
  refreshViz(BT.root);
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
