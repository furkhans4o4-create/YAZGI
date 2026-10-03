/* Original YAZGI simulation rules; reference assets, text and code are not used. */
const SAVE_VERSION=4,ADULT_AGE=18;
const CAREER_RULES={
 herder:{age:10,skills:{riding:10}},hunter:{age:12,skills:{archery:20,riding:10}},horsekeeper:{age:12,skills:{riding:25}},smith_apprentice:{age:12,skills:{craft:17}},
 smith:{age:18,skills:{craft:40},months:12,track:'craft'},bard:{age:16,skills:{speech:35},months:6,track:'culture'},merchant:{age:18,skills:{trade:35},months:12,track:'trade'},caravan:{age:18,skills:{trade:30,riding:25},months:6,track:'trade'},
 scribe:{age:18,skills:{literacy:50},months:12,track:'state'},envoy:{age:22,skills:{literacy:55,speech:45},months:24,track:'state'},alp:{age:18,skills:{combat:45,archery:30,riding:30}},raider:{age:18,skills:{combat:50,riding:40},months:6,track:'military'},
 tarkan:{age:24,skills:{combat:66,speech:40},months:24,track:'military',campaigns:3,prestige:35},bey:{age:28,skills:{speech:60,literacy:40},months:36,track:'state',prestige:45}
};
const ASSET_AGES={horse:12,bow:12,flock:18,sword:18,armor:18,yurt:18,caravan_share:18,smithy:18};
const AILMENTS={fever:{name:'Ateşli rahatsızlık',min:0,loss:2,duration:3},chill:{name:'Soğukta güçten düşme',min:0,loss:1,duration:2},injury:{name:'İyileşen yara',min:12,loss:2,duration:4},joints:{name:'Eklem ağrısı',min:50,loss:1,duration:8}};
const STORY_ARCS={
 smith:{name:'Demir Ocağının Yolu',icon:'🔥',start:'smith_offer',maxStage:7,nodes:{
  smith_offer:{stage:0,next:{0:'smith_first_mistake'},end:{1:'abandoned'}},
  smith_first_mistake:{stage:1,next:{0:'smith_master_test',1:'smith_master_test'}},
  smith_master_test:{stage:2,next:{0:'smith_customer_order',1:'smith_customer_order'}},
  smith_customer_order:{stage:3,next:{0:'smith_own_hearth',1:'smith_own_hearth'}},
  smith_own_hearth:{stage:4,next:{0:'smith_rival_contract',1:'smith_rival_contract'}},
  smith_rival_contract:{stage:5,next:{0:'smith_state_order',1:'smith_state_order'}},
  smith_state_order:{stage:6,end:{0:'completed',1:'completed'}}
 }},
 scribe:{name:'Bitigden Elçiliğe',icon:'𐱅',start:'scribe_offer',maxStage:7,nodes:{
  scribe_offer:{stage:0,next:{0:'scribe_copy'},end:{1:'abandoned'}},
  scribe_copy:{stage:1,next:{0:'scribe_record_dispute',1:'scribe_record_dispute'}},
  scribe_record_dispute:{stage:2,next:{0:'scribe_secret_record',1:'scribe_secret_record'}},
  scribe_secret_record:{stage:3,next:{0:'scribe_envoy_list',1:'scribe_envoy_list'}},
  scribe_envoy_list:{stage:4,next:{0:'envoy_gift_dilemma',1:'scribe_archive_mastery'}},
  envoy_gift_dilemma:{stage:5,next:{0:'envoy_border_talk',1:'envoy_border_talk'}},
  scribe_archive_mastery:{stage:5,end:{0:'completed',1:'completed'}},
  envoy_border_talk:{stage:6,end:{0:'completed',1:'completed'}}
 }},
 caravan:{name:'Kervan Yolu',icon:'🐫',start:'caravan_invite',maxStage:7,nodes:{
  caravan_invite:{stage:0,next:{0:'caravan_first_crossing'},end:{1:'completed'}},
  caravan_first_crossing:{stage:1,next:{0:'caravan_market',1:'caravan_market'}},
  caravan_market:{stage:2,next:{0:'caravan_loss',1:'caravan_loss'}},
  caravan_loss:{stage:3,next:{0:'caravan_partner',1:'caravan_partner'}},
  caravan_partner:{stage:4,next:{0:'caravan_route_rival',1:'caravan_route_rival'}},
  caravan_route_rival:{stage:5,next:{0:'caravan_master',1:'caravan_master'}},
  caravan_master:{stage:6,end:{0:'completed',1:'completed'}}
 }},
 bardcareer:{name:'Ozanın Sözü',icon:'🪕',start:'bard_mentor_offer',maxStage:5,nodes:{
  bard_mentor_offer:{stage:0,next:{0:'bard_first_toy'},end:{1:'abandoned'}},
  bard_first_toy:{stage:1,next:{0:'bard_rival_verse',1:'bard_rival_verse'}},
  bard_rival_verse:{stage:2,next:{0:'bard_patron_offer',1:'bard_patron_offer'}},
  bard_patron_offer:{stage:3,next:{0:'bard_legacy_song',1:'bard_legacy_song'}},
  bard_legacy_song:{stage:4,end:{0:'completed',1:'completed'}}
 }},
 merchantcareer:{name:'Pazarın Güveni',icon:'🧺',start:'merchant_first_stall',maxStage:5,nodes:{
  merchant_first_stall:{stage:0,next:{0:'merchant_credit_request',1:'merchant_credit_request'}},
  merchant_credit_request:{stage:1,next:{0:'merchant_bad_debt',1:'merchant_bad_debt'}},
  merchant_bad_debt:{stage:2,next:{0:'merchant_market_name',1:'merchant_market_name'}},
  merchant_market_name:{stage:3,next:{0:'merchant_partner_offer',1:'merchant_partner_offer'}},
  merchant_partner_offer:{stage:4,end:{0:'completed',1:'completed'}}
 }},
 councilrise:{name:'Boy Meclisinde Yükseliş',icon:'🏕',start:'bey_request',maxStage:6,nodes:{
  bey_request:{stage:0,next:{0:'council_pasture_case',1:'council_pasture_case'}},
  council_pasture_case:{stage:1,next:{0:'council_levy_choice',1:'council_levy_choice'}},
  council_levy_choice:{stage:2,next:{0:'council_rival_challenge',1:'council_rival_challenge'}},
  council_rival_challenge:{stage:3,next:{0:'council_support_test',1:'council_support_test'}},
  council_support_test:{stage:4,next:{0:'council_bey_nomination',1:'council_bey_nomination'}},
  council_bey_nomination:{stage:5,end:{0:'completed',1:'completed'}}
 }},
 beyrule:{name:'Beyliğin Yükü',icon:'⚖',start:'bey_first_petition',maxStage:5,nodes:{
  bey_first_petition:{stage:0,next:{0:'bey_winter_reserve',1:'bey_winter_reserve'}},
  bey_winter_reserve:{stage:1,next:{0:'bey_kin_request',1:'bey_kin_request'}},
  bey_kin_request:{stage:2,next:{0:'bey_border_agreement',1:'bey_border_agreement'}},
  bey_border_agreement:{stage:3,next:{0:'bey_old_judgment',1:'bey_old_judgment'}},
  bey_old_judgment:{stage:4,end:{0:'completed',1:'completed'}}
 }},
 military:{name:'Savaşçının Yükselişi',icon:'⚔',start:'military_comrade',maxStage:4,nodes:{
  military_comrade:{stage:0,next:{0:'military_night_watch'},end:{1:'abandoned'}},
  military_night_watch:{stage:1,next:{0:'military_small_command'},end:{1:'abandoned'}},
  military_small_command:{stage:2,next:{0:'military_tarkan_path'},end:{1:'abandoned'}},
  military_tarkan_path:{stage:3,end:{0:'completed',1:'completed'}}
 }},
 feud:{name:'Husumetin Sonu',icon:'🔥',start:'toy_insult',maxStage:3,nodes:{
  toy_insult:{stage:0,next:{0:'feud_challenge'},end:{1:'completed'}},
  feud_challenge:{stage:1,next:{0:'feud_end',1:'feud_mediation_result'}},
  feud_end:{stage:2,end:{0:'completed',1:'completed'}},
  feud_mediation_result:{stage:2,end:{0:'completed',1:'completed'}}
 }},
 household:{name:'Ocağın Yılları',icon:'🏕',start:'household_first_winter',maxStage:5,nodes:{
  household_first_winter:{stage:0,next:{0:'spouse_family_request',1:'spouse_family_request'}},
  spouse_family_request:{stage:1,next:{0:'household_work_balance',1:'household_work_balance'}},
  household_work_balance:{stage:2,next:{0:'household_trust_test',1:'household_trust_test'}},
  household_trust_test:{stage:3,next:{0:'household_long_memory',1:'household_long_memory'}},
  household_long_memory:{stage:4,end:{0:'completed',1:'completed'}}
 }},
 childpath:{name:'Bir Çocuğun Yolu',icon:'🧒',start:'child_training_choice',maxStage:4,nodes:{
  child_training_choice:{stage:0,next:{0:'child_training_conflict',1:'child_training_conflict',2:'child_training_conflict'}},
  child_training_conflict:{stage:1,next:{0:'child_departure_choice',1:'child_departure_choice'}},
  child_departure_choice:{stage:2,next:{0:'child_path_consequence',1:'child_path_consequence',2:'child_path_consequence'}},
  child_path_consequence:{stage:3,end:{0:'completed',1:'completed'}}
 }},
 herd:{name:'Büyük Sürünün Yolu',icon:'🐎',start:'herd_expansion',maxStage:3,nodes:{
  herd_expansion:{stage:0,next:{0:'herd_disease'},end:{1:'completed'}},
  herd_disease:{stage:1,next:{0:'herd_reputation'},end:{1:'completed'}},
  herd_reputation:{stage:2,end:{0:'completed',1:'completed'}}
 }},
 comradelegacy:{name:'Yoldaşlığın İzi',icon:'🛡',start:'comrade_debt_returns',maxStage:3,nodes:{
  comrade_debt_returns:{stage:0,next:{0:'comrade_request_aid',1:'comrade_betrayal'}},
  comrade_request_aid:{stage:1,next:{0:'comrade_rises'},end:{1:'completed'}},
  comrade_rises:{stage:2,end:{0:'completed',1:'completed'}},
  comrade_betrayal:{stage:1,end:{0:'completed',1:'completed'}}
 }},
 rivalry:{name:'Kişisel Husumet',icon:'⚔',start:'rival_arc_challenge',maxStage:3,nodes:{
  rival_arc_challenge:{stage:0,next:{0:'rival_arc_escalation'},end:{1:'completed'}},
  rival_arc_escalation:{stage:1,next:{0:'rival_arc_resolution',1:'rival_arc_resolution'}},
  rival_arc_resolution:{stage:2,end:{0:'completed',1:'completed'}}
 }},
 exile:{name:'Sürgün ve Dönüş',icon:'↗',start:'exile_new_oath',maxStage:2,nodes:{
  exile_new_oath:{stage:0,next:{1:'exile_return'},end:{0:'completed'}},
  exile_return:{stage:1,next:{1:'exile_return'},end:{0:'completed'}}
 }}
};
function arcEventMeta(eventId){
 for(const [id,arc] of Object.entries(STORY_ARCS))if(arc.nodes[eventId])return {id,arc,node:arc.nodes[eventId]};return null;
}
function ensureStoryArcs(){
 s.storyArcs=s.storyArcs&&typeof s.storyArcs==='object'&&!Array.isArray(s.storyArcs)?s.storyArcs:{};
 if((s.storyArcVersion||0)<3){
  const archive=[...(s.eventArchive||[])];
  for(const rec of archive)recordStoryArcChoice(rec.id,rec.choice,'',rec,true);
  s.storyArcVersion=3;
 }
 for(const st of Object.values(s.storyArcs)){
  if(st.status!=='active'||!st.nextEventId)continue;
  const ev=EVENT_DECK?.find?.(e=>e.id===st.nextEventId);
  if(ev&&s.age>ev.max){st.status='abandoned';st.branch='Zamanı geçti';st.nextEventId=null;st.completedYear=s.year+s.age;continue;}
  if(ev?.target&&st.participantIds?.length){
   const alive=st.participantIds.filter(id=>npcById(id)?.alive);
   const missing=ev.target==='statePair'?alive.length<Math.min(2,st.participantIds.length):alive.length===0;
   if(missing){st.status='abandoned';st.branch='Hikâyedeki kişi yaşamını yitirdi';st.nextEventId=null;st.completedYear=s.year+s.age;}
  }
 }
 return s.storyArcs;
}
function recordStoryArcChoice(eventId,choiceIndex,choiceText,context={},replay=false){
 const meta=arcEventMeta(eventId);if(!meta)return null;
 s.storyArcs=s.storyArcs||{};let st=s.storyArcs[meta.id];
 if(!st)st=s.storyArcs[meta.id]={id:meta.id,status:'active',stage:0,nextEventId:meta.arc.start,startedAge:context.age??s.age,startedYear:context.year??s.year+s.age,lastYear:context.year??s.year+s.age,branch:'',participantIds:[],history:[]};
 const duplicate=replay&&st.history.some(h=>h.eventId===eventId&&h.age===context.age&&h.month===context.month&&h.choice===choiceIndex);
 if(!duplicate)st.history.push({eventId,choice:choiceIndex,choiceText:choiceText||'',age:context.age??s.age,year:context.year??s.year+s.age,month:context.month??currentMonth()});
 st.history=st.history.slice(-20);st.stage=Math.max(st.stage,meta.node.stage+1);st.lastEventId=eventId;st.lastChoice=choiceIndex;st.lastChoiceText=choiceText||st.lastChoiceText||'';st.lastYear=context.year??s.year+s.age;
 for(const id of [context.targetId,context.otherTargetId])if(id&&!st.participantIds.includes(id))st.participantIds.push(id);
 const next=meta.node.next?.[choiceIndex]||null,end=meta.node.end?.[choiceIndex]||null;
 if(next){st.status='active';st.nextEventId=next;}
 else{st.status=end||'completed';st.nextEventId=null;st.completedYear=context.year??s.year+s.age;st.branch=choiceText||st.branch;}
 if(!replay&&st.status==='completed')log('Hikâye tamamlandı: '+meta.arc.name+'.','major');
 if(!replay&&st.status==='abandoned')log('Hikâye yolu kapandı: '+meta.arc.name+'.');
 return st;
}
function eventEffectiveWeight(e){
 const base=e?.w||1,meta=arcEventMeta(e?.id);if(!meta||!s)return base;ensureStoryArcs();const st=s.storyArcs[meta.id];
 if(!st)return e.id===meta.arc.start?base*1.25:base;
 if(st.status==='active')return st.nextEventId===e.id?base*7:base*.2;
 return base*.08;
}
function storyArcEventAllowed(e){
 const meta=arcEventMeta(e?.id);if(!meta)return true;ensureStoryArcs();const st=s.storyArcs[meta.id];
 if(!st)return e.id===meta.arc.start;
 if(st.status!=='active')return false;
 return st.nextEventId===e.id;
}
function storyArcProgress(st){
 const arc=STORY_ARCS[st.id];if(!arc)return 0;const raw=Math.max(0,Math.min(100,Math.round((st.stage/arc.maxStage)*100)));return st.status==='active'?Math.min(94,raw):100;
}
function renderStoryArcs(){
 const root=$('storyArcBoard');if(!root)return;ensureStoryArcs();
 const states=Object.values(s.storyArcs||{}).sort((a,b)=>(b.status==='active')-(a.status==='active')||(b.lastYear||0)-(a.lastYear||0));
 const shown=[...states.filter(x=>x.status==='active'),...states.filter(x=>x.status!=='active').slice(0,2)];
 if(!shown.length){root.innerHTML='';return;}
 let html='<div class="storyArcWrap"><div class="storyArcTitle">Süren Hikâyeler</div>';
 for(const st of shown){const arc=STORY_ARCS[st.id],pct=storyArcProgress(st),status=st.status==='active'?'Sürüyor':st.status==='completed'?'Tamamlandı':'Yol kapandı',cls=st.status==='active'?'active':st.status==='completed'?'done':'closed';html+='<div class="storyArc '+cls+'"><div class="storyArcHead"><strong>'+arc.icon+' '+safeText(arc.name)+'</strong><span>'+status+'</span></div><div class="storyArcBar"><i style="width:'+pct+'%"></i></div><div class="storyArcMeta">'+st.stage+'/'+arc.maxStage+' adım'+(st.lastChoiceText?' • Son karar: '+safeText(st.lastChoiceText):'')+'</div></div>';}
 root.innerHTML=html+'</div>';
}

