import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export interface LeafNode {data:DangerBubble ,x:number, y:number}
export interface DangerBubble{count:number, name: string, ratio:number}
export interface DangerPie{count:number, name:string, ratio:number}
@Component({
  selector: 'app-danger-ratio',
  templateUrl: './danger-ratio.component.html',
  styleUrls: ['./danger-ratio.component.css']
})
export class DangerRatioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initHierarchy();
    this.initRatio("All");
  }

  initRatio(rfile_name:string){
    var div =d3.select("#danger-ratio-div");
    var c_width:number = window.innerWidth*0.45;
    var c_height:number =c_width;

    var canvas = div.append('svg')
      .attr("width", c_width)
      .attr('height',c_height);

    var margin= {top:20, right:20, bottom:20, left:20};
    var width: number= c_width - margin.left - margin.right;
    var height: number= c_height -margin.top - margin.bottom;
  
    var arc_generator = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width,height)/2 * 0.9);

    var arc_label = d3.arc()
      .innerRadius(Math.min(width,height)/2 * 0.6)
      .outerRadius(Math.min(width,height)/2 * 0.8);

    var  g= canvas.append("g")
      .attr("transform", "translate("+ (width/2) + ", " + (height/2) + ")" );

    d3.json("./assets/dangerRatio/"+rfile_name+".json").then((dataset:DangerPie[])=>{
      var color_scale =  d3.scaleOrdinal(d3.schemePastel2)
        .domain(dataset.map((d)=>d["name"]));

      var arcs = d3.pie<DangerPie>()
        .value((d:DangerPie)=>d["count"])(dataset);
      var pizzas=g.selectAll('.pizza')
        .data(arcs)
        .enter().append("path")
        .attr("class",(d)=>{return 'pizza '+ d.data["name"]+"-pizza"})
        .attr("stroke","white")
        .attr("d",<any>arc_generator)
        .style("fill",(d)=>color_scale(d.data["name"]))
        .attr("opacity",0.7)

      pizzas.append("title")
        .text((d)=>{return d.data["name"]+" : "+ (d.data["ratio"]*100).toFixed(1)+"%";})

      g.selectAll(".pie-label")
        .data(arcs)
        .enter().append("text")
        .attr("class","pie-label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("transform", function(d:any){ return "translate("+arc_label.centroid(d)+")";})
        .text((d)=>{return d.data["name"]+" : "+ (d.data["ratio"]*100).toFixed(1)+"%";})

    })

  }


  initHierarchy(){
    var div = d3.select("#danger-control-div");
    var c_width:number = window.innerWidth*0.45;
    var c_height:number = c_width;
    var canvas = div.append("svg")
      .attr("id","pack_layout")
      .attr('width',c_width)
      .attr('height',c_height);

    var margin= {top:20, right:20, bottom:20, left:20};
    var width: number= c_width - margin.left - margin.right;
    var height: number= c_height -margin.top - margin.bottom;

    var  g= canvas.append("g")
    
    // init required component

    var color = d3.scaleSequential(d3.interpolateGnBu)
      .domain([-1,5]);
    var diameter = Math.min(width*0.9, height*0.9);
    var pack =d3.pack()
    .size([diameter,diameter]);
    // .padding(2);

    var tooltip = d3.select("body").append("div")
      .attr('class',"tooltip-danger")
      .attr("padding","2em")
      .style("background","lightsteelblue")
      .style("font","1em sans-serif")
      .style("position","absolute")
      .style("text-align","center");

    var danger_component =this;
    d3.json("./assets/dangerRatio/dangerRatioController.json").then(function(data){
      var root = d3.hierarchy(data)
        .sum(function(d){ return Math.sqrt(d['count']);})
        .sort(function(a,b){ return b.value-a.value;});
      
  
      // const svg = canvas
      // .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      // .style("display", "block")
      // .style("margin", "0 -14px")
      // .style("width", "calc(100% + 28px)")
      // .style("height", "auto")
      // .style("background", color(0))
      // .style("cursor", "pointer")
      // .on("click", () => zoom(root));

      var nodes = pack(root).descendants();
      const roott = pack(root)
      let focus = pack(root);
      let view

      var circles =g.selectAll(".bubble")
        .data(nodes)
        .enter().append("circle")
        .attr("class",node=>node.children?("bubble "+node["data"]["name"]+"-bubble"):"leaf")
        .attr("cx",node=>node.x)
        .attr("cy",node=>node.y)
        .attr("r",node=>node.r)
        // .style("fill",function(d){return color(d.depth)})
        .style("fill",function(d){return d.children? color(d.depth):"white";});

      var leaves = g.selectAll(".leaf, .bubble")
        .on("mouseenter", (node:LeafNode)=>{
          tooltip.html("name:"+node.data["name"]+"<br/>"
                  +"Ratio:"+node.data["ratio"])
            .style("left",(d3.event.pageX +10)+ "px")
            .style("top",(d3.event.pageY - 28) + "px");

          tooltip.transition()
            .duration(200)
            .style("opacity",0.9);
          d3.select("."+node.data.name+"-bubble") 
            .attr("stroke","black")
            .attr("stoke-width",2)
            .attr("opacity",1)

        }).on("mouseleave",(node:LeafNode)=>{
          tooltip.transition()
            .duration(500)
            .style("opacity",0);
          d3.select("."+node.data.name+"-bubble") 
            .attr("stroke","white")
            .attr("stoke-width",0.8)
            .attr("opacity","0.5")
        });
      g.selectAll(".bubble")
        .on("click", (node:LeafNode)=>{
          danger_component.updateRatio(node.data["name"]);

        })


      var b_label = g.selectAll(".bubble-label")
        .data(nodes)
        .enter().append("text")
        .attr("class","bubble-label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("transform", node=>{
          if(node.children){
            return "translate("+node.x+", "+(node.y-node.r*0.8)+")"
          }else{
            return "translate("+node.x+", "+(node.y)+")"
          }
        })
        .attr("pointer-events","none")
        .style("font-size","0.8em")
        .text(node=>node.data['name']);

 
      
        // console.log(roott.x, roott.y)
        // zoom(roott)
        // // zoomTo([roott.x, roott.y, roott.r*2]);
        // view = [roott.x, roott.y, roott.r*2]
        function zoomTo(v) {
          const k =diameter/v[2]-1;
          view = v;
          console.log("where is d")
          circles.attr("transform", d =>( console.log(d),`translate(${(d.x - v[0])*k},${(d.y- v[1])*k})`));
          // b_label.attr("transform", d => `translate(${(d.x - v[0]) * (k)},${(d.y - v[1]) * (k)})`);
          

          b_label.attr("transform", d=>{
          if(d.children){
           return  `translate(${(d.x - v[0])*k},${(d.y- d.r*0.8-v[1])*k})`
          }else{
            return  `translate(${(d.x - v[0])*k},${(d.y- d.r*0.8-v[1])*k})`
          }
        })
          // b_label.attr("transform", d =>( console.log(d),`translate(50,50)`));
          // b_label.attr("transform", node=>{
          //   if(node.children){
          //     return "translate("+node.x+", "+(node.y-node.r*0.8)+")"
          //   }else{
          //     return "translate("+node.x+", "+(node.y)+")"
          //   }
          // }).style("transform", d =>( console.log(d),`translate(50,50)`));
          // console.log("minus result ",d =>((d.x - v[0]),(d.y- v[1]),d),);
          // circles.attr("transform", d => `translate((d.x - v[0])*k,(d.y - v[0])*k)`);
          circles.attr("r", d => d.r * k+d.r );
        }
        function zoom(d) {
          focus = d;
          const transition = canvas.transition()
              .duration(2000)
              .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t =>(console.log(t,i(t)),zoomTo(i(t)));
              });
      
          // b_label
          //   .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          //   .transition(transition)
          //     .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          //     .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          //     .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }    
    });
  }


  updateRatio(rfile_name:string){
    var div =d3.select("#danger-ratio-div");
    var c_width:number = window.innerWidth*0.45;
    var c_height:number =c_width;

    var canvas = div.select('svg')
      .attr("width", c_width)
      .attr('height',c_height);

    var margin= {top:20, right:20, bottom:20, left:20};
    var width: number= c_width - margin.left - margin.right;
    var height: number= c_height -margin.top - margin.bottom;
  
    var arc_generator = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width,height)/2 * 0.9);

    var arc_label = d3.arc()
      .innerRadius(Math.min(width,height)/2 * 0.6)
      .outerRadius(Math.min(width,height)/2 * 0.8);

    var  g= canvas.select("g")
      .attr("transform", "translate("+ (width/2) + ", " + (height/2) + ")" );

    d3.json("./assets/dangerRatio/"+rfile_name+".json").then((dataset:DangerPie[])=>{
      var color_scale =  d3.scaleOrdinal(d3.schemePastel2)
        .domain(dataset.map((d)=>d["name"]));

      var arcs = d3.pie<DangerPie>()
        .value((d:DangerPie)=>d["count"])(dataset);


      var pizzas=g.selectAll('.pizza')
        .data(arcs)
      pizzas.enter().append("path")
        .attr("class",(d)=>{return 'pizza '+ d.data["name"]+"-pizza"})
        .attr("stroke","white")
        .attr("d",<any>arc_generator)
        .style("fill",(d)=>color_scale(d.data["name"]))
        .attr("opacity",0.7)
      pizzas
        .attr("class",(d)=>{return 'pizza '+ d.data["name"]+"-pizza"})
        .attr("stroke","white")
        .attr("d",<any>arc_generator)
        .style("fill",(d)=>color_scale(d.data["name"]))
        .attr("opacity",0.7)
      pizzas.append("title")
        .text((d)=>{return d.data["name"]+" : "+ (d.data["ratio"]*100).toFixed(1)+"%";})
      pizzas.exit().remove();

      var pieLabel=g.selectAll(".pie-label")
        .data(arcs);
      pieLabel
        .attr("class","pie-label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("transform", function(d:any){ return "translate("+arc_label.centroid(d)+")";})
        .text((d)=>{return d.data["name"]+" : "+ (d.data["ratio"]*100).toFixed(1)+"%";})
      pieLabel
        .enter().append("text")
        .attr("class","pie-label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("transform", function(d:any){ return "translate("+arc_label.centroid(d)+")";})
        .text((d)=>{return d.data["name"]+" : "+ (d.data["ratio"]*100).toFixed(1)+"%";})
      pieLabel.exit().remove();



    })

  }

}
