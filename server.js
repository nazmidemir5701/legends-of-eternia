const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const players = new Map(), classFirst = {};
const bosses = {warden:1000, witch:1250};
const deadEnemies = new Set();
const lootChests = new Map();
const respawnTimers = new Map();
const colors = [0x3c8edb,0xd95c83,0x4eae83,0xd49a42,0x9164d8,0x38aeb0];
const server = http.createServer((req,res)=>{
 let pathname=decodeURIComponent((req.url||'/').split('?')[0]); if(pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true,players:players.size,world:'eternia-01'}));} if(pathname==='/')pathname='/index.html';
 const file=path.join(PUBLIC,pathname); if(!file.startsWith(PUBLIC)){res.writeHead(403);return res.end('Forbidden');}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}
 const ext=path.extname(file),types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'};
 res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});res.end(data);});
});
const wss=new WebSocket.Server({server,maxPayload:32*1024});
function send(socket,payload){if(socket.readyState===WebSocket.OPEN)socket.send(JSON.stringify(payload));}
function broadcast(payload,except){for(const c of wss.clients)if(c!==except)send(c,payload);}
function publishState(){broadcast({type:'state',players:[...players.values()]});}
wss.on('connection',socket=>{
 const id=Math.random().toString(36).slice(2,10);
 const player={id,name:'Gezgin',x:0,y:0,z:0,rotation:0,color:colors[Math.floor(Math.random()*colors.length)],className:''};
 players.set(id,player);send(socket,{type:'welcome',id,bosses,classFirst,deadEnemies:[...deadEnemies],chests:[...lootChests.values()]});
 socket.lastMessageAt=0;
 socket.on('message',raw=>{
  const now=Date.now();if(now-socket.lastMessageAt<12)return;socket.lastMessageAt=now;
  let msg;try{msg=JSON.parse(raw.toString());}catch{return;}
  if(msg.type==='join'&&typeof msg.name==='string')player.name=msg.name.slice(0,18);
  if(msg.type==='move')for(const k of ['x','y','z','rotation'])if(Number.isFinite(msg[k]))player[k]=Math.max(-120,Math.min(120,msg[k]));
  if(msg.type==='chooseClass'&&['Savaşçı','Rahip','Okçu','Suikastçi','Tank'].includes(msg.className)){
   player.className=msg.className;if(!classFirst[msg.className])classFirst[msg.className]=id;
   broadcast({type:'classFirst',classes:classFirst});
  }
  if(msg.type==='bossAttack'&&(msg.boss==='warden'||msg.boss==='witch')&&Number.isFinite(msg.damage)){
   bosses[msg.boss]=Math.max(0,bosses[msg.boss]-Math.min(80,Math.max(1,msg.damage)));
   broadcast({type:'bossUpdate',boss:msg.boss,bosses});
  }
  if(msg.type==='bossDefeated'&&(msg.boss==='warden'||msg.boss==='witch')){bosses[msg.boss]=0;broadcast({type:'bossUpdate',boss:msg.boss,bosses});}
  if(msg.type==='enemyKilled'&&typeof msg.enemyId==='string'&&msg.enemyId.length<=100){
   const enemyId=msg.enemyId;
   if(!deadEnemies.has(enemyId)){
    deadEnemies.add(enemyId);broadcast({type:'enemyKilled',enemyId});
    if(respawnTimers.has(enemyId))clearTimeout(respawnTimers.get(enemyId));
    if(!enemyId.startsWith('boss-')){
     const timer=setTimeout(()=>{deadEnemies.delete(enemyId);respawnTimers.delete(enemyId);broadcast({type:'enemyRespawn',enemyId});},18000);
     respawnTimers.set(enemyId,timer);
    }
   }
  }
  if(msg.type==='lootSpawn'&&msg.chest&&typeof msg.chest.id==='string'&&msg.chest.id.length<=120){
   const ch=msg.chest;
   if(!lootChests.has(ch.id)&&Number.isFinite(ch.x)&&Number.isFinite(ch.z)){
    const safe={id:ch.id,x:Math.max(-120,Math.min(120,ch.x)),z:Math.max(-120,Math.min(120,ch.z)),contents:ch.contents};
    lootChests.set(ch.id,safe);broadcast({type:'lootSpawn',chest:safe});
   }
  }
  if(msg.type==='lootClaim'&&typeof msg.chestId==='string'){
   const ch=lootChests.get(msg.chestId);
   if(ch){lootChests.delete(msg.chestId);broadcast({type:'lootClaimed',chestId:msg.chestId,playerId:id,contents:ch.contents});}
  }
  if(['join','move','chooseClass'].includes(msg.type))publishState();
 });
 socket.on('close',()=>{players.delete(id);broadcast({type:'leave',id});});
});
server.listen(PORT, process.env.HOST || '0.0.0.0', ()=>console.log(`Legends of Eternia running on http://127.0.0.1:${server.address().port}`));
module.exports = server;
