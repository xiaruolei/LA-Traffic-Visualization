import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3_tile from 'd3-tile';

import { DataService } from '../data.service';
import { OPTIONS } from './map-options';

@Component({
  selector: 'app-page-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css']
})
export class PageMapComponent implements OnInit {
  projection;
  root_div;
  width;
  height;
  canvas;
  tooltip;
  tile;
  geo_feats = null;

  zoom:number=40000;
  countFilter:number=0;
  roadFilter:string="All";
  mapStyle:string='stamen';
  center=[-118.120931,34.018205];

  zoomOptions =[];
  countOptions=[];
  roadOptions=[];
  styleOptions=[];


  constructor(private dataService : DataService) { }

  ngOnInit() {
    this.initOptions();
    this.initMap();
  }

  initOptions(){
    this.zoomOptions  =OPTIONS.zoomOptions;
    this.countOptions =OPTIONS.countOptions;
    this.roadOptions  =OPTIONS.roadOptions;
    this.styleOptions =OPTIONS.styleOptions;
  }

  initMap(){
    // margin convention
    this.root_div = d3.select("#map-div");
    var c_width=this.root_div.node().getBoundingClientRect().width;
    var c_height=900;
    var svg = this.root_div.append("svg")
      .attr("width",c_width)
      .attr("height",c_height);
    var margin = {top:50, right:20,bottom:20, left:20};
    this.width = c_width - margin.left - margin.right;
    this.height = c_height -margin.top -margin.bottom;

    this.canvas= svg.append('g')
      .attr("transform","translate("+margin.left+", "+margin.top+")");

    // projection config
    var map_center=[-118.120931,34.018205];
    this.projection = d3.geoMercator()
    this.projection.scale(this.zoom)
      .center(this.center);
    //var geopath =d3.geoPath(this.projection)
    //  .pointRadius(3);

    this.tooltip = this.root_div.append("div")
      .attr("id","tooltip-map")
      .style("opacity","0")
      .style("position","absolute")
      .style("text-align","center")
      .style("padding","2px")
      .style("border-radius","8px")
      .style("background","lightsteelblue");

    //var geofile_name= "./src/assets/dangerIntersection.geojson";
    this.renderMap()
  }

  renderMap(){
    var tau = 2*Math.PI;

    // Render Tiles
    this.tile = d3_tile.tile();
    var tiles =this.tile.size([this.width,this.height])
      .scale(this.projection.scale()*tau)
      .translate(this.projection([0,0]))();

    this.canvas.selectAll("image")
      .data(tiles)
    .enter().append("image")
      .attr("xlink:href", d=> this.getStamenTiles(d.x, d.y, d.z) )
      .attr("x", function(d) { return (d.x + tiles.translate[0]) * tiles.scale; })
      .attr("y", function(d) { return (d.y + tiles.translate[1]) * tiles.scale; })
      .attr("width", tiles.scale)
      .attr("height", tiles.scale);
    
    //var geodata =(await d3.json(geofile_name));
    let tooltip = this.tooltip;
    let canvas= this.canvas;
    let projection = this.projection;

    this.dataService.getGeoData().subscribe(geodata=>{
        var geo_feats=geodata["features"];
        this.geo_feats=geo_feats;

        canvas.selectAll(".hazzard")
        .data(geo_feats.filter(d=>this.filterHazzards(d)),
          d=>d.properties.name)
          .enter().append("circle")
          .classed("hazzard",true)
          .attr('name',d=>d.properties.name)
          .attr("cx",d=>{return projection(d.geometry.coordinates)[0];})
          .attr("cy",d=>{return projection(d.geometry.coordinates)[1];})
          .attr("r",d=>Math.sqrt(d.properties.count/5))
          .style("fill","red")
          .style("opacity","0.5");
        this.registerToolTip();
    });
  }