function ensureDelayedEvents(){
 s.delayedEvents=Array.isArray(s.delayedEvents)?s.delayedEvents:[];
 s.delayedEvents=s.delayedEvents.filter(x=>x&&x.eventId&&x.status!=='discarded').map(x=>({id:x.id||('d_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)),eventId:x.eventId,dueYear:Math.max(s.year,Math.floor(x.dueYear??(s.year+s.age))),createdYear:Math.floor(x.createdYear??(s.year+s.age)),targetId:x.targetId||null,otherTargetId:x.otherTargetId||null,sourceEventId:x.sourceEventId||'',status:x.status||'pending',payload:x.payload&&typeof x.payload==='object'?x.payload:{}}));
 return s.delayedEvents;
}
function scheduleDelayedEvent(spec,context={}){
 if(!spec?.id)return null;ensureDelayedEvents();
 const years=Array.isArray(spec.years)?spec.years:[spec.years??1,spec.years??1],lo=Math.max(1,Math.floor(years[0]??1)),hi=Math.max(lo,Math.floor(years[1]??lo));
 const rec={id:'d_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),eventId:spec.id,dueYear:(s.year+s.age)+rng(lo,hi),createdYear:s.year+s.age,targetId:spec.target==='other'?context.otherTargetId:spec.target==='none'?null:context.targetId||null,otherTargetId:spec.target==='other'?context.targetId:context.otherTargetId||null,sourceEventId:context.sourceEventId||'',status:'pending',payload:{...(spec.payload||{})}};
 s.delayedEvents.push(rec);return rec;
}
function dueDelayedRecord(eventId){
 ensureDelayedEvents();const now=s.year+s.age;
 return s.delayedEvents.filter(x=>x.status==='pending'&&x.eventId===eventId&&x.dueYear<=now).sort((a,b)=>a.dueYear-b.dueYear)[0]||null;
}
function delayedEventReady(e){
 if(!e?.delayed)return true;const rec=dueDelayedRecord(e.id);if(!rec)return false;
 if(rec.targetId&&!npcById(rec.targetId)?.alive){rec.status='discarded';return false;}
 if(rec.otherTargetId&&!npcById(rec.otherTargetId)?.alive){rec.status='discarded';return false;}
 return true;
}
function resolveDelayedRecord(id){
 if(!id)return;const rec=ensureDelayedEvents().find(x=>x.id===id);if(rec)rec.status='resolved';
}
function delayedDetail(ctx){
 const p=ctx?.delayedPayload||{};return p.detail||p.pathLabel||p.note||'';
}
function targetPastLabel(n){
 const v=n?.statusFlags?.guidance;return v==='war'?'at ve ok talimine':v==='craft'?'bir ustanın yanında zanaata':v==='free'?'kendi yolunu bulmaya':'kendi yolunu bulmaya';
}
function applyChildPathConsequence(n,context,choiceIndex){
 if(!n)return;const path=context?.delayedPayload?.path||n.statusFlags?.guidance||'free';n.goal=path==='war'?'war':path==='craft'?'mastery':chooseNPCGoal(n);n.skills=n.skills||{};
 if(path==='war'){n.skills.combat=clamp((n.skills.combat||0)+8);n.skills.riding=clamp((n.skills.riding||0)+6);n.skills.archery=clamp((n.skills.archery||0)+6);}
 else if(path==='craft'){n.skills.craft=clamp((n.skills.craft||0)+10);}
 else{n.skills.speech=clamp((n.skills.speech||0)+4);n.prestige=clamp((n.prestige||0)+2);}
 n.role=npcCareerFor(n);n.roleHistory.push({year:s.year+s.age,role:n.role});rememberNPC(n,'milestone','Yıllar önce seçilen yetişme yolunun ardından '+n.role+' oldu.',6);
 if(choiceIndex===0){n.prestige=clamp((n.prestige||0)+4);adjustNPC(n,{rel:5,trust:6,respect:5},'Yıllar sonra yolunu desteklemeye devam ettin.');}
 else adjustNPC(n,{rel:-1,trust:-2,respect:2},'Yetişkin olduğunda kendi sorumluluğunu almasını istedin.');
 log(safeText(n.name)+' yıllar süren yetişme yolunun ardından '+safeText(n.role)+' oldu.','major');
}
function promoteMilitaryComrade(n){
 if(!n)return;normalizeNPC(n,n.type);n.goal=n.goal==='peace'?'prestige':n.goal;n.prestige=clamp((n.prestige||0)+16);
 const old=n.role;let next='Alp';
 if(n.age>=30&&n.prestige>=58)next='Boy Beyi';else if(n.age>=24&&n.prestige>=42)next='Tarkan';
 n.role=next;if(old!==next)n.roleHistory.push({year:s.year+s.age,role:next});rememberNPC(n,'career','Eski sefer yıllarından sonra '+next+' konumuna yükseldi.',7);
}
function militaryComradeSummary(){
 const cs=(s.military?.comrades||[]).filter(n=>n.alive);if(!cs.length)return '';
 const loyal=cs.filter(n=>(n.bonds?.trust||0)>=60||(n.rel||0)>=72).length,tense=cs.filter(n=>(n.bonds?.grudge||0)>=30||(n.rel||0)<=35).length,leaders=cs.filter(n=>['Tarkan','Boy Beyi'].includes(n.role)).length;
 const pending=(s.delayedEvents||[]).filter(x=>x.status==='pending'&&['comrade_debt_returns','comrade_request_aid','comrade_rises','comrade_betrayal','comrade_battle_rescue'].includes(x.eventId)).length;
 return '<div class="card"><h3>🛡 Yoldaşlık İzleri</h3><p>'+cs.length+' yaşayan yoldaş • '+loyal+' güçlü bağ • '+tense+' gergin bağ'+(leaders?' • '+leaders+' yükselmiş yoldaş':'')+(pending?' • '+pending+' geleceğe kalan iz':'')+'</p></div>';
}
function resolveComradeCampaignOutcome(kind='return'){
 for(const n of s.military.comrades||[]){
  if(!n.alive)continue;normalizeNPC(n,n.type);n.statusFlags=n.statusFlags||{};n.statusFlags.campaignsTogether=(n.statusFlags.campaignsTogether||0)+1;n.prestige=clamp((n.prestige||0)+rng(1,4));
  const danger=Math.random();
  if(danger<.035){n.alive=false;n.health=0;rememberNPC(n,'death','Aynı seferde yaşamını yitirdi.',10);log('Sefer yoldaşın '+safeText(n.name)+' çatışmalarda yaşamını yitirdi.','bad');continue;}
  if(danger<.13){n.health=clamp(n.health-rng(8,22));rememberNPC(n,'military','Seferden yaralı döndü.',5);}
  if(kind==='success')adjustNPC(n,{rel:2,trust:3,respect:2},'Bir seferi daha birlikte tamamladınız.');
  else if(kind==='captured')adjustNPC(n,{rel:1,trust:2,grudge:-1},'Tutsak düştüğün seferin hatırasını taşıyor.');
 }
 seedCoreSocialLinks();
}
function makeTargetFriend(n,type='Dost'){
 if(!n)return;const ri=s.rivals.findIndex(x=>x.id===n.id);if(ri>=0)s.rivals.splice(ri,1);n.type=type;if(!s.friends.some(x=>x.id===n.id))s.friends.push(n);n.statusFlags=n.statusFlags||{};n.statusFlags.oldComrade=true;rememberNPC(n,'bond','Eski sefer bağınız dostluğa dönüştü.',6);
}
function makeTargetRival(n,type='Rakip'){
 if(!n)return;const fi=s.friends.findIndex(x=>x.id===n.id);if(fi>=0)s.friends.splice(fi,1);n.type=type;if(!s.rivals.some(x=>x.id===n.id))s.rivals.push(n);n.statusFlags=n.statusFlags||{};n.statusFlags.oldComrade=true;rememberNPC(n,'hurt','Eski sefer bağınız açık husumete dönüştü.',7);
}

function safeText(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function npcId(){return 'n_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);}
function pathName(p){return ({civil:'oba',craft:'zanaat',culture:'söz',trade:'ticaret',state:'bitig/devlet',military:'sefer'})[p]||p;}
function lifeStage(a){return a<5?'Aile bakımında':a<10?'Gözetimli çocukluk':a<12?'Oba yardımı':a<16?'Çıraklık':a<18?'Gençlik':a<50?'Yetişkinlik':'Tecrübe çağı';}
function notice(text){$('gameNotice').textContent=text;if(s?.pendingEventId||s?.pendingDecision)activateLifeTab();}
function clearTransient(){window._contextEvent=null;window._choices=null;window._systemDecisionText=null;window._swipeBusy=false;window._swipeEpoch=(window._swipeEpoch||0)+1;}
const NPC_TRAITS={
 sadik:{name:'Sadık'},hirsli:{name:'Hırslı'},gururlu:{name:'Gururlu'},comert:{name:'Cömert'},tutumlu:{name:'Tutumlu'},
 kinci:{name:'Kinci'},bagislayici:{name:'Bağışlayıcı'},cesur:{name:'Cesur'},temkinli:{name:'Temkinli'},merhametli:{name:'Merhametli'},
 kuskucu:{name:'Kuşkucu'},konuskan:{name:'Konuşkan'},caliskan:{name:'Çalışkan'},sakin:{name:'Sakin'}
};
const NPC_GOALS={
 family:'Ocağını ve soyunu güçlendirmek',wealth:'Mal ve sürü biriktirmek',prestige:'Obada söz sahibi olmak',
 mastery:'Bir işte ustalaşmak',war:'Seferlerde ün kazanmak',wisdom:'Bilgi ve tecrübe toplamak',peace:'Sakin ve güvenli yaşamak'
};
const NPC_TRAIT_IDS=Object.keys(NPC_TRAITS),NPC_GOAL_IDS=Object.keys(NPC_GOALS);
function chooseNPCTraits(){
 const first=pick(NPC_TRAIT_IDS),opposites={kinci:'bagislayici',bagislayici:'kinci',cesur:'temkinli',temkinli:'cesur',comert:'tutumlu',tutumlu:'comert',hirsli:'sakin',sakin:'hirsli'};
 const pool=NPC_TRAIT_IDS.filter(x=>x!==first&&x!==opposites[first]);return [first,pick(pool)];
}
function chooseNPCGoal(n){
 const t=n.traits||[];
 if(t.includes('hirsli'))return pick(['prestige','wealth','war','mastery']);
 if(t.includes('caliskan'))return pick(['mastery','wealth','family']);
 if(t.includes('cesur'))return pick(['war','prestige']);
 if(t.includes('merhametli')||t.includes('sadik'))return pick(['family','peace','wisdom']);
 if(t.includes('tutumlu'))return 'wealth';
 return pick(NPC_GOAL_IDS);
}
function npcCareerFor(n){
 const a=n.age??18,g=n.goal||'family',p=n.prestige??0,t=n.traits||[];
 if(a<8)return 'Çocuk';
 if(a<12)return g==='mastery'?'Usta yanında gözlemci':g==='family'?'Oba işlerine yardım ediyor':'Sürü yanında yetişiyor';
 if(a<18){
  if(g==='war'||t.includes('cesur'))return pick(['At binmeyi öğreniyor','Okçuluk öğreniyor','Güreş talimi görüyor']);
  if(g==='mastery')return pick(['Demirci yanında yetişiyor','At bakımı öğreniyor','Zanaat öğreniyor']);
  if(g==='wisdom')return pick(['Destan dinliyor','Bitig öğreniyor']);
  return pick(['Sürü yanında yetişiyor','Oba işlerini öğreniyor']);
 }
 if(a>=30&&p>=72&&(g==='prestige'||t.includes('hirsli')))return 'Boy Beyi';
 if(a>=24&&p>=58&&(g==='war'||t.includes('cesur')))return 'Tarkan';
 if(a>=22&&p>=52&&g==='wisdom')return pick(['Baş Bitigçi','Elçi']);
 if(a>=22&&p>=48&&g==='wealth')return 'Kervan Başı';
 const map={
  war:['Alp','Avcı','Akıncı'],wealth:['Tüccar','Çoban','Kervan yardımcısı'],prestige:['Elçi yardımcısı','Alp','Oba ileri geleni'],
  mastery:['Demirci','At Bakıcısı','Avcı'],wisdom:['Ozan','Bitigçi','Otacı yardımcısı'],family:['Çoban','At Bakıcısı','Avcı'],peace:['Çoban','Zanaatkâr','At Bakıcısı']
 };return pick(map[g]||map.family);
}
function normalizeBonds(n){
 const base=clamp(n.rel??60);n.bonds=n.bonds||{};
 n.bonds.trust=clamp(n.bonds.trust??base+rng(-8,8));n.bonds.respect=clamp(n.bonds.respect??50+rng(-12,12));
 n.bonds.fear=clamp(n.bonds.fear??rng(0,12));n.bonds.grudge=clamp(n.bonds.grudge??Math.max(0,45-base)+rng(0,6));return n.bonds;
}
function rememberNPC(n,kind,text,weight=1){
 if(!n)return;n.memories=Array.isArray(n.memories)?n.memories:[];
 const item={kind,text:String(text||''),weight,age:s?.age??0,year:s?(s.year+s.age):0};
 n.memories.unshift(item);n.memories=n.memories.slice(0,14);return item;
}
function adjustNPC(n,delta={},memory=''){
 if(!n)return;n.rel=clamp((n.rel??60)+(delta.rel||0));normalizeBonds(n);
 for(const k of ['trust','respect','fear','grudge'])if(delta[k])n.bonds[k]=clamp(n.bonds[k]+delta[k]);
 if(delta.health)n.health=clamp((n.health??80)+delta.health);
 if(memory)rememberNPC(n,delta.grudge>0?'hurt':delta.trust>0?'bond':'event',memory,Math.max(1,Math.abs(delta.rel||delta.trust||delta.grudge||1)));
}
function npcTraitNames(n){return (n.traits||[]).map(id=>NPC_TRAITS[id]?.name||id);}
function npcGoalName(n){return NPC_GOALS[n.goal]||'Kendi yolunu aramak';}
function recentNPCMemory(n){return n.memories?.[0]?.text||'';}
function normalizeNPC(n,type='Yakın'){
 if(!n)return n;n.id=n.id||npcId();n.type=n.type||type;n.alive=n.alive!==false;n.rel=clamp(n.rel??60);n.health=clamp(n.health??80);
 n.age=n.age??(type==='Ana'||type==='Ata'?30:Math.max(5,s?.age||8));n.gender=n.gender||(type==='Ana'||type==='Nine'||type==='Hala'||type==='Teyze'||type==='Kız kardeş'?'female':type==='Ata'||type==='Dede'||type==='Amca'||type==='Dayı'||type==='Erkek kardeş'?'male':pick(['male','female']));
 n.traits=Array.isArray(n.traits)&&n.traits.length?n.traits.slice(0,2):chooseNPCTraits();n.goal=n.goal||chooseNPCGoal(n);normalizeBonds(n);
 n.memories=Array.isArray(n.memories)?n.memories.slice(0,14):[];n.parentIds=Array.isArray(n.parentIds)?n.parentIds:[];n.origin=n.origin||s?.place||'';n.tribe=n.tribe||s?.tribe||'';
 n.wealth=Math.max(0,Math.round(n.wealth??rng(0,25)));n.prestige=clamp(n.prestige??rng(5,35));n.skills=n.skills||{};
 n.role=n.role||npcCareerFor(n);n.roleHistory=Array.isArray(n.roleHistory)?n.roleHistory:[];n.partner=n.partner||null;n.children=n.children||0;n.descendants=Array.isArray(n.descendants)?n.descendants:[];
 n.lastInteractionYear=n.lastInteractionYear??null;n.statusFlags=n.statusFlags||{};return n;
}
function allNPCs(){
 const out=[],seen=new Set();const visit=n=>{if(!n||seen.has(n.id))return;seen.add(n.id);normalizeNPC(n,n.type);out.push(n);(n.descendants||[]).forEach(visit);};
 [...s.parents,...s.siblings,...(s.relatives||[]),...s.friends,...s.rivals,...s.children,...(s.careerContacts||[]),s.partner,...s.military.comrades].forEach(visit);return out;
}
function socialKey(a,b){
 const ai=typeof a==='string'?a:a?.id,bi=typeof b==='string'?b:b?.id;if(!ai||!bi||ai===bi)return '';
 return [ai,bi].sort().join('|');
}
function normalizeSocialLink(l){
 if(!l)return null;l.id=l.id||socialKey(l.a,l.b);l.score=Math.max(-100,Math.min(100,Math.round(l.score??0)));l.trust=clamp(l.trust??50);
 l.grudge=clamp(l.grudge??Math.max(0,-l.score));l.tags=Array.isArray(l.tags)?[...new Set(l.tags)]:[];l.memories=Array.isArray(l.memories)?l.memories.slice(0,8):[];
 l.sinceYear=l.sinceYear??(s?.year+s?.age||0);l.lastYear=l.lastYear??l.sinceYear;return l;
}
function socialLinkBetween(a,b,create=false,seed={}){
 const key=socialKey(a,b);if(!key)return null;s.socialLinks=Array.isArray(s.socialLinks)?s.socialLinks:[];
 let l=s.socialLinks.find(x=>x.id===key||socialKey(x.a,x.b)===key);
 if(!l&&create){const ids=key.split('|');l={id:key,a:ids[0],b:ids[1],score:0,trust:50,grudge:0,tags:seed.tags||[],memories:[],sinceYear:s.year+s.age,lastYear:s.year+s.age};s.socialLinks.push(l);}
 return normalizeSocialLink(l);
}
function rememberSocialLink(l,text,weight=1){
 if(!l||!text)return;l.memories.unshift({text:String(text),weight,year:s.year+s.age});l.memories=l.memories.slice(0,8);l.lastYear=s.year+s.age;
}
function updateSocialTags(l){
 if(!l)return;const keep=l.tags.filter(x=>['kin','spouse','comrade','legacy'].includes(x));
 if(l.score>=45)keep.push('friend');if(l.score<=-35)keep.push('rival');l.tags=[...new Set(keep)];
}
function adjustSocialLink(a,b,delta={},memory=''){
 const l=socialLinkBetween(a,b,true,delta),before=l.score;
 l.score=Math.max(-100,Math.min(100,l.score+(delta.score||0)));l.trust=clamp(l.trust+(delta.trust||0));l.grudge=clamp(l.grudge+(delta.grudge||0));
 if(delta.tag&&!l.tags.includes(delta.tag))l.tags.push(delta.tag);updateSocialTags(l);if(memory)rememberSocialLink(l,memory,Math.max(1,Math.abs(delta.score||delta.grudge||1)));return {link:l,before};
}
function npcById(id){return allNPCs().find(n=>n.id===id)||null;}
function shareParents(a,b){return !!a?.parentIds?.some(id=>b?.parentIds?.includes(id));}
function closeKinPair(a,b){return !!(a&&b&&(a.parentIds?.includes(b.id)||b.parentIds?.includes(a.id)||shareParents(a,b)));}
function pruneSocialLinks(){
 const ids=new Set(allNPCs().map(n=>n.id));s.socialLinks=(s.socialLinks||[]).map(normalizeSocialLink).filter(l=>l&&ids.has(l.a)&&ids.has(l.b)&&l.a!==l.b);
}
function seedCoreSocialLinks(){
 if(!s)return;s.socialLinks=Array.isArray(s.socialLinks)?s.socialLinks:[];const people=allNPCs();
 for(let i=0;i<people.length;i++)for(let j=i+1;j<people.length;j++){const a=people[i],b=people[j];if((a.partner?.id===b.id||b.partner?.id===a.id)&&!socialLinkBetween(a,b))adjustSocialLink(a,b,{score:78,trust:28,grudge:-20,tag:'spouse'});else if(closeKinPair(a,b)&&!socialLinkBetween(a,b))adjustSocialLink(a,b,{score:58,trust:18,grudge:-10,tag:'kin'});}
 const cs=s.military?.comrades||[];for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++)if(!socialLinkBetween(cs[i],cs[j]))adjustSocialLink(cs[i],cs[j],{score:rng(18,34),trust:rng(4,12),tag:'comrade'});
 pruneSocialLinks();
}
function socialCompatibility(a,b){
 let v=0;if(a.goal===b.goal)v+=2;if((a.traits||[]).some(t=>b.traits?.includes(t)))v+=2;
 if((a.traits?.includes('kinci')&&b.traits?.includes('gururlu'))||(b.traits?.includes('kinci')&&a.traits?.includes('gururlu')))v-=3;
 if((a.traits?.includes('sadik')&&b.traits?.includes('merhametli'))||(b.traits?.includes('sadik')&&a.traits?.includes('merhametli')))v+=2;if(closeKinPair(a,b))v+=2;return v;
}
function isClosePlayerKin(n){return [...s.parents,...s.siblings,...s.children,...(s.relatives||[]),...(s.partner?[s.partner]:[])].some(x=>x.id===n?.id);}
function socialLinkLabel(l){
 if(l.tags.includes('spouse'))return 'Eş bağı';if(l.tags.includes('rival')||l.score<=-35)return 'Husumet';if(l.tags.includes('friend')||l.score>=45)return 'Dostluk';if(l.tags.includes('comrade'))return 'Yoldaşlık';if(l.tags.includes('kin'))return 'Akrabalık';return l.score>=15?'Yakınlık':l.score<=-15?'Gerginlik':'Tanışıklık';
}
function socialConnectionsFor(n,limit=3){
 if(!n)return [];const ids=new Set(allNPCs().map(x=>x.id));return (s.socialLinks||[]).filter(l=>(l.a===n.id||l.b===n.id)&&ids.has(l.a)&&ids.has(l.b)).sort((a,b)=>Math.abs(b.score)-Math.abs(a.score)||b.trust-a.trust).slice(0,limit).map(l=>({link:l,other:npcById(l.a===n.id?l.b:l.a)})).filter(x=>x.other);
}
function renderSocialNetworkSummary(limit=8){
 seedCoreSocialLinks();const people=new Map(allNPCs().map(n=>[n.id,n]));
 const links=(s.socialLinks||[]).filter(l=>people.has(l.a)&&people.has(l.b)&&(Math.abs(l.score)>=25||l.tags.includes('kin')||l.tags.includes('comrade'))).sort((a,b)=>Math.abs(b.score)-Math.abs(a.score)).slice(0,limit);
 if(!links.length)return '';let rows='';
 for(const l of links){const a=people.get(l.a),b=people.get(l.b),kind=l.score<=-25?'bad':l.tags.includes('kin')?'kin':'good';rows+='<div class="socialEdge '+kind+'"><span><strong>'+safeText(a.name)+'</strong> ↔ <strong>'+safeText(b.name)+'</strong><br><small>'+safeText(socialLinkLabel(l))+'</small></span><span class="socialEdgeScore">'+(l.score>0?'+':'')+l.score+'</span></div>';}
 return '<div class="socialGraph"><div class="socialGraphTitle">Yakınların birbirleriyle ilişkileri</div><div class="socialGraphList">'+rows+'</div></div>';
}
function rivalKinPairs(){
 const kinIds=new Set([...s.parents,...s.siblings,...s.children,...(s.relatives||[])].filter(n=>n.alive).map(n=>n.id)),rivalIds=new Set(s.rivals.filter(n=>n.alive).map(n=>n.id)),out=[];
 for(const l of s.socialLinks||[]){if(l.score<35)continue;let rival=null,kin=null;if(rivalIds.has(l.a)&&kinIds.has(l.b)){rival=npcById(l.a);kin=npcById(l.b);}if(rivalIds.has(l.b)&&kinIds.has(l.a)){rival=npcById(l.b);kin=npcById(l.a);}if(rival&&kin)out.push({target:rival,other:kin,link:l});}return out;
}
function tickNPCSocialNetwork(year){
 seedCoreSocialLinks();const living=allNPCs().filter(n=>n.alive&&n.age>=5);
 for(const l of s.socialLinks||[]){const a=npcById(l.a),b=npcById(l.b);if(!a?.alive||!b?.alive)continue;const forgive=(a.traits?.includes('bagislayici')||b.traits?.includes('bagislayici'))?2:0,stubborn=(a.traits?.includes('kinci')||b.traits?.includes('kinci'))?1:0;l.grudge=clamp(l.grudge-forgive+(stubborn&&l.score<0?1:0));if(l.score>0&&l.trust<90)l.trust=clamp(l.trust+1);if(l.score<0&&l.trust>10)l.trust=clamp(l.trust-1);updateSocialTags(l);}
 const encounters=Math.min(7,Math.max(2,Math.floor(living.length/3)));
 for(let k=0;k<encounters&&living.length>1;k++){const a=pick(living),others=living.filter(x=>x.id!==a.id),b=pick(others);if(!b)continue;const old=socialLinkBetween(a,b);if(!old&&!closeKinPair(a,b)&&Math.abs(a.age-b.age)>18&&Math.random()>.18)continue;const before=old?.score??0,delta=rng(-4,4)+socialCompatibility(a,b),r=adjustSocialLink(a,b,{score:delta,trust:delta>1?1:delta<-1?-1:0,grudge:delta<-2?2:delta>2?-1:0},delta>=3?'Birlikte geçirdikleri zaman aralarını ısıttı.':delta<=-3?'Aralarında yeni bir sürtüşme çıktı.':'Aralarındaki bağ değişti.'),l=r.link;const friend=before<45&&l.score>=45,rival=before>-35&&l.score<=-35;if((friend||rival)&&(isClosePlayerKin(a)||isClosePlayerKin(b)))log(safeText(a.name)+' ile '+safeText(b.name)+' arasında '+(friend?'güçlü bir dostluk':'ciddi bir husumet')+' oluştu.',friend?'good':'bad');}
 pruneSocialLinks();
}
function ensureCareerSystems(){
 s.careerProfiles=s.careerProfiles&&typeof s.careerProfiles==='object'&&!Array.isArray(s.careerProfiles)?s.careerProfiles:{};
 s.careerContacts=Array.isArray(s.careerContacts)?s.careerContacts:[];
 return s.careerProfiles;
}
function careerProfile(id){
 ensureCareerSystems();if(!id)return null;
 if(!s.careerProfiles[id])s.careerProfiles[id]={id,months:0,reputation:0,mastery:0,earnings:0,orders:0,failures:0,bestStreak:0,streak:0,lastYear:s.year+s.age,history:[]};
 const p=s.careerProfiles[id];p.months=Math.max(0,p.months||0);p.reputation=clamp(p.reputation||0);p.mastery=clamp(p.mastery||0);p.earnings=Math.max(0,p.earnings||0);p.orders=Math.max(0,p.orders||0);p.failures=Math.max(0,p.failures||0);p.streak=Math.max(0,p.streak||0);p.bestStreak=Math.max(p.bestStreak||0,p.streak);p.history=Array.isArray(p.history)?p.history.slice(-20):[];return p;
}
function currentCareer(){const r=D.careers.find(x=>x.name===s.role);return r?{role:r,profile:careerProfile(r.id)}:null;}
function careerContactSpec(kind){
 const specs={
  smith:{type:'Demirci Ustası',goal:'mastery',role:'Demirci',minAge:32,traits:['caliskan','gururlu']},
  scribe:{type:'Bitig Ustası',goal:'wisdom',role:'Bitigçi',minAge:34,traits:['temkinli','caliskan']},
  caravan:{type:'Kervanbaşı',goal:'wealth',role:'Kervan Rehberi',minAge:32,traits:['tutumlu','konuskan']},
  bard:{type:'Ozan Ustası',goal:'wisdom',role:'Ozan',minAge:30,traits:['konuskan','gururlu']},
  merchant:{type:'Pazar Ortağı',goal:'wealth',role:'Tüccar',minAge:26,traits:['tutumlu','caliskan']}
 };return specs[kind]||null;
}
function careerContact(kind,create=true){
 ensureCareerSystems();let n=s.careerContacts.find(x=>x.statusFlags?.careerKind===kind&&x.alive);
 if(n||!create)return n||null;const spec=careerContactSpec(kind);if(!spec)return null;
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=Math.max(spec.minAge,s.age+rng(7,20));
 n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(48,68),type:spec.type,goal:spec.goal,role:spec.role,prestige:rng(32,58),traits:[...spec.traits]} ,spec.type);
 n.statusFlags=n.statusFlags||{};n.statusFlags.careerKind=kind;n.statusFlags.mentor=true;normalizeBonds(n);n.bonds.respect=clamp(Math.max(n.bonds.respect,65));rememberNPC(n,'career','Meslek yolunda tanıştığınız günleri hatırlıyor.',4);s.careerContacts.push(n);return n;
}
function careerContactsSummary(){
 ensureCareerSystems();const live=s.careerContacts.filter(n=>n.alive);if(!live.length)return '';
 return '<h3 class="sectionTitle">Meslek Çevresi</h3><div class="grid2">'+live.map((n,i)=>familyCard(n,'careerContacts',i)).join('')+'</div>';
}
function careerRoleSummary(){
 const cur=currentCareer();if(!cur)return '';const r=cur.role,p=cur.profile;
 const rep=p.reputation>=70?'Çok saygın':p.reputation>=45?'Tanınan':p.reputation>=20?'Gelişiyor':'Yeni';
 return '<div class="card"><h3>'+safeText(r.name)+'</h3><p>'+rep+' • '+p.months+' ay çalıştı<br>Meslek itibarı '+p.reputation+' • Ustalık '+p.mastery+'<br>Toplam kazanç '+p.earnings+' • Başarılı iş '+p.orders+' • Aksama '+p.failures+'</p></div>';
}
function careerPrimarySkill(r){const a=CAREER_RULES[r.id];return Object.keys(a?.skills||{})[0]||'speech';}
function careerWorkOutcome(r){
 const p=careerProfile(r.id),key=careerPrimarySkill(r),need=CAREER_RULES[r.id]?.skills?.[key]||20,level=s.skills[key]||0;
 const difficulty=Math.max(8,need-8+Math.floor(p.mastery/9)),chance=Math.max(.28,Math.min(.94,.56+(level-difficulty)/110+p.reputation/350+s.health/500));
 p.months++;p.lastYear=s.year+s.age;s.careerMonths[r.id]=(s.careerMonths[r.id]||0)+1;addExperience(r.path);
 const success=Math.random()<chance;
 if(success){
  const base=Array.isArray(r.wealth)?rng(r.wealth[0],r.wealth[1]):rng(1,3),bonus=Math.floor(p.reputation/28),gain=Math.max(1,base+bonus);
  p.orders++;p.streak++;p.bestStreak=Math.max(p.bestStreak,p.streak);p.earnings+=gain;p.reputation=clamp(p.reputation+(p.streak>=4?2:1));p.mastery=clamp(p.mastery+rng(1,3));skillGain(key,2);apply({wealth:gain,prestige:p.reputation>=45?2:1,skill:1});
  if(p.streak===4)log(safeText(r.name)+' işlerinde adın daha sık anılmaya başladı.','good');
  p.history.push({year:s.year+s.age,ok:true,gain});return {success:true,gain};
 }
 p.failures++;p.streak=0;p.reputation=clamp(p.reputation-rng(1,3));p.mastery=clamp(p.mastery+1);skillGain(key,1);apply({happiness:-1});p.history.push({year:s.year+s.age,ok:false,gain:0});return {success:false,gain:0};
}
function ensureStateCourt(){
 ensureCareerSystems();
 if(!s.stateCourt||typeof s.stateCourt!=='object'||Array.isArray(s.stateCourt)){
  s.stateCourt={initialized:false,influence:0,councilTrust:30,tribeSupport:45,rivalPressure:30,obligations:0,decisions:[],startedYear:s.year+s.age};
 }
 const q=s.stateCourt;
 for(const k of ['influence','councilTrust','tribeSupport','rivalPressure'])q[k]=clamp(Number.isFinite(q[k])?q[k]:0);
 q.obligations=Math.max(0,Math.round(q.obligations||0));q.decisions=Array.isArray(q.decisions)?q.decisions.slice(-30):[];
 return q;
}
function stateContactSpec(kind){
 const specs={
  patron:{type:'Boy İleri Geleni',goal:'prestige',role:'Boy Beyi',minAge:34,traits:['temkinli','sadik'],rel:[52,70],prestige:[55,78]},
  rival:{type:'Rakip İleri Gelen',goal:'prestige',role:'Oba İleri Geleni',minAge:30,traits:['hirsli','gururlu'],rel:[28,48],prestige:[48,74]},
  elder:{type:'Boy Büyüğü',goal:'wisdom',role:'Danışman',minAge:48,traits:['temkinli','bagislayici'],rel:[48,68],prestige:[45,72]}
 };return specs[kind]||null;
}
function stateContact(kind,create=true){
 const q=ensureStateCourt();let n=s.careerContacts.find(x=>x.statusFlags?.stateKind===kind);
 if(n)return n.alive?n:null;if(!create)return null;const spec=stateContactSpec(kind);if(!spec)return null;
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=Math.max(spec.minAge,s.age+rng(6,20));
 n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(spec.rel[0],spec.rel[1]),type:spec.type,goal:spec.goal,role:spec.role,prestige:rng(spec.prestige[0],spec.prestige[1]),traits:[...spec.traits]},spec.type);
 n.statusFlags=n.statusFlags||{};n.statusFlags.stateKind=kind;n.statusFlags.stateCircle=true;normalizeBonds(n);
 if(kind==='patron'){n.bonds.respect=clamp(Math.max(n.bonds.respect,62));n.bonds.trust=clamp(Math.max(n.bonds.trust,48));}
 if(kind==='rival'){n.bonds.grudge=clamp(Math.max(n.bonds.grudge,12));}
 rememberNPC(n,'state','Boy çevresinde yollarınız kesişti.',4);s.careerContacts.push(n);q.initialized=true;return n;
}
function ensureStateCircle(){
 const q=ensureStateCourt();const patron=stateContact('patron'),rival=stateContact('rival'),elder=stateContact('elder');
 if(!q.started){q.started=true;q.initialized=true;q.influence=clamp(Math.max(q.influence,Math.round(s.prestige*.35+(s.skills?.speech||0)*.12)));q.councilTrust=clamp(Math.max(q.councilTrust,32));q.tribeSupport=clamp(Math.max(q.tribeSupport,42));q.rivalPressure=clamp(Math.max(q.rivalPressure,28));}
 return {patron,rival,elder};
}
function adjustStateCourt(delta={},memory=''){
 const q=ensureStateCourt();if(delta.influence)q.influence=clamp(q.influence+delta.influence);if(delta.trust)q.councilTrust=clamp(q.councilTrust+delta.trust);if(delta.support)q.tribeSupport=clamp(q.tribeSupport+delta.support);if(delta.rival)q.rivalPressure=clamp(q.rivalPressure+delta.rival);if(delta.obligations)q.obligations=Math.max(0,q.obligations+delta.obligations);
 if(memory){q.decisions.unshift({year:s.year+s.age,text:String(memory),influence:q.influence,trust:q.councilTrust,support:q.tribeSupport,rival:q.rivalPressure});q.decisions=q.decisions.slice(0,30);}
 return q;
}
function stateCourtSummary(){
 const q=ensureStateCourt();if(!q.initialized&&!['Bitigçi','Elçi','Boy Beyi'].includes(s.role))return '';
 const last=q.decisions[0]?.text||'Henüz büyük bir meclis kararı vermedin.';
 return '<div class="card"><h3>🏕 Boy Meclisi ve Nüfuz</h3><p>Nüfuz '+q.influence+' • Meclis güveni '+q.councilTrust+'<br>Oba desteği '+q.tribeSupport+' • Rakip baskısı '+q.rivalPressure+(q.obligations?' • Yükümlülük '+q.obligations:'')+'</p><div class="memoryline">Son iz: '+safeText(last)+'</div></div>';
}
function stateYearTick(){
 const q=ensureStateCourt();if(!q.initialized)return;
 const rival=stateContact('rival',false),patron=stateContact('patron',false);
 if(rival?.alive)q.rivalPressure=clamp(q.rivalPressure+rng(0,2));else q.rivalPressure=clamp(q.rivalPressure-2);
 if(patron?.alive&&(patron.bonds?.trust||0)>=65)q.councilTrust=clamp(q.councilTrust+1);
 if(s.role==='Boy Beyi'){q.influence=clamp(q.influence+1);q.obligations=Math.max(0,q.obligations-1);}
 else if(q.influence>0&&Math.random()<.35)q.influence=clamp(q.influence-1);
}
function careerIssue(r){
 if(!r)return 'Görev bulunamadı.';const a=CAREER_RULES[r.id];
 if(s.age<a.age)return `${a.age} yaşında açılır`;
 if(s.skill<r.skill-10)return `Genel beceri ${Math.max(0,r.skill-10)} gerekiyor`;
 for(const [k,v]of Object.entries(a.skills))if(s.skills[k]<v)return `${skillName(k)} ${v} gerekiyor`;
 if(a.months&&(s.experience[a.track]||0)<a.months)return `${a.months} ay ${pathName(a.track)} tecrübesi gerekiyor`;
 if(a.prestige&&s.prestige<a.prestige)return `${a.prestige} itibar gerekiyor`;
 if(a.campaigns&&s.military.campaigns<a.campaigns)return `${a.campaigns} sefer gerekiyor`;
 if(r.id==='bey'){const q=ensureStateCourt();if(q.influence<20)return 'Boy meclisi nüfuzu 20 gerekiyor';if(q.councilTrust<30)return 'Meclis güveni 30 gerekiyor';}
 if(r.path==='military'&&s.health<40)return 'En az 40 sağlık gerekiyor';
 if(s.exile&&['state','military'].includes(r.path))return 'Önce sürgün meselesini çözmelisin';return '';
}
function careerRequirements(r){const a=CAREER_RULES[r.id];return `${a.age} yaş • genel beceri ${Math.max(0,r.skill-10)} • ${Object.entries(a.skills).map(([k,v])=>skillName(k)+' '+v).join(' • ')}${a.months?' • '+a.months+' ay '+pathName(a.track):''}${a.prestige?' • itibar '+a.prestige:''}${a.campaigns?' • '+a.campaigns+' sefer':''}${r.id==='bey'?' • meclis nüfuzu 20 • meclis güveni 30':''}`;}
function getFamilyGroup(group){if(group==='partner')return s.partner?[s.partner]:[];if(group==='comrades')return s.military?.comrades||[];if(group==='careerContacts')return s.careerContacts||[];return ['parents','siblings','relatives','friends','rivals','children'].includes(group)?(s[group]||[]):[];}
function accessIssue(a){
 if(!s?.alive)return 'Bu yaşam sona erdi.';
 if(s.pendingEventId||s.pendingDecision)return 'Önce karar kartını çöz.';
 if(s.monthsRemaining<=0)return 'Bu yıl için 12 eylem hakkını kullandın. 1 Yıl Geçir ile yeni yıla geç.';
 if(s.captive&&!['captivity','escape'].includes(a.kind))return 'Tutsakken bu eyleme erişemezsin.';
 if(s.military.active&&!['military','desert','wait','health'].includes(a.kind)&&!(a.kind==='npc'&&a.group==='comrades'))return 'Seferdeyken yalnız birlik ve yoldaşlarınla ilgili eylemler yapabilirsin.';
 let min=0;
 if(['activity','training'].includes(a.kind)){if(!ACTION_RULES[a.id])return 'Eylem bulunamadı.';min=ACTION_RULES[a.id].age;}
 else if(a.kind==='period'){const r=PERIOD_ACTIVITIES.find(x=>x.id===a.id);if(!r)return 'Faaliyet bulunamadı.';min=r.age;if(a.id==='healer'&&s.wealth<2)return '2 servet gerekiyor.';}
 else if(a.kind==='role')return careerIssue(D.careers.find(x=>x.id===a.id));
 else if(a.kind==='asset'){
  const r=D.assets.find(x=>x.id===a.id);if(!r)return 'Varlık bulunamadı.';min=ASSET_AGES[a.id]||18;
  if(a.sell&&!s.assets.includes(a.id))return 'Bu varlık sende yok.';
  if(!a.sell&&s.assets.includes(a.id))return 'Zaten sahipsin.';
  if(!a.sell&&s.wealth<r.cost)return `${r.cost} servet gerekiyor.`;
  if(!a.sell&&a.id==='smithy'&&(s.skills.craft<40||(s.experience.craft||0)<12))return 'Zanaat 40 ve 12 ay zanaat tecrübesi gerekiyor.';
 }else if(a.kind==='npc'){
  if(!['spend','gift','advice','reconcile','confide','help','work'].includes(a.id))return 'Etkileşim bulunamadı.';
  min=a.id==='gift'||a.id==='help'||a.id==='work'?10:a.id==='confide'?8:a.id==='advice'?6:5;const n=getFamilyGroup(a.group)[a.index];if(!n?.alive)return 'Bu kişiyle görüşemezsin.';
  if(a.id==='gift'&&s.wealth<3)return '3 servet gerekiyor.';
  if(a.id==='help'&&s.wealth<2)return 'Yardım için 2 servet gerekiyor.';
  if(a.id==='confide'&&(n.bonds?.trust??0)<25)return 'Önce aranızda biraz güven oluşmalı.';
  if(a.id==='advice'&&(n.age<16||n.age<=s.age))return 'Senden büyük, en az 16 yaşında birini seç.';
  if(a.id==='reconcile'&&a.group!=='rivals')return 'Bir rakip seç.';
 }else if(a.kind==='health'){min=5;if(!['rest','healer'].includes(a.id))return 'Bakım bulunamadı.';if(a.id==='healer'&&s.wealth<2)return '2 servet gerekiyor; dinlenebilirsin.';}
 else if(a.kind==='guardian'){if(s.age>=5)return 'Bu bakım dönemi sona erdi.';}
 else if(a.kind==='friend')min=6;
 else if(a.kind==='rival')min=10;
 else if(a.kind==='meet'){min=16;if(s.partner?.alive)return 'Zaten görüştüğün biri var.';}
 else if(a.kind==='marry'){min=18;if(!s.partner?.alive||s.married)return 'Yaşayan eş adayı gerekiyor.';if(s.partner.age<18)return 'İkiniz de 18 yaşında olmalısınız.';if(s.partner.rel<65)return 'İlişkiniz en az 65 olmalı.';}
 else if(a.kind==='crime'){min=18;if(!D.crimes.some(x=>x.id===a.id))return 'Eylem bulunamadı.';}
 else if(a.kind==='military'){min=18;if(!s.military.served)return 'Önce birliğe katılmalısın.';if(!['horse','bow','drill','watch'].includes(a.id))return 'Talim bulunamadı.';}
 else if(a.kind==='desert'){min=18;if(!s.military.active)return 'Aktif seferde değilsin.';}
 else if(a.kind==='escape'){min=12;if(!s.captive)return 'Tutsak değilsin.';}
 else if(a.kind==='captivity'){if(!s.captive)return 'Tutsak değilsin.';}
 else if(a.kind==='work'){min=10;if(!s.role)return 'Önce bir görev üstlen.';}
 else if(a.kind==='retire'){min=50;if(!s.role)return 'Bırakılacak görev yok.';}
 else if(a.kind==='will'){min=18;if(!s.children.some(x=>x.alive))return 'Yaşayan çocuğun yok.';}
 else if(a.kind==='venture'){min=18;const asset={herd:'flock',forge:'smithy',caravan:'caravan_share'}[a.id];if(!asset||!s.assets.includes(asset))return 'Önce ilgili varlığı edinmelisin.';}
 else if(a.kind!=='wait')return 'Eylem bulunamadı.';
 return s.age<min?`${min} yaşında açılır.`:'';
}
function canSpendMonth(){if(!s?.alive)return false;if(s.pendingEventId||s.pendingDecision){notice('Önce karar kartını çöz.');return false;}if(s.monthsRemaining<=0){notice('Bu yıl için eylem hakkın kalmadı. 1 Yıl Geçir ile devam et.');return false;}return true;}
function performAction(a,work,reason){const issue=accessIssue(a);if(issue){notice(issue);return false;}$('gameNotice').textContent='';s.lastAction={...a,age:s.age,year:s.year+s.age,month:currentMonth()};work();s.wealth=Math.max(0,Math.round(s.wealth));return spendMonth(reason,a);}
function spendMonth(reason='',action={kind:'wait'}){
 if(!canSpendMonth())return false;const month=currentMonth();s.monthsRemaining--;if(reason)log(`<b>${month}. Ay:</b> ${reason}`);monthlyTick(month,action);
 if(s.alive&&s.monthsRemaining===0)log('Bu yılın 12 eylem hakkını kullandın. Hazır olduğunda yeni yıla geçebilirsin.','major');render();save();return true;
}
function acquireAilment(id){const d=AILMENTS[id];if(d&&s.age>=d.min&&!s.ailments.some(x=>x.id===id)){s.ailments.push({id,remaining:d.duration});log(d.name+' yaşamını zorlaştırıyor.','bad');}}
function addExperience(path){if(path)s.experience[path]=(s.experience[path]||0)+1;}
function checkAchievements(){if(s.age>=18)unlock('adult');if(s.age>=65)unlock('old');if(s.wealth>=100)unlock('rich');if(Object.values(s.skills).some(x=>x>=60))unlock('trained');}
function canHaveChild(){if(!s.married||!s.partner?.alive||s.age<18||s.partner.age<18||s.captive||s.military.active||s.pregnancy)return false;return (s.gender==='female'?s.age:s.partner.age)<45&&s.health>=35&&s.partner.health>=35;}
function monthlyTick(month,action,allowEvent=true){
 tickEventCooldowns();
 for(const n of allNPCs())if(n.alive&&n.birthYear!=null){const before=n.age;n.age=Math.max(0,s.year+s.age-n.birthYear-(month<n.birthMonth?1:0));if(before!==n.age&&[8,12,18].includes(n.age))n.role=npcRole(n.age);}
 if(s.military.active){addExperience('military');s.military.dutyMonths--;if(s.military.dutyMonths<=0)campaignResult();}
 for(const x of s.ailments){apply({health:-AILMENTS[x.id].loss});x.remaining--;}s.ailments=s.ailments.filter(x=>x.remaining>0);
 if(month>=10&&Math.random()<.02)acquireAilment('chill');if(month===12&&s.age>=50&&Math.random()<.25)acquireAilment('joints');
 if(s.role&&!s.captive&&!s.military.active){const r=D.careers.find(x=>x.name===s.role);if(r){addExperience(r.path);s.careerMonths[r.id]=(s.careerMonths[r.id]||0)+1;if(month%3===0)apply({wealth:rng(...r.wealth)});}}
 if(s.age>=18&&month%3===0){apply({wealth:-1});if(!s.captive&&s.assets.includes('flock'))apply({wealth:rng(1,3)});if(!s.captive&&!s.military.active&&s.assets.includes('smithy')&&s.skills.craft>=40)apply({wealth:2});}
 if(s.pregnancy&&--s.pregnancy.remaining<=0){
  if(s.married&&s.partner?.alive&&s.age>=18&&s.partner.age>=18){const gender=pick(['male','female']);const c=normalizeNPC({name:pick(D.realms[s.realm][gender]),gender,age:0,type:'Çocuk',birthYear:s.year+s.age,birthMonth:month,alive:true,rel:80,realm:s.realm,place:s.place,tribe:s.tribe},'Çocuk');s.children.push(c);unlock('parent');log(safeText(c.name)+' dünyaya geldi.','major');}s.pregnancy=null;
 }
 checkAchievements();if(s.health<=0)die();if(s.alive&&allowEvent)triggerContextEvent(true,{...action,month});
}
function passOneYear(){
 if(!s?.alive)return;
 if(s.pendingEventId||s.pendingDecision){notice('Önce karar kartını çöz.');return;}
 const unused=s.monthsRemaining??12;
 while(s.alive&&s.monthsRemaining>0){
  const month=currentMonth();
  s.lastAction={kind:'wait',age:s.age,year:s.year+s.age,month};
  s.monthsRemaining--;
  monthlyTick(month,{kind:'wait'},false);
 }
 if(!s.alive){render();save();return;}
 if(unused>0)log(unused===12?'Bu yılı doğrudan geride bıraktın.':`Kalan ${unused} eylem hakkını kullanmadan yılı tamamladın.`,'major');
 ageUp();
}
function guardianCare(){performAction({kind:'guardian'},()=>apply({happiness:1}),'Bakımını ailen ve bakıcıların üstlendi.');}
function healthAction(id){performAction({kind:'health',id},()=>{if(id==='healer')s.wealth-=2;apply({health:id==='healer'?7:4,happiness:1});s.ailments.forEach(x=>x.remaining-=id==='healer'?2:1);s.ailments=s.ailments.filter(x=>x.remaining>0);},id==='healer'?'Otacıdan yardım aldın.':'Dinlenmeye zaman ayırdın.');}
function activity(t){performAction({kind:'activity',id:t},()=>{if(t==='at'){skillGain('riding',3);apply({skill:2,happiness:2});}if(t==='ok'){skillGain('archery',3);skillGain('combat',1);apply({skill:2});}if(t==='av'){skillGain('archery',2);apply(Math.random()<.65?{wealth:rng(1,3),skill:2}:{health:-2});}if(t==='toy'){skillGain('speech',1);apply({happiness:4,prestige:2});}},s.age<18?'Büyüklerin gözetiminde faaliyetine zaman ayırdın.':'Faaliyetinle bir ay geçirdin.');}
function train(t){performAction({kind:'training',id:t},()=>{const [k,p]={horse:['riding','civil'],archery:['archery','military'],wrestling:['combat','military'],smith:['craft','craft'],bitig:['literacy','state'],story:['speech','culture']}[t];skillGain(k,rng(3,5));apply({skill:2,happiness:1});addExperience(p);s.path=p;},s.age<18?'Bir büyüğün veya ustanın gözetiminde çalıştın.':'Öğrenmeye ve talime bir ay ayırdın.');}
function doPeriodActivity(id){if(id==='healer'||id==='rest')return healthAction(id);const a=PERIOD_ACTIVITIES.find(x=>x.id===id);if(a)performAction({kind:'period',id},()=>{a.do();if(['market','caravanmarket','herdcare'].includes(id))addExperience('trade');},a.name+' ile bir ay geçti.');}
function takeRole(id){const r=D.careers.find(x=>x.id===id);if(!r)return;performAction({kind:'role',id},()=>{
 const p=careerProfile(id),fit=Math.min(.96,.48+(s.skill-r.skill)/100+s.prestige/300+p.reputation/500+p.mastery/600);
 if(Math.random()<fit){
  const old=s.role;s.role=r.name;s.path=r.path;p.lastYear=s.year+s.age;apply({prestige:r.prestige});p.history.push({year:s.year+s.age,entry:true,from:old||''});
  if(['smith','smith_apprentice'].includes(id))careerContact('smith');
  if(['scribe','envoy','bey'].includes(id))careerContact('scribe');if(['envoy','bey'].includes(id))ensureStateCircle();
  if(['merchant','caravan'].includes(id))careerContact(id==='merchant'?'merchant':'caravan');
  if(id==='bard')careerContact('bard');
  log(r.name+' görevini üstlendin.'+(s.age<18?' Büyüklerin gözetiminde yetişeceksin.':''),'good');if(id==='bey')unlock('bey');
 }else{p.failures++;p.reputation=clamp(p.reputation-1);log('Bu kez '+r.name+' görevi için kabul edilmedin.');}
},'Görev görüşmeleriyle bir ay geçti.');}
function workRole(){performAction({kind:'work'},()=>{
 const r=D.careers.find(x=>x.name===s.role);if(!r)return;const result=careerWorkOutcome(r);
 if(result.success){if(r.path==='state')adjustStateCourt({influence:1,trust:1,support:r.id==='bey'?1:0,rival:r.id==='bey'?-1:0},r.name+' görevinde düzenli hizmet verdin.');log(safeText(r.name)+' görevinde verimli bir ay geçirdin; '+result.gain+' servet kazandın.','good');}
 else{if(r.path==='state')adjustStateCourt({trust:-1,rival:1},r.name+' görevinde aksayan bir ay geçirdin.');log(safeText(r.name)+' görevinde bu ay işler istediğin gibi gitmedi.');}
},'Görevin üzerinde çalıştın.');}
function retireRole(){performAction({kind:'retire'},()=>{const cur=currentCareer();if(cur){cur.profile.history.push({year:s.year+s.age,retired:true});s.retiredRole=s.role;}s.role=null;apply({health:2,happiness:2});},'Ağır görevini bıraktın.');}
function buyAsset(id){performAction({kind:'asset',id},()=>{const a=D.assets.find(x=>x.id===id);s.wealth-=a.cost;s.assets.push(id);apply({happiness:3});},'Alım ve takasla bir ay geçti.');}
function sellAsset(id){performAction({kind:'asset',id,sell:true},()=>{const a=D.assets.find(x=>x.id===id);s.assets=s.assets.filter(x=>x!==id);s.wealth+=Math.floor(a.cost*.6);},'Varlığını takas ettin.');}
function manageVenture(id){performAction({kind:'venture',id},()=>{skillGain(id==='forge'?'craft':'trade',2);apply({wealth:id==='caravan'?(Math.random()<.25?-rng(3,8):rng(3,10)):rng(1,5)});},'Malına ve üretime bir ay ayırdın.');}
function interactNPC(group,index,id){
 performAction({kind:'npc',group,index,id},()=>{
  const n=getFamilyGroup(group)[index];if(!n)return;normalizeNPC(n,n.type);n.lastInteractionYear=s.year+s.age;
  const has=t=>(n.traits||[]).includes(t);
  if(id==='spend'){adjustNPC(n,{rel:has('sakin')?7:6,trust:4,respect:1},'Birlikte sakin bir zaman geçirdiniz.');apply({happiness:2});}
  if(id==='confide'){
   const risk=has('kuskucu')?.18:.05;
   if(Math.random()<risk){adjustNPC(n,{rel:-4,trust:-5,grudge:has('kinci')?4:1},'Paylaştığın bir söz aranızda huzursuzluk yarattı.');apply({prestige:-1});}
   else adjustNPC(n,{rel:6,trust:has('sadik')?9:7},'Bir sırrını ona emanet ettin.');
  }
  if(id==='help'){s.wealth-=2;adjustNPC(n,{rel:8,trust:has('merhametli')?12:9,respect:5,grudge:-3},'Zor bir işinde ona destek oldun.');}
  if(id==='work'){adjustNPC(n,{rel:4,respect:has('caliskan')?9:6,trust:2},'Bir işi omuz omuza tamamladınız.');apply({skill:1});}
  if(id==='gift'){s.wealth-=3;adjustNPC(n,{rel:has('tutumlu')?7:10,trust:has('comert')?7:4,respect:3,grudge:-2},'Ona bir armağan verdin.');}
  if(id==='advice'){adjustNPC(n,{rel:3,respect:4,trust:2},'Ondan öğüt istedin ve sözünü dinledin.');apply({skill:2});}
  if(id==='reconcile'){
   const drop=has('bagislayici')?28:has('kinci')?10:20;adjustNPC(n,{rel:15,trust:5,grudge:-drop},'Aranızdaki eski meseleyi konuşup çözmeye çalıştınız.');
   if(n.rel>=50&&n.bonds.grudge<=20){s.rivals.splice(index,1);n.type='Dost';s.friends.push(n);rememberNPC(n,'peace','Aranızdaki düşmanlık sona erdi.',5);unlock('reconciled');}
  }
  log(safeText(n.name)+' ile ilişkiniz yeni bir iz bıraktı.');
 },'İlişkilerine bir eylem hakkı ayırdın.');
}
function addSocial(kind){
 performAction({kind},()=>{
  const gender=pick(['male','female']),age=s.age<18?Math.max(5,Math.min(17,s.age+rng(-2,2))):Math.max(18,s.age+rng(-4,4));
  const n=normalizeNPC({name:pick(D.realms[s.realm][gender]),gender,age,alive:true,type:kind==='friend'?'Dost':'Rakip',rel:kind==='friend'?rng(58,72):rng(18,32)});
  if(kind==='friend'){adjustNPC(n,{trust:10,respect:4},'Tanışmanız kısa sürede dostluğa dönüştü.');s.friends.push(n);}
  else{adjustNPC(n,{grudge:25,trust:-15},'Aranızdaki ilk anlaşmazlık düşmanlığa dönüştü.');s.rivals.push(n);}
 },kind==='friend'?'Yeni bir dostluk için çevrene zaman ayırdın.':'Bir anlaşmazlık yeni bir rakip doğurdu.');
}
function addFriend(){addSocial('friend');}
function makeRival(){addSocial('rival');}
function meetPartner(){performAction({kind:'meet'},()=>{const g=s.gender==='male'?'female':'male';s.partner=normalizeNPC({name:pick(D.realms[s.realm][g]),gender:g,age:s.age<18?s.age:Math.max(18,s.age+rng(-4,4)),alive:true,rel:rng(52,68),type:'Eş adayı'});adjustNPC(s.partner,{trust:5,respect:4},'Ailelerin aracılığıyla ilk kez uzun uzun görüştünüz.');s.married=false;log(safeText(s.partner.name)+' ile ailelerin aracılığıyla tanıştın.');},'Aileler arası görüşmelere bir eylem hakkı ayırdın.');}
function marry(){performAction({kind:'marry'},()=>{
 const n=s.partner;normalizeNPC(n,n.type);const b=normalizeBonds(n),familyMind=(n.goal==='family'?0.1:0),proud=n.traits.includes('gururlu')?(s.prestige>=n.prestige?0.06:-0.08):0;
 const chance=Math.max(.2,Math.min(.96,.42+n.rel/250+b.trust/300-b.grudge/250+familyMind+proud));
 if(Math.random()<chance){s.married=true;n.type='Eş';adjustNPC(n,{rel:8,trust:10,respect:5,grudge:-8},'Birlikte ocak kurmaya söz verdiniz.');unlock('family');apply({prestige:3});log(safeText(n.name)+' ile ocak kurdun.','good');}
 else{adjustNPC(n,{rel:-4,trust:-3,grudge:n.traits.includes('kinci')?5:2},'Ocak kurma görüşmesi sonuçsuz kaldı.');log('Bu kez ocak kurma konusunda uzlaşamadınız.');}
},'Ocak kurma görüşmelerine bir eylem hakkı ayırdın.');}
function militaryCall(){if(s.age<18||s.captive||s.exile||s.military.called||s.military.active||s.pendingEventId||s.pendingDecision)return;s.military.called=true;s.pendingDecision={id:'campaign_call',age:s.age,year:s.year+s.age,month:currentMonth()};activateLifeTab();renderEventBoard();save();}
function chooseDecision(i){if(!s?.alive||s.pendingDecision?.id!=='campaign_call'||![0,1].includes(i)||s.age<18)return;if(i===0&&(s.health<40||s.captive||s.exile)){notice('Özgürlük ve en az 40 sağlık gerekiyor.');return;}if(i===0){s.military.served=true;s.military.active=true;s.military.dutyMonths=rng(4,8);s.military.campaigns++;generateComrades();s.path='military';apply({prestige:4});unlock('military');log('Sefer birliğine katıldın.','major');}else{s.flags.military_declined=true;log('Bu çağrıda obada kaldın.');}s.pendingDecision=null;render();save();}
function militaryTrain(id){performAction({kind:'military',id},()=>{skillGain({horse:'riding',bow:'archery',drill:'combat',watch:'combat'}[id],3);apply({skill:1,prestige:1});},'Birlik talimine bir ay ayırdın.');}
function desertCampaign(){performAction({kind:'desert'},()=>{s.military.active=false;s.military.dutyMonths=0;apply({prestige:-18,happiness:-4});if(Math.random()<.35)s.exile=true;log('Birliği izinsiz terk ettin.','bad');},'Ayrılmanın sonuçlarıyla bir ay geçti.');}
function campaignResult(){s.military.active=false;s.military.dutyMonths=0;const roll=Math.random();if(roll<.12){s.captive=true;resolveComradeCampaignOutcome('captured');unlock('captive');log('Seferde tutsak düştün.','bad');}else if(roll<.32){s.military.wounds++;resolveComradeCampaignOutcome('wounded');apply({health:-rng(8,18),prestige:4});acquireAilment('injury');}else{resolveComradeCampaignOutcome('success');apply({wealth:rng(4,12),prestige:rng(4,8)});s.flags.recent_campaign=true;log('Seferden ganimet ve tecrübeyle döndün.','good');}}
function captivityMonth(){performAction({kind:'captivity'},()=>{apply({health:-rng(0,2),happiness:-rng(1,2)});if(s.age>=12&&Math.random()<.06+s.skill/600){s.captive=false;unlock('free');}else if(Math.random()<.05&&s.wealth>=10){s.wealth-=10;s.captive=false;unlock('free');log('Yakınlarının fidye girişimiyle serbest kaldın.');}},'Tutsaklıkta bir ay geçti.');}
function attemptEscape(){performAction({kind:'escape'},()=>{if(Math.random()<.18+s.skill/350){s.captive=false;unlock('free');log('Tutsaklıktan kurtuldun.','major');}else apply({health:-5,happiness:-4});},'Kaçış girişimiyle bir ay geçti.');}
function commitCrime(id){const c=D.crimes.find(x=>x.id===id);if(!c)return;performAction({kind:'crime',id},()=>{let result;if(Math.random()<c.risk){apply({prestige:c.prestige});const r=Math.random();if(r<.35){const fine=rng(4,12);apply({wealth:-fine});result=fine+' servet tazminata hükmedildi.';}else if(r<.68){s.exile=true;s.place=pick(D.realms[s.realm].places);result='Obadan sürgün edildin.';}else{s.captive=true;unlock('captive');result='Gözetim altında tutsak edildin.';}}else{const gain=rng(...c.gain);s.wealth+=gain;result=gain+' servet kazandın; yakalanmadın.';}s.crimeRecord.push({name:c.name,result,age:s.age,month:currentMonth()});log(result,'bad');},'Töre dışı girişimin sonuçlarıyla bir ay geçti.');}
function familyTick(){
 const cfg=D.realms[s.realm],year=s.year+s.age,seen=new Set(),closeIds=new Set([...s.parents,...s.siblings,...s.children,s.partner].filter(Boolean).map(n=>n.id));
 for(const n of allNPCs()){
  normalizeNPC(n,n.type);if(!n.alive||seen.has(n.id))continue;seen.add(n.id);
  const oldAge=n.age;n.age=n.birthYear!=null?Math.max(0,year-n.birthYear-(n.birthMonth>1?1:0)):n.age+1;
  if([8,12,18].includes(n.age)&&n.age!==oldAge){const oldRole=n.role;n.role=npcCareerFor(n);n.roleHistory.push({year,role:n.role});rememberNPC(n,'milestone',n.age+' yaşında '+n.role+' yoluna girdi.',2);if(closeIds.has(n.id)&&oldRole!==n.role)log(safeText(n.name)+' artık '+safeText(n.role)+'.');}
  normalizeBonds(n);
  const away=n.lastInteractionYear==null?0:year-n.lastInteractionYear;
  if(away>=3&&!['Ana','Ata','Çocuk'].includes(n.type)){n.rel=clamp(n.rel-(n.traits.includes('sadik')?0:1));n.bonds.trust=clamp(n.bonds.trust-1);}
  const grudgeDrop=n.traits.includes('bagislayici')?4:n.traits.includes('kinci')?0:2;n.bonds.grudge=clamp(n.bonds.grudge-grudgeDrop);
  if(n.bonds.grudge>55)n.rel=clamp(n.rel-2);if(n.bonds.trust>78&&n.rel<75)n.rel=clamp(n.rel+1);
  if(n.goal==='wealth')n.wealth+=rng(0,3);if(n.goal==='prestige')n.prestige=clamp(n.prestige+rng(0,2));if(n.goal==='mastery')n.skills.mastery=clamp((n.skills.mastery||0)+rng(1,3));
  if(n.age>=18&&Math.random()<(n.traits.includes('hirsli')?.22:.07)){const old=n.role,next=npcCareerFor(n);if(old!==next){n.role=next;n.roleHistory.push({year,role:n.role});rememberNPC(n,'career','Görevini değiştirip '+n.role+' oldu.',2);if(closeIds.has(n.id))log(safeText(n.name)+' artık '+safeText(n.role)+'.','good');}}
  if(n.partner){
   n.partner.age=(n.partner.age??Math.max(18,n.age-1))+1;
   if(n.partner.alive!==false&&Math.random()<npcDeathRisk(n.partner)){n.partner.alive=false;rememberNPC(n,'loss','Eşini kaybetti.',5);if(closeIds.has(n.id))log(safeText(n.name)+' eşini kaybetti.','bad');}
  }
  if(n!==s.partner&&n.age>=18&&!n.partner&&Math.random()<(n.goal==='family'?.11:.055)){
   const pg=n.gender==='male'?'female':'male',pa=Math.max(18,n.age+rng(-4,4));n.partner=normalizeNPC({id:npcId(),gender:pg,name:pick(cfg[pg]),age:pa,birthYear:year-pa,alive:true,health:rng(60,95),type:'Eş',rel:rng(55,75)},'Eş');
   rememberNPC(n,'family',n.partner.name+' ile ocak kurdu.',4);if(closeIds.has(n.id))log(safeText(n.name)+' '+safeText(n.partner.name)+' ile ocak kurdu.','good');
  }
  const fertile=n.partner?.alive&&n.age>=18&&n.partner.age>=18&&(n.gender==='female'?n.age:n.partner.age)<45;
  if(n!==s.partner&&fertile&&Math.random()<(n.goal==='family'?.075:.035)){
   const g=pick(['male','female']),child=normalizeNPC({name:pick(cfg[g]),gender:g,age:0,type:'Çocuk',alive:true,birthYear:year,birthMonth:1,parentIds:[n.id,n.partner.id],rel:rng(65,85)},'Çocuk');
   n.descendants.push(child);n.children++;rememberNPC(n,'family',child.name+' dünyaya geldi.',5);if(closeIds.has(n.id))log(safeText(n.name)+' ailesine '+safeText(child.name)+' katıldı.','major');
  }
  if(n.age>45)n.health=clamp(n.health-rng(0,2));
  if(Math.random()<npcDeathRisk(n)){n.alive=false;rememberNPC(n,'death','Yaşamı sona erdi.',10);log(safeText(n.name)+' yaşamını yitirdi.','bad');if(n===s.partner){s.married=false;s.pregnancy=null;}}
 }
 tickNPCSocialNetwork(year);
 stateYearTick();
 if(canHaveChild()&&Math.random()<.18){s.pregnancy={remaining:9};log('Ocağınızda bir çocuk bekleniyor.','major');}
}
function ageUp(){if(!s?.alive)return;if(s.pendingEventId||s.pendingDecision){notice('Önce son karar kartını çöz.');return;}if(s.monthsRemaining>0){notice('Yeni yıla geçmeden önce kalan haklar atlanmalı.');return;}s.age++;s.monthsRemaining=12;s.lastAction=null;if(s.age>40)apply({health:-rng(0,2)});familyTick();checkAchievements();mortality();if(s.alive){log(animalYearName(s.year+s.age)+' Yılı başladı; bu yıl 12 eylem hakkın var.','major');if(s.age>=18&&!s.captive&&!s.exile&&!s.military.called)militaryCall();else if(s.age>=18&&!s.captive&&!s.exile&&!s.military.active&&s.military.served&&Math.random()<.08){s.military.called=false;militaryCall();}}render();save();}
function die(){if(!s?.alive)return;s.alive=false;s.pendingEventId=null;s.pendingDecision=null;s.pendingEventContext=null;clearTransient();log(`${s.age} yaşında, ${s.year+s.age} yılında yaşamın sona erdi.`,'bad');s.legacy.past.push({name:s.name,age:s.age,role:s.role,prestige:s.prestige,wealth:s.wealth});render();save();showHeirModal();}
function setWill(id){if(id!=='equal'&&!s.children.some(x=>x.id===id&&x.alive))return;performAction({kind:'will'},()=>{s.will=id;},'Mal paylaşımı isteğini yakınlarınla konuştun.');}
function continueAsHeir(i){
 if(!s||s.alive)return;const heirs=s.children.filter(x=>x.alive),c=heirs[i];if(!c)return;const old=s,equal=old.will==='equal'||!heirs.some(x=>x.id===old.will);clearTransient();
 s=newCharacter({name:c.name,gender:c.gender,realm:old.realm,year:old.year+old.age-c.age,place:c.place||old.place,tribe:c.tribe||old.tribe,age:c.age,monthsRemaining:old.monthsRemaining,wealth:equal?Math.floor(old.wealth/heirs.length):old.will===c.id?old.wealth:0,health:c.health,happiness:65,skill:Math.min(60,c.age*2),skills:c.skills||{},prestige:clamp(old.prestige*.35),achievements:[...old.achievements],legacy:{generation:old.legacy.generation+1,familyName:old.legacy.familyName,past:old.legacy.past}});
 s.id=c.id;
 s.parents=[normalizeNPC({id:old.id,name:old.name,age:old.age,gender:old.gender,alive:false,rel:c.rel,type:old.gender==='male'?'Ata':'Ana',role:old.role})];if(old.partner)s.parents.push({...old.partner,type:old.partner.gender==='female'?'Ana':'Ata'});
 s.siblings=old.children.filter(n=>n.id!==c.id).map(n=>({...n,type:n.gender==='male'?'Erkek kardeş':'Kız kardeş'}));s.children=(c.descendants||[]).map(n=>({...n,type:'Çocuk'}));
 const inheritedKin=[...old.parents.map(n=>({...n,type:n.gender==='male'?'Dede':'Nine'})),...old.siblings.map(n=>({...n,type:n.gender==='male'?'Amca / Dayı':'Hala / Teyze'})),...(old.relatives||[]).filter(n=>!old.parents.some(p=>p.id===n.id))];
 s.relatives=inheritedKin.filter((n,i,a)=>n&&a.findIndex(x=>x.id===n.id)===i).map(n=>normalizeNPC(n,n.type));
 if(c.partner?.alive){s.partner=normalizeNPC({...c.partner,rel:65,type:'Eş'});s.married=c.age>=18&&s.partner.age>=18;}
 const friendPool=[...(old.friends||[]),...(old.military?.comrades||[]).filter(n=>n.alive&&(n.rel||0)>=70)],seenFriend=new Set();
 s.friends=friendPool.filter(n=>n.alive&&!seenFriend.has(n.id)&&seenFriend.add(n.id)).map(n=>{const x=normalizeNPC({...n,type:'Aile dostu',rel:clamp(Math.round((n.rel||60)*.65))},'Aile dostu');x.statusFlags.familyFriend=true;x.statusFlags.legacySource=old.name;normalizeBonds(x);x.bonds.trust=clamp(Math.round(x.bonds.trust*.75));rememberNPC(x,'legacy',old.name+' ile olan eski dostluğunu sürdürüyor.',5);return x;});
 const seenEnemy=new Set();s.rivals=(old.rivals||[]).filter(n=>n.alive&&!seenEnemy.has(n.id)&&seenEnemy.add(n.id)).map(n=>{const x=normalizeNPC({...n,type:'Aile hasmı',rel:Math.min(40,n.rel??30)},'Aile hasmı');x.statusFlags.familyEnemy=true;x.statusFlags.legacySource=old.name;normalizeBonds(x);x.bonds.grudge=clamp(Math.max(25,Math.round(x.bonds.grudge*.8)));rememberNPC(x,'legacy',old.name+' ile yaşanan eski husumeti hatırlıyor.',6);return x;});
 s.socialLinks=(old.socialLinks||[]).map(x=>({...x,tags:[...(x.tags||[]),'legacy']}));
 s.assets=equal?old.assets.filter((_,j)=>j%heirs.length===i):old.will===c.id?[...old.assets]:[];s=migrateState(s);
 const veteran=(old.military?.comrades||[]).filter(n=>n.alive&&(n.rel||0)>=70).sort((a,b)=>((b.bonds?.trust||0)+(b.rel||0))-((a.bonds?.trust||0)+(a.rel||0)))[0];
 const inheritedVeteran=veteran?s.friends.find(n=>n.id===veteran.id):null;
 if(inheritedVeteran)scheduleDelayedEvent({id:'legacy_comrade_visit',years:[1,4],payload:{detail:old.name+' ile yıllar önce omuz omuza savaşmıştı.'}},{targetId:inheritedVeteran.id,sourceEventId:'heir_succession'});
 unlock('heir');log(safeText(old.name)+' ardından soyun '+safeText(s.name)+' ile devam ediyor.','major');$('heirModal').classList.remove('show');activateLifeTab();render();save();
}
function eventRequirementOK(ev){
 const check=r=>{if(!r)return true;if(Array.isArray(r))return r.every(check);if(r.startsWith('flag:'))return !!s.flags[r.slice(5)];if(r.startsWith('notflag:'))return !s.flags[r.slice(8)];if(r.startsWith('asset:'))return s.assets.includes(r.slice(6));if(r.startsWith('career:'))return !careerIssue(D.careers.find(x=>x.id===r.slice(7)));if(r.startsWith('role:'))return D.careers.find(x=>x.id===r.slice(5))?.name===s.role;let cm=r.match(/^careermonths:([^:]+):(\d+)$/);if(cm)return careerProfile(cm[1]).months>=+cm[2];let cr=r.match(/^careerrep:([^:]+):(\d+)$/);if(cr)return careerProfile(cr[1]).reputation>=+cr[2];let st=r.match(/^state(influence|trust|support|rival):(\d+)$/);if(st){const q=ensureStateCourt(),k={influence:'influence',trust:'councilTrust',support:'tribeSupport',rival:'rivalPressure'}[st[1]];return q[k]>=+st[2];}const num=r.match(/^(skill|wealth|prestige)(\d+)$/);if(num)return s[num[1]]>=+num[2];
 const map={single:()=>!s.partner?.alive&&!s.married,married:()=>s.age>=18&&s.married&&s.partner?.alive&&s.partner.age>=18,hasChild:()=>s.children.some(x=>x.alive),hasAdultChild:()=>s.children.some(x=>x.alive&&x.age>=18),trainableChild:()=>s.children.some(x=>x.alive&&x.age>=7&&x.age<18),hasGrandchild:()=>s.children.some(x=>x.alive&&x.children>0),hasFriend:()=>s.friends.some(x=>x.alive),hasRival:()=>s.rivals.some(x=>x.alive),hasFamilyFriend:()=>s.friends.some(x=>x.alive&&x.statusFlags?.familyFriend),hasFamilyEnemy:()=>s.rivals.some(x=>x.alive&&x.statusFlags?.familyEnemy),hasRivalKinLink:()=>rivalKinPairs().length>0,hasCloseKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].some(x=>x.alive),hasTrustedPerson:()=>allNPCs().some(x=>x.alive&&(x.bonds?.trust||0)>=55),hasComrade:()=>s.military.comrades.some(x=>x.alive),hasTrustedComrade:()=>s.military.comrades.some(x=>x.alive&&((x.bonds?.trust||0)>=60||(x.rel||0)>=72)),military:()=>s.age>=18&&s.military.served,activeCampaign:()=>s.age>=18&&s.military.active,recentCampaign:()=>!!s.flags.recent_campaign,captive:()=>s.captive,exile:()=>s.exile};return map[r]?!!map[r]():false;};return check(ev.req);
}
function eventChoiceIssue(ch){const x=ch[1]||{};if(x.wealth<0&&s.wealth<-x.wealth)return `${-x.wealth} servet gerekiyor`;if(x.setRole)return careerIssue(D.careers.find(r=>r.name===x.setRole));return '';}
function eventTargetCandidates(target){
 const pools={
  child:()=>s.children.filter(n=>n.alive),trainingChild:()=>s.children.filter(n=>n.alive&&n.age>=7&&n.age<18),friend:()=>s.friends.filter(n=>n.alive),
  rival:()=>s.rivals.filter(n=>n.alive),partner:()=>s.partner?.alive?[s.partner]:[],comrade:()=>s.military.comrades.filter(n=>n.alive),trustedComrade:()=>s.military.comrades.filter(n=>n.alive&&((n.bonds?.trust||0)>=60||(n.rel||0)>=72)),
  smithMaster:()=>{const n=careerContact('smith');return n?[n]:[]},scribeMaster:()=>{const n=careerContact('scribe');return n?[n]:[]},caravanMaster:()=>{const n=careerContact('caravan');return n?[n]:[]},bardMaster:()=>{const n=careerContact('bard');return n?[n]:[]},merchantContact:()=>{const n=careerContact('merchant');return n?[n]:[]},
  statePatron:()=>{const n=stateContact('patron');return n?[n]:[]},stateRival:()=>{const n=stateContact('rival');return n?[n]:[]},stateElder:()=>{const n=stateContact('elder');return n?[n]:[]},familyFriend:()=>s.friends.filter(n=>n.alive&&n.statusFlags?.familyFriend),familyEnemy:()=>s.rivals.filter(n=>n.alive&&n.statusFlags?.familyEnemy),
  parent:()=>s.parents.filter(n=>n.alive),sibling:()=>s.siblings.filter(n=>n.alive),relative:()=> (s.relatives||[]).filter(n=>n.alive),
  closeKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].filter(n=>n.alive),trusted:()=>allNPCs().filter(n=>n.alive&&(n.bonds?.trust||0)>=55)
 };
 return target&&pools[target]?pools[target]():[];
}
function eventTargetSelections(target,eventId=''){
 const due=dueDelayedRecord(eventId);if(due){const dt=due.targetId?npcById(due.targetId):null,ot=due.otherTargetId?npcById(due.otherTargetId):null;if(due.targetId&&!dt?.alive)return [];if(due.otherTargetId&&!ot?.alive)return [];return [{target:dt,other:ot,delayed:due}];}
 if(target==='rivalAllyPair')return rivalKinPairs().map(x=>({target:x.target,other:x.other}));
 if(target==='statePair'){const {patron,rival}=ensureStateCircle();return patron?.alive&&rival?.alive?[{target:patron,other:rival}]:[];}
 const meta=arcEventMeta(eventId);ensureStoryArcs();const st=meta?s.storyArcs[meta.id]:null;
 if(st?.status==='active'&&st.participantIds?.length){const locked=st.participantIds.map(npcById).find(n=>n?.alive);return locked?[{target:locked,other:null}]:[];}
 return eventTargetCandidates(target).map(n=>({target:n,other:null}));
}
function eventHasTarget(e){return !e.target||eventTargetSelections(e.target,e.id).length>0;}
function eligibleContextEvents(context=s.lastAction||{}){return EVENT_DECK.filter(e=>{
 if(s.age<e.min||s.age>e.max||e.once&&s.eventHistory.includes(e.id)||!e.fallback&&(s.eventCooldowns[e.id]||0)>0)return false;
 if(e.months&&!e.months.includes(context.month||currentMonth())||e.actions&&!e.actions.includes(context.kind))return false;
 if(s.captive&&e.cat!=='Tutsaklık'||!s.captive&&e.cat==='Tutsaklık')return false;
 if(s.military.active&&!['Sefer','Sağlık'].includes(e.cat)||!s.military.active&&e.cat==='Sefer'&&e.id!=='spoils_choice')return false;
 if(s.exile&&['Boy','Devlet','Ocak'].includes(e.cat)||!s.exile&&e.cat==='Sürgün')return false;
 return delayedEventReady(e)&&storyArcEventAllowed(e)&&eventRequirementOK(e)&&eventHasTarget(e)&&e.choices.some(ch=>!eventChoiceIssue(ch));
 });}
