/* Original YAZGI simulation rules; reference assets, text and code are not used. */
const SAVE_VERSION=18,ADULT_AGE=18;
const CAREER_RULES={
 herder:{age:10,skills:{riding:10}},hunter:{age:12,skills:{archery:20,riding:10}},horsekeeper:{age:12,skills:{riding:25}},smith_apprentice:{age:12,skills:{craft:17}},
 smith:{age:18,skills:{craft:40},months:12,track:'craft'},bard:{age:16,skills:{speech:35},months:6,track:'culture'},merchant:{age:18,skills:{trade:35},months:12,track:'trade'},caravan:{age:18,skills:{trade:30,riding:25},months:6,track:'trade'},
 scribe:{age:18,skills:{literacy:50},months:12,track:'state'},envoy:{age:22,skills:{literacy:55,speech:45},months:24,track:'state'},alp:{age:18,skills:{combat:45,archery:30,riding:30}},raider:{age:18,skills:{combat:50,riding:40},months:6,track:'military'},
 tarkan:{age:24,skills:{combat:66,speech:40},months:24,track:'military',campaigns:3,prestige:35},bey:{age:28,skills:{speech:60,literacy:40},months:36,track:'state',prestige:45}
};
const ASSET_AGES={horse:12,bow:12,flock:18,sword:18,armor:18,yurt:18,caravan_share:18,smithy:18};
const ASSET_ECONOMY={
 horse:{upkeep:1,wear:1},bow:{upkeep:0,wear:1},sword:{upkeep:0,wear:1},armor:{upkeep:1,wear:2},yurt:{upkeep:1,wear:1},
 flock:{upkeep:1,wear:2,venture:'herd'},caravan_share:{upkeep:2,wear:2,venture:'caravan'},smithy:{upkeep:2,wear:2,venture:'forge'}
};
const AILMENTS={
 fever:{name:'Ateşli rahatsızlık',min:0,loss:2,duration:3,severity:2,kind:'illness'},
 chill:{name:'Soğukta güçten düşme',min:0,loss:1,duration:2,severity:1,kind:'illness'},
 injury:{name:'İyileşen yara',min:12,loss:2,duration:4,severity:2,kind:'injury'},
 deep_wound:{name:'Ağır yara',min:16,loss:3,duration:7,severity:3,kind:'injury'},
 joints:{name:'Eklem ağrısı',min:50,loss:1,duration:8,severity:2,kind:'chronic'},
 old_wound:{name:'Eski yaranın sızısı',min:40,loss:1,duration:4,severity:2,kind:'chronic'},
 exhaustion:{name:'Aşırı yorgunluk',min:10,loss:1,duration:3,severity:1,kind:'strain'}
};
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
 healingroad:{name:'İyileşme Yolu',icon:'🌿',start:'health_crisis',maxStage:4,nodes:{
  health_crisis:{stage:0,next:{0:'health_followup',1:'health_followup'}},
  health_followup:{stage:1,next:{0:'health_recovery_test',1:'health_recovery_test'}},
  health_recovery_test:{stage:2,next:{0:'health_aftercare',1:'health_aftercare'}},
  health_aftercare:{stage:3,end:{0:'completed',1:'completed'}}
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
 if(!n)return;const prof=s.children.some(c=>c.id===n.id)?ensureChildProfile(n):null,path=context?.delayedPayload?.path||prof?.guidance||n.statusFlags?.guidance||'free',def=PARENTING_PATHS[path]||PARENTING_PATHS.free;n.goal=def.goal||chooseNPCGoal(n);n.skills=n.skills||{};
 if(path==='war'){n.skills.combat=clamp((n.skills.combat||0)+8);n.skills.riding=clamp((n.skills.riding||0)+6);n.skills.archery=clamp((n.skills.archery||0)+6);}
 else if(path==='craft'){n.skills.craft=clamp((n.skills.craft||0)+10);}
 else if(path==='wisdom'){n.skills.literacy=clamp((n.skills.literacy||0)+8);n.skills.speech=clamp((n.skills.speech||0)+5);}
 else if(path==='trade'){n.skills.trade=clamp((n.skills.trade||0)+9);n.skills.speech=clamp((n.skills.speech||0)+4);}
 else if(path==='family'){n.skills.riding=clamp((n.skills.riding||0)+4);n.skills.trade=clamp((n.skills.trade||0)+4);}
 else{n.skills.speech=clamp((n.skills.speech||0)+4);n.prestige=clamp((n.prestige||0)+2);}
 if(prof){n.prestige=clamp((n.prestige||0)+Math.round((prof.wellbeing+prof.expectation-90)/20));}
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
function lifeStage(a){return a<5?'Aile bakımında':a<10?'Gözetimli çocukluk':a<12?'Oba yardımı':a<16?'Çıraklık':a<18?'Gençlik':a<50?'Yetişkinlik':a<65?'Tecrübe çağı':'Yaşlılık';}
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
 n.memories=Array.isArray(n.memories)?n.memories.slice(0,14):[];n.parentIds=Array.isArray(n.parentIds)?n.parentIds:[];n.origin=n.origin||s?.place||'';n.place=n.place||n.origin||s?.place||'';n.realm=n.realm||s?.realm||'';n.tribe=n.tribe||s?.tribe||'';
 n.wealth=Math.max(0,Math.round(n.wealth??rng(0,25)));n.prestige=clamp(n.prestige??rng(5,35));n.skills=n.skills||{};
 n.role=n.role||npcCareerFor(n);n.roleHistory=Array.isArray(n.roleHistory)?n.roleHistory:[];n.partner=n.partner||null;n.children=n.children||0;n.descendants=Array.isArray(n.descendants)?n.descendants:[];
 n.lastInteractionYear=n.lastInteractionYear??null;n.statusFlags=n.statusFlags||{};return n;
}
function allNPCs(){
 const out=[],seen=new Set();const visit=n=>{if(!n||seen.has(n.id))return;seen.add(n.id);normalizeNPC(n,n.type);out.push(n);(n.descendants||[]).forEach(visit);};
 const disp=s.displacement||{},cap=disp.captivity?.contacts||[],ex=disp.exile?.contacts||[],edu=s.education?.contacts||[],oldLove=s.exPartners||[],justice=s.justice?.contacts||[],inlaws=s.extendedFamily?.inLaws||[],guardian=s.guardianship?.contacts||[];
 [...s.parents,...s.siblings,...(s.relatives||[]),...s.friends,...s.rivals,...s.children,...(s.careerContacts||[]),...edu,...cap,...ex,...oldLove,...justice,...inlaws,...guardian,s.partner,...s.military.comrades].forEach(visit);return out;
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
  const base=Array.isArray(r.wealth)?rng(r.wealth[0],r.wealth[1]):rng(1,3),bonus=Math.floor(p.reputation/28),gain=Math.max(1,Math.round((base+bonus)*.55*careerDemandMultiplier(r.path)));
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
function ensureHealthProfile(){
 if(!s.healthProfile||typeof s.healthProfile!=='object'||Array.isArray(s.healthProfile))s.healthProfile={scars:[],frailty:0,resilience:50,healerVisits:0,restMonths:0,crises:0,lastCareYear:null,history:[]};
 const h=s.healthProfile;
 h.scars=Array.isArray(h.scars)?h.scars.slice(-12):[];h.frailty=clamp(Number.isFinite(h.frailty)?h.frailty:0);h.resilience=clamp(Number.isFinite(h.resilience)?h.resilience:50);
 h.healerVisits=Math.max(0,Math.floor(h.healerVisits||0));h.restMonths=Math.max(0,Math.floor(h.restMonths||0));h.crises=Math.max(0,Math.floor(h.crises||0));h.history=Array.isArray(h.history)?h.history.slice(-40):[];
 s.ailments=Array.isArray(s.ailments)?s.ailments:[];
 s.ailments=s.ailments.filter(x=>x&&AILMENTS[x.id]).map(x=>{const d=AILMENTS[x.id];return {id:x.id,remaining:Math.max(1,Math.floor(x.remaining??d.duration)),severity:Math.max(1,Math.min(4,Math.floor(x.severity??d.severity??1))),source:x.source||'',startedYear:x.startedYear??(s.year+s.age),treated:!!x.treated};});
 return h;
}
function healthHealer(create=true){
 ensureCareerSystems();ensureHealthProfile();let n=s.careerContacts.find(x=>x.statusFlags?.healthHealer&&x.alive);
 if(n||!create)return n||null;
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=Math.max(28,s.age+rng(8,24));
 n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(48,66),type:'Otacı',goal:'wisdom',role:'Otacı',prestige:rng(28,52),traits:['temkinli','merhametli']},'Otacı');
 n.statusFlags=n.statusFlags||{};n.statusFlags.healthHealer=true;normalizeBonds(n);n.bonds.trust=clamp(Math.max(n.bonds.trust,48));n.bonds.respect=clamp(Math.max(n.bonds.respect,55));rememberNPC(n,'health','Bakım ve iyileşme dönemlerinden birinde tanıştınız.',4);s.careerContacts.push(n);return n;
}
function scarName(scar){const loc=scar.location?scar.location+' ':'';return loc+(scar.kind==='battle'?'sefer yarası':scar.kind==='fall'?'düşme izi':scar.kind==='illness'?'hastalık sonrası zayıflık':'eski yara');}
function addScar(kind='injury',severity=1,source=''){
 const h=ensureHealthProfile(),locations=['omuzda','kolda','bacakta','sırtta'],scar={id:'scar_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),kind,severity:Math.max(1,Math.min(3,severity)),source,location:kind==='illness'?'':pick(locations),year:s.year+s.age,age:s.age,lastFlareYear:null};
 h.scars.push(scar);h.scars=h.scars.slice(-12);h.history.unshift({year:s.year+s.age,type:'scar',text:scarName(scar)});h.history=h.history.slice(0,40);
 if(kind==='battle')scheduleDelayedEvent({id:'old_wound_flare',years:[8,18],payload:{scarId:scar.id,detail:'Yıllar önceki '+scarName(scar)+' yeniden sızlamaya başladı.'}},{target:'none',sourceEventId:'battle_scar'});
 return scar;
}
function healthBurden(){
 const h=ensureHealthProfile(),active=s.ailments.reduce((sum,x)=>sum+(x.severity||1),0),scar=h.scars.reduce((sum,x)=>sum+(x.severity||1),0);
 return active*5+scar*2+h.frailty;
}
function acquireAilment(id,opts={}){
 const d=AILMENTS[id];if(!d||s.age<d.min)return null;ensureHealthProfile();let x=s.ailments.find(a=>a.id===id);
 const sev=Math.max(1,Math.min(4,Math.floor(opts.severity??d.severity??1))),dur=Math.max(1,Math.floor(opts.duration??d.duration));
 if(x){x.severity=Math.max(x.severity||1,sev);x.remaining=Math.max(x.remaining||1,dur);if(opts.source)x.source=opts.source;return x;}
 x={id,remaining:dur,severity:sev,source:opts.source||'',startedYear:s.year+s.age,treated:false};s.ailments.push(x);s.healthProfile.crises++;s.healthProfile.history.unshift({year:s.year+s.age,type:'ailment',text:d.name+' başladı'});s.healthProfile.history=s.healthProfile.history.slice(0,40);log(d.name+' yaşamını zorlaştırıyor.','bad');return x;
}
function finishAilment(x){
 const d=AILMENTS[x.id],h=ensureHealthProfile();if(!d)return;
 h.history.unshift({year:s.year+s.age,type:'recovery',text:d.name+' hafifledi'});h.history=h.history.slice(0,40);
 if(d.kind==='injury'&&x.severity>=3&&!h.scars.some(sc=>sc.source===x.source&&sc.year===x.startedYear))addScar(x.source==='battle'?'battle':'fall',x.severity>=4?2:1,x.source||d.name);
}
function tickHealthMonth(month){
 const h=ensureHealthProfile(),keep=[];
 for(const x of s.ailments){
  const d=AILMENTS[x.id];if(!d)continue;const sev=x.severity||d.severity||1,loss=Math.max(0,d.loss+Math.floor((sev-1)/2)+(h.frailty>=60?1:0));if(loss)apply({health:-loss});
  x.remaining--;if(x.remaining<=0)finishAilment(x);else keep.push(x);
 }
 s.ailments=keep;
 if(month>=10&&Math.random()<(.018+h.frailty/5000))acquireAilment('chill',{source:'kış soğuğu'});
 if(month===12&&s.age>=50&&Math.random()<Math.min(.5,.14+(s.age-50)*.008))acquireAilment('joints',{severity:s.age>=70?3:2,source:'yaşlılık'});
}
function healthAgeTick(){
 const h=ensureHealthProfile(),scarWeight=h.scars.reduce((a,x)=>a+(x.severity||1),0);
 h.frailty=clamp(Math.floor(Math.max(0,s.age-45)*1.15)+scarWeight*2+Math.max(0,45-s.health)/3);
 h.resilience=clamp(58-Math.floor(Math.max(0,s.age-35)/3)-scarWeight+(s.health>=80?5:0));
 if(s.age>=55&&h.scars.length&&Math.random()<Math.min(.35,.04+h.frailty/400)){
  const old=pick(h.scars);if(old&&(old.lastFlareYear==null||s.year+s.age-old.lastFlareYear>=4)){old.lastFlareYear=s.year+s.age;scheduleDelayedEvent({id:'old_wound_flare',years:[1,2],payload:{scarId:old.id,detail:'Eski '+scarName(old)+' yaş ilerledikçe yeniden kendini hatırlattı.'}},{target:'none',sourceEventId:'ageing'});}
 }
}
function healthRisk(){
 const h=ensureHealthProfile();let risk=0;if(s.health<25)risk+=.07;if(s.health<10)risk+=.18;if(s.age>50)risk+=(s.age-50)*.006;if(s.age>70)risk+=(s.age-70)*.016;
 risk+=Math.min(.12,healthBurden()/900);risk+=h.frailty>=70?.025:0;return Math.min(.75,Math.max(0,risk));
}
function mortality(){if(Math.random()<healthRisk())die();}
function treatHealth(useHealer=false){
 const h=ensureHealthProfile(),healer=useHealer?healthHealer(true):null;
 if(useHealer){s.wealth=Math.max(0,s.wealth-2);h.healerVisits++;h.lastCareYear=s.year+s.age;if(healer)adjustNPC(healer,{rel:3,trust:4,respect:2},'Bakım için yeniden görüştünüz.');apply({health:7,happiness:1});}
 else{h.restMonths++;h.lastCareYear=s.year+s.age;apply({health:4,happiness:1});}
 for(const x of s.ailments){x.remaining=Math.max(0,x.remaining-(useHealer?2:1));if(useHealer){x.severity=Math.max(1,x.severity-1);x.treated=true;}}
 const resolved=s.ailments.filter(x=>x.remaining<=0);resolved.forEach(finishAilment);s.ailments=s.ailments.filter(x=>x.remaining>0);
 if(useHealer&&h.scars.length&&Math.random()<.35){const sc=pick(h.scars);sc.severity=Math.max(1,sc.severity-1);}
}
function healthSummaryHtml(){
 const h=ensureHealthProfile(),healer=healthHealer(false),burden=healthBurden(),state=burden>=45?'Ağır':burden>=25?'Zorlanıyor':burden>=10?'Dikkat':'Dengeli';
 const active=s.ailments.length?s.ailments.map(x=>AILMENTS[x.id].name+' • '+x.remaining+' ay • '+x.severity+'. derece').join('<br>'):'Aktif rahatsızlık yok';
 const scars=h.scars.length?h.scars.slice(-4).map(x=>scarName(x)+' • iz '+x.severity).join('<br>'):'Kalıcı yara izi yok';
 return '<div class="card"><h3>🌿 Sağlık Geçmişi</h3><p>'+state+' • Yük '+burden+' • Dayanıklılık '+h.resilience+' • Kırılganlık '+h.frailty+'<br>'+active+'</p><div class="memoryline">'+scars+(healer?'<br>Bakım için tanıdığın kişi: '+safeText(healer.name)+' ('+healer.rel+')':'')+'</div></div>';
}




const SEASONAL_ACTIVITIES=[
 {id:'spring_move',age:8,months:[3,4],cat:'Mevsimlik',icon:'🌱',name:'Bahar Göçüne Katıl',desc:'Yeni otlağa geçişte aile ve sürü işlerine yardım et.',do:()=>{skillGain('riding',2);apply({health:1,happiness:2,skill:1});applyEconomyEffect({food:-4,trade:2});}},
 {id:'foal_training',age:12,months:[3,4,5],cat:'Mevsimlik',icon:'🐴',name:'Tayları Alıştır',desc:'Baharın genç atlarıyla sabır ve binicilik çalış.',req:()=>s.assets.includes('horse')||(s.skills.riding||0)>=20,do:()=>{skillGain('riding',3);apply({happiness:2,prestige:1});}},
 {id:'summer_hunt',age:12,months:[5,6,7],cat:'Mevsimlik',icon:'🏹',name:'Yaz Avına Çık',desc:'Uzun günlerde toplu ava katıl; sonuç becerine bağlı.',do:()=>{skillGain('archery',2);const ok=Math.random()<.35+(s.skills.archery||0)/160;if(ok){apply({wealth:rng(1,4),prestige:2,happiness:2});applyEconomyEffect({food:-3});}else apply({health:-1});}},
 {id:'summer_caravan',age:15,months:[4,5,6,7,8],cat:'Mevsimlik',icon:'🐫',name:'Geçen Kervanlara Katıl',desc:'Uzak malları, yolları ve tüccarları tanı.',do:()=>{skillGain('trade',3);addExperience('trade');apply({skill:1,prestige:1});applyEconomyEffect({trade:4});}},
 {id:'autumn_store',age:10,months:[8,9,10],cat:'Mevsimlik',icon:'🧺',name:'Kışlık Hazırla',desc:'Erzak, yem ve yakacak hazırlığı yap.',do:()=>{skillGain('trade',1);apply({skill:1,happiness:1});applyEconomyEffect({food:-8,market:-3});}},
 {id:'winter_hearth',age:6,months:[11,12,1,2],cat:'Mevsimlik',icon:'🔥',name:'Kış Ocağı Gecesine Katıl',desc:'Aile, komşular ve ozanlarla kapalı mevsimi geçir.',do:()=>{skillGain('speech',2);apply({happiness:4});const kin=[...s.parents,...s.siblings,...s.children,s.partner].filter(n=>n?.alive);if(kin.length)adjustNPC(pick(kin),{rel:3,trust:2},'Kış ocağında birlikte vakit geçirdiniz.');}},
 {id:'winter_repairs',age:12,months:[11,12,1,2],cat:'Mevsimlik',icon:'🪵',name:'Kışlık Onarım Yap',desc:'Eyer, çadır, araç ve günlük eşyaları elden geçir.',do:()=>{skillGain('craft',2);apply({skill:1});for(const id of s.assets.slice(0,2))assetState(id).condition=clamp(assetState(id).condition+4);}},
 {id:'elder_teach',age:50,months:[1,2,3,4,5,6,7,8,9,10,11,12],cat:'Tecrübe',icon:'🪶',name:'Gençlere Tecrübe Aktar',desc:'Bir ömürlük bilgiyi genç kuşağa bırak.',req:()=>[...s.children,...s.friends,...s.relatives].some(n=>n?.alive&&n.age>=8&&n.age<s.age),do:()=>{const pool=[...s.children,...s.friends,...s.relatives].filter(n=>n?.alive&&n.age>=8&&n.age<s.age);if(pool.length){const n=pick(pool);adjustNPC(n,{rel:4,trust:4,respect:6},'Ona yılların tecrübesini aktardın.');}skillGain('speech',1);apply({prestige:3,happiness:2});}}
];
const AMBITION_DEFS=[
 {id:'variety',title:'Farklı bir yıl yaşa',desc:'Bu yıl 5 farklı türde anlamlı eylem yap.',target:5,reward:{happiness:6,prestige:3},eligible:()=>s.age>=5},
 {id:'learn',title:'Bir alanda ilerle',desc:'4 ay talim veya öğrenme faaliyeti yap.',target:4,reward:{skill:5,prestige:2},eligible:()=>s.age>=7},
 {id:'kin',title:'Ocağını canlı tut',desc:'Aile veya yakınlarınla 4 anlamlı etkileşim kur.',target:4,reward:{happiness:6,prestige:2},eligible:()=>s.age>=6&&[...s.parents,...s.siblings,...s.children,s.partner].some(Boolean)},
 {id:'work',title:'Görevinde iz bırak',desc:'Görevinde 4 ay çalış.',target:4,reward:{prestige:5,wealth:3},eligible:()=>s.age>=10&&!!s.role},
 {id:'trade',title:'Takas yollarını öğren',desc:'Pazar, kervan veya işletmeyle 4 ay ilgilen.',target:4,reward:{wealth:5,skill:3},eligible:()=>s.age>=12},
 {id:'health',title:'Kendine bak',desc:'3 ay dinlenme veya otacı bakımı yap.',target:3,reward:{health:6,happiness:3},eligible:()=>s.age>=5&&(s.health<80||s.ailments.length>0)},
 {id:'venture',title:'Malını ayakta tut',desc:'İşletme yönetimi veya varlık bakımıyla 3 ay ilgilen.',target:3,reward:{wealth:5,prestige:2},eligible:()=>s.age>=18&&s.assets.some(id=>['flock','smithy','caravan_share'].includes(id))},
 {id:'season',title:'Mevsimi yaşa',desc:'3 farklı mevsimlik faaliyete katıl.',target:3,reward:{happiness:5,skill:3,prestige:2},eligible:()=>s.age>=8}
];









function ensureGuardianship(){
 if(!s.guardianship||typeof s.guardianship!=='object'||Array.isArray(s.guardianship))s.guardianship={};
 const g=s.guardianship;
 g.active=!!g.active;g.guardianId=g.guardianId||null;g.source=g.source||null;
 g.careQuality=clamp(Number.isFinite(g.careQuality)?g.careQuality:50);g.stability=clamp(Number.isFinite(g.stability)?g.stability:55);
 g.months=Math.max(0,Math.round(g.months||0));g.transitions=Math.max(0,Math.round(g.transitions||0));
 g.startedAge=g.startedAge??null;g.endedAge=g.endedAge??null;
 g.togetherSiblingIds=Array.isArray(g.togetherSiblingIds)?g.togetherSiblingIds:[];
 g.separatedSiblingIds=Array.isArray(g.separatedSiblingIds)?g.separatedSiblingIds:[];
 g.contacts=Array.isArray(g.contacts)?g.contacts:[];g.history=Array.isArray(g.history)?g.history.slice(-50):[];
 g.contacts=g.contacts.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Himaye Çevresi'));
 return g;
}
function guardianContact(id){return allNPCs().find(n=>n.id===id)||ensureGuardianship().contacts.find(n=>n.id===id)||null;}
function currentGuardian(){const g=ensureGuardianship();return g.guardianId?guardianContact(g.guardianId):null;}
function guardianCandidateScore(n){
 if(!n?.alive||n.age<18||n.id===s.id)return -999;
 normalizeNPC(n,n.type);const b=normalizeBonds(n);let v=(n.rel||0)*.42+b.trust*.28+b.respect*.08+(n.health||50)*.06+Math.min(18,(n.wealth||0)*.35),role=kinRole(n);
 if(['Dede','Nine'].includes(role))v+=18;
 if(['Amca','Dayı','Hala','Teyze','Amca / Dayı','Hala / Teyze'].includes(role))v+=14;
 if(['Erkek kardeş','Kız kardeş'].includes(role))v+=16;
 if(n.statusFlags?.familyFriend)v+=8;
 if(n.place===s.place)v+=12;else v-=5;if(n.realm===s.realm)v+=8;else v-=12;
 if(n.traits?.includes('merhametli'))v+=10;if(n.traits?.includes('sadik'))v+=7;if(n.traits?.includes('kinci'))v-=8;if(n.traits?.includes('kuskucu'))v-=4;
 return Math.round(v);
}
function guardianCandidates(){
 const seen=new Set(),pool=[],add=n=>{if(!n||seen.has(n.id))return;seen.add(n.id);if(n.alive&&n.age>=18)pool.push(n);};
 [...s.siblings,...(s.relatives||[]),...s.friends,...extendedFamilyVisible()].forEach(add);
 return pool.sort((a,b)=>guardianCandidateScore(b)-guardianCandidateScore(a));
}
function guardianCapacity(n){return Math.max(2,3+Math.floor((n?.wealth||0)/15)+(n?.traits?.includes('comert')?1:0));}
function guardianCareQuality(n){
 if(!n)return 30;const b=normalizeBonds(n);
 return clamp(Math.round(20+(n.rel||50)*.25+b.trust*.2+(n.health||60)*.12+Math.min(12,(n.wealth||0)*.3)+(n.traits?.includes('merhametli')?10:0)+(n.traits?.includes('sadik')?6:0)-(n.traits?.includes('kinci')?6:0)));
}
function createObaGuardian(){
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=rng(28,52);
 const n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(48,64),type:'Oba Koruyucusu',realm:s.realm,place:s.place,tribe:s.tribe,wealth:rng(8,30),prestige:rng(15,45),traits:['merhametli',pick(['sadik','sakin','caliskan'])]},'Oba Koruyucusu');
 n.statusFlags.guardianContact=true;n.statusFlags.familyFriend=true;normalizeBonds(n);n.bonds.trust=Math.max(n.bonds.trust,55);
 ensureGuardianship().contacts.push(n);if(!s.friends.some(x=>x.id===n.id))s.friends.push(n);return n;
}
function guardianWardPeers(guardian){
 const g=ensureGuardianship();let peers=g.contacts.filter(n=>n.statusFlags?.guardianWard&&n.statusFlags?.guardianId===guardian.id&&n.alive);
 const desired=Math.max(0,Math.min(2,guardianCapacity(guardian)-1-g.togetherSiblingIds.length)),cfg=D.realms[s.realm];
 while(peers.length<desired){
  const gender=pick(['male','female']),age=Math.max(1,Math.min(17,s.age+rng(-4,4)));
  const n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(42,60),type:'Himaye Yoldaşı',realm:s.realm,place:guardian.place||s.place,tribe:s.tribe},'Himaye Yoldaşı');
  n.statusFlags.guardianWard=true;n.statusFlags.guardianId=guardian.id;g.contacts.push(n);peers.push(n);
  adjustSocialLink(guardian,n,{score:35,trust:18,tag:'guardian'},'Aynı himaye ocağında yaşıyorlar.');
 }
 return peers;
}
function assignGuardian(reason='ebeveyn kaybı',preferredId=null){
 const g=ensureGuardianship();if(s.age>=18)return null;
 const aliveParents=s.parents.filter(n=>n.alive);if(aliveParents.length)return aliveParents[0];
 let guardian=preferredId?guardianContact(preferredId):null;
 if(!guardian?.alive||guardian.age<18)guardian=guardianCandidates()[0]||createObaGuardian();
 const old=currentGuardian();if(old?.id&&old.id!==guardian.id)g.transitions++;
 g.active=true;g.guardianId=guardian.id;g.source=['Dede','Nine','Amca','Dayı','Hala','Teyze','Amca / Dayı','Hala / Teyze','Erkek kardeş','Kız kardeş'].includes(kinRole(guardian))?'akraba':'oba';
 g.careQuality=guardianCareQuality(guardian);g.stability=clamp(45+Math.round(g.careQuality*.4));g.startedAge=g.startedAge??s.age;g.endedAge=null;g.months=0;
 const minorSibs=s.siblings.filter(n=>n.alive&&n.age<18),capacity=Math.max(0,guardianCapacity(guardian)-1);
 g.togetherSiblingIds=[];g.separatedSiblingIds=[];
 for(let k=0;k<minorSibs.length;k++){
  const sib=minorSibs[k];sib.statusFlags=sib.statusFlags||{};
  if(k<capacity){g.togetherSiblingIds.push(sib.id);sib.statusFlags.guardianId=guardian.id;sib.place=guardian.place||s.place;sib.realm=guardian.realm||s.realm;}
  else{g.separatedSiblingIds.push(sib.id);const alt=guardianCandidates().find(n=>n.id!==guardian.id&&guardianCapacity(n)>1);sib.statusFlags.guardianId=alt?.id||null;if(alt){sib.place=alt.place||sib.place;sib.realm=alt.realm||sib.realm;}}
 }
 s.place=guardian.place||s.place;s.realm=guardian.realm||s.realm;
 const h=ensureHousing();h.mode='hosted_yurt';h.hostId=guardian.id;h.comfort=clamp(40+Math.round(g.careQuality*.35));h.monthsUnsheltered=0;
 guardian.statusFlags=guardian.statusFlags||{};guardian.statusFlags.playerGuardian=true;
 adjustNPC(guardian,{rel:4,trust:6,respect:3},'Ebeveynlerini kaybettiğinde bakımını üstlendi.');rememberNPC(guardian,'guardian','Seni '+reason+' sonrasında himayesine aldı.',8);guardianWardPeers(guardian);
 g.history.unshift({year:s.year+s.age,age:s.age,type:'assigned',guardianId:guardian.id,reason,together:[...g.togetherSiblingIds],separated:[...g.separatedSiblingIds]});g.history=g.history.slice(0,50);
 log(safeText(guardian.name)+' '+reason+' sonrasında bakımını ve himayeni üstlendi.','major');
 if(g.separatedSiblingIds.length)log(g.separatedSiblingIds.length+' küçük kardeşin aynı yurtta kalamadı; farklı yakınların himayesine geçti.','bad');
 return guardian;
}
function endGuardianship(reason='himaye sona erdi'){
 const g=ensureGuardianship();if(!g.active)return;
 const n=currentGuardian();g.active=false;g.endedAge=s.age;g.history.unshift({year:s.year+s.age,age:s.age,type:'ended',guardianId:g.guardianId,reason});g.history=g.history.slice(0,50);
 if(n)rememberNPC(n,'guardian','Himaye dönemi sona erdi: '+reason+'.',5);
 log('Himaye dönemin sona erdi: '+reason+'.','major');
}
function ensureMinorGuardianship(reason='ebeveyn kaybı'){
 const g=ensureGuardianship();
 if(s.age>=18){if(g.active)endGuardianship('yetişkinliğe ulaştın');return;}
 const aliveParents=s.parents.filter(n=>n.alive);if(aliveParents.length){if(g.active)endGuardianship('yaşayan ebeveyn bakımını sürdürüyor');return;}
 const cur=currentGuardian();if(!g.active||!cur?.alive)assignGuardian(cur?.alive?'bakım düzeni değişikliği':reason);
}
function guardianshipAction(id,index=-1){
 const g=ensureGuardianship(),guardian=currentGuardian();if(!g.active||!guardian?.alive)return false;
 return performAction({kind:'guardianship',id,index},()=>{
  if(id==='time'){g.careQuality=clamp(g.careQuality+4);g.stability=clamp(g.stability+5);adjustNPC(guardian,{rel:6,trust:6},'Aynı yurtta birlikte sakin bir zaman geçirdiniz.');apply({happiness:3});}
  else if(id==='help'){g.stability=clamp(g.stability+4);adjustNPC(guardian,{rel:4,trust:3,respect:7},'Yurt işlerinde ona yardımcı oldun.');apply({skill:2});}
  else if(id==='learn'){const key=guardian.goal==='wisdom'?'literacy':guardian.goal==='war'?'combat':guardian.goal==='wealth'?'trade':guardian.goal==='mastery'?'craft':'speech';skillGain(key,3);adjustNPC(guardian,{rel:3,trust:4,respect:5},'Sana bildiği bir işi öğretmek için zaman ayırdı.');}
  else if(id==='remember'){adjustNPC(guardian,{rel:4,trust:6},'Anne ve atan hakkında seninle konuştu.');apply({happiness:2});g.history.unshift({year:s.year+s.age,age:s.age,type:'family_memory',guardianId:guardian.id});}
  else if(id==='visitSibling'){const sib=s.siblings.filter(n=>n.alive&&g.separatedSiblingIds.includes(n.id))[index];if(!sib)return;adjustNPC(sib,{rel:8,trust:6,grudge:-3},'Ayrı himaye ocaklarında yaşarken onu görmeye gittin.');apply({happiness:4});}
  else if(id==='change'){const alt=guardianCandidates().find(n=>n.id!==guardian.id&&guardianCandidateScore(n)>=guardianCandidateScore(guardian)+4);if(!alt){notice('Şu anda belirgin biçimde daha uygun başka bir koruyucu görünmüyor.');return;}assignGuardian('himaye değişikliği',alt.id);apply({happiness:1});}
 },id==='visitSibling'?'Ayrı yaşayan kardeşini görmekle bir ay geçti.':'Himaye ocağındaki yaşamına bir ay ayırdın.');
}
function tickGuardianshipMonth(action={}){
 const g=ensureGuardianship();
 if(s.age>=18||s.parents.some(n=>n.alive)){if(g.active)ensureMinorGuardianship();return;}
 if(!g.active||!currentGuardian()?.alive){ensureMinorGuardianship('koruyucu kaybı');return;}
 const guardian=currentGuardian();g.months++;
 const cared=action.kind==='guardianship'||(action.kind==='npc'&&getFamilyGroup(action.group)[action.index]?.id===guardian.id);
 if(cared)g.stability=clamp(g.stability+1);else if(g.months%4===0)g.stability=clamp(g.stability-1);
 g.careQuality=clamp(Math.round((g.careQuality*3+guardianCareQuality(guardian))/4));
 if(g.careQuality>=70&&g.months%3===0){apply({happiness:1});if(s.health<80)apply({health:1});}
 if(g.careQuality<40&&g.months%3===0){apply({happiness:-2});if(g.careQuality<28)apply({health:-1});}
 if(g.stability<30&&g.months%6===0)adjustNPC(guardian,{trust:-1,rel:-1},'Himaye düzeniniz uzun süredir istikrarsız ilerliyor.');
}
function guardianshipYearTick(){
 const g=ensureGuardianship();
 if(s.age>=18){if(g.active)endGuardianship('yetişkinliğe ulaştın');return;}
 ensureMinorGuardianship();if(!g.active)return;
 const guardian=currentGuardian();if(guardian&&g.careQuality>=65){normalizeBonds(guardian);guardian.bonds.trust=clamp(guardian.bonds.trust+2);if(s.age>=12&&guardian.traits?.includes('caliskan'))apply({skill:1});}
 if(g.separatedSiblingIds.length)for(const sib of s.siblings.filter(n=>g.separatedSiblingIds.includes(n.id)&&n.alive)){sib.rel=clamp(sib.rel-1);normalizeBonds(sib);sib.bonds.trust=clamp(sib.bonds.trust-1);}
}
function guardianshipSummaryHtml(){
 const g=ensureGuardianship();if(!g.active||s.age>=18)return '';const n=currentGuardian();if(!n)return '';
 const peers=g.contacts.filter(x=>x.alive&&x.statusFlags?.guardianWard&&x.statusFlags?.guardianId===n.id),separated=s.siblings.filter(x=>x.alive&&g.separatedSiblingIds.includes(x.id));
 let html='<div class="card"><h3>🫱 Himaye ve Koruyuculuk</h3><p><b>'+safeText(n.name)+'</b> • '+safeText(kinRole(n))+'<br>Bakım kalitesi '+g.careQuality+'/100 • istikrar '+g.stability+'/100 • '+g.months+' ay<br>Aynı yurtta küçük kardeş '+g.togetherSiblingIds.length+' • ayrı yaşayan kardeş '+separated.length+(peers.length?' • himaye yoldaşı '+peers.length:'')+'</p><div class="grid2">'+
  actionButton('Birlikte vakit geçir',{kind:'guardianship',id:'time'},"guardianshipAction('time')",'Koruyucu bağını ve istikrarı güçlendirir.')+
  actionButton('Yurt işlerine yardım et',{kind:'guardianship',id:'help'},"guardianshipAction('help')",'Saygı, beceri ve hane istikrarı.')+
  actionButton('Ondan bir şey öğren',{kind:'guardianship',id:'learn'},"guardianshipAction('learn')",'Koruyucunun hayat yoluna göre beceri kazandırır.')+
  actionButton('Anne ve atanı konuş',{kind:'guardianship',id:'remember'},"guardianshipAction('remember')",'Aile hafızasını ve güveni güçlendirir.')+
  (guardianCandidates().some(x=>x.id!==n.id&&guardianCandidateScore(x)>=guardianCandidateScore(n)+4)?actionButton('Başka bir yakının himayesini iste',{kind:'guardianship',id:'change'},"guardianshipAction('change')",'Daha uygun bir yakın varsa bakım düzeni değişebilir.'):'')+
 '</div></div>';
 if(separated.length)html+='<h3 class="sectionTitle">Ayrı Yaşayan Kardeşler</h3><div class="grid2">'+separated.map((sib,i)=>actionButton(safeText(sib.name)+' ile görüş',{kind:'guardianship',id:'visitSibling',index:i},"guardianshipAction('visitSibling',"+i+")",'Ayrı himaye ocaklarında bağın zayıflamasını azaltır.')).join('')+'</div>';
 return html;
}
function applyGuardianshipEvent(eventId,choiceIndex,target){
 const g=ensureGuardianship();if(!g.active)return;
 if(eventId==='guardian_household_strain'){if(choiceIndex===0){g.stability=clamp(g.stability+8);g.careQuality=clamp(g.careQuality+3);}else g.stability=clamp(g.stability-7);}
 if(eventId==='guardian_family_memory'&&choiceIndex===0)g.stability=clamp(g.stability+4);
 if(eventId==='guardian_sibling_distance'){if(choiceIndex===0)g.stability=clamp(g.stability+3);else if(target)adjustNPC(target,{rel:-2,trust:-2},'Ayrı yaşadığınız için görüşmeniz daha da seyrekleşti.');}
}



