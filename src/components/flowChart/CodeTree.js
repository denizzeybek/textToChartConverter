const iconTypes = { "comment": "fa-comment", "table":'fa-table', "web":"fa-globe","mouse":"fa-mouse-pointer"}
const shapeTypes = { "process": "cIcon-rectangle", "condition":"cIcon-diamond", "loop":"cIcon-hex"}
var counter = 0;
export class CodeTreeNode {
    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    constructor(data) {
        this.id = typeof id === 'undefined' ? this.uuidv4() : ''
        this.isTop = false;
        this.hasChildren = false;
        this.isBottom = false;
        this.expanded = true;
        this.selected =false;
        this.position=false;
        this.depth = 1;
        this.lineNumber = 0;
        this.children = [];
        if(data.text){
            this.text = data.text
        }
        if (data.shapeType){
            this.shapeTypeCss = shapeTypes[data.shapeType];
        }
        if (data.iconType != null){
            this.iconTypeCss = iconTypes[data.iconType];
        }
        this.initNode(this, data.children);
    }
    initNode(parent, data) {
        if(!data) return;
        for (let i = 0, len = data.length; i < len; i++) {
            var _data = data[i];
            let child = new CodeTreeNode(_data);
            child.isBottom = i == len - 1;
            parent.addChild(child);
        }
    }
    addChild(child) {
        this.children.push(child);
        this.hasChildren = true;
        child.parent = this;
        child.depth=this.depth+1;
        for (let i = 0; i<this.children.length; i++) {
            var _child = this.children[i];
            _child.isBottom = i == this.children.length - 1;
        }
    }
    insertChild(nodeId,child){
        var index= this.children.length;
        for(let i = 0; i<this.children.length; i++){
            if(this.children[i].id==nodeId)
            {
                index=i+1;
                break;
            }
        }
        this.children.splice(index,0,child);
        this.hasChildren = true;
        child.parent = this;
        child.depth=this.depth+1;
        for (let i = 0; i<this.children.length; i++) {
            var _child = this.children[i];
            _child.isBottom = i == this.children.length - 1;

        }
        this.tree.setLineNumbers();
    }
    toText(){
        var str="";
        var tab="";
        for(let i=0; i<this.depth;i++){
            tab+="\t";
        }
        for (let i = 0; i < this.children.length; i++) {
            str+=tab+this.children[i].toText();
        }
        if(this.text == undefined){
            this.text = '';
            // console.log(this.text+"\n"+str)
        }

        return this.text+"\n"+str;
    }
    setPosition(position){
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            child.position=child.lineNumber==position
            child.setPosition(position);
        }
    }
    setSelected(start,end){
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            child.selected= start<= child.lineNumber && child.lineNumber<=end
            child.setSelected(start,end);
        }
    }

}
export class CodeTree {
    constructor(data) {
        this.depth=0;
        // this.children = new CodeTreeNode({ name: 'root', isLeaf: false, id: 0 })
        // this.initNode(this.root, data)
        // return this.root
        try{
            this.children = [];
            this.initTree(data);
        }
        catch(ex){
            console.log(ex)
        }
    }
    calculateDepth(parent){
        let lineNum =parent.lineNumber+1;
        for (let i = 0, len = parent.children.length; i < len; i++) {
            let child = parent.children[i];
            child.depth=parent.depth+1;
            child.lineNumber=lineNum;
            child.tree=this;
            lineNum=this.calculateDepth(child);
        }
        return lineNum;
    }

    initTree(data) {
        for (let i = 0, len = data.length; i < len; i++) {
            var _data = data[i];
            let child = new CodeTreeNode(_data);
            counter++;
            child.isTop = i == 0;
            child.isBottom = i == len - 1;
            child.parent=this
            this.children.push(child);
        }
        this.setLineNumbers()
    }
    setLineNumbers(){
        let lineNum=1;
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            child.lineNumber=lineNum;
            child.tree=this
            lineNum=this.calculateDepth(child);
        }
    }
    toText(){
        var str="";
        for (let i = 0; i < this.children.length; i++) {
            str+=this.children[i].toText();
        }
        return str;
    }
    setPosition(position){
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            child.position=child.lineNumber==position
            child.setPosition(position);
        }
    }
    setSelected(start,end){
        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            child.selected= start<= child.lineNumber && child.lineNumber<=end
            child.setSelected(start,end);
        }
    }
    addChild(child) {
        this.children.push(child);
        this.hasChildren = true;
        child.parent = this;
        child.depth=this.depth+1;
        for (let i = 0; i<this.children.length; i++) {
            var _child = this.children[i];
            _child.isBottom = i == this.children.length - 1;

        }
    }
    insertChild(nodeId,child){
        var index= this.children.length;
        for(let i = 0; i<this.children.length; i++){
            if(this.children[i].id==nodeId)
            {
                index=i+1;
                break;
            }
        }
        this.children.splice(index,0,child);

        child.parent = this;
        child.depth=this.depth+1;
        for (let i = 0; i<this.children.length; i++) {
            var _child = this.children[i];
            _child.isBottom = i == this.children.length - 1;

        }
        this.setLineNumbers();
    }
    getShapeType(line){
        var shapeType='process';
        if(line.includes("Varsa"))
            shapeType='condition';
        return shapeType;

    }
    getIconType(line){
        var iconType='comment';
        if(line.includes("tikla"))
            iconType='cursor';
        else if(line.includes("git"))
            iconType='web';
        return iconType;
    }
    setText(lines){
        var data= []
        this.children=[]
        var node = {text:lines[0],children:[],iconType:this.getIconType(lines[0]),shapeType:this.getShapeType(lines[0])}
        node.parent={}
        node.parent.children=data
        data.push(node);
        for(let i = 1; i<lines.length;i++){
            let prevline= lines[i-1];
            let line= lines[i];
            var prevLevel=this.getLevel(prevline)
            var lineLevel=this.getLevel(line)
            var isChild=lineLevel>prevLevel;
            var next = { text:line.trim(),children:[],iconType:this.getIconType(line),shapeType:this.getShapeType(line)}

            if(isChild){
                node.children.push(next)
                next.parent=node
            }
            else{
                for(let j=lineLevel;j<prevLevel;j++)
                {
                    node=node.parent;
                }
                next.parent=node.parent;

                node.parent.children.push(next)
            }

            node=next
        }
        this.initTree(data)
    }
    getLevel(line){
        if(/^\s*$/.test(line)){
            return line.length
        }
        var linet= line.trim();
        var sp1= line.indexOf(linet);
        var indent= line.substring(0,sp1);
        var count = 0;
        var index = 0;
        while (indent.charAt(index++) === "\t") {
            count++;
        }
        return count;
    }

    insertLine(lineNumber,child){

        var node= this.findParentNode(lineNumber);
        if(node)
            node.parent.insertChild(node.id,child);
        else
            this.addChild(child);
        this.setLineNumbers();
     }
     findParentNode(lineNumber){
         for(let i = 0; i<this.children.length; i++){
             var child=this.children[i];
            var el= this.findNode(lineNumber,child);
             if(el)
                 return el;

         }
         return null;
     }
     findNode(lineNumber,node){
         for(let i = 0; i<node.children.length; i++){
             var child=node.children[i];
            var el= this.findNode(lineNumber,child);
             if(el)
                 return el;

         }
         if(node.lineNumber==lineNumber)
             return node;
         return null;
     }
}