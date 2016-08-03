export function Viz(el,opts){
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

export function translate(x,y){
  return 'translate(' + x + ',' + y + ')';
}

export function linkNodes(d){
  return "M" + d.x + "," + d.y
      + "C" + d.x + "," + (d.y + d.parent.y) / 2
      + " " + d.parent.x  + "," + (d.y + d.parent.y) / 2
      + " " + d.parent.x + "," + d.parent.y;
}

// copy of d3.hiearchy.descendants
// https://github.com/d3/d3-hierarchy/blob/master/src/hierarchy/descendants.js
// https://github.com/d3/d3-hierarchy/blob/master/src/hierarchy/each.js
export function descendants(root) {
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

export function copyNodeProps(d3Nodes,nodes){
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
