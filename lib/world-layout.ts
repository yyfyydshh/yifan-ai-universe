import type { ZoneId } from './world-data';

export type BodyId = ZoneId | 'central';
export type IslandBody = { id:BodyId; asset:string; x:number; y:number; width:number; height:number; amplitude:number; period:number; phase:number; spreadX:number; spreadY:number; clusterX:number; clusterY:number };
// The compact silhouette follows the original stepped island blueprint. Each
// complete land body owns its decoration; expansion moves whole bodies only.
const bodies = [
  {id:'writing',asset:'rigid-writing',x:385,y:25,width:355,height:355,amplitude:7,period:10200,phase:1.4,spreadX:-55,spreadY:-55},
  {id:'music',asset:'rigid-music',x:865,y:75,width:350,height:350,amplitude:9,period:9200,phase:3,spreadX:30,spreadY:-70},
  {id:'work',asset:'rigid-work',x:90,y:330,width:390,height:390,amplitude:8,period:8800,phase:.1,spreadX:-65,spreadY:10},
  {id:'games',asset:'rigid-games',x:1190,y:260,width:350,height:350,amplitude:8,period:7600,phase:4.2,spreadX:95,spreadY:-10},
  {id:'thoughts',asset:'rigid-thoughts',x:140,y:735,width:365,height:365,amplitude:9,period:9900,phase:2.8,spreadX:-45,spreadY:45},
  {id:'central',asset:'rigid-central',x:485,y:520,width:535,height:535*2/3,amplitude:6,period:12300,phase:3.7,spreadX:0,spreadY:55},
  {id:'films',asset:'rigid-films',x:1020,y:560,width:330,height:330,amplitude:10,period:10700,phase:5.1,spreadX:60,spreadY:45},
  {id:'stuff',asset:'rigid-stuff',x:1280,y:670,width:335,height:335,amplitude:7,period:8300,phase:.8,spreadX:80,spreadY:120},
];
const cluster:Record<BodyId,[number,number]>={writing:[105,95],music:[-60,65],work:[230,55],games:[-140,65],thoughts:[215,-55],central:[70,-10],films:[-25,-40],stuff:[-130,10]};
// Far terraces first, then lower foreground terraces. Steps sit above their
// departure cliff and below their destination, so landings meet the grass.
const paintOrder:BodyId[]=['writing','music','work','games','central','films','thoughts','stuff'];
export const islandBodies:IslandBody[]=paintOrder.map(id=>({...bodies.find(body=>body.id===id)!,id,clusterX:cluster[id][0],clusterY:cluster[id][1]}));

export type FloatingStep = {id:string;from:BodyId;to:BodyId;t:number;x:number;y:number;width:number;height:number;amplitude:number;period:number;phase:number};
// Ports are points on the walkable grass, in fractions of the owner's image.
// Every tread retains its identity and path order throughout expansion.
export const stairRoutes: {from:BodyId;to:BodyId;start:[number,number];end:[number,number];count:number;size:number;bend:[number,number]}[] = [
  {from:'writing',to:'central',start:[.81,.60],end:[.22,.22],count:12,size:62,bend:[-28,0]},
  {from:'music',to:'games',start:[.79,.60],end:[.20,.59],count:10,size:62,bend:[25,0]},
  {from:'work',to:'central',start:[.84,.56],end:[.15,.43],count:8,size:72,bend:[12,0]},
  {from:'central',to:'thoughts',start:[.17,.52],end:[.69,.53],count:14,size:78,bend:[10,0]},
  {from:'central',to:'films',start:[.92,.43],end:[.19,.57],count:7,size:60,bend:[0,-5]},
  {from:'films',to:'stuff',start:[.80,.59],end:[.22,.60],count:10,size:62,bend:[12,0]},
];
export const floatingSteps: FloatingStep[] = stairRoutes.flatMap((route,routeIndex)=>{
  const from=islandBodies.find(body=>body.id===route.from)!;
  const to=islandBodies.find(body=>body.id===route.to)!;
  const sx=from.x+route.start[0]*from.width,sy=from.y+route.start[1]*from.height;
  const ex=to.x+route.end[0]*to.width,ey=to.y+route.end[1]*to.height;
  return Array.from({length:route.count},(_,index)=>{
    const t=(index+.5)/route.count,arc=4*t*(1-t);
    return {id:`${route.from}-${route.to}-${index+1}`,from:route.from,to:route.to,t,
      x:sx+(ex-sx)*t+route.bend[0]*arc-route.size/2,
      y:sy+(ey-sy)*t+route.bend[1]*arc-route.size*.43,
      width:route.size,height:route.size,
      amplitude:.32+(index%3)*.09,period:6200+routeIndex*370+index*190,phase:routeIndex*.8+index*.28};
  });
});

export const actorLayout = {
  person:{x:560,y:324,width:352},
  cat:{x:805,y:553,width:152},
} as const;

export const sceneSigns:Record<ZoneId,[number,number]>={
  work:[289,597],writing:[563,279],music:[1044,322],games:[1365,490],
  films:[1185,786],thoughts:[324,986],stuff:[1448,911],
};

export const sceneObjects = {
  folder:{x:158,y:505},computer:{x:255,y:445,width:56,height:58},
} as const;