const PARENTING_PATHS={
 war:{name:'At ve savaş yolu',goal:'war',skills:['riding','archery','combat'],traits:['cesur','caliskan']},
 craft:{name:'Usta ve zanaat yolu',goal:'mastery',skills:['craft'],traits:['caliskan','tutumlu']},
 wisdom:{name:'Bitig ve söz yolu',goal:'wisdom',skills:['literacy','speech'],traits:['sakin','konuskan']},
 trade:{name:'Takas ve kervan yolu',goal:'wealth',skills:['trade','speech'],traits:['tutumlu','hirsli']},
 family:{name:'Ocak ve oba yolu',goal:'family',skills:['riding','trade'],traits:['sadik','merhametli']},
 free:{name:'Kendi yolunu seçsin',goal:null,skills:[],traits:[]}
};
function ensureParenting(){
 if(!s.parenting||typeof s.parenting!=='object'||Array.isArray(s.parenting))s.parenting={};
 const p=s.parenting;p.children=p.children&&typeof p.children==='object'&&!Array.isArray(p.children)?p.children:{};p.history=Array.isArray(p.history)?p.history.slice(-80):[];p.monthsParenting=Math.max(0,Math.round(p.monthsParenting||0));p.familyStyle=p.familyStyle||'balanced';
 for(const c of s.children||[])if(c)ensureChildProfile(c);
 return p;
}
function childProfile(childOrId){
 const id=typeof childOrId==='string'?childOrId:childOrId?.id;if(!id)return null;ensureParenting();return s.parenting.children[id]||null;
}
function ensureChildProfile(c){
 if(!c)return null;if(!Array.isArray(c.parentIds)||!c.parentIds.length)c.parentIds=[s.id,...(s.partner?.id?[s.partner.id]:[])];if(!s.parenting||typeof s.parenting!=='object'||Array.isArray(s.parenting))s.parenting={children:{},history:[],monthsParenting:0,familyStyle:'balanced'};
 s.parenting.children=s.parenting.children&&typeof s.parenting.children==='object'&&!Array.isArray(s.parenting.children)?s.parenting.children:{};
 let p=s.parenting.children[c.id];
 if(!p)p=s.parenting.children[c.id]={childId:c.id,bornYear:c.birthYear??(s.year+s.age-c.age),warmth:55,discipline:45,freedom:45,expectation:40,attention:55,wellbeing:65,neglectMonths:0,rivalry:0,guidance:'free',careMonths:0,teachingMonths:0,disciplineMonths:0,listeningMonths:0,milestones:[],history:[]};
 for(const k of ['warmth','discipline','freedom','expectation','attention','wellbeing','rivalry'])p[k]=clamp(Number.isFinite(p[k])?p[k]:50);
 for(const k of ['neglectMonths','careMonths','teachingMonths','disciplineMonths','listeningMonths'])p[k]=Math.max(0,Math.round(p[k]||0));
 p.guidance=PARENTING_PATHS[p.guidance]?p.guidance:'free';p.milestones=Array.isArray(p.milestones)?p.milestones:[];p.history=Array.isArray(p.history)?p.history.slice(-30):[];
 return p;
}
function parentingStyleLabel(p){
 if(!p)return 'Belirsiz';if(p.warmth>=65&&p.discipline>=45&&p.freedom>=45)return 'Dengeli ve ilgili';
 if(p.warmth>=70&&p.discipline<35)return 'Şefkatli ve serbest';
 if(p.discipline>=70&&p.warmth<45)return 'Sert ve kuralcı';
 if(p.expectation>=70)return 'Beklentisi yüksek';
 if(p.freedom>=70)return 'Özgürlük tanıyan';
 if(p.attention<35)return 'Uzak ve ihmal riski yüksek';return 'Değişken';
}
function childLearningSkill(c,key,amount){
 c.skills=c.skills||{};c.skills[key]=clamp((c.skills[key]||0)+amount);
}
function replaceChildTrait(c,trait){
 if(!NPC_TRAITS[trait])return;c.traits=Array.isArray(c.traits)?c.traits:[];
 if(c.traits.includes(trait))return;
 const opposite={kinci:'bagislayici',bagislayici:'kinci',cesur:'temkinli',temkinli:'cesur',comert:'tutumlu',tutumlu:'comert',hirsli:'sakin',sakin:'hirsli'}[trait];
 c.traits=c.traits.filter(x=>x!==opposite).slice(0,1);c.traits.push(trait);
}
function applyParentingDevelopment(c,p,age){
 if(!c||!p)return;
 if(age===5){
  if(p.warmth>=65){replaceChildTrait(c,'merhametli');adjustNPC(c,{trust:5,rel:3},'Çocukluğunda sıcak ve güvenli bir bakım gördü.');}
  if(p.attention<35){replaceChildTrait(c,'kuskucu');adjustNPC(c,{trust:-5,grudge:3},'Küçük yaşlarında yeterince ilgi görmediğini hissetti.');}
 }
 if(age===8){
  if(p.discipline>=65&&p.warmth>=50)replaceChildTrait(c,'caliskan');
  else if(p.discipline>=70&&p.warmth<45){replaceChildTrait(c,'temkinli');normalizeBonds(c).fear=clamp(c.bonds.fear+8);}
  if(p.freedom>=65)replaceChildTrait(c,'konuskan');
 }
 if(age===12){
  const path=PARENTING_PATHS[p.guidance];if(path?.goal)c.goal=path.goal;
  for(const k of path?.skills||[])childLearningSkill(c,k,Math.max(2,Math.round(p.teachingMonths/4)));
  if(p.expectation>=65)replaceChildTrait(c,'hirsli');
 }
 if(age===16){
  if(p.wellbeing>=70&&p.warmth>=60)replaceChildTrait(c,'sadik');
  if(p.rivalry>=55)normalizeBonds(c).grudge=clamp(c.bonds.grudge+7);
  if(p.freedom>=60&&p.guidance==='free')c.goal=chooseNPCGoal(c);
 }
 if(age===18){
  const path=PARENTING_PATHS[p.guidance];if(path?.goal)c.goal=path.goal;
  for(const t of path?.traits||[])if(Math.random()<.55)replaceChildTrait(c,t);
  c.prestige=clamp((c.prestige||0)+Math.round((p.wellbeing+p.expectation-80)/18));
  normalizeBonds(c).trust=clamp(c.bonds.trust+Math.round((p.warmth+p.attention-100)/12));
  c.role=npcCareerFor(c);rememberNPC(c,'upbringing','Yetişkinliğe '+parentingStyleLabel(p).toLowerCase()+' bir aile ortamından çıktı.',7);
 }
 p.milestones.push({age,year:s.year+s.age,style:parentingStyleLabel(p),guidance:p.guidance,wellbeing:p.wellbeing});p.milestones=p.milestones.slice(-12);
}
function parentingMilestone(c,oldAge){
 if(!c||!s.children.some(x=>x.id===c.id))return;const p=ensureChildProfile(c);
 for(const age of [5,8,12,16,18])if(c.age>=age&&oldAge<age&&!p.milestones.some(x=>x.age===age)){applyParentingDevelopment(c,p,age);log(safeText(c.name)+' '+age+' yaşına geldi; yetişme biçiminizin izleri belirginleşiyor.','major');}
}
function siblingRivalryPairs(){
 const living=s.children.filter(c=>c.alive&&c.age<18),out=[];for(let i=0;i<living.length;i++)for(let j=i+1;j<living.length;j++){const a=ensureChildProfile(living[i]),b=ensureChildProfile(living[j]),link=socialLinkBetween(living[i],living[j],true,{tags:['kin']});out.push({a:living[i],b:living[j],heat:Math.round((a.rivalry+b.rivalry)/2)+Math.max(0,-link.score)});}return out;
}
function updateSiblingRivalry(){
 const kids=s.children.filter(c=>c.alive&&c.age<18);if(kids.length<2)return;
 const attention=kids.map(c=>ensureChildProfile(c).attention),max=Math.max(...attention),min=Math.min(...attention);
 for(const c of kids){const p=ensureChildProfile(c);if(max-min>=22&&p.attention===min)p.rivalry=clamp(p.rivalry+3);else if(p.rivalry>0&&Math.random()<.25)p.rivalry=clamp(p.rivalry-1);}
 for(const {a,b,heat} of siblingRivalryPairs())if(heat>=45&&Math.random()<.08)adjustSocialLink(a,b,{score:-2,grudge:1,tag:'kin'},'Kardeşler arasında ilgi ve beklenti farkı gerginlik yarattı.');
}
function parentingAction(index,id,path=null){
 const c=s.children[index];if(!c?.alive||c.age>=18)return false;const p=ensureChildProfile(c);
 return performAction({kind:'parenting',index,id,path},()=>{
  s.parenting.monthsParenting++;
  if(id==='care'){p.warmth=clamp(p.warmth+8);p.attention=clamp(p.attention+10);p.wellbeing=clamp(p.wellbeing+6);p.neglectMonths=0;p.careMonths++;adjustNPC(c,{rel:6,trust:7,grudge:-3},'Onun bakımına ve ihtiyaçlarına özel zaman ayırdın.');if(c.age<8)c.health=clamp(c.health+2);}
  else if(id==='teach'){p.expectation=clamp(p.expectation+5);p.attention=clamp(p.attention+6);p.wellbeing=clamp(p.wellbeing+2);p.neglectMonths=0;p.teachingMonths++;const g=PARENTING_PATHS[p.guidance]||PARENTING_PATHS.free,k=g.skills?.length?pick(g.skills):pick(['riding','speech','trade']);childLearningSkill(c,k,3);adjustNPC(c,{rel:3,trust:3,respect:5},'Bir işi sabırla öğretmek için onunla çalıştın.');}
  else if(id==='discipline'){p.discipline=clamp(p.discipline+9);p.expectation=clamp(p.expectation+3);p.disciplineMonths++;const gentle=p.warmth>=50;adjustNPC(c,{respect:7,trust:gentle?1:-4,fear:gentle?1:6,grudge:gentle?0:3},gentle?'Sınırları açıklayıp tutarlı davrandın.':'Kuralları sert biçimde uyguladın.');if(!gentle)p.wellbeing=clamp(p.wellbeing-3);}
  else if(id==='listen'){p.freedom=clamp(p.freedom+8);p.warmth=clamp(p.warmth+4);p.attention=clamp(p.attention+7);p.wellbeing=clamp(p.wellbeing+4);p.neglectMonths=0;p.listeningMonths++;adjustNPC(c,{rel:5,trust:7,respect:2,grudge:-2},'Ne istediğini dinleyip fikrine değer verdin.');}
  else if(id==='guide'){const g=PARENTING_PATHS[path];if(!g)return;p.guidance=path;p.expectation=clamp(p.expectation+(path==='free'?-5:5));p.freedom=clamp(p.freedom+(path==='free'?8:-2));if(g.goal)c.goal=g.goal;for(const k of g.skills)childLearningSkill(c,k,2);rememberNPC(c,'guidance',(g.name||'Kendi yolu')+' yönünde yetişmesi için karar verdiniz.',6);}
  else if(id==='mediate'){const pairs=siblingRivalryPairs().filter(x=>x.a.id===c.id||x.b.id===c.id);for(const pair of pairs){const other=pair.a.id===c.id?pair.b:pair.a,op=ensureChildProfile(other);p.rivalry=clamp(p.rivalry-14);op.rivalry=clamp(op.rivalry-14);adjustSocialLink(c,other,{score:8,trust:4,grudge:-6,tag:'kin'},'Kardeşler arasındaki gerilimi birlikte konuştunuz.');}p.attention=clamp(p.attention+4);adjustNPC(c,{trust:3,rel:2},'Kardeşleriyle arasındaki meseleyi çözmesine yardım ettin.');}
  p.history.unshift({year:s.year+s.age,age:c.age,id,path,style:parentingStyleLabel(p)});p.history=p.history.slice(0,30);
 },safeText(c.name)+' ile ebeveynlik ve yetişme için bir ay geçirdin.');
}
function tickParentingMonth(action={}){
 const par=ensureParenting(),kids=s.children.filter(c=>c.alive&&c.age<18);if(!kids.length)return;
 for(let i=0;i<s.children.length;i++){const c=s.children[i];if(!c?.alive||c.age>=18)continue;const p=ensureChildProfile(c),direct=action.kind==='parenting'&&action.index===i,normal=action.kind==='npc'&&action.group==='children'&&action.index===i;
  if(direct||normal){p.neglectMonths=0;p.attention=clamp(p.attention+2);}else{p.neglectMonths++;if(p.neglectMonths>=4&&p.neglectMonths%3===1){p.attention=clamp(p.attention-3);p.wellbeing=clamp(p.wellbeing-2);if(p.neglectMonths>=10)adjustNPC(c,{rel:-1,trust:-2},'Uzun süre sana yeterince zaman ayıramadığını hissetti.');}}
 }
 updateSiblingRivalry();
}
function parentingYearTick(){
 for(const c of s.children.filter(c=>c.alive&&c.age<18)){const p=ensureChildProfile(c);if(p.warmth>=60&&p.attention>=55)p.wellbeing=clamp(p.wellbeing+2);if(p.neglectMonths>=9)p.wellbeing=clamp(p.wellbeing-5);if(p.discipline>=75&&p.warmth<40)p.wellbeing=clamp(p.wellbeing-3);}
}
function parentingSummaryHtml(){
 ensureParenting();const kids=s.children.filter(c=>c.alive&&c.age<18);if(!kids.length)return '';
 let html='<div class="card"><h3>🪶 Ebeveynlik</h3><p>Her çocuğun bakım, sıcaklık, disiplin, özgürlük, beklenti ve ilgi geçmişi ayrı tutulur. Bu değerler yaş dönümlerinde kişiliğine, güvenine, becerisine ve yetişkin yoluna yansır.</p></div><div class="grid2">';
 html+=kids.map(c=>{const i=s.children.findIndex(x=>x.id===c.id),p=ensureChildProfile(c),path=PARENTING_PATHS[p.guidance],rival=p.rivalry>=45?' • ⚠ kardeş rekabeti '+p.rivalry:'';return '<div class="card"><h3>'+safeText(c.name)+' • '+c.age+' yaş</h3><p>'+safeText(parentingStyleLabel(p))+'<br>Sıcaklık '+p.warmth+' • disiplin '+p.discipline+' • özgürlük '+p.freedom+'<br>İlgi '+p.attention+' • iyi oluş '+p.wellbeing+' • beklenti '+p.expectation+rival+'<br>Yön: '+safeText(path.name)+'</p><div class="actions"><button class="mini" onclick="parentingAction('+i+',\'care\')">Bakımına zaman ayır</button><button class="mini" onclick="parentingAction('+i+',\'teach\')">Bir şey öğret</button><button class="mini" onclick="parentingAction('+i+',\'listen\')">Dinle</button><button class="mini" onclick="parentingAction('+i+',\'discipline\')">Sınır koy</button>'+(s.children.filter(x=>x.alive&&x.age<18).length>1?'<button class="mini" onclick="parentingAction('+i+',\'mediate\')">Kardeş gerilimini çöz</button>':'')+'</div><div class="actions">'+Object.entries(PARENTING_PATHS).map(([id,g])=>'<button class="mini '+(p.guidance===id?'active':'')+'" onclick="parentingAction('+i+',\'guide\','+JSON.stringify(id)+')">'+safeText(g.name)+'</button>').join('')+'</div></div>';}).join('');
 return html+'</div>';
}
function applyParentingEvent(eventId,choiceIndex,target){
 if(!target||!s.children.some(c=>c.id===target.id))return;const p=ensureChildProfile(target);
 if(eventId==='parenting_child_lie'){if(choiceIndex===0){p.discipline=clamp(p.discipline+5);p.warmth=clamp(p.warmth+3);p.wellbeing=clamp(p.wellbeing+2);}else{p.discipline=clamp(p.discipline+9);p.warmth=clamp(p.warmth-4);p.wellbeing=clamp(p.wellbeing-3);}}
 if(eventId==='parenting_child_choice'){if(choiceIndex===0){p.freedom=clamp(p.freedom+8);p.attention=clamp(p.attention+4);}else{p.expectation=clamp(p.expectation+7);p.freedom=clamp(p.freedom-3);}}
 if(eventId==='parenting_sibling_conflict'){for(const x of s.children.filter(c=>c.alive&&c.id!==target.id)){const op=ensureChildProfile(x);if(choiceIndex===0){p.rivalry=clamp(p.rivalry-10);op.rivalry=clamp(op.rivalry-6);}else{p.rivalry=clamp(p.rivalry+8);}}}
 if(eventId==='child_training_choice'){
  p.guidance=choiceIndex===0?'war':choiceIndex===1?'craft':'free';p.expectation=clamp(p.expectation+(choiceIndex===2?-4:7));p.freedom=clamp(p.freedom+(choiceIndex===2?8:-2));
  p.history.unshift({year:s.year+s.age,age:target.age,id:'story_guidance',path:p.guidance,style:parentingStyleLabel(p)});p.history=p.history.slice(0,30);
 }
}

