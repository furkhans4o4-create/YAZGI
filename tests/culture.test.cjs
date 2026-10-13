const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"../kultur.html"),"utf8");
const script=html.match(/<script>\n([\s\S]*?)<\/script>/)?.[1];
function startCulture(){
 const elements=new Map(),frames=[],traces=[];
 const anthem=html.match(/<script type="text\/plain" id="anthem">([\s\S]*?)<\/script>/)?.[1]||"";
 class Element{
  constructor(id){
   this.id=id;this.listeners={};this.dataset={};this.children=[];this.style={};
   this.value=id==="density"?"11":id==="artSelect"||id==="exploreSelect"?"ataturk":"";
   this.textContent=id==="anthem"?anthem:"";this.checked=false;this.width=600;this.height=600;
   this.classList={toggle(){}};this.files=[];
  }
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}
  fire(type,ev={}){for(const fn of this.listeners[type]||[])fn(ev)}
  appendChild(child){this.children.push(child)}
  append(...children){this.children.push(...children)}
  replaceChildren(){this.children=[]}
  getBoundingClientRect(){return {left:0,top:0,width:600,height:600}}
  setAttribute(){}
  getContext(){
   if(!this.ctx)this.ctx={
    fill(){},fillRect(){},clearRect(){},beginPath(){},arc(){},ellipse(){},lineTo(){},moveTo(){},closePath(){},stroke(){},drawImage(){},
    createRadialGradient(){return {addColorStop(){}}},
    getImageData(){return {data:new Uint8ClampedArray(600*600*4).fill(160)}},
    measureText(value){return {width:Array.from(value).length*6}},
    fillText:(glyph,x,y)=>traces.push({canvas:this.id,glyph,x,y})
   };
   return this.ctx;
  }
 }
 const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id)};
 class FakeImage{
  constructor(){this.width=this.naturalWidth=600;this.height=this.naturalHeight=600}
  set src(_value){this.onload?.()}
 }
 const doc={getElementById:get,createElement:tag=>new Element(tag),querySelectorAll:()=>[]};
 const context={
  document:doc,window:{addEventListener(){}},Image:FakeImage,
  requestAnimationFrame:fn=>(frames.push(fn),frames.length),
  cancelAnimationFrame(){},history:{replaceState(){}},location:{hash:"#discover"},
  localStorage:{getItem(){return null}},URL:{createObjectURL(){return "file://test"},revokeObjectURL(){}}
 };
 vm.createContext(context);
 vm.runInContext(script,context);
 async function flush(){for(let i=0;i<6;i++)await Promise.resolve();while(frames.length)frames.shift()()}
 return {get,traces,flush};
}
test("culture art is an isolated page and its JavaScript is valid",()=>{
 assert.ok(script,"Culture source script found");
 assert.doesNotThrow(()=>new vm.Script(script));
 assert.match(html,/id="exploreCanvas"/);
 assert.match(html,/id="artText"/);
 assert.match(html,/id="artLoadAnthem"/);
 assert.match(html,/id="memorial"/);
 assert.doesNotMatch(script,/yazgi_full_v1/);
});
test("hovering over a circle splits without click",async()=>{
 const {get,flush}=startCulture();await flush();
 assert.match(get("exploreStatus").textContent,/daire: 0/);
 get("exploreCanvas").fire("pointermove",{clientX:225,clientY:225});
 assert.match(get("exploreStatus").textContent,/daire: [1-9]/);
});
test("typing updates the art immediately and deleting removes visible text",async()=>{
 const {get,traces,flush}=startCulture();await flush();
 const area=get("artText");area.value="ATATÜRK";area.fire("input");await flush();
 const letters=traces.filter(x=>x.canvas==="artCanvas").map(x=>x.glyph).join("");
 assert.equal(letters,"ATATÜRK");
 area.value="";area.fire("input");await flush();
 assert.match(get("artStatus").textContent,/Yazmaya başla/);
});
test("anthem preset fills textarea and produces many text glyphs in bust area",async()=>{
 const {get,traces,flush}=startCulture();await flush();
 get("artLoadAnthem").onclick();await flush();
 assert.match(get("artText").value,/Korkma, sönmez/);
 const letters=traces.filter(x=>x.canvas==="artCanvas");
 assert.ok(letters.length>400,"Expected a dense calligram");
 assert.ok(letters.every(p=>p.x>=0&&p.x<=600&&p.y>=0&&p.y<=600));
});