function triggerContextEvent(force=false,context=s.lastAction||{}){
 if(!s?.alive||s.pendingEventId||s.pendingDecision)return false;const eligible=eligibleContextEvents(context);let pool=eligible.filter(e=>!e.fallback);if(!pool.length){pool=eligible.filter(e=>e.fallback);if(s.exile&&!s.captive&&!s.military.active)pool=pool.filter(e=>e.cat==='Sürgün');}if(!pool.length)return false;
 const ev=weightedPickEvents(pool),sels=eventTargetSelections(ev.target,ev.id),sel=sels.length?pick(sels):{target:null,other:null,delayed:null},target=sel.target,other=sel.other,delayed=sel.delayed||null;
 s.pendingEventId=ev.id;s.pendingEventContext={age:s.age,year:s.year+s.age,month:context.month||currentMonth(),kind:context.kind||'wait',targetId:target?.id||null,otherTargetId:other?.id||null,delayedId:delayed?.id||null,delayedPayload:delayed?.payload||null};s.decisionOffset=0;activateLifeTab();return true;
}
function hasDirectAgency(e){return s.age>=5&&e.agency!=='guardian';}
function applyEventChoice(x={}){
 apply(Object.fromEntries(Object.entries(x).filter(([k])=>['health','happiness','skill','prestige','wealth'].includes(k))));
 for(const k of Array.isArray(x.setFlag)?x.setFlag:[x.setFlag])if(k)s.flags[k]=true;for(const k of [x.clearFlag,x.clearFlag2])if(k)delete s.flags[k];
 if(x.path)s.path=x.path;for(const k of Object.keys(s.skills))if(x[k])skillGain(k,x[k]);
 if(x.setRole){const r=D.careers.find(r=>r.name===x.setRole);if(r&&!careerIssue(r)){s.role=r.name;s.path=r.path;careerProfile(r.id);}}
 if(x.career){const p=careerProfile(x.career.id);p.reputation=clamp(p.reputation+(x.career.reputation||0));p.mastery=clamp(p.mastery+(x.career.mastery||0));p.orders=Math.max(0,p.orders+(x.career.orders||0));p.failures=Math.max(0,p.failures+(x.career.failures||0));if(x.career.earnings){p.earnings=Math.max(0,p.earnings+x.career.earnings);s.wealth=Math.max(0,s.wealth+x.career.earnings);}}
 if(x.state)adjustStateCourt(x.state,x.stateMemory||'Boy meclisinde verdiğin karar yeni bir iz bıraktı.');
 if(x.asset&&!s.assets.includes(x.asset))s.assets.push(x.asset);if(x.wound){s.military.wounds+=x.wound;acquireAilment('injury');}if(x.clearExile)s.exile=false;
}
function chooseContextEvent(i){
 const ev=activeContextEvent();if(!ev||!s.alive)return;const ch=ev.choices[i];if(!ch)return;const issue=eventChoiceIssue(ch);if(issue){notice(issue);return;}
 const context=s.pendingEventContext||{age:s.age,year:s.year+s.age,month:currentMonth()},target=allNPCs().find(n=>n.id===context.targetId),other=allNPCs().find(n=>n.id===context.otherTargetId),fx=ch[1]||{};applyEventChoice(fx);
 if(target?.alive&&(fx.targetRel||fx.targetTrust||fx.targetRespect||fx.targetFear||fx.targetGrudge))adjustNPC(target,{rel:fx.targetRel||0,trust:fx.targetTrust||0,respect:fx.targetRespect||0,fear:fx.targetFear||0,grudge:fx.targetGrudge||0},eventDisplayText(ev,context)+' — '+ch[0]);
 if(other?.alive&&(fx.otherRel||fx.otherTrust||fx.otherRespect||fx.otherFear||fx.otherGrudge))adjustNPC(other,{rel:fx.otherRel||0,trust:fx.otherTrust||0,respect:fx.otherRespect||0,fear:fx.otherFear||0,grudge:fx.otherGrudge||0},eventDisplayText(ev,context)+' — '+ch[0]);
 if(target?.alive&&other?.alive&&(fx.linkScore||fx.linkTrust||fx.linkGrudge))adjustSocialLink(target,other,{score:fx.linkScore||0,trust:fx.linkTrust||0,grudge:fx.linkGrudge||0},eventDisplayText(ev,context)+' — '+ch[0]);
 if(target?.alive&&fx.targetState){target.statusFlags=target.statusFlags||{};target.statusFlags[fx.targetState.key]=fx.targetState.value;}
 if(target?.alive&&fx.targetPrestige)target.prestige=clamp((target.prestige||0)+fx.targetPrestige);
 if(target?.alive&&fx.targetWealth)target.wealth=Math.max(0,(target.wealth||0)+fx.targetWealth);
 if(target?.alive&&fx.targetGoal)target.goal=fx.targetGoal;
 if(target?.alive&&fx.promoteTarget==='military_leader')promoteMilitaryComrade(target);
 if(target?.alive&&fx.makeTargetFriend)makeTargetFriend(target,'Eski sefer yoldaşı');
 if(target?.alive&&fx.makeTargetRival)makeTargetRival(target,'Eski sefer yoldaşı / Hasım');
 if(target?.alive){if(ev.id==='child_ill')target.health=clamp(target.health+(i===0?4:7));if(ev.id==='friend_quarrel')target.rel=clamp(target.rel+(i===0?6:-6));if(ev.id==='child_training_choice'){target.skills=target.skills||{};const k=i===0?'archery':i===1?'craft':'speech';target.skills[k]=clamp((target.skills[k]||0)+3);}if(ev.id==='child_path_consequence')applyChildPathConsequence(target,context,i);}
 if(target?.alive&&fx.resolveRival){const ri=s.rivals.findIndex(n=>n.id===target.id);if(ri>=0){s.rivals.splice(ri,1);target.type='Dost';if(!s.friends.some(n=>n.id===target.id))s.friends.push(target);rememberNPC(target,'peace','Uzun süren husumet sona erdi.',7);unlock('reconciled');}}
 for(const spec of [...(Array.isArray(fx.scheduleEvents)?fx.scheduleEvents:[]),...(fx.scheduleEvent?[fx.scheduleEvent]:[])])scheduleDelayedEvent(spec,{...context,sourceEventId:ev.id});
 resolveDelayedRecord(context.delayedId);
 if(ev.once&&!s.eventHistory.includes(ev.id))s.eventHistory.push(ev.id);if(!ev.fallback)s.eventCooldowns[ev.id]=ev.cool||12;
 s.eventArchive.push({id:ev.id,cat:ev.cat,...context,choice:i,actor:hasDirectAgency(ev)?'self':'guardian'});s.eventArchive=s.eventArchive.slice(-300);recordStoryArcChoice(ev.id,i,ch[0],context,false);log(`<b>${ev.cat}:</b> ${safeText(eventDisplayText(ev,context))} <i>${hasDirectAgency(ev)?'':'Ailen/bakıcıların: '}${safeText(ch[0])}</i>`);
 s.pendingEventId=null;s.pendingEventContext=null;s.decisionOffset=0;window._contextEvent=null;checkAchievements();if(s.health<=0)die();render();save();
}
function eventDisplayText(e,ctx){const target=allNPCs().find(n=>n.id===ctx?.targetId),other=allNPCs().find(n=>n.id===ctx?.otherTargetId);return String(e?.text||'').replaceAll('{name}',target?.name||'Yakının').replaceAll('{other}',other?.name||'yakının').replaceAll('{detail}',delayedDetail(ctx)).replaceAll('{past}',targetPastLabel(target));}
function currentDecisionPayload(){if(!s?.alive)return null;const e=activeContextEvent();if(e)return {kind:'event',cat:e.cat,title:hasDirectAgency(e)?'Hayat Olayı':'Ailenin / Bakıcının Kararı',text:eventDisplayText(e,s.pendingEventContext),choices:e.choices,context:s.pendingEventContext};if(s.pendingDecision?.id==='campaign_call')return {kind:'system',cat:'Sefer',title:'Boydan Haber',text:'Yaklaşan sefer için savaşçılar toplanıyor. Birliğe katılmak birkaç ay sürecek.',choices:[['Birliğe katıl',{prestige:4,combat:2,path:'military'}],['Obada kal',{happiness:1}]],context:s.pendingDecision};return null;}
const CHOICE_STAT_META={
 health:["❤️","Sağlık"],happiness:["☀","Dirlik"],skill:["✦","Beceri"],prestige:["🐺","İtibar"],wealth:["🐎","Servet"],
 riding:["🐎","Binicilik"],archery:["🏹","Okçuluk"],combat:["⚔","Savaş"],craft:["🔨","Zanaat"],literacy:["𐱅","Bitig"],speech:["🪕","Söz"],trade:["🧺","Ticaret"]
};
function choiceImpactItems(choice,more=false){
 if(more)return [{cls:"neutral",label:"⋯ Diğer seçenekleri gör"}];
 const x=choice?.[1]||{},items=[];
 for(const [k,[icon,name]] of Object.entries(CHOICE_STAT_META)){
   const v=x[k];if(typeof v!=="number"||!v)continue;
   items.push({cls:v>0?"pos":"neg",label:`${icon} ${name} ${v>0?"+":""}${v}`});
 }
 if(x.targetRel)items.push({cls:x.targetRel>0?"pos":"neg",label:`🤝 İlişki ${x.targetRel>0?"+":""}${x.targetRel}`});
 if(x.targetTrust)items.push({cls:x.targetTrust>0?"pos":"neg",label:`🔒 Güven ${x.targetTrust>0?"+":""}${x.targetTrust}`});
 if(x.targetRespect)items.push({cls:x.targetRespect>0?"pos":"neg",label:`🐺 Saygı ${x.targetRespect>0?"+":""}${x.targetRespect}`});
 if(x.targetGrudge)items.push({cls:x.targetGrudge>0?"neg":"pos",label:`🔥 Kin ${x.targetGrudge>0?"+":""}${x.targetGrudge}`});
 if(x.otherRel)items.push({cls:x.otherRel>0?"pos":"neg",label:`👥 Yakının ilişki ${x.otherRel>0?"+":""}${x.otherRel}`});
 if(x.otherTrust)items.push({cls:x.otherTrust>0?"pos":"neg",label:`🔒 Yakının güveni ${x.otherTrust>0?"+":""}${x.otherTrust}`});
 if(x.linkScore)items.push({cls:x.linkScore>0?"pos":"neg",label:`🔗 Aralarındaki bağ ${x.linkScore>0?"+":""}${x.linkScore}`});
 if(x.resolveRival)items.push({cls:"pos",label:"🤝 Husumet sona erebilir"});
 for(const spec of [...(Array.isArray(x.scheduleEvents)?x.scheduleEvents:[]),...(x.scheduleEvent?[x.scheduleEvent]:[])]){const y=spec.years,txt=Array.isArray(y)?(y[0]+"–"+y[1]+" yıl sonra"):(y+" yıl sonra");items.push({cls:"neutral",label:"⏳ "+txt+" sonuç doğurabilir"});}
 if(x.targetState)items.push({cls:"neutral",label:"🧭 Bu kişinin yolu değişir"});
 if(x.targetPrestige)items.push({cls:x.targetPrestige>0?"pos":"neg",label:`🐺 Onun itibarı ${x.targetPrestige>0?"+":""}${x.targetPrestige}`});
 if(x.career?.reputation)items.push({cls:x.career.reputation>0?"pos":"neg",label:`🏅 Meslek itibarı ${x.career.reputation>0?"+":""}${x.career.reputation}`});
 if(x.career?.mastery)items.push({cls:x.career.mastery>0?"pos":"neg",label:`🛠 Ustalık ${x.career.mastery>0?"+":""}${x.career.mastery}`});
 if(x.career?.orders)items.push({cls:x.career.orders>0?"pos":"neg",label:`📦 İş kaydı ${x.career.orders>0?"+":""}${x.career.orders}`});
 if(x.state?.influence)items.push({cls:x.state.influence>0?"pos":"neg",label:`🏕 Nüfuz ${x.state.influence>0?"+":""}${x.state.influence}`});
 if(x.state?.trust)items.push({cls:x.state.trust>0?"pos":"neg",label:`🤝 Meclis güveni ${x.state.trust>0?"+":""}${x.state.trust}`});
 if(x.state?.support)items.push({cls:x.state.support>0?"pos":"neg",label:`👥 Oba desteği ${x.state.support>0?"+":""}${x.state.support}`});
 if(x.state?.rival)items.push({cls:x.state.rival<0?"pos":"neg",label:`⚖ Rakip baskısı ${x.state.rival>0?"+":""}${x.state.rival}`});
 if(x.promoteTarget)items.push({cls:"pos",label:"🏕 Yoldaşın konum kazanır"});
 if(x.makeTargetFriend)items.push({cls:"pos",label:"🤝 Eski yoldaş dost olur"});
 if(x.makeTargetRival)items.push({cls:"neg",label:"⚔ Eski yoldaş hasım olur"});
 if(x.wound)items.push({cls:"neg",label:`🩸 Yara +${x.wound}`});
 if(x.clearExile)items.push({cls:"pos",label:"↩ Sürgün sona erer"});
 if(x.setRole)items.push({cls:"neutral",label:`🏕 Görev: ${x.setRole}`});
 if(x.asset)items.push({cls:"pos",label:"🎒 Yeni varlık"});
 if(x.path)items.push({cls:"neutral",label:"🧭 Yeni yaşam yolu"});
 if(!items.length)items.push({cls:"neutral",label:"Sonuç olaydan sonra belli olacak"});
 return items;
}
function impactHtml(choice,more=false){
 return choiceImpactItems(choice,more).map(x=>`<span class="impact ${x.cls}">${safeText(x.label)}</span>`).join("");
}
function renderEventBoard(){
 const board=$('eventBoard'),p=currentDecisionPayload();if(!p){board.innerHTML='';return;}
 const offset=s.decisionOffset||0,more=offset+2<p.choices.length,l=p.choices[offset],r=more?['Diğer seçenekler',{}]:p.choices[offset+1],ctx=p.context||{age:s.age,year:s.year+s.age,month:currentMonth()};
 const issue=i=>p.kind==='event'?eventChoiceIssue(p.choices[i]):i===0&&(s.health<40||s.captive||s.exile)?'Özgürlük ve 40 sağlık gerekiyor':'';
 const li=issue(offset),ri=more?'':issue(offset+1),target=allNPCs().find(n=>n.id===ctx.targetId);
 board.innerHTML=`<div class="decisionOverlay" id="decisionOverlay">
   <div class="decisionStage">
     <button class="decisionSide left" id="decisionLeft" ${li?'disabled':''} onclick="animateSwipeOut(0)">
       <span class="decisionDirection">←</span>
       <span class="decisionChoice">${safeText(l[0])}</span>
       ${li?`<span class="decisionIssue">${safeText(li)}</span>`:''}
       <span class="impactList">${impactHtml(l,false)}</span>
     </button>
     <div class="swipeCard" id="swipeCard" tabindex="0" aria-label="${safeText(p.title)}">
       <div class="swipeLeftStamp" id="swipeLeftStamp">← ${safeText(l[0])}</div>
       <div class="swipeRightStamp" id="swipeRightStamp">${safeText(r[0])} →</div>
       <div class="swipeTop"><div class="swipeTitle">${safeText(p.title)}</div><span class="swipeBadge">${safeText(p.cat)}</span></div>
       <div class="swipeMeta">${ctx.age} yaş • ${animalYearName(ctx.year)} Yılı • ${ctx.month}. Ay${target?' • '+safeText(target.name):''}</div>
       <div class="swipeText">${safeText(p.text)}</div>
       <div class="swipeInstruction">Kartı sola veya sağa sürükle</div>
     </div>
     <button class="decisionSide right" id="decisionRight" ${ri?'disabled':''} onclick="animateSwipeOut(1)">
       <span class="decisionDirection">→</span>
       <span class="decisionChoice">${safeText(r[0])}</span>
       ${ri?`<span class="decisionIssue">${safeText(ri)}</span>`:''}
       <span class="impactList">${impactHtml(r,more)}</span>
     </button>
     ${offset?`<button class="decisionPager" onclick="s.decisionOffset=0;renderEventBoard();save()">← İlk seçeneklere dön</button>`:''}
     <div class="decisionHint">Sola: ${safeText(l[0])} &nbsp; • &nbsp; Sağa: ${safeText(r[0])}</div>
   </div>
 </div>`;
 setupSwipeCard();
}
function animateSwipeOut(index){
 if(window._swipeBusy||!currentDecisionPayload()||$(index===0?'decisionLeft':'decisionRight')?.disabled)return;const card=$('swipeCard');if(!card)return finishSwipeChoice(index);window._swipeBusy=true;
 const epoch=window._swipeEpoch||0,life=s.id,event=s.pendingEventId,decision=s.pendingDecision?.id,offset=s.decisionOffset||0;
 card.style.transform=`translateX(${index===0?-700:700}px) rotate(${index===0?-25:25}deg)`;card.style.opacity='0';setTimeout(()=>{window._swipeBusy=false;if(epoch!==(window._swipeEpoch||0)||s.id!==life||s.pendingEventId!==event||s.pendingDecision?.id!==decision||(s.decisionOffset||0)!==offset)return;finishSwipeChoice(index);},180);
}
function finishSwipeChoice(index){const p=currentDecisionPayload();if(!p||![0,1].includes(index))return;const offset=s.decisionOffset||0;if(index===1&&offset+2<p.choices.length){s.decisionOffset=offset+1;renderEventBoard();save();return;}if(p.kind==='event')chooseContextEvent(offset+index);else chooseDecision(offset+index);}
function actionButton(label,a,onclick,desc=''){const issue=accessIssue(a);return `<button class="card ${issue?'locked':''}" ${issue?'disabled':''} onclick="${onclick}"><h3>${label}</h3><p>${desc}</p>${issue?`<div class="lockline">${safeText(issue)}</div>`:''}</button>`;}
function trainingCard(id,icon,title,desc){return actionButton(icon+' '+title,{kind:'training',id},`train('${id}')`,desc);}
function renderRole(){
 let html=s.role?careerRoleSummary():'';
 if(s.role)html+=`<div class="grid2">${actionButton('Görevinde çalış',{kind:'work'},'workRole()','Meslek tecrübesi, ustalık ve ün kazan.')}${s.age>=50?actionButton('Ağır görevi bırak',{kind:'retire'},'retireRole()'):''}</div>`;
 html+=stateCourtSummary();
 html+=careerContactsSummary();
 html+=`<h3 class="sectionTitle">Görev Yolları</h3><div class="grid2">${D.careers.map(r=>actionButton(r.name,{kind:'role',id:r.id},`takeRole('${r.id}')`,careerRequirements(r))).join('')}</div>`;
 $('tab-gorev').innerHTML=html;
}
function renderActivities(){const cats=[...new Set(PERIOD_ACTIVITIES.map(x=>x.cat))];$('tab-faaliyet').innerHTML=cats.map(cat=>`<h3 class="sectionTitle">${cat}</h3><div class="grid2">${PERIOD_ACTIVITIES.filter(x=>x.cat===cat).map(a=>actionButton(a.icon+' '+a.name,{kind:'period',id:a.id},`doPeriodActivity('${a.id}')`,a.desc+' • '+a.age+' yaş')).join('')}</div>`).join('');}
function renderAssets(){ $('tab-varlik').innerHTML=`<div class="grid2">${D.assets.filter(a=>!s.assets.includes(a.id)).map(a=>actionButton(a.icon+' '+a.name,{kind:'asset',id:a.id},`buyAsset('${a.id}')`,a.cost+' servet • '+ASSET_AGES[a.id]+' yaş')).join('')}</div><h3>Sahip oldukların</h3><div class="grid2">${s.assets.map(id=>{const a=D.assets.find(x=>x.id===id);return a?actionButton(a.icon+' '+a.name,{kind:'asset',id,sell:true},`sellAsset('${id}')`,'Takas değeri '+Math.floor(a.cost*.6)) :'';}).join('')}</div><h3>Üretim</h3><div class="grid2">${[['herd','Sürüyü yönet'],['forge','Ocakta üret'],['caravan','Kervan payını yönet']].map(([id,n])=>actionButton(n,{kind:'venture',id},`manageVenture('${id}')`)).join('')}</div>`;}
function familyCard(n,group,index){
 normalizeNPC(n,n.type);
 const options=[['spend','Vakit geçir'],...(s.age>=8?[['confide','Dertleş']]:[]),...(s.age>=10?[['help','Yardım et'],['work','Birlikte çalış'],['gift','Armağan']]:[]),['advice','Öğüt al'],...(group==='rivals'?[['reconcile','Uzlaş']]:[])];
 const actions=n.alive&&s.age>=5?options.map(([id,label])=>{const issue=accessIssue({kind:'npc',group,index,id});return `<button class="mini" ${issue?'disabled':''} title="${safeText(issue)}" onclick="interactNPC('${group}',${index},'${id}')">${label}</button>`;}).join(''):'';
 const traits=npcTraitNames(n).map(x=>`<span class="trait">${safeText(x)}</span>`).join('');
 const b=normalizeBonds(n),memory=recentNPCMemory(n),ties=socialConnectionsFor(n,2),tieLine=ties.length?'Bağları: '+ties.map(x=>x.other.name+' ('+socialLinkLabel(x.link)+')').join(' • '):'';
 return `<div class="card familycard"><div><h3>${n.alive?'':'† '}${safeText(n.name)}</h3><p>${safeText(n.type)} • ${n.age} yaş • ${safeText(n.role)}<br>İlişki ${n.rel}${n.partner?' • Eş: '+safeText(n.partner.name):''}${n.children?' • Çocuk: '+n.children:''}</p>
 <div class="traitrow">${traits}</div><div class="npcgoal">Amaç: ${safeText(npcGoalName(n))}</div>
 <div class="rbar"><i style="width:${n.rel}%"></i></div><div class="bondrow"><span class="bond good">Güven ${b.trust}</span><span class="bond">Saygı ${b.respect}</span>${b.grudge?'<span class="bond bad">Kin '+b.grudge+'</span>':''}${b.fear>15?'<span class="bond bad">Çekince '+b.fear+'</span>':''}</div>
 ${memory?`<div class="memoryline">Hatırladığı: ${safeText(memory)}</div>`:''}${tieLine?`<div class="networkline">${safeText(tieLine)}</div>`:''}</div><div class="actions">${actions}</div></div>`;
}
function renderSystems(){
 $('lifeCare').innerHTML=`<h3 class="sectionTitle">${lifeStage(s.age)}</h3><div class="grid2">${s.age<5?actionButton('Aile bakımında bir ay',{kind:'guardian'},'guardianCare()'):actionButton('Dinlen',{kind:'health',id:'rest'},"healthAction('rest')")+actionButton(s.age<12?'Ailenle otacıya git':'Otacı',{kind:'health',id:'healer'},"healthAction('healer')",'2 servet')}</div>${s.ailments.length?'<p class="note">'+s.ailments.map(x=>AILMENTS[x.id].name+' • '+x.remaining+' ay').join('<br>')+'</p>':''}${s.pregnancy?'<p class="note">Doğum bekleniyor • yaklaşık '+s.pregnancy.remaining+' ay.</p>':''}`;
 $('tab-yetisme').insertAdjacentHTML('beforeend','<h3 class="sectionTitle">Yetişme tecrübesi</h3><p class="note">'+Object.entries(s.experience).map(([k,v])=>pathName(k)+': '+v+' ay').join(' • ')+'</p>');
 $('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Ün ve başarımlar</h3><div class="grid2">${D.achievements.map(a=>`<div class="card ${s.achievements.includes(a.id)?'':'locked'}"><h3>${s.achievements.includes(a.id)?'🏆':'🔒'} ${a.name}</h3><p>${a.desc}</p></div>`).join('')}</div>`);
 if(s.age>=18&&s.children.some(x=>x.alive))$('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Mal paylaşımı</h3><p class="note">Şu an: ${s.will==='equal'?'Yaşayan çocuklara eşit':safeText(s.children.find(n=>n.id===s.will)?.name||'Eşit paylaşım')}. Bu paylaşım bir oyun kuralıdır.</p><div class="grid2">${actionButton('Eşit paylaş',{kind:'will'},"setWill('equal')")}${s.children.filter(x=>x.alive).map(n=>actionButton(safeText(n.name),{kind:'will'},`setWill('${n.id}')`)).join('')}</div>`);
}
function migrateState(x){
 if(!x||!D.realms[x.realm]||!Number.isFinite(x.age)||!Number.isFinite(x.year))throw new Error('Geçersiz kayıt');x.version=SAVE_VERSION;x.age=Math.max(0,Math.floor(x.age));x.monthsRemaining=Math.max(0,Math.min(12,Math.floor(x.monthsRemaining??12)));x.alive=x.alive!==false;
 for(const k of ['health','happiness','skill','prestige'])x[k]=clamp(Number.isFinite(x[k])?x[k]:50);x.wealth=Math.max(0,Math.round(Number.isFinite(x.wealth)?x.wealth:0));
 for(const k of ['parents','siblings','relatives','friends','rivals','children','careerContacts','socialLinks','delayedEvents','assets','achievements','eventHistory','eventArchive','crimeRecord','timeline','ailments'])if(!Array.isArray(x[k]))x[k]=[];
 for(const k of ['experience','careerMonths','careerProfiles','eventCooldowns','flags','skills'])x[k]=x[k]||{};x.storyArcs=x.storyArcs&&typeof x.storyArcs==='object'&&!Array.isArray(x.storyArcs)?x.storyArcs:{};x.will=x.will||'equal';x.pregnancy=x.pregnancy||null;x.legacy=x.legacy||{generation:1,familyName:x.tribe,past:[]};x.legacy.past=x.legacy.past||[];s=x;ensureSkills();ensureMilitary();ensureCareerSystems();ensureStateCourt();ensureStoryArcs();ensureDelayedEvents();
 if(x.partner){x.partner.age=x.partner.age??Math.max(16,x.age);x.partner.gender=x.partner.gender||(x.gender==='male'?'female':'male');}
 allNPCs().forEach(n=>normalizeNPC(n,n.type));seedCoreSocialLinks();pruneSocialLinks();if(x.partner&&!x.partner.alive)x.married=false;
 if(x.role){const r=D.careers.find(r=>r.name===x.role);if(r&&x.age<r.age){x.deferredRole=x.role;x.role=null;}}
 if(x.married&&(x.age<18||x.partner?.age<18)){x.deferredMarriage=true;x.married=false;}
 if(x.age<18){x.military.active=false;x.military.dutyMonths=0;x.pregnancy=null;x.pendingDecision=null;}
 if(x.pendingDecision?.id!=='campaign_call')x.pendingDecision=null;x.ailments=x.ailments.filter(a=>AILMENTS[a.id]&&x.age>=AILMENTS[a.id].min);
 if(x.age>=18&&x.military.called&&!x.military.served&&!x.flags.military_declined&&!x.pendingDecision)x.pendingDecision={id:'campaign_call',age:x.age,year:x.year+x.age,month:currentMonth()};
 if(x.pendingEventId){const e=EVENT_DECK.find(e=>e.id===x.pendingEventId),ctx=x.pendingEventContext;
 const targetOk=!e?.target||(ctx?.targetId&&allNPCs().some(n=>n.alive&&n.id===ctx.targetId)),otherOk=e?.target!=='rivalAllyPair'||(ctx?.otherTargetId&&allNPCs().some(n=>n.alive&&n.id===ctx.otherTargetId));
 if(!e||x.age<e.min||x.age>e.max||!eventRequirementOK(e)||!targetOk||!otherOk||!e.choices.some(c=>!eventChoiceIssue(c))){x.pendingEventId=null;x.pendingEventContext=null;}else x.pendingEventContext=x.pendingEventContext||{age:x.age,year:x.year+x.age,month:Math.max(1,currentMonth()-1)};}
 if(!x.alive){x.pendingEventId=null;x.pendingDecision=null;}return x;
}
function save(){if(s)try{localStorage.setItem('yazgi_full_v1',JSON.stringify(s));}catch(e){notice('Kayıt yazılamadı; tarayıcı depolama alanını kontrol et.');}}
function load(){try{const raw=localStorage.getItem('yazgi_full_v1');if(!raw)return;const x=JSON.parse(raw);if(x.version!==SAVE_VERSION&&!localStorage.getItem('yazgi_before_v4'))localStorage.setItem('yazgi_before_v4',raw);clearTransient();s=migrateState(x);$('newModal').classList.remove('show');render();if(s.pendingEventId||s.pendingDecision)activateLifeTab();if(!s.alive)showHeirModal();save();}catch(e){console.error(e);s=null;$('newModal').classList.remove('show');notice('Kayıt okunamadı; mevcut kayıt korunuyor. Yeni yaşam açmadan önce tarayıcı verisini yedekle.');}}
function configureRules(){
 D.assets.push({id:'smithy',name:'Demir Ocağı',icon:'🔥',cost:60});D.achievements.push({id:'trained',name:'Ustanın Emeği',desc:'Bir uzmanlıkta 60 seviyesine ulaş.'},{id:'reconciled',name:'Barış Sözü',desc:'Bir rakiple uzlaş.'});D.achievements.find(x=>x.id==='adult').desc='18 yaşına ulaş.';D.careers.forEach(r=>r.age=CAREER_RULES[r.id].age);
 const adult=new Set(['Sefer','Tutsaklık','Sürgün','Töre','Ocak','Ticaret','Kervan','Devlet','Elçilik','Servet','Sürü']);
 for(const e of EVENT_DECK){
  if(adult.has(e.cat)||['marriage_pressure','family_debt','winter_shortage','summer_drought','wolf_attack','bandit_tracks','feud_challenge','feud_end'].includes(e.id))e.min=Math.max(18,e.min);
  if(e.id==='foal_friend')e.min=5;
  if(e.id==='smith_offer'){e.min=12;e.target='smithMaster';e.text='{name}, ocağın başındaki usta olarak seni birkaç ay yanında görmek istedi.';e.choices[0][1].craft=3;e.choices[0][1].targetRel=5;e.choices[0][1].targetTrust=5;e.choices[0][1].career={id:'smith_apprentice',reputation:3,mastery:2};}
  if(e.id==='scribe_offer'){e.target='scribeMaster';e.text='{name}, yazıya yatkınlığını fark edip seni bitig işlerine çağırdı.';e.choices[0][1].literacy=3;e.choices[0][1].targetRel=5;e.choices[0][1].targetTrust=5;e.choices[0][1].career={id:'scribe',reputation:2,mastery:2};}
  if(e.id==='caravan_invite'){e.target='caravanMaster';e.text='Kervanbaşı {name}, ilk uzun yolculuğuna seni de katmak istiyor.';e.choices[0][1].targetRel=5;e.choices[0][1].targetTrust=4;e.choices[0][1].career={id:'caravan',reputation:2,mastery:2};}
  if(['smith_first_mistake','smith_master_test','smith_own_hearth','smith_state_order'].includes(e.id))e.target='smithMaster';
  if(['scribe_copy','scribe_record_dispute','scribe_envoy_list','envoy_border_talk'].includes(e.id))e.target='scribeMaster';
  if(['caravan_first_crossing','caravan_market','caravan_partner','caravan_master'].includes(e.id))e.target='caravanMaster';
  if(e.id==='smith_master_test'){e.text='{name}, sana gözetimsiz olarak sağlam bir mızrak ucu dövme görevi verdi.';e.choices[0][1].career={id:'smith',reputation:6,mastery:7,orders:1};e.choices[1][0]='Biraz daha çalışıp sonra teslim et';e.choices[1][1].setFlag='smith_journeyman';e.choices[1][1].setRole='Demirci';e.choices[1][1].career={id:'smith',reputation:2,mastery:4,orders:1};}
  if(e.id==='scribe_record_dispute'){e.req=['flag:scribe_student','skill45'];e.choices[0][1].career={id:'scribe',reputation:6,mastery:6,orders:1};e.choices[1][1].setFlag='scribe_clerk';e.choices[1][1].career={id:'scribe',reputation:-2,mastery:3,orders:1};}
  if(e.id==='caravan_first_crossing'){e.req='flag:caravan_member';e.choices[0][1].career={id:'caravan',reputation:5,mastery:5,orders:1};e.choices[1][1].career={id:'caravan',reputation:1,mastery:2};}
  if(e.id==='caravan_market'){e.req='flag:caravan_member';e.choices[1][1].setFlag='trader';e.choices[0][1].career={id:'merchant',reputation:4,mastery:3,orders:1};e.choices[1][1].career={id:'merchant',reputation:2,mastery:2,orders:1};}
  if(e.id==='smith_state_order')e.req=['role:smith','prestige20'];
  if(e.id==='caravan_master')e.req=['flag:caravan_member','prestige20'];
  if(e.id==='bey_request'){
   e.target='statePair';e.text='{name}, boy içindeki bir anlaşmazlık için seni meclis görüşmesine çağırdı. {other} ise sözünün fazla ağırlık kazanmasından hoşnut görünmüyor.';
   e.choices=[
    ['Görüşünü açıkça savun',{prestige:4,speech:2,targetRel:4,targetTrust:5,targetRespect:5,otherRel:-2,otherTrust:-2,state:{influence:6,trust:5,support:2,rival:4},stateMemory:'Mecliste ilk kez açık biçimde söz aldın.'}],
    ['Önce herkesi dinle',{prestige:2,skill:2,targetTrust:4,targetRespect:3,otherRel:1,state:{influence:3,trust:6,support:1,rival:-1},stateMemory:'Mecliste önce tarafları dinlemeyi seçtin.'}]
   ];
  }
  if(e.id==='river_crossing'){e.text='Göç sırasında oba bir ırmağın kıyısında bekliyor. Büyüklerin sana hafif bir iş gösterdi.';e.choices[0][0]='Büyüklerinin yanında yardım et';}if(e.id==='lost_lamb')e.choices[0][0]='Bir büyüğünle izine bak';
  if(e.id==='friend_quarrel'){e.req='hasFriend';e.target='friend';}
  if(e.id==='child_training_choice'){
   e.req='trainableChild';e.target='trainingChild';e.once=true;
   e.text='{name} artık hangi alanda yetişeceğini merak ediyor. Vereceğin yön, yıllar sonra kendi hayatına dönüşecek.';
   e.choices=[
    ['At ve ok öğret',{happiness:3,prestige:2,targetRel:4,targetTrust:3,targetState:{key:'guidance',value:'war'}}],
    ['Bir ustanın yanına gönder',{wealth:-2,skill:2,targetRespect:4,targetState:{key:'guidance',value:'craft'}}],
    ['Kendi yolunu seçsin',{happiness:5,targetRel:5,targetTrust:5,targetState:{key:'guidance',value:'free'}}]
   ];
  }
  if(e.id==='child_ill')e.target='child';if(e.id==='grandchild_visit')e.req='hasGrandchild';
  if(['household_first_winter','spouse_family_request'].includes(e.id))e.target='partner';if(e.id==='household_first_winter'){e.choices[0][1].setFlag='household_proven';e.choices[1][1].setFlag='household_proven';}
  if(e.id==='military_comrade'){
   e.target='comrade';e.text='Çatışma sırasında yoldaşın {name} atından düştü. Birlik ilerlerken onu geride bırakıp bırakmamak sana kaldı.';
   e.choices=[
    ['Geri dönüp onu çıkar',{health:-4,prestige:8,setFlag:'warrior_loyal',targetRel:12,targetTrust:15,targetRespect:10,targetGrudge:-6,targetPrestige:4,targetState:{key:'warBond',value:'saved'},scheduleEvents:[{id:'comrade_debt_returns',years:[2,5],payload:{detail:'Onu çatışmada geride bırakmayıp kurtarmıştın.'}},{id:'comrade_battle_rescue',years:[2,7],payload:{detail:'Yıllar önce onu ölümden çekip çıkarmıştın.'}}]}],
    ['Birliğin düzenini bozma',{prestige:2,skill:2,targetRel:-8,targetTrust:-10,targetGrudge:12,targetState:{key:'warBond',value:'left'},scheduleEvent:{id:'comrade_debt_returns',years:[2,5],payload:{detail:'O gün birlik ilerlerken onu geride bırakmıştın.'}}}]
   ];
  }
  if(e.id==='military_night_watch'){e.target='comrade';e.text='Gece nöbetinde {name} ile birlikte uzakta hareketlilik gördünüz. Bunun bir keşif kolu olabileceğinden şüpheleniyorsunuz.';e.choices[0][1].targetTrust=5;e.choices[0][1].targetRespect=5;e.choices[1][1].targetTrust=2;}
  if(e.id==='military_small_command'){e.target='comrade';e.text='{name}, yeni seferde küçük bir savaşçı grubunun başına senin geçirilmeni destekliyor.';e.choices[0][1].targetRespect=7;e.choices[0][1].targetTrust=4;e.choices[1][1].targetRel=-2;}
  if(e.id==='military_tarkan_path'){e.target='comrade';e.text='Seferlerde birlikte yükseldiğin {name}, daha büyük bir komutanlık için adının öne çıktığını haber verdi.';e.choices[0][1].targetRespect=6;e.choices[1][1].targetRel=3;}
  if(e.id==='winter_shortage')e.months=[10,11,12];if(e.id==='summer_drought'){e.months=[4,5,6];e.req='asset:flock';}if(e.id==='exile_return')e.req=['exile','flag:exile_loyal'];
  if(e.cat==='Sefer')e.req=[e.req,'activeCampaign'].filter(Boolean);if(e.id==='spoils_choice'){e.req='recentCampaign';e.choices.forEach(c=>c[1].clearFlag='recent_campaign');}
  if(e.id==='merchant_offer')e.actions=['period','venture','work','role'];if(e.id==='minor_wound')e.actions=['training','activity','work','military'];if(e.id==='wolf_attack')e.actions=['activity','work','venture'];
  for(const c of e.choices){const r=D.careers.find(r=>r.name===c[1]?.setRole);if(r){e.min=Math.max(e.min,r.age);e.req=[e.req,'career:'+r.id].filter(Boolean);}}
  if(e.id==='smith_own_hearth'){e.req=['flag:smith_journeyman','wealth60'];e.choices[0][1].wealth=-60;e.choices[0][1].asset='smithy';}if(e.id==='herd_expansion'){e.choices[0][1].wealth=-25;e.choices[0][1].asset='flock';}if(e.id==='caravan_partner'){e.req=['flag:trader','wealth65'];e.choices[0][1].wealth=-65;e.choices[0][1].asset='caravan_share';}
 }
 const exileReturn=EVENT_DECK.find(e=>e.id==='exile_return');if(exileReturn){exileReturn.once=false;exileReturn.cool=12;}
 EVENT_DECK.push(
 {id:'smith_customer_order',cat:'Demircilik',min:16,max:55,w:11,cool:12,once:true,req:'flag:smith_journeyman',target:'smithMaster',text:'{name}, sana ilk kez kendi adınla teslim edeceğin gerçek bir sipariş bıraktı: bir ailenin kullanacağı dayanıklı demir parçaları.',choices:[['Kaliteyi öne çıkar',{wealth:4,prestige:3,craft:3,targetRel:4,targetTrust:6,targetRespect:5,career:{id:'smith',reputation:7,mastery:6,orders:1},scheduleEvent:{id:'smith_old_work_returns',years:[4,8],payload:{detail:'Yıllar önce ilk ciddi siparişinde kaliteyi aceleye tercih etmiştin.'}}}],['Daha hızlı teslim et',{wealth:6,craft:2,targetRespect:2,career:{id:'smith',reputation:2,mastery:3,orders:1,earnings:2},scheduleEvent:{id:'smith_old_work_returns',years:[4,8],payload:{detail:'Yıllar önce ilk büyük siparişini hızla yetiştirmiştin.'}}}]]},
 {id:'smith_rival_contract',cat:'Demircilik',min:18,max:65,w:10,cool:16,once:true,req:'role:smith',target:'smithMaster',text:'Yakındaki başka bir demir ocağı büyük bir siparişi daha ucuza yapacağını duyurdu. {name}, fiyatla değil işin kalitesiyle cevap vermeni öneriyor.',choices:[['Daha iyi iş çıkar',{wealth:-3,prestige:5,craft:3,targetRespect:6,career:{id:'smith',reputation:8,mastery:5,orders:1}}],['Fiyatı düşür',{wealth:3,prestige:1,targetTrust:-2,career:{id:'smith',reputation:2,mastery:2,orders:1}}]]},
 {id:'smith_old_work_returns',cat:'Demircilik',min:22,max:100,w:20,cool:0,delayed:true,target:'smithMaster',text:'{detail} {name}, o işin hâlâ kullanıldığını ve sahibinin seni yeniden sorduğunu haber verdi.',choices:[['Eski işinin arkasında dur',{prestige:4,targetRel:4,targetRespect:5,career:{id:'smith',reputation:7,mastery:3,orders:1}}],['Yeni işlere odaklan',{happiness:2,career:{id:'smith',reputation:2,mastery:1}}]]},
 {id:'scribe_secret_record',cat:'Bitig',min:17,max:60,w:11,cool:14,once:true,req:'flag:scribe_student',target:'scribeMaster',text:'{name}, yalnız birkaç kişinin görmesi gereken hassas bir kaydı sana emanet etti. Yanlış bir söz iki aileyi karşı karşıya getirebilir.',choices:[['Kaydı eksiksiz ve tarafsız tut',{prestige:4,literacy:4,targetTrust:8,targetRespect:6,career:{id:'scribe',reputation:8,mastery:6,orders:1},scheduleEvent:{id:'scribe_old_record_returns',years:[4,9],payload:{detail:'Yıllar önce hassas bir kaydı tarafsız biçimde korumuştun.'}}}],['Güçlü tarafı memnun et',{wealth:4,prestige:1,targetTrust:-4,targetGrudge:3,career:{id:'scribe',reputation:-3,mastery:2,orders:1},scheduleEvent:{id:'scribe_old_record_returns',years:[4,9],payload:{detail:'Yıllar önce hassas bir kayıtta güçlü tarafı gözetmiştin.'}}}]]},
 {id:'envoy_gift_dilemma',cat:'Elçilik',min:20,max:70,w:10,cool:14,once:true,req:'flag:envoy_path',target:'scribeMaster',text:'Yolculuk sırasında karşı tarafın ileri gelenlerinden biri sana pahalı bir armağan bırakmak istedi. {name}, bunun sözlerini etkileyip etkilemeyeceğini soruyor.',choices:[['Armağanı reddet',{prestige:6,targetRespect:7,targetTrust:5,career:{id:'envoy',reputation:8,mastery:4}}],['Kabul et ama kayda geçir',{wealth:6,prestige:2,targetRespect:3,career:{id:'envoy',reputation:2,mastery:3}}]]},
 {id:'scribe_archive_mastery',cat:'Bitig',min:20,max:80,w:12,cool:16,once:true,req:'flag:scribe_clerk',target:'scribeMaster',text:'Elçilik yoluna çıkmak yerine merkezde kaldın. {name}, eski kayıtların düzenini sana bırakmayı düşünüyor.',choices:[['Kayıtların sorumluluğunu al',{prestige:6,literacy:5,targetRel:5,targetTrust:7,targetRespect:7,setRole:'Bitigçi',career:{id:'scribe',reputation:10,mastery:8,orders:2}}],['Sadece yazı işine devam et',{happiness:2,literacy:3,career:{id:'scribe',reputation:4,mastery:4}}]]},
 {id:'scribe_old_record_returns',cat:'Bitig',min:22,max:100,w:20,cool:0,delayed:true,target:'scribeMaster',text:'{detail} Eski kayıt yeniden açıldı. {name}, senin o günkü yazının bugün bir anlaşmazlığın merkezinde olduğunu söylüyor.',choices:[['Eski kaydı savun',{prestige:5,targetRespect:5,career:{id:'scribe',reputation:6,mastery:3}}],['Yeni tanıkları da dinle',{skill:2,prestige:3,targetTrust:4,career:{id:'scribe',reputation:4,mastery:4}}]]},
 {id:'caravan_loss',cat:'Kervan',min:18,max:65,w:11,cool:14,once:true,req:'flag:caravan_member',target:'caravanMaster',text:'Bir konaklamadan sonra yük hesabında eksik çıktı. {name}, bunun hırsızlık mı yoksa kayıt hatası mı olduğunu çözmeni istiyor.',choices:[['Hesabı ve izleri tek tek kontrol et',{trade:4,prestige:3,targetTrust:6,targetRespect:5,career:{id:'caravan',reputation:7,mastery:5,orders:1}}],['Zararı paylaştırıp yola devam et',{wealth:-3,health:1,targetRel:2,career:{id:'caravan',reputation:2,mastery:2}}]]},
 {id:'caravan_route_rival',cat:'Kervan',min:20,max:75,w:10,cool:16,once:true,req:'flag:caravan_member',target:'caravanMaster',text:'Başka bir kervan aynı pazara daha kısa bir rota bulduğunu iddia ediyor. {name}, güvenli yol ile hızlı yol arasında karar vermeni istiyor.',choices:[['Yeni rotayı araştır',{health:-2,trade:4,riding:2,prestige:4,targetRespect:6,career:{id:'caravan',reputation:7,mastery:6,orders:1},scheduleEvent:{id:'caravan_old_route_returns',years:[3,7],payload:{detail:'Yıllar önce yeni bir ticaret yolunu denemeyi seçmiştin.'}}}],['Bilinen yolu koru',{wealth:3,health:2,targetTrust:4,career:{id:'caravan',reputation:3,mastery:3},scheduleEvent:{id:'caravan_old_route_returns',years:[3,7],payload:{detail:'Yıllar önce güvenli ve bilinen yolu korumuştun.'}}}]]},
 {id:'caravan_old_route_returns',cat:'Kervan',min:24,max:100,w:20,cool:0,delayed:true,target:'caravanMaster',text:'{detail} {name}, o eski yol kararının artık çevredeki tüccarların rotasını etkilediğini anlatıyor.',choices:[['Rotadaki payını büyüt',{wealth:7,prestige:4,targetRel:4,career:{id:'caravan',reputation:7,mastery:4,orders:1}}],['Başkalarına da açık bırak',{prestige:6,happiness:2,targetRespect:5,career:{id:'caravan',reputation:5,mastery:3}}]]},
 {id:'bard_mentor_offer',cat:'Kültür',min:16,max:55,w:7,cool:18,once:true,req:'career:bard',target:'bardMaster',text:'Ozan {name}, söz ve ezgi yeteneğini fark edip seni bir toyda yanında çıkarmayı teklif etti.',choices:[['Yanında yetiş',{speech:4,prestige:2,targetRel:5,targetTrust:5,setRole:'Ozan',career:{id:'bard',reputation:4,mastery:4}}],['Kendi başına ilerle',{happiness:2,speech:2}]]},
 {id:'bard_first_toy',cat:'Kültür',min:16,max:65,w:10,cool:12,once:true,req:'role:bard',target:'bardMaster',text:'{name}, kalabalık bir toyda sözü sana bıraktı. İlk kez insanların önünde uzun bir anlatıyı tek başına taşıyacaksın.',choices:[['Ezberlediğin anlatıyı güçlü söyle',{prestige:5,speech:4,targetRespect:6,career:{id:'bard',reputation:7,mastery:6,orders:1}}],['Kısa tut ve hata yapma',{prestige:2,speech:2,targetTrust:3,career:{id:'bard',reputation:3,mastery:3,orders:1}}]]},
 {id:'bard_rival_verse',cat:'Kültür',min:18,max:75,w:9,cool:16,once:true,req:'role:bard',target:'bardMaster',text:'Başka bir ozan anlattığın hikâyeyi küçümsedi. {name}, cevabınla yalnız rakibini değil kendi adını da belirleyeceğini söylüyor.',choices:[['Yeni bir anlatıyla cevap ver',{prestige:5,speech:4,targetRespect:4,career:{id:'bard',reputation:7,mastery:5}}],['Tartışmaya girmeden devam et',{happiness:2,prestige:2,targetTrust:3,career:{id:'bard',reputation:3,mastery:3}}]]},
 {id:'bard_patron_offer',cat:'Kültür',min:20,max:80,w:8,cool:18,once:true,req:['role:bard','careerrep:bard:12'],target:'bardMaster',text:'Bir ileri gelen, yalnız kendi başarılarını anlatman karşılığında sana düzenli armağan vermeyi teklif etti. {name} kararını sana bırakıyor.',choices:[['Sözünü satma',{prestige:7,targetRespect:7,career:{id:'bard',reputation:9,mastery:4}}],['Koruyuculuğu kabul et',{wealth:9,prestige:2,targetTrust:-2,career:{id:'bard',reputation:3,mastery:3,earnings:4}}]]},
 {id:'bard_legacy_song',cat:'Kültür',min:24,max:95,w:8,cool:20,once:true,req:['role:bard','careerrep:bard:18'],target:'bardMaster',text:'{name}, artık senden gençlerin ezberleyeceği bir anlatı bırakmanı istiyor.',choices:[['Uzun süre çalışıp kendi anlatını kur',{skill:3,prestige:8,speech:5,targetRespect:8,career:{id:'bard',reputation:10,mastery:8,orders:1},scheduleEvent:{id:'bard_old_song_returns',years:[5,10],payload:{detail:'Yıllar önce gençlere bıraktığın anlatı obalar arasında yayılmaya başlamıştı.'}}}],['Mevcut anlatıları aktarmaya devam et',{happiness:3,prestige:3,career:{id:'bard',reputation:4,mastery:3}}]]},
 {id:'bard_old_song_returns',cat:'Kültür',min:30,max:110,w:20,cool:0,delayed:true,target:'bardMaster',text:'{detail} {name}, senin sözlerini artık senden hiç ders almamış gençlerin bile söylediğini duyduğunu anlatıyor.',choices:[['Gençlere öğretmeye devam et',{prestige:7,happiness:4,targetRel:5,career:{id:'bard',reputation:8,mastery:5}}],['Sözlerin kendi yolunu bulsun',{prestige:5,happiness:3,career:{id:'bard',reputation:5,mastery:2}}]]},
 {id:'merchant_first_stall',cat:'Ticaret',min:18,max:65,w:9,cool:14,once:true,req:['role:merchant','careermonths:merchant:3'],target:'merchantContact',text:'Pazar ortağın {name}, bir günlük alışverişi sana bırakıyor. İlk kez fiyatları tamamen sen belirleyeceksin.',choices:[['Az kârla güven kazan',{wealth:3,trade:3,targetTrust:5,targetRespect:4,career:{id:'merchant',reputation:7,mastery:4,orders:1}}],['Yüksek kâr dene',{wealth:7,prestige:-1,targetTrust:-2,career:{id:'merchant',reputation:2,mastery:3,orders:1}}]]},
 {id:'merchant_credit_request',cat:'Ticaret',min:18,max:75,w:10,cool:14,once:true,req:'role:merchant',target:'merchantContact',text:'Tanıdık bir aile malı şimdi alıp ödemeyi gelecek mevsime bırakmak istiyor. {name}, kararın pazar itibarını etkileyeceğini söylüyor.',choices:[['Güvenip veresiye ver',{wealth:-4,prestige:2,targetTrust:4,career:{id:'merchant',reputation:5,mastery:3},scheduleEvent:{id:'merchant_bad_debt',years:[1,3],payload:{detail:'Bir aileye güvenip malı veresiye vermiştin.'}}}],['Peşin ödeme iste',{wealth:3,targetRespect:3,career:{id:'merchant',reputation:2,mastery:2},scheduleEvent:{id:'merchant_bad_debt',years:[1,3],payload:{detail:'Pazarda borç yerine peşin ödeme konusunda ısrar etmiştin.'}}}]]},
 {id:'merchant_bad_debt',cat:'Ticaret',min:19,max:90,w:20,cool:0,delayed:true,target:'merchantContact',text:'{detail} Aradan zaman geçti. {name}, o eski alışverişin pazar çevresinde yeniden konuşulduğunu söylüyor.',choices:[['İlişkiyi koruyarak hesabı kapat',{wealth:2,prestige:3,targetRel:4,career:{id:'merchant',reputation:6,mastery:3,orders:1}}],['Hesabı sertçe tahsil et',{wealth:7,prestige:1,targetRespect:3,career:{id:'merchant',reputation:2,mastery:2,orders:1}}]]},
 {id:'merchant_market_name',cat:'Ticaret',min:20,max:85,w:9,cool:16,once:true,req:['role:merchant','careerrep:merchant:10'],target:'merchantContact',text:'Pazarda artık insanlar fiyat sormadan önce senin adını anıyor. {name}, bu güveni büyütmek için daha büyük mal çevirmeyi öneriyor.',choices:[['Büyümeyi yavaş tut',{wealth:5,prestige:3,targetTrust:4,career:{id:'merchant',reputation:5,mastery:4}}],['Daha büyük sermaye çevir',{wealth:-6,prestige:5,trade:4,targetRespect:5,career:{id:'merchant',reputation:8,mastery:5,orders:1}}]]},
 {id:'merchant_partner_offer',cat:'Ticaret',min:22,max:90,w:8,cool:18,once:true,req:['role:merchant','careerrep:merchant:15'],target:'merchantContact',text:'{name}, artık seni yalnız çalışan biri değil ortak olarak görüyor ve malları birlikte yönetmeyi teklif ediyor.',choices:[['Ortaklığı kabul et',{wealth:8,prestige:6,targetRel:7,targetTrust:8,targetRespect:6,career:{id:'merchant',reputation:10,mastery:6,orders:2}}],['Kendi adınla devam et',{prestige:7,happiness:2,targetRespect:5,career:{id:'merchant',reputation:7,mastery:5}}]]},
 {id:'council_pasture_case',cat:'Boy',min:20,max:75,w:12,cool:14,once:true,target:'statePair',text:'İki oba aynı otlak üzerinde hak iddia ediyor. {name} uzlaşma arıyor; {other} ise daha sert bir karar istiyor.',choices:[['Otlak kullanımını dönemlere böl',{prestige:4,speech:3,targetTrust:5,targetRespect:4,otherRel:-2,state:{influence:5,trust:7,support:6,rival:2},stateMemory:'Otlak anlaşmazlığında paylaşım yolunu seçtin.'}],['Kendi boyunun önceliğini savun',{prestige:5,targetRel:2,otherRel:4,otherRespect:4,state:{influence:5,trust:1,support:2,rival:-2},stateMemory:'Otlak konusunda kendi boyunun önceliğini savundun.'}]]},
 {id:'council_levy_choice',cat:'Boy',min:21,max:78,w:11,cool:15,once:true,target:'statePair',text:'Ortak bir iş için sürü ve erzak katkısı gerekiyor. {name} yükün dengeli paylaşılmasını istiyor; {other} büyük sürü sahiplerinin daha az etkilenmesini savunuyor.',choices:[['Yükü güce göre paylaştır',{wealth:-3,prestige:4,targetTrust:5,otherRel:-4,otherGrudge:4,state:{influence:5,trust:6,support:8,rival:5,obligations:1},stateMemory:'Ortak yükü varlığa göre paylaştırdın.'}],['Herkesten benzer pay iste',{wealth:-2,prestige:3,targetRel:1,otherRel:4,otherTrust:3,state:{influence:4,trust:2,support:-3,rival:-2,obligations:1},stateMemory:'Ortak yükte herkesten benzer katkı istedin.'}]]},
 {id:'council_rival_challenge',cat:'Boy',min:22,max:80,w:12,cool:14,once:true,target:'statePair',text:'{other}, önceki kararlarının boyu zayıflattığını söyleyerek seni mecliste doğrudan eleştirdi. {name} cevabını bekliyor.',choices:[['Kayıtlar ve sonuçlarla cevap ver',{literacy:2,speech:3,prestige:5,targetRespect:5,otherRespect:3,otherGrudge:2,state:{influence:8,trust:7,support:3,rival:-4},stateMemory:'Rakibinin eleştirisine kayıt ve sonuçlarla cevap verdin.'}],['Sertçe karşılık ver',{prestige:6,targetRel:1,otherRel:-7,otherTrust:-5,otherGrudge:9,state:{influence:6,trust:-2,support:2,rival:8},stateMemory:'Rakibinle açık bir güç çatışmasına girdin.'}]]},
 {id:'council_support_test',cat:'Boy',min:23,max:82,w:11,cool:16,once:true,req:'stateinfluence:12',target:'statePair',text:'Kararların artık daha fazla kişiyi etkiliyor. {name}, desteğini kalıcılaştırman gerektiğini söylüyor; {other} ise çevresine kendi tarafını toplamaya başladı.',choices:[['Obaların günlük meselelerine daha çok eğil',{wealth:-3,happiness:1,targetTrust:4,otherRel:-2,state:{influence:5,trust:5,support:10,rival:2},stateMemory:'Desteğini oba meselelerini çözerek büyüttün.'}],['Mecliste güçlü isimlerle bağ kur',{prestige:5,targetRel:5,targetTrust:4,otherGrudge:4,state:{influence:9,trust:6,support:1,rival:5},stateMemory:'Meclisteki güçlü isimlerle bağlarını sıklaştırdın.'}]]},
 {id:'council_bey_nomination',cat:'Boy',min:28,max:85,w:15,cool:18,once:true,req:['career:bey','stateinfluence:20','statetrust:30'],target:'statePair',text:'{name}, yıllardır verdiğin kararların ardından seni boyun daha ağır sorumluluk taşıyan görevi için öne çıkarıyor. {other} adaylığını açıkça desteklemiyor.',choices:[['Sorumluluğu kabul et',{setRole:'Boy Beyi',prestige:10,targetRel:6,targetTrust:7,targetRespect:7,otherRel:-6,otherGrudge:8,state:{influence:10,trust:8,support:6,rival:8,obligations:2},stateMemory:'Boy Beyi sorumluluğunu kabul ettin.'}],['Mecliste danışman olarak kal',{happiness:3,prestige:5,targetRespect:5,otherRel:2,state:{influence:3,trust:5,support:2,rival:-4},stateMemory:'Beylik sorumluluğunu almayıp mecliste kalmayı seçtin.'}]]},

 {id:'bey_first_petition',cat:'Boy',min:28,max:90,w:13,cool:14,once:true,req:'role:bey',target:'statePair',text:'Boy Beyi olduktan sonra ilk büyük başvurunda iki aile eski bir borç ve hayvan meselesiyle önüne geldi. {name} kararının örnek olacağını, {other} ise zayıflık göstermemen gerektiğini söylüyor.',choices:[['İki tarafı da dinleyip tazmin belirle',{prestige:5,speech:3,targetTrust:5,otherRel:-2,state:{influence:5,trust:8,support:7,rival:2},stateMemory:'Bey olarak ilk büyük anlaşmazlıkta tazmin ve uzlaşma yolu seçtin.'}],['Hızlı ve sert karar ver',{prestige:6,targetRespect:3,otherRel:4,state:{influence:6,trust:-3,support:-2,rival:-2},stateMemory:'Bey olarak ilk büyük meselede hızlı ve sert karar verdin.'}]]},
 {id:'bey_winter_reserve',cat:'Boy',min:29,max:92,w:12,cool:16,once:true,req:'role:bey',target:'statePair',text:'Kış öncesi ortak erzak ve yem rezervi yetersiz görünüyor. {name} önceden mal ayırmayı, {other} ise her ocağın kendi hazırlığını yapmasını savunuyor.',choices:[['Ortak rezerv oluştur',{wealth:-8,prestige:4,targetTrust:5,otherRel:-3,state:{influence:5,trust:7,support:9,rival:3,obligations:2},stateMemory:'Kış öncesi ortak rezerv oluşturdun.',scheduleEvent:{id:'bey_winter_memory',years:[2,4],payload:{detail:'Beyliğinin ilk yıllarında ortak kış rezervi oluşturmuştun.'}}}],['Her ocağı kendi hazırlığına bırak',{wealth:2,prestige:3,targetRel:-2,otherRel:5,state:{influence:3,trust:1,support:-4,rival:-2},stateMemory:'Kış hazırlığını ocakların kendi sorumluluğuna bıraktın.',scheduleEvent:{id:'bey_winter_memory',years:[2,4],payload:{detail:'Beyliğinin ilk yıllarında kış hazırlığını ocakların kendi sorumluluğuna bırakmıştın.'}}}]]},
 {id:'bey_kin_request',cat:'Boy',min:30,max:94,w:11,cool:17,once:true,req:'role:bey',target:'statePair',text:'Yakınlarından biri ortak bir yükümlülükten muaf tutulmak için senden özel yardım istedi. {name} kararın herkese duyulacağını hatırlatıyor; {other} akrabalarını korumanın doğal olduğunu söylüyor.',choices:[['Yakınına ayrıcalık tanıma',{happiness:-1,prestige:6,targetRespect:6,otherRel:-4,state:{influence:5,trust:9,support:8,rival:4},stateMemory:'Yakınlarına da aynı kuralı uyguladın.'}],['Bu kez istisna yap',{happiness:2,wealth:2,targetRel:-3,otherRel:5,state:{influence:2,trust:-7,support:-6,rival:-2},stateMemory:'Yakının için özel bir istisna yaptın.'}]]},
 {id:'bey_border_agreement',cat:'Boy',min:31,max:96,w:11,cool:18,once:true,req:'role:bey',target:'statePair',text:'Komşu bir toplulukla geçiş ve otlak sınırları için yeni bir sözleşme konuşuluyor. {name} uzun süreli uzlaşmayı, {other} daha sert şartları savunuyor.',choices:[['Karşılıklı geçiş şartlarını kabul et',{prestige:5,speech:3,targetTrust:4,otherRel:-3,state:{influence:5,trust:6,support:4,rival:3},stateMemory:'Komşu toplulukla karşılıklı geçiş şartlarında uzlaştın.',scheduleEvent:{id:'bey_old_judgment',years:[4,8],payload:{detail:'Yıllar önce komşu toplulukla karşılıklı geçiş şartlarını kabul etmiştin.'}}}],['Sınır şartlarını sert tut',{prestige:6,combat:1,targetRel:-1,otherRel:5,state:{influence:5,trust:1,support:2,rival:-2},stateMemory:'Komşu toplulukla sınır şartlarını sert tuttun.',scheduleEvent:{id:'bey_old_judgment',years:[4,8],payload:{detail:'Yıllar önce komşu toplulukla geçiş şartlarını sert tutmuştun.'}}}]]},
 {id:'bey_old_judgment',cat:'Boy',min:35,max:110,w:22,cool:0,delayed:true,target:'statePair',text:'{detail} Aradan yıllar geçti. Aynı sınır meselesi yeni kuşakların önüne yeniden geldi; {name} eski kararını hatırlatırken {other} bunun artık değiştirilmesi gerektiğini savunuyor.',choices:[['Eski kararın temelini koru',{prestige:5,targetTrust:5,otherRel:-2,state:{influence:5,trust:5,support:3,rival:2},stateMemory:'Yıllar sonra eski sınır kararının temelini korudun.'}],['Yeni koşullara göre yeniden düzenle',{skill:2,speech:2,prestige:4,targetRespect:5,otherRel:2,state:{influence:6,trust:7,support:5,rival:-1},stateMemory:'Yıllar sonra eski sınır kararını yeni koşullara göre değiştirdin.'}]]},
 {id:'bey_winter_memory',cat:'Boy',min:31,max:100,w:18,cool:0,delayed:true,target:'statePair',text:'{detail} Yeni bir sert kış yaklaşırken eski hazırlık kararının sonuçları yeniden tartışılıyor.',choices:[['Aynı yaklaşımı geliştirerek sürdür',{wealth:-3,prestige:3,state:{influence:3,trust:4,support:5,rival:1},stateMemory:'Eski kış hazırlığı politikasını geliştirerek sürdürdün.'}],['Bu kez farklı bir yol dene',{skill:2,prestige:2,state:{influence:2,trust:2,support:3,rival:-1},stateMemory:'Kış hazırlığında önceki yönteminden farklı bir yol seçtin.'}]]},

 {id:'state_elder_warning',cat:'Boy',min:24,max:95,w:7,cool:30,req:'staterival:55',target:'stateElder',text:'Boy büyüğü {name}, çevrendeki çekişmenin kararların önüne geçmeye başladığını söylüyor.',choices:[['Rakiplerle görüşme zemini ara',{speech:2,targetTrust:4,targetRespect:3,state:{trust:5,support:2,rival:-10},stateMemory:'Rakip baskısı büyüyünce görüşme zemini aradın.'}],['Geri adım atma',{prestige:4,targetRespect:3,state:{influence:4,trust:-2,rival:6},stateMemory:'Rakip baskısına rağmen geri adım atmadın.'}]]},
 {id:'rival_arc_challenge',cat:'İlişkiler',min:12,max:80,w:5,cool:24,once:true,req:'hasRival',target:'rival',text:'Rakibin {name}, toy meydanında seni herkesin önünde küçümsedi.',choices:[['Sözle karşılık ver',{prestige:2,targetRel:-4,targetGrudge:8,setFlag:'rival_story_active'}],['Konuyu büyütme',{happiness:2,targetGrudge:-5,targetRespect:1}]]},
 {id:'rival_arc_escalation',cat:'Husumet',min:13,max:85,w:8,cool:12,once:true,req:'flag:rival_story_active',target:'rival',text:'{name} ile arandaki mesele bu kez oba işlerine yansıdı; ikinizden bir çözüm bekleniyor.',choices:[['Beylerin önünde konuş',{prestige:3,targetRespect:4,targetGrudge:-3,setFlag:'rival_hearing'}],['Güç göster',{health:-2,prestige:4,targetFear:8,targetGrudge:7}]]},
 {id:'rival_arc_resolution',cat:'Husumet',min:14,max:90,w:9,cool:14,once:true,req:'flag:rival_story_active',target:'rival',text:'{name} ile süren husumet artık iki tarafı da yoruyor. Son bir karar vermen gerekiyor.',choices:[['Barış sözü ver',{happiness:3,prestige:4,targetRel:18,targetTrust:8,targetGrudge:-25,clearFlag:'rival_story_active',clearFlag2:'rival_hearing',resolveRival:true}],['Husumeti kapatmadan ayrıl',{prestige:3,targetGrudge:15,clearFlag:'rival_story_active',setFlag:'rival_bitter'}]]},
 {id:'feud_mediation_result',cat:'Husumet',min:16,max:60,w:8,cool:14,once:true,req:'flag:feud_mediation',text:'Araya giren büyükler iki taraf için bir uzlaşma sözü hazırladı.',choices:[['Uzlaşmayı kabul et',{happiness:4,prestige:4,clearFlag:'feud_mediation',clearFlag2:'feud_started',setFlag:'feud_settled'}],['Şartları yetersiz bul',{prestige:2,happiness:-2,clearFlag:'feud_mediation',setFlag:'feud_bitter'}]]},
 {id:'comrade_debt_returns',cat:'İlişkiler',min:20,max:90,w:16,cool:0,delayed:true,target:'comrade',text:'{detail} Aradan yıllar geçti. {name} yeniden karşına çıktı; eski seferin hesabı ikinizin arasında hâlâ yaşıyor.',choices:[['Geçmişi konuş ve bağı onar',{happiness:2,targetRel:8,targetTrust:8,targetRespect:3,targetGrudge:-10,makeTargetFriend:true,scheduleEvent:{id:'comrade_request_aid',years:[3,7],payload:{detail:'Eski sefer bağınız yıllar içinde gerçek bir dostluğa dönüşmüştü.'}}}],['Eski hesabı yeniden aç',{prestige:2,targetRel:-8,targetTrust:-8,targetGrudge:12,scheduleEvent:{id:'comrade_betrayal',years:[2,6],payload:{detail:'Yıllar sonra karşılaştığınızda eski hesabı kapatmak yerine yeniden açmıştın.'}}}]]},
 {id:'comrade_request_aid',cat:'İlişkiler',min:22,max:95,w:18,cool:0,delayed:true,target:'comrade',text:'{detail} {name} artık kendi çevresinde söz sahibi olmaya çalışıyor ve önemli bir meselede desteğini istiyor.',choices:[['Arkasında dur',{wealth:-4,prestige:3,targetRel:7,targetTrust:10,targetRespect:7,targetPrestige:18,targetGoal:'prestige',scheduleEvent:{id:'comrade_rises',years:[2,5],payload:{detail:'Onun yükselişinde açıkça arkasında durmuştun.'}}}],['Bu işe karışma',{happiness:1,targetRel:-4,targetTrust:-6,targetGrudge:4}]]},
 {id:'comrade_rises',cat:'İlişkiler',min:24,max:100,w:20,cool:0,delayed:true,target:'comrade',text:'{detail} {name}, yıllar süren sefer ve oba hizmetinden sonra daha büyük bir konuma yükseliyor.',choices:[['Eski yoldaşlığınızı sürdür',{happiness:3,prestige:3,targetRel:8,targetTrust:8,targetRespect:5,promoteTarget:'military_leader',makeTargetFriend:true}],['Aranıza mesafe koy',{prestige:2,targetRel:-2,targetTrust:-3,promoteTarget:'military_leader'}]]},
 {id:'comrade_betrayal',cat:'İlişkiler',min:22,max:100,w:20,cool:0,delayed:true,target:'comrade',text:'{detail} {name}, şimdi senin aleyhine konuşarak eski sefer bağınızı kendi çıkarı için kullanıyor.',choices:[['Yüzleş ama bağı tamamen koparma',{prestige:2,targetRel:-5,targetTrust:-10,targetGrudge:8}],['Onu artık hasım say',{prestige:3,targetRel:-15,targetTrust:-15,targetGrudge:20,makeTargetRival:true}]]},
 {id:'comrade_battle_rescue',cat:'Sefer',min:20,max:95,w:24,cool:0,delayed:true,req:'activeCampaign',target:'comrade',text:'{detail} Yeni bir çatışmada bu kez sen zor durumda kaldın. {name} birliğin çizgisinden dönüp sana ulaşmayı başardı.',choices:[['Onun açtığı yoldan çık',{health:3,happiness:3,prestige:2,targetRel:10,targetTrust:12,targetRespect:6,makeTargetFriend:true}],['Kendi gücünle çıkmaya çalış',{health:-4,skill:4,combat:3,prestige:5,targetRel:2,targetRespect:4}]]},
 {id:'legacy_comrade_visit',cat:'Aile',min:6,max:100,w:20,cool:0,delayed:true,target:'familyFriend',text:'{detail} {name} bugün obanıza geldi ve sana ebeveyninle çıktığı seferleri anlatıyor.',choices:[['Anlattıklarını dikkatle dinle',{skill:2,combat:2,speech:2,happiness:2,targetRel:5,targetTrust:7,targetRespect:4}],['Onun gölgesinde kalmak istemediğini söyle',{prestige:2,targetRel:-2,targetTrust:-2,targetRespect:2}]]},
 {id:'household_work_balance',cat:'Ocak',min:18,max:65,w:9,cool:12,once:true,req:'married',target:'partner',text:'{name}, görevlerin ve oba işleri yüzünden ocağın yükünün çoğunun kendi omzunda kaldığını söylüyor.',choices:[['Yükü paylaş',{happiness:2,targetRel:7,targetTrust:8,targetRespect:4}],['Görevlerimin ağırlığını anlat',{prestige:2,targetRel:-3,targetTrust:-5,targetGrudge:3}]]},
 {id:'household_trust_test',cat:'Ocak',min:18,max:70,w:8,cool:14,once:true,req:'married',target:'partner',text:'{name}, kendi ailesine senden habersiz bir yardım sözü verdi. Bu karar ocağınızda güven meselesine dönüştü.',choices:[['Sözünün arkasında dur',{wealth:-4,happiness:2,targetRel:6,targetTrust:8,targetRespect:3,scheduleEvent:{id:'household_long_memory',years:[4,8],payload:{detail:'Yıllar önce eşinin verdiği sözü birlikte taşımayı seçmiştin.'}}}],['Böyle kararların birlikte alınmasını iste',{prestige:1,targetRel:-2,targetTrust:-3,targetRespect:4,scheduleEvent:{id:'household_long_memory',years:[4,8],payload:{detail:'Yıllar önce ocakla ilgili kararların birlikte alınmasında ısrar etmiştin.'}}}]]},
 {id:'household_long_memory',cat:'Ocak',min:22,max:90,w:15,cool:0,delayed:true,req:'married',target:'partner',text:'{detail} {name} bugün o eski kararı yeniden hatırlattı; yıllar içinde aranızdaki bağın neye dönüştüğünü konuşuyorsunuz.',choices:[['O günkü kararının arkasında dur',{happiness:3,targetRel:6,targetTrust:7,targetRespect:4}],['Artık farklı düşündüğünü söyle',{happiness:1,targetRel:-2,targetTrust:-3,targetRespect:2}]]},
 {id:'child_training_conflict',cat:'Çocuk',min:24,max:75,w:10,cool:12,once:true,req:'hasChild',target:'child',text:'{name}, onu daha önce {past} yönlendirdiğini hatırlıyor ama artık kendi isteğini daha açık söylüyor.',choices:[['Onu dinle ve yolunu birlikte düzenle',{happiness:2,targetRel:7,targetTrust:8,targetRespect:3}],['Başladığı yolu tamamlamasını iste',{prestige:1,targetRel:-3,targetTrust:-4,targetRespect:4,targetGrudge:3}]]},
 {id:'child_departure_choice',cat:'Çocuk',min:25,max:80,w:10,cool:12,once:true,req:'hasChild',target:'child',text:'{name} artık obanın dışında kendi yolunda daha fazla zaman geçirmek istiyor. Çocukken verdiğin yönlendirme şimdi gerçek bir yaşam seçimine dönüşüyor.',choices:[['At ve savaş yolunu destekle',{wealth:-3,prestige:2,targetRel:4,targetTrust:4,targetState:{key:'guidance',value:'war'},scheduleEvent:{id:'child_path_consequence',years:[5,9],payload:{path:'war',detail:'Onu at, ok ve savaş yolunda desteklemiştin.'}}}],['Bir ustalık yolunu destekle',{wealth:-3,skill:1,targetRespect:5,targetState:{key:'guidance',value:'craft'},scheduleEvent:{id:'child_path_consequence',years:[5,9],payload:{path:'craft',detail:'Onu bir ustalık ve zanaat yolunda desteklemiştin.'}}}],['Kendi kararını vermesine izin ver',{happiness:3,targetRel:6,targetTrust:6,targetState:{key:'guidance',value:'free'},scheduleEvent:{id:'child_path_consequence',years:[5,9],payload:{path:'free',detail:'Kendi yolunu seçmesine izin vermiştin.'}}}]]},
 {id:'child_path_consequence',cat:'Çocuk',min:30,max:100,w:18,cool:0,delayed:true,target:'child',text:'{detail} Aradan yıllar geçti. {name} bugün sana kendi emeğiyle vardığı yeri anlatmak için geldi.',choices:[['Yoluyla gurur duyduğunu söyle',{happiness:3,targetRel:5,targetTrust:6,targetRespect:5}],['Artık kendi sorumluluğunu taşımasını söyle',{prestige:2,targetRel:-1,targetTrust:-2,targetRespect:3}]]},
 {id:'guardian_month',cat:'Bakım',min:0,max:4,w:1,fallback:true,agency:'guardian',text:'Yakınların bu ay bakım düzenini planlıyor.',choices:[['Dinlenmene ve beslenmene zaman ayırsınlar',{health:2}],['Yanında kalıp oyun ve seslerle ilgilensinler',{happiness:3}]]},
 {id:'child_month',cat:'Çocukluk',min:5,max:9,w:1,fallback:true,text:'Yakınlarının gözetiminde obada sakin bir gün geçiriyorsun.',choices:[['Yaşıtlarınla oyun kur',{happiness:2}],['Bir büyüğün anlattıklarını dinle',{speech:1}]]},
 {id:'youth_month',cat:'Yetişme',min:10,max:17,w:1,fallback:true,text:'Bu ay öğrendiklerini nasıl pekiştireceksin?',choices:[['Ustanın gösterdiklerini tekrarla',{skill:1}],['Yaşıtlarınla birlikte çalış',{happiness:2}]]},
 {id:'adult_month',cat:'Oba',min:18,max:150,w:1,fallback:true,text:'Ay sonunda emek ve dinlenme için zamanını düzenliyorsun.',choices:[['Yakınlarınla vakit geçir',{happiness:2}],['Dinlenmeye öncelik ver',{health:1}]]},
 {id:'captivity_month',cat:'Tutsaklık',min:0,max:150,w:1,fallback:true,req:'captive',text:'Tutsaklıkta barınma ve dayanma imkânları sınırlı.',choices:[['Gücünü korumaya çalış',{health:1}],['Yanındakilerle dayanış',{happiness:1}]]},
 {id:'campaign_month',cat:'Sefer',min:18,max:150,w:1,fallback:true,req:'activeCampaign',text:'Birlikte bakım ve hazırlık için zaman ayrıldı.',choices:[['Donanımını kontrol et',{riding:1}],['Yoldaşlarınla nöbeti paylaş',{combat:1}]]},
 {id:'exile_month',cat:'Sürgün',min:18,max:150,w:1,fallback:true,req:'exile',text:'Yeni yerde geçimini ve barınmanı düzenlemeye çalışıyorsun.',choices:[['Küçük işlerde yardım et',{wealth:1}],['Dinlenip yolunu düşün',{health:1}]]},
 {id:'kin_help_request',cat:'Aile',min:10,max:150,w:5,cool:18,req:'hasCloseKin',target:'closeKin',text:'{name} zor bir dönemden geçiyor ve senden destek istedi.',choices:[['Yanında dur',{wealth:-2,happiness:1,targetRel:8,targetTrust:10,targetRespect:4,targetGrudge:-3}],['Kendi işlerine öncelik ver',{wealth:1,targetRel:-5,targetTrust:-6,targetGrudge:4}]]},
 {id:'trusted_secret',cat:'İlişkiler',min:12,max:150,w:4,cool:24,req:'hasTrustedPerson',target:'trusted',text:'{name} sana yalnız ikinizin bilmesini istediği önemli bir mesele anlattı.',choices:[['Sözünü sakla',{prestige:1,targetRel:5,targetTrust:10,targetRespect:3}],['Bu bilgiyi çıkarın için kullan',{wealth:3,prestige:-2,targetRel:-8,targetTrust:-14,targetGrudge:8}]]},
 {id:'rival_peace_offer',cat:'İlişkiler',min:12,max:150,w:3,cool:30,req:'hasRival',target:'rival',text:'Rakibin {name}, aranızdaki meseleyi büyütmeden konuşmayı teklif etti.',choices:[['Görüşmeyi kabul et',{happiness:1,targetRel:12,targetTrust:5,targetGrudge:-18}],['Geri çevir',{prestige:1,targetRel:-4,targetGrudge:10}]]},
 {id:'sibling_path',cat:'Aile',min:12,max:70,w:3,cool:30,target:'sibling',req:'hasCloseKin',text:'{name} geleceği hakkında fikrini sordu.',choices:[['Kendi yolunu seçmesini söyle',{targetRel:4,targetTrust:7,targetRespect:3}],['Ailenin ihtiyacını öncelemesini söyle',{prestige:1,targetRel:2,targetRespect:5,targetGrudge:2}]]},
 {id:'legacy_friend_aid',cat:'Aile',min:12,max:150,w:4,cool:30,req:'hasFamilyFriend',target:'familyFriend',text:'Ailenin eski dostu {name}, ebeveyninin hatırına sana destek sunuyor.',choices:[['Desteği kabul et',{wealth:4,skill:2,targetRel:5,targetTrust:7,targetRespect:3}],['Kendi gücünle ilerle',{prestige:2,targetRel:-2,targetTrust:-1}]]},
 {id:'legacy_enemy_claim',cat:'Aile',min:16,max:150,w:3,cool:36,req:'hasFamilyEnemy',target:'familyEnemy',text:'Aile hasmı {name}, geçmişten kalan bir anlaşmazlığı yeniden gündeme getirdi.',choices:[['Uzlaşma yolu ara',{wealth:-3,prestige:1,targetRel:6,targetTrust:3,targetGrudge:-12}],['Geri adım atma',{prestige:3,targetRel:-5,targetGrudge:9}]]},
 {id:'rival_kin_bridge',cat:'İlişkiler',min:12,max:150,w:3,cool:30,req:'hasRivalKinLink',target:'rivalAllyPair',text:'Rakibin {name}, yakının {other} ile giderek yakınlaşıyor.',choices:[['Aralarına karışma',{happiness:1,targetGrudge:-2,otherTrust:2,linkScore:3}],['Yakınını uyar',{prestige:1,targetGrudge:5,otherRel:-4,otherTrust:-5,linkScore:-8,linkGrudge:4}]]}
 );
}
configureRules();
init();
