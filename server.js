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
const parties = new Map();
const partyInvites = new Map();
const enemyDamage = new Map();
let nextPartyId = 1;
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
function partySnapshot(party){
 return {id:party.id,leaderId:party.leaderId,members:party.members.map(id=>{
  const p=players.get(id);return p?{id,name:p.name}:null;
 }).filter(Boolean)};
}
function publishParty(party){
 if(!party)return;
 const payload={type:'partyUpdate',party:partySnapshot(party)};
 for(const id of party.members){const p=players.get(id);if(p)send(p.socket,payload);}
}
function removeFromParty(playerId){
 const player=players.get(playerId);if(!player||!player.partyId)return;
 const party=parties.get(player.partyId);player.partyId=null;
 if(!party)return;
 party.members=party.members.filter(id=>id!==playerId);
 if(!party.members.length){parties.delete(party.id);return;}
 if(party.leaderId===playerId)party.leaderId=party.members[0];
 party.lootCursor=party.lootCursor%party.members.length;
 publishParty(party);
}
function findPlayerByName(name){
 const needle=String(name||'').trim().toLocaleLowerCase('tr-TR');
 if(!needle)return null;
 return [...players.values()].find(p=>p.name.toLocaleLowerCase('tr-TR')===needle)||null;
}
function lootPolicyFor(enemyId,killerId){
 const damageMap=enemyDamage.get(enemyId)||new Map();
 const totals=new Map();
 for(const [id,entry] of damageMap){
  const player=players.get(id);if(!player)continue;
  const key=entry.partyId&&parties.has(entry.partyId)?`party:${entry.partyId}`:`player:${id}`;
  const prev=totals.get(key)||{damage:0,partyId:entry.partyId&&parties.has(entry.partyId)?entry.partyId:null,playerId:id};
  prev.damage+=entry.damage;totals.set(key,prev);
 }
 if(!totals.size){
  const killer=players.get(killerId);
  if(killer?.partyId&&parties.has(killer.partyId))return {kind:'party',partyId:killer.partyId};
  return {kind:'player',playerId:killerId};
 }
 const winner=[...totals.entries()].sort((a,b)=>b[1].damage-a[1].damage)[0][1];
 return winner.partyId?{kind:'party',partyId:winner.partyId}:{kind:'player',playerId:winner.playerId};
}
wss.on('connection',socket=>{
 const id=Math.random().toString(36).slice(2,10);
 const player={id,name:'Gezgin',x:0,y:0,z:0,rotation:0,color:colors[Math.floor(Math.random()*colors.length)],className:''};
 Object.defineProperty(player,'socket',{value:socket,writable:true,enumerable:false});players.set(id,player);send(socket,{type:'welcome',id,bosses,classFirst,deadEnemies:[...deadEnemies],chests:[...lootChests.values()]});
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
  if(msg.type==='partyCreate'){
   if(player.partyId){send(socket,{type:'partyError',message:'Zaten bir partidesin.'});}
   else{
    const party={id:`party-${nextPartyId++}`,leaderId:id,members:[id],lootCursor:0};
    parties.set(party.id,party);player.partyId=party.id;publishParty(party);
   }
  }
  if(msg.type==='partyInvite'&&typeof msg.name==='string'){
   const party=player.partyId&&parties.get(player.partyId);
   const target=findPlayerByName(msg.name);
   if(!party||party.leaderId!==id)send(socket,{type:'partyError',message:'Partiye yalnızca parti lideri davet gönderebilir.'});
   else if(party.members.length>=5)send(socket,{type:'partyError',message:'Parti en fazla 5 oyuncu olabilir.'});
   else if(!target)send(socket,{type:'partyError',message:'Bu isimde çevrim içi oyuncu bulunamadı.'});
   else if(target.partyId)send(socket,{type:'partyError',message:'Bu oyuncu zaten bir partide.'});
   else if(target.id===id)send(socket,{type:'partyError',message:'Kendini davet edemezsin.'});
   else{
    partyInvites.set(target.id,{partyId:party.id,from:id,expires:Date.now()+60000});
    send(target.socket,{type:'partyInviteReceived',partyId:party.id,fromName:player.name});
    send(socket,{type:'partyNotice',message:`${target.name} oyuncusuna davet gönderildi.`});
   }
  }
  if(msg.type==='partyAccept'){
   const invite=partyInvites.get(id);
   const party=invite&&invite.expires>Date.now()?parties.get(invite.partyId):null;
   if(!party||player.partyId||party.members.length>=5){partyInvites.delete(id);send(socket,{type:'partyError',message:'Parti daveti geçersiz veya parti dolu.'});}
   else{party.members.push(id);player.partyId=party.id;partyInvites.delete(id);publishParty(party);}
  }
  if(msg.type==='partyLeave'){removeFromParty(id);}
  if(msg.type==='enemyDamage'&&typeof msg.enemyId==='string'&&msg.enemyId.length<=100&&Number.isFinite(msg.damage)){
   const damage=Math.max(0,Math.min(500,Math.floor(msg.damage)));
   if(damage>0&&!deadEnemies.has(msg.enemyId)){
    if(!enemyDamage.has(msg.enemyId))enemyDamage.set(msg.enemyId,new Map());
    const ledger=enemyDamage.get(msg.enemyId);
    const entry=ledger.get(id)||{damage:0,partyId:player.partyId||null};
    entry.damage+=damage;entry.partyId=player.partyId||null;ledger.set(id,entry);
   }
  }
  if(msg.type==='enemyKilled'&&typeof msg.enemyId==='string'&&msg.enemyId.length<=100){
   const enemyId=msg.enemyId;
   if(!deadEnemies.has(enemyId)){
    deadEnemies.add(enemyId);
    const killerId=id;
    const policy=lootPolicyFor(enemyId,killerId);
    const chest=lootChests.get(`${enemyId}-chest`);
    if(chest){chest.policy=policy;chest.killed=true;}
    broadcast({type:'enemyKilled',enemyId});
    if(respawnTimers.has(enemyId))clearTimeout(respawnTimers.get(enemyId));
    if(!enemyId.startsWith('boss-')){
     const timer=setTimeout(()=>{deadEnemies.delete(enemyId);respawnTimers.delete(enemyId);enemyDamage.delete(enemyId);const expiredChestId=`${enemyId}-chest`;lootChests.delete(expiredChestId);broadcast({type:'lootExpired',chestId:expiredChestId});broadcast({type:'enemyRespawn',enemyId});},18000);
     respawnTimers.set(enemyId,timer);
    }
   }
  }
  if(msg.type==='lootSpawn'&&msg.chest&&typeof msg.chest.id==='string'&&msg.chest.id.length<=120){
   const ch=msg.chest;
   if(!lootChests.has(ch.id)&&Number.isFinite(ch.x)&&Number.isFinite(ch.z)){
    const safe={id:ch.id,x:Math.max(-120,Math.min(120,ch.x)),z:Math.max(-120,Math.min(120,ch.z)),contents:ch.contents,policy:lootPolicyFor(ch.id.replace(/-chest$/,''),id),killed:false};
    lootChests.set(ch.id,safe);broadcast({type:'lootSpawn',chest:safe});
   }
  }
  if(msg.type==='lootClaim'&&typeof msg.chestId==='string'){
   const ch=lootChests.get(msg.chestId);
   if(ch){
    const policy=ch.policy||{kind:'player',playerId:id};
    if(!ch.killed){send(socket,{type:'lootDenied',message:'Sandık henüz sunucu tarafından onaylanmadı.'});}
    else if(policy.kind==='player'&&policy.playerId!==id){send(socket,{type:'lootDenied',message:'Bu sandık en çok hasarı veren oyuncuya ait.'});}
    else if(policy.kind==='party'&&(!player.partyId||player.partyId!==policy.partyId)){send(socket,{type:'lootDenied',message:'Bu sandık hasarı en yüksek olan partinin hakkı.'});}
    else{
     lootChests.delete(msg.chestId);
     broadcast({type:'lootClaimed',chestId:msg.chestId});
     if(policy.kind==='party'){
      const party=parties.get(policy.partyId);
      const members=(party?party.members:[]).filter(memberId=>players.has(memberId));
      if(members.length){
       const total=Math.max(0,Math.floor(ch.contents?.coins||0));
       const each=Math.floor(total/members.length),remainder=total%members.length;
       const item=ch.contents?.item||null;
       let assigned=null;
       if(item){assigned=members[party.lootCursor%members.length];party.lootCursor=(party.lootCursor+1)%members.length;}
       members.forEach((memberId,index)=>{
        const share=each+(index<remainder?1:0);
        const member=players.get(memberId);
        send(member.socket,{type:'lootReward',contents:{coins:share,item:memberId===assigned?item:null},message:memberId===assigned&&item?`Ekipman sırası sende: ${item.name}.`:`Parti para payın: ${share} bakır.`});
       });
      }
     }else{
      send(socket,{type:'lootReward',contents:ch.contents,message:'Sandığın ganimeti senin.'});
     }
    }
   }
  }
  if(['join','move','chooseClass'].includes(msg.type))publishState();
 });
 socket.on('close',()=>{removeFromParty(id);players.delete(id);for(const [enemyId,ledger] of enemyDamage){ledger.delete(id);if(!ledger.size)enemyDamage.delete(enemyId);}broadcast({type:'leave',id});});
});
server.listen(PORT, process.env.HOST || '0.0.0.0', ()=>console.log(`Legends of Eternia running on http://127.0.0.1:${server.address().port}`));
module.exports = server;
