import { Tree } from './tree/tree.js';
import { Viz, translate, linkNodes, copyNodeProps, descendants } from './d3_helpers.js';

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

export function refresh(_root){

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

export { tree, viz };