  updateMap($event){
    var tau = 2*Math.PI;
    let tooltip = this.tooltip;
    let canvas= this.canvas;
    let projection = this.projection;

    let hazzards=canvas.selectAll(".hazzard")
      .data(this.geo_feats.filter(d=>this.filterHazzards(d)),
        d=>d.properties.name);
    //update
    //hazzards
    //  .attr("cx",d=>{return projection(d.geometry.coordinates)[0];})
    //  .attr("cy",d=>{return projection(d.geometry.coordinates)[1];})
    //  .attr("r",d=>d.properties.count/10)
    //  .style("fill","red")
    //  .attr("opacity","0.5");
    //append
    hazzards.enter().append('circle')
    .classed('hazzard', true)
      .attr('name',d=>d.properties.name)
      .attr("cx",d=>{return projection(d.geometry.coordinates)[0];})
      .attr("cy",d=>{return projection(d.geometry.coordinates)[1];})
      .attr("r",d=>Math.sqrt(d.properties.count/10))
      .style("fill","red")
      .style("opacity",0.0);
    
    canvas.selectAll(".hazzard")
      .transition().duration(1000)
      .style("opacity",0.5)

    hazzards.exit()
      .transition().duration(1000)
      .style('opacity', 1e-6)
      .remove() ;
    this.registerToolTip();
  }

  filterHazzards(data):boolean{
    let roadName = data.properties.name.split('/')[0];
    roadName = roadName.split(' ')[0];
    let count = data.properties.count;
    if((this.roadFilter=="All" ||  roadName==this.roadFilter)
      && count>= this.countFilter){
      return true;
    }else{
      return false;
    }
    
  }

  rerenderMap($event){
    var tau = 2*Math.PI;
    let tooltip = this.tooltip;
    let canvas= this.canvas;
    let projection = this.projection;

    // update projection
    projection.scale(this.zoom)
      .center(this.center);
    //update tiles
    var tiles =this.tile.size([this.width,this.height])
      .scale(projection.scale()*tau)
      .translate(projection([0,0]))();
    //render tiles
    canvas.selectAll("image").remove();
    canvas.selectAll("image")
      .data(tiles)
    .enter().append("image")
      .attr("xlink:href", d=> this.getTiles(d.x, d.y, d.z) )
      .attr("x", function(d) { return (d.x + tiles.translate[0]) * tiles.scale; })
      .attr("y", function(d) { return (d.y + tiles.translate[1]) * tiles.scale; })
      .attr("width", tiles.scale)
      .attr("height", tiles.scale);

    canvas.selectAll(".hazzard").remove();
    canvas.selectAll(".hazzard")
      .data(this.geo_feats.filter(d=>this.filterHazzards(d)),
        d=>d.properties.name)
      .enter().append('circle')
    .classed('hazzard', true)
      .attr("cx",d=>{return projection(d.geometry.coordinates)[0];})
      .attr("cy",d=>{return projection(d.geometry.coordinates)[1];})
      .attr("r",d=>Math.sqrt(d.properties.count/10))
      .style("fill","red")
      .attr("opacity","0.5");
      this.registerToolTip();
  }

  // Helper
  registerToolTip(){
    let tooltip = this.tooltip;
    this.canvas.selectAll(".hazzard")
      .on("mouseover",function(d){
          tooltip.transition()
            .duration(200)
            .style("opacity",0.8);
              tooltip.html("Location: "+d["properties"]["name"]+
                "<br/>Count: "+d["properties"]["count"])
            .style("left",(d3.event.pageX +10)+ "px")
            .style("top",(d3.event.pageY - 28) + "px");

      }).on("mouseleave",function(d){
          tooltip.transition()
            .duration(200)
            .style("opacity",0);
      });
  }

  getColor(count:number):string{
    if(count>100){
      return "#f03b20";
    }else if(count > 50 ){
      return "#feb24c";
    }else{
      return "#ffeda0";
    }

  }

  getTiles(x:number, y:number, z:number){
    if(this.mapStyle=="stamen"){
      return this.getStamenTiles(x,y,z);
    }else{
      return this.getOpenTiles(x,y,z);
    }
  }

  getStamenTiles( x:number, y:number, z:number, style:string="terrain"): string{
    // possible styles 1.Toner, 2.Terrain 3.watercolor
    var url:string ="http://" + "abc"[y % 3] + ".tile.stamen.com/"+style+"/" + z + "/" + x + "/" + y + ".png"; 
    return url;
  }

  getOpenTiles( x:number, y:number, z:number): string{
    var url:string ="http://" + "abc"[y % 3] + ".tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png"; 
    return url;
  }

}
