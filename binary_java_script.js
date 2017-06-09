function setup(){
	
}

var tree;
$(document).ready(function(){
	tree =new Tree();
	tree.addNode(5);
	console.log(tree);
});

//Tree object
function Tree(){
	this.root = null;
}

//Tree object function
Tree.prototype.addNode = function(val){
	var n = new Node(val);
	if(this.root == null){
		this.root = n;
	}
	else{		
		this.root.addValue(n)
	}
}

Tree.prototype.traverse = function(){
	this.root.visit();
}

Tree.prototype.search = function(val){
	this.root.search(val);
}
//Node Object
function Node(val){
	this.value = val;
	this.left = null;
	this.right = null;
}

Node.prototype.addValue = function(n){
	if(n.value < this.value){
		if(this.left == null){
			this.left = n;
		}else{
			this.left.addValue(n);
		}
	}else if(n.value > this.value){
		if(this.right == null){
			this.right = n;
		}else{
			this.right.addValue(n)
		}
	}
}

Node.prototype.visit = function(){
	if(this.left != null){
		this.left.visit();
	}
	console.log(this.value);
	if(this.right != null){
		this.right.visit();
	}
}

Node.prototype.search = function(val){
	if(this.value == val){
		console.log("found:" + val);
	}
	else if(val < this.value && this.left != null){
		this.left.search(val);
	}
	else if(val > this.value && this.right != null){
		this.right.search(val);
	}
}