function ensureExtendedFamily(){
 if(!s.extendedFamily||typeof s.extendedFamily!=='object'||Array.isArray(s.extendedFamily))s.extendedFamily={};
 const e=s.extendedFamily;e.inLaws=Array.isArray(e.inLaws)?e.inLaws:[];e.history=Array.isArray(e.history)?e.history.slice(-60):[];e.reunions=Math.max(0,Math.round(e.reunions||0));e.lastReunionYear=e.lastReunionYear??null;e.supportGiven=Math.max(0,Math.round(e.supportGiven||0));e.supportReceived=Math.max(0,Math.round(e.supportReceived||0));e.branchLimit=Math.max(50,Math.min(120,Math.round(e.branchLimit||90)));e.partnerFamilyFor=e.partnerFamilyFor||null;
 e.inLaws=e.inLaws.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Kayın Akraba'));
 return e;
}
function extendedFamilyCount(){return allNPCs().length;}
function familyBranchCanGrow(){return extendedFamilyCount()<ensureExtendedFamily().branchLimit;}
function inLawById(id){return ensureExtendedFamily().inLaws.find(n=>n.id===id)||null;}
function partnerFamilyRoots(){return ensureExtendedFamily().inLaws.filter(n=>n.statusFlags?.inLawRoot);}
function ensurePartnerFamily(force=false){
 const e=ensureExtendedFamily(),p=s.partner;if(!p?.alive)return e.inLaws;
 if(!force&&e.partnerFamilyFor===p.id&&e.inLaws.some(n=>n.alive))return e.inLaws;
 if(e.partnerFamilyFor&&e.partnerFamilyFor!==p.id)e.inLaws=e.inLaws.filter(n=>n.statusFlags?.legacyInLaw);
 const cfg=D.realms[p.realm||s.realm],year=s.year+s.age,roots=[];
 const parentIds=[];
 for(const [gender,type] of [['male','Kayın Ata'],['female','Kayın Ana']]){
  const age=Math.max(p.age+18,p.age+rng(20,34)),n=normalizeNPC({name:pick(cfg[gender]),gender,type,age,birthYear:year-age,alive:true,rel:rng(42,68),realm:p.realm||s.realm,place:p.place||s.place,tribe:p.tribe||pick(cfg.tribes),prestige:rng(5,40)},type);
  n.statusFlags.inLaw=true;n.statusFlags.inLawRoot=true;n.statusFlags.partnerFamilyFor=p.id;roots.push(n);parentIds.push(n.id);
 }
 roots[0].partner={id:roots[1].id,name:roots[1].name,gender:roots[1].gender,age:roots[1].age,alive:true,health:roots[1].health};
 roots[1].partner={id:roots[0].id,name:roots[0].name,gender:roots[0].gender,age:roots[0].age,alive:true,health:roots[0].health};
 p.parentIds=parentIds;
 const sibs=[];
 for(let i=0;i<rng(0,3);i++){
  const g=pick(['male','female']),age=Math.max(8,p.age+rng(-8,8)),type=g==='male'?'Kayın Birader':'Baldız / Görümce';
  const n=normalizeNPC({name:pick(cfg[g]),gender:g,type,age,birthYear:year-age,alive:true,rel:rng(38,68),parentIds:[...parentIds],realm:p.realm||s.realm,place:p.place||s.place,tribe:p.tribe||s.tribe},type);
  n.statusFlags.inLaw=true;n.statusFlags.partnerFamilyFor=p.id;sibs.push(n);
 }
 e.inLaws.push(...roots,...sibs);e.partnerFamilyFor=p.id;
 for(const n of roots)adjustSocialLink(p,n,{score:65,trust:18,tag:'kin'},'Aynı aile ocağının bağı.');
 for(const n of sibs)adjustSocialLink(p,n,{score:rng(45,65),trust:12,tag:'kin'},'Kardeşlik bağı.');
 return e.inLaws;
}
function markFormerInLaws(partnerId){
 const e=ensureExtendedFamily();for(const n of e.inLaws.filter(x=>x.statusFlags?.partnerFamilyFor===partnerId)){n.statusFlags.legacyInLaw=true;n.statusFlags.inLaw=false;if(!n.type.startsWith('Eski '))n.type='Eski '+n.type;}
 if(e.partnerFamilyFor===partnerId)e.partnerFamilyFor=null;
}
function playerParentIds(){return s.parents.map(n=>n.id);}
function kinRole(n){
 if(!n)return 'Akraba';if(n===s.partner||n.id===s.partner?.id)return s.married?'Eş':'Eş adayı';
 if(s.parents.some(x=>x.id===n.id))return n.gender==='male'?'Ata':'Ana';
 if(s.siblings.some(x=>x.id===n.id))return n.gender==='male'?'Erkek kardeş':'Kız kardeş';
 if(s.children.some(x=>x.id===n.id))return 'Çocuk';
 if(ensureExtendedFamily().inLaws.some(x=>x.id===n.id))return n.type||'Kayın Akraba';
 if(n.parentIds?.includes(s.id))return 'Çocuk';
 if(s.children.some(c=>n.parentIds?.includes(c.id)))return 'Torun';
 if(s.children.some(c=>(c.descendants||[]).some(gc=>n.parentIds?.includes(gc.id))))return 'Torunun Çocuğu';
 if(s.siblings.some(x=>n.parentIds?.includes(x.id)))return 'Yeğen';
 const pids=playerParentIds();if(n.parentIds?.some(id=>pids.includes(id)))return n.gender==='male'?'Erkek kardeş':'Kız kardeş';
 for(const p of s.parents){
  if(n.parentIds?.some(id=>p.parentIds?.includes(id)))return n.gender==='male'?(p.gender==='male'?'Amca':'Dayı'):(p.gender==='male'?'Hala':'Teyze');
 }
 const uncleAunts=(s.relatives||[]).filter(x=>['Amca','Dayı','Hala','Teyze','Amca / Dayı','Hala / Teyze'].includes(x.type));
 if(uncleAunts.some(a=>n.parentIds?.includes(a.id)))return 'Kuzen';
 const gps=(s.relatives||[]).filter(x=>['Dede','Nine'].includes(x.type));if(gps.some(g=>g.id===n.id))return n.gender==='male'?'Dede':'Nine';
 return n.type||'Akraba';
}
function refreshKinRoles(){
 for(const n of [...(s.relatives||[]),...s.children,...s.siblings])if(n)n.displayKinRole=kinRole(n);
 for(const n of ensureExtendedFamily().inLaws)if(n)n.displayKinRole=n.type;
}
function extendedFamilyVisible(){
 refreshKinRoles();const seen=new Set(),out=[];const add=n=>{if(!n||seen.has(n.id)||[...s.parents,...s.siblings,...s.children,s.partner].filter(Boolean).some(x=>x.id===n.id))return;seen.add(n.id);out.push(n);};
 for(const r of s.relatives||[]){add(r);for(const d of r.descendants||[])add(d);}
 for(const sib of s.siblings||[])for(const d of sib.descendants||[])add(d);
 for(const c of s.children||[])for(const d of c.descendants||[]){add(d);for(const gg of d.descendants||[])add(gg);}
 for(const n of ensureExtendedFamily().inLaws)add(n);
 return out;
}
function familyReunionGuests(){return [...s.parents,...s.siblings,...s.children,...extendedFamilyVisible(),...(s.partner?[s.partner]:[])].filter(n=>n?.alive&&n.place===s.place&&n.realm===s.realm);}
function extendedFamilyAction(id,index=-1){
 if(id==='reunion'){
  return performAction({kind:'extendedFamily',id},()=>{
   const e=ensureExtendedFamily(),guests=familyReunionGuests().slice(0,24);e.reunions++;e.lastReunionYear=s.year+s.age;
   let good=0,bad=0;for(const n of guests){normalizeNPC(n,n.type);if((n.bonds?.grudge||0)>45){adjustNPC(n,{rel:-1,grudge:-3},'Büyük aile buluşmasında eski mesele biraz yumuşadı.');bad++;}else{adjustNPC(n,{rel:3,trust:2},'Büyük aile buluşmasında birlikte vakit geçirdiniz.');good++;}}
   for(let i=0;i<guests.length;i++)for(let j=i+1;j<Math.min(guests.length,i+5);j++)if(Math.random()<.25)adjustSocialLink(guests[i],guests[j],{score:2,trust:1,tag:'kin'},'Aile buluşmasında görüştüler.');
   e.history.unshift({year:s.year+s.age,age:s.age,type:'reunion',guests:guests.map(n=>n.id),good,bad});e.history=e.history.slice(0,60);apply({happiness:Math.min(6,2+Math.floor(good/5)),prestige:guests.length>=8?2:1});log(guests.length+' yakının katıldığı büyük bir aile buluşması yaptın.','major');
  },'Aile buluşmasıyla bir ay geçti.');
 }
 const n=extendedFamilyVisible()[index];if(!n?.alive)return false;
 if(id==='support'){
  return performAction({kind:'extendedFamily',id,index},()=>{if(s.wealth<3)return; s.wealth-=3;ensureExtendedFamily().supportGiven+=3;adjustNPC(n,{rel:7,trust:8,respect:4,grudge:-4},'Zor zamanında ona aile desteği verdin.');rememberNPC(n,'kin_support','Aile desteğini unutmadı.',5);},safeText(n.name)+' için aile desteğine bir ay ayırdın.');
 }
 if(id==='ask_help'){
  return performAction({kind:'extendedFamily',id,index},()=>{const b=normalizeBonds(n),chance=Math.min(.9,.18+(n.rel||0)/180+b.trust/220-(b.grudge||0)/160);if(Math.random()<chance){const gain=Math.max(1,Math.min(8,Math.floor((n.wealth||5)/5)+1));s.wealth+=gain;n.wealth=Math.max(0,(n.wealth||0)-gain);ensureExtendedFamily().supportReceived+=gain;adjustNPC(n,{rel:2,trust:2,respect:1},'Sana aile desteği verdi.');log(safeText(n.name)+' '+gain+' servetlik destek verdi.','good');}else{adjustNPC(n,{rel:-2,trust:-1},'Bu kez yardım isteğini karşılayamadı.');log(safeText(n.name)+' bu kez yardım edemedi.');}},'Akrabandan destek istemekle bir ay geçti.');
 }
}
function maybeExtendedInheritance(n){
 if(!n||n.statusFlags?.inheritanceHandled)return;n.statusFlags=n.statusFlags||{};n.statusFlags.inheritanceHandled=true;
 const role=kinRole(n),eligible=['Dede','Nine','Amca','Dayı','Hala','Teyze','Kayın Ata','Kayın Ana'].some(x=>role.includes(x));if(!eligible||n.wealth<12||(n.rel||0)<60)return;
 const amount=Math.max(1,Math.min(12,Math.round(n.wealth*(.12+(n.rel||0)/500))));if(amount<=0)return;s.wealth+=amount;n.wealth=Math.max(0,n.wealth-amount);ensureExtendedFamily().history.unshift({year:s.year+s.age,age:s.age,type:'inheritance',from:n.id,amount});log(safeText(n.name)+' ardından aile payından '+amount+' servet sana kaldı.','major');
}
function extendedFamilySummaryHtml(){
 const e=ensureExtendedFamily(),visible=extendedFamilyVisible(),living=visible.filter(n=>n.alive),inlaws=e.inLaws.filter(n=>n.alive&&!n.statusFlags?.legacyInLaw),cousins=living.filter(n=>kinRole(n)==='Kuzen').length,nieces=living.filter(n=>kinRole(n)==='Yeğen').length,grand=living.filter(n=>['Torun','Torunun Çocuğu'].includes(kinRole(n))).length;
 let html='<div class="card"><h3>🌿 Geniş Aile</h3><p>Yaşayan geniş aile '+living.length+' • kuzen '+cousins+' • yeğen '+nieces+' • torun ve sonrası '+grand+' • kayın aile '+inlaws.length+'<br>Aile buluşması '+e.reunions+' • verilen destek '+e.supportGiven+' • alınan destek '+e.supportReceived+'</p>'+actionButton('Büyük aile buluşması yap',{kind:'extendedFamily',id:'reunion'},"extendedFamilyAction('reunion')",'Aynı bölgede yaşayan akrabaları bir araya getirir; bağları ve NPC-NPC ilişkilerini etkiler.')+'</div>';
 if(living.length)html+='<div class="grid2">'+living.slice(0,30).map((n,i)=>'<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(kinRole(n))+' • '+n.age+' yaş • '+safeText(n.role||'')+'<br>İlişki '+n.rel+' • güven '+(n.bonds?.trust||0)+(n.partner?.alive?' • eşli':'')+(n.descendants?.length?' • çocuk '+n.descendants.length:'')+'</p><div class="actions"><button class="mini" onclick="extendedFamilyAction(\'support\','+i+')">Destek ver</button><button class="mini" onclick="extendedFamilyAction(\'ask_help\','+i+')">Destek iste</button></div></div>').join('')+'</div>';
 return html;
}

function ensureHousing(){
 if(!s.housing||typeof s.housing!=='object'||Array.isArray(s.housing))s.housing={};
 const h=s.housing,parents=s.parents.filter(n=>n?.alive),hasYurt=s.assets.includes('yurt');
 h.familyCapacity=Math.max(4,Math.round(h.familyCapacity||6));h.expansions=Math.max(0,Math.min(3,Math.round(h.expansions||0)));h.ownCapacity=Math.max(4,Math.round(h.ownCapacity||4+h.expansions*2));
 h.familyCondition=clamp(Number.isFinite(h.familyCondition)?h.familyCondition:78);h.comfort=clamp(Number.isFinite(h.comfort)?h.comfort:65);h.pressure=clamp(Number.isFinite(h.pressure)?h.pressure:0);
 h.temporaryQuality=clamp(Number.isFinite(h.temporaryQuality)?h.temporaryQuality:25);h.monthsUnsheltered=Math.max(0,Math.round(h.monthsUnsheltered||0));h.hostId=h.hostId||null;h.history=Array.isArray(h.history)?h.history.slice(-40):[];
 if(!h.mode){
  if(s.age<18&&parents.length)h.mode='family_yurt';
  else if(hasYurt)h.mode='own_yurt';
  else if(parents.length)h.mode='family_yurt';
  else h.mode='temporary_shelter';
 }
 if(h.mode==='own_yurt'&&!hasYurt)h.mode=parents.length?'family_yurt':'temporary_shelter';
 if(h.mode==='family_yurt'&&!parents.length&&s.age>=18){h.mode='inherited_yurt';h.hostId=null;h.comfort=Math.max(h.comfort,55);}
 if(h.mode==='hosted_yurt'&&!npcById(h.hostId)?.alive){h.mode=hasYurt?'own_yurt':parents.length?'family_yurt':'temporary_shelter';h.hostId=null;}
 return h;
}
function housingModeLabel(){
 const h=ensureHousing();return {family_yurt:'Ana-baba ocağında',own_yurt:'Kendi yurdunda',inherited_yurt:'Aileden kalan yurtta',hosted_yurt:'Yakın yanında',temporary_shelter:'Geçici barınmada'}[h.mode]||'Barınma belirsiz';
}
function housingResidents(){
 const h=ensureHousing(),out=[],push=n=>{if(n?.alive&&!out.some(x=>x.id===n.id))out.push(n);};
 if(h.mode==='family_yurt'){s.parents.forEach(push);s.siblings.filter(n=>n.age<18||n.place===s.place).forEach(push);}
 if(h.mode==='hosted_yurt')push(npcById(h.hostId));
 if(['family_yurt','own_yurt','inherited_yurt'].includes(h.mode)){if(s.partner?.alive&&s.married)push(s.partner);s.children.filter(n=>n.alive).forEach(push);}
 return out;
}
function housingResidentCount(){return 1+housingResidents().length;}
function housingCapacity(){
 const h=ensureHousing();if(h.mode==='family_yurt'||h.mode==='inherited_yurt')return h.familyCapacity;if(h.mode==='own_yurt')return h.ownCapacity;if(h.mode==='hosted_yurt')return 3;return 1;
}
function housingCrowding(){return Math.max(0,housingResidentCount()-housingCapacity());}
function housingCondition(){
 const h=ensureHousing();if(h.mode==='own_yurt'&&s.assets.includes('yurt'))return assetState('yurt').condition;if(h.mode==='temporary_shelter')return h.temporaryQuality;return h.familyCondition;
}
function housingCostMultiplier(){const h=ensureHousing();return h.mode==='family_yurt'?.58:h.mode==='hosted_yurt'?.7:h.mode==='temporary_shelter'?.5:h.mode==='inherited_yurt'?.82:1;}
function housingExpansionCost(){const h=ensureHousing();return 8+h.expansions*6;}
function housingHostCandidates(){
 return [...s.parents,...s.siblings,...(s.relatives||[]),...s.friends].filter(n=>n?.alive&&n.place===s.place&&n.realm===s.realm&&(n.rel||0)>=50&&(n.bonds?.trust||0)>=35);
}
function housingIssue(id){
 const h=ensureHousing();
 if(id==='establish'){if(s.age<16)return '16 yaşında açılır.';if(h.mode==='own_yurt')return 'Zaten kendi yurdundasın.';if(!s.assets.includes('yurt'))return 'Önce Büyük Yurt edinmelisin.';}
 else if(id==='return_family'){if(!s.parents.some(n=>n.alive))return 'Yaşayan ebeveynin yok.';if(h.mode==='family_yurt')return 'Zaten ana-baba ocağındasın.';const avg=s.parents.filter(n=>n.alive).reduce((a,n)=>a+(n.rel||0),0)/Math.max(1,s.parents.filter(n=>n.alive).length);if(avg<35)return 'Ailenle ilişkin şu an geri dönmeye uygun değil.';}
 else if(id==='expand'){if(!['own_yurt','inherited_yurt'].includes(h.mode))return 'Önce kendi veya aileden kalan yurtta yaşamalısın.';if(h.expansions>=3)return 'Yurt artık daha fazla genişletilemiyor.';if(s.wealth<housingExpansionCost())return housingExpansionCost()+' servet gerekiyor.';}
 else if(id==='chores'){if(h.mode==='temporary_shelter')return 'Geçici barınmada düzenli yurt işi yapamazsın.';}
 else if(id==='seek_host'){if(h.mode!=='temporary_shelter')return 'Şu anda geçici barınmada değilsin.';if(!housingHostCandidates().length)return 'Seni yanına alabilecek yakın görünmüyor.';}
 return '';
}
function recordHousing(note){
 const h=ensureHousing();h.history.unshift({year:s.year+s.age,age:s.age,month:currentMonth(),mode:h.mode,place:s.place,note});h.history=h.history.slice(0,40);
}
function housingAction(id){
 const issue=housingIssue(id);if(issue){notice(issue);return false;}
 return performAction({kind:'housing',id},()=>{
  const h=ensureHousing();
  if(id==='establish'){
   h.mode='own_yurt';h.hostId=null;h.pressure=0;h.comfort=clamp(Math.max(h.comfort,68));h.ownCapacity=4+h.expansions*2;
   if(s.partner?.alive&&s.married){s.partner.place=s.place;s.partner.realm=s.realm;adjustRomance({harmony:5,commitment:5,tension:-4},'Kendi yurdunuza geçtiniz.');}
   for(const c of s.children.filter(n=>n.alive)){c.place=s.place;c.realm=s.realm;}
   s.parents.filter(n=>n.alive).forEach(n=>adjustNPC(n,{rel:2,respect:4},'Kendi ocağını kurdun.'));
   recordHousing('Kendi yurdunu kurdun.');apply({happiness:5,prestige:2});log('Kendi yurdunu kurup ayrı bir ocak oldun.','major');
  }else if(id==='return_family'){
   h.mode='family_yurt';h.hostId=null;h.pressure=clamp(h.pressure+8);h.comfort=clamp(Math.max(h.comfort,58));
   s.parents.filter(n=>n.alive).forEach(n=>adjustNPC(n,{rel:3,trust:2},'Bir süre yeniden aynı yurtta yaşamaya başladınız.'));
   recordHousing('Ana-baba ocağına geri döndün.');apply({happiness:2});log('Bir süreliğine ana-baba ocağına döndün.');
  }else if(id==='expand'){
   const cost=housingExpansionCost();s.wealth-=cost;economyLedger('housing',-cost,'Yurt genişletme');h.expansions++;h.ownCapacity=4+h.expansions*2;h.familyCapacity=Math.max(h.familyCapacity,4+h.expansions*2);h.comfort=clamp(h.comfort+7);
   if(s.assets.includes('yurt'))assetState('yurt').condition=clamp(assetState('yurt').condition+6);recordHousing('Yurdu genişlettin.');log('Yurda yeni bölüm ve yük alanı ekledin.','good');
  }else if(id==='chores'){
   h.comfort=clamp(h.comfort+7);if(h.mode==='own_yurt'&&s.assets.includes('yurt'))assetState('yurt').condition=clamp(assetState('yurt').condition+7);else h.familyCondition=clamp(h.familyCondition+5);
   for(const n of housingResidents().slice(0,4))adjustNPC(n,{rel:1,respect:2},'Ortak yurt işlerini üstlendin.');apply({happiness:1,skill:1});recordHousing('Yurt düzeni ve onarımıyla ilgilendin.');
  }else if(id==='seek_host'){
   const host=pick(housingHostCandidates());h.mode='hosted_yurt';h.hostId=host.id;h.comfort=clamp(48+(host.rel||0)/5);h.monthsUnsheltered=0;adjustNPC(host,{rel:4,trust:3,respect:2},'Seni bir süre kendi yurduna aldı.');recordHousing(host.name+' seni yanına aldı.');apply({happiness:3});log(safeText(host.name)+' seni geçici olarak kendi yurduna aldı.','good');
  }
 },id==='expand'?'Yurdu genişletme işiyle bir ay geçti.':id==='chores'?'Yurt işleriyle bir ay geçti.':id==='seek_host'?'Barınacak yer aramakla bir ay geçti.':'Yeni barınma düzenine geçmekle bir ay geçti.');
}
function applyHousingEffect(x={}){
 const h=ensureHousing();for(const k of ['comfort','pressure','familyCondition','temporaryQuality'])if(x[k])h[k]=clamp(h[k]+x[k]);
 if(x.mode){h.mode=x.mode;h.hostId=null;}if(x.record)recordHousing(x.record);
}
function housingAfterMigration(mode='alone'){
 const h=ensureHousing(),parentsMoved=mode==='kin'&&s.parents.some(n=>n.alive&&n.place===s.place&&n.realm===s.realm);
 if(s.assets.includes('yurt'))h.mode='own_yurt';else if(parentsMoved)h.mode='family_yurt';else{h.mode='temporary_shelter';h.hostId=null;h.temporaryQuality=32;h.monthsUnsheltered=0;}
 h.comfort=clamp(h.mode==='temporary_shelter'?35:60);recordHousing('Göç sonrası yeni barınma düzeni.');
}
function housingYearTick(){
 const h=ensureHousing(),parents=s.parents.filter(n=>n.alive);
 if(h.mode==='family_yurt'&&s.age>=18&&parents.length){
  const avg=parents.reduce((a,n)=>a+(n.rel||0),0)/parents.length,crowd=housingCrowding(),push=Math.max(0,s.age-20)+(s.married?8:0)+s.children.filter(n=>n.alive).length*3+crowd*4+(s.role?0:5)+(avg<45?10:0);
  if(push>=12){h.pressure=clamp(h.pressure+Math.min(18,4+Math.floor(push/5)));if(h.pressure>=45)log('Ailen kendi ocağını kurma zamanının yaklaştığını daha sık söylemeye başladı.');}
  if(s.age>=22&&h.pressure>=82&&avg<42&&!s.assets.includes('yurt')){
   h.mode='temporary_shelter';h.hostId=null;h.temporaryQuality=28;h.monthsUnsheltered=0;parents.forEach(n=>adjustNPC(n,{rel:-5,trust:-3,grudge:2},'Aynı yurtta yaşamaya devam etmeniz mümkün olmadı.'));recordHousing('Ana-baba ocağından ayrılmak zorunda kaldın.');log('Ana-baba ocağında kalman artık mümkün olmadı; geçici barınmaya düştün.','bad');
  }
 }
 if(h.mode==='family_yurt'||h.mode==='inherited_yurt')h.familyCondition=clamp(h.familyCondition-rng(1,3));
}
function tickHousingMonth(month,action={}){
 if(s.captive||s.exile)return;const h=ensureHousing(),crowd=housingCrowding(),cond=housingCondition();
 if(h.mode==='temporary_shelter'){
  h.monthsUnsheltered++;h.temporaryQuality=clamp(h.temporaryQuality-rng(0,2));apply({happiness:-1});
  if(month>=10||month<=2){apply({health:-2,happiness:-1});if(Math.random()<.1)acquireAilment('chill',{source:'geçici barınma ve kış'});}
  else if(Math.random()<.08)apply({health:-1});
 }else h.monthsUnsheltered=0;
 if(crowd>0&&month%3===0){apply({happiness:-Math.min(3,crowd)});h.comfort=clamp(h.comfort-crowd);if(crowd>=3)apply({health:-1});}
 if(cond<30&&(month>=10||month<=2)&&Math.random()<.1)acquireAilment('chill',{source:'bakımsız yurt'});
 if(action.kind!=='housing'&&h.comfort>20&&Math.random()<.08)h.comfort=clamp(h.comfort-1);
}
function housingSummaryHtml(){
 const h=ensureHousing(),res=housingResidents(),crowd=housingCrowding(),cond=housingCondition(),host=h.hostId?npcById(h.hostId):null,issueEst=housingIssue('establish'),issueFam=housingIssue('return_family'),issueExp=housingIssue('expand'),issueHost=housingIssue('seek_host');
 let html='<div class="card"><h3>⛺ Hane ve Barınma</h3><p><b>'+housingModeLabel()+'</b> • '+safeText(s.place)+'<br>Hane '+housingResidentCount()+'/'+housingCapacity()+' • rahatlık '+h.comfort+'/100 • barınak durumu '+cond+'/100'+(crowd?'<br>⚠ Kalabalık: kapasitenin '+crowd+' kişi üstünde':'')+(h.pressure?'<br>Ayrı ocak baskısı '+h.pressure+'/100':'')+(host?'<br>Yanında kaldığın: '+safeText(host.name):'')+'</p>';
 if(res.length)html+='<p class="note">Aynı barınmada: '+res.slice(0,8).map(n=>safeText(n.name)).join(' • ')+'</p>';
 html+='<div class="grid2">'+
  (!issueEst?actionButton('Kendi yurduna geç',{kind:'housing',id:'establish'},"housingAction('establish')",'Büyük Yurt gerekir; eş ve çocuklar seninle geçer.'):'')+
  (!issueFam?actionButton('Ana-baba ocağına dön',{kind:'housing',id:'return_family'},"housingAction('return_family')",'Aile ilişkisi yeterli olmalı.'):'')+
  (!issueExp?actionButton('Yurdu genişlet',{kind:'housing',id:'expand'},"housingAction('expand')",housingExpansionCost()+' servet • kapasite +2'):'')+
  (h.mode!=='temporary_shelter'?actionButton('Yurt işleriyle ilgilen',{kind:'housing',id:'chores'},"housingAction('chores')",'Rahatlık ve barınak durumunu toparlar.'):'')+
  (!issueHost?actionButton('Bir yakından barınak iste',{kind:'housing',id:'seek_host'},"housingAction('seek_host')",'Yakınlık ve güveni yeterli biri gerekir.'):'')+
 '</div></div>';
 return html;
}

const CRIME_PROFILES={
 horse_theft:{severity:54,skill:'riding',victim:'At Sahibi',baseTrace:36,feud:28},
 flock_theft:{severity:46,skill:'trade',victim:'Sürü Sahibi',baseTrace:30,feud:24},
 illegal_raid:{severity:78,skill:'combat',victim:'Baskına Uğrayan Obalı',baseTrace:48,feud:58},
 tore_duel:{severity:62,skill:'combat',victim:'Düello Rakibi',baseTrace:44,feud:46}
};
function ensureJustice(){
 if(!s.justice||typeof s.justice!=='object'||Array.isArray(s.justice))s.justice={};
 const j=s.justice;j.suspicion=clamp(Number.isFinite(j.suspicion)?j.suspicion:0);j.notoriety=clamp(Number.isFinite(j.notoriety)?j.notoriety:0);
 j.totalCrimes=Math.max(0,Math.round(j.totalCrimes||0));j.caught=Math.max(0,Math.round(j.caught||0));j.settled=Math.max(0,Math.round(j.settled||0));
 j.contacts=Array.isArray(j.contacts)?j.contacts:[];j.cases=Array.isArray(j.cases)?j.cases:[];j.feuds=Array.isArray(j.feuds)?j.feuds:[];j.history=Array.isArray(j.history)?j.history.slice(-60):[];
 j.contacts=j.contacts.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Töre Çevresi'));
 j.cases=j.cases.filter(Boolean);for(const c of j.cases){c.id=c.id||('case_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2));c.status=c.status||'hidden';c.evidence=clamp(Number.isFinite(c.evidence)?c.evidence:0);c.severity=clamp(Number.isFinite(c.severity)?c.severity:50);c.witnessIds=Array.isArray(c.witnessIds)?c.witnessIds:[];c.restitutionDue=Math.max(0,Math.round(c.restitutionDue||0));c.mediationBonus=clamp(Number.isFinite(c.mediationBonus)?c.mediationBonus:0);}
 return j;
}
function justiceContact(id){return ensureJustice().contacts.find(n=>n.id===id)||null;}
function makeJusticeNPC(type='Obalı',ageBias=0){
 const cfg=D.realms[s.realm],g=pick(['male','female']),age=Math.max(18,s.age+rng(-7,12)+ageBias);
 const n=normalizeNPC({name:pick(cfg[g]),gender:g,age,birthYear:s.year+s.age-age,alive:true,rel:rng(20,48),type,realm:s.realm,place:s.place,tribe:pick(cfg.tribes),prestige:rng(5,40),traits:chooseNPCTraits()},type);
 n.statusFlags=n.statusFlags||{};n.statusFlags.justiceContact=true;ensureJustice().contacts.push(n);return n;
}
function crimeCaseById(id){return ensureJustice().cases.find(c=>c.id===id)||null;}
function openJusticeCase(){return ensureJustice().cases.find(c=>['summoned','settlement_due','hearing_due'].includes(c.status))||null;}
function crimeVictimFor(profile){
 const type=profile?.victim||'Mağdur';const n=makeJusticeNPC(type);n.rel=rng(10,30);normalizeBonds(n);n.bonds.trust=rng(5,22);n.bonds.grudge=rng(35,60);n.statusFlags.crimeVictim=true;return n;
}
function crimeWitnesses(profile,victim){
 const j=ensureJustice(),out=[],count=Math.random()<(profile.severity/150)?(Math.random()<.35?2:1):0;
 for(let i=0;i<count;i++){const n=makeJusticeNPC('Tanık');n.statusFlags.crimeWitness=true;n.statusFlags.witnessFor=victim.id;out.push(n);}
 return out;
}
function victimKinFor(victim,create=true){
 if(!victim)return null;const j=ensureJustice();let n=victim.statusFlags?.justiceKinId?justiceContact(victim.statusFlags.justiceKinId):null;if(n?.alive||!create)return n||null;
 n=makeJusticeNPC('Mağdur Yakını');n.rel=rng(12,36);normalizeBonds(n);n.bonds.grudge=rng(25,50);n.parentIds=[];n.statusFlags.familyEnemy=true;n.statusFlags.kinOfVictim=victim.id;victim.statusFlags=victim.statusFlags||{};victim.statusFlags.justiceKinId=n.id;adjustSocialLink(victim,n,{score:62,trust:20,tag:'kin'},'Aynı aile ve oba çevresindeler.');return n;
}
function crimeSkillValue(c){const p=CRIME_PROFILES[c.id]||{},k=p.skill;return k?(s.skills[k]||0):s.skill;}
function justiceRestitutionAmount(rec){
 const c=D.crimes.find(x=>x.id===rec.crimeId),gain=c?.gain||[0,4],base=Math.round((gain[0]+gain[1])/2);
 return Math.max(3,Math.round(base+rec.severity/8+rec.evidence/18));
}
function justiceFeudForCase(rec,create=false){
 const j=ensureJustice();let f=j.feuds.find(x=>x.caseId===rec.id);if(!f&&create){const victim=justiceContact(rec.victimId),kin=victimKinFor(victim,true);f={id:'feud_'+rec.id,caseId:rec.id,victimId:rec.victimId,kinId:kin?.id||null,heat:clamp((CRIME_PROFILES[rec.crimeId]?.feud||25)+Math.round(rec.severity/5)),status:'active',startedYear:s.year+s.age};j.feuds.push(f);if(kin)scheduleDelayedEvent({id:'crime_feud_returns',years:[2,6],payload:{caseId:rec.id,detail:'Mağdur tarafla aranızdaki eski husumet yıllar içinde tamamen sönmedi.'}},{targetId:kin.id,sourceEventId:'justice:'+rec.id});}return f||null;
}
function markJusticeHostility(rec,amount=0){
 const victim=justiceContact(rec.victimId);if(victim){adjustNPC(victim,{rel:-Math.max(3,Math.round(amount/8)),trust:-Math.max(3,Math.round(amount/10)),grudge:Math.max(5,Math.round(amount/5))},'Töre dışı eylemin mağduru oldu.');if(rec.severity>=60&&!s.rivals.some(x=>x.id===victim.id)){victim.type='Mağdur / Hasım';s.rivals.push(victim);}}
 if(rec.severity>=55){const f=justiceFeudForCase(rec,true),kin=justiceContact(f?.kinId);if(kin&&!s.rivals.some(x=>x.id===kin.id)){kin.type='Mağdur Yakını / Hasım';s.rivals.push(kin);}}
}
function settleJusticeCase(rec,reason='tazminatla uzlaşma'){
 const j=ensureJustice(),victim=justiceContact(rec.victimId),f=justiceFeudForCase(rec,false);rec.status='settled';rec.resolvedYear=s.year+s.age;rec.result=reason;j.settled++;j.suspicion=clamp(j.suspicion-16);if(f){f.heat=clamp(f.heat-28);if(f.heat<25)f.status='settled';}
 if(victim)adjustNPC(victim,{rel:6,trust:3,grudge:-18},'Tazminat ve arabuluculukla mesele yatıştırıldı.');
 const row=s.crimeRecord.find(x=>x.id===rec.id);if(row){row.result=reason;row.status=rec.status;}j.history.unshift({year:s.year+s.age,age:s.age,caseId:rec.id,result:reason});j.history=j.history.slice(0,60);log('Töre meselesi kapandı: '+reason+'.','good');
}
function imposeJusticeOutcome(rec){
 const j=ensureJustice(),due=rec.restitutionDue||justiceRestitutionAmount(rec);rec.restitutionDue=due;
 const severity=rec.severity+Math.round(j.notoriety/4);
 if(s.wealth>=due){s.wealth-=due;economyLedger('justice',-due,'Töre tazminatı');settleJusticeCase(rec,due+' servet tazminat');}
 else if(severity>=82){rec.status='judged';rec.result='tazminat karşılanamadı; gözetim altında tutsaklık';enterCaptivity('töre hükmü');j.suspicion=clamp(j.suspicion-8);log('Töre hükmüyle tutsaklık başladı.','bad');}
 else if(severity>=65){rec.status='judged';rec.result='tazminat karşılanamadı; sürgün';enterExile('töre hükmü');j.suspicion=clamp(j.suspicion-6);log('Töre hükmüyle sürgün edildin.','bad');}
 else{rec.status='settlement_due';rec.result=due+' servet tazminat borcu';log('Töre meclisi '+due+' servet tazminat yükledi; borç kapanana kadar mesele sürecek.','bad');}
}
function justiceCaseAction(caseId,id){
 const rec=crimeCaseById(caseId);if(!rec)return false;
 return performAction({kind:'justiceCase',id,caseId},()=>{
  const j=ensureJustice(),victim=justiceContact(rec.victimId),witnesses=rec.witnessIds.map(justiceContact).filter(n=>n?.alive);
  if(id==='mediate'){
   const chance=Math.min(.9,.28+(s.skills.speech||0)/180+s.prestige/350+rec.mediationBonus/180-(rec.severity||50)/420);
   if(Math.random()<chance){rec.restitutionDue=Math.max(2,Math.round(justiceRestitutionAmount(rec)*.65));rec.status='settlement_due';rec.mediationBonus=clamp(rec.mediationBonus+15);if(victim)adjustNPC(victim,{rel:3,trust:3,grudge:-7},'Arabuluculuk görüşmesine oturdunuz.');log('Arabulucu, meseleyi '+rec.restitutionDue+' servet tazminatla kapatma yolu açtı.','good');}
   else{rec.evidence=clamp(rec.evidence+5);rec.status='hearing_due';log('Arabuluculuk uzlaşma sağlamadı; mesele töre meclisine kaldı.','bad');}
  }else if(id==='pay'){
   const due=rec.restitutionDue||justiceRestitutionAmount(rec);if(s.wealth<due){notice(due+' servet gerekiyor.');return;}
   s.wealth-=due;economyLedger('justice',-due,'Töre tazminatı');rec.restitutionDue=0;settleJusticeCase(rec,due+' servet tazminat ve uzlaşma');
  }else if(id==='hearing'){
   const pressure=.18+rec.evidence/120+witnesses.length*.12+j.suspicion/320-(s.skills.speech||0)/520-s.prestige/850-rec.mediationBonus/500;
   if(Math.random()<Math.max(.12,Math.min(.94,pressure))){rec.status='judged';rec.result='töre meclisi sorumluluk yükledi';apply({prestige:-Math.max(2,Math.round(rec.severity/15))});markJusticeHostility(rec,rec.severity);imposeJusticeOutcome(rec);}
   else{rec.status='cleared';rec.result='töre meclisi yeterli dayanak bulmadı';rec.resolvedYear=s.year+s.age;j.suspicion=clamp(j.suspicion-10);if(victim)adjustNPC(victim,{grudge:4,rel:-2},'Töre meclisi meselede yeterli dayanak bulmadı.');log('Töre meclisi bu meselede sana yükümlülük vermedi.','good');}
  }else if(id==='reconcile'){
   const f=justiceFeudForCase(rec,false),kin=justiceContact(f?.kinId);
   if(victim)adjustNPC(victim,{rel:7,trust:4,grudge:-14},'Geçmişteki zararı konuşup barış yolu aradınız.');
   if(kin)adjustNPC(kin,{rel:5,trust:3,grudge:-12},'Aileler arası husumeti azaltmaya çalıştınız.');
   if(f){f.heat=clamp(f.heat-22);if(f.heat<20)f.status='settled';}apply({prestige:2,happiness:2});log('Mağdur tarafıyla husumeti yatıştırmaya çalıştın.','good');
  }
 },id==='mediate'?'Arabuluculuk için bir ay harcadın.':id==='pay'?'Tazminat ve barış görüşmeleriyle bir ay geçti.':id==='reconcile'?'Husumeti yatıştırmaya bir ay ayırdın.':'Töre meclisinin önünde bir ay geçti.');
}
function applyJusticeEventOutcome(eventId,choiceIndex,context,target){
 const caseId=context?.delayedPayload?.caseId,rec=caseId?crimeCaseById(caseId):null;if(!rec)return;
 const j=ensureJustice();
 if(eventId==='crime_old_accusation'){
  rec.status='summoned';rec.oldAccusation=true;rec.evidence=clamp(rec.evidence+(choiceIndex===0?2:10));rec.mediationBonus=clamp(rec.mediationBonus+(choiceIndex===0?14:0));j.suspicion=clamp(j.suspicion+(choiceIndex===0?2:8));
  if(target)adjustNPC(target,{rel:choiceIndex===0?1:-4,trust:choiceIndex===0?1:-4,grudge:choiceIndex===0?-3:6},'Yıllar önceki töre meselesi yeniden açıldı.');
 }else if(eventId==='crime_feud_returns'){
  const f=justiceFeudForCase(rec,true);if(choiceIndex===0){f.heat=clamp(f.heat-24);if(f.heat<20)f.status='settled';j.suspicion=clamp(j.suspicion-3);}else{f.heat=clamp(f.heat+18);j.notoriety=clamp(j.notoriety+4);}
 }else if(eventId==='crime_witness_returns'){
  rec.evidence=clamp(rec.evidence+(choiceIndex===0?3:12));if(choiceIndex===0)rec.mediationBonus=clamp(rec.mediationBonus+8);else j.suspicion=clamp(j.suspicion+7);rec.status='summoned';
 }
}
function tickJusticeMonth(action={}){
 const j=ensureJustice();if(action.kind!=='crime'&&action.kind!=='justiceCase'&&j.suspicion>0&&Math.random()<.16)j.suspicion=clamp(j.suspicion-1);
 for(const f of j.feuds.filter(x=>x.status==='active'))if((s.year+s.age)-(f.startedYear||0)>=1&&f.heat>0&&Math.random()<.025)f.heat=clamp(f.heat+1);
}
function justiceSummaryHtml(){
 const j=ensureJustice(),open=openJusticeCase(),activeFeuds=j.feuds.filter(x=>x.status==='active'&&x.heat>0);
 let html='<div class="card"><h3>⚖ Töre İzleri</h3><p>Şüphe '+j.suspicion+'/100 • kötü şöhret '+j.notoriety+'/100 • '+j.totalCrimes+' töre dışı eylem • '+j.settled+' uzlaşmayla kapanan mesele'+(activeFeuds.length?' • '+activeFeuds.length+' süren husumet':'')+'</p></div>';
 if(open){const victim=justiceContact(open.victimId),ws=open.witnessIds.map(justiceContact).filter(n=>n?.alive),due=open.restitutionDue||justiceRestitutionAmount(open);html+='<div class="card"><h3>📜 Açık Töre Meselesi</h3><p><b>'+safeText(open.name)+'</b> • '+safeText(victim?.name||'Mağdur')+'<br>Durum: '+safeText(open.status)+' • iz/dayanak '+open.evidence+' • tanık '+ws.length+' • olası tazminat '+due+'</p><div class="grid2">'+actionButton('Arabulucu ara',{kind:'justiceCase',id:'mediate',caseId:open.id},"justiceCaseAction('"+open.id+"','mediate')",'Hitabet, itibar ve olayın ağırlığı etkiler.')+(open.status==='settlement_due'?actionButton(due+' servet tazminatı öde',{kind:'justiceCase',id:'pay',caseId:open.id},"justiceCaseAction('"+open.id+"','pay')",'Meseleyi uzlaşmayla kapatır.'):'')+actionButton('Töre meclisine çık',{kind:'justiceCase',id:'hearing',caseId:open.id},"justiceCaseAction('"+open.id+"','hearing')",'İzler, tanıklar, hitabet ve itibar sonucu etkiler.')+'</div></div>';}
 if(activeFeuds.length){html+='<h3 class="sectionTitle">Süren Husumetler</h3><div class="grid2">'+activeFeuds.slice(0,6).map(f=>{const rec=crimeCaseById(f.caseId),kin=justiceContact(f.kinId);return '<div class="card"><h3>'+safeText(kin?.name||'Mağdur ailesi')+'</h3><p>Husumet '+f.heat+'/100 • '+safeText(rec?.name||'Eski töre meselesi')+'</p>'+actionButton('Barış yolu ara',{kind:'justiceCase',id:'reconcile',caseId:f.caseId},"justiceCaseAction('"+f.caseId+"','reconcile')",'Aileler arası gerilimi azaltmaya çalış.')+'</div>';}).join('')+'</div>';}
 return html;
}

function relationshipCompatibility(n=s.partner){
 if(!n)return 0;normalizeNPC(n,n.type);let v=52-Math.min(18,Math.abs((n.age||s.age)-s.age)*2);
 if(n.tribe&&n.tribe===s.tribe)v+=6;if(n.place&&n.place===s.place)v+=3;
 if(n.goal==='family')v+=6;if(n.goal==='wealth'&&s.wealth>=20)v+=7;if(n.goal==='prestige'&&s.prestige>=30)v+=7;if(n.goal==='mastery'&&s.skill>=55)v+=7;
 if(n.traits?.includes('sadik'))v+=7;if(n.traits?.includes('merhametli'))v+=4;if(n.traits?.includes('kuskucu'))v-=6;if(n.traits?.includes('kinci'))v-=4;
 return clamp(v);
}
function initialFamilyApproval(n=s.partner){
 if(!n)return 50;const kin=[...s.parents,...s.siblings].filter(x=>x?.alive),avg=kin.length?kin.reduce((a,x)=>a+(x.rel||50),0)/kin.length:55;
 return clamp(Math.round(30+avg*.28+(n.prestige||0)*.18+(n.tribe===s.tribe?8:0)));
}
function ensureRomance(){
 if(!s.romance||typeof s.romance!=='object'||Array.isArray(s.romance))s.romance={};
 const r=s.romance;r.history=Array.isArray(r.history)?r.history.slice(-40):[];r.totalRelationships=Math.max(0,Math.round(r.totalRelationships||0));
 s.exPartners=Array.isArray(s.exPartners)?s.exPartners:[];
 if(s.partner?.alive){
  if(!r.current||r.current.partnerId!==s.partner.id){
   r.current={partnerId:s.partner.id,stage:s.married?'married':'courtship',startedYear:s.year+s.age,startedAge:s.age,monthsTogether:0,harmony:clamp(Math.round((s.partner.rel||60)*.8)),commitment:s.married?75:35,familyApproval:initialFamilyApproval(s.partner),tension:5,jealousy:s.partner.traits?.includes('kuskucu')?24:8,neglectMonths:0,arguments:0,reconciliations:0,sharedWork:0,compatibility:relationshipCompatibility(s.partner),lastCareYear:null,lastCareMonth:null,memories:[]};
   r.totalRelationships++;
  }
  r.current.stage=s.married?'married':'courtship';
  r.current.monthsTogether=Math.max(0,Math.round(r.current.monthsTogether||0));for(const k of ['harmony','commitment','familyApproval','tension','jealousy','compatibility'])r.current[k]=clamp(Number.isFinite(r.current[k])?r.current[k]:(k==='compatibility'?relationshipCompatibility(s.partner):k==='familyApproval'?initialFamilyApproval(s.partner):k==='tension'?5:35));
  r.current.neglectMonths=Math.max(0,Math.round(r.current.neglectMonths||0));r.current.arguments=Math.max(0,Math.round(r.current.arguments||0));r.current.reconciliations=Math.max(0,Math.round(r.current.reconciliations||0));r.current.sharedWork=Math.max(0,Math.round(r.current.sharedWork||0));r.current.memories=Array.isArray(r.current.memories)?r.current.memories.slice(-20):[];
 }else if(r.current&&r.current.partnerId&&!s.partner?.alive){r.current.stage='ended';}
 return r;
}
function currentRomance(){return ensureRomance().current||null;}
function rememberRomance(text,weight=1){
 const p=currentRomance();if(!p||!text)return;p.memories.unshift({text:String(text),weight,year:s.year+s.age,age:s.age,month:currentMonth()});p.memories=p.memories.slice(0,20);
}
function adjustRomance(delta={},memory=''){
 const p=currentRomance();if(!p)return null;
 for(const k of ['harmony','commitment','familyApproval','tension','jealousy'])if(delta[k])p[k]=clamp(p[k]+delta[k]);
 if(delta.argument)p.arguments+=delta.argument;if(delta.reconcile)p.reconciliations+=delta.reconcile;if(delta.sharedWork)p.sharedWork+=delta.sharedWork;
 if(memory)rememberRomance(memory,Math.max(1,Math.abs(delta.tension||delta.harmony||1)));return p;
}
function introducePartnerToFamily(){
 const p=currentRomance(),n=s.partner;if(!p||!n)return;
 const kin=[...s.parents,...s.siblings].filter(x=>x?.alive);let gain=0;
 for(const k of kin){const compatibility=(k.traits||[]).includes('kuskucu')?-2:(k.traits||[]).includes('merhametli')?3:1;adjustSocialLink(k,n,{score:4+compatibility,trust:2,tag:'kin'},'Aile görüşmesinde birbirinizi tanıdınız.');gain+=2+compatibility;}
 p.familyApproval=clamp(p.familyApproval+Math.max(3,gain));adjustNPC(n,{rel:3,trust:3,respect:2},'Ailenle daha yakından tanıştı.');rememberRomance('Aileler ve yakınlar ilişkinizi konuştu.',4);
}
function relationshipAction(id){
 const labels={time:'Birlikte vakit geçirdiniz.',future:'Geleceğinizi ve ortak ocağı konuştunuz.',family:'Yakınlarınla bir araya geldiniz.',work:'Bir işi birlikte omuzladınız.',repair:'Aranızdaki meseleyi açıkça konuştunuz.',reassure:'Kıskançlık ve kuşkular üzerine konuştunuz.'};
 return performAction({kind:'romance',id},()=>{
  const p=currentRomance(),n=s.partner;if(!p||!n)return;
  p.neglectMonths=0;p.lastCareYear=s.year+s.age;p.lastCareMonth=currentMonth();
  if(id==='time'){adjustRomance({harmony:8,commitment:2,tension:-3},'Birlikte sakin ve yakın bir zaman geçirdiniz.');adjustNPC(n,{rel:6,trust:4},'Birlikte zaman geçirdiniz.');apply({happiness:3});}
  else if(id==='future'){adjustRomance({commitment:9,harmony:3,tension:-1},'Gelecek, çocuklar, göç ve ortak hayat üzerine konuştunuz.');adjustNPC(n,{trust:5,respect:3},'Ortak geleceğinizi konuştunuz.');}
  else if(id==='family'){introducePartnerToFamily();apply({prestige:1});}
  else if(id==='work'){adjustRomance({harmony:4,commitment:4,tension:-2,sharedWork:1},'Bir işi birlikte tamamladınız.');adjustNPC(n,{rel:4,trust:3,respect:5},'Bir işi birlikte omuzladınız.');apply({skill:1,wealth:rng(0,2)});}
  else if(id==='repair'){const drop=Math.max(8,Math.min(22,10+(n.bonds?.trust||0)/8));adjustRomance({harmony:5,tension:-drop,jealousy:-4,reconcile:1},'Aranızdaki gerilimi konuşup yatıştırdınız.');adjustNPC(n,{rel:4,trust:4,grudge:-12},'Aranızdaki meseleyi çözmeye çalıştınız.');}
  else if(id==='reassure'){adjustRomance({jealousy:-14,harmony:3,tension:-4},'Kuşku ve kıskançlık hakkında açıkça konuştunuz.');adjustNPC(n,{trust:5,grudge:-3},'Ona güven vermeye çalıştın.');}
  log(labels[id]||'İlişkinize bir ay ayırdın.');
 },'İlişkinize bir ay ayırdın.');
}
function closeRelationship(reason='ayrılık'){
 const r=ensureRomance(),n=s.partner;if(!n)return false;normalizeNPC(n,n.type);
 const p=r.current?JSON.parse(JSON.stringify(r.current)):null;
 n.type=s.married?'Eski Eş':'Eski Eş Adayı';n.statusFlags=n.statusFlags||{};n.statusFlags.exPartner=true;n.statusFlags.breakupReason=reason;
 if(!s.exPartners.some(x=>x.id===n.id))s.exPartners.push(n);
 r.history.unshift({partnerId:n.id,name:n.name,married:!!s.married,reason,endedYear:s.year+s.age,endedAge:s.age,profile:p});r.history=r.history.slice(0,40);if(r.current){r.current.stage='ended';r.current.endReason=reason;}
 markFormerInLaws(n.id);s.partner=null;s.married=false;apply({happiness:-5});log(safeText(n.name)+' ile ilişkiniz sona erdi: '+reason+'.','major');return true;
}
function endRelationship(){
 return performAction({kind:'breakup'},()=>{
  const p=currentRomance(),n=s.partner,reason=p?.tension>=60?'uzun süren gerilim':'yollarınızı ayırma kararı';
  if(n){adjustNPC(n,{rel:-10,trust:-8,grudge:p?.tension>=60?10:4},'İlişkiniz sona erdi.');closeRelationship(reason);}
 },'Ayrılık kararını konuşarak bir ay geçirdin.');
}
function reconcileEx(index){
 return performAction({kind:'reconcileEx',index},()=>{
  const r=ensureRomance(),n=s.exPartners[index];if(!n?.alive||s.partner?.alive)return;
  normalizeNPC(n,n.type);const chance=Math.max(.12,Math.min(.9,.25+n.rel/250+(n.bonds?.trust||0)/300-(n.bonds?.grudge||0)/220));
  if(Math.random()<chance){
   s.exPartners.splice(index,1);s.partner=n;s.partner.type='Eş adayı';s.married=false;r.current={partnerId:n.id,stage:'courtship',startedYear:s.year+s.age,startedAge:s.age,monthsTogether:0,harmony:clamp((n.rel||50)-5),commitment:35,familyApproval:initialFamilyApproval(n),tension:18,jealousy:10,neglectMonths:0,arguments:0,reconciliations:1,sharedWork:0,compatibility:relationshipCompatibility(n),lastCareYear:s.year+s.age,lastCareMonth:currentMonth(),memories:[{text:'Eski ilişkinizi yeniden denemeye karar verdiniz.',weight:6,year:s.year+s.age}]};adjustNPC(n,{rel:8,trust:7,grudge:-12},'Bir süre ayrı kaldıktan sonra yeniden görüştünüz.');log(safeText(n.name)+' ile yeniden görüşmeye başladın.','major');
  }else{adjustNPC(n,{rel:-2,trust:-2},'Yeniden başlama teklifine hazır değildi.');log(safeText(n.name)+' yeniden başlama teklifini kabul etmedi.');}
 },'Eski ilişkinle yeniden konuşmaya bir ay ayırdın.');
}
function tickRomanceMonth(action={}){
 const p=currentRomance(),n=s.partner;if(!p||!n?.alive)return;p.monthsTogether++;
 const cared=action.kind==='romance'||(action.kind==='npc'&&action.group==='partner');
 if(cared)p.neglectMonths=0;else p.neglectMonths++;
 const remote=(n.place&&n.place!==s.place)||(n.realm&&n.realm!==s.realm);
 if(remote&&p.monthsTogether%3===0){p.tension=clamp(p.tension+3);p.harmony=clamp(p.harmony-2);}
 if(!cared&&p.neglectMonths>=4&&p.neglectMonths%3===1){p.tension=clamp(p.tension+2);p.harmony=clamp(p.harmony-1);}
 if(action.kind==='npc'&&action.group!=='partner'&&['spend','confide','gift'].includes(action.id)){p.jealousy=clamp(p.jealousy+(n.traits?.includes('kuskucu')?4:2));}
 if(p.monthsTogether%6===0){if(p.tension<25&&p.harmony>=65)p.commitment=clamp(p.commitment+2);if(p.tension>60){adjustNPC(n,{rel:-2,trust:-2,grudge:2},'İlişkinizdeki uzun süren gerilim bağınızı yıprattı.');}}
}
function romanceSummaryHtml(){
 const r=ensureRomance(),p=r.current,n=s.partner;
 if(n?.alive&&p){
  const stage=s.married?'Ocak kuruldu':'Görüşme dönemi',memory=p.memories?.[0]?.text||'Henüz belirgin ortak anınız yok.';
  return '<div class="card"><h3>❤️ İlişki Hayatı</h3><p><b>'+safeText(n.name)+'</b> • '+stage+' • '+p.monthsTogether+' ay<br>Uyum '+p.compatibility+' • ahenk '+p.harmony+' • bağlılık '+p.commitment+' • aile onayı '+p.familyApproval+'<br>Gerilim '+p.tension+' • kıskançlık '+p.jealousy+'<br><span class="note">'+safeText(memory)+'</span></p><div class="grid2">'+
   actionButton('Birlikte vakit geçir',{kind:'romance',id:'time'},"relationshipAction('time')",'Ahenk ve güveni artırır.')+
   actionButton('Geleceği konuş',{kind:'romance',id:'future'},"relationshipAction('future')",'Bağlılığı artırır; evlilik kararını etkiler.')+
   actionButton('Ailelerle görüş',{kind:'romance',id:'family'},"relationshipAction('family')",'Yakınların onayını ve sosyal bağları etkiler.')+
   actionButton('Birlikte iş yap',{kind:'romance',id:'work'},"relationshipAction('work')",'Ortak emek, saygı ve küçük kazanç.')+
   (p.tension>=15?actionButton('Gerilimi konuş',{kind:'romance',id:'repair'},"relationshipAction('repair')",'Tartışma ve kırgınlığı azaltır.'):'')+
   (p.jealousy>=15?actionButton('Güven ver',{kind:'romance',id:'reassure'},"relationshipAction('reassure')",'Kıskançlık ve kuşkuyu azaltır.'):'')+
   actionButton(s.married?'Ocaktan ayrıl':'İlişkiyi bitir',{kind:'breakup'},'endRelationship()','İlişkiyi kalıcı geçmişe taşır; eski eş olarak hatırlanır.')+
  '</div></div>';
 }
 const ex=s.exPartners.filter(x=>x?.alive);
 if(ex.length)return '<div class="card"><h3>🕯 Eski İlişkiler</h3><p>'+ex.length+' yaşayan eski eş/eş adayı geçmişinde duruyor.</p><div class="grid2">'+ex.map((x,i)=>actionButton(safeText(x.name)+' ile yeniden konuş',{kind:'reconcileEx',index:i},'reconcileEx('+i+')','İlişki '+(x.rel||0)+' • güven '+(x.bonds?.trust||0)+' • kin '+(x.bonds?.grudge||0))).join('')+'</div></div>';
 return '';
}

const APPEARANCE_OPTIONS={
 face:[{id:'oval',name:'Oval'},{id:'round',name:'Yuvarlak'},{id:'long',name:'Uzun'},{id:'broad',name:'Geniş'}],
 skin:[{id:'light',name:'Açık'},{id:'wheat',name:'Buğday'},{id:'tan',name:'Bronz'},{id:'deep',name:'Koyu'}],
 hair:[{id:'short',name:'Kısa'},{id:'crop',name:'Kırpık'},{id:'shoulder',name:'Omuz Boyu'},{id:'long',name:'Uzun'},{id:'braid',name:'Örgülü'},{id:'tied',name:'Toplanmış'},{id:'shaved',name:'Kazınmış'},{id:'wild',name:'Dağınık'}],
 hairColor:[{id:'black',name:'Kara'},{id:'darkbrown',name:'Koyu Kahve'},{id:'brown',name:'Kahve'},{id:'auburn',name:'Kızıl Kahve'},{id:'lightbrown',name:'Açık Kahve'}],
 beard:[{id:'none',name:'Yok'},{id:'stubble',name:'Kirli Sakal'},{id:'short',name:'Kısa Sakal'},{id:'long',name:'Uzun Sakal'},{id:'moustache',name:'Bıyık'}],
 headwear:[{id:'none',name:'Yok'},{id:'felt',name:'Keçe Başlık'},{id:'bork',name:'Börk'},{id:'wrap',name:'Baş Sargısı'},{id:'war',name:'Savaş Başlığı'}]
};
function appearanceOption(group,id){return APPEARANCE_OPTIONS[group]?.find(x=>x.id===id)||APPEARANCE_OPTIONS[group]?.[0]||null;}
function ensureAppearance(){
 if(!s.appearance||typeof s.appearance!=='object'||Array.isArray(s.appearance))s.appearance={};
 const a=s.appearance;
 a.face=appearanceOption('face',a.face)?.id||pick(APPEARANCE_OPTIONS.face).id;
 a.skin=appearanceOption('skin',a.skin)?.id||pick(APPEARANCE_OPTIONS.skin).id;
 a.hair=appearanceOption('hair',a.hair)?.id||(s.gender==='female'?pick(['shoulder','long','braid','tied']):pick(['short','crop','tied','wild']));
 a.hairColor=appearanceOption('hairColor',a.hairColor)?.id||pick(APPEARANCE_OPTIONS.hairColor).id;
 a.beard=appearanceOption('beard',a.beard)?.id||'none';a.headwear=appearanceOption('headwear',a.headwear)?.id||'none';
 a.care=clamp(Number.isFinite(a.care)?a.care:65);a.lastGroomYear=a.lastGroomYear??null;a.lastGroomMonth=a.lastGroomMonth??null;a.history=Array.isArray(a.history)?a.history.slice(-30):[];
 return a;
}
function appearanceAgeBand(){return s.age<5?'baby':s.age<13?'child':s.age<18?'youth':s.age<40?'adult':s.age<55?'mature':s.age<70?'elder':'old';}
function appearanceGreyLevel(){const a=ensureAppearance(),h=ensureHealthProfile(),base=s.age<35?0:Math.floor((s.age-35)*2.1),stress=Math.floor(h.frailty/8)+Math.max(0,45-s.health)/5;return clamp(base+stress-(a.care>=80?4:0));}
function appearanceConditionLabel(){const a=ensureAppearance(),h=ensureHealthProfile(),grey=appearanceGreyLevel();if(!s.alive)return 'Yaşamı sona erdi';if(s.captive)return 'Tutsaklık yorgunluğu';if(s.health<25||h.frailty>=75)return 'Belirgin yorgun ve kırılgan';if(a.care<25)return 'Bakımsız';if(grey>=70)return 'Saçları büyük ölçüde ağarmış';if(s.age>=55)return 'Yaşın izlerini taşıyor';if(a.care>=80)return 'Bakımlı';return 'Doğal görünüm';}
function appearanceScarCount(){return Math.min(3,ensureHealthProfile().scars.length);}
function appearanceHairTone(){const base={black:'#211b16',darkbrown:'#3a2b21',brown:'#5a3f2c',auburn:'#70402c',lightbrown:'#806044'}[ensureAppearance().hairColor]||'#30241c',grey=appearanceGreyLevel();if(grey<30)return base;if(grey<65)return 'linear-gradient(90deg,'+base+' 0 55%,#aaa69e 56% 72%,'+base+' 73%)';return '#aaa79f';}
function appearanceAvatarHtml(){
 const a=ensureAppearance(),band=appearanceAgeBand(),grey=appearanceGreyLevel(),scars=appearanceScarCount(),showBeard=s.gender==='male'&&s.age>=16&&a.beard!=='none',ageLines=s.age>=45?Math.min(3,1+Math.floor((s.age-45)/15)):0;
 return '<div class="portrait age-'+band+' face-'+a.face+' skin-'+a.skin+' hair-'+a.hair+' '+(s.health<30?'portrait-sick ':'')+(s.captive?'portrait-captive ':'')+'">'+
  '<div class="portrait-neck"></div><div class="portrait-head"><div class="portrait-hair" style="--hair:'+appearanceHairTone()+'"></div><div class="portrait-brow left"></div><div class="portrait-brow right"></div><div class="portrait-eye left"></div><div class="portrait-eye right"></div><div class="portrait-nose"></div><div class="portrait-mouth"></div>'+
  (showBeard?'<div class="portrait-beard beard-'+a.beard+'" style="--hair:'+appearanceHairTone()+'"></div>':'')+
  Array.from({length:ageLines},(_,i)=>'<i class="portrait-age-line line-'+(i+1)+'"></i>').join('')+
  Array.from({length:scars},(_,i)=>'<i class="portrait-scar scar-'+(i+1)+'"></i>').join('')+
  '</div>'+(a.headwear!=='none'?'<div class="portrait-headwear headwear-'+a.headwear+'"></div>':'')+(!s.alive?'<div class="portrait-status">†</div>':s.captive?'<div class="portrait-status">⛓</div>':'')+'<span class="portrait-grey-dot" title="Ağarma '+grey+'"></span></div>';
}
function appearanceChoiceAllowed(group,id){if(!appearanceOption(group,id))return false;if(group==='beard'&&(s.gender!=='male'||s.age<16)&&id!=='none')return false;if(group==='headwear'&&id==='war'&&!s.military.served&&!['Alp','Akıncı','Tarkan'].includes(s.role))return false;return true;}
function setAppearancePart(group,id){if(!appearanceChoiceAllowed(group,id)){notice('Bu görünüş seçeneği şu an uygun değil.');return false;}const a=ensureAppearance();if(!['face','skin','hair','hairColor','beard','headwear'].includes(group))return false;a[group]=id;a.history.unshift({year:s.year+s.age,age:s.age,month:currentMonth(),group,id});a.history=a.history.slice(0,30);render();save();return true;}
function groomAppearance(){return performAction({kind:'appearance',id:'groom'},()=>{const a=ensureAppearance();a.care=clamp(a.care+22);a.lastGroomYear=s.year+s.age;a.lastGroomMonth=currentMonth();apply({happiness:3,prestige:1});log('Saç, sakal ve günlük bakımına özen gösterdin.','good');},'Kişisel bakım ve görünüşüne bir ay ayırdın.');}
function tickAppearanceMonth(action={}){const a=ensureAppearance();if(action.kind!=='appearance')a.care=clamp(a.care-(s.captive?3:s.military.active?2:1));if(s.ailments.length)a.care=clamp(a.care-1);}
function appearanceSummaryHtml(){
 const a=ensureAppearance(),scar=appearanceScarCount(),grey=appearanceGreyLevel();
 const select=(group,label)=>'<div class="card"><h3>'+label+'</h3><div class="actions">'+APPEARANCE_OPTIONS[group].map(x=>{const active=a[group]===x.id,allowed=appearanceChoiceAllowed(group,x.id);return '<button class="mini '+(active?'active':'')+'" '+(!allowed?'disabled':'')+' onclick="setAppearancePart('+JSON.stringify(group)+','+JSON.stringify(x.id)+')">'+safeText(x.name)+(active?' ✓':'')+'</button>';}).join('')+'</div></div>';
 return '<div class="card"><h3>🪞 Görünüş</h3><div class="appearancePreview">'+appearanceAvatarHtml()+'</div><p>'+appearanceConditionLabel()+' • bakım '+a.care+'/100 • ağarma '+grey+'/100 • görünen yara izi '+scar+'</p>'+actionButton('Bakım yap',{kind:'appearance',id:'groom'},"groomAppearance()",'Bir ay sürer • bakım, dirlik ve küçük itibar artışı')+'</div><div class="grid2">'+select('face','Yüz yapısı')+select('skin','Ten tonu')+select('hair','Saç')+select('hairColor','Saç rengi')+select('beard','Sakal / bıyık')+select('headwear','Başlık')+'</div>';
}

const EDUCATION_TRACKS={
 horse:{name:'Atlı Yetişme',icon:'🐎',age:5,skill:'riding',path:'civil',mentor:'At Ustası',peer:'Talimgâh Yoldaşı'},
 archery:{name:'Okçuluk Yolu',icon:'🏹',age:7,skill:'archery',path:'military',mentor:'Ok Ustası',peer:'Ok Talimi Yoldaşı'},
 wrestling:{name:'Güreş ve Güç',icon:'🤼',age:8,skill:'combat',path:'military',mentor:'Güreş Ustası',peer:'Güreş Yoldaşı'},
 smith:{name:'Demir Ocağı Öğretimi',icon:'🔥',age:10,skill:'craft',path:'craft',mentor:'Demirci Ustası',peer:'Çırak'},
 bitig:{name:'Bitig ve Yazı Öğretimi',icon:'𐱅',age:12,skill:'literacy',path:'state',mentor:'Bitig Ustası',peer:'Yazı Yoldaşı'},
 story:{name:'Söz ve Destan Yolu',icon:'🪕',age:8,skill:'speech',path:'culture',mentor:'Ozan Ustası',peer:'Söz Yoldaşı'},
 trade:{name:'Takas ve Kervan Öğretimi',icon:'🧺',age:12,skill:'trade',path:'trade',mentor:'Pazar Ustası',peer:'Pazar Yoldaşı'}
};
const EDUCATION_RANKS=[
 {months:0,name:'Yeni Başlayan'}, {months:6,name:'Temel Öğrenen'}, {months:18,name:'Yetişen'},
 {months:36,name:'İleri Yetişen'}, {months:60,name:'Usta Adayı'}
];
function educationRankFor(months=0){let r=EDUCATION_RANKS[0];for(const x of EDUCATION_RANKS)if(months>=x.months)r=x;return r;}
function ensureEducation(){
 if(!s.education||typeof s.education!=='object'||Array.isArray(s.education))s.education={};
 const e=s.education;e.tracks=e.tracks&&typeof e.tracks==='object'&&!Array.isArray(e.tracks)?e.tracks:{};e.contacts=Array.isArray(e.contacts)?e.contacts:[];e.history=Array.isArray(e.history)?e.history.slice(-60):[];e.activeTrack=e.activeTrack||null;
 for(const [id,def] of Object.entries(EDUCATION_TRACKS)){
  const p=e.tracks[id]||(e.tracks[id]={});
  p.months=Math.max(0,Math.round(p.months||0));p.rank=educationRankFor(p.months).name;p.evaluations=Math.max(0,Math.round(p.evaluations||0));p.praise=Math.max(0,Math.round(p.praise||0));p.failures=Math.max(0,Math.round(p.failures||0));p.mentorId=p.mentorId||null;p.peerIds=Array.isArray(p.peerIds)?p.peerIds:[];
 }
 e.contacts=e.contacts.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Yetişme Çevresi'));
 return e;
}
function educationProfile(id){ensureEducation();return s.education.tracks[id]||null;}
function educationContact(id){return ensureEducation().contacts.find(n=>n.id===id)||null;}
function educationMentor(id,create=true){
 const def=EDUCATION_TRACKS[id],p=educationProfile(id);if(!def||!p)return null;
 let n=educationContact(p.mentorId);if(n?.alive)return n;if(!create)return null;
 const cfg=D.realms[s.realm],g=pick(['male','female']),age=Math.max(24,s.age+rng(10,25));
 n=normalizeNPC({name:pick(cfg[g]),gender:g,age,birthYear:s.year+s.age-age,alive:true,rel:rng(48,64),type:def.mentor,goal:'mastery',role:def.mentor,prestige:rng(28,55),realm:s.realm,place:s.place,tribe:pick(cfg.tribes),traits:['caliskan',pick(['temkinli','gururlu','sakin'])]},def.mentor);
 n.statusFlags=n.statusFlags||{};n.statusFlags.educationTrack=id;n.statusFlags.educationMentor=true;normalizeBonds(n);n.bonds.respect=clamp(Math.max(n.bonds.respect,58));n.bonds.trust=clamp(Math.max(n.bonds.trust,40));rememberNPC(n,'education',def.name+' yolunda seni yetiştirmeye başladı.',5);
 s.education.contacts.push(n);p.mentorId=n.id;return n;
}
function educationPeers(id,min=2){
 const def=EDUCATION_TRACKS[id],p=educationProfile(id);if(!def||!p)return [];
 let live=p.peerIds.map(educationContact).filter(n=>n?.alive);
 const cfg=D.realms[s.realm];
 while(live.length<min&&p.peerIds.length<4){
  const g=pick(['male','female']),age=Math.max(def.age,s.age+rng(-3,3));
  const n=normalizeNPC({name:pick(cfg[g]),gender:g,age,birthYear:s.year+s.age-age,alive:true,rel:rng(45,62),type:def.peer,goal:pick(['mastery','prestige','wealth']),role:def.peer,realm:s.realm,place:s.place,tribe:pick(cfg.tribes)},def.peer);
  n.statusFlags=n.statusFlags||{};n.statusFlags.educationTrack=id;n.statusFlags.educationPeer=true;s.education.contacts.push(n);p.peerIds.push(n.id);live.push(n);
 }
 return live;
}
function educationFitBonusForCareer(r){
 if(!r)return 0;const map={herder:'horse',hunter:'archery',horsekeeper:'horse',smith_apprentice:'smith',smith:'smith',bard:'story',merchant:'trade',caravan:'trade',scribe:'bitig',envoy:'bitig',alp:'archery',raider:'archery',tarkan:'wrestling',bey:'bitig'},id=map[r.id];
 if(!id)return 0;const p=educationProfile(id);return Math.min(.14,(p.months||0)/600+(p.praise||0)*.012);
}
function educationEvaluation(id){
 const def=EDUCATION_TRACKS[id],p=educationProfile(id),mentor=educationMentor(id,true);if(!def||!p||!mentor)return;
 const level=s.skills[def.skill]||0,base=.42+level/180+(mentor.bonds?.trust||0)/500+p.months/500,pass=Math.random()<Math.min(.94,base);p.evaluations++;
 if(pass){p.praise++;adjustNPC(mentor,{rel:3,trust:3,respect:4},'Yetişme sınamasında kendini gösterdin.');apply({prestige:2,happiness:2});log(def.name+' sınamasında ustanın takdirini kazandın.','good');}
 else{p.failures++;adjustNPC(mentor,{respect:-1},'Sınamada eksiklerini gördü ve tekrar çalışmanı istedi.');apply({happiness:-1});log(def.name+' sınamasında eksiklerin ortaya çıktı.');}
 s.education.history.unshift({year:s.year+s.age,age:s.age,track:id,type:'evaluation',pass,rank:p.rank});s.education.history=s.education.history.slice(0,60);
}
function studyEducation(id){
 const def=EDUCATION_TRACKS[id];if(!def)return;
 performAction({kind:'education',id},()=>{
  const e=ensureEducation(),p=educationProfile(id),mentor=educationMentor(id,true),peers=educationPeers(id,2),before=p.rank;
  e.activeTrack=id;p.months++;p.rank=educationRankFor(p.months).name;skillGain(def.skill,rng(2,4));apply({skill:1,happiness:1});addExperience(def.path);s.path=def.path;
  adjustNPC(mentor,{rel:1,trust:1,respect:2},'Bir ay daha onun yanında öğrendin.');
  if(peers.length){const n=pick(peers);adjustNPC(n,{rel:2,trust:1,respect:1},'Birlikte talim ve çalışma yaptınız.');}
  if(before!==p.rank){apply({prestige:2,happiness:2});log(def.name+' yolunda yeni basamağa geçtin: '+p.rank+'.','major');}
  if([6,18,36,60].includes(p.months))educationEvaluation(id);
  e.history.unshift({year:s.year+s.age,age:s.age,track:id,type:'study',rank:p.rank,mentorId:p.mentorId});e.history=e.history.slice(0,60);
 },def.name+' için bir ay eğitim ve talim yaptın.');
}
function educationInteraction(index,id){
 performAction({kind:'educationContact',index,id},()=>{
  const n=ensureEducation().contacts[index];if(!n?.alive)return;
  if(id==='ask'){adjustNPC(n,{rel:3,trust:3,respect:2},'Öğrenme yolunla ilgili ondan öğüt istedin.');apply({skill:1});}
  else if(id==='practice'){adjustNPC(n,{rel:4,trust:2,respect:3},'Birlikte tekrar ve talim yaptınız.');const track=n.statusFlags?.educationTrack,def=EDUCATION_TRACKS[track];if(def)skillGain(def.skill,2);}
  else if(id==='befriend'){adjustNPC(n,{rel:7,trust:6},'Yetişme çevresindeki bağınız arkadaşlığa dönüştü.');if(n.statusFlags?.educationPeer&&(n.rel>=68||(n.bonds?.trust||0)>=60)&&!s.friends.some(x=>x.id===n.id)){n.type='Yetişme Dostu';s.friends.push(n);}}
 },'Yetişme çevrenden biriyle bir ay geçirdin.');
}
function educationSummaryHtml(){
 const e=ensureEducation(),started=Object.entries(EDUCATION_TRACKS).filter(([id])=>educationProfile(id).months>0);
 let html='<div class="card"><h3>📚 Yetişme Yolları</h3><p>Usta ve yaşıtlarınla kurduğun bağlar, ileride görev kabulünde küçük ama gerçek bir avantaj sağlar. Her 6/18/36/60 ayda bir basamak ve sınanma vardır.</p></div>';
 html+='<div class="grid2">'+Object.entries(EDUCATION_TRACKS).map(([id,d])=>{const p=educationProfile(id),mentor=educationMentor(id,false),issue=accessIssue({kind:'education',id});return '<button class="card '+(issue?'locked':'')+'" '+(issue?'disabled':'')+' onclick="studyEducation('+JSON.stringify(id)+')"><h3>'+d.icon+' '+safeText(d.name)+'</h3><p>'+p.rank+' • '+p.months+' ay • '+skillName(d.skill)+' '+(s.skills[d.skill]||0)+(mentor?'<br>Usta: '+safeText(mentor.name)+' • güven '+(mentor.bonds?.trust||0):'')+'</p>'+(issue?'<div class="lockline">'+safeText(issue)+'</div>':'')+'</button>';}).join('')+'</div>';
 const contacts=e.contacts.filter(n=>n.alive);
 if(contacts.length)html+='<h3 class="sectionTitle">Ustalar ve Yetişme Çevresi</h3><div class="grid2">'+contacts.map((n,i)=>'<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(n.type)+' • '+(n.statusFlags?.educationMentor?'Usta':'Yoldaş')+' • ilişki '+n.rel+' • güven '+(n.bonds?.trust||0)+'</p><div class="actions"><button class="mini" onclick="educationInteraction('+i+',\'ask\')">Öğüt iste</button><button class="mini" onclick="educationInteraction('+i+',\'practice\')">Birlikte çalış</button>'+(n.statusFlags?.educationPeer?'<button class="mini" onclick="educationInteraction('+i+',\'befriend\')">Dostluğu ilerlet</button>':'')+'</div></div>').join('')+'</div>';
 if(started.length)html+='<p class="note">Aktif geçmiş: '+started.map(([id,d])=>safeText(d.name)+' '+educationProfile(id).months+' ay').join(' • ')+'</p>';
 return html;
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)){
 EVENT_DECK.push(
  {id:'education_mentor_trial',cat:'Yetişme',min:7,max:70,w:7,cool:14,actions:['education'],target:'educationMentor',
   text:'{name}, bu ay seni alıştığından daha zor bir sınamaya çağırdı.',choices:[
    ['Zor sınamayı kabul et',{skill:2,prestige:1,targetRel:2,targetTrust:3,targetRespect:5}],
    ['Eksiklerini çalışıp sonra dene',{happiness:1,targetRel:1,targetTrust:2,targetRespect:1}]
   ]},
  {id:'education_peer_competition',cat:'Yetişme',min:8,max:45,w:6,cool:16,actions:['education'],target:'educationPeer',
   text:'{name}, aynı yetişme yolunda senden öne çıkmaya çalışıyor.',choices:[
    ['Birlikte çalışıp birbirinizi geliştirin',{happiness:2,targetRel:5,targetTrust:4,targetRespect:2}],
    ['Onu geçmek için daha çok çalış',{skill:3,prestige:1,targetRel:-2,targetRespect:4,targetGrudge:2}]
   ]},
  {id:'education_peer_help',cat:'Yetişme',min:8,max:60,w:5,cool:20,actions:['education'],target:'educationPeer',
   text:'{name}, öğrendiğiniz konuda bir yerde takıldı ve yardımını istedi.',choices:[
    ['Bildiğini paylaş',{happiness:2,prestige:1,targetRel:6,targetTrust:5,targetRespect:4}],
    ['Önce kendi çalışmana odaklan',{skill:2,targetRel:-2,targetTrust:-1}]
   ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='romance_family_disapproval')){
 EVENT_DECK.push(
  {id:'romance_family_disapproval',cat:'Ocak',min:16,max:75,w:8,cool:18,actions:['romance','npc'],target:'partner',req:['partnered','romanceFamilyLow'],
   text:'Yakınlarından bazıları {name} ile kurduğun bağ konusunda çekincelerini açıkça söyledi.',choices:[
    ['İki tarafı bir araya getir',{romance:{familyApproval:12,harmony:3,tension:-4},targetRel:3,targetTrust:3,targetRespect:2}],
    ['Kendi kararının arkasında dur',{romance:{commitment:7,familyApproval:-3,tension:3},targetRel:2,targetTrust:4,targetRespect:3}]
   ]},
  {id:'romance_jealousy',cat:'Ocak',min:16,max:75,w:7,cool:16,actions:['romance','npc'],target:'partner',req:['partnered','romanceJealous'],
   text:'{name}, son zamanlarda başka insanlarla yakınlığından rahatsız olduğunu söyledi.',choices:[
    ['Açıkça konuşup güven ver',{romance:{jealousy:-15,harmony:5,tension:-5},targetTrust:5,targetRel:3,targetGrudge:-3}],
    ['Bu kuşkuyu haksız bulduğunu söyle',{romance:{jealousy:-3,harmony:-3,tension:9,argument:1},targetTrust:-4,targetRel:-3,targetGrudge:5}]
   ]},
  {id:'romance_household_strain',cat:'Ocak',min:18,max:80,w:7,cool:20,actions:['romance','work','migration','wait'],target:'partner',req:['married','romanceTense'],
   text:'{name} ile ortak ocağınızda bir süredir biriken meseleler sonunda açık bir tartışmaya dönüştü.',choices:[
    ['Meseleyi birlikte çözmeye çalış',{romance:{tension:-16,harmony:6,reconcile:1},targetTrust:5,targetRel:4,targetGrudge:-7}],
    ['Sözünden geri durma',{romance:{tension:12,harmony:-7,argument:1},targetTrust:-5,targetRel:-5,targetGrudge:7}]
   ]},
  {id:'romance_shared_plan',cat:'Ocak',min:18,max:75,w:5,cool:24,actions:['romance'],target:'partner',req:['partnered','romanceStable'],
   text:'{name}, birlikte geleceğiniz için yeni bir düzen kurmayı önerdi.',choices:[
    ['Ortak planı benimse',{romance:{commitment:9,harmony:5},happiness:3,targetTrust:4,targetRespect:4}],
    ['Şimdilik düzeni değiştirmeyin',{romance:{commitment:2,harmony:1},targetTrust:1}]
   ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='crime_old_accusation')){
 EVENT_DECK.push(
  {id:'crime_old_accusation',cat:'Töre',min:18,max:110,w:24,cool:0,delayed:true,target:'justiceVictim',text:'{detail} {name}, eski zararın hesabının yeniden görülmesini istiyor.',choices:[
   ['Arabuluculuk yolunu kabul et',{happiness:-1,targetRel:2,targetTrust:2,targetGrudge:-3}],
   ['İddianın karşısında dur',{prestige:-1,targetRel:-4,targetTrust:-4,targetGrudge:6}]
  ]},
  {id:'crime_witness_returns',cat:'Töre',min:18,max:110,w:26,cool:0,delayed:true,target:'justiceWitness',text:'{detail} Tanık {name}, yıllar önce gördüğünü şimdi töre meclisine anlatmaya hazır olduğunu söylüyor.',choices:[
   ['Önce arabuluculuk iste',{happiness:-1,targetRel:1,targetTrust:1}],
   ['Meseleyi mecliste tartış',{prestige:-1,targetRespect:2}]
  ]},
  {id:'crime_feud_returns',cat:'Töre',min:18,max:110,w:22,cool:0,delayed:true,target:'justiceKin',text:'{detail} {name}, mağdur tarafın eski husumetinin hâlâ kapanmadığını açıkça söylüyor.',choices:[
   ['Barış ve tazminat yolunu savun',{wealth:-2,prestige:2,targetRel:4,targetTrust:3,targetGrudge:-8}],
   ['Geri adım atma',{prestige:3,targetRel:-6,targetTrust:-5,targetGrudge:10}]
  ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='housing_family_pressure')){
 EVENT_DECK.push(
  {id:'housing_family_pressure',cat:'Ocak',min:18,max:55,w:7,cool:24,req:'familyHomeAdult',target:'parent',text:'{name}, artık kendi ocağını kurma zamanını düşünmen gerektiğini söylüyor.',choices:[
   ['Kendi yurdum için hazırlanacağım',{prestige:1,targetRel:3,targetTrust:2,targetRespect:4,housing:{pressure:-10,comfort:1,record:'Ailene kendi ocağını kurmaya hazırlanacağını söyledin.'}}],
   ['Bir süre daha aynı yurtta kalalım',{happiness:1,targetRel:-2,targetTrust:-2,housing:{pressure:12,record:'Aile yurdunda kalmaya devam etmek istedin.'}}]
  ]},
  {id:'housing_crowding_strain',cat:'Ocak',min:10,max:100,w:6,cool:18,req:'housingCrowded',target:'closeKin',text:'{name}, yurttaki kalabalığın artık günlük düzeni zorladığını söylüyor.',choices:[
   ['Yurt düzenini yeniden kur',{wealth:-2,happiness:1,targetRel:3,targetTrust:2,housing:{comfort:8,record:'Kalabalık hane için yurt düzenini değiştirdin.'}}],
   ['Şimdilik idare edin',{happiness:-2,targetRel:-2,housing:{comfort:-5,pressure:4}}]
  ]},
  {id:'housing_hard_night',cat:'Barınma',min:16,max:100,w:9,cool:10,req:'temporaryShelter',text:'Geçici barınakta sert bir gece geçirdin; rüzgâr ve soğuk düzenini iyice zorladı.',choices:[
   ['Barınağı güçlendirmeye uğraş',{health:-1,craft:2,housing:{temporaryQuality:12,comfort:5,record:'Geçici barınağı güçlendirdin.'}}],
   ['Gücünü dinlenmeye ayır',{health:1,happiness:-2,housing:{temporaryQuality:3}}]
  ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='extended_family_reunion_dispute')){
 EVENT_DECK.push(
  {id:'extended_family_reunion_dispute',cat:'Aile',min:12,max:100,w:6,cool:20,req:'hasCloseKin',target:'relative',text:'Büyük aile buluşmasında {name}, eski bir paylaşım meselesini yeniden açtı.',choices:[
   ['Herkesi yatıştır',{happiness:1,prestige:2,targetRel:4,targetTrust:3,targetGrudge:-6}],
   ['Kendi tarafını açıkça tut',{prestige:1,targetRel:-4,targetTrust:-3,targetGrudge:5}]
  ]},
  {id:'inlaw_request',cat:'Kayın Aile',min:18,max:90,w:6,cool:18,req:'partnered',target:'inLaw',text:'{name}, eşinin ailesinden biri olarak senden zor bir iş için destek istedi.',choices:[
   ['Aile bağı için destek ol',{wealth:-3,prestige:2,targetRel:6,targetTrust:5,targetRespect:3}],
   ['Bu kez kendi ocağını öne koy',{happiness:1,targetRel:-3,targetTrust:-2}]
  ]},
  {id:'cousin_path_crosses',cat:'Aile',min:10,max:80,w:5,cool:22,target:'cousin',text:'Kuzenin {name}, kendi hayatındaki önemli bir karar için senin fikrini sordu.',choices:[
   ['Elinden gelen öğüdü ver',{skill:1,targetRel:5,targetTrust:4,targetRespect:3}],
   ['Kararı kendisinin vermesini söyle',{happiness:1,targetRel:2,targetRespect:2}]
  ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='parenting_child_lie')){
 EVENT_DECK.push(
  {id:'parenting_child_lie',cat:'Çocuk',min:20,max:75,w:7,cool:16,req:'trainableChild',target:'trainingChild',text:'{name}, yaptığı küçük bir hatayı senden saklamaya çalışırken yakalandı.',choices:[
   ['Önce neden sakladığını dinle',{targetRel:4,targetTrust:6,targetRespect:2,targetGrudge:-2}],
   ['Kurala uymamasına sert karşılık ver',{targetRel:-2,targetTrust:-4,targetRespect:5,targetFear:5,targetGrudge:3}]
  ]},
  {id:'parenting_child_choice',cat:'Çocuk',min:22,max:80,w:6,cool:20,req:'trainableChild',target:'trainingChild',text:'{name}, senin önerdiğin yoldan farklı bir uğraşa ilgi duyduğunu söyledi.',choices:[
   ['Kendi ilgisini denemesine izin ver',{targetRel:5,targetTrust:6,targetRespect:2}],
   ['Önce seçtiğin yetişme yolunu sürdürmesini iste',{targetRel:-1,targetRespect:6,targetTrust:-2}]
  ]},
  {id:'parenting_sibling_conflict',cat:'Çocuk',min:24,max:80,w:7,cool:14,req:'multipleMinorChildren',target:'minorChild',text:'Çocukların arasında paylaşım ve ilgi yüzünden bir tartışma çıktı; {name} kendisine haksızlık edildiğini düşünüyor.',choices:[
   ['İkisini de dinleyip arayı bul',{happiness:2,targetRel:4,targetTrust:5,targetGrudge:-4}],
   ['Kimin haklı olduğuna hemen karar ver',{prestige:1,targetRespect:3,targetTrust:-2,targetGrudge:3}]
  ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='guardian_family_memory')){
 EVENT_DECK.push(
  {id:'guardian_family_memory',cat:'Himaye',min:5,max:17,w:7,cool:18,req:'underGuardianship',target:'guardian',text:'{name}, anne ve atanla ilgili daha önce hiç duymadığın bir hatırayı sana anlatmaya başladı.',choices:[
   ['Onu dikkatle dinle',{happiness:4,targetRel:4,targetTrust:5,targetRespect:2}],
   ['Bu konuyu bugün konuşmak istemediğini söyle',{happiness:1,targetRel:-1,targetTrust:-1}]
  ]},
  {id:'guardian_household_strain',cat:'Himaye',min:6,max:17,w:7,cool:16,req:'underGuardianship',target:'guardian',text:'{name} ile yaşadığın yurtta işler ağırlaştı; bakım düzeninizde gerginlik oluşuyor.',choices:[
   ['Yurt işlerine daha çok yardım et',{skill:2,happiness:1,targetRel:4,targetTrust:3,targetRespect:5}],
   ['Bir süre kendi haline çekil',{happiness:-1,targetRel:-2,targetTrust:-2}]
  ]},
  {id:'guardian_sibling_distance',cat:'Himaye',min:5,max:17,w:8,cool:14,req:'separatedMinorSibling',target:'separatedSibling',text:'Ayrı bir himaye ocağında yaşayan kardeşin {name} seni daha az gördüğünüzü söyledi.',choices:[
   ['Onu görmeye söz ver',{happiness:3,targetRel:6,targetTrust:5,targetGrudge:-3}],
   ['Şimdilik şartların zor olduğunu söyle',{happiness:-1,targetRel:-3,targetTrust:-2}]
  ]}
 );
}

function ensureMobility(){
 if(!s.mobility||typeof s.mobility!=='object'||Array.isArray(s.mobility))s.mobility={};
 const m=s.mobility;m.moves=Math.max(0,Math.round(m.moves||0));m.localStanding=clamp(Number.isFinite(m.localStanding)?m.localStanding:50);m.monthsHere=Math.max(0,Math.round(m.monthsHere||0));m.history=Array.isArray(m.history)?m.history.slice(-30):[];m.arrivalYear=m.arrivalYear??(s.year+s.age);m.arrivalAge=m.arrivalAge??s.age;m.homePlace=m.homePlace||s.place;m.homeRealm=m.homeRealm||s.realm;
 for(const n of allNPCs())if(n){n.place=n.place||n.origin||s.place;n.realm=n.realm||s.realm;}
 return m;
}
function realmActiveAt(realm,year=s.year+s.age){
 const cfg=D.realms[realm];return !!cfg&&year>=cfg.years[0]&&year<=cfg.years[1];
}
function migrationDestinations(){
 const year=s.year+s.age,out=[];
 for(const [realm,cfg] of Object.entries(D.realms)){
  if(!realmActiveAt(realm,year))continue;
  for(const place of cfg.places){
   if(realm===s.realm&&place===s.place)continue;
   const cross=realm!==s.realm;
   out.push({realm,place,cross,distance:cross?3:cfg.places.indexOf(place)===cfg.places.indexOf(s.place)?1:2});
  }
 }
 return out;
}
function householdMembers(mode='alone'){
 const base=[];if(mode==='household'||mode==='kin'){if(s.partner?.alive)base.push(s.partner);base.push(...s.children.filter(n=>n.alive));}
 if(mode==='kin')base.push(...s.parents.filter(n=>n.alive),...s.siblings.filter(n=>n.alive));
 return base.filter((n,i,a)=>n&&a.findIndex(x=>x.id===n.id)===i);
}
function migrationCost(dest,mode='alone'){
 const people=householdMembers(mode).length,assetLoad=s.assets.length,cross=dest.cross?4:0;
 return Math.max(1,2+dest.distance+cross+Math.ceil(people/3)+Math.ceil(assetLoad/4)-(s.assets.includes('horse')?1:0));
}
function migrationRisk(dest,mode='alone'){
 const people=householdMembers(mode).length,month=currentMonth(),winter=month>=10||month<=2?0.1:0,ride=(s.skills.riding||0)/600,horse=s.assets.includes('horse')?.06:0;
 return Math.max(.04,Math.min(.42,.08+dest.distance*.045+(dest.cross?.07:0)+people*.008+winter-ride-horse));
}
function migrationIssue(realm,place,mode='alone'){
 if(s.captive)return 'Tutsakken göç edemezsin.';if(s.exile)return 'Sürgün meselesini çözmeden planlı göç yapamazsın.';if(s.military.active)return 'Aktif seferde göç edemezsin.';if(s.age<16)return '16 yaşından önce göç kararını ailen verir.';
 const dest=migrationDestinations().find(x=>x.realm===realm&&x.place===place);if(!dest)return 'Bu bölge şu anda ulaşılabilir değil.';
 const cost=migrationCost(dest,mode);if(s.wealth<cost)return cost+' servet yol ve yerleşme payı gerekiyor.';return '';
}
function moveNPCTo(n,realm,place){if(!n)return;n.realm=realm;n.place=place;n.statusFlags=n.statusFlags||{};n.statusFlags.movedWithPlayer=true;rememberNPC(n,'move',place+' çevresine birlikte göçtünüz.',5);}
function applyDistanceConsequences(movedIds,oldRealm,oldPlace){
 const moved=new Set(movedIds);
 for(const n of allNPCs()){
  if(!n.alive||moved.has(n.id))continue;
  n.place=n.place||oldPlace;n.realm=n.realm||oldRealm;
  if(n.place===s.place&&n.realm===s.realm)continue;
  normalizeBonds(n);const close=['Ana','Ata','Çocuk','Eş','Erkek kardeş','Kız kardeş'].includes(n.type);
  n.rel=clamp(n.rel-(close?2:4));n.bonds.trust=clamp(n.bonds.trust-(close?1:3));rememberNPC(n,'distance','Göçten sonra aranıza uzaklık girdi.',3);
 }
}
function migrateTo(realm,place,mode='alone'){
 const issue=migrationIssue(realm,place,mode);if(issue){notice(issue);return false;}
 const dest=migrationDestinations().find(x=>x.realm===realm&&x.place===place);if(!dest)return false;
 return performAction({kind:'migration',realm,place,mode},()=>{
  const m=ensureMobility(),oldRealm=s.realm,oldPlace=s.place,cost=migrationCost(dest,mode),risk=migrationRisk(dest,mode),members=householdMembers(mode);
  s.wealth=Math.max(0,s.wealth-cost);economyLedger('migration',-cost,oldPlace+' → '+place+' göçü');
  const trouble=Math.random()<risk;
  if(trouble){const harm=rng(2,7);apply({health:-harm,happiness:-2});if(Math.random()<.28)acquireAilment('injury',{source:'göç yolu'});log('Göç yolunda zorlu hava, yol veya yük kaybı yaşadınız.','bad');}
  s.realm=realm;s.place=place;if(dest.cross){apply({prestige:-2});const q=ensureStateCourt();q.influence=Math.floor(q.influence*.25);q.councilTrust=Math.floor(q.councilTrust*.4);q.tribeSupport=Math.floor(q.tribeSupport*.6);q.rivalPressure=Math.floor(q.rivalPressure*.5);q.started=false;q.initialized=false;}
  const movedIds=[];for(const n of members){moveNPCTo(n,realm,place);movedIds.push(n.id);}
  if(mode==='alone'&&s.partner?.alive){adjustNPC(s.partner,{rel:-8,trust:-6,grudge:2},'Göç kararında yanında götürülmedi.');}
  if(mode==='household')for(const n of [...s.parents,...s.siblings].filter(n=>n.alive))adjustNPC(n,{rel:-2,trust:-1},'Göçten sonra daha uzakta yaşamaya başladınız.');
  applyDistanceConsequences(movedIds,oldRealm,oldPlace);housingAfterMigration(mode);
  m.moves++;m.localStanding=dest.cross?18:28;m.monthsHere=0;m.arrivalYear=s.year+s.age;m.arrivalAge=s.age;m.history.unshift({year:s.year+s.age,age:s.age,fromRealm:oldRealm,from:oldPlace,toRealm:realm,to:place,mode,cost,trouble});m.history=m.history.slice(0,30);
  if(s.role&&['Boy Beyi','Elçi','Bitigçi'].includes(s.role)&&dest.cross){s.retiredRole=s.role;s.role=null;log('Başka siyasi çevreye göçün eski devlet görevini sona erdirdi.','major');}
  log(oldPlace+' çevresinden '+place+' çevresine göç ettin'+(members.length?' • yanında '+members.length+' yakın vardı':'')+'.','major');
 },place+' çevresine göç yolculuğuyla bir ay geçti.');
}
function localIntegrationAction(id){
 performAction({kind:'settlement',id},()=>{
  const m=ensureMobility();
  if(id==='neighbors'){m.localStanding=clamp(m.localStanding+8);apply({happiness:2});if(Math.random()<.45){const g=pick(['male','female']),age=Math.max(8,s.age+rng(-5,6)),n=normalizeNPC({name:pick(D.realms[s.realm][g]),gender:g,age,birthYear:s.year+s.age-age,alive:true,type:'Yerel Dost',rel:rng(56,70),realm:s.realm,place:s.place,tribe:pick(D.realms[s.realm].tribes)},'Yerel Dost');adjustNPC(n,{trust:8,respect:3},'Yeni yerleşimde tanıştınız.');s.friends.push(n);}}
  else if(id==='work'){m.localStanding=clamp(m.localStanding+6);skillGain('craft',1);skillGain('trade',1);apply({wealth:rng(0,2),prestige:1});}
  else if(id==='gathering'){m.localStanding=clamp(m.localStanding+10);skillGain('speech',2);apply({prestige:2,happiness:2});}
 },id==='neighbors'?'Yeni komşularla tanışmaya bir ay ayırdın.':id==='work'?'Yeni obada ortak işe katıldın.':'Yeni çevrenin toplantı ve toylarına katıldın.');
}
function tickMobilityMonth(){
 const m=ensureMobility();m.monthsHere++;
 if(m.monthsHere<=6&&m.localStanding<35&&Math.random()<.12)apply({happiness:-1});
 if(m.monthsHere%3===0&&m.localStanding<70)m.localStanding=clamp(m.localStanding+1);
}
function mobilitySummaryHtml(){
 const m=ensureMobility(),dests=migrationDestinations(),recent=m.history[0];
 const modes=[['alone','Yalnız'],['household','Ocakla'],['kin','Yakınlarla']];
 let html='<div class="card"><h3>🧭 Göç ve Yerleşim</h3><p><b>'+safeText(s.place)+'</b> • '+safeText(s.realm)+'<br>Yerel bağ '+m.localStanding+' • burada '+m.monthsHere+' ay • toplam '+m.moves+' göç'+(recent?'<br>Son göç: '+safeText(recent.from)+' → '+safeText(recent.to):'')+'</p><div class="grid2">'+actionButton('Komşularla tanış',{kind:'settlement',id:'neighbors'},"localIntegrationAction('neighbors')",'Yeni yerde bağ ve mutluluk kazan.')+actionButton('Ortak işe katıl',{kind:'settlement',id:'work'},"localIntegrationAction('work')",'Yerel itibar ve küçük kazanç sağlar.')+actionButton('Toy ve toplantılara katıl',{kind:'settlement',id:'gathering'},"localIntegrationAction('gathering')",'Yeni obada sözünün duyulmasını sağlar.')+'</div></div>';
 if(s.age>=16&&!s.captive&&!s.exile&&!s.military.active&&dests.length){
  html+='<h3 class="sectionTitle">Göç Yolları</h3><div class="grid2">'+dests.slice(0,12).map(d=>{const cost=migrationCost(d,'household'),risk=Math.round(migrationRisk(d,'household')*100);return '<div class="card"><h3>'+safeText(d.place)+'</h3><p>'+safeText(d.realm)+(d.cross?' • başka siyasi çevre':' • aynı çevre')+'<br>Ocakla yol payı '+cost+' • yol riski yaklaşık %'+risk+'</p><div class="actions">'+modes.map(([mode,label])=>{const issue=migrationIssue(d.realm,d.place,mode);return '<button class="mini" '+(issue?'disabled title="'+safeText(issue)+'"':'')+' onclick="migrateTo('+JSON.stringify(d.realm)+','+JSON.stringify(d.place)+','+JSON.stringify(mode)+')">'+label+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';
 }
 return html;
}

function ensureLifeVariety(){
 if(!s.variety||typeof s.variety!=='object'||Array.isArray(s.variety))s.variety={};
 const v=s.variety;v.activityStats=v.activityStats&&typeof v.activityStats==='object'&&!Array.isArray(v.activityStats)?v.activityStats:{};v.recent=Array.isArray(v.recent)?v.recent.slice(-12):[];v.completed=Array.isArray(v.completed)?v.completed.slice(-30):[];v.annualHistory=Array.isArray(v.annualHistory)?v.annualHistory.slice(-20):[];v.rerolls=Math.max(0,Math.round(v.rerolls||0));
 const year=s.year+s.age;if(!v.ambition||v.ambition.year!==year)startAnnualAmbition(false);
 return v;
}
function ambitionCandidates(exclude=''){
 return AMBITION_DEFS.filter(x=>x.id!==exclude&&x.eligible()).map(x=>x.id);
}
function startAnnualAmbition(reroll=false){
 if(!s.variety||typeof s.variety!=='object'||Array.isArray(s.variety))s.variety={activityStats:{},recent:[],completed:[],annualHistory:[],rerolls:0};
 const v=s.variety,year=s.year+s.age,old=v.ambition?.id||'',ids=ambitionCandidates(reroll?old:'');
 const id=ids.length?pick(ids):'variety',d=AMBITION_DEFS.find(x=>x.id===id)||AMBITION_DEFS[0];
 if(v.ambition&&v.ambition.year!==year)v.annualHistory.unshift({...v.ambition});
 v.ambition={id:d.id,title:d.title,desc:d.desc,target:d.target,progress:0,year,done:false,keys:[],reward:d.reward};if(reroll)v.rerolls++;
 return v.ambition;
}
function rerollAnnualAmbition(){
 const v=ensureLifeVariety();if(v.ambition.done){notice('Bu yılın amacını zaten tamamladın.');return;}if(v.ambition.rerolled){notice('Bu yıl amacını zaten bir kez değiştirdin.');return;}
 startAnnualAmbition(true);v.ambition.rerolled=true;render();save();
}
function actionVarietyKey(a={}){
 if(a.kind==='period')return 'period:'+a.id;if(a.kind==='training')return 'training:'+a.id;if(a.kind==='activity')return 'activity:'+a.id;
 if(a.kind==='npc')return 'npc:'+a.id;if(a.kind==='venture')return 'venture:'+a.id;if(a.kind==='maintenance')return 'maintenance:'+a.id;
 return a.kind||'wait';
}
function ambitionActionMatch(a,amb){
 if(!amb)return false;
 if(amb.id==='variety')return !['wait','guardian'].includes(a.kind);
 if(amb.id==='learn')return ['training','activity'].includes(a.kind)||(a.kind==='period'&&['bardlisten','watchwrestling','horsecare','herdcare','council','petition'].includes(a.id));
 if(amb.id==='kin')return a.kind==='npc'&&['parents','siblings','children','partner','relatives'].includes(a.group);
 if(amb.id==='work')return a.kind==='work';
 if(amb.id==='trade')return a.kind==='venture'||(a.kind==='period'&&['market','caravanmarket','herdcare','summer_caravan','autumn_store'].includes(a.id));
 if(amb.id==='health')return a.kind==='health'||(a.kind==='period'&&['rest','healer'].includes(a.id));
 if(amb.id==='venture')return ['venture','maintenance'].includes(a.kind);
 if(amb.id==='season')return a.kind==='period'&&SEASONAL_ACTIVITIES.some(x=>x.id===a.id);
 return false;
}
function trackLifeVarietyAction(a={}){
 const v=ensureLifeVariety(),key=actionVarietyKey(a),month=currentMonth();v.recent.push({key,kind:a.kind,id:a.id||'',year:s.year+s.age,month});v.recent=v.recent.slice(-12);
 const stat=v.activityStats[key]||(v.activityStats[key]={count:0,lastYear:null,lastMonth:null});stat.count++;stat.lastYear=s.year+s.age;stat.lastMonth=month;
 const amb=v.ambition;if(!amb.done&&ambitionActionMatch(a,amb)){
  if(['variety','season'].includes(amb.id)){if(!amb.keys.includes(key)){amb.keys.push(key);amb.progress++;}}
  else amb.progress++;
  if(amb.progress>=amb.target){amb.progress=amb.target;amb.done=true;v.completed.unshift({id:amb.id,title:amb.title,year:s.year+s.age});apply(amb.reward||{});log('Yıllık amaç tamamlandı: '+amb.title+'.','major');}
 }
}
function periodRepeatCount(id){
 const v=ensureLifeVariety(),key='period:'+id;return v.recent.slice(-5).filter(x=>x.key===key).length;
}
function periodNoveltyBonus(id){
 const repeats=periodRepeatCount(id);if(repeats===0){apply({happiness:2,skill:1});return 'Yeni bir şey denediğin için ayrıca canlılık kazandın.';}
 if(repeats>=3){apply({happiness:-1});return 'Aynı uğraşı art arda tekrarlamak artık eskisi kadar canlı hissettirmedi.';}
 return '';
}
function seasonalActivitiesNow(){
 const m=currentMonth();return SEASONAL_ACTIVITIES.filter(a=>s.age>=a.age&&a.months.includes(m)&&(!a.req||a.req()));
}
function activityStatLabel(id){
 const st=ensureLifeVariety().activityStats['period:'+id];if(!st)return 'Henüz yapmadın';return st.count+' kez • son '+st.lastYear+' yılı';
}
function varietySummaryHtml(){
 const v=ensureLifeVariety(),a=v.ambition,pct=Math.min(100,Math.round(a.progress/a.target*100)),unique=new Set(v.recent.filter(x=>x.year===s.year+s.age).map(x=>x.key)).size;
 return '<div class="card"><h3>🎯 Bu Yılın Amacı</h3><p><b>'+safeText(a.title)+'</b><br>'+safeText(a.desc)+'<br>İlerleme '+a.progress+'/'+a.target+' • bu yıl '+unique+' farklı eylem</p><div class="rbar"><i style="width:'+pct+'%"></i></div>'+(a.done?'<div class="memoryline">✓ Tamamlandı</div>':'<button class="mini" onclick="rerollAnnualAmbition()">Amacı bir kez değiştir</button>')+'</div>';
}
function seasonalActivitiesHtml(){
 const arr=seasonalActivitiesNow();if(!arr.length)return '';
 return '<h3 class="sectionTitle">Bu Ay Öne Çıkanlar</h3><div class="grid2">'+arr.map(a=>actionButton(a.icon+' '+a.name,{kind:'period',id:a.id},"doPeriodActivity('"+a.id+"')",a.desc+' • mevsimlik')).join('')+'</div>';
}

function ensureDisplacement(){
 if(!s.displacement||typeof s.displacement!=='object'||Array.isArray(s.displacement))s.displacement={};
 const d=s.displacement;
 if(!d.captivity||typeof d.captivity!=='object'||Array.isArray(d.captivity))d.captivity={};
 if(!d.exile||typeof d.exile!=='object'||Array.isArray(d.exile))d.exile={};
 const c=d.captivity,e=d.exile;
 c.months=Math.max(0,Math.round(c.months||0));c.escapePrep=clamp(Number.isFinite(c.escapePrep)?c.escapePrep:0);c.guardPressure=clamp(Number.isFinite(c.guardPressure)?c.guardPressure:38);c.rations=clamp(Number.isFinite(c.rations)?c.rations:55);c.standing=clamp(Number.isFinite(c.standing)?c.standing:20);c.ransomSupport=clamp(Number.isFinite(c.ransomSupport)?c.ransomSupport:0);c.labor=Math.max(0,Math.round(c.labor||0));c.episodes=Math.max(0,Math.round(c.episodes||0));c.contacts=Array.isArray(c.contacts)?c.contacts:[];c.history=Array.isArray(c.history)?c.history.slice(-20):[];
 e.months=Math.max(0,Math.round(e.months||0));e.shelter=clamp(Number.isFinite(e.shelter)?e.shelter:30);e.foodSecurity=clamp(Number.isFinite(e.foodSecurity)?e.foodSecurity:45);e.localStanding=clamp(Number.isFinite(e.localStanding)?e.localStanding:20);e.returnSupport=clamp(Number.isFinite(e.returnSupport)?e.returnSupport:0);e.episodes=Math.max(0,Math.round(e.episodes||0));e.contacts=Array.isArray(e.contacts)?e.contacts:[];e.history=Array.isArray(e.history)?e.history.slice(-20):[];
 if(s.captive&&!c.active){c.active=true;c.episodes++;c.months=0;c.escapePrep=0;c.guardPressure=38;c.rations=55;c.standing=20;c.ransomSupport=0;c.labor=0;c.contacts=[];c.enteredYear=s.year+s.age;c.enteredAge=s.age;c.source=c.source||'tutsaklık';}
 if(!s.captive)c.active=false;
 if(s.exile&&!e.active){e.active=true;e.episodes++;e.months=0;e.shelter=s.assets?.includes('yurt')?65:28;e.foodSecurity=45;e.localStanding=20;e.returnSupport=0;e.contacts=[];e.enteredYear=s.year+s.age;e.enteredAge=s.age;e.source=e.source||'sürgün';}
 if(!s.exile)e.active=false;
 return d;
}
function makeDisplacementNPC(type){
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=Math.max(12,s.age+rng(-8,12));
 return normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:rng(38,58),type,realm:s.realm,place:s.place,tribe:pick(cfg.tribes),prestige:rng(3,28),traits:chooseNPCTraits()},type);
}
function ensureCaptivityContacts(min=1){
 const c=ensureDisplacement().captivity;
 while(c.contacts.filter(n=>n.alive).length<min&&c.contacts.length<3){const n=makeDisplacementNPC('Tutsak Yoldaşı');n.statusFlags=n.statusFlags||{};n.statusFlags.captivityContact=true;c.contacts.push(n);}
 return c.contacts.filter(n=>n.alive);
}
function ensureExileContacts(min=1){
 const e=ensureDisplacement().exile;
 while(e.contacts.filter(n=>n.alive).length<min&&e.contacts.length<3){const n=makeDisplacementNPC('Sürgün Komşusu');n.statusFlags=n.statusFlags||{};n.statusFlags.exileContact=true;e.contacts.push(n);}
 return e.contacts.filter(n=>n.alive);
}
function enterCaptivity(source='tutsaklık'){
 s.captive=true;const c=ensureDisplacement().captivity;c.source=source;ensureCaptivityContacts(1);unlock('captive');return c;
}
function leaveCaptivity(reason='serbest kaldı'){
 const c=ensureDisplacement().captivity;c.history.unshift({year:s.year+s.age,age:s.age,months:c.months,reason,prep:c.escapePrep,standing:c.standing});c.history=c.history.slice(0,20);c.releaseReason=reason;c.active=false;s.captive=false;s.flags.former_captive=true;unlock('free');log('Tutsaklık sona erdi: '+reason+'.','major');
}
function enterExile(source='töre kararı'){
 s.exile=true;const e=ensureDisplacement().exile;e.source=source;ensureExileContacts(1);return e;
}
function leaveExile(reason='geri dönüş'){
 const e=ensureDisplacement().exile;e.history.unshift({year:s.year+s.age,age:s.age,months:e.months,reason,shelter:e.shelter,standing:e.localStanding});e.history=e.history.slice(0,20);e.returnReason=reason;e.active=false;s.exile=false;s.flags.former_exile=true;log('Sürgün sona erdi: '+reason+'.','major');
}
function familySupportScore(){
 const close=[...s.parents,...s.siblings,...s.children,...(s.partner?[s.partner]:[])].filter(n=>n?.alive);
 if(!close.length)return 0;return Math.round(close.reduce((a,n)=>a+(n.rel||0)+(n.bonds?.trust||0)/2,0)/close.length);
}
function applyDisplacementEffect(x={}){
 const d=ensureDisplacement();
 if(x.captivity){const q=x.captivity;for(const [k,v] of Object.entries(q))if(['escapePrep','guardPressure','rations','standing','ransomSupport'].includes(k))d.captivity[k]=clamp((d.captivity[k]||0)+v);}
 if(x.exile){const q=x.exile;for(const [k,v] of Object.entries(q))if(['shelter','foodSecurity','localStanding','returnSupport'].includes(k))d.exile[k]=clamp((d.exile[k]||0)+v);}
}
function tickDisplacementMonth(month,action={}){
 const d=ensureDisplacement();
 if(s.captive){
  const c=d.captivity;c.months++;c.rations=clamp(c.rations-rng(3,6));c.guardPressure=clamp(c.guardPressure+rng(-2,3)-(c.standing>=65?1:0));
  if(c.rations<25)apply({health:-2,happiness:-2});if(c.rations<8){apply({health:-2});if(Math.random()<.18)acquireAilment('exhaustion',{source:'tutsaklıkta yetersiz beslenme'});}
  if(c.months%3===0&&c.standing>=55)c.rations=clamp(c.rations+5);
 }else if(s.exile){
  const e=d.exile;e.months++;e.shelter=clamp(e.shelter-rng(1,3));e.foodSecurity=clamp(e.foodSecurity-(month>=10||month<=2?rng(4,7):rng(2,4)));
  if(e.shelter<30)apply({health:-1,happiness:-1});if(e.foodSecurity<25)apply({health:-1,happiness:-2});
  if((month>=10||month<=2)&&e.shelter<35&&Math.random()<.16)acquireAilment('chill',{source:'sürgünde yetersiz barınma'});
  if(e.localStanding>=60)e.returnSupport=clamp(e.returnSupport+1);
 }
}
function captivityAction(id){
 performAction({kind:'captivity',id},()=>{
  const c=ensureDisplacement().captivity,contact=ensureCaptivityContacts(1)[0];
  if(id==='endure'){c.rations=clamp(c.rations+4);c.guardPressure=clamp(c.guardPressure-2);apply({happiness:-1});}
  else if(id==='labor'){c.rations=clamp(c.rations+rng(10,16));c.standing=clamp(c.standing+6);c.guardPressure=clamp(c.guardPressure-2);c.labor++;skillGain('craft',1);apply({health:-rng(0,2)});}
  else if(id==='observe'){c.escapePrep=clamp(c.escapePrep+rng(10,17)+Math.floor((s.skills.literacy||0)/20));c.guardPressure=clamp(c.guardPressure+rng(-1,3));apply({skill:1});}
  else if(id==='bond'){adjustNPC(contact,{rel:7,trust:7,respect:2,grudge:-2},'Tutsaklıkta birbirinize destek oldunuz.');c.standing=clamp(c.standing+5);if((contact.bonds?.trust||0)>=62&&(contact.rel||0)>=68)makeTargetFriend(contact,'Eski tutsak yoldaşı');}
  else if(id==='ransom'){const support=Math.max(4,Math.round(familySupportScore()/9)+(s.skills.speech||0)/15);c.ransomSupport=clamp(c.ransomSupport+support);if(c.ransomSupport>=55&&Math.random()<Math.min(.75,.2+c.ransomSupport/140)){leaveCaptivity('yakınlarının fidye ve arabuluculuk girişimi');}}
 },id==='labor'?'Kampta işe ve karşılığında erzak toplamaya bir ay ayırdın.':id==='observe'?'Gözcüleri ve kamp düzenini izledin.':id==='bond'?'Tutsak yoldaşınla bağ kurdun.':id==='ransom'?'Yakınlarına haber ulaştırmaya çalıştın.':'Tutsaklıkta dayanıp düzenini korumaya çalıştın.');
}
function captivityContactAction(index){
 performAction({kind:'captivity',id:'contact'},()=>{const n=ensureCaptivityContacts(index+1)[index];if(!n)return;adjustNPC(n,{rel:8,trust:7,respect:3},'Aynı tutsaklık günlerinde birbirinizi kolladınız.');const c=ensureDisplacement().captivity;c.standing=clamp(c.standing+4);if((n.bonds?.trust||0)>=62&&(n.rel||0)>=68)makeTargetFriend(n,'Eski tutsak yoldaşı');},'Tutsaklardan biriyle uzun uzun konuştun.');
}
function exileAction(id){
 performAction({kind:'exile',id},()=>{
  const e=ensureDisplacement().exile,contact=ensureExileContacts(1)[0];
  if(id==='shelter'){e.shelter=clamp(e.shelter+rng(16,25)+(s.skills.craft||0)/20);skillGain('craft',1);apply({health:-1});}
  else if(id==='food'){e.foodSecurity=clamp(e.foodSecurity+rng(16,25)+(s.skills.trade||0)/20);skillGain('trade',1);}
  else if(id==='locals'){e.localStanding=clamp(e.localStanding+9);adjustNPC(contact,{rel:7,trust:6,respect:2},'Sürgün günlerinde komşuluk ettiniz.');if((contact.bonds?.trust||0)>=60&&(contact.rel||0)>=68)makeTargetFriend(contact,'Sürgün dostu');}
  else if(id==='return'){e.returnSupport=clamp(e.returnSupport+Math.max(6,Math.round((s.skills.speech||0)/8+s.prestige/20+e.localStanding/12)));if(e.returnSupport>=60&&Math.random()<Math.min(.8,.25+e.returnSupport/150))leaveExile('arabuluculukla obaya dönüş izni');}
 },id==='shelter'?'Sürgünde daha sağlam bir barınak kurmaya uğraştın.':id==='food'?'Erzak ve takas ağı kurmaya bir ay ayırdın.':id==='locals'?'Yeni çevrendeki insanlarla bağ kurdun.':'Obaya dönüş için haber ve arabulucu gönderdin.');
}
function displacementSummaryHtml(){
 const d=ensureDisplacement();
 if(s.captive){const c=d.captivity,contacts=ensureCaptivityContacts(1);return '<div class="card"><h3>⛓ Tutsaklık Yaşamı</h3><p>'+c.months+' ay • erzak '+c.rations+' • gözetim '+c.guardPressure+' • kaçış hazırlığı '+c.escapePrep+' • kamp itibarı '+c.standing+'<br>Fidye/ailenin desteği '+c.ransomSupport+'</p><div class="grid2">'+actionButton('Dayan',{kind:'captivity',id:'endure'},"captivityAction('endure')",'Erzağı ve gücünü korumaya çalış.')+actionButton('İş gör, erzak kazan',{kind:'captivity',id:'labor'},"captivityAction('labor')",'Yorucu ama erzak ve kamp itibarı sağlar.')+actionButton('Kampı gözle',{kind:'captivity',id:'observe'},"captivityAction('observe')",'Kaçış hazırlığını artırır.')+actionButton('Yakınlara haber gönder',{kind:'captivity',id:'ransom'},"captivityAction('ransom')",'Aile bağların ve hitabetin etkili olur.')+'</div><h3>Tutsak Yoldaşları</h3><div class="grid2">'+contacts.map((n,i)=>actionButton('🤝 '+safeText(n.name),{kind:'captivity',id:'contact'},'captivityContactAction('+i+')','Bağ '+(n.rel||0)+' • güven '+(n.bonds?.trust||0))).join('')+'</div></div>';}
 if(s.exile){const e=d.exile,contacts=ensureExileContacts(1);return '<div class="card"><h3>↗ Sürgünde Yaşam</h3><p>'+e.months+' ay • barınak '+e.shelter+' • erzak güveni '+e.foodSecurity+' • yerel bağ '+e.localStanding+' • dönüş desteği '+e.returnSupport+'</p><div class="grid2">'+actionButton('Barınağı güçlendir',{kind:'exile',id:'shelter'},"exileAction('shelter')",'Soğuk ve sağlık riskini azaltır.')+actionButton('Erzak ağı kur',{kind:'exile',id:'food'},"exileAction('food')",'Av, emek ve takasla güvence sağlar.')+actionButton('Yerel bağ kur',{kind:'exile',id:'locals'},"exileAction('locals')",'Yeni insanlarla kalıcı ilişki kurabilirsin.')+actionButton('Dönüş için arabulucu ara',{kind:'exile',id:'return'},"exileAction('return')",'Hitabet, itibar ve yerel destek etkili olur.')+'</div><p class="note">Yeni çevrenden: '+contacts.map(n=>safeText(n.name)+' ('+(n.rel||0)+')').join(' • ')+'</p></div>';}
 const past=(d.captivity.history?.length||0)+(d.exile.history?.length||0);return past?'<div class="card"><h3>🧭 Zorunlu Ayrılık Geçmişi</h3><p>'+(d.captivity.history?.length||0)+' tutsaklık dönemi • '+(d.exile.history?.length||0)+' tamamlanmış sürgün dönemi</p></div>':'';
}

function ecoClamp(v,min,max){return Math.max(min,Math.min(max,v));}
function ensureEconomy(){
 if(!s.economy||typeof s.economy!=='object'||Array.isArray(s.economy))s.economy={};
 const e=s.economy;
 e.marketIndex=ecoClamp(Math.round(Number.isFinite(e.marketIndex)?e.marketIndex:100),75,145);
 e.foodPressure=clamp(Number.isFinite(e.foodPressure)?e.foodPressure:25);
 e.tradeDemand=clamp(Number.isFinite(e.tradeDemand)?e.tradeDemand:50);
 e.craftDemand=clamp(Number.isFinite(e.craftDemand)?e.craftDemand:50);
 e.shortageMonths=Math.max(0,Math.round(e.shortageMonths||0));e.upkeepPaid=Math.max(0,Math.round(e.upkeepPaid||0));e.upkeepMissed=Math.max(0,Math.round(e.upkeepMissed||0));
 e.assetState=e.assetState&&typeof e.assetState==='object'&&!Array.isArray(e.assetState)?e.assetState:{};e.ledger=Array.isArray(e.ledger)?e.ledger.slice(-36):[];
 for(const id of s.assets||[]){if(!e.assetState[id])e.assetState[id]={condition:82,lastCareYear:null,lastManagedYear:null,losses:0,profits:0};const q=e.assetState[id];q.condition=clamp(Number.isFinite(q.condition)?q.condition:82);q.losses=Math.max(0,q.losses||0);q.profits=Math.max(0,q.profits||0);}
 for(const id of Object.keys(e.assetState))if(!(s.assets||[]).includes(id))delete e.assetState[id];
 return e;
}
function economyLedger(kind,amount,note){
 const e=ensureEconomy();e.ledger.unshift({year:s.year+s.age,month:currentMonth(),kind,amount:Math.round(amount||0),note:String(note||'')});e.ledger=e.ledger.slice(0,36);
}
function economySeasonBias(month){return month<=2?10:month<=5?-5:month<=8?-2:month<=10?2:8;}
function wealthTier(){
 const w=s.wealth;return w<=3?'Geçim sıkıntısı':w<20?'Mütevazı':w<55?'Rahat':w<120?'Varlıklı':'Obanın zenginleri';
}
function householdBurden(){
 const members=housingResidents(),dependents=members.filter(n=>n?.alive&&(n.age<16||n.age>=60)).length;
 return {dependents,size:housingResidentCount()};
}
function householdQuarterCost(){
 const e=ensureEconomy(),h=householdBurden(),base=1+Math.floor(h.size/3)+Math.floor(h.dependents/3);
 return Math.max(1,Math.round((base*(e.marketIndex/100)+(e.foodPressure>=70?1:0))*housingCostMultiplier()));
}
function assetState(id){const e=ensureEconomy();return e.assetState[id]||(e.assetState[id]={condition:82,lastCareYear:null,lastManagedYear:null,losses:0,profits:0});}
function assetBuyPrice(id){
 const a=D.assets.find(x=>x.id===id);if(!a)return 0;const e=ensureEconomy(),demand=id==='caravan_share'?e.tradeDemand:id==='smithy'?e.craftDemand:id==='flock'?Math.max(e.foodPressure,35):45;
 return Math.max(1,Math.round(a.cost*(.78+e.marketIndex/250+demand/500)));
}
function assetSaleValue(id){
 const a=D.assets.find(x=>x.id===id);if(!a)return 0;const st=assetState(id);
 return Math.max(1,Math.round(assetBuyPrice(id)*(.42+st.condition/220)));
}
function maintenanceCost(id){const cfg=ASSET_ECONOMY[id]||{upkeep:1};return Math.max(1,cfg.upkeep||1);}
function careerDemandMultiplier(path){
 const e=ensureEconomy();if(path==='trade')return .7+e.tradeDemand/125;if(path==='craft')return .7+e.craftDemand/125;if(path==='civil')return .8+(100-e.foodPressure)/250;return .9+e.marketIndex/500;
}
function passiveAssetQuarter(id,month){
 const e=ensureEconomy(),st=assetState(id),cfg=ASSET_ECONOMY[id]||{wear:1};st.condition=clamp(st.condition-(cfg.wear||1)-(e.shortageMonths>=2?1:0));
 if(st.condition<20){economyLedger('asset',0,id+' bakımsız kaldığı için üretim vermedi.');return 0;}
 let gain=0;
 if(id==='flock'){
  const seasonal=month<=2?-1:month<=8?1:0,gross=rng(0,3)+seasonal+(s.skills.trade>=45?1:0);
  if(Math.random()<.12+e.foodPressure/700){gain=-rng(1,3);st.losses++;}else gain=Math.max(0,gross);
 }else if(id==='smithy'&&s.skills.craft>=40){
  if(Math.random()<.1){gain=-1;st.losses++;}else gain=Math.max(0,Math.round(rng(1,4)*(.65+e.craftDemand/100)));
 }else if(id==='caravan_share'){
  if(Math.random()<.22){gain=-rng(1,5);st.losses++;}else gain=Math.max(0,Math.round(rng(1,5)*(.6+e.tradeDemand/100)));
 }
 if(gain){s.wealth=Math.max(0,s.wealth+gain);if(gain>0)st.profits+=gain;economyLedger('asset',gain,id+' dönem getirisi');}
 return gain;
}
function tickEconomyQuarter(month){
 if(s.age<18)return;const e=ensureEconomy(),bias=economySeasonBias(month);
 e.marketIndex=ecoClamp(e.marketIndex+bias+rng(-5,5),75,145);
 e.foodPressure=clamp(e.foodPressure+(month<=2?rng(4,10):month<=8?rng(-7,2):rng(-1,5))-(s.assets.includes('flock')?2:0));
 e.tradeDemand=clamp(e.tradeDemand+rng(-8,8)+(month>=4&&month<=9?3:-1));e.craftDemand=clamp(e.craftDemand+rng(-7,7)+(s.assets.includes('smithy')?1:0));
 const cost=householdQuarterCost(),upkeep=s.assets.reduce((a,id)=>a+(ASSET_ECONOMY[id]?.upkeep||0),0),due=cost+upkeep,pay=Math.min(s.wealth,due);
 s.wealth-=pay;e.upkeepPaid+=pay;
 if(pay<due){const missing=due-pay;e.upkeepMissed+=missing;e.shortageMonths++;apply({happiness:-Math.min(4,missing),health:e.shortageMonths>=2?-1:0});for(const id of s.assets)assetState(id).condition=clamp(assetState(id).condition-3);economyLedger('expense',-pay,'Geçim ve bakım gideri tam karşılanamadı.');}
 else{e.shortageMonths=Math.max(0,e.shortageMonths-1);economyLedger('expense',-due,'Üç aylık hane geçimi ve varlık bakımı');}
 for(const id of s.assets)passiveAssetQuarter(id,month);
}
function applyEconomyEffect(x={}){
 const e=ensureEconomy();if(x.market)e.marketIndex=ecoClamp(e.marketIndex+x.market,75,145);if(x.food)e.foodPressure=clamp(e.foodPressure+x.food);if(x.trade)e.tradeDemand=clamp(e.tradeDemand+x.trade);if(x.craft)e.craftDemand=clamp(e.craftDemand+x.craft);if(x.shortage)e.shortageMonths=Math.max(0,e.shortageMonths+x.shortage);
}
function economySummaryHtml(){
 const e=ensureEconomy(),recent=e.ledger.slice(0,5);
 return '<div class="card"><h3>🧺 Oba Ekonomisi</h3><p>'+wealthTier()+' • Pazar baskısı '+e.marketIndex+' • Erzak baskısı '+e.foodPressure+'<br>Kervan talebi '+e.tradeDemand+' • Zanaat talebi '+e.craftDemand+' • Geçim sıkıntısı '+e.shortageMonths+' dönem</p>'+(recent.length?'<div class="memoryline">'+recent.map(x=>(x.amount>0?'+':'')+x.amount+' • '+safeText(x.note)).join('<br>')+'</div>':'')+'</div>';
}
function maintainAsset(id){
 performAction({kind:'maintenance',id},()=>{const cost=maintenanceCost(id),st=assetState(id);s.wealth-=cost;st.condition=clamp(st.condition+22);st.lastCareYear=s.year+s.age;economyLedger('maintenance',-cost,id+' bakımı');},'Varlığın bakımına bir ay ayırdın.');
}

function ensureSuccession(){
 s.succession=s.succession&&typeof s.succession==='object'&&!Array.isArray(s.succession)?s.succession:{};
 const q=s.succession;q.prepared=!!q.prepared;q.chosenHeirId=q.chosenHeirId||null;q.familyHarmony=clamp(Number.isFinite(q.familyHarmony)?q.familyHarmony:60);
 q.lastCouncilYear=Number.isFinite(q.lastCouncilYear)?q.lastCouncilYear:null;q.lastWish=q.lastWish||'';q.elderYears=Math.max(0,Math.floor(q.elderYears||0));q.history=Array.isArray(q.history)?q.history.slice(-24):[];
 return q;
}
function livingHeirs(){return s.children.filter(n=>n.alive);}
function successionModeText(){
 const q=ensureSuccession(),heirs=livingHeirs();if(!heirs.length)return 'Yaşayan varis yok';
 if(s.will==='equal'||!heirs.some(n=>n.id===s.will))return 'Yaşayan çocuklara eşit paylaşım';
 const n=heirs.find(n=>n.id===s.will);return n?safeText(n.name)+' ana varis':'Yaşayan çocuklara eşit paylaşım';
}
function inheritanceShareFor(child,heirs=livingHeirs()){
 if(!child||!heirs.length)return {wealth:0,assets:[],equal:true};
 const equal=s.will==='equal'||!heirs.some(n=>n.id===s.will),i=Math.max(0,heirs.findIndex(n=>n.id===child.id));
 return {equal,wealth:equal?Math.floor(s.wealth/heirs.length):s.will===child.id?s.wealth:0,assets:equal?s.assets.filter((_,j)=>j%heirs.length===i):s.will===child.id?[...s.assets]:[]};
}
function applySuccessionEffect(spec={}){
 const q=ensureSuccession(),target=npcById(s.pendingEventContext?.targetId),mode=spec.mode||'';
 if(mode==='equal'){s.will='equal';q.chosenHeirId=null;}
 if(mode==='target'&&target&&s.children.some(n=>n.id===target.id&&n.alive)){s.will=target.id;q.chosenHeirId=target.id;}
 if(spec.prepared!==false)q.prepared=true;if(spec.harmony)q.familyHarmony=clamp(q.familyHarmony+spec.harmony);if(spec.lastWish)q.lastWish=String(spec.lastWish);
 q.lastCouncilYear=s.year+s.age;q.history.unshift({year:s.year+s.age,age:s.age,mode:s.will==='equal'?'equal':'chosen',targetId:q.chosenHeirId,note:String(spec.note||spec.lastWish||'Aile geleceği konuşuldu.'),harmony:q.familyHarmony});q.history=q.history.slice(0,24);
}
function elderYearTick(){
 if(s.age<50)return;const q=ensureSuccession();q.elderYears++;
 const heirs=livingHeirs();if(heirs.length){const avg=Math.round(heirs.reduce((a,n)=>a+(n.rel||0),0)/heirs.length);q.familyHarmony=clamp(q.familyHarmony+(avg>=72?1:avg<45?-2:0));if(!q.prepared&&s.age>=60&&(s.wealth>=40||s.assets.length>=2))q.familyHarmony=clamp(q.familyHarmony-1);}
 if(s.age>=65&&s.role&&ensureHealthProfile().frailty>=72&&Math.random()<.25)log('Yaş ilerledikçe ağır görevin yükü daha belirgin hissediliyor.','bad');
}
function deathCauseLabel(){
 const active=(s.ailments||[]).slice().sort((a,b)=>(b.severity||0)-(a.severity||0))[0],h=ensureHealthProfile();
 if(s.health<=0&&active)return AILMENTS[active.id]?.name||'ağır rahatsızlık';
 if(s.age>=75&&h.frailty>=65)return 'ileri yaş ve bedenin güçten düşmesi';
 if(h.scars.length&&s.health<25)return 'eski yaralar ve zayıflayan sağlık';
 if(s.age>=60)return 'yaşlılıkta sağlık kaybı';
 return s.health<20?'ağır sağlık kaybı':'ani yaşam sonu';
}
function successionSummaryHtml(){
 const q=ensureSuccession();if(s.age<45&&!q.prepared)return '';
 const heirs=livingHeirs(),wish=q.lastWish?'<br>Son dilek: '+safeText(q.lastWish):'';
 return '<h3 class="sectionTitle">Vasiyet ve Soy Devri</h3><div class="card"><h3>🪶 '+successionModeText()+'</h3><p>Aile uyumu '+q.familyHarmony+' • '+(q.prepared?'Vasiyet konuşuldu':'Henüz aile meclisi yapılmadı')+' • '+heirs.length+' yaşayan çocuk'+wish+'</p></div>';
}

function physicalHealthIssue(a){
 const serious=s.ailments.find(x=>AILMENTS[x.id]?.kind==='injury'&&(x.severity||1)>=3);
 if(serious&&(['activity','training','military','desert'].includes(a.kind)))return AILMENTS[serious.id].name+' iyileşmeden ağır eylem yapamazsın.';
 if(ensureHealthProfile().frailty>=75&&a.kind==='training'&&['wrestling','archery'].includes(a.id))return 'Yaş ve eski yaraların bu ağır talimi artık çok zorluyor.';
 return '';
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
function getFamilyGroup(group){if(group==='partner')return s.partner?[s.partner]:[];if(group==='guardianContacts')return ensureGuardianship().contacts;if(group==='exPartners')return s.exPartners||[];if(group==='extendedFamily')return extendedFamilyVisible();if(group==='inLaws')return ensureExtendedFamily().inLaws;if(group==='justiceContacts')return ensureJustice().contacts;if(group==='comrades')return s.military?.comrades||[];if(group==='careerContacts')return s.careerContacts||[];if(group==='educationContacts')return ensureEducation().contacts;if(group==='captivityContacts')return ensureDisplacement().captivity.contacts;if(group==='exileContacts')return ensureDisplacement().exile.contacts;return ['parents','siblings','relatives','friends','rivals','children'].includes(group)?(s[group]||[]):[];}
function accessIssue(a){
 if(!s?.alive)return 'Bu yaşam sona erdi.';
 if(s.pendingEventId||s.pendingDecision)return 'Önce karar kartını çöz.';
 if(s.monthsRemaining<=0)return 'Bu yıl için 12 eylem hakkını kullandın. 1 Yıl Geçir ile yeni yıla geç.';
 if(s.captive&&!['captivity','escape'].includes(a.kind))return 'Tutsakken bu eyleme erişemezsin.';
 if(s.military.active&&!['military','desert','wait','health'].includes(a.kind)&&!(a.kind==='npc'&&a.group==='comrades'))return 'Seferdeyken yalnız birlik ve yoldaşlarınla ilgili eylemler yapabilirsin.';
 const healthIssue=physicalHealthIssue(a);if(healthIssue)return healthIssue;
 let min=0;
 if(['activity','training'].includes(a.kind)){if(!ACTION_RULES[a.id])return 'Eylem bulunamadı.';min=ACTION_RULES[a.id].age;}
 else if(a.kind==='education'){const d=EDUCATION_TRACKS[a.id];if(!d)return 'Yetişme yolu bulunamadı.';min=d.age;if(s.captive)return 'Tutsakken düzenli eğitim sürdüremezsin.';if(s.military.active)return 'Aktif seferde düzenli eğitim sürdüremezsin.';}
 else if(a.kind==='educationContact'){const n=ensureEducation().contacts[a.index];if(!n?.alive)return 'Bu kişiyle görüşemezsin.';min=5;}
 else if(a.kind==='appearance'){min=5;if(a.id!=='groom')return 'Görünüş eylemi bulunamadı.';}
 else if(a.kind==='romance'){min=16;if(!s.partner?.alive)return 'Yaşayan eş adayı veya eş gerekiyor.';if(!['time','future','family','work','repair','reassure'].includes(a.id))return 'İlişki eylemi bulunamadı.';}
 else if(a.kind==='breakup'){min=16;if(!s.partner?.alive)return 'Sona erdirilecek ilişki yok.';}
 else if(a.kind==='reconcileEx'){min=16;if(s.partner?.alive)return 'Önce mevcut ilişkinin durumunu çöz.';if(!s.exPartners?.[a.index]?.alive)return 'Bu eski ilişkiyle görüşemezsin.';}
 else if(a.kind==='period'){const r=PERIOD_ACTIVITIES.find(x=>x.id===a.id)||SEASONAL_ACTIVITIES.find(x=>x.id===a.id);if(!r)return 'Faaliyet bulunamadı.';min=r.age;if(r.months&&!r.months.includes(currentMonth()))return 'Bu faaliyet bu mevsimde yapılır.';if(r.req&&!r.req())return 'Bu faaliyet için uygun şartlar oluşmadı.';if(a.id==='healer'&&s.wealth<2)return '2 servet gerekiyor.';}
 else if(a.kind==='role')return careerIssue(D.careers.find(x=>x.id===a.id));
 else if(a.kind==='asset'){
  const r=D.assets.find(x=>x.id===a.id);if(!r)return 'Varlık bulunamadı.';min=ASSET_AGES[a.id]||18;
  if(a.sell&&!s.assets.includes(a.id))return 'Bu varlık sende yok.';
  if(a.sell&&a.id==='yurt'&&ensureHousing().mode==='own_yurt')return 'Yaşadığın yurdu satmadan önce başka barınma düzenine geçmelisin.';
  if(!a.sell&&s.assets.includes(a.id))return 'Zaten sahipsin.';
  if(!a.sell&&s.wealth<assetBuyPrice(a.id))return `${assetBuyPrice(a.id)} servet gerekiyor.`;
  if(!a.sell&&a.id==='smithy'&&(s.skills.craft<40||(s.experience.craft||0)<12))return 'Zanaat 40 ve 12 ay zanaat tecrübesi gerekiyor.';
 }else if(a.kind==='maintenance'){min=18;if(!s.assets.includes(a.id))return 'Bu varlık sende yok.';if(s.wealth<maintenanceCost(a.id))return `${maintenanceCost(a.id)} servet bakım gideri gerekiyor.`;
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
 else if(a.kind==='crime'){min=18;if(!D.crimes.some(x=>x.id===a.id))return 'Eylem bulunamadı.';if(openJusticeCase())return 'Önce açık töre meselesini çözmelisin.';}
 else if(a.kind==='guardianship'){if(s.age>=18||!ensureGuardianship().active||!currentGuardian()?.alive)return 'Aktif bir koruyuculuk düzenin yok.';if(!['time','help','learn','remember','visitSibling','change'].includes(a.id))return 'Koruyuculuk eylemi bulunamadı.';if(a.id==='visitSibling'&&!s.siblings.some(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)))return 'Ayrı yaşayan kardeşin yok.';}
 else if(a.kind==='parenting'){min=18;const c=s.children[a.index];if(!c?.alive||c.age>=18)return 'Bu çocuk için aktif yetiştirme dönemi sona ermiş.';if(a.id==='guide'&&!PARENTING_PATHS[a.path])return 'Yetişme yolu bulunamadı.';if(!['care','teach','listen','discipline','guide','mediate'].includes(a.id))return 'Ebeveynlik eylemi bulunamadı.';}
 else if(a.kind==='extendedFamily'){min=5;if(a.id==='reunion'){if(familyReunionGuests().length<2)return 'Aynı bölgede buluşacak yeterli yakın yok.';}else{const n=extendedFamilyVisible()[a.index];if(!n?.alive)return 'Bu akrabayla etkileşemezsin.';if(a.id==='support'&&s.wealth<3)return '3 servet gerekiyor.';if(!['support','ask_help'].includes(a.id))return 'Geniş aile eylemi bulunamadı.';}}
 else if(a.kind==='housing'){min=a.id==='chores'?8:16;const issue=housingIssue(a.id);if(issue)return issue;}
 else if(a.kind==='justiceCase'){min=18;const rec=crimeCaseById(a.caseId);if(!rec)return 'Töre meselesi bulunamadı.';if(a.id==='pay'){const due=rec.restitutionDue||justiceRestitutionAmount(rec);if(s.wealth<due)return due+' servet gerekiyor.';}if(!['mediate','pay','hearing','reconcile'].includes(a.id))return 'Töre eylemi bulunamadı.';}
 else if(a.kind==='military'){min=18;if(!s.military.served)return 'Önce birliğe katılmalısın.';if(!['horse','bow','drill','watch'].includes(a.id))return 'Talim bulunamadı.';}
 else if(a.kind==='desert'){min=18;if(!s.military.active)return 'Aktif seferde değilsin.';}
 else if(a.kind==='escape'){min=12;if(!s.captive)return 'Tutsak değilsin.';}
 else if(a.kind==='captivity'){if(!s.captive)return 'Tutsak değilsin.';}
 else if(a.kind==='exile'){if(!s.exile)return 'Sürgünde değilsin.';}
 else if(a.kind==='migration'){const issue=migrationIssue(a.realm,a.place,a.mode);if(issue)return issue;min=16;}
 else if(a.kind==='settlement'){min=8;if(s.captive)return 'Tutsakken yerleşim faaliyeti yapamazsın.';}
 else if(a.kind==='work'){min=10;if(!s.role)return 'Önce bir görev üstlen.';}
 else if(a.kind==='retire'){min=50;if(!s.role)return 'Bırakılacak görev yok.';}
 else if(a.kind==='will'){min=18;if(!s.children.some(x=>x.alive))return 'Yaşayan çocuğun yok.';}
 else if(a.kind==='venture'){min=18;const asset={herd:'flock',forge:'smithy',caravan:'caravan_share'}[a.id];if(!asset||!s.assets.includes(asset))return 'Önce ilgili varlığı edinmelisin.';if(assetState(asset).condition<20)return 'Önce bu varlığın bakımını yapmalısın.';}
 else if(a.kind!=='wait')return 'Eylem bulunamadı.';
 return s.age<min?`${min} yaşında açılır.`:'';
}
function canSpendMonth(){if(!s?.alive)return false;if(s.pendingEventId||s.pendingDecision){notice('Önce karar kartını çöz.');return false;}if(s.monthsRemaining<=0){notice('Bu yıl için eylem hakkın kalmadı. 1 Yıl Geçir ile devam et.');return false;}return true;}
function performAction(a,work,reason){const issue=accessIssue(a);if(issue){notice(issue);return false;}$('gameNotice').textContent='';s.lastAction={...a,age:s.age,year:s.year+s.age,month:currentMonth()};work();s.wealth=Math.max(0,Math.round(s.wealth));return spendMonth(reason,a);}
function spendMonth(reason='',action={kind:'wait'}){
 if(!canSpendMonth())return false;const month=currentMonth();s.monthsRemaining--;if(reason)log(`<b>${month}. Ay:</b> ${reason}`);monthlyTick(month,action);if(s.alive)trackLifeVarietyAction(action);
 if(s.alive&&s.monthsRemaining===0)log('Bu yılın 12 eylem hakkını kullandın. Hazır olduğunda yeni yıla geçebilirsin.','major');render();save();return true;
}
function addExperience(path){if(path)s.experience[path]=(s.experience[path]||0)+1;}
function checkAchievements(){if(s.age>=18)unlock('adult');if(s.age>=65)unlock('old');if(s.wealth>=100)unlock('rich');if(Object.values(s.skills).some(x=>x>=60))unlock('trained');}
function canHaveChild(){if(!s.married||!s.partner?.alive||s.age<18||s.partner.age<18||s.captive||s.military.active||s.pregnancy)return false;return (s.gender==='female'?s.age:s.partner.age)<45&&s.health>=35&&s.partner.health>=35;}
function monthlyTick(month,action,allowEvent=true){
 tickEventCooldowns();
 for(const n of allNPCs())if(n.alive&&n.birthYear!=null){const before=n.age;n.age=Math.max(0,s.year+s.age-n.birthYear-(month<n.birthMonth?1:0));if(before!==n.age&&[8,12,18].includes(n.age))n.role=npcRole(n.age);}
 if(s.military.active){addExperience('military');s.military.dutyMonths--;if(s.military.dutyMonths<=0)campaignResult();}
 tickHealthMonth(month);tickDisplacementMonth(month,action);tickMobilityMonth();tickAppearanceMonth(action);tickRomanceMonth(action);tickJusticeMonth(action);tickHousingMonth(month,action);tickParentingMonth(action);tickGuardianshipMonth(action);
 if(s.role&&!s.captive&&!s.military.active){const r=D.careers.find(x=>x.name===s.role);if(r){addExperience(r.path);s.careerMonths[r.id]=(s.careerMonths[r.id]||0)+1;if(month%3===0){const stipend=Math.max(1,Math.round(((r.wealth?.[0]||1)+(r.wealth?.[1]||3))/5*careerDemandMultiplier(r.path)));apply({wealth:stipend});economyLedger('income',stipend,r.name+' dönem payı');}}}
 if(s.age>=18&&month%3===0)tickEconomyQuarter(month);
 if(s.pregnancy&&--s.pregnancy.remaining<=0){
  if(s.married&&s.partner?.alive&&s.age>=18&&s.partner.age>=18){const gender=pick(['male','female']);const c=normalizeNPC({name:pick(D.realms[s.realm][gender]),gender,age:0,type:'Çocuk',birthYear:s.year+s.age,birthMonth:month,alive:true,rel:80,realm:s.realm,place:s.place,tribe:s.tribe,parentIds:[s.id,s.partner.id]},'Çocuk');s.children.push(c);ensureChildProfile(c);unlock('parent');log(safeText(c.name)+' dünyaya geldi.','major');}s.pregnancy=null;
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
function healthAction(id){performAction({kind:'health',id},()=>treatHealth(id==='healer'),id==='healer'?'Otacıyla bakım ve iyileşmeye bir ay ayırdın.':'Dinlenmeye ve iyileşmeye bir ay ayırdın.');}
function activity(t){performAction({kind:'activity',id:t},()=>{if(t==='at'){skillGain('riding',3);apply({skill:2,happiness:2});}if(t==='ok'){skillGain('archery',3);skillGain('combat',1);apply({skill:2});}if(t==='av'){skillGain('archery',2);apply(Math.random()<.65?{wealth:rng(1,3),skill:2}:{health:-2});}if(t==='toy'){skillGain('speech',1);apply({happiness:4,prestige:2});}},s.age<18?'Büyüklerin gözetiminde faaliyetine zaman ayırdın.':'Faaliyetinle bir ay geçirdin.');}
function train(t){return EDUCATION_TRACKS[t]?studyEducation(t):false;}
function doPeriodActivity(id){
 if(id==='groom')return groomAppearance();
 if(id==='healer'||id==='rest')return healthAction(id);
 const a=PERIOD_ACTIVITIES.find(x=>x.id===id)||SEASONAL_ACTIVITIES.find(x=>x.id===id);if(!a)return;
 performAction({kind:'period',id},()=>{a.do();if(['market','caravanmarket','herdcare','summer_caravan','autumn_store'].includes(id))addExperience('trade');const note=periodNoveltyBonus(id);if(note)log(note);},a.name+' ile bir ay geçti.');
}
function takeRole(id){const r=D.careers.find(x=>x.id===id);if(!r)return;performAction({kind:'role',id},()=>{
 const p=careerProfile(id),fit=Math.min(.96,.48+(s.skill-r.skill)/100+s.prestige/300+p.reputation/500+p.mastery/600+educationFitBonusForCareer(r));
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
function buyAsset(id){performAction({kind:'asset',id},()=>{const price=assetBuyPrice(id);s.wealth-=price;s.assets.push(id);ensureEconomy();assetState(id).condition=88;economyLedger('purchase',-price,id+' alımı');if(id==='yurt'){const h=ensureHousing();h.ownCapacity=4+h.expansions*2;recordHousing('Kendi yurdunu kurmaya uygun bir yurt edindin.');}apply({happiness:3});},'Alım ve takasla bir ay geçti.');}
function sellAsset(id){performAction({kind:'asset',id,sell:true},()=>{const value=assetSaleValue(id);s.assets=s.assets.filter(x=>x!==id);s.wealth+=value;delete ensureEconomy().assetState[id];economyLedger('sale',value,id+' satışı');},'Varlığını takas ettin.');}
function manageVenture(id){performAction({kind:'venture',id},()=>{
 const e=ensureEconomy(),asset={herd:'flock',forge:'smithy',caravan:'caravan_share'}[id],st=assetState(asset),expert=id==='forge'?s.skills.craft:s.skills.trade;
 skillGain(id==='forge'?'craft':'trade',2);st.lastManagedYear=s.year+s.age;st.condition=clamp(st.condition+4);
 let gain=0,risk=id==='caravan'?.24:id==='herd'?.14:.12;risk=Math.max(.05,risk-expert/500);
 if(Math.random()<risk){gain=-rng(1,id==='caravan'?7:4);st.losses++;st.condition=clamp(st.condition-rng(3,8));}
 else{const demand=id==='caravan'?e.tradeDemand:id==='forge'?e.craftDemand:100-e.foodPressure/2;gain=Math.max(1,Math.round(rng(1,id==='caravan'?7:5)*(.55+demand/120)*(st.condition/100)));st.profits+=gain;}
 s.wealth=Math.max(0,s.wealth+gain);economyLedger('venture',gain,id+' yönetimi');log(gain>=0?'Bu ay üretim ve takastan '+gain+' servet kaldı.':'Bu ay işlerden '+Math.abs(gain)+' servet zarar ettin.',gain>=0?'good':'bad');
 },'Malına ve üretime bir ay ayırdın.');}
function interactNPC(group,index,id){
 performAction({kind:'npc',group,index,id},()=>{
  const n=getFamilyGroup(group)[index];if(!n)return;normalizeNPC(n,n.type);n.lastInteractionYear=s.year+s.age;const remote=(n.place&&n.place!==s.place)||(n.realm&&n.realm!==s.realm);
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
  if(remote){adjustNPC(n,{rel:-1,trust:-1},'Uzakta olduğunuz için görüşmek daha zor oldu.');apply({wealth:-1});log('Uzakta yaşayan '+safeText(n.name)+' ile görüşmek için yol yaptın.');}
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
function meetPartner(){performAction({kind:'meet'},()=>{const g=s.gender==='male'?'female':'male';s.partner=normalizeNPC({name:pick(D.realms[s.realm][g]),gender:g,age:s.age<18?s.age:Math.max(18,s.age+rng(-4,4)),alive:true,rel:rng(52,68),type:'Eş adayı',realm:s.realm,place:s.place,tribe:pick(D.realms[s.realm].tribes)});adjustNPC(s.partner,{trust:5,respect:4},'Ailelerin aracılığıyla ilk kez uzun uzun görüştünüz.');s.married=false;const r=ensureRomance();r.current=null;ensureRomance();ensurePartnerFamily(true);log(safeText(s.partner.name)+' ile ailelerin aracılığıyla tanıştın; onun ailesiyle de bağ kurma yolu açıldı.');},'Aileler arası görüşmelere bir eylem hakkı ayırdın.');}
function marry(){performAction({kind:'marry'},()=>{
 const n=s.partner;normalizeNPC(n,n.type);const b=normalizeBonds(n),rp=currentRomance(),familyMind=(n.goal==='family'?0.08:0),proud=n.traits.includes('gururlu')?(s.prestige>=n.prestige?0.06:-0.08):0;
 const chance=Math.max(.15,Math.min(.97,.26+n.rel/300+b.trust/350-b.grudge/240+familyMind+proud+(rp?.commitment||0)/350+(rp?.harmony||0)/500+(rp?.familyApproval||0)/650-(rp?.tension||0)/350+(rp?.compatibility||0)/800));
 if(Math.random()<chance){s.married=true;n.type='Eş';const rp=ensureRomance().current;if(rp){rp.stage='married';rp.commitment=clamp(rp.commitment+12);rp.harmony=clamp(rp.harmony+5);rp.tension=clamp(rp.tension-5);rememberRomance('Birlikte ocak kurdunuz.',8);}adjustNPC(n,{rel:8,trust:10,respect:5,grudge:-8},'Birlikte ocak kurmaya söz verdiniz.');unlock('family');apply({prestige:3});log(safeText(n.name)+' ile ocak kurdun.','good');}
 else{adjustNPC(n,{rel:-4,trust:-3,grudge:n.traits.includes('kinci')?5:2},'Ocak kurma görüşmesi sonuçsuz kaldı.');log('Bu kez ocak kurma konusunda uzlaşamadınız.');}
},'Ocak kurma görüşmelerine bir eylem hakkı ayırdın.');}
function militaryCall(){if(s.age<18||s.captive||s.exile||s.military.called||s.military.active||s.pendingEventId||s.pendingDecision)return;s.military.called=true;s.pendingDecision={id:'campaign_call',age:s.age,year:s.year+s.age,month:currentMonth()};activateLifeTab();renderEventBoard();save();}
function chooseDecision(i){if(!s?.alive||s.pendingDecision?.id!=='campaign_call'||![0,1].includes(i)||s.age<18)return;if(i===0&&(s.health<40||s.captive||s.exile)){notice('Özgürlük ve en az 40 sağlık gerekiyor.');return;}if(i===0){s.military.served=true;s.military.active=true;s.military.dutyMonths=rng(4,8);s.military.campaigns++;generateComrades();s.path='military';apply({prestige:4});unlock('military');log('Sefer birliğine katıldın.','major');}else{s.flags.military_declined=true;log('Bu çağrıda obada kaldın.');}s.pendingDecision=null;render();save();}
function militaryTrain(id){performAction({kind:'military',id},()=>{skillGain({horse:'riding',bow:'archery',drill:'combat',watch:'combat'}[id],3);apply({skill:1,prestige:1});},'Birlik talimine bir ay ayırdın.');}
function desertCampaign(){performAction({kind:'desert'},()=>{s.military.active=false;s.military.dutyMonths=0;apply({prestige:-18,happiness:-4});if(Math.random()<.35)enterExile('birliği izinsiz terk etme');log('Birliği izinsiz terk ettin.','bad');},'Ayrılmanın sonuçlarıyla bir ay geçti.');}
function campaignResult(){s.military.active=false;s.military.dutyMonths=0;const roll=Math.random();if(roll<.12){enterCaptivity('seferde esir düşme');resolveComradeCampaignOutcome('captured');log('Seferde tutsak düştün.','bad');}else if(roll<.32){s.military.wounds++;resolveComradeCampaignOutcome('wounded');apply({health:-rng(8,18),prestige:4});acquireAilment('deep_wound',{severity:2,duration:6,source:'battle'});if(Math.random()<.55)addScar('battle',1,'battle');}else{resolveComradeCampaignOutcome('success');apply({wealth:rng(4,12),prestige:rng(4,8)});s.flags.recent_campaign=true;log('Seferden ganimet ve tecrübeyle döndün.','good');}}
function captivityMonth(){captivityAction('endure');}
function attemptEscape(){performAction({kind:'escape'},()=>{const c=ensureDisplacement().captivity,chance=Math.max(.08,Math.min(.82,.08+s.skill/650+c.escapePrep/145+s.health/1200-c.guardPressure/430));if(Math.random()<chance){leaveCaptivity('hazırlanmış kaçış');}else{c.guardPressure=clamp(c.guardPressure+10);c.escapePrep=clamp(Math.floor(c.escapePrep*.45));apply({health:-rng(4,8),happiness:-5});if(Math.random()<.28)acquireAilment('injury',{source:'başarısız kaçış'});log('Kaçış girişimi başarısız oldu; gözetim sıkılaştı.','bad');}},'Kaçış girişimiyle bir ay geçti.');}
function commitCrime(id){
 const c=D.crimes.find(x=>x.id===id),profile=CRIME_PROFILES[id];if(!c||!profile)return;
 performAction({kind:'crime',id},()=>{
  const j=ensureJustice(),victim=crimeVictimFor(profile),witnesses=crimeWitnesses(profile,victim),skill=crimeSkillValue(c),trace=clamp(profile.baseTrace+rng(-10,14)+witnesses.length*10-Math.floor(skill/8));
  const rec={id:'case_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),crimeId:id,name:c.name,year:s.year+s.age,age:s.age,month:currentMonth(),victimId:victim.id,witnessIds:witnesses.map(n=>n.id),severity:profile.severity,evidence:trace,status:'hidden',gain:0,result:'',restitutionDue:0,mediationBonus:0};
  j.cases.unshift(rec);j.totalCrimes++;j.notoriety=clamp(j.notoriety+Math.max(3,Math.round(profile.severity/12)));j.suspicion=clamp(j.suspicion+Math.max(3,Math.round(trace/8)));
  markJusticeHostility(rec,Math.round(profile.severity*.65));
  const caughtChance=Math.max(.08,Math.min(.92,c.risk*.62+j.suspicion/360+trace/500+witnesses.length*.07-skill/650));
  if(Math.random()<caughtChance){rec.status='summoned';j.caught++;rec.result='Töre önüne çağrıldın';apply({prestige:Math.min(-1,Math.round(c.prestige/2))});log('Eylem gizli kalmadı; '+safeText(victim.name)+' ve çevresi meseleyi töre önüne taşıdı.','bad');}
  else{const gain=rng(...c.gain);rec.gain=gain;s.wealth+=gain;rec.result=gain+' servet kazandın; mesele hemen açılmadı';log(gain+' servet kazandın; fakat iz ve tanık ihtimali kayıtta kaldı.','bad');
   if(trace>=34||witnesses.length){const target=witnesses[0]||victim;scheduleDelayedEvent({id:witnesses.length?'crime_witness_returns':'crime_old_accusation',years:[1,4],payload:{caseId:rec.id,detail:'Yıllar önce kapanmış görünen '+c.name+' meselesi yeniden konuşulmaya başladı.'}},{targetId:target.id,sourceEventId:'crime:'+id});}
  }
  s.crimeRecord.unshift({id:rec.id,name:c.name,result:rec.result,age:s.age,month:rec.month,victimId:victim.id,witnesses:witnesses.length,evidence:trace,status:rec.status});s.crimeRecord=s.crimeRecord.slice(0,80);
 },'Töre dışı girişimin sonuçlarıyla bir ay geçti.');
}
function familyTick(){
 const cfg=D.realms[s.realm],year=s.year+s.age,seen=new Set(),closeIds=new Set([...s.parents,...s.siblings,...s.children,s.partner].filter(Boolean).map(n=>n.id));
 for(const n of allNPCs()){
  normalizeNPC(n,n.type);if(!n.alive||seen.has(n.id))continue;seen.add(n.id);
  const oldAge=n.age;n.age=n.birthYear!=null?Math.max(0,year-n.birthYear-(n.birthMonth>1?1:0)):n.age+1;parentingMilestone(n,oldAge);
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
  if(n!==s.partner&&familyBranchCanGrow()&&n.age>=18&&!n.partner&&Math.random()<(n.goal==='family'?.11:.055)){
   const pg=n.gender==='male'?'female':'male',pa=Math.max(18,n.age+rng(-4,4));n.partner=normalizeNPC({id:npcId(),gender:pg,name:pick(cfg[pg]),age:pa,birthYear:year-pa,alive:true,health:rng(60,95),type:'Eş',rel:rng(55,75)},'Eş');
   rememberNPC(n,'family',n.partner.name+' ile ocak kurdu.',4);if(closeIds.has(n.id))log(safeText(n.name)+' '+safeText(n.partner.name)+' ile ocak kurdu.','good');
  }
  const fertile=n.partner?.alive&&n.age>=18&&n.partner.age>=18&&(n.gender==='female'?n.age:n.partner.age)<45;
  if(n!==s.partner&&familyBranchCanGrow()&&fertile&&Math.random()<(n.goal==='family'?.075:.035)){
   const g=pick(['male','female']),child=normalizeNPC({name:pick(cfg[g]),gender:g,age:0,type:'Çocuk',alive:true,birthYear:year,birthMonth:1,parentIds:[n.id,n.partner.id],rel:rng(65,85)},'Çocuk');
   n.descendants.push(child);n.children++;rememberNPC(n,'family',child.name+' dünyaya geldi.',5);if(closeIds.has(n.id))log(safeText(n.name)+' ailesine '+safeText(child.name)+' katıldı.','major');
  }
  if(n.age>45)n.health=clamp(n.health-rng(0,2));
  if(Math.random()<npcDeathRisk(n)){n.alive=false;rememberNPC(n,'death','Yaşamı sona erdi.',10);maybeExtendedInheritance(n);log(safeText(n.name)+' yaşamını yitirdi.','bad');if(n===s.partner){s.married=false;s.pregnancy=null;}}
 }
 tickNPCSocialNetwork(year);parentingYearTick();guardianshipYearTick();
 stateYearTick();
 if(canHaveChild()&&Math.random()<.18){s.pregnancy={remaining:9};log('Ocağınızda bir çocuk bekleniyor.','major');}
}
function ageUp(){if(!s?.alive)return;if(s.pendingEventId||s.pendingDecision){notice('Önce son karar kartını çöz.');return;}if(s.monthsRemaining>0){notice('Yeni yıla geçmeden önce kalan haklar atlanmalı.');return;}s.age++;s.monthsRemaining=12;s.lastAction=null;if(s.age>40)apply({health:-rng(0,2)});familyTick();housingYearTick();healthAgeTick();elderYearTick();ensureLifeVariety();checkAchievements();mortality();if(s.alive){log(animalYearName(s.year+s.age)+' Yılı başladı; bu yıl 12 eylem hakkın var.','major');if(s.age>=18&&!s.captive&&!s.exile&&!s.military.called)militaryCall();else if(s.age>=18&&!s.captive&&!s.exile&&!s.military.active&&s.military.served&&Math.random()<.08){s.military.called=false;militaryCall();}}render();save();}
function die(){if(!s?.alive)return;const q=ensureSuccession(),cause=deathCauseLabel(),heirs=livingHeirs();s.alive=false;s.pendingEventId=null;s.pendingDecision=null;s.pendingEventContext=null;clearTransient();
 s.deathRecord={name:s.name,age:s.age,year:s.year+s.age,role:s.role,prestige:s.prestige,wealth:s.wealth,cause,will:s.will,prepared:q.prepared,chosenHeirId:q.chosenHeirId,familyHarmony:q.familyHarmony,lastWish:q.lastWish,assets:[...s.assets],heirs:heirs.map(n=>({id:n.id,name:n.name,age:n.age}))};
 log(`${s.age} yaşında, ${s.year+s.age} yılında yaşamın sona erdi. Neden: ${cause}.`,'bad');s.legacy.past.push({...s.deathRecord});render();save();showHeirModal();}
function setWill(id){if(id!=='equal'&&!s.children.some(x=>x.id===id&&x.alive))return;performAction({kind:'will'},()=>{const q=ensureSuccession();s.will=id;q.prepared=true;q.chosenHeirId=id==='equal'?null:id;q.lastCouncilYear=s.year+s.age;q.familyHarmony=clamp(q.familyHarmony+(id==='equal'?2:-2));q.history.unshift({year:s.year+s.age,age:s.age,mode:id==='equal'?'equal':'chosen',targetId:q.chosenHeirId,note:'Mal paylaşımı doğrudan konuşuldu.',harmony:q.familyHarmony});q.history=q.history.slice(0,24);},'Mal paylaşımı isteğini yakınlarınla konuştun.');}
function continueAsHeir(i){
 if(!s||s.alive)return;const heirs=s.children.filter(x=>x.alive),c=heirs[i];if(!c)return;const old=s,oldSuccession=JSON.parse(JSON.stringify(ensureSuccession())),equal=old.will==='equal'||!heirs.some(x=>x.id===old.will),share=inheritanceShareFor(c,heirs),deathRecord=old.deathRecord||null;clearTransient();
 s=newCharacter({name:c.name,gender:c.gender,realm:old.realm,year:old.year+old.age-c.age,place:c.place||old.place,tribe:c.tribe||old.tribe,age:c.age,monthsRemaining:old.monthsRemaining,wealth:share.wealth,health:c.health,happiness:65,skill:Math.min(60,c.age*2),skills:c.skills||{},prestige:clamp(old.prestige*.35),achievements:[...old.achievements],legacy:{generation:old.legacy.generation+1,familyName:old.legacy.familyName,past:old.legacy.past}});
 s.id=c.id;
 s.parents=[normalizeNPC({id:old.id,name:old.name,age:old.age,gender:old.gender,alive:false,rel:c.rel,type:old.gender==='male'?'Ata':'Ana',role:old.role})];if(old.partner)s.parents.push({...old.partner,type:old.partner.gender==='female'?'Ana':'Ata'});
 s.siblings=old.children.filter(n=>n.id!==c.id).map(n=>({...n,type:n.gender==='male'?'Erkek kardeş':'Kız kardeş'}));s.children=(c.descendants||[]).map(n=>({...n,type:'Çocuk'}));
 const oldPartnerKin=(old.extendedFamily?.inLaws||[]).filter(n=>n&&old.partner?.id&&n.statusFlags?.partnerFamilyFor===old.partner.id).map(n=>{const root=n.statusFlags?.inLawRoot;let type=n.type;if(root)type=n.gender==='male'?'Dede':'Nine';else type=n.gender==='male'?(old.partner?.gender==='male'?'Amca':'Dayı'):(old.partner?.gender==='male'?'Hala':'Teyze');return {...n,type,statusFlags:{...(n.statusFlags||{}),inLaw:false,legacyInLaw:false,partnerFamilyFor:null,inLawRoot:false,legacySource:old.partner?.name||old.name}};});
 const inheritedKin=[...old.parents.map(n=>({...n,type:n.gender==='male'?'Dede':'Nine'})),...old.siblings.map(n=>({...n,type:n.gender==='male'?'Amca / Dayı':'Hala / Teyze'})),...oldPartnerKin,...(old.relatives||[]).filter(n=>!old.parents.some(p=>p.id===n.id))];
 s.relatives=inheritedKin.filter((n,i,a)=>n&&a.findIndex(x=>x.id===n.id)===i).map(n=>normalizeNPC(n,n.type));
 if(c.partner?.alive){s.partner=normalizeNPC({...c.partner,rel:65,type:'Eş'});s.married=c.age>=18&&s.partner.age>=18;}
 s.extendedFamily={inLaws:[],history:[...(old.extendedFamily?.history||[])].slice(0,30),reunions:old.extendedFamily?.reunions||0,lastReunionYear:old.extendedFamily?.lastReunionYear??null,supportGiven:0,supportReceived:0,branchLimit:old.extendedFamily?.branchLimit||90,partnerFamilyFor:null};
 const friendPool=[...(old.friends||[]),...(old.military?.comrades||[]).filter(n=>n.alive&&(n.rel||0)>=70)],seenFriend=new Set();
 s.friends=friendPool.filter(n=>n.alive&&!seenFriend.has(n.id)&&seenFriend.add(n.id)).map(n=>{const x=normalizeNPC({...n,type:'Aile dostu',rel:clamp(Math.round((n.rel||60)*.65))},'Aile dostu');x.statusFlags.familyFriend=true;x.statusFlags.legacySource=old.name;normalizeBonds(x);x.bonds.trust=clamp(Math.round(x.bonds.trust*.75));rememberNPC(x,'legacy',old.name+' ile olan eski dostluğunu sürdürüyor.',5);return x;});
 const seenEnemy=new Set();s.rivals=(old.rivals||[]).filter(n=>n.alive&&!seenEnemy.has(n.id)&&seenEnemy.add(n.id)).map(n=>{const x=normalizeNPC({...n,type:'Aile hasmı',rel:Math.min(40,n.rel??30)},'Aile hasmı');x.statusFlags.familyEnemy=true;x.statusFlags.legacySource=old.name;normalizeBonds(x);x.bonds.grudge=clamp(Math.max(25,Math.round(x.bonds.grudge*.8)));rememberNPC(x,'legacy',old.name+' ile yaşanan eski husumeti hatırlıyor.',6);return x;});
 s.socialLinks=(old.socialLinks||[]).map(x=>({...x,tags:[...(x.tags||[]),'legacy']}));
 s.assets=share.assets;s=migrateState(s);s.lastInheritance={from:old.name,year:old.year+old.age,equal,wealth:share.wealth,assets:[...share.assets],prepared:oldSuccession.prepared,familyHarmony:oldSuccession.familyHarmony,lastWish:oldSuccession.lastWish,deathRecord};
 const favored=!equal&&old.will===c.id;for(const sib of s.siblings.filter(n=>n.alive)){if(favored)adjustNPC(sib,{rel:-8,trust:-7,grudge:12},old.name+' ardından mirasın tek elde kalmasını kolay unutmadı.');else if(oldSuccession.prepared&&oldSuccession.familyHarmony>=60)adjustNPC(sib,{rel:4,trust:5,grudge:-5},old.name+' hayattayken paylaşımı açıkça konuşmuştu.');}
 const inheritanceSibling=s.siblings.find(n=>n.alive);if(inheritanceSibling)scheduleDelayedEvent({id:'inheritance_aftershock',years:[1,2],payload:{detail:(favored?'Mirasın büyük kısmı sana kaldı. ':'Miras paylaştırıldı. ')+(oldSuccession.lastWish?'Son dileği: '+oldSuccession.lastWish:'Aile şimdi yeni düzene alışıyor.'),favored,parentName:old.name}},{targetId:inheritanceSibling.id,sourceEventId:'heir_succession'});
 const veteran=(old.military?.comrades||[]).filter(n=>n.alive&&(n.rel||0)>=70).sort((a,b)=>((b.bonds?.trust||0)+(b.rel||0))-((a.bonds?.trust||0)+(a.rel||0)))[0];
 const inheritedVeteran=veteran?s.friends.find(n=>n.id===veteran.id):null;
 if(inheritedVeteran)scheduleDelayedEvent({id:'legacy_comrade_visit',years:[1,4],payload:{detail:old.name+' ile yıllar önce omuz omuza savaşmıştı.'}},{targetId:inheritedVeteran.id,sourceEventId:'heir_succession'});
 unlock('heir');log(safeText(old.name)+' ardından soyun '+safeText(s.name)+' ile devam ediyor.','major');$('heirModal').classList.remove('show');activateLifeTab();render();save();
}
function eventRequirementOK(ev){
 const check=r=>{if(!r)return true;if(Array.isArray(r))return r.every(check);if(r.startsWith('flag:'))return !!s.flags[r.slice(5)];if(r.startsWith('notflag:'))return !s.flags[r.slice(8)];if(r.startsWith('asset:'))return s.assets.includes(r.slice(6));if(r.startsWith('career:'))return !careerIssue(D.careers.find(x=>x.id===r.slice(7)));if(r.startsWith('role:'))return D.careers.find(x=>x.id===r.slice(5))?.name===s.role;let cm=r.match(/^careermonths:([^:]+):(\d+)$/);if(cm)return careerProfile(cm[1]).months>=+cm[2];let cr=r.match(/^careerrep:([^:]+):(\d+)$/);if(cr)return careerProfile(cr[1]).reputation>=+cr[2];let st=r.match(/^state(influence|trust|support|rival):(\d+)$/);if(st){const q=ensureStateCourt(),k={influence:'influence',trust:'councilTrust',support:'tribeSupport',rival:'rivalPressure'}[st[1]];return q[k]>=+st[2];}const num=r.match(/^(skill|wealth|prestige)(\d+)$/);if(num)return s[num[1]]>=+num[2];
 const map={single:()=>!s.partner?.alive&&!s.married,partnered:()=>!!s.partner?.alive,underGuardianship:()=>s.age<18&&ensureGuardianship().active&&!!currentGuardian()?.alive,separatedMinorSibling:()=>s.age<18&&ensureGuardianship().active&&s.siblings.some(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)),multipleMinorChildren:()=>s.children.filter(c=>c.alive&&c.age<18).length>=2,hasInLaw:()=>ensureExtendedFamily().inLaws.some(n=>n.alive&&!n.statusFlags?.legacyInLaw),hasCousin:()=>extendedFamilyVisible().some(n=>n.alive&&kinRole(n)==='Kuzen'),familyHomeAdult:()=>!s.captive&&!s.exile&&ensureHousing().mode==='family_yurt'&&s.age>=18,housingCrowded:()=>!s.captive&&!s.exile&&housingCrowding()>0,temporaryShelter:()=>!s.captive&&!s.exile&&ensureHousing().mode==='temporary_shelter',hasJusticeFeud:()=>ensureJustice().feuds.some(x=>x.status==='active'&&x.heat>=25),married:()=>s.age>=18&&s.married&&s.partner?.alive&&s.partner.age>=18,romanceTense:()=>!!currentRomance()&&currentRomance().tension>=45,romanceJealous:()=>!!currentRomance()&&currentRomance().jealousy>=35,romanceFamilyLow:()=>!!currentRomance()&&currentRomance().familyApproval<45,romanceStable:()=>!!currentRomance()&&currentRomance().harmony>=65&&currentRomance().tension<30,hasChild:()=>s.children.some(x=>x.alive),hasAdultChild:()=>s.children.some(x=>x.alive&&x.age>=18),hasLivingSibling:()=>s.siblings.some(x=>x.alive),successionPrepared:()=>ensureSuccession().prepared,successionUnprepared:()=>!ensureSuccession().prepared,trainableChild:()=>s.children.some(x=>x.alive&&x.age>=7&&x.age<18),hasGrandchild:()=>s.children.some(x=>x.alive&&x.children>0),hasFriend:()=>s.friends.some(x=>x.alive),hasRival:()=>s.rivals.some(x=>x.alive),hasFamilyFriend:()=>s.friends.some(x=>x.alive&&x.statusFlags?.familyFriend),hasFamilyEnemy:()=>s.rivals.some(x=>x.alive&&x.statusFlags?.familyEnemy),hasRivalKinLink:()=>rivalKinPairs().length>0,hasCloseKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].some(x=>x.alive),hasTrustedPerson:()=>allNPCs().some(x=>x.alive&&(x.bonds?.trust||0)>=55),hasComrade:()=>s.military.comrades.some(x=>x.alive),hasTrustedComrade:()=>s.military.comrades.some(x=>x.alive&&((x.bonds?.trust||0)>=60||(x.rel||0)>=72)),hasAilment:()=>s.ailments.length>0,hasScar:()=>ensureHealthProfile().scars.length>0,healthLow:()=>s.health<55,military:()=>s.age>=18&&s.military.served,activeCampaign:()=>s.age>=18&&s.military.active,recentCampaign:()=>!!s.flags.recent_campaign,captive:()=>s.captive,exile:()=>s.exile};return map[r]?!!map[r]():false;};return check(ev.req);
}
function eventChoiceIssue(ch){const x=ch[1]||{};if(x.wealth<0&&s.wealth<-x.wealth)return `${-x.wealth} servet gerekiyor`;if(x.healerCare&&s.wealth<2)return 'Otacı bakımı için 2 servet gerekiyor';if(x.setRole)return careerIssue(D.careers.find(r=>r.name===x.setRole));return '';}
function eventTargetCandidates(target){
 const pools={
  guardian:()=>{const n=currentGuardian();return n?.alive?[n]:[]},separatedSibling:()=>s.siblings.filter(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)),child:()=>s.children.filter(n=>n.alive),minorChild:()=>s.children.filter(n=>n.alive&&n.age<18),adultChild:()=>s.children.filter(n=>n.alive&&n.age>=18),trainingChild:()=>s.children.filter(n=>n.alive&&n.age>=7&&n.age<18),friend:()=>s.friends.filter(n=>n.alive),
  rival:()=>s.rivals.filter(n=>n.alive),partner:()=>s.partner?.alive?[s.partner]:[],comrade:()=>s.military.comrades.filter(n=>n.alive),trustedComrade:()=>s.military.comrades.filter(n=>n.alive&&((n.bonds?.trust||0)>=60||(n.rel||0)>=72)),
  smithMaster:()=>{const n=careerContact('smith');return n?[n]:[]},scribeMaster:()=>{const n=careerContact('scribe');return n?[n]:[]},caravanMaster:()=>{const n=careerContact('caravan');return n?[n]:[]},bardMaster:()=>{const n=careerContact('bard');return n?[n]:[]},merchantContact:()=>{const n=careerContact('merchant');return n?[n]:[]},
  statePatron:()=>{const n=stateContact('patron');return n?[n]:[]},stateRival:()=>{const n=stateContact('rival');return n?[n]:[]},stateElder:()=>{const n=stateContact('elder');return n?[n]:[]},healthHealer:()=>{const n=healthHealer(true);return n?[n]:[]},familyFriend:()=>s.friends.filter(n=>n.alive&&n.statusFlags?.familyFriend),familyEnemy:()=>s.rivals.filter(n=>n.alive&&n.statusFlags?.familyEnemy),
  educationMentor:()=>ensureEducation().contacts.filter(n=>n.alive&&n.statusFlags?.educationMentor),educationPeer:()=>ensureEducation().contacts.filter(n=>n.alive&&n.statusFlags?.educationPeer),justiceVictim:()=>ensureJustice().contacts.filter(n=>n.alive&&n.statusFlags?.crimeVictim),justiceWitness:()=>ensureJustice().contacts.filter(n=>n.alive&&n.statusFlags?.crimeWitness),justiceKin:()=>ensureJustice().contacts.filter(n=>n.alive&&n.statusFlags?.familyEnemy),
  inLaw:()=>ensureExtendedFamily().inLaws.filter(n=>n.alive&&!n.statusFlags?.legacyInLaw),cousin:()=>extendedFamilyVisible().filter(n=>n.alive&&kinRole(n)==='Kuzen'),parent:()=>s.parents.filter(n=>n.alive),sibling:()=>s.siblings.filter(n=>n.alive),relative:()=> extendedFamilyVisible().filter(n=>n.alive),
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
 if(x.succession)applySuccessionEffect(x.succession);if(x.economy)applyEconomyEffect(x.economy);if(x.displacement)applyDisplacementEffect(x.displacement);if(x.romance)adjustRomance(x.romance,x.romanceMemory||'İlişkinizde yeni bir iz kaldı.');if(x.housing)applyHousingEffect(x.housing);
 if(x.ailment){const a=typeof x.ailment==='string'?{id:x.ailment}:x.ailment;acquireAilment(a.id,a);}
 if(x.scar){const sc=typeof x.scar==='string'?{kind:x.scar}:x.scar;addScar(sc.kind||'injury',sc.severity||1,sc.source||'event');}
 if(x.healerCare)treatHealth(true);
 if(x.asset&&!s.assets.includes(x.asset))s.assets.push(x.asset);if(x.wound){s.military.wounds+=x.wound;if(!x.ailment)acquireAilment('injury',{source:'yara'});}if(x.clearExile)leaveExile('başka obanın kabulü ve dönüş yolu');
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
 if(['crime_old_accusation','crime_witness_returns','crime_feud_returns'].includes(ev.id))applyJusticeEventOutcome(ev.id,i,context,target);
 if(target?.alive&&['parenting_child_lie','parenting_child_choice','parenting_sibling_conflict','child_training_choice'].includes(ev.id))applyParentingEvent(ev.id,i,target);
 if(['guardian_household_strain','guardian_family_memory','guardian_sibling_distance'].includes(ev.id))applyGuardianshipEvent(ev.id,i,target);
 if(target?.alive){if(['education_mentor_trial','education_peer_competition','education_peer_help'].includes(ev.id)){const d=EDUCATION_TRACKS[target.statusFlags?.educationTrack];if(d)skillGain(d.skill,ev.id==='education_mentor_trial'?(i===0?3:1):ev.id==='education_peer_competition'?(i===0?2:3):(i===0?2:1));}
  if(ev.id==='child_ill')target.health=clamp(target.health+(i===0?4:7));if(ev.id==='friend_quarrel')target.rel=clamp(target.rel+(i===0?6:-6));if(ev.id==='child_training_choice'){target.skills=target.skills||{};const k=i===0?'archery':i===1?'craft':'speech';target.skills[k]=clamp((target.skills[k]||0)+3);}if(ev.id==='child_path_consequence')applyChildPathConsequence(target,context,i);}
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
 if(x.succession){const m=x.succession.mode==='equal'?'Eşit paylaşım':x.succession.mode==='target'?'Ana varis seçimi':'Aile vasiyeti';items.push({cls:x.succession.harmony<0?'neg':'neutral',label:'🪶 '+m});}
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
 if(x.ailment){const a=typeof x.ailment==='string'?{id:x.ailment}:x.ailment,d=AILMENTS[a.id];if(d)items.push({cls:"neg",label:`🌡 ${d.name} • ${a.severity||d.severity||1}. derece`});}
 if(x.scar)items.push({cls:"neg",label:"🩹 Kalıcı yara izi bırakabilir"});
 if(x.healerCare)items.push({cls:"pos",label:"🌿 Otacı bakımı"});
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
function renderActivities(){
 ensureLifeVariety();const cats=[...new Set(PERIOD_ACTIVITIES.map(x=>x.cat))];
 $('tab-faaliyet').innerHTML=mobilitySummaryHtml()+varietySummaryHtml()+seasonalActivitiesHtml()+cats.map(cat=>`<h3 class="sectionTitle">${cat}</h3><div class="grid2">${PERIOD_ACTIVITIES.filter(x=>x.cat===cat).map(a=>actionButton(a.icon+' '+a.name,{kind:'period',id:a.id},`doPeriodActivity('${a.id}')`,a.desc+' • '+a.age+' yaş • '+activityStatLabel(a.id))).join('')}</div>`).join('');
}
function renderAssets(){
 ensureEconomy();ensureHousing();
 $('tab-varlik').innerHTML=housingSummaryHtml()+economySummaryHtml()+`<h3 class="sectionTitle">Pazar</h3><div class="grid2">${D.assets.filter(a=>!s.assets.includes(a.id)).map(a=>actionButton(a.icon+' '+a.name,{kind:'asset',id:a.id},`buyAsset('${a.id}')`,assetBuyPrice(a.id)+' servet • '+ASSET_AGES[a.id]+' yaş • fiyat pazara göre değişir')).join('')}</div><h3>Sahip oldukların</h3><div class="grid2">${s.assets.map(id=>{const a=D.assets.find(x=>x.id===id);if(!a)return '';const st=assetState(id);return '<div class="card"><h3>'+a.icon+' '+a.name+'</h3><p>Durum '+st.condition+'/100 • Satış '+assetSaleValue(id)+' servet</p><div class="grid2">'+actionButton('Bakım yap',{kind:'maintenance',id},`maintainAsset('${id}')`,maintenanceCost(id)+' servet')+actionButton('Takas et',{kind:'asset',id,sell:true},`sellAsset('${id}')`,'Pazar değeri '+assetSaleValue(id))+'</div></div>';}).join('')}</div><h3>Üretim</h3><div class="grid2">${[['herd','Sürüyü yönet','flock'],['forge','Ocakta üret','smithy'],['caravan','Kervan payını yönet','caravan_share']].map(([id,n,a])=>actionButton(n,{kind:'venture',id},`manageVenture('${id}')`,s.assets.includes(a)?'Durum '+assetState(a).condition+'/100 • sonuç garanti değil':'İlgili varlık gerekli')).join('')}</div>`;
}
function familyCard(n,group,index){
 normalizeNPC(n,n.type);
 const options=[['spend','Vakit geçir'],...(s.age>=8?[['confide','Dertleş']]:[]),...(s.age>=10?[['help','Yardım et'],['work','Birlikte çalış'],['gift','Armağan']]:[]),['advice','Öğüt al'],...(group==='rivals'?[['reconcile','Uzlaş']]:[])];
 const actions=n.alive&&s.age>=5?options.map(([id,label])=>{const issue=accessIssue({kind:'npc',group,index,id});return `<button class="mini" ${issue?'disabled':''} title="${safeText(issue)}" onclick="interactNPC('${group}',${index},'${id}')">${label}</button>`;}).join(''):'';
 const traits=npcTraitNames(n).map(x=>`<span class="trait">${safeText(x)}</span>`).join('');
 const b=normalizeBonds(n),memory=recentNPCMemory(n),ties=socialConnectionsFor(n,2),tieLine=ties.length?'Bağları: '+ties.map(x=>x.other.name+' ('+socialLinkLabel(x.link)+')').join(' • '):'',shownType=typeof kinRole==='function'?kinRole(n):(n.displayKinRole||n.type);
 return `<div class="card familycard"><div><h3>${n.alive?'':'† '}${safeText(n.name)}</h3><p>${safeText(shownType)} • ${n.age} yaş • ${safeText(n.role)}<br>İlişki ${n.rel}${n.partner?' • Eş: '+safeText(n.partner.name):''}${n.children?' • Çocuk: '+n.children:''}</p>
 <div class="traitrow">${traits}</div><div class="npcgoal">Amaç: ${safeText(npcGoalName(n))}</div>
 <div class="rbar"><i style="width:${n.rel}%"></i></div><div class="bondrow"><span class="bond good">Güven ${b.trust}</span><span class="bond">Saygı ${b.respect}</span>${b.grudge?'<span class="bond bad">Kin '+b.grudge+'</span>':''}${b.fear>15?'<span class="bond bad">Çekince '+b.fear+'</span>':''}</div>
 ${memory?`<div class="memoryline">Hatırladığı: ${safeText(memory)}</div>`:''}${tieLine?`<div class="networkline">${safeText(tieLine)}</div>`:''}</div><div class="actions">${actions}</div></div>`;
}
function renderSystems(){
 $('lifeCare').innerHTML=`<h3 class="sectionTitle">${lifeStage(s.age)}</h3>${healthSummaryHtml()}${displacementSummaryHtml()}${guardianshipSummaryHtml()}<div class="grid2">${s.age<5?actionButton('Aile bakımında bir ay',{kind:'guardian'},'guardianCare()'):actionButton('Dinlen',{kind:'health',id:'rest'},"healthAction('rest')",'Aktif rahatsızlıkların iyileşmesini hızlandırır.')+actionButton(s.age<12?'Ailenle otacıya git':'Otacıya Git',{kind:'health',id:'healer'},"healthAction('healer')",'2 servet • rahatsızlık şiddetini ve iyileşme süresini azaltır.')}</div>${s.pregnancy?'<p class="note">Doğum bekleniyor • yaklaşık '+s.pregnancy.remaining+' ay.</p>':''}`;
 $('tab-yetisme').insertAdjacentHTML('beforeend',educationSummaryHtml()+'<h3 class="sectionTitle">Yetişme tecrübesi</h3><p class="note">'+Object.entries(s.experience).map(([k,v])=>pathName(k)+': '+v+' ay').join(' • ')+'</p>');
 $('tab-faaliyet').insertAdjacentHTML('afterbegin',appearanceSummaryHtml());
 $('tab-aile').insertAdjacentHTML('afterbegin',romanceSummaryHtml()+parentingSummaryHtml()+extendedFamilySummaryHtml());
 $('tab-soy').insertAdjacentHTML('beforeend',successionSummaryHtml());
 $('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Ün ve başarımlar</h3><div class="grid2">${D.achievements.map(a=>`<div class="card ${s.achievements.includes(a.id)?'':'locked'}"><h3>${s.achievements.includes(a.id)?'🏆':'🔒'} ${a.name}</h3><p>${a.desc}</p></div>`).join('')}</div>`);
 if(s.age>=18&&s.children.some(x=>x.alive))$('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Mal paylaşımı</h3><p class="note">Şu an: ${s.will==='equal'?'Yaşayan çocuklara eşit':safeText(s.children.find(n=>n.id===s.will)?.name||'Eşit paylaşım')}. Bu paylaşım bir oyun kuralıdır.</p><div class="grid2">${actionButton('Eşit paylaş',{kind:'will'},"setWill('equal')")}${s.children.filter(x=>x.alive).map(n=>actionButton(safeText(n.name),{kind:'will'},`setWill('${n.id}')`)).join('')}</div>`);
}
function migrateState(x){
 if(!x||!D.realms[x.realm]||!Number.isFinite(x.age)||!Number.isFinite(x.year))throw new Error('Geçersiz kayıt');const sourceVersion=x.version||0;x.version=SAVE_VERSION;x.age=Math.max(0,Math.floor(x.age));x.monthsRemaining=Math.max(0,Math.min(12,Math.floor(x.monthsRemaining??12)));x.alive=x.alive!==false;
 for(const k of ['health','happiness','skill','prestige'])x[k]=clamp(Number.isFinite(x[k])?x[k]:50);x.wealth=Math.max(0,Math.round(Number.isFinite(x.wealth)?x.wealth:0));
 for(const k of ['parents','siblings','relatives','friends','rivals','children','careerContacts','socialLinks','delayedEvents','assets','achievements','eventHistory','eventArchive','crimeRecord','timeline','ailments','exPartners'])if(!Array.isArray(x[k]))x[k]=[];
 for(const k of ['experience','careerMonths','careerProfiles','eventCooldowns','flags','skills'])x[k]=x[k]||{};x.storyArcs=x.storyArcs&&typeof x.storyArcs==='object'&&!Array.isArray(x.storyArcs)?x.storyArcs:{};x.will=x.will||'equal';x.pregnancy=x.pregnancy||null;x.deathRecord=x.deathRecord||null;x.legacy=x.legacy||{generation:1,familyName:x.tribe,past:[]};x.legacy.past=x.legacy.past||[];s=x;ensureSkills();ensureMilitary();ensureCareerSystems();ensureStateCourt();ensureHealthProfile();ensureSuccession();ensureEconomy();ensureDisplacement();ensureLifeVariety();ensureMobility();ensureEducation();ensureAppearance();ensureRomance();ensureJustice();ensureHousing();ensureExtendedFamily();ensureParenting();ensureGuardianship();if(s.partner?.alive)ensurePartnerFamily();refreshKinRoles();if(s.age<18)ensureMinorGuardianship('kayıt göçü');
 if(sourceVersion<5&&x.military?.wounds>0&&!x.healthProfile.scars.length){
  const count=Math.min(3,x.military.wounds);for(let i=0;i<count;i++)x.healthProfile.scars.push({id:'legacy_scar_'+i,kind:'battle',severity:i===0&&x.military.wounds>=3?2:1,source:'eski sefer kaydı',location:['omuzda','kolda','bacakta'][i%3],year:x.year+Math.max(18,x.age-5-i),age:Math.max(18,x.age-5-i),lastFlareYear:null});
 }
 ensureStoryArcs();ensureDelayedEvents();
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
function load(){try{const raw=localStorage.getItem('yazgi_full_v1');if(!raw)return;const x=JSON.parse(raw);if(x.version!==SAVE_VERSION&&!localStorage.getItem('yazgi_before_v18'))localStorage.setItem('yazgi_before_v18',raw);clearTransient();s=migrateState(x);$('newModal').classList.remove('show');render();if(s.pendingEventId||s.pendingDecision)activateLifeTab();if(!s.alive)showHeirModal();save();}catch(e){console.error(e);s=null;$('newModal').classList.remove('show');notice('Kayıt okunamadı; mevcut kayıt korunuyor. Yeni yaşam açmadan önce tarayıcı verisini yedekle.');}}
function configureRules(){
 D.assets.push({id:'smithy',name:'Demir Ocağı',icon:'🔥',cost:60});D.achievements.push({id:'trained',name:'Ustanın Emeği',desc:'Bir uzmanlıkta 60 seviyesine ulaş.'},{id:'reconciled',name:'Barış Sözü',desc:'Bir rakiple uzlaş.'});D.achievements.find(x=>x.id==='adult').desc='18 yaşına ulaş.';D.careers.forEach(r=>r.age=CAREER_RULES[r.id].age);
 const adult=new Set(['Sefer','Tutsaklık','Sürgün','Töre','Ocak','Ticaret','Kervan','Devlet','Elçilik','Servet','Sürü']);
 for(const e of EVENT_DECK){
  if(adult.has(e.cat)||['marriage_pressure','family_debt','winter_shortage','summer_drought','wolf_attack','bandit_tracks','feud_challenge','feud_end'].includes(e.id))e.min=Math.max(18,e.min);
  if(e.id==='foal_friend')e.min=5;
  if(e.id==='sickness'){
   e.choices=[
    ['Dinlen ve sıcak kal',{health:2,happiness:-1,ailment:{id:'fever',severity:2,duration:3,source:'hastalık'},setFlag:'health_crisis_ready'}],
    ['Otacıdan yardım iste',{health:3,healerCare:true,ailment:{id:'fever',severity:1,duration:2,source:'hastalık'},setFlag:'health_crisis_ready'}]
   ];
  }
  if(e.id==='minor_wound'){
   e.choices=[
    ['Dinlen ve yarayı zorlamama',{health:3,happiness:-1,ailment:{id:'injury',severity:1,duration:2,source:'düşme'}}],
    ['İşe devam et',{health:-5,prestige:2,wound:1,ailment:{id:'injury',severity:2,duration:4,source:'düşme'}}]
   ];
  }
  if(e.id==='battle_wound'){
   e.choices=[
    ['Geri çekilip yarayı sar',{health:-5,prestige:1,wound:1,ailment:{id:'deep_wound',severity:2,duration:5,source:'battle'},scar:{kind:'battle',severity:1,source:'battle'}}],
    ['Meydanda kal',{health:-10,prestige:7,wound:1,ailment:{id:'deep_wound',severity:3,duration:8,source:'battle'},scar:{kind:'battle',severity:2,source:'battle'}}]
   ];
  }
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
  if(e.id==='winter_shortage'){e.months=[10,11,12];e.choices.forEach((c,i)=>c[1].economy=i===0?{market:8,food:12,shortage:1}:{market:5,food:8});}if(e.id==='summer_drought'){e.months=[4,5,6];e.req='asset:flock';e.choices.forEach((c,i)=>c[1].economy=i===0?{food:15,market:7}:{food:9,market:4});}if(e.id==='exile_return')e.req=['exile','flag:exile_loyal'];
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
 {id:'health_crisis',cat:'Sağlık',min:8,max:85,w:16,cool:20,once:true,req:['flag:health_crisis_ready','hasAilment'],target:'healthHealer',text:'Rahatsızlığın birkaç gündür sürüyor. Otacı {name}, yalnız bugünü değil iyileşme sürecini de düşünmen gerektiğini söylüyor.',choices:[['Bir süre bedenini zorlamama',{happiness:-1,targetRel:3,targetTrust:4,targetRespect:2,health:3,setFlag:'health_recovery_plan'}],['Bakımı daha yakından sürdür',{healerCare:true,targetRel:5,targetTrust:6,targetRespect:3,setFlag:'health_recovery_plan'}]]},
 {id:'health_followup',cat:'Sağlık',min:8,max:90,w:14,cool:10,once:true,req:'flag:health_recovery_plan',target:'healthHealer',text:'{name}, iyileşmenin ilk kısmını atlattığını ama eski gücüne dönmek için acele etmemen gerektiğini söylüyor.',choices:[['Dinlenmeyi sürdür',{health:4,happiness:1,targetTrust:3,setFlag:'health_followed'}],['Günlük işlere yavaşça dön',{health:2,skill:1,targetRespect:3,setFlag:'health_followed'}]]},
 {id:'health_recovery_test',cat:'Sağlık',min:9,max:95,w:13,cool:10,once:true,req:'flag:health_followed',target:'healthHealer',text:'Gücün geri dönüyor. {name}, bundan sonra bedenini ne kadar zorlayacağının iyileşmenin kalıcı olup olmayacağını belirleyeceğini söylüyor.',choices:[['Bir ay daha dikkatli davran',{health:5,happiness:1,targetRel:3,clearFlag:'health_crisis_ready',setFlag:'health_recovered'}],['Eski düzene hemen dön',{skill:2,health:-1,targetRespect:2,clearFlag:'health_crisis_ready',setFlag:'health_recovered'}]]},
 {id:'health_aftercare',cat:'Sağlık',min:10,max:100,w:12,cool:12,once:true,req:'flag:health_recovered',target:'healthHealer',text:'{name}, yaşadığın rahatsızlığın geride kaldığını düşünüyor. Bundan sonrası bedenini tanıyıp ona göre yaşamakla ilgili.',choices:[['Öğüdünü aklında tut',{health:3,happiness:2,targetTrust:4,targetRespect:3,clearFlag:'health_recovery_plan',clearFlag2:'health_followed'}],['Kendi düzenine dön',{happiness:2,prestige:1,clearFlag:'health_recovery_plan',clearFlag2:'health_followed'}]]},
 {id:'old_wound_flare',cat:'Sağlık',min:40,max:110,w:24,cool:0,delayed:true,text:'{detail}',choices:[['Bir ay yarayı zorlamadan geçir',{health:2,happiness:-1,ailment:{id:'old_wound',severity:1,duration:3,source:'eski yara'}}],['Otacıya gidip bakım al',{healerCare:true,ailment:{id:'old_wound',severity:1,duration:2,source:'eski yara'}}]]},
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
 {id:'elder_family_council',cat:'Miras',min:55,max:110,w:14,cool:18,once:false,req:['hasAdultChild','successionUnprepared'],target:'adultChild',text:'Yaşın ilerledikçe {name} ile malın, ocağın ve senden sonra kimin hangi yükü taşıyacağını açıkça konuşma zamanı geldi.',choices:[['Yaşayan çocuklara eşit pay bırak',{happiness:2,targetRel:4,targetTrust:5,targetRespect:3,succession:{mode:'equal',prepared:true,harmony:8,note:'Aile meclisinde eşit paylaşım kararı verildi.'}}],['{name} ana varis olsun',{prestige:2,targetRel:5,targetTrust:4,targetRespect:7,succession:{mode:'target',prepared:true,harmony:-6,note:'Aile meclisinde tek ana varis belirlendi.'}}],['Kararı şimdilik ertele',{happiness:-1,targetTrust:-2,succession:{prepared:false,harmony:-3,note:'Vasiyet konuşması ertelendi.'}}]]},
 {id:'elder_last_wish',cat:'Miras',min:60,max:115,w:11,cool:0,once:true,req:['hasAdultChild','successionPrepared'],target:'adultChild',text:'{name} yanında otururken senden sonra hatırlanmasını istediğin sözü soruyor.',choices:[['Kardeşlerini bir arada tutmasını iste',{happiness:3,targetRel:5,targetTrust:7,succession:{harmony:9,lastWish:'Aile bir arada kalsın.'}}],['Ailenin adını ve emeğini sürdürmesini iste',{prestige:3,targetRespect:7,succession:{harmony:3,lastWish:'Ailenin adı ve emeği sürdürülsün.'}}]]},
 {id:'inheritance_aftershock',cat:'Miras',min:0,max:150,w:18,cool:0,delayed:true,req:'hasLivingSibling',target:'sibling',text:'{detail} Kardeşin {name}, ebeveyninizin ölümünden sonra pay ve sorumluluk meselesini seninle yeniden konuşuyor.',choices:[['Açıkça konuşup gönlünü al',{happiness:2,targetRel:7,targetTrust:8,targetGrudge:-10}],['Kararın artık değişmeyeceğini söyle',{prestige:2,targetRel:-5,targetTrust:-5,targetGrudge:8}]]},
 {id:'rival_kin_bridge',cat:'İlişkiler',min:12,max:150,w:3,cool:30,req:'hasRivalKinLink',target:'rivalAllyPair',text:'Rakibin {name}, yakının {other} ile giderek yakınlaşıyor.',choices:[['Aralarına karışma',{happiness:1,targetGrudge:-2,otherTrust:2,linkScore:3}],['Yakınını uyar',{prestige:1,targetGrudge:5,otherRel:-4,otherTrust:-5,linkScore:-8,linkGrudge:4}]]}
 );
}
configureRules();
init();
