/* Original YAZGI simulation rules; reference assets, text and code are not used. */
const SAVE_VERSION=42,ADULT_AGE=18;
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
 old_wound:{name:'Eski yaranın sızısı',min:18,loss:1,duration:4,severity:2,kind:'chronic'},
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
 const trainedRole=prof?childTrainingCareerRole(n,prof):null,guidedRole={craft:'Demirci',trade:'Tüccar',wisdom:'Bitigçi',war:'Alp'}[path]||null;n.role=trainedRole||guidedRole||npcCareerFor(n);n.roleHistory.push({year:s.year+s.age,role:n.role});rememberNPC(n,'milestone','Yıllar önce seçilen yetişme yolunun ardından '+n.role+' oldu.',6);
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
  if(danger<.035){registerNPCDeath(n,'aynı seferde çatışma',{inherit:false});continue;}
  if(danger<.13){n.health=clamp(n.health-rng(8,22));rememberNPC(n,'military','Seferden yaralı döndü.',5);}
  if(kind==='success')adjustNPC(n,{rel:2,trust:3,respect:2},'Bir seferi daha birlikte tamamladınız.');
  else if(kind==='captured')adjustNPC(n,{rel:1,trust:2,grudge:-1},'Tutsak düştüğün seferin hatırasını taşıyor.');
 }
 seedCoreSocialLinks();
}
function makeTargetFriend(n,type='Dost'){
 if(!n)return;const ri=s.rivals.findIndex(x=>x.id===n.id);if(ri>=0)s.rivals.splice(ri,1);n.type=type;if(!s.friends.some(x=>x.id===n.id))s.friends.push(n);ensureFriendProfile(n);autoCreateFriendCircle();n.statusFlags=n.statusFlags||{};n.statusFlags.oldComrade=true;rememberNPC(n,'bond','Eski sefer bağınız dostluğa dönüştü.',6);
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
 n.lastInteractionYear=n.lastInteractionYear??null;n.statusFlags=n.statusFlags||{};normalizeNPCLifeState(n);normalizeNPCEstate(n);return n;
}

const NPC_ESTATE_ASSETS=['horse','flock','yurt','smithy','caravan_share'];
function ensureNPCEstates(){
 s.npcEstates=s.npcEstates&&typeof s.npcEstates==='object'&&!Array.isArray(s.npcEstates)?s.npcEstates:{};
 const e=s.npcEstates;e.cases=Array.isArray(e.cases)?e.cases.slice(0,80):[];e.history=Array.isArray(e.history)?e.history.slice(0,120):[];
 e.transfers=Math.max(0,Math.round(e.transfers||0));e.disputes=Math.max(0,Math.round(e.disputes||0));e.resolved=Math.max(0,Math.round(e.resolved||0));
 return e;
}
function npcEstateSeedAssets(n){
 const out=[],add=id=>{if(NPC_ESTATE_ASSETS.includes(id)&&!out.includes(id))out.push(id);};
 if((n.age||0)>=16&&((n.wealth||0)>=8||['Alp','Akıncı','Tarkan','Boy Beyi','Kervan Başı'].includes(n.role)))add('horse');
 if((n.wealth||0)>=15&&(n.goal==='wealth'||['Çoban','Tüccar','Kervan Başı'].includes(n.role)||Math.random()<.35))add('flock');
 if((n.age||0)>=22&&(n.wealth||0)>=22) add('yurt');
 if((n.wealth||0)>=30&&['Demirci','Zanaatkâr'].includes(n.role))add('smithy');
 if((n.wealth||0)>=34&&(n.goal==='wealth'||['Tüccar','Kervan Başı','Kervan Rehberi'].includes(n.role)))add('caravan_share');
 return out;
}
function normalizeNPCEstate(n){
 if(!n)return null;n.estate=n.estate&&typeof n.estate==='object'&&!Array.isArray(n.estate)?n.estate:{};
 const e=n.estate;
 const legacyAssets=Array.isArray(n.statusFlags?.settlementAssets)?n.statusFlags.settlementAssets:[];
 if(!Array.isArray(e.assets)){e.assets=[...legacyAssets,...npcEstateSeedAssets(n)];e.seeded=true;}
 e.assets=[...new Set(e.assets.filter(id=>NPC_ESTATE_ASSETS.includes(id)))];
 e.seeded=e.seeded!==false;e.history=Array.isArray(e.history)?e.history.slice(0,30):[];
 e.inheritedFrom=Array.isArray(e.inheritedFrom)?e.inheritedFrom.slice(0,20):[];
 e.lastAssetYear=Number.isFinite(e.lastAssetYear)?e.lastAssetYear:null;
 return e;
}
function npcEstateAssetName(id){return D.assets.find(a=>a.id===id)?.name||({horse:'At',flock:'Sürü',yurt:'Büyük Yurt',smithy:'Demir Ocağı',caravan_share:'Kervan Payı'}[id]||id);}
function npcEstateValue(n){
 const e=normalizeNPCEstate(n);let total=Math.max(0,n.wealth||0);
 for(const id of e.assets){const a=D.assets.find(x=>x.id===id);total+=Math.max(2,Math.round((a?.cost||10)*.55));}
 return total;
}
function npcEstateSummary(n){
 const e=normalizeNPCEstate(n),assets=e.assets.map(npcEstateAssetName);return (n.wealth||0)+' servet'+(assets.length?' • '+assets.join(', '):'');
}
function npcEstateYearTick(n){
 if(!n?.alive||n.age<18||npcLifeBlocksNormalInteraction(n))return;const e=normalizeNPCEstate(n),year=s.year+s.age;if(e.lastAssetYear===year)return;e.lastAssetYear=year;
 const add=id=>{if(!e.assets.includes(id)){e.assets.push(id);e.history.unshift({year,type:'acquire',asset:id});rememberNPC(n,'property',npcEstateAssetName(id)+' edindi.',3);return true;}return false;};
 if(n.wealth>=18&&!e.assets.includes('horse')&&Math.random()<.08)add('horse');
 if(n.wealth>=26&&!e.assets.includes('flock')&&(n.goal==='wealth'||n.role==='Çoban')&&Math.random()<.1)add('flock');
 if(n.wealth>=34&&!e.assets.includes('yurt')&&Math.random()<.08)add('yurt');
 if(n.wealth>=42&&!e.assets.includes('smithy')&&['Demirci','Zanaatkâr'].includes(n.role)&&Math.random()<.12)add('smithy');
 if(n.wealth>=48&&!e.assets.includes('caravan_share')&&(n.goal==='wealth'||String(n.role).includes('Kervan')||n.role==='Tüccar')&&Math.random()<.1)add('caravan_share');
 if(n.wealth<=2&&e.assets.length&&Math.random()<.12){const id=e.assets.pop();n.wealth+=Math.max(2,Math.round((D.assets.find(a=>a.id===id)?.cost||8)*.18));e.history.unshift({year,type:'sell',asset:id});rememberNPC(n,'property',npcEstateAssetName(id)+' malını elden çıkardı.',3);}
}
function npcEstatePlayerRelation(n){
 if(!n)return 0;if(s.parents.some(x=>x.id===n.id))return 100;
 if((s.relatives||[]).some(x=>x.id===n.id&&['Dede','Nine'].includes(kinRole(n))))return 78;
 if((s.relatives||[]).some(x=>x.id===n.id&&['Amca','Dayı','Hala','Teyze','Amca / Dayı','Hala / Teyze'].includes(kinRole(n))))return 45;
 if(n.id===s.partner?.id)return 95;return 0;
}
function npcEstateHeirs(n){
 const out=[],seen=new Set(),add=(id,name,kind,ref,weight=1)=>{if(!id||seen.has(id))return;seen.add(id);out.push({id,name,kind,ref:ref||null,weight});};
 const linkedPartner=n.partner?.id?npcById(n.partner.id):null;if(linkedPartner?.alive)add(linkedPartner.id,linkedPartner.name,'partner',linkedPartner,2);
 for(const d of (n.descendants||[]).filter(x=>x?.alive))add(d.id,d.name,'child',d,3);
 for(const x of allNPCs().filter(x=>x.alive&&x.parentIds?.includes(n.id)))add(x.id,x.name,'child',x,3);
 const pr=npcEstatePlayerRelation(n);if(pr>=70)add(s.id,s.name,pr>=90?'player_child':'player_grandchild',null,pr>=90?3:2);
 if(!out.length&&pr>=40)add(s.id,s.name,'player_kin',null,1);
 if(!out.length){
  const kin=allNPCs().filter(x=>x.alive&&x.id!==n.id&&(shareParents(x,n)||x.parentIds?.some(id=>n.parentIds?.includes(id)))).sort((a,b)=>(b.rel||0)-(a.rel||0)).slice(0,3);
  for(const x of kin)add(x.id,x.name,'kin',x,1);
 }
 return out;
}
function npcEstateCaseById(id){return ensureNPCEstates().cases.find(x=>x.id===id)||null;}
function playerReceivesEstateAsset(id){
 if(!NPC_ESTATE_ASSETS.includes(id))return;if(s.assets.includes(id)){const value=Math.max(1,Math.round((D.assets.find(a=>a.id===id)?.cost||8)*.22));s.wealth+=value;economyLedger('inheritance',value,npcEstateAssetName(id)+' zaten sende olduğu için miras payı mala çevrildi.');}
 else{s.assets.push(id);ensureEconomy();assetState(id).condition=Math.max(assetState(id).condition||0,65);}
}
function transferEstateShare(heir,wealth,assets,from){
 wealth=Math.max(0,Math.round(wealth||0));assets=Array.isArray(assets)?assets:[];
 if(heir.id===s.id){s.wealth+=wealth;for(const id of assets)playerReceivesEstateAsset(id);if(wealth)ensureExtendedFamily().history.unshift({year:s.year+s.age,age:s.age,type:'inheritance',from:from.id,amount:wealth});}
 else if(heir.ref){heir.ref.wealth=Math.max(0,(heir.ref.wealth||0)+wealth);const e=normalizeNPCEstate(heir.ref);for(const id of assets)if(!e.assets.includes(id))e.assets.push(id);e.inheritedFrom.unshift({id:from.id,name:from.name,year:s.year+s.age,wealth,assets:[...assets]});}
}
function estateDisputeRisk(n,heirs,value){
 if(heirs.length<2||value<18)return 0;let risk=18+Math.min(35,value*.45)+(heirs.length-2)*8;
 const grudgy=heirs.filter(h=>h.ref&&(h.ref.bonds?.grudge||0)>=30).length;risk+=grudgy*10;
 const trusted=heirs.filter(h=>h.ref&&(h.ref.bonds?.trust||0)>=70).length;risk-=trusted*5;
 if(heirs.some(h=>h.id===s.id))risk+=5;return clamp(Math.round(risk));
}
function processNPCEstate(n){
 if(!n)return null;const root=ensureNPCEstates(),e=normalizeNPCEstate(n);if(n.statusFlags?.estateHandled)return root.cases.find(x=>x.sourceId===n.id)||null;
 n.statusFlags=n.statusFlags||{};n.statusFlags.estateHandled=true;
 const heirs=npcEstateHeirs(n),wealth=Math.max(0,Math.round(n.wealth||0)),assets=[...e.assets],value=npcEstateValue(n),risk=estateDisputeRisk(n,heirs,value),playerHeir=heirs.some(h=>h.id===s.id);
 const rec={id:'estate_'+n.id+'_'+(s.year+s.age),sourceId:n.id,name:n.name,year:s.year+s.age,kin:kinRole(n),wealth,assets:[...assets],value,heirs:heirs.map(h=>({id:h.id,name:h.name,kind:h.kind,weight:h.weight})),status:'settled',risk,playerHeir,playerWealth:0,playerAssets:[],transfers:[],tension:0};
 if(!heirs.length){rec.status='unclaimed';root.cases.unshift(rec);root.history.unshift({year:rec.year,type:'unclaimed',sourceId:n.id,name:n.name,value});n.wealth=0;e.assets=[];return rec;}
 const weightTotal=heirs.reduce((a,h)=>a+h.weight,0),shares=[];let assigned=0;
 for(let i=0;i<heirs.length;i++){const h=heirs[i],amount=i===heirs.length-1?Math.max(0,wealth-assigned):Math.floor(wealth*h.weight/weightTotal);assigned+=amount;shares.push({heir:h,wealth:amount,assets:[]});}
 for(let i=0;i<assets.length;i++)shares[i%shares.length].assets.push(assets[i]);
 const dispute=playerHeir&&heirs.length>=2&&risk>=45;
 if(dispute){
  rec.status='disputed';rec.tension=risk;rec.planned=shares.map(x=>({heirId:x.heir.id,wealth:x.wealth,assets:[...x.assets]}));root.disputes++;
 }else{
  for(const sh of shares){transferEstateShare(sh.heir,sh.wealth,sh.assets,n);rec.transfers.push({heirId:sh.heir.id,name:sh.heir.name,wealth:sh.wealth,assets:[...sh.assets]});if(sh.heir.id===s.id){rec.playerWealth+=sh.wealth;rec.playerAssets.push(...sh.assets);}}
  rec.status='settled';root.transfers++;n.wealth=0;e.assets=[];
  if(rec.playerWealth||rec.playerAssets.length)log(safeText(n.name)+' ardından sana '+(rec.playerWealth?rec.playerWealth+' servet ':'')+(rec.playerAssets.length?rec.playerAssets.map(npcEstateAssetName).join(', ')+' ':'')+'miras kaldı.','major');
 }
 root.cases.unshift(rec);root.cases=root.cases.slice(0,80);root.history.unshift({year:rec.year,type:rec.status,sourceId:n.id,name:n.name,value,risk});root.history=root.history.slice(0,120);return rec;
}
function inheritanceDisputeIssue(caseId,id){
 const rec=npcEstateCaseById(caseId);if(!rec||rec.status!=='disputed')return 'Açık bir miras çekişmesi yok.';if(!rec.playerHeir)return 'Bu mirasta doğrudan taraf değilsin.';
 if(id==='tore'&&s.wealth<2)return 'Töre görüşmesi ve arabuluculuk için 2 servet gerekiyor.';if(!['mediate','claim','yield','tore'].includes(id))return 'Miras eylemi bulunamadı.';return '';
}
function settleEstateCase(rec,mode){
 const n=npcById(rec.sourceId)||{id:rec.sourceId,name:rec.name},heirs=rec.heirs.map(h=>({id:h.id,name:h.name,kind:h.kind,weight:h.weight,ref:h.id===s.id?null:npcById(h.id)}));
 let planned=(rec.planned||[]).map(p=>({heir:heirs.find(h=>h.id===p.heirId),wealth:p.wealth,assets:[...(p.assets||[])]})).filter(x=>x.heir);
 const me=planned.find(x=>x.heir.id===s.id),others=planned.filter(x=>x.heir.id!==s.id);
 if(mode==='claim'&&me&&others.length){const donor=others.sort((a,b)=>b.wealth-a.wealth)[0],take=Math.min(donor.wealth,Math.max(1,Math.round(rec.wealth*.15)));donor.wealth-=take;me.wealth+=take;if(!me.assets.length&&donor.assets.length)me.assets.push(donor.assets.shift());}
 if(mode==='yield'&&me&&others.length){const to=others.sort((a,b)=>a.wealth-b.wealth)[0],give=Math.min(me.wealth,Math.max(1,Math.round(me.wealth*.35)));me.wealth-=give;to.wealth+=give;if(me.assets.length&&Math.random()<.7)to.assets.push(me.assets.pop());}
 if(mode==='mediate'&&me){rec.tension=Math.max(0,rec.tension-25);}
 if(mode==='tore'&&me){rec.tension=Math.max(0,rec.tension-40);}
 for(const sh of planned){transferEstateShare(sh.heir,sh.wealth,sh.assets,n);rec.transfers.push({heirId:sh.heir.id,name:sh.heir.name,wealth:sh.wealth,assets:[...sh.assets]});if(sh.heir.id===s.id){rec.playerWealth+=sh.wealth;rec.playerAssets.push(...sh.assets);}}
 rec.status='settled';rec.resolution=mode;rec.resolvedYear=s.year+s.age;const root=ensureNPCEstates();root.resolved++;root.transfers++;
 const src=npcById(rec.sourceId);if(src){src.wealth=0;normalizeNPCEstate(src).assets=[];}
 for(const h of heirs.filter(x=>x.ref)){if(mode==='claim')adjustNPC(h.ref,{rel:-5,trust:-4,grudge:8},rec.name+' mirasında daha büyük pay istedin.');else if(mode==='yield')adjustNPC(h.ref,{rel:6,trust:6,grudge:-4},rec.name+' mirasında payından feragat ettin.');else adjustNPC(h.ref,{rel:3,trust:4,grudge:-5},rec.name+' mirasını kavga büyümeden kapatmaya çalıştın.');}
 if(mode==='claim')recordPublicWord('inheritance',rec.name+' mirasında daha büyük pay istediğin aile içinde konuşuluyor.',{honor:-4,reliability:-2,fear:1},{severity:28,polarity:-1,truth:true,knownIds:heirs.filter(x=>x.ref).map(x=>x.id),sourceId:heirs.find(x=>x.ref)?.id||null});
 else if(mode==='yield')recordPublicWord('generosity',rec.name+' mirasında kendi payından feragat ettiğin anlatılıyor.',{honor:4,generosity:6,reliability:2},{severity:28,polarity:1,truth:true,knownIds:heirs.filter(x=>x.ref).map(x=>x.id),sourceId:heirs.find(x=>x.ref)?.id||null});
 else if(mode==='mediate'||mode==='tore')recordPublicWord('mediation',rec.name+' mirasını kavga büyümeden kapatmaya çalıştığın konuşuluyor.',{honor:2,reliability:3},{severity:18,polarity:1,truth:true,knownIds:heirs.filter(x=>x.ref).map(x=>x.id)});
 log(safeText(rec.name)+' miras çekişmesi '+(mode==='claim'?'payını büyüterek':mode==='yield'?'payından feragat ederek':mode==='tore'?'töre önünde':'uzlaşmayla')+' kapandı.','major');
}
function inheritanceDisputeAction(caseId,id){
 const issue=inheritanceDisputeIssue(caseId,id);if(issue){notice(issue);return false;}const rec=npcEstateCaseById(caseId);
 return performAction({kind:'inheritanceDispute',caseId,id},()=>{if(id==='tore')s.wealth-=2;settleEstateCase(rec,id);},safeText(rec.name)+' mirasını sonuçlandırmakla bir ay geçti.');
}
function npcEstateSummaryHtml(){
 const root=ensureNPCEstates(),open=root.cases.filter(x=>x.status==='disputed'&&x.playerHeir),recent=root.cases.filter(x=>x.status==='settled'&&(x.playerWealth>0||x.playerAssets?.length)).slice(0,4);
 if(!open.length&&!recent.length&&root.transfers===0)return '';
 let html='<div class="card"><h3>🏺 Aile Malı ve Miras</h3><p>Sonuçlanan aktarım '+root.transfers+' • miras çekişmesi '+root.disputes+' • çözülen '+root.resolved+'</p></div>';
 if(open.length)html+='<div class="grid2">'+open.map(rec=>'<div class="card"><h3>⚖ '+safeText(rec.name)+' mirası</h3><p>Toplam değer '+rec.value+' • gerilim '+rec.tension+'/100<br>Mal: '+(rec.assets.length?rec.assets.map(npcEstateAssetName).join(', '):'yalnız servet')+'<br>Hak sahipleri: '+rec.heirs.map(h=>safeText(h.name)).join(' • ')+'</p><div class="actions"><button class="mini" onclick="inheritanceDisputeAction(\''+rec.id+'\',\'mediate\')">Uzlaşmayı dene</button><button class="mini" onclick="inheritanceDisputeAction(\''+rec.id+'\',\'claim\')">Daha büyük pay iste</button><button class="mini" onclick="inheritanceDisputeAction(\''+rec.id+'\',\'yield\')">Payından feragat et</button><button class="mini" onclick="inheritanceDisputeAction(\''+rec.id+'\',\'tore\')">Töre önüne götür</button></div></div>').join('')+'</div>';
 if(recent.length)html+='<div class="card"><h3>📜 Son Miraslar</h3><p>'+recent.map(rec=>safeText(rec.name)+' → '+rec.playerWealth+' servet'+(rec.playerAssets?.length?' • '+rec.playerAssets.map(npcEstateAssetName).join(', '):'')).join('<br>')+'</p></div>';
 return html;
}

function allNPCs(){
 const out=[],seen=new Set();const visit=n=>{if(!n||seen.has(n.id))return;seen.add(n.id);normalizeNPC(n,n.type);out.push(n);(n.descendants||[]).forEach(visit);};
 const disp=s.displacement||{},cap=disp.captivity?.contacts||[],ex=disp.exile?.contacts||[],edu=s.education?.contacts||[],oldLove=s.exPartners||[],justice=s.justice?.contacts||[],romanceContacts=s.romance?.contacts||[],inlaws=s.extendedFamily?.inLaws||[],branchInLaws=s.familyBranches?.childInLaws||[],guardian=s.guardianship?.contacts||[],work=s.workplace?.contacts||[];
 [...s.parents,...s.siblings,...(s.relatives||[]),...s.friends,...s.rivals,...s.children,...branchInLaws,...romanceContacts,...(s.careerContacts||[]),...edu,...cap,...ex,...oldLove,...justice,...inlaws,...guardian,...work,s.partner,...s.military.comrades,...(s.toyFestival?.contenders||[]),...(s.workshop?.clients||[])].forEach(visit);return out;
}


/* v34 - autonomous NPC paths: the people closest to the protagonist pursue their
   own ambitions without requiring clicks. The existing NPC goal is the seed,
   while progress and consequential milestones are stored on the individual. */
const NPC_ASPIRATION_STAGES={
 war:['İlk savaş talimi','Obada alp olarak tanınma','Seferlerin ustası olma'],
 mastery:['Çıraklık emeği','Kendi ustalığını ispatlama','Ünlü zanaatkâr olma'],
 wealth:['Takas ve birikim','Kervan işlerinde yükselme','Refahlı bir ocak kurma'],
 prestige:['Obada sözü duyulma','Mecliste yer bulma','Adı sayılan yönetici olma'],
 wisdom:['Bilgi toplama','Bitig ve öğreti ustalığı','Bilgeliğini gelecek kuşağa aktarma'],
 family:['Ocak bağlarını sağlamlaştırma','Yeni nesli güvenle yetiştirme','Soyun dayanağı olma'],
 peace:['Eski kırgınlıkları geride bırakma','Obada güvenilir bir söz olma','Uzlaştırıcı olarak hatırlanma']
};
const NPC_ASPIRATION_THRESHOLDS=[20,50,82];
function npcAspiration(n,create=true){
 if(!n||!n.alive||n.age<12)return null;
 if(!n.aspiration&&create)n.aspiration={
   goal:NPC_ASPIRATION_STAGES[n.goal]?n.goal:'family',stage:0,effort:0,drive:clamp(rng(42,72)),
   support:0,pressure:0,autonomy:clamp(rng(48,82)),stalledYears:0,
   startYear:s.year+s.age,lastYear:null,lastMilestoneYear:null,status:'active',
   protectedRole:null,milestones:[],history:[]
 };
 const a=n.aspiration;if(!a||typeof a!=='object'||Array.isArray(a))return null;
 a.goal=NPC_ASPIRATION_STAGES[a.goal]?a.goal:'family';a.stage=Math.max(0,Math.min(3,Math.round(a.stage||0)));
 for(const k of ['effort','drive','support','pressure','autonomy'])a[k]=clamp(Number.isFinite(a[k])?a[k]:k==='drive'?55:k==='autonomy'?60:0);
 a.stalledYears=Math.max(0,Math.round(a.stalledYears||0));
 a.milestones=Array.isArray(a.milestones)?a.milestones.slice(0,6):[];
 a.history=Array.isArray(a.history)?a.history.slice(0,20):[];
 a.startYear=Number.isFinite(a.startYear)?a.startYear:s.year+s.age;
 a.lastYear=Number.isFinite(a.lastYear)?a.lastYear:null;
 a.lastMilestoneYear=Number.isFinite(a.lastMilestoneYear)?a.lastMilestoneYear:null;
 a.protectedRole=a.protectedRole||null;a.status=a.stage===3?'completed':'active';
 return a;
}
function npcAspirationStep(n,a){
 if(!a||a.stage>=3||a.effort<NPC_ASPIRATION_THRESHOLDS[a.stage]||a.lastMilestoneYear===s.year+s.age)return false;
 const stage=a.stage+1,kind=a.goal; a.stage=stage;a.lastMilestoneYear=s.year+s.age;a.stalledYears=0;
 const milestone={stage,year:s.year+s.age,age:n.age,title:NPC_ASPIRATION_STAGES[kind][stage-1],roleBefore:n.role};
 a.milestones.push(milestone);
 n.skills=n.skills||{};
 const earn=(k,by)=>{n.skills[k]=clamp((n.skills[k]||0)+by);};
 if(kind==='war'){earn('combat',stage*3);n.prestige=clamp(n.prestige+stage*4);if(stage>=2)n.role=stage===3&&n.prestige>=50?'Tarkan':'Alp';}
 else if(kind==='mastery'){earn('craft',stage*4);earn('mastery',stage*3);if(stage>=2)n.role='Demirci';n.wealth+=stage;}
 else if(kind==='wealth'){earn('trade',stage*4);n.wealth+=stage*6;if(stage>=2)n.role=stage===3?'Kervan Başı':'Tüccar';}
 else if(kind==='prestige'){earn('speech',stage*4);n.prestige=clamp(n.prestige+stage*7);if(stage>=2)n.role=stage===3?'Boy Beyi':'Elçi';}
 else if(kind==='wisdom'){earn('literacy',stage*5);n.prestige=clamp(n.prestige+stage*2);if(stage>=2)n.role='Bitigçi';}
 else if(kind==='family'){n.rel=clamp(n.rel+stage*3);normalizeBonds(n);n.bonds.trust=clamp(n.bonds.trust+stage*4);n.wealth+=stage*2;}
 else if(kind==='peace'){n.rel=clamp(n.rel+stage*2);normalizeBonds(n);n.bonds.grudge=clamp(n.bonds.grudge-stage*5);n.bonds.trust=clamp(n.bonds.trust+stage*3);}
 if(stage>=2&&n.role!==milestone.roleBefore){
  a.protectedRole=n.role;n.roleHistory=Array.isArray(n.roleHistory)?n.roleHistory:[];
  n.roleHistory.push({year:s.year+s.age,role:n.role,source:'own_aspiration'});
 }
 milestone.roleAfter=n.role;
 if(stage===3)a.status='completed';
 const note=stage===3?'Kendi ülküsüne ulaştı: '+NPC_GOALS[kind]+'.':'Kendi ülküsünde yeni aşama: '+milestone.title+'.';
 a.history.unshift({year:s.year+s.age,type:stage===3?'completed':'milestone',stage,description:note});
 a.history=a.history.slice(0,20);
 npcWorldRecord(n,'aspiration',note,stage===3?'major':'good');
 return true;
}
function npcAspirationYearTick(n,year=s.year+s.age){
 if(!n?.alive||n.age<12||!npcWorldRelevant(n))return;
 const a=npcAspiration(n);if(!a||a.lastYear===year||a.status==='completed')return;
 a.lastYear=year;
 const prior=a.effort,life=normalizeNPCLifeState(n);
 if(life.status!=='normal'){
  a.stalledYears++;a.drive=clamp(a.drive-2);
  a.history.unshift({year,type:'blocked',description:'Hastalık, sürgün veya tutsaklık yüzünden amacını erteledi.'});
 }else{
  const energy=(n.health||70)/26+(n.bonds?.trust||50)/65;
  let progress=Math.max(0,Math.round(3+energy+a.drive/35+a.support/18+a.autonomy/70+
    (n.traits?.includes('caliskan')?2:0)+(n.traits?.includes('hirsli')?1:0)-a.pressure/18+rng(-2,2)));
  if(a.pressure>55&&n.traits?.includes('gururlu'))progress=Math.max(0,progress-3);
  a.effort=clamp(a.effort+progress);a.support=clamp(a.support-4);a.pressure=clamp(a.pressure-3);
  a.stalledYears=progress===0?a.stalledYears+1:0;
  if(progress===0)a.drive=clamp(a.drive-2);
 }
 a.history=a.history.slice(0,20);
 if(a.effort>prior)npcAspirationStep(n,a);
 if(a.stalledYears>=4&&a.stage===0&&Math.random()<.18){
  a.history.unshift({year,type:'abandoned',goal:a.goal,effort:a.effort,description:'Yorucu yılların ardından eski amacını bıraktı.'});
  const next=pick(Object.keys(NPC_ASPIRATION_STAGES).filter(g=>g!==a.goal));
  a.goal=next;a.effort=0;a.drive=clamp(a.drive+15);a.stalledYears=0;n.goal=next;
  npcWorldRecord(n,'aspiration','Eski hedefinden vazgeçip '+NPC_GOALS[next].toLowerCase()+' yoluna yöneldi.');
 }
}
function npcAspirationActionIssue(n,id){
 if(!n?.alive||n.age<12||!npcWorldRelevant(n))return 'Bu kişiyle gelişim yolunu konuşamazsın.';
 if(npcLifeBlocksNormalInteraction(n))return 'Önce bu kişinin özel hayat durumunu çöz.';
 const a=npcAspiration(n);if(!a||a.status==='completed')return 'Kendi amacını zaten tamamladı.';
 if(!['support','listen','pressure','leave'].includes(id))return 'Böyle bir ülkü etkileşimi yok.';
 if(id==='support'&&s.wealth<3)return 'Destek için 3 servet gerekiyor.';
 return '';
}
function npcAspirationAction(npcId,id){
 const n=npcById(npcId),issue=npcAspirationActionIssue(n,id);if(issue){notice(issue);return false;}
 return performAction({kind:'npcAspiration',npcId,id},()=>{
  const a=npcAspiration(n);
  if(id==='support'){
   s.wealth-=3;n.wealth+=2;economyLedger('family',-3,n.name+' kendi yoluna destek');
   a.support=clamp(a.support+17);a.drive=clamp(a.drive+8);a.effort=clamp(a.effort+5);
   adjustNPC(n,{rel:4,trust:6,respect:2},'Kendi yolunu izlemesi için mal ve emek desteği verdin.');
  }else if(id==='listen'){
   a.autonomy=clamp(a.autonomy+9);a.drive=clamp(a.drive+4);
   adjustNPC(n,{rel:5,trust:8},'Hedeflerini kendi sözleriyle anlatmasına fırsat verdin.');
  }else if(id==='pressure'){
   a.pressure=clamp(a.pressure+24);a.drive=clamp(a.drive+(n.traits?.includes('caliskan')?3:1));
   a.autonomy=clamp(a.autonomy-13);
   adjustNPC(n,{rel:-5,trust:-7,grudge:n.traits?.includes('gururlu')?6:2},
    'Kendi istediği yerine senin beklentine uymasını zorladın.');
  }else if(id==='leave'){
   a.pressure=clamp(a.pressure-20);a.autonomy=clamp(a.autonomy+10);
   adjustNPC(n,{rel:2,trust:4},'Kendi kararını alması için geri çekildin.');
  }
  a.history.unshift({year:s.year+s.age,type:id,description:'Oyuncuyla hedefi hakkında '+id+' görüşmesi yapıldı.'});
  a.history=a.history.slice(0,20);
 },'Yakınının kendi ülküsü hakkında bir ay geçirdin.');
}
function npcAspirationSummaryHtml(n){
 if(!n?.alive||n.age<12)return '';
 const a=npcAspiration(n);if(!a)return '';
 const goal=NPC_GOALS[a.goal]||'Kendi yolunu bulmak',done=a.stage===3;
 let html='<div class="memoryline"><b>Kendi ülküsü:</b> '+safeText(goal)+'<br>Aşama '+a.stage+'/3 • emek '+a.effort+'/100'+
  ' • kararlılık '+a.drive+'/100 • özgür irade '+a.autonomy+'/100'+
  (a.milestones.length?'<br>Son dönüm noktası: '+safeText(a.milestones.at(-1).title):'')+
  (a.pressure>=35?'<br>Aile baskısı: '+a.pressure+'/100':'')+
  (done?'<br>✓ Kendi yolunu tamamladı.':'')+'</div>';
 if(!done&&s.age>=12){
  html+='<div class="actions">';
  for(const [id,label] of [['listen','Dinle'],['support','Destek ol'],['pressure','Baskı yap'],['leave','Geri çekil']]){
   const issue=accessIssue({kind:'npcAspiration',npcId:n.id,id});
   html+='<button class="mini" '+(issue?'disabled title="'+safeText(issue)+'"':'')+' onclick="npcAspirationAction('+JSON.stringify(n.id)+','+JSON.stringify(id)+')">'+label+'</button>';
  }
  html+='</div>';
 }
 return html;
}
function npcAspirationLegacyRecord(n){
 const a=npcAspiration(n,false);if(!a)return null;
 return {npcId:n.id,name:n.name,goal:a.goal,stage:a.stage,status:a.status,
  milestones:a.milestones.map(x=>({...x})),year:s.year+s.age};
}

function ensureNPCWorld(){
 s.npcWorld=s.npcWorld&&typeof s.npcWorld==='object'&&!Array.isArray(s.npcWorld)?s.npcWorld:{};
 const w=s.npcWorld;w.total=Math.max(0,Math.round(w.total||0));w.counts=w.counts&&typeof w.counts==='object'&&!Array.isArray(w.counts)?w.counts:{};
 for(const k of ['illness','captivity','exile','migration','recovery','return','aspiration'])w.counts[k]=Math.max(0,Math.round(w.counts[k]||0));
 w.history=Array.isArray(w.history)?w.history.slice(0,80):[];return w;
}
function normalizeNPCLifeState(n){
 if(!n)return null;n.lifeState=n.lifeState&&typeof n.lifeState==='object'&&!Array.isArray(n.lifeState)?n.lifeState:{};
 const l=n.lifeState;l.status=['normal','ill','captive','exiled'].includes(l.status)?l.status:'normal';l.startedYear=Number.isFinite(l.startedYear)?l.startedYear:null;l.remainingYears=Math.max(0,Math.round(l.remainingYears||0));
 l.severity=Math.max(0,Math.min(3,Math.round(l.severity||0)));l.source=l.source||'';l.originPlace=l.originPlace||null;l.originRealm=l.originRealm||null;l.releaseSupport=clamp(Number.isFinite(l.releaseSupport)?l.releaseSupport:0);l.returnSupport=clamp(Number.isFinite(l.returnSupport)?l.returnSupport:0);l.aid=Math.max(0,Math.round(l.aid||0));l.history=Array.isArray(l.history)?l.history.slice(0,30):[];
 if(l.status==='normal'){l.remainingYears=0;l.severity=0;l.source='';}
 return l;
}
function npcLifeStatusLabel(n){
 const l=normalizeNPCLifeState(n);return l.status==='ill'?'🤒 Hasta':l.status==='captive'?'⛓ Tutsak':l.status==='exiled'?'↗ Sürgünde':'✓ Kendi hayatında';
}
function npcLifeStatusDetail(n){
 const l=normalizeNPCLifeState(n);if(l.status==='normal')return n.place&&n.place!==s.place?'Başka bölgede yaşıyor':'';
 const left=l.remainingYears?(' • yaklaşık '+l.remainingYears+' yıl'):'';
 if(l.status==='ill')return 'Sağlığı '+n.health+'/100'+left;
 if(l.status==='captive')return 'Serbest kalma desteği '+l.releaseSupport+'/100'+left;
 if(l.status==='exiled')return safeText(n.place||'başka bölge')+' • dönüş desteği '+l.returnSupport+'/100'+left;
 return '';
}
function npcWorldRelevant(n){
 if(!n?.alive)return false;
 if(s.age<18&&s.guardianship?.active&&s.guardianship.guardianId===n.id)return false;
 const pools=[...s.parents,...s.siblings,...s.children,...(s.relatives||[]),...(s.familyBranches?.childInLaws||[]),...s.friends,...s.rivals,...(s.careerContacts||[]),...(s.military?.comrades||[]),...(s.workplace?.contacts||[]),...(s.partner?[s.partner]:[])];
 return pools.some(x=>x?.id===n.id)&&!n.statusFlags?.crimeVictim&&!n.statusFlags?.crimeWitness;
}
function npcWorldIsClose(n){
 return !!n&&([...(s.partner?[s.partner]:[]),...s.parents,...s.siblings,...s.children,...s.friends].some(x=>x?.id===n.id)||(n.rel||0)>=78);
}
function npcWorldRecord(n,type,note,importance=''){
 if(!n)return;const w=ensureNPCWorld(),l=normalizeNPCLifeState(n),row={year:s.year+s.age,age:s.age,npcId:n.id,name:n.name,type,note:String(note),status:l.status,place:n.place||''};
 l.history.unshift(row);l.history=l.history.slice(0,30);w.history.unshift(row);w.history=w.history.slice(0,80);w.total++;if(w.counts[type]!=null)w.counts[type]++;
 rememberNPC(n,'life',note,importance==='major'?7:importance==='bad'?6:4);
 if(npcWorldIsClose(n))log(safeText(n.name)+': '+safeText(note),importance||'');
 return row;
}
function npcLifeBlocksNormalInteraction(n){const st=normalizeNPCLifeState(n)?.status;return st==='ill'||st==='captive'||st==='exiled';}
function npcNormalInteractionIssue(n){
 if(!n?.alive)return 'Bu kişiyle görüşemezsin.';const st=normalizeNPCLifeState(n).status;
 if(st==='ill')return 'Şu anda hasta; normal etkileşim yerine ziyaret veya bakım eylemlerini kullan.';
 if(st==='captive')return 'Şu anda tutsak; normal etkileşim yerine haber veya fidye desteği kullan.';
 if(st==='exiled')return 'Şu anda sürgünde; normal etkileşim yerine haber, destek veya dönüş için arabuluculuk kullan.';
 return '';
}
function npcAvailableForOrdinaryEvent(n){return !!n?.alive&&!npcLifeBlocksNormalInteraction(n);}
function npcWorldReturnHome(n,reason='geri döndü'){
 const l=normalizeNPCLifeState(n);if(l.originRealm)n.realm=l.originRealm;if(l.originPlace)n.place=l.originPlace;l.status='normal';l.remainingYears=0;l.severity=0;l.source='';l.releaseSupport=0;l.returnSupport=0;l.aid=0;
 npcWorldRecord(n,'return',reason,'good');ensureNPCWorld().counts.recovery++;return n;
}
function npcWorldRecover(n,reason='sağlığı toparlandı'){
 const l=normalizeNPCLifeState(n);l.status='normal';l.remainingYears=0;l.severity=0;l.source='';l.releaseSupport=0;l.returnSupport=0;l.aid=0;n.health=clamp(n.health+rng(2,7));
 const care=caregivingRecord(n,false);if(care){care.status='recovered';care.strain=clamp(care.strain-8);}
 npcWorldRecord(n,'recovery',reason,'good');return n;
}
function npcWorldTrigger(n,kind,opt={}){
 if(!n?.alive)return false;const l=normalizeNPCLifeState(n);if(l.status!=='normal'&&kind!=='migration')return false;const year=s.year+s.age;
 if(kind==='illness'){
  l.status='ill';l.startedYear=year;l.remainingYears=opt.years??rng(1,2);l.severity=opt.severity??rng(1,3);l.source=opt.source||'ani rahatsızlık';n.health=clamp(n.health-(3+l.severity*2));npcWorldRecord(n,'illness','Bir rahatsızlık yüzünden günlük hayatından çekildi.','bad');return true;
 }
 if(kind==='captivity'){
  if(n.age<16)return false;l.status='captive';l.startedYear=year;l.remainingYears=opt.years??rng(1,3);l.source=opt.source||'yol veya çatışma sırasında tutsaklık';l.originPlace=n.place;l.originRealm=n.realm;l.releaseSupport=0;l.aid=0;n.health=clamp(n.health-rng(2,6));npcWorldRecord(n,'captivity','Yolculuk veya çatışma sırasında tutsak düştü.','bad');return true;
 }
 if(kind==='exile'){
  if(n.age<18)return false;const places=(D.realms[n.realm]?.places||[]).filter(p=>p!==n.place),old=n.place;l.status='exiled';l.startedYear=year;l.remainingYears=opt.years??rng(2,4);l.source=opt.source||'töre ve oba anlaşmazlığı';l.originPlace=old;l.originRealm=n.realm;l.returnSupport=0;l.aid=0;if(places.length)n.place=opt.place||pick(places);npcWorldRecord(n,'exile','Bir anlaşmazlık ardından '+safeText(n.place)+' çevresine sürgün edildi.','bad');return true;
 }
 if(kind==='migration'){
  if(n.age<16)return false;const places=(D.realms[n.realm]?.places||[]).filter(p=>p!==n.place);if(!places.length)return false;const old=n.place;n.place=opt.place||pick(places);npcWorldRecord(n,'migration',safeText(old)+' çevresinden '+safeText(n.place)+' çevresine göç etti.','major');return true;
 }
 return false;
}
function npcWorldYearTick(n,year=s.year+s.age){
 if(!npcWorldRelevant(n))return;const l=normalizeNPCLifeState(n);
 if(l.status==='ill'){
  l.remainingYears=Math.max(0,l.remainingYears-1);n.health=clamp(n.health-rng(0,3));const healChance=.24+(l.aid||0)*.04+(n.health||0)/300;
  if(l.remainingYears<=0||Math.random()<healChance)npcWorldRecover(n,'Hastalığının ardından yeniden günlük hayatına döndü.');return;
 }
 if(l.status==='captive'){
  l.remainingYears=Math.max(0,l.remainingYears-1);n.health=clamp(n.health-rng(1,4));const chance=.12+l.releaseSupport/180+l.aid*.025;
  if(l.remainingYears<=0||Math.random()<chance)npcWorldReturnHome(n,'Tutsaklıktan kurtulup geri döndü.');return;
 }
 if(l.status==='exiled'){
  l.remainingYears=Math.max(0,l.remainingYears-1);const chance=.08+l.returnSupport/180+l.aid*.02;
  if(Math.random()<chance){npcWorldReturnHome(n,'Arabuluculuk ve zamanın geçmesiyle sürgünden döndü.');return;}
  if(l.remainingYears<=0){
   if(Math.random()<.58+l.returnSupport/250)npcWorldReturnHome(n,'Sürgün yıllarından sonra eski yurduna döndü.');
   else{l.status='normal';l.remainingYears=0;l.source='';l.originPlace=null;l.originRealm=null;npcWorldRecord(n,'return','Sürgün hükmü bitti; fakat yeni yerleşiminde kalmayı seçti.','major');}
  }
  return;
 }
 const age=n.age||0,ill=.025+(age>=50?.045:0)+(n.health<55?.035:0),cap=age>=16?((['Alp','Akıncı','Tarkan'].includes(n.role)||n.goal==='war')?.022:.005):0,ex=age>=18?((n.prestige>=45||n.traits?.includes('hirsli'))?.012:.003):0,mig=age>=16?.028:0;
 const roll=Math.random();if(roll<ill){npcWorldTrigger(n,'illness');return;}if(roll<ill+cap){npcWorldTrigger(n,'captivity');return;}if(roll<ill+cap+ex){npcWorldTrigger(n,'exile');return;}if(roll<ill+cap+ex+mig)npcWorldTrigger(n,'migration');
}
function npcLifeActionIssue(n,id){
 if(!n?.alive)return 'Bu kişi artık hayatta değil.';const l=normalizeNPCLifeState(n);if(l.status==='normal')return 'Bu kişinin özel bir hayat durumu yok.';
 if(l.status==='ill'){if(!['visit','care','healer','farewell'].includes(id))return 'Bu hastalık durumunda bu eylem kullanılamaz.';if(id==='healer'&&s.wealth<3)return 'Otacı ve bakım için 3 servet gerekiyor.';if(id==='farewell'&&!(npcWorldIsClose(n)&&(l.severity>=2||n.health<55||l.remainingYears<=1)))return 'Böyle ağır bir vedalaşma konuşması için durum henüz uygun değil.';}
 else if(l.status==='captive'){if(!['message','ransom'].includes(id))return 'Tutsaklıkta yalnız haber ve fidye desteği kullanılabilir.';if(id==='ransom'&&s.wealth<5)return 'Fidye desteği için 5 servet gerekiyor.';}
 else if(l.status==='exiled'){if(!['message','aid','appeal'].includes(id))return 'Sürgünde haber, destek veya arabuluculuk kullanılabilir.';if(id==='aid'&&s.wealth<3)return 'Destek için 3 servet gerekiyor.';}
 return s.age<5?'5 yaşında açılır.':'';
}
function npcLifeAction(npcId,id){
 const n=npcById(npcId);const issue=npcLifeActionIssue(n,id);if(issue){notice(issue);return false;}
 return performAction({kind:'npcLife',npcId,id},()=>{
  const l=normalizeNPCLifeState(n);
  if(l.status==='ill'){
   if(id==='visit'){l.aid++;recordCaregiving(n,'visit');adjustNPC(n,{rel:5,trust:5},'Hastalığında ziyaret edip yanında kaldın.');n.health=clamp(n.health+2);apply({happiness:2});}
   else if(id==='care'){l.aid+=2;recordCaregiving(n,'care');n.health=clamp(n.health+4);adjustNPC(n,{rel:6,trust:8,respect:3},'Günlük bakımını doğrudan üstlendin.');if(n.health>=84&&Math.random()<.45)npcWorldRecover(n,'Yakın bakımı sayesinde sağlığı toparlandı.');}
   else if(id==='healer'){s.wealth-=3;l.aid+=2;recordCaregiving(n,'healer');l.remainingYears=Math.max(0,l.remainingYears-1);n.health=clamp(n.health+8);adjustNPC(n,{rel:4,trust:7},'Otacı ve bakım için destek oldun.');if(l.remainingYears<=0||n.health>=82)npcWorldRecover(n,'Bakım ve otacı desteğiyle sağlığı toparlandı.');}
   else if(id==='farewell'){recordCaregiving(n,'farewell');adjustNPC(n,{rel:7,trust:9,respect:3},'Söylemek istediklerinizi açıkça konuştunuz.');apply({happiness:1});rememberNPC(n,'care','Zor ihtimalleri ve söylenmemiş sözleri birlikte konuştunuz.',8);}
  }else if(l.status==='captive'){
   if(id==='message'){l.releaseSupport=clamp(l.releaseSupport+10);adjustNPC(n,{rel:3,trust:6},'Tutsaklığında ona haber ulaştırdın.');}
   else if(id==='ransom'){s.wealth-=5;l.aid++;l.releaseSupport=clamp(l.releaseSupport+36);adjustNPC(n,{rel:6,trust:8,respect:4},'Serbest kalması için mal ve arabulucu desteği gönderdin.');if(l.releaseSupport>=70)npcWorldReturnHome(n,'Yakınlarının fidye ve arabuluculuk desteğiyle tutsaklıktan çıktı.');}
  }else if(l.status==='exiled'){
   if(id==='message'){l.returnSupport=clamp(l.returnSupport+8);adjustNPC(n,{rel:3,trust:5},'Sürgünde bağınızı koparmayıp haber gönderdin.');}
   else if(id==='aid'){s.wealth-=3;l.aid++;l.returnSupport=clamp(l.returnSupport+12);n.wealth+=3;adjustNPC(n,{rel:6,trust:7},'Sürgündeki hayatına mal desteği gönderdin.');}
   else if(id==='appeal'){const gain=Math.max(10,Math.round((s.skills.speech||0)/5+(s.prestige||0)/8));l.returnSupport=clamp(l.returnSupport+gain);adjustNPC(n,{rel:4,trust:6,respect:5},'Dönüşü için oba çevresinde arabuluculuk yaptın.');if(l.returnSupport>=65)npcWorldReturnHome(n,'Arabuluculuk sayesinde sürgün hükmü yumuşadı ve geri döndü.');}
  }
 },safeText(n.name)+' için onun mevcut hayat durumuyla ilgilendin.');
}
function npcLifeActionsHtml(n){
 const l=normalizeNPCLifeState(n);if(!n.alive||l.status==='normal'||s.age<5)return '';
 const defs=l.status==='ill'?[['visit','Ziyaret et'],['care','Bakımı üstlen'],['healer','Otacı getir'],['farewell','Söylemek istediklerini konuş']]:l.status==='captive'?[['message','Haber gönder'],['ransom','Fidye desteği']]:[['message','Haber gönder'],['aid','Mal desteği'],['appeal','Dönüş için arabulucu ol']];
 return defs.map(([id,label])=>{const issue=npcLifeActionIssue(n,id);return '<button class="mini" '+(issue?'disabled':'')+' title="'+safeText(issue)+'" onclick=\'npcLifeAction('+JSON.stringify(n.id)+','+JSON.stringify(id)+')\'>'+label+'</button>';}).join('');
}
function npcWorldSummaryHtml(){
 const w=ensureNPCWorld(),active=allNPCs().filter(n=>n.alive&&npcWorldRelevant(n)&&normalizeNPCLifeState(n).status!=='normal').sort((a,b)=>(b.rel||0)-(a.rel||0)),recent=w.history.slice(0,4);
 let html='<div class="card"><h3>🌍 Yaşayan Dünya</h3><p>'+w.total+' bağımsız NPC hayat olayı • hastalık '+w.counts.illness+' • tutsaklık '+w.counts.captivity+' • sürgün '+w.counts.exile+' • göç '+w.counts.migration+' • ülkü dönüm noktası '+w.counts.aspiration+'</p>'+(recent.length?'<div class="memoryline">'+recent.map(x=>safeText(x.name)+' — '+safeText(x.note)).join('<br>')+'</div>':'')+'</div>';
 if(active.length)html+='<div class="grid2">'+active.slice(0,8).map(n=>'<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(npcLifeStatusLabel(n))+'<br>'+npcLifeStatusDetail(n)+'</p><div class="actions">'+npcLifeActionsHtml(n)+'</div></div>').join('')+'</div>';
 return html;
}


function ensureBereavement(){
 if(!s.bereavement||typeof s.bereavement!=='object'||Array.isArray(s.bereavement))s.bereavement={};
 const b=s.bereavement;
 b.losses=Array.isArray(b.losses)?b.losses.slice(0,60):[];
 b.grief=b.grief&&typeof b.grief==='object'&&!Array.isArray(b.grief)?b.grief:{};
 b.caregiving=b.caregiving&&typeof b.caregiving==='object'&&!Array.isArray(b.caregiving)?b.caregiving:{};
 b.funeralCount=Math.max(0,Math.round(b.funeralCount||0));
 b.missedFunerals=Math.max(0,Math.round(b.missedFunerals||0));
 b.memorials=Math.max(0,Math.round(b.memorials||0));
 b.careMonths=Math.max(0,Math.round(b.careMonths||0));
 b.history=Array.isArray(b.history)?b.history.slice(0,80):[];
 for(const loss of b.losses){
  loss.funeral=loss.funeral&&typeof loss.funeral==='object'?loss.funeral:{status:'closed'};
  loss.funeral.status=loss.funeral.status||'closed';
  loss.funeral.travelCost=Math.max(0,Math.round(loss.funeral.travelCost||0));
  loss.memorials=Math.max(0,Math.round(loss.memorials||0));
 }
 for(const [id,g0] of Object.entries(b.grief)){
  const g=g0&&typeof g0==='object'?g0:{};
  g.npcId=g.npcId||id;g.intensity=clamp(Number.isFinite(g.intensity)?g.intensity:0);g.monthsLeft=Math.max(0,Math.round(g.monthsLeft||0));
  g.closure=clamp(Number.isFinite(g.closure)?g.closure:0);g.resolved=!!g.resolved;g.lastMemorialYear=Number.isFinite(g.lastMemorialYear)?g.lastMemorialYear:null;b.grief[id]=g;
 }
 for(const [id,r0] of Object.entries(b.caregiving)){
  const r=r0&&typeof r0==='object'?r0:{};
  r.npcId=r.npcId||id;r.months=Math.max(0,Math.round(r.months||0));r.healer=Math.max(0,Math.round(r.healer||0));r.farewells=Math.max(0,Math.round(r.farewells||0));
  r.closure=clamp(Number.isFinite(r.closure)?r.closure:0);r.strain=clamp(Number.isFinite(r.strain)?r.strain:0);r.status=r.status||'active';b.caregiving[id]=r;
 }
 return b;
}
function lifeSerial(year=s.year+s.age,month=currentMonth()){return Math.round(year)*12+Math.max(1,Math.min(12,Math.round(month||1)));}
function funeralTravelCost(n){if(!n)return 0;if(n.realm&&n.realm!==s.realm)return 4;if(n.place&&n.place!==s.place)return 2;return 0;}
function deathCloseness(n){
 if(!n)return 0;const role=kinRole(n);let v=Math.round((n.rel||50)*.42+(n.bonds?.trust||50)*.18);
 if(n.id===s.partner?.id||role==='Eş')v+=48;
 else if(['Ata','Ana','Çocuk'].includes(role))v+=42;
 else if(['Erkek kardeş','Kız kardeş'].includes(role))v+=34;
 else if(['Dede','Nine','Torun'].includes(role))v+=25;
 else if(s.friends.some(x=>x.id===n.id))v+=26;
 else if(s.military?.comrades?.some(x=>x.id===n.id))v+=18;
 else if((s.relatives||[]).some(x=>x.id===n.id))v+=15;
 if(s.rivals.some(x=>x.id===n.id))v-=30;if((n.bonds?.grudge||0)>55)v-=12;return clamp(v);
}
function caregivingRecord(n,create=true){
 if(!n)return null;const b=ensureBereavement();
 if(!b.caregiving[n.id]&&create)b.caregiving[n.id]={npcId:n.id,name:n.name,months:0,healer:0,farewells:0,closure:0,strain:0,status:'active',startedYear:s.year+s.age,lastYear:s.year+s.age};
 return b.caregiving[n.id]||null;
}
function recordCaregiving(n,kind='visit'){
 const r=caregivingRecord(n,true),b=ensureBereavement();if(!r)return null;r.status='active';r.lastYear=s.year+s.age;
 if(kind==='visit'){r.closure=clamp(r.closure+2);r.strain=clamp(r.strain+1);}
 if(kind==='care'){r.months++;b.careMonths++;r.closure=clamp(r.closure+4);r.strain=clamp(r.strain+5);if(r.months%3===0)apply({happiness:-1,health:-1});}
 if(kind==='healer'){r.healer++;r.closure=clamp(r.closure+3);r.strain=clamp(r.strain+2);}
 if(kind==='farewell'){r.farewells++;r.closure=clamp(r.closure+12);r.strain=clamp(r.strain+1);}
 return r;
}
function bereavementLossById(id){return ensureBereavement().losses.find(x=>x.id===id)||null;}
function activeGriefRecords(){return Object.values(ensureBereavement().grief).filter(g=>!g.resolved&&g.monthsLeft>0&&g.intensity>8).sort((a,b)=>b.intensity-a.intensity);}
function strongestGrief(){return activeGriefRecords()[0]||null;}
function griefCompanion(loss){
 const dead=npcById(loss?.npcId);if(!dead)return null;
 const living=[...s.parents,...s.siblings,...s.children,...(s.relatives||[]),...s.friends].filter(n=>n?.alive&&n.id!==dead.id);
 const connected=living.filter(n=>closeKinPair(n,dead)||n.partner?.id===dead.id||dead.partner?.id===n.id||Math.abs(socialLinkBetween(n,dead)?.score||0)>=35);
 return connected.sort((a,b)=>(b.rel||0)-(a.rel||0))[0]||living.sort((a,b)=>(b.rel||0)-(a.rel||0))[0]||null;
}
function rippleFamilyGrief(dead,intensity){
 if(!dead)return;
 for(const n of allNPCs().filter(x=>x?.alive&&x.id!==dead.id)){
  const linked=closeKinPair(n,dead)||n.partner?.id===dead.id||dead.partner?.id===n.id||(socialLinkBetween(n,dead)?.score||0)>=50;if(!linked)continue;
  n.statusFlags=n.statusFlags||{};n.statusFlags.griefFor=dead.id;n.statusFlags.griefUntil=s.year+s.age+1;rememberNPC(n,'loss',dead.name+' kaybının yasını taşıyor.',Math.max(3,Math.round(intensity/18)));
 }
}
function npcDeathCauseLabel(n){
 const l=n?normalizeNPCLifeState(n):null;if(l?.status==='ill')return l.source?('rahatsızlık: '+l.source):'uzun süren rahatsızlık';
 if((n?.age||0)>=72)return 'ileri yaş';if((n?.health||100)<35)return 'zayıflayan sağlık';return 'ani yaşam sonu';
}
function registerNPCDeath(n,cause='',opt={}){
 if(!n)return null;n.statusFlags=n.statusFlags||{};const b=ensureBereavement();
 if(n.statusFlags.deathRegistered)return b.losses.find(x=>x.npcId===n.id)||null;
 const closeness=deathCloseness(n),care=caregivingRecord(n,false),closure=care?.closure||0,initial=clamp(Math.max(0,closeness-Math.round(closure*.45))),month=currentMonth(),year=s.year+s.age,serial=lifeSerial(year,month);
 n.alive=false;n.health=0;n.statusFlags.deathRegistered=true;n.statusFlags.deathYear=year;n.statusFlags.deathCause=cause||npcDeathCauseLabel(n);rememberNPC(n,'death','Yaşamı sona erdi: '+n.statusFlags.deathCause+'.',10);
 if(care)care.status='deceased';if(opt.inherit!==false)maybeExtendedInheritance(n);
 let loss=null;
 if(closeness>=25){
  loss={id:'loss_'+n.id+'_'+year+'_'+month,npcId:n.id,name:n.name,kin:kinRole(n),year,month,cause:n.statusFlags.deathCause,place:n.place||'',realm:n.realm||'',closeness,memorials:0,funeral:{status:'pending',travelCost:funeralTravelCost(n),deadlineSerial:serial+3,attendedYear:null,attendedMonth:null}};
  b.losses.unshift(loss);b.losses=b.losses.slice(0,60);
  b.grief[n.id]={npcId:n.id,lossId:loss.id,name:n.name,intensity:initial,initialIntensity:initial,monthsLeft:Math.max(3,Math.ceil(initial/7)),closure,funeralStatus:'pending',resolved:initial<=8,lastMemorialYear:null};
  const hit=initial>=80?5:initial>=60?4:initial>=40?2:initial>=25?1:0;if(hit)apply({happiness:-hit});
  rippleFamilyGrief(n,initial);b.history.unshift({year,month,type:'loss',npcId:n.id,name:n.name,cause:n.statusFlags.deathCause,intensity:initial});b.history=b.history.slice(0,80);
 }
 if(n===s.partner){s.married=false;s.pregnancy=null;}
 if(opt.logDeath!==false)log(safeText(n.name)+' yaşamını yitirdi'+(cause?': '+safeText(cause):'')+'.','bad');
 return loss;
}
function bereavementActionIssue(lossId,id){
 const loss=bereavementLossById(lossId);if(!loss)return 'Kayıp kaydı bulunamadı.';const g=ensureBereavement().grief[loss.npcId],now=lifeSerial();
 if(id==='attend'){if(loss.funeral.status!=='pending')return 'Bu cenaze kararı artık kapandı.';if(now>loss.funeral.deadlineSerial)return 'Cenaze için zaman geçti.';if(s.wealth<loss.funeral.travelCost)return loss.funeral.travelCost+' servet yol masrafı gerekiyor.';}
 else if(id==='lament'){if(loss.funeral.status!=='pending'||now>loss.funeral.deadlineSerial)return 'Bu veda kararı artık kapandı.';}
 else if(id==='memorial'){if(!g||g.lastMemorialYear===s.year+s.age)return 'Bu yıl onun hatırası için zaten özel zaman ayırdın.';}
 else if(id==='share'){if(!g||g.resolved)return 'Aktif bir yas yükü kalmadı.';if(!griefCompanion(loss))return 'Bu kaybı paylaşacağın yaşayan bir yakın yok.';}
 else return 'Yas eylemi bulunamadı.';return '';
}
function bereavementAction(lossId,id){
 const issue=bereavementActionIssue(lossId,id);if(issue){notice(issue);return false;}
 const loss=bereavementLossById(lossId),b=ensureBereavement(),g=b.grief[loss.npcId],dead=npcById(loss.npcId);
 return performAction({kind:'grief',id,lossId},()=>{
  if(id==='attend'){
   const cost=loss.funeral.travelCost;s.wealth-=cost;loss.funeral.status='attended';loss.funeral.attendedYear=s.year+s.age;loss.funeral.attendedMonth=currentMonth();b.funeralCount++;
   if(g){g.funeralStatus='attended';g.intensity=clamp(g.intensity-22);g.monthsLeft=Math.max(1,g.monthsLeft-3);g.closure=clamp(g.closure+22);}apply({happiness:2,prestige:1});
   const companion=griefCompanion(loss);if(companion)adjustNPC(companion,{rel:3,trust:4,grudge:-2},(dead?.name||loss.name)+' için düzenlenen cenazede birlikteydiniz.');
   log(safeText(loss.name)+' için cenazeye katıldın'+(cost?' ve yol için '+cost+' servet harcadın':'')+'.','major');
  }else if(id==='lament'){
   loss.funeral.status='remote_farewell';if(g){g.funeralStatus='remote_farewell';g.intensity=clamp(g.intensity-10);g.monthsLeft=Math.max(1,g.monthsLeft-1);g.closure=clamp(g.closure+10);}apply({happiness:1});log(safeText(loss.name)+' için uzaktan ağıt ve veda zamanı ayırdın.','major');
  }else if(id==='memorial'){
   loss.memorials++;b.memorials++;g.lastMemorialYear=s.year+s.age;g.intensity=clamp(g.intensity-12);g.monthsLeft=Math.max(1,g.monthsLeft-1);g.closure=clamp(g.closure+8);apply({happiness:3,prestige:1});log(safeText(loss.name)+' adına bir hatıra günü ayırdın.','major');
  }else if(id==='share'){
   const n=griefCompanion(loss);if(n){adjustNPC(n,{rel:6,trust:7,grudge:-4},loss.name+' kaybını birlikte konuştunuz.');g.intensity=clamp(g.intensity-8);g.closure=clamp(g.closure+5);apply({happiness:2});log(safeText(n.name)+' ile '+safeText(loss.name)+' hakkında konuştun.','good');}
  }
 },safeText(loss.name)+' kaybıyla ilgili bir ay geçirdin.');
}
function bereavementMonthTick(month,action={}){
 const b=ensureBereavement(),now=lifeSerial(s.year+s.age,month);
 for(const loss of b.losses){
  if(loss.funeral?.status==='pending'&&now>loss.funeral.deadlineSerial){
   loss.funeral.status='missed';b.missedFunerals++;const g=b.grief[loss.npcId];
   if(g&&!g.resolved){g.funeralStatus='missed';g.intensity=clamp(g.intensity+6);g.monthsLeft+=2;if(g.intensity>=55)apply({happiness:-2});}
   log(safeText(loss.name)+' için cenaze zamanı geçti; törene katılamadın.','bad');
  }
 }
 for(const g of Object.values(b.grief)){
  if(g.resolved||g.monthsLeft<=0)continue;
  if(!(action.kind==='grief'&&action.lossId===g.lossId)){if(month%3===0&&g.intensity>=65)apply({happiness:-1});g.intensity=clamp(g.intensity-(g.funeralStatus==='attended'?2:1));g.monthsLeft=Math.max(0,g.monthsLeft-1);}
  if(g.monthsLeft<=0||g.intensity<=8){g.resolved=true;g.intensity=Math.max(0,g.intensity);}
 }
 for(const r of Object.values(b.caregiving))if(r.status==='active'&&r.lastYear<(s.year+s.age))r.strain=clamp(r.strain-2);
}
function caregiverStrain(){return Math.max(0,...Object.values(ensureBereavement().caregiving).filter(r=>r.status==='active').map(r=>r.strain||0));}
function applyBereavementEffect(target,spec={}){
 const b=ensureBereavement();
 if(spec.grief){const g=strongestGrief();if(g)g.intensity=clamp(g.intensity+spec.grief);}
 if(spec.strain){const rows=Object.values(b.caregiving).filter(r=>r.status==='active').sort((a,b)=>(b.strain||0)-(a.strain||0));if(rows[0])rows[0].strain=clamp(rows[0].strain+spec.strain);}
}
function bereavementSummaryHtml(){
 const b=ensureBereavement(),now=lifeSerial(),pending=b.losses.filter(x=>x.funeral?.status==='pending'&&now<=x.funeral.deadlineSerial),griefs=activeGriefRecords();
 const care=Object.values(b.caregiving).filter(r=>r.status==='active'&&npcById(r.npcId)?.alive&&normalizeNPCLifeState(npcById(r.npcId)).status==='ill').sort((a,b)=>(b.strain||0)-(a.strain||0));
 if(!pending.length&&!griefs.length&&!care.length&&!b.losses.length)return '';
 let html='<div class="card"><h3>🕯 Yas, Cenaze ve Bakım</h3><p>Cenazeye katılım '+b.funeralCount+' • kaçırılan '+b.missedFunerals+' • hatıra günü '+b.memorials+' • bakım ayı '+b.careMonths+(caregiverStrain()>=25?'<br>Bakım yükü şu anda ağırlaşıyor.':'')+'</p></div>';
 if(pending.length)html+='<div class="grid2">'+pending.slice(0,6).map(loss=>{
  const g=b.grief[loss.npcId],cost=loss.funeral.travelCost,remote=cost?(' • yol '+cost+' servet'):' • aynı bölgede';
  const attendCall="bereavementAction('"+loss.id+"','attend')",lamentCall="bereavementAction('"+loss.id+"','lament')";
  return '<div class="card"><h3>⚱ '+safeText(loss.name)+'</h3><p>'+safeText(loss.kin)+' • '+safeText(loss.cause)+remote+'<br>Yas '+(g?.intensity||0)+'/100 • cenaze için sınırlı zaman</p><div class="actions">'+actionButton('Cenazeye katıl',{kind:'grief',id:'attend',lossId:loss.id},attendCall,cost?cost+' servet yol masrafı • göç etmeden gidip dönersin.':'Törene katılıp yakınlarla vedalaş.')+actionButton('Uzaktan veda et',{kind:'grief',id:'lament',lossId:loss.id},lamentCall,'Yolculuk yapmadan ağıt ve veda ile kaybı işle.')+'</div></div>';
 }).join('')+'</div>';
 if(griefs.length)html+='<div class="grid2">'+griefs.slice(0,6).map(g=>{
  const loss=bereavementLossById(g.lossId),memCall="bereavementAction('"+g.lossId+"','memorial')",shareCall="bereavementAction('"+g.lossId+"','share')";
  const status=loss?.funeral?.status==='attended'?'cenazesine katıldın':loss?.funeral?.status==='remote_farewell'?'uzaktan vedalaştın':loss?.funeral?.status==='missed'?'cenazeyi kaçırdın':'cenaze kararı açık';
  return '<div class="card"><h3>🌑 '+safeText(g.name)+'</h3><p>Yas yoğunluğu '+g.intensity+'/100 • yaklaşık '+g.monthsLeft+' ay etkisi<br>Kapanış '+g.closure+'/100 • '+safeText(status)+'</p><div class="actions">'+actionButton('Hatırasını yaşat',{kind:'grief',id:'memorial',lossId:g.lossId},memCall,'Yası azaltır ve aile hatırasına kalıcı bir kayıt ekler.')+actionButton('Yakınınla konuş',{kind:'grief',id:'share',lossId:g.lossId},shareCall,'Kaybı tek başına taşımak yerine yaşayan bir yakınla paylaş.')+'</div></div>';
 }).join('')+'</div>';
 if(care.length)html+='<div class="card"><h3>🤲 Süren Bakım Yükü</h3><p>'+care.slice(0,5).map(r=>safeText(r.name)+' — '+r.months+' ay doğrudan bakım • yük '+r.strain+'/100 • vedalaşma/kapanış '+r.closure+'/100').join('<br>')+'</p></div>';
 return html;
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

const WORKPLACE_RANKS=['Yeni','Yetkin','Kıdemli','Baş'];
function ensureWorkplace(){
 if(!s.workplace||typeof s.workplace!=='object'||Array.isArray(s.workplace))s.workplace={};
 const w=s.workplace;
 w.contacts=Array.isArray(w.contacts)?w.contacts:[];w.history=Array.isArray(w.history)?w.history.slice(-80):[];
 w.formerCircles=Array.isArray(w.formerCircles)?w.formerCircles.slice(-20):[];w.roleId=w.roleId||null;w.roleName=w.roleName||null;
 w.standing=clamp(Number.isFinite(w.standing)?w.standing:20);w.cohesion=clamp(Number.isFinite(w.cohesion)?w.cohesion:55);w.conflict=clamp(Number.isFinite(w.conflict)?w.conflict:5);
 w.months=Math.max(0,Math.round(w.months||0));w.rank=Math.max(0,Math.min(3,Math.round(w.rank||0)));w.projects=Math.max(0,Math.round(w.projects||0));
 w.projectProgress=clamp(Number.isFinite(w.projectProgress)?w.projectProgress:0);w.sponsorUntil=Math.max(0,Math.round(w.sponsorUntil||0));w.sponsorId=w.sponsorId||null;
 w.contacts=w.contacts.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Görev Yoldaşı'));
 return w;
}
function workplaceRoleLabels(r){
 const path=r?.path||'civil';
 const map={
  civil:['Oba Sorumlusu','Görev Yoldaşı','Genç Yardımcı'],
  craft:['Kıdemli Usta','Zanaat Yoldaşı','Çırak'],
  culture:['Baş Ozan','Söz Yoldaşı','Genç Ozan'],
  trade:['Kervan / Pazar Kıdemlisi','Ticaret Yoldaşı','Genç Tüccar'],
  state:['Meclis Kıdemlisi','Görev Yoldaşı','Yazı Yardımcısı'],
  military:['Birlik Başı','Sefer Görevlisi','Genç Alp']
 };
 return map[path]||map.civil;
}
function workplaceContactById(id){return ensureWorkplace().contacts.find(n=>n.id===id)||allNPCs().find(n=>n.id===id)||null;}
function currentWorkplaceContacts(){const w=ensureWorkplace(),seen=new Set();return w.contacts.filter(n=>n?.alive&&n.statusFlags?.workplaceRoleId===w.roleId&&!n.statusFlags?.formerWorkplace&&!seen.has(n.id)&&seen.add(n.id));}
function workplaceSupervisor(){return currentWorkplaceContacts().find(n=>n.statusFlags?.workplacePosition==='supervisor')||null;}
function workplacePeers(){return currentWorkplaceContacts().filter(n=>n.statusFlags?.workplacePosition==='peer');}
function workplaceJuniors(){return currentWorkplaceContacts().filter(n=>n.statusFlags?.workplacePosition==='junior');}
function workplaceMentorKind(r){
 if(!r)return null;if(['smith','smith_apprentice'].includes(r.id))return 'smith';if(['scribe','envoy','bey'].includes(r.id))return 'scribe';if(r.id==='bard')return 'bard';if(r.id==='merchant')return 'merchant';if(r.id==='caravan')return 'caravan';return null;
}
function makeWorkplaceContact(r,position,labels){
 const cfg=D.realms[s.realm],gender=pick(['male','female']),age=position==='supervisor'?Math.max(24,s.age+rng(5,18)):position==='junior'?Math.max(12,s.age-rng(3,12)):Math.max(16,s.age+rng(-6,7));
 const role=position==='supervisor'?labels[0]:position==='junior'?labels[2]:r.name,type=position==='supervisor'?labels[0]:position==='junior'?labels[2]:labels[1];
 const n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,rel:position==='supervisor'?rng(44,62):rng(50,68),type,goal:r.path==='trade'?'wealth':r.path==='military'?'war':r.path==='craft'?'mastery':r.path==='state'?'prestige':'wisdom',role,realm:s.realm,place:s.place,tribe:s.tribe,prestige:position==='supervisor'?rng(30,60):rng(8,35)},type);
 n.statusFlags.workplaceRoleId=r.id;n.statusFlags.workplacePosition=position;n.statusFlags.workplace=true;normalizeBonds(n);
 if(position==='supervisor')n.bonds.respect=Math.max(n.bonds.respect,60);
 ensureWorkplace().contacts.push(n);return n;
}
function archiveWorkplace(reason='görev değişimi'){
 const w=ensureWorkplace();if(!w.roleId)return;
 const ids=currentWorkplaceContacts().map(n=>n.id);
 if(ids.length)w.formerCircles.unshift({roleId:w.roleId,roleName:w.roleName,year:s.year+s.age,reason,contactIds:ids,standing:w.standing,rank:w.rank});
 for(const n of currentWorkplaceContacts()){n.statusFlags.formerWorkplace=true;n.statusFlags.formerWorkplaceRoleId=w.roleId;if(!n.type.startsWith('Eski '))n.type='Eski '+n.type;}
 w.formerCircles=w.formerCircles.slice(0,20);
}
function ensureWorkplaceForRole(force=false){
 const w=ensureWorkplace(),r=D.careers.find(x=>x.name===s.role);if(!r)return w;
 if(!force&&w.roleId===r.id&&currentWorkplaceContacts().length)return w;
 if(w.roleId&&w.roleId!==r.id)archiveWorkplace('görev değişimi');
 w.roleId=r.id;w.roleName=r.name;w.standing=Math.max(15,Math.min(45,careerProfile(r.id).reputation));w.cohesion=55;w.conflict=5;w.months=0;w.rank=r.id==='bey'?3:0;w.projectProgress=0;w.sponsorId=null;w.sponsorUntil=0;
 const labels=workplaceRoleLabels(r),kind=workplaceMentorKind(r);let sup=kind?careerContact(kind,false):null;
 if(sup?.alive){sup.statusFlags=sup.statusFlags||{};sup.statusFlags.workplaceRoleId=r.id;sup.statusFlags.workplacePosition='supervisor';sup.statusFlags.workplace=true;sup.statusFlags.formerWorkplace=false;if(!w.contacts.some(n=>n.id===sup.id))w.contacts.push(sup);}
 else sup=makeWorkplaceContact(r,'supervisor',labels);
 const count=r.id==='bey'?3:2;for(let i=0;i<count;i++)makeWorkplaceContact(r,'peer',labels);
 w.history.unshift({year:s.year+s.age,type:'entered',roleId:r.id,supervisorId:sup.id});return w;
}
function workplaceRankTitle(){const w=ensureWorkplace(),r=D.careers.find(x=>x.id===w.roleId);if(r?.id==='bey')return 'Boy Beyi';return WORKPLACE_RANKS[w.rank]||WORKPLACE_RANKS[0];}
function workplaceSponsorBonus(){const w=ensureWorkplace();return w.sponsorUntil>=s.year+s.age&&workplaceContactById(w.sponsorId)?.alive?.04:0;}
function workplaceWorkBonus(){
 const w=ensureWorkplace();if(!s.role||!w.roleId)return 0;
 return Math.min(.12,w.standing/1200+w.cohesion/1800-w.conflict/1500+(w.projectProgress>=70?.03:0)+workplaceSponsorBonus());
}
function workplacePromotionCheck(){
 const w=ensureWorkplace(),r=D.careers.find(x=>x.id===w.roleId);if(!r||w.rank>=3||r.id==='bey')return false;
 const p=careerProfile(r.id),sup=workplaceSupervisor(),trust=sup?.bonds?.trust||0,respect=sup?.bonds?.respect||0;
 const req=[{months:6,standing:32,rep:12,mastery:8},{months:18,standing:52,rep:30,mastery:28},{months:36,standing:72,rep:52,mastery:48}][w.rank];
 if(w.months<req.months||w.standing<req.standing||p.reputation<req.rep||p.mastery<req.mastery||trust<48||respect<52||w.conflict>65)return false;
 w.rank++;w.history.unshift({year:s.year+s.age,type:'promotion',rank:w.rank,roleId:w.roleId,supervisorId:sup?.id||null});apply({prestige:3,wealth:2,happiness:2});
 if(sup)adjustNPC(sup,{rel:3,trust:3,respect:4},'Görev çevrende daha kıdemli bir sorumluluk üstlenmeni destekledi.');
 if(w.rank>=2&&!workplaceJuniors().length)makeWorkplaceContact(r,'junior',workplaceRoleLabels(r));
 log(safeText(r.name)+' görevinde '+workplaceRankTitle()+' düzeyine yükseldin.','major');return true;
}
function workplaceAction(index,id){
 const w=ensureWorkplaceForRole(),contacts=currentWorkplaceContacts(),n=contacts[index];if(!n?.alive)return false;
 return performAction({kind:'workplace',index,id},()=>{
  const pos=n.statusFlags?.workplacePosition,b=normalizeBonds(n),r=D.careers.find(x=>x.id===w.roleId);
  if(id==='collaborate'){
   w.projectProgress=clamp(w.projectProgress+12);w.cohesion=clamp(w.cohesion+5);w.conflict=clamp(w.conflict-3);w.standing=clamp(w.standing+3);
   adjustNPC(n,{rel:5,trust:5,respect:4,grudge:-3},'Bir işi omuz omuza yürüttünüz.');adjustSocialLink(n,workplaceSupervisor()||n,{score:n===workplaceSupervisor()?0:2,trust:1,tag:'work'},'Ortak görev çevresinde birlikte çalıştılar.');apply({skill:1});
  }else if(id==='advice'){
   if(pos!=='supervisor'){notice('Bu kişi görev çevrende amir veya usta konumunda değil.');return;}
   w.standing=clamp(w.standing+2);w.cohesion=clamp(w.cohesion+2);adjustNPC(n,{rel:3,trust:4,respect:4},'Görevle ilgili öğüdünü dinledin.');skillGain(careerPrimarySkill(r),2);
  }else if(id==='sponsor'){
   if(pos!=='supervisor'){notice('Kefillik için amir veya usta gerekir.');return;}
   const chance=Math.min(.92,.15+(n.rel||0)/240+b.trust/220+b.respect/260+w.standing/500-w.conflict/600);
   if(Math.random()<chance){w.sponsorId=n.id;w.sponsorUntil=s.year+s.age+2;w.standing=clamp(w.standing+5);adjustNPC(n,{rel:4,trust:5,respect:3},'Görev çevrende sana kefil olmayı kabul etti.');log(safeText(n.name)+' iki yıl boyunca görev çevresinde sana kefil olacak.','good');}
   else{adjustNPC(n,{rel:-1,respect:-2},'Henüz sana kefil olmak için erken olduğunu söyledi.');log(safeText(n.name)+' bu kez kefil olmayı kabul etmedi.');}
  }else if(id==='compete'){
   if(pos!=='peer'){notice('Görev rekabeti akranlarla olur.');return;}
   const my=(s.skill+s.prestige+w.standing)/3,their=((n.skills?.[careerPrimarySkill(r)]||40)+(n.prestige||20)+(n.bonds?.respect||40))/3,chance=Math.max(.15,Math.min(.85,.5+(my-their)/120));
   if(Math.random()<chance){w.standing=clamp(w.standing+7);w.conflict=clamp(w.conflict+5);adjustNPC(n,{rel:-4,trust:-3,respect:6,grudge:5},'Aynı görev için rekabet ettiniz ve sen öne çıktın.');apply({prestige:2});}
   else{w.standing=clamp(w.standing-3);w.conflict=clamp(w.conflict+8);adjustNPC(n,{rel:-5,trust:-4,respect:-2,grudge:7},'Görev rekabetinde bu kez o öne çıktı.');apply({happiness:-2});}
   if((n.bonds?.grudge||0)>=35&&!s.rivals.some(x=>x.id===n.id)){n.type='Görev Rakibi';s.rivals.push(n);}
  }else if(id==='befriend'){
   adjustNPC(n,{rel:6,trust:6,respect:2,grudge:-3},'Görev dışındaki zamanlarda da görüşmeye başladınız.');
   if(n.rel>=68&&(n.bonds?.trust||0)>=60&&!s.friends.some(x=>x.id===n.id)){n.type=pos==='supervisor'?'Kıdemli Dost':'Görev Dostu';s.friends.push(n);ensureFriendProfile(n);autoCreateFriendCircle();rememberNPC(n,'work_friend','Görev çevresindeki tanışıklığınız gerçek dostluğa dönüştü.',6);}
  }else if(id==='mentor'){
   if(pos!=='junior'){notice('Bu eylem çırak veya genç yardımcı içindir.');return;}
   w.standing=clamp(w.standing+3);w.cohesion=clamp(w.cohesion+3);adjustNPC(n,{rel:5,trust:5,respect:8},'Ona kendi tecrübenden bir şeyler öğrettin.');n.skills=n.skills||{};const key=careerPrimarySkill(r);n.skills[key]=clamp((n.skills[key]||0)+4);apply({prestige:1});
  }else if(id==='mediate'){
   w.conflict=clamp(w.conflict-14);w.cohesion=clamp(w.cohesion+6);adjustNPC(n,{rel:2,trust:2,respect:4,grudge:-5},'Görev çevresindeki sürtüşmeyi yatıştırmaya çalıştın.');
   const peers=workplacePeers();for(const m of peers.filter(x=>x.id!==n.id).slice(0,2))adjustSocialLink(n,m,{score:5,trust:2,grudge:-6,tag:'work'},'Görev anlaşmazlığında araları bulundu.');
  }
  workplacePromotionCheck();
 },id==='collaborate'?'Ortak görev üzerinde çalışmakla bir ay geçti.':'Görev çevrendeki ilişkilerine bir ay ayırdın.');
}
function tickWorkplaceMonth(action={}){
 const w=ensureWorkplace();if(!s.role){return;}ensureWorkplaceForRole();w.months++;
 const contacts=currentWorkplaceContacts();for(const n of contacts){if(!n?.alive)continue;normalizeBonds(n);if(n.place!==s.place&&Math.random()<.08)n.place=s.place;if(n.realm!==s.realm&&Math.random()<.06)n.realm=s.realm;}
 if(action.kind==='work'){w.projectProgress=clamp(w.projectProgress+6);w.standing=clamp(w.standing+1);}
 if(action.kind!=='workplace'&&action.kind!=='work'&&w.months%4===0){w.cohesion=clamp(w.cohesion-1);if(w.conflict>0)w.conflict=clamp(w.conflict-1);}
 const peers=workplacePeers();for(let i=0;i<peers.length;i++)for(let j=i+1;j<peers.length;j++){const l=socialLinkBetween(peers[i],peers[j],true,{tags:['work']});if(l&&(l.score<0||l.grudge>30))w.conflict=clamp(w.conflict+1);}
 if(w.projectProgress>=100){w.projectProgress=0;w.projects++;w.standing=clamp(w.standing+6);w.cohesion=clamp(w.cohesion+4);apply({prestige:2,wealth:1});for(const n of contacts)adjustNPC(n,{rel:2,respect:2},'Bir ortak işi başarıyla tamamladınız.');log('Görev çevreniz ortak bir işi tamamladı.','good');}
 if(w.conflict>=75&&w.months%3===0){apply({happiness:-1});w.standing=clamp(w.standing-1);}
}
function workplaceYearTick(){
 if(!s.role)return;const w=ensureWorkplaceForRole();workplacePromotionCheck();
 const sup=workplaceSupervisor();if(sup?.alive&&w.sponsorUntil&&w.sponsorUntil<s.year+s.age){w.sponsorUntil=0;w.sponsorId=null;}
 if(w.rank>=2&&!workplaceJuniors().length)makeWorkplaceContact(D.careers.find(x=>x.id===w.roleId),'junior',workplaceRoleLabels(D.careers.find(x=>x.id===w.roleId)));
 for(const n of currentWorkplaceContacts()){if(!n?.alive)continue;if(Math.random()<.04&&n.statusFlags?.workplacePosition==='peer'){n.statusFlags.workplacePosition='former_peer';n.statusFlags.formerWorkplace=true;if(!n.type.startsWith('Eski '))n.type='Eski '+n.type;rememberNPC(n,'career_move','Aynı görev çevresinden ayrılıp başka bir yola geçti.',3);}}
}
function workplaceSummaryHtml(){
 if(!s.role)return '';const w=ensureWorkplaceForRole(),contacts=currentWorkplaceContacts(),sup=workplaceSupervisor();
 let html='<div class="card"><h3>🧭 Görev Çevresi</h3><p><b>'+safeText(workplaceRankTitle())+'</b> • '+safeText(w.roleName||s.role)+'<br>Görev itibarı '+w.standing+'/100 • çevre uyumu '+w.cohesion+'/100 • gerilim '+w.conflict+'/100<br>Ortak iş '+w.projectProgress+'/100 • tamamlanan '+w.projects+(w.sponsorUntil>=s.year+s.age&&sup?'<br>🤝 Kefil: '+safeText(sup.name)+' • '+w.sponsorUntil+' yılına kadar':'')+'</p></div>';
 if(contacts.length)html+='<div class="grid2">'+contacts.map((n,idx)=>{const pos=n.statusFlags?.workplacePosition,label=pos==='supervisor'?'Usta / amir':pos==='junior'?'Çırak / yardımcı':'Akran',issueSponsor=pos==='supervisor'&&n.rel>=45;return '<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(label)+' • '+safeText(n.role||n.type)+'<br>İlişki '+n.rel+' • güven '+(n.bonds?.trust||0)+' • saygı '+(n.bonds?.respect||0)+'</p><div class="actions"><button class="mini" onclick="workplaceAction('+idx+',\'collaborate\')">Birlikte çalış</button>'+(pos==='supervisor'?'<button class="mini" onclick="workplaceAction('+idx+',\'advice\')">Öğüt iste</button>'+(issueSponsor?'<button class="mini" onclick="workplaceAction('+idx+',\'sponsor\')">Kefillik iste</button>':''):'')+(pos==='peer'?'<button class="mini" onclick="workplaceAction('+idx+',\'compete\')">Görevde yarış</button>':'')+(pos==='junior'?'<button class="mini" onclick="workplaceAction('+idx+',\'mentor\')">Yetiştir</button>':'')+'<button class="mini" onclick="workplaceAction('+idx+',\'befriend\')">Dostluğu ilerlet</button>'+(w.conflict>=20?'<button class="mini" onclick="workplaceAction('+idx+',\'mediate\')">Gerilimi yatıştır</button>':'')+'</div></div>';}).join('')+'</div>';
 return html;
}
function applyWorkplaceEvent(eventId,choiceIndex,target){
 if(!s.role)return;const w=ensureWorkplaceForRole();
 if(eventId==='workplace_credit_dispute'){if(choiceIndex===0){w.conflict=clamp(w.conflict-10);w.cohesion=clamp(w.cohesion+5);}else{w.standing=clamp(w.standing+5);w.conflict=clamp(w.conflict+10);}}
 if(eventId==='workplace_supervisor_test'){if(choiceIndex===0){w.standing=clamp(w.standing+5);w.projectProgress=clamp(w.projectProgress+12);}else w.conflict=clamp(w.conflict+6);}
 if(eventId==='workplace_junior_mistake'&&target){if(choiceIndex===0){w.cohesion=clamp(w.cohesion+5);adjustNPC(target,{trust:5,respect:6},'Hatasını düzeltmesine yardım ettin.');}else{w.standing=clamp(w.standing+2);adjustNPC(target,{trust:-4,fear:5,respect:2},'Hatasını sert biçimde yüzüne vurdun.');}}
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
 const difficulty=Math.max(8,need-8+Math.floor(p.mastery/9)),healthPenalty=longTermWorkPenalty(r),chance=Math.max(.22,Math.min(.96,.56+(level-difficulty)/110+p.reputation/350+s.health/500+workplaceWorkBonus()-healthPenalty));
 p.months++;p.lastYear=s.year+s.age;s.careerMonths[r.id]=(s.careerMonths[r.id]||0)+1;addExperience(r.path);
 const success=Math.random()<chance;
 if(success){
  const base=Array.isArray(r.wealth)?rng(r.wealth[0],r.wealth[1]):rng(1,3),bonus=Math.floor(p.reputation/28),gain=Math.max(1,Math.round((base+bonus)*.55*careerDemandMultiplier(r.path)));
  p.orders++;p.streak++;p.bestStreak=Math.max(p.bestStreak,p.streak);p.earnings+=gain;p.reputation=clamp(p.reputation+(p.streak>=4?2:1));p.mastery=clamp(p.mastery+rng(1,3));if(s.role){const w=ensureWorkplaceForRole();w.standing=clamp(w.standing+(p.streak>=4?3:2));w.projectProgress=clamp(w.projectProgress+5);}skillGain(key,2);apply({wealth:gain,prestige:p.reputation>=45?2:1,skill:1});
  if(p.streak===4){log(safeText(r.name)+' işlerinde adın daha sık anılmaya başladı.','good');recordPublicWord('work',r.name+' görevinde işini düzenli ve güvenilir yürüttüğün konuşuluyor.',{reliability:4,honor:1},{severity:18,polarity:1,knownIds:currentWorkplaceContacts().map(n=>n.id)});}
  p.history.push({year:s.year+s.age,ok:true,gain});return {success:true,gain};
 }
 p.failures++;p.streak=0;p.reputation=clamp(p.reputation-rng(1,3));p.mastery=clamp(p.mastery+1);if(s.role){const w=ensureWorkplaceForRole();w.standing=clamp(w.standing-2);w.conflict=clamp(w.conflict+2);}skillGain(key,1);apply({happiness:-1});p.history.push({year:s.year+s.age,ok:false,gain:0});return {success:false,gain:0};
}
const STATE_PROPOSALS={
 winter_share:{name:'Kışlık Erzak Paylaşımı',desc:'Zor kışta ortak erzak payını artır; erzak baskısını ve hane sıkıntısını azaltır.',duration:3,bias:{patron:1,rival:-1,elder:2},tags:['relief'],pass:{support:6,trust:3,rival:1,obligations:2,economy:{food:-10,shortage:-1}}},
 caravan_guard:{name:'Kervan Yolu Koruması',desc:'Kervan yollarına nöbet ve refakat ayır; ticaret talebini ve kervan güvenliğini yükseltir.',duration:4,bias:{patron:1,rival:0,elder:0},tags:['trade'],pass:{support:3,trust:2,rival:2,obligations:2,economy:{trade:12}}},
 craft_patronage:{name:'Usta ve Ocak Desteği',desc:'Demirci ve zanaatkârlara boy desteği ver; zanaat talebini ve üretimi güçlendirir.',duration:4,bias:{patron:1,rival:-1,elder:1},tags:['craft'],pass:{support:4,trust:3,rival:1,obligations:2,economy:{craft:12}}},
 feud_peace:{name:'Boylar Arası Barış Sözü',desc:'Eski husumetlerde arabuluculuk düzeni kur; töre kavgalarını ve rakip baskısını azaltır.',duration:4,bias:{patron:1,rival:-2,elder:2},tags:['peace'],pass:{support:5,trust:5,rival:-10,obligations:2}},
 muster_order:{name:'Sefer Hazırlık Düzeni',desc:'Birlik çağrısı öncesi at, ok ve erzak hazırlığını düzenle; sefer riskini azaltır.',duration:3,bias:{patron:1,rival:2,elder:-1},tags:['military'],pass:{support:-1,trust:2,rival:3,obligations:3}}
};
function ensureStateCourt(){
 ensureCareerSystems();
 if(!s.stateCourt||typeof s.stateCourt!=='object'||Array.isArray(s.stateCourt)){
  s.stateCourt={initialized:false,influence:0,councilTrust:30,tribeSupport:45,rivalPressure:30,obligations:0,decisions:[],startedYear:s.year+s.age};
 }
 const q=s.stateCourt;
 for(const k of ['influence','councilTrust','tribeSupport','rivalPressure'])q[k]=clamp(Number.isFinite(q[k])?q[k]:0);
 q.obligations=Math.max(0,Math.round(q.obligations||0));q.decisions=Array.isArray(q.decisions)?q.decisions.slice(-60):[];
 q.activePolicies=Array.isArray(q.activePolicies)?q.activePolicies.filter(Boolean):[];
 q.proposalHistory=Array.isArray(q.proposalHistory)?q.proposalHistory.slice(0,60):[];
 q.currentProposal=q.currentProposal&&typeof q.currentProposal==='object'?q.currentProposal:null;
 q.proposalCooldowns=q.proposalCooldowns&&typeof q.proposalCooldowns==='object'&&!Array.isArray(q.proposalCooldowns)?q.proposalCooldowns:{};
 q.sessions=Math.max(0,Math.round(q.sessions||0));q.passed=Math.max(0,Math.round(q.passed||0));q.failed=Math.max(0,Math.round(q.failed||0));
 q.activePolicies=q.activePolicies.filter(p=>p&&STATE_PROPOSALS[p.id]).map(p=>({...p,startedYear:Number.isFinite(p.startedYear)?p.startedYear:s.year+s.age,expiresYear:Number.isFinite(p.expiresYear)?p.expiresYear:s.year+s.age+1}));
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

function stateCouncilEligible(){
 const q=ensureStateCourt(),stateRole=['Boy Beyi','Elçi','Bitigçi'].includes(s.role);if(stateRole&&!q.initialized)ensureStateCircle();
 return s.age>=18&&ensureStateCourt().initialized&&(stateRole||ensureStateCourt().influence>=50);
}
function statePolicyActive(id,year=s.year+s.age){return ensureStateCourt().activePolicies.some(p=>p.id===id&&p.startedYear<=year&&p.expiresYear>=year);}
function activeStatePolicies(year=s.year+s.age){return ensureStateCourt().activePolicies.filter(p=>p.startedYear<=year&&p.expiresYear>=year);}
function stateProposalDef(id){return STATE_PROPOSALS[id]||null;}
function stateCouncilMembers(){
 const {patron,rival,elder}=ensureStateCircle();return [patron,rival,elder].filter(n=>n?.alive);
}
function stateProposalStance(n,def){
 if(!n||!def)return 0;normalizeBonds(n);const kind=n.statusFlags?.stateKind||'',bias=def.bias?.[kind]||0;let score=bias;
 if((n.bonds?.trust||0)>=70)score++;else if((n.bonds?.trust||0)<35)score--;
 if((n.rel||0)>=72)score++;else if((n.rel||0)<35)score--;
 if(n.traits?.includes('sadik')&&kind==='patron')score++;
 if(n.traits?.includes('hirsli')&&def.tags?.includes('military'))score++;
 if(n.goal==='wealth'&&def.tags?.includes('trade'))score++;
 if(n.goal==='mastery'&&def.tags?.includes('craft'))score++;
 if((n.traits?.includes('merhametli')||n.goal==='peace')&&(def.tags?.includes('relief')||def.tags?.includes('peace')))score++;
 if(n.traits?.includes('kinci')&&def.tags?.includes('peace'))score--;
 score+=communityCouncilModifier(n);
 return Math.max(-2,Math.min(2,score));
}
function stateStanceLabel(v){return v>=2?'Güçlü destek':v===1?'Destek':v===0?'Kararsız':v===-1?'Karşı':'Sert karşı';}
function stateOpenProposalIssue(id){
 const q=ensureStateCourt(),d=stateProposalDef(id);if(!d)return 'Meclis teklifi bulunamadı.';if(!stateCouncilEligible())return 'Boy meclisine teklif taşımak için devlet görevi veya 50 nüfuz gerekiyor.';
 if(q.currentProposal)return 'Önce açık meclis teklifini sonuçlandır.';if(statePolicyActive(id))return 'Bu düzen zaten yürürlükte.';
 const cd=q.proposalCooldowns[id]||0;if(cd>s.year+s.age)return cd+' yılına kadar bu başlık yeniden açılamaz.';return '';
}
function stateOpenProposal(id){
 const issue=stateOpenProposalIssue(id);if(issue){notice(issue);return false;}const d=stateProposalDef(id);
 return performAction({kind:'stateCouncil',id:'open',proposalId:id},()=>{
  const q=ensureStateCourt(),members=stateCouncilMembers(),stances={};for(const n of members)stances[n.id]=stateProposalStance(n,d);
  q.currentProposal={id,openedYear:s.year+s.age,openedAge:s.age,openedMonth:currentMonth(),stances,lobbiedIds:[],supportSpent:0,notes:[]};q.sessions++;
  adjustStateCourt({influence:1},d.name+' meclis gündemine taşındı.');log(d.name+' boy meclisinin gündemine girdi.','major');
 },d.name+' için meclis gündemi hazırlamakla bir ay geçti.');
}
function currentStateProposal(){const q=ensureStateCourt();return q.currentProposal&&stateProposalDef(q.currentProposal.id)?q.currentProposal:null;}
function stateLobbyIssue(npcId){
 const p=currentStateProposal();if(!p)return 'Önce bir meclis teklifi aç.';const n=npcById(npcId);if(!n?.alive||!Object.prototype.hasOwnProperty.call(p.stances,npcId))return 'Bu kişi açık teklifin meclis taraflarından biri değil.';
 if(p.lobbiedIds.includes(npcId))return 'Bu teklif için onunla zaten özel görüştün.';return '';
}
function lobbyStateMember(npcId){
 const issue=stateLobbyIssue(npcId);if(issue){notice(issue);return false;}const p=currentStateProposal(),n=npcById(npcId),d=stateProposalDef(p.id);
 return performAction({kind:'stateCouncil',id:'lobby',npcId,proposalId:p.id},()=>{
  const q=ensureStateCourt(),old=p.stances[npcId]||0,skill=(s.skills.speech||0),base=.28+skill/220+(s.prestige||0)/350+q.influence/450+(n.bonds?.trust||0)/500-(n.bonds?.grudge||0)/350;
  const success=Math.random()<Math.max(.12,Math.min(.92,base));
  if(success){p.stances[npcId]=Math.min(2,old+(old<0?2:1));adjustNPC(n,{rel:3,trust:4,respect:3,grudge:-2},d.name+' konusunda gerekçelerini dinledi.');p.notes.push(n.name+' görüşmede yumuşadı.');log(safeText(n.name)+' teklif konusunda sözünü daha olumlu dinledi.','good');}
  else{p.stances[npcId]=Math.max(-2,old-1);adjustNPC(n,{rel:-2,trust:-2,grudge:3},d.name+' için yaptığın baskıyı hoş karşılamadı.');p.notes.push(n.name+' görüşmede sertleşti.');log(safeText(n.name)+' teklif konusunda ikna olmadı.','bad');}
  p.lobbiedIds.push(npcId);q.currentProposal=p;
 },safeText(n.name)+' ile meclis teklifi üzerine bir ay görüştün.');
}
function stateVoteTally(p=currentStateProposal()){
 if(!p)return {yes:0,no:0,abstain:0,total:0,rows:[],councilSeat:false,tribeSeat:false};const q=ensureStateCourt(),rows=[];
 for(const [id,stance] of Object.entries(p.stances||{})){const n=npcById(id);if(!n?.alive)continue;const vote=stance>0?'yes':stance<0?'no':'abstain';rows.push({id,name:n.name,kind:n.statusFlags?.stateKind||'',stance,vote});}
 const councilScore=q.councilTrust+q.influence*.35-q.rivalPressure*.25+(s.skills.speech||0)*.08,councilSeat=councilScore>=55;
 const tribeScore=q.tribeSupport+(s.prestige||0)*.22-q.obligations*.7,tribeSeat=tribeScore>=55;
 let yes=rows.filter(x=>x.vote==='yes').length+(councilSeat?1:0)+(tribeSeat?1:0),no=rows.filter(x=>x.vote==='no').length+(councilSeat?0:1)+(tribeSeat?0:1),abstain=rows.filter(x=>x.vote==='abstain').length;
 return {yes,no,abstain,total:yes+no+abstain,rows,councilSeat,tribeSeat,councilScore:Math.round(councilScore),tribeScore:Math.round(tribeScore)};
}
function applyStatePolicyPass(id){
 const q=ensureStateCourt(),d=stateProposalDef(id),year=s.year+s.age;if(!d)return null;
 const old=q.activePolicies.find(p=>p.id===id),rec={id,name:d.name,startedYear:year,expiresYear:year+d.duration-1,source:'meclis'};
 if(old)Object.assign(old,rec);else q.activePolicies.push(rec);
 const fx=d.pass||{};adjustStateCourt({support:fx.support||0,trust:fx.trust||0,rival:fx.rival||0,obligations:fx.obligations||0,influence:3},d.name+' kabul edildi ve yürürlüğe girdi.');
 if(fx.economy)applyEconomyEffect(fx.economy);
 if(id==='feud_peace'){const j=ensureJustice();for(const feud of j.feuds.filter(x=>x.status==='active'))feud.heat=clamp(feud.heat-12);}
 return rec;
}
function stateVoteIssue(){return currentStateProposal()?'':'Açık bir meclis teklifi yok.';}
function callStateVote(){
 const issue=stateVoteIssue();if(issue){notice(issue);return false;}const p=currentStateProposal(),d=stateProposalDef(p.id);
 return performAction({kind:'stateCouncil',id:'vote',proposalId:p.id},()=>{
  const q=ensureStateCourt(),t=stateVoteTally(p),passed=t.yes>=3,year=s.year+s.age;
  q.proposalHistory.unshift({id:p.id,name:d.name,year,age:s.age,passed,yes:t.yes,no:t.no,abstain:t.abstain,stances:{...p.stances},lobbiedIds:[...p.lobbiedIds]});q.proposalHistory=q.proposalHistory.slice(0,60);
  if(passed){
   q.passed++;applyStatePolicyPass(p.id);q.proposalCooldowns[p.id]=year+d.duration;apply({prestige:2});
   const rep=p.id==='winter_share'?{honor:2,reliability:2,generosity:4}:p.id==='feud_peace'?{honor:4,reliability:2}:p.id==='muster_order'?{honor:3,reliability:3}:p.id==='caravan_guard'?{reliability:4,honor:1}:{reliability:3,honor:2};
   recordPublicWord('council',d.name+' kararını meclisten geçirip uygulamaya koyduğun konuşuluyor.',rep,{severity:22,polarity:1,truth:true,knownIds:t.rows.map(x=>x.id)});
   log(d.name+' mecliste '+t.yes+' destekle kabul edildi.','good');
  }else{
   q.failed++;q.proposalCooldowns[p.id]=year+2;adjustStateCourt({influence:-3,trust:-2,rival:4},d.name+' mecliste yeterli destek bulamadı.');apply({prestige:-1});if(t.yes===0)applyCommunityAxes({reliability:-2},d.name+' teklifinde meclisten hiç destek çıkaramadın.');log(d.name+' mecliste reddedildi: '+t.yes+' destek, '+t.no+' karşı.','bad');
  }
  for(const row of t.rows){const n=npcById(row.id);if(!n)continue;if((row.vote==='yes')===passed)adjustNPC(n,{rel:2,trust:2,respect:2},d.name+' oylamasında aynı sonuç tarafında kaldınız.');else if(row.vote!=='abstain')adjustNPC(n,{rel:-1,grudge:2},d.name+' oylamasında karşı taraflarda kaldınız.');}
  q.currentProposal=null;
 },d.name+' için meclis oylamasıyla bir ay geçti.');
}
function withdrawStateProposal(){
 const p=currentStateProposal();if(!p)return false;const q=ensureStateCourt(),d=stateProposalDef(p.id);q.proposalHistory.unshift({id:p.id,name:d.name,year:s.year+s.age,age:s.age,passed:false,withdrawn:true,stances:{...p.stances}});q.proposalCooldowns[p.id]=s.year+s.age+1;q.currentProposal=null;adjustStateCourt({influence:-1},d.name+' oylamaya gitmeden geri çekildi.');render();save();return true;
}
function statePolicyQuarterTick(month){
 const e=ensureEconomy();
 if(statePolicyActive('winter_share')){e.foodPressure=clamp(e.foodPressure-3);if(e.shortageMonths>0&&month%6===0)e.shortageMonths=Math.max(0,e.shortageMonths-1);}
 if(statePolicyActive('caravan_guard'))e.tradeDemand=clamp(e.tradeDemand+4);
 if(statePolicyActive('craft_patronage'))e.craftDemand=clamp(e.craftDemand+4);
}
function stateCampaignSafetyBonus(){return statePolicyActive('muster_order')?0.06:0;}
function statePolicyYearTick(){
 const q=ensureStateCourt(),year=s.year+s.age,expired=q.activePolicies.filter(p=>p.expiresYear<year);q.activePolicies=q.activePolicies.filter(p=>p.expiresYear>=year);
 if(statePolicyActive('feud_peace',year)){q.rivalPressure=clamp(q.rivalPressure-3);const j=ensureJustice();for(const feud of j.feuds.filter(x=>x.status==='active'))feud.heat=clamp(feud.heat-8);}
 if(statePolicyActive('winter_share',year)&&ensureEconomy().foodPressure<=55)q.tribeSupport=clamp(q.tribeSupport+1);
 for(const p of expired)q.decisions.unshift({year,text:p.name+' düzeninin süresi doldu.',influence:q.influence,trust:q.councilTrust,support:q.tribeSupport,rival:q.rivalPressure});
}
function statePolicySummaryHtml(){
 const q=ensureStateCourt(),active=activeStatePolicies();if(!active.length)return '';
 return '<div class="memoryline"><b>Yürürlükte:</b> '+active.map(p=>safeText(p.name)+' ('+p.expiresYear+' yılına kadar)').join(' • ')+'</div>';
}
function adjustStateCourt(delta={},memory=''){
 const q=ensureStateCourt();if(delta.influence)q.influence=clamp(q.influence+delta.influence);if(delta.trust)q.councilTrust=clamp(q.councilTrust+delta.trust);if(delta.support)q.tribeSupport=clamp(q.tribeSupport+delta.support);if(delta.rival)q.rivalPressure=clamp(q.rivalPressure+delta.rival);if(delta.obligations)q.obligations=Math.max(0,q.obligations+delta.obligations);
 if(memory){q.decisions.unshift({year:s.year+s.age,text:String(memory),influence:q.influence,trust:q.councilTrust,support:q.tribeSupport,rival:q.rivalPressure});q.decisions=q.decisions.slice(0,30);}
 return q;
}
function stateCourtSummary(){
 const q=ensureStateCourt();if(!q.initialized&&!['Bitigçi','Elçi','Boy Beyi'].includes(s.role))return '';
 const last=q.decisions[0]?.text||'Henüz büyük bir meclis kararı vermedin.',p=currentStateProposal();
 let html='<div class="card"><h3>🏕 Boy Meclisi ve Nüfuz</h3><p>Nüfuz '+q.influence+' • Meclis güveni '+q.councilTrust+'<br>Oba desteği '+q.tribeSupport+' • Rakip baskısı '+q.rivalPressure+(q.obligations?' • Yükümlülük '+q.obligations:'')+'<br>Oturum '+q.sessions+' • kabul '+q.passed+' • ret '+q.failed+'</p>'+statePolicySummaryHtml()+'<div class="memoryline">Son iz: '+safeText(last)+'</div></div>';
 if(p){
  const d=stateProposalDef(p.id),t=stateVoteTally(p);
  html+='<div class="card"><h3>📜 Açık Teklif: '+safeText(d.name)+'</h3><p>'+safeText(d.desc)+'<br><b>Şu anki sayım:</b> '+t.yes+' destek • '+t.no+' karşı • '+t.abstain+' çekimser<br>Meclis havası '+t.councilScore+' • oba havası '+t.tribeScore+'</p></div>';
  html+='<div class="grid2">'+t.rows.map(row=>{const n=npcById(row.id),done=p.lobbiedIds.includes(row.id),label=row.kind==='patron'?'İleri gelen':row.kind==='rival'?'Rakip ileri gelen':'Boy büyüğü';return '<div class="card"><h3>'+safeText(row.name)+'</h3><p>'+safeText(label)+' • '+safeText(stateStanceLabel(row.stance))+'</p><div class="actions">'+(done?'<span class="note">Bu teklif için özel görüşme yapıldı.</span>':actionButton('İkna etmeye çalış',{kind:'stateCouncil',id:'lobby',npcId:row.id},"lobbyStateMember('"+row.id+"')",'Konuşma, itibar, nüfuz ve aranızdaki güven sonucu etkiler.'))+'</div></div>';}).join('')+'</div>';
  html+='<div class="grid2">'+actionButton('Meclis oylamasına götür',{kind:'stateCouncil',id:'vote'},'callStateVote()','En az 3 destek oyu gerekir. Sonuç mevcut tarafların tutumuna göre belirlenir.')+'<button class="card" onclick="withdrawStateProposal()"><h3>Teklifi geri çek</h3><p>Oylamadan önce gündemden çıkar; küçük nüfuz kaybı olur.</p></button></div>';
 }else if(stateCouncilEligible()){
  html+='<h3 class="sectionTitle">Meclise Teklif Taşı</h3><div class="grid2">'+Object.entries(STATE_PROPOSALS).map(([id,d])=>actionButton(d.name,{kind:'stateCouncil',id:'open',proposalId:id},"stateOpenProposal('"+id+"')",d.desc+' • '+d.duration+' yıl yürürlük')).join('')+'</div>';
 }
 return html;
}
function stateYearTick(){
 const q=ensureStateCourt();if(!q.initialized)return;
 statePolicyYearTick();
 const rival=stateContact('rival',false),patron=stateContact('patron',false);
 if(rival?.alive)q.rivalPressure=clamp(q.rivalPressure+rng(0,2));else q.rivalPressure=clamp(q.rivalPressure-2);
 if(patron?.alive&&(patron.bonds?.trust||0)>=65)q.councilTrust=clamp(q.councilTrust+1);
 if(s.role==='Boy Beyi'){q.influence=clamp(q.influence+1);q.obligations=Math.max(0,q.obligations-1);}
 else if(q.influence>0&&Math.random()<.35)q.influence=clamp(q.influence-1);
}

const LONG_TERM_CONDITIONS={
 mobility:{name:'Kalıcı hareket kısıtlılığı',domains:{mobility:24,endurance:8},flare:'old_wound'},
 upper:{name:'Kol ve omuz işlev kısıtlılığı',domains:{upper:24,endurance:6},flare:'old_wound'},
 chronic_pain:{name:'Süregelen ağrı',domains:{endurance:20,mobility:7,upper:7},flare:'old_wound'},
 sight:{name:'Görme zorluğu',domains:{vision:27},flare:'exhaustion'},
 hearing:{name:'İşitme zorluğu',domains:{hearing:28},flare:'exhaustion'},
 fatigue:{name:'Süregelen güç kaybı',domains:{endurance:24,mobility:6,upper:6},flare:'exhaustion'}
};
function normalizeLongTermCondition(x){
 if(!x||!LONG_TERM_CONDITIONS[x.id])return null;
 x.severity=Math.max(1,Math.min(3,Math.round(x.severity||1)));x.management=clamp(Number.isFinite(x.management)?x.management:20);x.source=x.source||'';
 x.startedYear=Number.isFinite(x.startedYear)?x.startedYear:s.year+s.age;x.startedAge=Number.isFinite(x.startedAge)?x.startedAge:s.age;x.flares=Math.max(0,Math.round(x.flares||0));x.lastFlareYear=Number.isFinite(x.lastFlareYear)?x.lastFlareYear:null;
 x.adaptations=Array.isArray(x.adaptations)?[...new Set(x.adaptations)]:[];x.history=Array.isArray(x.history)?x.history.slice(0,20):[];return x;
}
function longTermCondition(id){return ensureHealthProfile().longTermConditions.find(x=>x.id===id)||null;}
function acquireLongTermCondition(id,opts={}){
 const d=LONG_TERM_CONDITIONS[id];if(!d)return null;const h=ensureHealthProfile();let x=h.longTermConditions.find(c=>c.id===id);
 const severity=Math.max(1,Math.min(3,Math.round(opts.severity||1)));
 if(x){x.severity=Math.max(x.severity,severity);x.management=clamp(x.management-(severity>1?5:0));if(opts.source)x.source=opts.source;x.history.unshift({year:s.year+s.age,type:'worsen',severity:x.severity,source:opts.source||''});return x;}
 x=normalizeLongTermCondition({id,severity,management:opts.management??20,source:opts.source||'',startedYear:s.year+s.age,startedAge:s.age,flares:0,lastFlareYear:null,adaptations:[],history:[{year:s.year+s.age,type:'start',severity,source:opts.source||''}]});
 h.longTermConditions.push(x);h.history.unshift({year:s.year+s.age,type:'long_term',text:d.name+' kalıcı bir sağlık durumuna dönüştü.'});h.history=h.history.slice(0,60);log(d.name+' günlük hayatında kalıcı bir uyum gerektirmeye başladı.','major');return x;
}
function longTermConditionName(x){return LONG_TERM_CONDITIONS[x?.id]?.name||x?.id||'';}
function conditionAdapted(x,id){return !!x?.adaptations?.includes(id);}
function healthCapabilities(){
 const h=ensureHealthProfile(),caps={mobility:100,upper:100,vision:100,hearing:100,endurance:100};
 for(const x of h.longTermConditions){
  const d=LONG_TERM_CONDITIONS[x.id],manage=Math.min(.55,(x.management||0)/180),adapt=Math.min(.35,(x.adaptations?.length||0)*.09);
  for(const [domain,base] of Object.entries(d.domains||{}))caps[domain]-=Math.round(base*x.severity*(1-manage-adapt));
 }
 if(h.adaptations.mobility_support)caps.mobility+=14;
 if(h.adaptations.hand_tools)caps.upper+=14;
 if(h.adaptations.sight_guidance)caps.vision+=12;
 if(h.adaptations.hearing_signals)caps.hearing+=12;
 if(h.adaptations.home_adjust)caps.endurance+=8;
 if(h.adaptations.family_support){caps.mobility+=4;caps.endurance+=6;}
 for(const k of Object.keys(caps))caps[k]=clamp(caps[k]);return caps;
}
function healthCapabilityLabel(v){return v>=80?'Rahat':v>=60?'Uyumlu':v>=40?'Zorlanıyor':v>=25?'Ağır zorlanıyor':'Çok sınırlı';}
function longTermWorkPenalty(r){
 if(!r)return 0;const c=healthCapabilities();let use=[];
 if(r.path==='military')use=[c.mobility,c.upper,c.vision,c.endurance];
 else if(r.path==='craft')use=[c.upper,c.endurance,c.vision];
 else if(r.path==='trade')use=[c.mobility,c.endurance,c.vision];
 else if(r.path==='state')use=[c.endurance,c.hearing,c.vision];
 else use=[c.endurance,c.hearing];
 const avg=use.reduce((a,v)=>a+v,0)/Math.max(1,use.length),lowest=Math.min(...use),raw=Math.max(0,(70-avg)/180,(45-lowest)/150);
 return ensureHealthProfile().adaptations.work_adjust?raw*.45:raw;
}
function longTermMilitaryIssue(){
 const c=healthCapabilities();if(c.endurance<28)return 'Süregelen sağlık yükü şu anda sefer temposunu kaldıramayacak kadar ağır.';
 if(c.mobility<38&&!ensureHealthProfile().adaptations.mobility_support)return 'Sefer için hareket desteğini önce düzenlemen gerekiyor.';
 if(c.upper<38&&!ensureHealthProfile().adaptations.hand_tools)return 'Silah ve yük kullanımı için uyarlanmış araç düzeni gerekiyor.';return '';
}
function healthAdaptationIssue(id){
 const h=ensureHealthProfile(),conds=h.longTermConditions;if(!conds.length)return 'Uyum gerektiren kalıcı bir sağlık durumu yok.';
 if(id==='mobility_support'){if(!conds.some(x=>LONG_TERM_CONDITIONS[x.id].domains.mobility))return 'Hareket desteği gerektiren bir durum yok.';if(h.adaptations.mobility_support)return 'Hareket desteği zaten hazır.';if(s.wealth<2)return 'Dayanak, eyer ve yol düzeni için 2 servet gerekiyor.';}
 else if(id==='hand_tools'){if(!conds.some(x=>LONG_TERM_CONDITIONS[x.id].domains.upper))return 'El ve kol kullanımını uyarlamayı gerektiren bir durum yok.';if(h.adaptations.hand_tools)return 'Uyarlanmış araç düzeni zaten hazır.';if(s.wealth<2)return 'Araçları uyarlamak için 2 servet gerekiyor.';}
 else if(id==='sight_guidance'){if(!conds.some(x=>x.id==='sight'))return 'Görme desteği gerektiren bir durum yok.';if(h.adaptations.sight_guidance)return 'Görme desteği düzeni zaten hazır.';}
 else if(id==='hearing_signals'){if(!conds.some(x=>x.id==='hearing'))return 'İşitme desteği gerektiren bir durum yok.';if(h.adaptations.hearing_signals)return 'El işareti ve dikkat düzeni zaten hazır.';}
 else if(id==='home_adjust'){if(h.adaptations.home_adjust)return 'Yurt içi düzen zaten uyarlanmış.';if(s.wealth<3)return 'Yurt içi düzenleme için 3 servet gerekiyor.';}
 else if(id==='work_adjust'){if(!s.role)return 'Uyarlanacak aktif görevin yok.';if(h.adaptations.work_adjust)return 'Görev düzenin zaten uyarlanmış.';}
 else if(id==='family_support'){if(h.adaptations.family_support)return 'Yakın desteği düzeni zaten kuruldu.';if(![...s.parents,...s.siblings,...s.children,s.partner].some(n=>n?.alive&&(n.rel||0)>=50))return 'Düzenli destek isteyebileceğin yakın görünmüyor.';}
 else if(id==='management'){if(s.wealth<2)return 'Otacıyla uzun süreli bakım planı için 2 servet gerekiyor.';}
 else return 'Uyum eylemi bulunamadı.';return '';
}
function healthAdaptationAction(id){
 const issue=healthAdaptationIssue(id);if(issue){notice(issue);return false;}const h=ensureHealthProfile();
 return performAction({kind:'healthAdapt',id},()=>{
  if(id==='mobility_support'){s.wealth-=2;h.adaptations.mobility_support=true;for(const x of h.longTermConditions.filter(x=>LONG_TERM_CONDITIONS[x.id].domains.mobility)){x.management=clamp(x.management+12);if(!x.adaptations.includes(id))x.adaptations.push(id);}}
  else if(id==='hand_tools'){s.wealth-=2;h.adaptations.hand_tools=true;for(const x of h.longTermConditions.filter(x=>LONG_TERM_CONDITIONS[x.id].domains.upper)){x.management=clamp(x.management+12);if(!x.adaptations.includes(id))x.adaptations.push(id);}}
  else if(id==='sight_guidance'){h.adaptations.sight_guidance=true;for(const x of h.longTermConditions.filter(x=>x.id==='sight')){x.management=clamp(x.management+10);if(!x.adaptations.includes(id))x.adaptations.push(id);}}
  else if(id==='hearing_signals'){h.adaptations.hearing_signals=true;for(const x of h.longTermConditions.filter(x=>x.id==='hearing')){x.management=clamp(x.management+10);if(!x.adaptations.includes(id))x.adaptations.push(id);}}
  else if(id==='home_adjust'){s.wealth-=3;h.adaptations.home_adjust=true;h.longTermConditions.forEach(x=>x.management=clamp(x.management+7));}
  else if(id==='work_adjust'){h.adaptations.work_adjust=true;h.longTermConditions.forEach(x=>x.management=clamp(x.management+5));if(s.role)ensureWorkplaceForRole().standing=clamp(ensureWorkplaceForRole().standing+2);}
  else if(id==='family_support'){h.adaptations.family_support=true;const kin=[...s.parents,...s.siblings,...s.children,s.partner].filter(n=>n?.alive&&(n.rel||0)>=50).sort((a,b)=>(b.rel||0)-(a.rel||0))[0];if(kin)adjustNPC(kin,{rel:4,trust:5,respect:2},'Günlük yaşamındaki bazı yükleri düzenli paylaşmayı kararlaştırdınız.');h.longTermConditions.forEach(x=>x.management=clamp(x.management+8));}
  else if(id==='management'){s.wealth-=2;const healer=healthHealer(true);if(healer)adjustNPC(healer,{rel:2,trust:3},'Süregelen sağlık durumunu yönetmek için düzenli bir plan yaptınız.');h.longTermConditions.forEach(x=>x.management=clamp(x.management+15));h.healerVisits++;}
  h.history.unshift({year:s.year+s.age,type:'adaptation',text:id});h.history=h.history.slice(0,60);apply({happiness:1});
 },'Günlük yaşamını sağlık durumuna göre uyarlamakla bir ay geçti.');
}
function longTermHealthMonthTick(month,action={}){
 const h=ensureHealthProfile();if(!h.longTermConditions.length)return;
 for(const x of h.longTermConditions){
  if(month===1&&x.management>0)x.management=clamp(x.management-1);
  const d=LONG_TERM_CONDITIONS[x.id],adaptCount=x.adaptations.length+(h.adaptations.home_adjust?1:0)+(h.adaptations.family_support?1:0),flare=Math.max(.01,.025*x.severity+(35-x.management)/1000-adaptCount*.008);
  if(Math.random()<flare&&!s.ailments.some(a=>a.id===d.flare)){x.flares++;x.lastFlareYear=s.year+s.age;acquireAilment(d.flare,{severity:Math.min(3,x.severity),duration:2+x.severity,source:d.name});x.history.unshift({year:s.year+s.age,type:'flare',month});}
  if(month%3===0&&x.severity>=2&&x.management<35){apply({happiness:-1});if(x.severity>=3&&x.management<20)apply({health:-1});}
 }
}
function longTermConditionFromAilment(x){
 if(!x)return null;if(x.id==='deep_wound'||x.id==='injury'){if(String(x.source).includes('battle'))return Math.random()<.55?'mobility':'upper';return Math.random()<.55?'chronic_pain':'mobility';}
 if(x.id==='fever'&&x.severity>=4)return 'fatigue';return null;
}
function longTermHealthSummaryHtml(){
 const h=ensureHealthProfile();if(!h.longTermConditions.length)return '';const caps=healthCapabilities();
 const rows=h.longTermConditions.map(x=>'<div class="memoryline"><b>'+safeText(longTermConditionName(x))+'</b> • derece '+x.severity+' • yönetim '+x.management+'/100 • alevlenme '+x.flares+(x.source?'<br>Kaynak: '+safeText(x.source):'')+'</div>').join('');
 let buttons='';
 const defs=[['mobility_support','Hareket desteği hazırla'],['hand_tools','Araçları uyarlat'],['sight_guidance','Görme desteği düzenle'],['hearing_signals','İşaret düzeni kur'],['home_adjust','Yurdu uyumla'],['work_adjust','Görev düzenini uyumla'],['family_support','Yakın desteği iste'],['management','Otacıyla yönetim planı']];
 for(const [id,label] of defs){const issue=healthAdaptationIssue(id);if(!issue)buttons+=actionButton(label,{kind:'healthAdapt',id},"healthAdaptationAction('"+id+"')",'Kalıcı durumu ortadan kaldırmaz; günlük işlevi ve yönetimi güçlendirir.');}
 return '<div class="card"><h3>🪵 Süregelen Sağlık ve Uyum</h3><p>Hareket '+caps.mobility+' ('+healthCapabilityLabel(caps.mobility)+') • kol/el '+caps.upper+' ('+healthCapabilityLabel(caps.upper)+')<br>Görme '+caps.vision+' • işitme '+caps.hearing+' • dayanma '+caps.endurance+'</p>'+rows+'</div>'+(buttons?'<div class="grid2">'+buttons+'</div>':'');
}

function ensureHealthProfile(){
 if(!s.healthProfile||typeof s.healthProfile!=='object'||Array.isArray(s.healthProfile))s.healthProfile={scars:[],frailty:0,resilience:50,healerVisits:0,restMonths:0,crises:0,lastCareYear:null,history:[]};
 const h=s.healthProfile;
 h.scars=Array.isArray(h.scars)?h.scars.slice(-12):[];h.frailty=clamp(Number.isFinite(h.frailty)?h.frailty:0);h.resilience=clamp(Number.isFinite(h.resilience)?h.resilience:50);
 h.healerVisits=Math.max(0,Math.floor(h.healerVisits||0));h.restMonths=Math.max(0,Math.floor(h.restMonths||0));h.crises=Math.max(0,Math.floor(h.crises||0));h.history=Array.isArray(h.history)?h.history.slice(-60):[];
 h.longTermConditions=Array.isArray(h.longTermConditions)?h.longTermConditions.map(normalizeLongTermCondition).filter(Boolean):[];
 h.adaptations=h.adaptations&&typeof h.adaptations==='object'&&!Array.isArray(h.adaptations)?h.adaptations:{};
 for(const k of ['mobility_support','hand_tools','sight_guidance','hearing_signals','home_adjust','work_adjust','family_support'])h.adaptations[k]=!!h.adaptations[k];
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
 const h=ensureHealthProfile(),active=s.ailments.reduce((sum,x)=>sum+(x.severity||1),0),scar=h.scars.reduce((sum,x)=>sum+(x.severity||1),0),long=h.longTermConditions.reduce((sum,x)=>sum+(x.severity||1)*(6-Math.min(3,Math.floor((x.management||0)/30))),0);
 return active*5+scar*2+h.frailty+long;
}
function acquireAilment(id,opts={}){
 const d=AILMENTS[id];if(!d||s.age<d.min)return null;ensureHealthProfile();let x=s.ailments.find(a=>a.id===id);
 const sev=Math.max(1,Math.min(4,Math.floor(opts.severity??d.severity??1))),dur=Math.max(1,Math.floor(opts.duration??d.duration));
 if(x){x.severity=Math.max(x.severity||1,sev);x.remaining=Math.max(x.remaining||1,dur);if(opts.source)x.source=opts.source;return x;}
 x={id,remaining:dur,severity:sev,source:opts.source||'',startedYear:s.year+s.age,treated:false};s.ailments.push(x);s.healthProfile.crises++;s.healthProfile.history.unshift({year:s.year+s.age,type:'ailment',text:d.name+' başladı'});s.healthProfile.history=s.healthProfile.history.slice(0,40);log(d.name+' yaşamını zorlaştırıyor.','bad');return x;
}
function finishAilment(x){
 const d=AILMENTS[x.id],h=ensureHealthProfile();if(!d)return;
 h.history.unshift({year:s.year+s.age,type:'recovery',text:d.name+' hafifledi'});h.history=h.history.slice(0,60);
 if(d.kind==='injury'&&x.severity>=3&&!h.scars.some(sc=>sc.source===x.source&&sc.year===x.startedYear))addScar(x.source==='battle'?'battle':'fall',x.severity>=4?2:1,x.source||d.name);
 if(x.severity>=3){
  const id=longTermConditionFromAilment(x),chance=x.severity>=4?.78:d.kind==='injury'?.38:.22;
  if(id&&Math.random()<chance)acquireLongTermCondition(id,{severity:x.severity>=4?2:1,source:x.source||d.name,management:x.treated?34:18});
 }
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
 longTermHealthMonthTick(month,s.lastAction||{});
}
function healthAgeTick(){
 const h=ensureHealthProfile(),scarWeight=h.scars.reduce((a,x)=>a+(x.severity||1),0);
 h.frailty=clamp(Math.floor(Math.max(0,s.age-45)*1.15)+scarWeight*2+Math.max(0,45-s.health)/3+h.longTermConditions.reduce((a,x)=>a+x.severity,0));
 h.resilience=clamp(58-Math.floor(Math.max(0,s.age-35)/3)-scarWeight+(s.health>=80?5:0)-Math.floor(h.longTermConditions.length/2));
 if(s.age>=55&&h.scars.length&&Math.random()<Math.min(.35,.04+h.frailty/400)){
  const old=pick(h.scars);if(old&&(old.lastFlareYear==null||s.year+s.age-old.lastFlareYear>=4)){old.lastFlareYear=s.year+s.age;scheduleDelayedEvent({id:'old_wound_flare',years:[1,2],payload:{scarId:old.id,detail:'Eski '+scarName(old)+' yaş ilerledikçe yeniden kendini hatırlattı.'}},{target:'none',sourceEventId:'ageing'});}
 }
 if(s.age>=60&&h.frailty>=68&&!longTermCondition('chronic_pain')&&Math.random()<.07)acquireLongTermCondition('chronic_pain',{severity:1,source:'yaş ve eski yükler',management:28});
 if(s.age>=68&&!longTermCondition('hearing')&&Math.random()<.035)acquireLongTermCondition('hearing',{severity:1,source:'ileri yaş',management:30});
 if(s.age>=72&&!longTermCondition('sight')&&Math.random()<.03)acquireLongTermCondition('sight',{severity:1,source:'ileri yaş',management:30});
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
 if(h.longTermConditions.length){for(const x of h.longTermConditions)x.management=clamp(x.management+(useHealer?5:2));}
}
function healthSummaryHtml(){
 const h=ensureHealthProfile(),healer=healthHealer(false),burden=healthBurden(),state=burden>=45?'Ağır':burden>=25?'Zorlanıyor':burden>=10?'Dikkat':'Dengeli';
 const active=s.ailments.length?s.ailments.map(x=>AILMENTS[x.id].name+' • '+x.remaining+' ay • '+x.severity+'. derece').join('<br>'):'Aktif rahatsızlık yok';
 const scars=h.scars.length?h.scars.slice(-4).map(x=>scarName(x)+' • iz '+x.severity).join('<br>'):'Kalıcı yara izi yok';
 return '<div class="card"><h3>🌿 Sağlık Geçmişi</h3><p>'+state+' • Yük '+burden+' • Dayanıklılık '+h.resilience+' • Kırılganlık '+h.frailty+'<br>'+active+'</p><div class="memoryline">'+scars+(healer?'<br>Bakım için tanıdığın kişi: '+safeText(healer.name)+' ('+healer.rel+')':'')+'</div></div>'+longTermHealthSummaryHtml();
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











function ensureCommunityReputation(){
 if(!s.communityReputation||typeof s.communityReputation!=='object'||Array.isArray(s.communityReputation))s.communityReputation={};
 const q=s.communityReputation;
 q.honor=clamp(Number.isFinite(q.honor)?q.honor:50);
 q.reliability=clamp(Number.isFinite(q.reliability)?q.reliability:50);
 q.generosity=clamp(Number.isFinite(q.generosity)?q.generosity:45);
 q.fear=clamp(Number.isFinite(q.fear)?q.fear:10);
 q.rumorHeat=clamp(Number.isFinite(q.rumorHeat)?q.rumorHeat:0);
 q.rumors=Array.isArray(q.rumors)?q.rumors.slice(0,40):[];
 q.history=Array.isArray(q.history)?q.history.slice(0,100):[];
 q.opinions=q.opinions&&typeof q.opinions==='object'&&!Array.isArray(q.opinions)?q.opinions:{};
 q.countered=Math.max(0,Math.round(q.countered||0));q.spreadCount=Math.max(0,Math.round(q.spreadCount||0));q.repaired=Math.max(0,Math.round(q.repaired||0));
 for(const r of q.rumors){
  r.id=r.id||('rumor_'+Math.random().toString(36).slice(2));r.kind=r.kind||'word';r.text=r.text||'Hakkında bir söz dolaşıyor.';
  r.truth=r.truth!==false;r.polarity=r.polarity<0?-1:1;r.severity=clamp(Number.isFinite(r.severity)?r.severity:20);
  r.year=Number.isFinite(r.year)?r.year:s.year+s.age;r.month=Number.isFinite(r.month)?r.month:currentMonth();r.realm=r.realm||s.realm;r.place=r.place||s.place;
  r.sourceId=r.sourceId||null;r.knownIds=Array.isArray(r.knownIds)?[...new Set(r.knownIds.filter(Boolean))]:[];r.status=r.status||'active';r.expiresYear=Number.isFinite(r.expiresYear)?r.expiresYear:r.year+4;
  r.spreadPenalty=Math.max(0,Math.min(.8,Number(r.spreadPenalty||0)));r.responses=Math.max(0,Math.round(r.responses||0));
 }
 for(const [id,o0] of Object.entries(q.opinions)){
  const o=o0&&typeof o0==='object'?o0:{};o.npcId=id;o.score=Math.max(-100,Math.min(100,Math.round(o.score||0)));o.heard=Array.isArray(o.heard)?[...new Set(o.heard)].slice(-30):[];
  o.lastYear=Number.isFinite(o.lastYear)?o.lastYear:null;q.opinions[id]=o;
 }
 recalcRumorHeat();return q;
}
function communityOpinion(n,create=true){
 if(!n)return null;const q=ensureCommunityReputation();if(!q.opinions[n.id]&&create)q.opinions[n.id]={npcId:n.id,score:0,heard:[],lastYear:null};return q.opinions[n.id]||null;
}
function communityGoodName(){
 const q=ensureCommunityReputation();return clamp(Math.round(q.honor*.36+q.reliability*.34+q.generosity*.16+(100-q.fear)*.14-q.rumorHeat*.18));
}
function communityReputationLabel(){
 const v=communityGoodName(),q=ensureCommunityReputation();if(q.rumorHeat>=65)return 'Sözü çok tartışmalı';if(v>=78)return 'Adı güvenle anılıyor';if(v>=62)return 'İyi adı var';if(v>=45)return 'Karışık bir ün';if(v>=28)return 'Adı kuşkuyla anılıyor';return 'Ağır kötü ün';
}
function rumorLocalWeight(r){
 if(!r)return 0;let w=1;if(r.realm&&r.realm!==s.realm)w*=.28;else if(r.place&&r.place!==s.place)w*=.62;return w;
}
function recalcRumorHeat(){
 if(!s?.communityReputation)return 0;const q=s.communityReputation,active=(q.rumors||[]).filter(r=>r.status==='active'&&r.expiresYear>=s.year+s.age);
 const neg=active.filter(r=>r.polarity<0).reduce((sum,r)=>sum+r.severity*Math.max(1,r.knownIds?.length||1)*rumorLocalWeight(r)/9,0);
 const pos=active.filter(r=>r.polarity>0).reduce((sum,r)=>sum+r.severity*Math.max(1,r.knownIds?.length||1)*rumorLocalWeight(r)/18,0);
 q.rumorHeat=clamp(Math.round(Math.max(0,neg-pos*.35)));return q.rumorHeat;
}
function applyCommunityAxes(delta={},memory=''){
 const q=ensureCommunityReputation();for(const k of ['honor','reliability','generosity','fear'])if(delta[k])q[k]=clamp(q[k]+delta[k]);
 if(memory){q.history.unshift({year:s.year+s.age,age:s.age,month:currentMonth(),text:memory,delta:{...delta}});q.history=q.history.slice(0,100);}return q;
}
function rumorOpinionDelta(r,n){
 let d=Math.max(1,Math.round(r.severity/8))*r.polarity;
 if(n?.traits?.includes('kuskucu')&&r.polarity<0)d=Math.round(d*1.35);
 if(n?.traits?.includes('sadik')&&n.rel>=65&&r.polarity<0)d=Math.round(d*.65);
 if(n?.traits?.includes('merhametli')&&r.kind==='generosity'&&r.polarity>0)d=Math.round(d*1.25);
 if(n?.traits?.includes('kinci')&&r.polarity<0)d=Math.round(d*1.15);
 return Math.max(-18,Math.min(18,d));
}
function hearCommunityRumor(n,r){
 if(!n?.alive||!r)return false;const o=communityOpinion(n,true);if(o.heard.includes(r.id))return false;
 const d=rumorOpinionDelta(r,n);o.heard.push(r.id);o.heard=o.heard.slice(-30);o.score=Math.max(-100,Math.min(100,o.score+d));o.lastYear=s.year+s.age;
 if(d>0)adjustNPC(n,{rel:Math.max(0,Math.round(d/5)),trust:Math.max(0,Math.round(d/4)),respect:Math.max(1,Math.round(d/3)),grudge:-Math.max(0,Math.round(d/6))},'Hakkında iyi bir söz duydu: '+r.text);
 else if(d<0)adjustNPC(n,{rel:Math.min(0,Math.round(d/5)),trust:Math.min(-1,Math.round(d/4)),respect:Math.min(-1,Math.round(d/4)),grudge:Math.max(1,Math.round(-d/3)),fear:r.kind==='crime'?Math.max(0,Math.round(-d/5)):0},'Hakkında olumsuz bir söz duydu: '+r.text);
 return true;
}
function createCommunityRumor(kind,text,opts={}){
 const q=ensureCommunityReputation(),polarity=opts.polarity<0?-1:1,severity=clamp(Math.max(5,Math.round(opts.severity||20))),sourceId=opts.sourceId||null;
 const known=[...(opts.knownIds||[]),sourceId].filter(Boolean),r={id:'rumor_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),kind,text:String(text||'Hakkında bir söz dolaşıyor.'),truth:opts.truth!==false,polarity,severity,year:s.year+s.age,month:currentMonth(),realm:s.realm,place:s.place,sourceId,caseId:opts.caseId||null,knownIds:[...new Set(known)],status:'active',expiresYear:s.year+s.age+Math.max(2,Math.ceil(severity/18)),spreadPenalty:0,responses:0};
 q.rumors.unshift(r);q.rumors=q.rumors.slice(0,40);for(const id of r.knownIds){const n=npcById(id);if(n?.alive)hearCommunityRumor(n,r);}recalcRumorHeat();
 q.history.unshift({year:s.year+s.age,age:s.age,month:currentMonth(),type:'rumor',rumorId:r.id,text:r.text,polarity:r.polarity,severity:r.severity});q.history=q.history.slice(0,100);return r;
}
function recordPublicWord(kind,text,delta={},opts={}){
 applyCommunityAxes(delta,text);const magnitude=Math.max(...['honor','reliability','generosity','fear'].map(k=>Math.abs(delta[k]||0)),0);
 if(opts.rumor===false||(!opts.severity&&!magnitude))return null;
 const polarity=opts.polarity??(((delta.honor||0)+(delta.reliability||0)+(delta.generosity||0)-(delta.fear||0)*.25)>=0?1:-1);
 return createCommunityRumor(kind,text,{...opts,polarity,severity:opts.severity||Math.max(8,magnitude*4)});
}
function activeCommunityRumors(polarity=0){
 return ensureCommunityReputation().rumors.filter(r=>r.status==='active'&&r.expiresYear>=s.year+s.age&&(!polarity||r.polarity===polarity)).sort((a,b)=>b.severity*(b.knownIds.length+1)-a.severity*(a.knownIds.length+1));
}

function softenCommunityRumorByCase(caseId,amount=12,status=''){
 if(!caseId)return;const q=ensureCommunityReputation();for(const r of q.rumors.filter(x=>x.caseId===caseId&&x.status==='active')){
  r.severity=clamp(Math.max(5,r.severity-amount));r.spreadPenalty=Math.min(.8,r.spreadPenalty+.18);if(status)r.status=status;counterRumorOpinions(r,.35);
 }recalcRumorHeat();
}
function communityReputationSnapshot(){
 const q=ensureCommunityReputation();return {honor:q.honor,reliability:q.reliability,generosity:q.generosity,fear:q.fear,goodName:communityGoodName(),label:communityReputationLabel(),rumorHeat:q.rumorHeat,activeRumors:activeCommunityRumors().length};
}
function rumorSpreadCandidates(r){
 const known=new Set(r.knownIds||[]),people=allNPCs().filter(n=>n?.alive&&!known.has(n.id));if(!people.length)return [];
 return people.map(n=>{
  let score=0;if(n.realm===r.realm)score+=10;if(n.place===r.place)score+=16;if(n.realm===s.realm)score+=4;if(n.place===s.place)score+=7;
  for(const id of r.knownIds||[]){const k=npcById(id),l=k?socialLinkBetween(n,k):null;if(l)score+=Math.max(0,Math.abs(l.score)/8+l.trust/16);}
  if(n.traits?.includes('kuskucu'))score+=5;if(n.type?.includes('Ozan'))score+=5;return {n,score};
 }).sort((a,b)=>b.score-a.score);
}
function tickCommunityReputationMonth(month){
 const q=ensureCommunityReputation(),year=s.year+s.age;
 for(const r of q.rumors){
  if(r.status!=='active')continue;if(year>r.expiresYear){r.status='faded';continue;}
  const candidates=rumorSpreadCandidates(r);if(!candidates.length)continue;
  const reach=r.knownIds.length,chance=Math.max(.03,Math.min(.72,.11+r.severity/220+Math.min(.18,reach/80)-r.spreadPenalty));
  if(Math.random()<chance){
   const top=candidates.slice(0,Math.min(4,candidates.length)),row=pick(top),n=row?.n;if(n&&hearCommunityRumor(n,r)){r.knownIds.push(n.id);r.knownIds=[...new Set(r.knownIds)];q.spreadCount++;if(r.knownIds.length>=Math.max(12,Math.round(r.severity/3)))r.spreadPenalty=Math.min(.75,r.spreadPenalty+.04);}
  }
 }
 if(month===12){q.honor=clamp(q.honor+(q.honor>50?-1:q.honor<50?1:0));q.reliability=clamp(q.reliability+(q.reliability>50?-1:q.reliability<50?1:0));q.fear=clamp(q.fear-(q.fear>10?1:0));}
 recalcRumorHeat();
}
function counterRumorOpinions(r,factor=.5){
 const q=ensureCommunityReputation();for(const id of r.knownIds||[]){const n=npcById(id),o=q.opinions[id];if(!o)continue;const raw=rumorOpinionDelta(r,n);const restore=Math.max(1,Math.round(Math.abs(raw)*factor));o.score=Math.max(-100,Math.min(100,o.score-r.polarity*restore));if(n?.alive){if(r.polarity<0)adjustNPC(n,{rel:Math.round(restore/5),trust:Math.round(restore/4),respect:Math.round(restore/4),grudge:-Math.round(restore/3)},'Dolaşan sözün başka bir yüzünü de duymaya başladı.');}}
}
function reputationActionIssue(rumorId,id){
 const r=ensureCommunityReputation().rumors.find(x=>x.id===rumorId);if(!r||r.status!=='active')return 'Bu söz artık açık bir mesele değil.';
 if(id==='answer')return '';
 if(id==='confront'){if(!r.sourceId||!npcById(r.sourceId)?.alive)return 'Sözün yaşayan kaynağı belli değil.';return '';}
 if(id==='repair'){if(r.polarity>=0||!r.truth)return 'Telafi edilecek doğrulanmış bir zarar sözü yok.';const cost=Math.max(2,Math.ceil(r.severity/14));if(s.wealth<cost)return cost+' servet telafi payı gerekiyor.';return '';}
 return 'İtibar eylemi bulunamadı.';
}
function reputationAction(rumorId,id){
 const issue=reputationActionIssue(rumorId,id);if(issue){notice(issue);return false;}const q=ensureCommunityReputation(),r=q.rumors.find(x=>x.id===rumorId);
 return performAction({kind:'reputation',id,rumorId},()=>{
  r.responses++;
  if(id==='answer'){
   const chance=Math.max(.12,Math.min(.92,.28+(s.skills.speech||0)/180+q.reliability/450+q.honor/650-r.severity/260+(r.truth?-.08:.12)));
   if(Math.random()<chance){r.status='countered';r.spreadPenalty=.8;q.countered++;counterRumorOpinions(r,r.truth?.45:.85);applyCommunityAxes({reliability:r.truth?2:4,honor:r.truth?1:3},'Dolaşan söze açıkça cevap verdin.');log('Dolaşan söze verdiğin açık cevap etkili oldu.','good');}
   else{r.severity=clamp(r.severity+5);r.spreadPenalty=Math.max(0,r.spreadPenalty-.05);applyCommunityAxes({reliability:-2},'Verdiğin cevap ikna edici bulunmadı.');log('Verdiğin cevap sözü susturmadı.','bad');}
  }else if(id==='confront'){
   const src=npcById(r.sourceId),chance=Math.max(.15,Math.min(.88,.32+(s.skills.speech||0)/220+(s.prestige||0)/500+(src?.bonds?.respect||0)/600-(src?.bonds?.grudge||0)/300));
   if(chance>Math.random()){r.spreadPenalty=Math.min(.8,r.spreadPenalty+.38);adjustNPC(src,{rel:-3,trust:-2,fear:4,grudge:3},'Yaydığı söz nedeniyle doğrudan yüzleştin.');log(safeText(src.name)+' sözü daha fazla yaymama konusunda geri adım attı.','good');}
   else{r.severity=clamp(r.severity+4);adjustNPC(src,{rel:-5,trust:-4,grudge:7},'Yaydığı söz nedeniyle sert biçimde yüzleştin.');log('Yüzleşme sözü daha da büyüttü.','bad');}
  }else if(id==='repair'){
   const cost=Math.max(2,Math.ceil(r.severity/14));s.wealth-=cost;economyLedger('reputation',-cost,'Toplumsal telafi');r.status='repaired';r.spreadPenalty=.8;q.repaired++;counterRumorOpinions(r,.72);applyCommunityAxes({honor:Math.max(2,Math.round(r.severity/12)),reliability:2,generosity:2},'Doğrulanmış bir zararı telafi edip açıkça sorumluluk aldın.');log(cost+' servetlik telafiyle dolaşan sözün etkisini azalttın.','good');
  }
  recalcRumorHeat();
 },'Adın hakkında dolaşan sözle ilgilenmekle bir ay geçti.');
}
function communityCareerBonus(r){
 const q=ensureCommunityReputation(),good=communityGoodName(),localNeg=activeCommunityRumors(-1).reduce((a,x)=>a+x.severity*rumorLocalWeight(x),0);
 let b=(q.reliability-50)/520+(good-50)/750-localNeg/6500;
 if(r?.path==='state')b+=(q.honor-50)/650;if(r?.path==='trade')b+=(q.reliability-50)/700;if(r?.path==='culture')b+=(good-50)/900;return Math.max(-.16,Math.min(.13,b));
}
function communityMarriageBonus(n){
 const q=ensureCommunityReputation(),o=communityOpinion(n,false)?.score||0;return Math.max(-.14,Math.min(.12,(q.honor-50)/700+(q.reliability-50)/900+o/500-q.rumorHeat/1200));
}
function communityCouncilModifier(n){
 const q=ensureCommunityReputation(),o=communityOpinion(n,false)?.score||0;let v=o/28+(q.reliability-50)/24+(q.honor-50)/30-q.rumorHeat/55;return Math.max(-2,Math.min(2,Math.round(v)));
}
function communityJusticePressure(){
 const q=ensureCommunityReputation(),bad=activeCommunityRumors(-1).reduce((a,r)=>a+r.severity*rumorLocalWeight(r),0);return Math.max(-.08,Math.min(.18,bad/1200+(50-q.honor)/700+(50-q.reliability)/900));
}
function applyCommunityReputationEffect(target,spec={}){
 if(!spec)return null;const known=[];if(target?.id)known.push(target.id);for(const id of spec.knownIds||[])known.push(id);
 return recordPublicWord(spec.kind||'event',spec.text||'Bu olay hakkında çevrede söz dolaşmaya başladı.',{honor:spec.honor||0,reliability:spec.reliability||0,generosity:spec.generosity||0,fear:spec.fear||0},{truth:spec.truth!==false,polarity:spec.polarity,severity:spec.severity,sourceId:spec.sourceTarget?target?.id:(spec.sourceId||null),knownIds:known,rumor:spec.rumor!==false});
}
function communityReputationSummaryHtml(){
 const q=ensureCommunityReputation(),bad=activeCommunityRumors(-1),good=activeCommunityRumors(1);
 let html='<div class="card"><h3>🗣 Sözün ve Adın</h3><p><b>'+safeText(communityReputationLabel())+'</b> • iyi ad '+communityGoodName()+'/100<br>Onur '+q.honor+' • sözüne güven '+q.reliability+' • cömertlik '+q.generosity+' • çekince '+q.fear+'<br>Dolaşan söz baskısı '+q.rumorHeat+'/100 • yayılan aktarım '+q.spreadCount+'</p></div>';
 if(bad.length)html+='<h3 class="sectionTitle">Hakkında Dolaşan Sözler</h3><div class="grid2">'+bad.slice(0,6).map(r=>{const src=npcById(r.sourceId),answer="reputationAction('"+r.id+"','answer')",confront="reputationAction('"+r.id+"','confront')",repair="reputationAction('"+r.id+"','repair')";return '<div class="card"><h3>🔥 '+safeText(r.kind==='crime'?'Töre Sözü':r.truth?'Olumsuz Söz':'Doğrulanmamış Söz')+'</h3><p>'+safeText(r.text)+'<br>Yayılım '+r.knownIds.length+' kişi • ağırlık '+r.severity+'/100'+(src?'<br>İlk kaynak: '+safeText(src.name):'')+'</p><div class="actions">'+actionButton('Açıkça cevap ver',{kind:'reputation',id:'answer',rumorId:r.id},answer,'Hitabet, mevcut güven ve sözün ağırlığı etkiler.')+(src?.alive?actionButton('Kaynağıyla yüzleş',{kind:'reputation',id:'confront',rumorId:r.id},confront,'Yayılımı durdurabilir; başarısız olursa sözü büyütebilir.'):'')+(r.truth?actionButton('Zararı telafi et',{kind:'reputation',id:'repair',rumorId:r.id},repair,Math.max(2,Math.ceil(r.severity/14))+' servet • sorumluluk alıp sözün etkisini azalt.'):'')+'</div></div>';}).join('')+'</div>';
 if(good.length)html+='<div class="card"><h3>🌿 İyi Sözler</h3><p>'+good.slice(0,5).map(r=>safeText(r.text)+' • '+r.knownIds.length+' kişi duymuş').join('<br>')+'</p></div>';
 return html;
}
function inheritCommunityReputation(oldQ,oldName='Ailen'){
 if(!oldQ)return null;const q={honor:clamp(50+Math.round(((oldQ.honor??50)-50)*.28)),reliability:clamp(50+Math.round(((oldQ.reliability??50)-50)*.24)),generosity:clamp(45+Math.round(((oldQ.generosity??45)-45)*.22)),fear:clamp(10+Math.round(((oldQ.fear??10)-10)*.18)),rumorHeat:0,rumors:[],history:[{year:s.year+s.age,age:s.age,type:'legacy',text:oldName+' adından kalan aile ünü yeni kuşağa gölge ve dayanak oldu.'}],opinions:{},countered:0,spreadCount:0,repaired:0};
 return q;
}

function ensureSocialLife(){
 if(!s.socialLife||typeof s.socialLife!=='object'||Array.isArray(s.socialLife))s.socialLife={};
 const x=s.socialLife;x.profiles=x.profiles&&typeof x.profiles==='object'&&!Array.isArray(x.profiles)?x.profiles:{};x.groups=Array.isArray(x.groups)?x.groups:[];x.referrals=Array.isArray(x.referrals)?x.referrals:[];x.history=Array.isArray(x.history)?x.history.slice(-80):[];
 x.totalGatherings=Math.max(0,Math.round(x.totalGatherings||0));x.reconnections=Math.max(0,Math.round(x.reconnections||0));
 for(const n of s.friends||[])if(n)ensureFriendProfile(n);
 x.groups=x.groups.filter(g=>g&&Array.isArray(g.memberIds)&&g.memberIds.length>=2);for(const g of x.groups){g.id=g.id||('circle_'+Math.random().toString(36).slice(2));g.name=g.name||'Dost Çevresi';g.memberIds=[...new Set(g.memberIds)];g.cohesion=clamp(Number.isFinite(g.cohesion)?g.cohesion:55);g.tension=clamp(Number.isFinite(g.tension)?g.tension:5);g.gatherings=Math.max(0,Math.round(g.gatherings||0));g.history=Array.isArray(g.history)?g.history.slice(-20):[];}
 return x;
}
function ensureFriendProfile(n){
 if(!n)return null;if(!s.socialLife||typeof s.socialLife!=='object'||Array.isArray(s.socialLife))s.socialLife={profiles:{},groups:[],referrals:[],history:[]};
 s.socialLife.profiles=s.socialLife.profiles&&typeof s.socialLife.profiles==='object'&&!Array.isArray(s.socialLife.profiles)?s.socialLife.profiles:{};
 let p=s.socialLife.profiles[n.id];if(!p)p=s.socialLife.profiles[n.id]={friendId:n.id,startedYear:s.year+s.age,startedAge:s.age,monthsKnown:0,monthsDistant:0,sharedExperiences:0,secrets:0,supportGiven:0,supportReceived:0,chosenConfidant:false,childhood:s.age<=13&&n.age<=15,lastInteractionYear:s.year+s.age,lastInteractionMonth:currentMonth(),status:'active',history:[]};
 p.monthsKnown=Math.max(0,Math.round(p.monthsKnown||0));p.monthsDistant=Math.max(0,Math.round(p.monthsDistant||0));p.sharedExperiences=Math.max(0,Math.round(p.sharedExperiences||0));p.secrets=Math.max(0,Math.round(p.secrets||0));p.supportGiven=Math.max(0,Math.round(p.supportGiven||0));p.supportReceived=Math.max(0,Math.round(p.supportReceived||0));p.chosenConfidant=!!p.chosenConfidant;p.childhood=!!p.childhood;p.history=Array.isArray(p.history)?p.history.slice(-25):[];p.status=p.status||'active';
 n.statusFlags=n.statusFlags||{};if(p.childhood)n.statusFlags.childhoodFriend=true;return p;
}
function friendTier(n){
 const p=ensureFriendProfile(n),b=normalizeBonds(n);if(!n?.alive)return 'Kaybedilen dost';
 if(p.status==='distant'||p.monthsDistant>=18||(n.rel<40&&b.trust<40))return p.childhood?'Uzaklaşmış çocukluk dostu':'Uzaklaşmış dost';
 if(p.chosenConfidant&&n.rel>=72&&b.trust>=72)return 'Sırdaş';
 if(n.rel>=78&&b.trust>=68&&p.sharedExperiences>=3)return p.childhood?'Yakın çocukluk dostu':'Yakın dost';
 return p.childhood?'Çocukluk dostu':'Dost';
}
function friendRolePath(n){return D.careers.find(r=>r.name===n?.role)?.path||null;}
function friendCircleFor(n){return ensureSocialLife().groups.find(g=>g.memberIds.includes(n?.id))||null;}
function autoCreateFriendCircle(){
 const x=ensureSocialLife(),available=s.friends.filter(n=>n?.alive&&n.rel>=55&&(n.bonds?.trust||0)>=45&&!x.groups.some(g=>g.memberIds.includes(n.id))).slice(0,6);
 if(available.length<3)return null;
 const g={id:'circle_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),name:'Yakın Dost Çevresi',memberIds:available.map(n=>n.id),cohesion:58,tension:5,gatherings:0,createdYear:s.year+s.age,history:[]};
 x.groups.push(g);for(let i=0;i<available.length;i++)for(let j=i+1;j<available.length;j++)adjustSocialLink(available[i],available[j],{score:12,trust:5,tag:'friend'},'Aynı dost çevresinde daha sık görüşmeye başladılar.');
 x.history.unshift({year:s.year+s.age,type:'circle_created',groupId:g.id,members:[...g.memberIds]});return g;
}
function friendCareerReferralBonus(r){
 if(!r)return 0;const year=s.year+s.age;ensureSocialLife().referrals=ensureSocialLife().referrals.filter(x=>x.expiresYear>=year&&s.friends.some(n=>n.id===x.friendId&&n.alive));
 return ensureSocialLife().referrals.some(x=>x.path===r.path&&x.expiresYear>=year)?.08:0;
}
function friendReconnectionCandidates(){return s.friends.filter(n=>n?.alive&&ensureFriendProfile(n).status==='distant');}
function friendInteractionStamp(n,kind='time'){
 const p=ensureFriendProfile(n);p.lastInteractionYear=s.year+s.age;p.lastInteractionMonth=currentMonth();p.monthsDistant=0;p.status='active';p.sharedExperiences++;if(kind==='secret')p.secrets++;p.history.unshift({year:s.year+s.age,age:s.age,kind});p.history=p.history.slice(0,25);
}
function friendshipAction(index,id){
 const n=s.friends[index];if(!n?.alive)return false;const p=ensureFriendProfile(n);
 return performAction({kind:'friendship',index,id},()=>{
  if(id==='deepen'){friendInteractionStamp(n,'time');adjustNPC(n,{rel:7,trust:6,respect:2,grudge:-3},'Dostluğunuzu özellikle güçlendirmek için birlikte zaman geçirdiniz.');apply({happiness:3});}
  else if(id==='confidant'){if(n.rel<72||(n.bonds?.trust||0)<72){notice('Sırdaşlık için ilişki ve güven en az 72 olmalı.');return;}for(const fp of Object.values(ensureSocialLife().profiles))if(fp.friendId!==n.id&&fp.chosenConfidant&&Math.random()<.5)fp.chosenConfidant=false;p.chosenConfidant=true;friendInteractionStamp(n,'secret');adjustNPC(n,{rel:4,trust:7},'Birbirinizi sırdaş kabul ettiniz.');rememberNPC(n,'confidant','Aranızdaki dostluk sırdaşlığa dönüştü.',7);}
  else if(id==='reconnect'){const before=p.monthsDistant,chance=Math.min(.92,.28+n.rel/190+(n.bonds?.trust||0)/220+(p.childhood?.12:0)-Math.min(.25,before/120));if(Math.random()<chance){p.status='active';p.monthsDistant=0;friendInteractionStamp(n,'reconnect');ensureSocialLife().reconnections++;adjustNPC(n,{rel:8,trust:6,grudge:-5},'Uzun aradan sonra yeniden görüştünüz.');apply({happiness:4});log(safeText(n.name)+' ile eski dostluğunuzu yeniden canlandırdın.','good');}else{adjustNPC(n,{rel:-1},'Yıllar sonra yeniden yakınlaşmak kolay olmadı.');log(safeText(n.name)+' ile yeniden yakınlaşma bu kez istediğin gibi olmadı.');}}
  else if(id==='referral'){const path=friendRolePath(n);if(!path){notice('Bu dostun şu an seni bir görev çevresine sokabilecek konumda değil.');return;}const x=ensureSocialLife();x.referrals=x.referrals.filter(r=>!(r.friendId===n.id&&r.path===path));x.referrals.push({friendId:n.id,path,year:s.year+s.age,expiresYear:s.year+s.age+2});friendInteractionStamp(n,'referral');adjustNPC(n,{rel:3,trust:3,respect:2},'Seni kendi görev çevresinden insanlarla tanıştırdı.');log(safeText(n.name)+' '+pathName(path)+' çevresinde sana kefil oldu.','good');}
  else if(id==='matchmake'){if(s.partner?.alive||s.age<16){notice('Şu anda eş adayı tanıştırmasına uygun değilsin.');return;}const gender=s.gender==='male'?'female':'male',age=s.age<18?s.age:Math.max(18,s.age+rng(-4,4));s.partner=normalizeNPC({name:pick(D.realms[s.realm][gender]),gender,age,alive:true,rel:rng(58,70),type:'Eş adayı',realm:s.realm,place:s.place,tribe:pick(D.realms[s.realm].tribes)},'Eş adayı');s.partner.statusFlags.introducedByFriend=n.id;adjustNPC(s.partner,{trust:7,respect:4},safeText(n.name)+' aracılığıyla tanıştınız.');friendInteractionStamp(n,'matchmake');adjustNPC(n,{rel:3,trust:2},'Seni güvendiği biriyle tanıştırdı.');s.married=false;ensureRomance().current=null;ensureRomance();ensurePartnerFamily(true);log(safeText(n.name)+' seni '+safeText(s.partner.name)+' ile tanıştırdı.','major');}
  else if(id==='comrade'){if(s.age<18||!['Alp','Akıncı','Tarkan'].includes(n.role)){notice('Bu dostun şu an sefer yoldaşı olmaya uygun değil.');return;}if(!s.military.comrades.some(x=>x.id===n.id))s.military.comrades.push(n);n.statusFlags=n.statusFlags||{};n.statusFlags.friendComrade=true;friendInteractionStamp(n,'comrade');adjustNPC(n,{trust:6,respect:6,rel:4},'Dostluğunuz sefer yoldaşlığına da dönüştü.');log(safeText(n.name)+' artık sefer yoldaşların arasında.','good');}
 },id==='reconnect'?'Eski dostunun izini bulup görüşmekle bir ay geçti.':'Dostluğuna bir ay ayırdın.');
}
function friendCircleAction(groupId,id){
 const x=ensureSocialLife(),g=x.groups.find(z=>z.id===groupId);if(!g)return false;
 const members=g.memberIds.map(npcById).filter(n=>n?.alive);if(members.length<2)return false;
 return performAction({kind:'friendCircle',groupId,id},()=>{
  if(id==='gather'){g.gatherings++;x.totalGatherings++;g.cohesion=clamp(g.cohesion+8);g.tension=clamp(g.tension-5);for(const n of members){friendInteractionStamp(n,'group');adjustNPC(n,{rel:3,trust:2},'Dost çevreniz birlikte bir gün geçirdi.');}for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++)adjustSocialLink(members[i],members[j],{score:4,trust:2,grudge:-2,tag:'friend'},'Dost çevresi buluşmasında bağları güçlendi.');apply({happiness:5});}
  else if(id==='mediate'){g.tension=clamp(g.tension-14);g.cohesion=clamp(g.cohesion+4);const links=[];for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){const l=socialLinkBetween(members[i],members[j],true);if(l.grudge>0||l.score<20)links.push({a:members[i],b:members[j],l});}for(const q of links.slice(0,3))adjustSocialLink(q.a,q.b,{score:6,trust:2,grudge:-8,tag:'friend'},'Aralarını bulmaya çalıştın.');apply({prestige:1});}
  g.history.unshift({year:s.year+s.age,id,cohesion:g.cohesion,tension:g.tension});g.history=g.history.slice(0,20);
 },id==='gather'?'Dost çevrenle bir ayın önemli kısmını birlikte geçirdin.':'Dost çevrendeki gerilimi çözmeye bir ay ayırdın.');
}
function tickFriendshipMonth(action={}){
 const x=ensureSocialLife();
 for(let i=0;i<s.friends.length;i++){
  const n=s.friends[i];if(!n?.alive)continue;const p=ensureFriendProfile(n);p.monthsKnown++;p.monthsSinceContact=Math.max(0,Math.round(p.monthsSinceContact||0));
  const direct=(action.kind==='friendship'&&action.index===i)||(action.kind==='npc'&&action.group==='friends'&&action.index===i)||(action.kind==='friendCircle'&&friendCircleFor(n)?.id===action.groupId);
  if(direct){p.monthsSinceContact=0;p.monthsDistant=0;p.status='active';}
  else{p.monthsSinceContact++;const remote=(n.place&&n.place!==s.place)||(n.realm&&n.realm!==s.realm);if(remote)p.monthsDistant+=2;else if(p.monthsSinceContact>=6)p.monthsDistant++;}
  if(p.monthsSinceContact>=12&&p.monthsSinceContact%6===0){const loyal=n.traits?.includes('sadik');n.rel=clamp(n.rel-(loyal?0:1));normalizeBonds(n);n.bonds.trust=clamp(n.bonds.trust-1);}
  if(p.monthsDistant>=18||p.monthsSinceContact>=30)p.status='distant';
 }
 for(const g of x.groups){
  const members=g.memberIds.map(npcById).filter(n=>n?.alive);if(members.length<2)continue;let friction=0,good=0;
  for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){const l=socialLinkBetween(members[i],members[j],true);if(l.score<10||l.grudge>35)friction++;if(l.score>=45&&l.trust>=55)good++;}
  if(friction){g.tension=clamp(g.tension+Math.min(3,friction));g.cohesion=clamp(g.cohesion-1);}else if(g.tension>0&&good)g.tension=clamp(g.tension-1);
 }
}
function friendshipYearTick(){
 const x=ensureSocialLife();autoCreateFriendCircle();
 for(const n of s.friends.filter(n=>n?.alive)){
  const p=ensureFriendProfile(n);
  if(n.age>=16&&Math.random()<.045&&!n.statusFlags?.guardianContact&&!n.statusFlags?.educationMentor){
   const places=D.realms[n.realm||s.realm]?.places||[];const opts=places.filter(q=>q!==n.place);if(opts.length){const old=n.place||s.place;n.place=pick(opts);p.history.unshift({year:s.year+s.age,kind:'moved',from:old,to:n.place});rememberNPC(n,'move',old+' çevresinden '+n.place+' çevresine taşındı.',3);}
  }
  if(p.status==='distant'&&p.childhood&&p.monthsDistant>=36&&Math.random()<.12)rememberNPC(n,'old_friend','Çocukluk dostluğunuz uzun yıllardır seyrek görüşmelerle sürüyor.',4);
 }
 x.referrals=x.referrals.filter(r=>r.expiresYear>=s.year+s.age&&s.friends.some(n=>n.id===r.friendId&&n.alive));
 for(const g of x.groups){g.memberIds=g.memberIds.filter(id=>npcById(id));if(g.memberIds.filter(id=>npcById(id)?.alive).length<2)g.archived=true;}
}
function friendshipSummaryHtml(){
 const x=ensureSocialLife(),living=s.friends.filter(n=>n?.alive),distant=living.filter(n=>ensureFriendProfile(n).status==='distant'),conf=living.filter(n=>ensureFriendProfile(n).chosenConfidant&&n.rel>=72&&(n.bonds?.trust||0)>=72),childhood=living.filter(n=>ensureFriendProfile(n).childhood);
 let html='<div class="card"><h3>🫂 Dostluk ve Sosyal Çevre</h3><p>Yaşayan dost '+living.length+' • çocukluk dostu '+childhood.length+' • sırdaş '+conf.length+' • uzaklaşmış '+distant.length+' • dost çevresi '+x.groups.filter(g=>!g.archived).length+'</p></div>';
 if(living.length)html+='<div class="grid2">'+living.slice(0,24).map((n,i)=>{const p=ensureFriendProfile(n),circle=friendCircleFor(n),path=friendRolePath(n);return '<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(friendTier(n))+' • '+n.age+' yaş • '+safeText(n.role||'')+'<br>İlişki '+n.rel+' • güven '+(n.bonds?.trust||0)+' • ortak anı '+p.sharedExperiences+(circle?'<br>Çevre: '+safeText(circle.name):'')+(p.status==='distant'?'<br>⚠ Uzun süredir görüşmüyorsunuz':'')+'</p><div class="actions"><button class="mini" onclick="friendshipAction('+i+',\'deepen\')">Dostluğu güçlendir</button>'+(n.rel>=72&&(n.bonds?.trust||0)>=72?'<button class="mini" onclick="friendshipAction('+i+',\'confidant\')">Sırdaş ol</button>':'')+(p.status==='distant'?'<button class="mini" onclick="friendshipAction('+i+',\'reconnect\')">Yeniden görüş</button>':'')+(path?'<button class="mini" onclick="friendshipAction('+i+',\'referral\')">Görev çevresine tanıştır</button>':'')+(!s.partner?.alive&&s.age>=16?'<button class="mini" onclick="friendshipAction('+i+',\'matchmake\')">Eş adayı tanıştırmasını iste</button>':'')+(['Alp','Akıncı','Tarkan'].includes(n.role)&&s.age>=18?'<button class="mini" onclick="friendshipAction('+i+',\'comrade\')">Sefer yoldaşı ol</button>':'')+'</div></div>';}).join('')+'</div>';
 const groups=x.groups.filter(g=>!g.archived&&g.memberIds.filter(id=>npcById(id)?.alive).length>=2);
 if(groups.length)html+='<h3 class="sectionTitle">Dost Çevreleri</h3><div class="grid2">'+groups.map(g=>'<div class="card"><h3>🔥 '+safeText(g.name)+'</h3><p>'+g.memberIds.map(npcById).filter(n=>n?.alive).map(n=>safeText(n.name)).join(' • ')+'<br>Uyum '+g.cohesion+' • gerilim '+g.tension+' • buluşma '+g.gatherings+'</p><div class="actions"><button class="mini" onclick="friendCircleAction('+JSON.stringify(g.id)+',\'gather\')">Birlikte buluş</button>'+(g.tension>=15?'<button class="mini" onclick="friendCircleAction('+JSON.stringify(g.id)+',\'mediate\')">Aralarını bul</button>':'')+'</div></div>').join('')+'</div>';
 return html;
}
function applyFriendshipEvent(eventId,choiceIndex,target){
 const x=ensureSocialLife();if(!target)return;const p=s.friends.some(n=>n.id===target.id)?ensureFriendProfile(target):null;
 if(eventId==='friend_returns'&&p){if(choiceIndex===0){p.status='active';p.monthsDistant=0;p.monthsSinceContact=0;x.reconnections++;adjustNPC(target,{rel:6,trust:5,grudge:-3},'Yıllar sonra dostluğunuzu yeniden canlandırdınız.');}else p.monthsDistant+=6;}
 if(eventId==='friend_work_opening'&&choiceIndex===0){const path=friendRolePath(target);if(path){x.referrals.push({friendId:target.id,path,year:s.year+s.age,expiresYear:s.year+s.age+2});adjustNPC(target,{trust:3,respect:2},'Seni kendi iş çevresine önerdi.');}}
 if(eventId==='friend_circle_conflict'){const g=friendCircleFor(target);if(g){if(choiceIndex===0){g.tension=clamp(g.tension-12);g.cohesion=clamp(g.cohesion+5);}else{g.tension=clamp(g.tension+10);g.cohesion=clamp(g.cohesion-6);}}}
}


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

const CHILD_TRAINING_TRACKS={
 home:{name:'Ocak ve oba terbiyesi',min:5,cost:0,guidance:'family',skills:['riding','trade','speech'],role:null,mentor:'Aile büyüğü'},
 alp:{name:'Alp talimi',min:10,cost:2,guidance:'war',skills:['riding','archery','combat'],role:'Alp',mentor:'Alp eğiticisi'},
 craft:{name:'Usta yanında zanaat',min:10,cost:2,guidance:'craft',skills:['craft','trade'],role:'Demirci',mentor:'Usta'},
 bitig:{name:'Bitig ve söz terbiyesi',min:8,cost:2,guidance:'wisdom',skills:['literacy','speech'],role:'Bitigçi',mentor:'Bitigçi'},
 trade:{name:'Takas ve kervan yetişimi',min:12,cost:2,guidance:'trade',skills:['trade','speech','riding'],role:'Tüccar',mentor:'Kervan ustası'},
 ozan:{name:'Ozan ve anlatı terbiyesi',min:10,cost:2,guidance:'wisdom',skills:['speech','literacy'],role:'Ozan',mentor:'Ozan'}
};
function normalizeChildTraining(p,c){
 let t=p.training;if(!t||typeof t!=='object'||Array.isArray(t))t=p.training={};
 t.track=CHILD_TRAINING_TRACKS[t.track]?t.track:null;t.progress=clamp(Number.isFinite(t.progress)?t.progress:0);t.performance=clamp(Number.isFinite(t.performance)?t.performance:50);
 t.months=Math.max(0,Math.round(t.months||0));t.parentSupport=Math.max(0,Math.round(t.parentSupport||0));t.changes=Math.max(0,Math.round(t.changes||0));t.mentorId=t.mentorId||null;
 t.startedYear=Number.isFinite(t.startedYear)?t.startedYear:null;t.lastEvalYear=Number.isFinite(t.lastEvalYear)?t.lastEvalYear:null;
 t.completed=Array.isArray(t.completed)?[...new Set(t.completed.filter(id=>CHILD_TRAINING_TRACKS[id]))].slice(-6):[];
 t.evaluations=Array.isArray(t.evaluations)?t.evaluations.slice(0,16):[];t.history=Array.isArray(t.history)?t.history.slice(0,30):[];
 if(t.track&&c&&c.age<CHILD_TRAINING_TRACKS[t.track].min)t.track=null;
 return t;
}
function childTrainingProfile(c){return c?normalizeChildTraining(ensureChildProfile(c),c):null;}
function childTrainingDef(c){const t=childTrainingProfile(c);return t?.track?CHILD_TRAINING_TRACKS[t.track]:null;}
function childTrainingMentor(c,create=true){
 const t=childTrainingProfile(c),d=childTrainingDef(c);if(!c||!t||!d||t.track==='home')return null;
 let n=ensureEducation().contacts.find(x=>x.alive&&x.statusFlags?.childTrainingChildId===c.id&&x.statusFlags?.childTrainingTrack===t.track);
 if(!n&&create){
  const cfg=D.realms[s.realm],gender=pick(['male','female']),age=Math.max(24,s.age+rng(4,18));
  n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,type:d.mentor,role:d.mentor,rel:rng(48,62),realm:s.realm,place:s.place,tribe:s.tribe,goal:t.track==='alp'?'war':t.track==='trade'?'wealth':t.track==='craft'?'mastery':'wisdom'},d.mentor);
  n.statusFlags.childTrainingMentor=true;n.statusFlags.childTrainingChildId=c.id;n.statusFlags.childTrainingTrack=t.track;ensureEducation().contacts.push(n);
 }
 if(n)t.mentorId=n.id;return n||null;
}
function childTrainingSkillAverage(c,d){
 const vals=(d?.skills||[]).map(k=>c.skills?.[k]||0);return vals.length?vals.reduce((a,v)=>a+v,0)/vals.length:0;
}
function childTrainingScore(c,p){
 const t=normalizeChildTraining(p,c),d=t.track?CHILD_TRAINING_TRACKS[t.track]:null;if(!d)return 0;
 const skill=childTrainingSkillAverage(c,d),mentor=childTrainingMentor(c,false),mentorTrust=mentor?.bonds?.trust||50;
 return clamp(Math.round(t.performance*.38+p.wellbeing*.2+p.attention*.14+skill*.18+mentorTrust*.1));
}
function childTrainingGradeLabel(v){return v>=85?'Çok güçlü':v>=70?'İyi':v>=55?'Düzenli':v>=40?'Zorlanıyor':'Ciddi destek gerekiyor';}
function childTrainingCareerRole(c,p){
 const t=normalizeChildTraining(p,c),id=t.completed.at(-1)||(t.track&&t.progress>=72?t.track:null),d=id?CHILD_TRAINING_TRACKS[id]:null;return d?.role||null;
}
function childTrainingActionIssue(index,id,track=null){
 const c=s.children[index];if(!c?.alive||c.age>=18)return 'Bu çocuk için yetişme dönemi sona ermiş.';const p=ensureChildProfile(c),t=normalizeChildTraining(p,c);
 if(id==='enroll'){
  const d=CHILD_TRAINING_TRACKS[track];if(!d)return 'Yetişme düzeni bulunamadı.';if(c.age<d.min)return d.min+' yaşında açılır.';if(t.track===track)return 'Çocuk zaten bu yetişme düzeninde.';if(s.wealth<d.cost)return d.cost+' servet usta/araç payı gerekiyor.';return '';
 }
 if(!t.track)return 'Önce çocuk için bir yetişme düzeni seç.';if(id==='mentor'&&t.track==='home')return 'Ocak terbiyesinde ayrı bir usta görüşmesi yok.';if(!['support','mentor'].includes(id))return 'Yetişme eylemi bulunamadı.';return '';
}
function childTrainingAction(index,id,track=null){
 const issue=childTrainingActionIssue(index,id,track);if(issue){notice(issue);return false;}const c=s.children[index],p=ensureChildProfile(c),t=normalizeChildTraining(p,c);
 return performAction({kind:'childTraining',index,id,track},()=>{
  if(id==='enroll'){
   const d=CHILD_TRAINING_TRACKS[track],old=t.track;if(d.cost){s.wealth-=d.cost;economyLedger('training',-d.cost,c.name+' için '+d.name);}
   if(old)t.history.unshift({year:s.year+s.age,type:'switch',from:old,to:track,progress:t.progress,performance:t.performance});
   t.track=track;t.progress=0;t.performance=clamp(Math.round((t.performance+p.wellbeing+p.attention)/3));t.months=0;t.mentorId=null;t.startedYear=s.year+s.age;t.changes+=old?1:0;
   p.guidance=d.guidance;if(PARENTING_PATHS[d.guidance]?.goal)c.goal=PARENTING_PATHS[d.guidance].goal;const mentor=childTrainingMentor(c,true);
   rememberNPC(c,'training',d.name+' düzenine başladı'+(mentor?' • eğiticisi '+mentor.name:'')+'.',7);adjustNPC(c,{trust:2,respect:2},'Yetişme yoluna emek ve kaynak ayırdın.');
  }else if(id==='support'){
   const d=childTrainingDef(c);t.parentSupport++;t.progress=clamp(t.progress+7);t.performance=clamp(t.performance+6);p.attention=clamp(p.attention+5);p.wellbeing=clamp(p.wellbeing+3);p.neglectMonths=0;
   const k=pick(d.skills);childLearningSkill(c,k,3);adjustNPC(c,{rel:4,trust:5,respect:3},'Yetişme düzenindeki çalışmalarına doğrudan destek oldun.');t.history.unshift({year:s.year+s.age,type:'support',skill:k,progress:t.progress});
  }else if(id==='mentor'){
   const mentor=childTrainingMentor(c,true);t.performance=clamp(t.performance+5);t.progress=clamp(t.progress+3);if(mentor){adjustNPC(mentor,{rel:3,trust:4,respect:2},c.name+' hakkında gelişimini ve eksiklerini konuştunuz.');adjustSocialLink(c,mentor,{score:3,trust:3},'Yetişme sürecinde düzenli görüşmeye başladılar.');}t.history.unshift({year:s.year+s.age,type:'mentor',mentorId:mentor?.id||null,progress:t.progress});
  }
  t.history=t.history.slice(0,30);
 },safeText(c.name)+' için yetişme düzenine bir ay ayırdın.');
}
function childTrainingMonthTick(c,p,engaged=false){
 const t=normalizeChildTraining(p,c),d=t.track?CHILD_TRAINING_TRACKS[t.track]:null;if(!d||c.age<d.min||c.age>=18||t.completed.includes(t.track))return;
 t.months++;let gain=1+(p.wellbeing>=60?1:0)+(p.attention>=60?1:0)+(c.traits?.includes('caliskan')?1:0)-(p.neglectMonths>=7?1:0);if(engaged)gain+=1;t.progress=clamp(t.progress+Math.max(1,gain));
 const balance=(p.wellbeing+p.attention)/2;if(balance>=65)t.performance=clamp(t.performance+1);else if(balance<40)t.performance=clamp(t.performance-1);
 if(t.months%3===0){const k=pick(d.skills);childLearningSkill(c,k,t.performance>=70?2:1);}
 if(t.progress>=100){
  t.progress=100;if(!t.completed.includes(t.track))t.completed.push(t.track);c.statusFlags=c.statusFlags||{};c.statusFlags.completedTrainingTracks=[...t.completed];c.prestige=clamp((c.prestige||0)+(t.performance>=75?5:2));
  rememberNPC(c,'training',d.name+' için temel yetişme dönemini tamamladı.',8);log(safeText(c.name)+' '+safeText(d.name)+' yetişimini tamamladı.','major');
 }
}
function childTrainingYearTick(c,p){
 const t=normalizeChildTraining(p,c),d=t.track?CHILD_TRAINING_TRACKS[t.track]:null;if(!d||c.age<d.min||c.age>=18)return;
 const score=childTrainingScore(c,p);t.performance=clamp(Math.round((t.performance*2+score)/3));t.lastEvalYear=s.year+s.age;
 const row={year:s.year+s.age,age:c.age,track:t.track,score,progress:t.progress,label:childTrainingGradeLabel(score)};t.evaluations.unshift(row);t.evaluations=t.evaluations.slice(0,16);
 if(score>=80){t.progress=clamp(t.progress+5);for(const k of d.skills)if(Math.random()<.35)childLearningSkill(c,k,1);}
 else if(score<40){p.wellbeing=clamp(p.wellbeing-2);adjustNPC(c,{trust:-1},'Yetişme düzeninde zorlandığı bir yıl geçirdi.');}
}
function applyChildTrainingReportEvent(c,index){
 const p=ensureChildProfile(c),t=normalizeChildTraining(p,c);if(!t.track)return;
 if(index===0){t.progress=clamp(t.progress+9);t.performance=clamp(t.performance+6);p.wellbeing=clamp(p.wellbeing+3);p.attention=clamp(p.attention+4);adjustNPC(c,{rel:3,trust:4},'Eksiklerini birlikte kapatmaya çalıştınız.');}
 else if(index===1){t.performance=clamp(t.performance+4);p.expectation=clamp(p.expectation+7);p.wellbeing=clamp(p.wellbeing-3);adjustNPC(c,{respect:4,trust:-2},'Ustanın sözünü öne çıkarıp daha sıkı çalışmasını istedin.');}
 else{t.performance=clamp(t.performance+2);p.freedom=clamp(p.freedom+7);p.wellbeing=clamp(p.wellbeing+4);adjustNPC(c,{rel:4,trust:6},'Kendi istediği yolu ve zorlandığı tarafları dinledin.');}
 const score=childTrainingScore(c,p);t.history.unshift({year:s.year+s.age,type:'report_event',choice:index,score});t.history=t.history.slice(0,30);
}
function childTrainingSummaryHtml(c,index){
 if(c.age<5||c.age>=18)return '';const p=ensureChildProfile(c),t=normalizeChildTraining(p,c),d=t.track?CHILD_TRAINING_TRACKS[t.track]:null,mentor=childTrainingMentor(c,false),last=t.evaluations[0];
 let html='<div class="memoryline"><b>Yetişme düzeni:</b> '+(d?safeText(d.name):'Henüz seçilmedi')+(d?'<br>İlerleme '+t.progress+'/100 • performans '+t.performance+'/100'+(last?' • son değerlendirme '+last.score+'/100 ('+safeText(last.label)+')':'')+(mentor?'<br>Eğitici: '+safeText(mentor.name)+' • güven '+(mentor.bonds?.trust||0):'')+(t.completed.length?'<br>Tamamlanan: '+t.completed.map(id=>safeText(CHILD_TRAINING_TRACKS[id].name)).join(', '):''):'')+'</div>';
 const eligible=Object.entries(CHILD_TRAINING_TRACKS).filter(([,x])=>c.age>=x.min);
 html+='<div class="actions">'+eligible.map(([id,x])=>'<button class="mini '+(t.track===id?'active':'')+'" onclick="childTrainingAction('+index+',\'enroll\','+JSON.stringify(id)+')">'+safeText(x.name)+'</button>').join('')+'</div>';
 if(d)html+='<div class="actions"><button class="mini" onclick="childTrainingAction('+index+',\'support\')">Çalışmasına destek ol</button>'+(t.track!=='home'?'<button class="mini" onclick="childTrainingAction('+index+',\'mentor\')">Eğiticiyle görüş</button>':'')+'</div>';
 return html;
}

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
 p.guidance=PARENTING_PATHS[p.guidance]?p.guidance:'free';normalizeChildTraining(p,c);p.milestones=Array.isArray(p.milestones)?p.milestones:[];p.history=Array.isArray(p.history)?p.history.slice(-30):[];
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
  c.role=childTrainingCareerRole(c,p)||npcCareerFor(c);rememberNPC(c,'upbringing','Yetişkinliğe '+parentingStyleLabel(p).toLowerCase()+' bir aile ortamından çıktı.',7);
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
 for(let i=0;i<s.children.length;i++){const c=s.children[i];if(!c?.alive||c.age>=18)continue;const p=ensureChildProfile(c),direct=(action.kind==='parenting'||action.kind==='childTraining')&&action.index===i,normal=action.kind==='npc'&&action.group==='children'&&action.index===i;
  childTrainingMonthTick(c,p,direct||normal);if(direct||normal){p.neglectMonths=0;p.attention=clamp(p.attention+2);}else{p.neglectMonths++;if(p.neglectMonths>=4&&p.neglectMonths%3===1){p.attention=clamp(p.attention-3);p.wellbeing=clamp(p.wellbeing-2);if(p.neglectMonths>=10)adjustNPC(c,{rel:-1,trust:-2},'Uzun süre sana yeterince zaman ayıramadığını hissetti.');}}
 }
 updateSiblingRivalry();
}
function parentingYearTick(){
 for(const c of s.children.filter(c=>c.alive&&c.age<18)){const p=ensureChildProfile(c);childTrainingYearTick(c,p);if(p.warmth>=60&&p.attention>=55)p.wellbeing=clamp(p.wellbeing+2);if(p.neglectMonths>=9)p.wellbeing=clamp(p.wellbeing-5);if(p.discipline>=75&&p.warmth<40)p.wellbeing=clamp(p.wellbeing-3);}
}
function parentingSummaryHtml(){
 ensureParenting();const kids=s.children.filter(c=>c.alive&&c.age<18);if(!kids.length)return '';
 let html='<div class="card"><h3>🪶 Ebeveynlik</h3><p>Her çocuğun bakım, sıcaklık, disiplin, özgürlük, beklenti ve ilgi geçmişi ayrı tutulur. Bu değerler yaş dönümlerinde kişiliğine, güvenine, becerisine ve yetişkin yoluna yansır.</p></div><div class="grid2">';
 html+=kids.map(c=>{const i=s.children.findIndex(x=>x.id===c.id),p=ensureChildProfile(c),path=PARENTING_PATHS[p.guidance],rival=p.rivalry>=45?' • ⚠ kardeş rekabeti '+p.rivalry:'';return '<div class="card"><h3>'+safeText(c.name)+' • '+c.age+' yaş</h3><p>'+safeText(parentingStyleLabel(p))+'<br>Sıcaklık '+p.warmth+' • disiplin '+p.discipline+' • özgürlük '+p.freedom+'<br>İlgi '+p.attention+' • iyi oluş '+p.wellbeing+' • beklenti '+p.expectation+rival+'<br>Yön: '+safeText(path.name)+'</p><div class="actions"><button class="mini" onclick="parentingAction('+i+',\'care\')">Bakımına zaman ayır</button><button class="mini" onclick="parentingAction('+i+',\'teach\')">Bir şey öğret</button><button class="mini" onclick="parentingAction('+i+',\'listen\')">Dinle</button><button class="mini" onclick="parentingAction('+i+',\'discipline\')">Sınır koy</button>'+(s.children.filter(x=>x.alive&&x.age<18).length>1?'<button class="mini" onclick="parentingAction('+i+',\'mediate\')">Kardeş gerilimini çöz</button>':'')+'</div><div class="actions">'+Object.entries(PARENTING_PATHS).map(([id,g])=>'<button class="mini '+(p.guidance===id?'active':'')+'" onclick="parentingAction('+i+',\'guide\','+JSON.stringify(id)+')">'+safeText(g.name)+'</button>').join('')+'</div>'+childTrainingSummaryHtml(c,i)+'</div>';}).join('');
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


const FAMILY_BRANCH_ENTERPRISES={
 flock:{name:'Sürü işleri',role:'Çoban'},
 smithy:{name:'Demir Ocağı',role:'Demirci'},
 caravan_share:{name:'Kervan payı',role:'Kervan Başı'}
};
const FAMILY_BRANCH_MAJOR_ASSETS=['yurt','flock','smithy','caravan_share'];

function ensureFamilyBranches(){
 if(!s.familyBranches||typeof s.familyBranches!=='object'||Array.isArray(s.familyBranches))s.familyBranches={};
 const f=s.familyBranches;
 f.children=f.children&&typeof f.children==='object'&&!Array.isArray(f.children)?f.children:{};
 f.assetHeirs=f.assetHeirs&&typeof f.assetHeirs==='object'&&!Array.isArray(f.assetHeirs)?f.assetHeirs:{};
 f.stewards=f.stewards&&typeof f.stewards==='object'&&!Array.isArray(f.stewards)?f.stewards:{};
 f.childInLaws=Array.isArray(f.childInLaws)?f.childInLaws.filter(Boolean).map(n=>{const x=normalizeNPC(n,n.type||'Çocuk Eşi'),src=x.statusFlags?.sourceNPCId?adultChildMatchSource(x.statusFlags.sourceNPCId):null;if(!src)return x;src.statusFlags=src.statusFlags||{};src.statusFlags.childInLaw=true;src.statusFlags.childInLawFor=x.statusFlags?.childInLawFor||src.statusFlags.childInLawFor;src.statusFlags.sourceNPCId=src.id;src.statusFlags.familyMatchedTo=src.statusFlags.childInLawFor||src.statusFlags.familyMatchedTo;return src;}):[];
 f.history=Array.isArray(f.history)?f.history.slice(0,80):[];
 for(const k of ['introductions','careerOpenings','householdSupport','familyTalks','enterpriseAssignments','inheritanceAssignments','grandparentActions','grandchildrenBorn'])f[k]=Math.max(0,Math.round(f[k]||0));
 for(const asset of Object.keys(f.assetHeirs))if(!s.assets.includes(asset))delete f.assetHeirs[asset];
 for(const asset of Object.keys(f.stewards))if(!s.assets.includes(asset))delete f.stewards[asset];
 for(const child of s.children.filter(n=>n?.alive&&n.age>=18)){ensureAdultChildProfile(child);ensureAdultChildPartnerRecord(child,f);}
 return f;
}
function ensureAdultChildProfile(child){
 if(!child)return null;
 if(!s.familyBranches||typeof s.familyBranches!=='object'||Array.isArray(s.familyBranches))s.familyBranches={children:{},assetHeirs:{},stewards:{},childInLaws:[],history:[]};
 const f=s.familyBranches;f.children=f.children&&typeof f.children==='object'&&!Array.isArray(f.children)?f.children:{};
 let p=f.children[child.id],up=childProfile(child);
 if(!p){
  const t=child.traits||[],goal=child.goal||'';
  p=f.children[child.id]={
   childId:child.id,
   autonomy:clamp(Math.round(50+(up?.freedom??50)*.3-(up?.expectation??40)*.12+(t.includes('hirsli')?8:0)+(t.includes('gururlu')?6:0)-(t.includes('sadik')?4:0))),
   familyReadiness:clamp(Math.round(38+(goal==='family'?24:0)+(up?.warmth??50)*.22+(up?.wellbeing??60)*.14+(t.includes('sadik')?8:0)+(t.includes('merhametli')?5:0)-(t.includes('hirsli')?4:0))),
   careerMomentum:clamp(Math.round(32+(up?.expectation??40)*.22+(child.prestige||0)*.32+Math.max(0,...Object.values(child.skills||{}))*.25)),
   householdSupport:0,parentInfluence:50,familyPlanUntil:null,lastFamilyTalkYear:null,lastCareerYear:null,lastMatchYear:null,
   supportGiven:0,matches:0,careerOpenings:0,familyTalks:0,births:0,grandparentActions:0,introducedIds:[],stewardAssets:[],history:[]
  };
 }
 for(const k of ['autonomy','familyReadiness','careerMomentum','householdSupport','parentInfluence'])p[k]=clamp(Number.isFinite(p[k])?p[k]:50);
 for(const k of ['supportGiven','matches','careerOpenings','familyTalks','births','grandparentActions'])p[k]=Math.max(0,Math.round(p[k]||0));
 p.introducedIds=Array.isArray(p.introducedIds)?[...new Set(p.introducedIds)].slice(-20):[];
 p.stewardAssets=Array.isArray(p.stewardAssets)?[...new Set(p.stewardAssets)].filter(id=>s.assets.includes(id)).slice(0,6):[];
 p.history=Array.isArray(p.history)?p.history.slice(0,40):[];
 p.familyPlanUntil=Number.isFinite(p.familyPlanUntil)?p.familyPlanUntil:null;p.lastFamilyTalkYear=Number.isFinite(p.lastFamilyTalkYear)?p.lastFamilyTalkYear:null;p.lastCareerYear=Number.isFinite(p.lastCareerYear)?p.lastCareerYear:null;p.lastMatchYear=Number.isFinite(p.lastMatchYear)?p.lastMatchYear:null;
 return p;
}
function adultChildById(id){return s.children.find(n=>n?.id===id&&n.alive&&n.age>=18)||null;}
function isAdultPlayerChild(n){return !!n&&s.children.some(c=>c.id===n.id)&&n.age>=18;}
function familyBranchRecord(child,note,type='life',extra={}){
 const f=ensureFamilyBranches(),p=ensureAdultChildProfile(child),row={year:s.year+s.age,age:s.age,childId:child?.id||null,type,note:String(note),...extra};
 f.history.unshift(row);f.history=f.history.slice(0,80);if(p){p.history.unshift(row);p.history=p.history.slice(0,40);}return row;
}
function ensureAdultChildPartnerRecord(child,f=s.familyBranches){
 if(!child?.partner)return null;f=f||s.familyBranches;if(!f)return null;
 const current=f.childInLaws.find(n=>n.statusFlags?.childInLawFor===child.id||n.id===child.partner.id);
 if(current)return current;
 const clone=normalizeNPC({...child.partner,type:'Çocuk Eşi',statusFlags:{...(child.partner.statusFlags||{}),childInLawFor:child.id,sourceNPCId:child.partner.statusFlags?.sourceNPCId||null}},'Çocuk Eşi');
 f.childInLaws.push(clone);return clone;
}
function adultChildMatchSource(id){
 const pool=[...s.friends,...(s.careerContacts||[]),...(s.workplace?.contacts||[]),...(s.military?.comrades||[])];
 return pool.find(n=>n?.id===id)||null;
}
function syncAdultChildPartner(child){
 if(!child?.partner)return null;const f=ensureFamilyBranches(),rec=ensureAdultChildPartnerRecord(child,f),srcId=child.partner.statusFlags?.sourceNPCId,src=srcId?adultChildMatchSource(srcId):null;
 const copy=(from,to)=>{if(!from||!to)return;for(const k of ['alive','age','health','role','place','realm','tribe','wealth','prestige'])to[k]=from[k];to.lifeState=from.lifeState?JSON.parse(JSON.stringify(from.lifeState)):to.lifeState;};
 if(src){copy(src,child.partner);if(rec)copy(src,rec);}
 else if(rec)copy(rec,child.partner);
 return rec;
}
function adultChildMatchCandidates(child){
 if(!child?.alive||child.age<18||child.partner?.alive)return [];
 const f=ensureFamilyBranches(),familyIds=new Set([...s.parents,...s.siblings,...s.children,...(s.relatives||[]),...(f.childInLaws||[])].filter(Boolean).map(n=>n.id));
 const raw=[...s.friends,...(s.careerContacts||[]),...(s.workplace?.contacts||[]),...(s.military?.comrades||[])],seen=new Set(),out=[];
 for(const n of raw){
  if(!n?.alive||seen.has(n.id)||familyIds.has(n.id)||n.id===child.id||n.age<18||Math.abs((n.age||18)-child.age)>12||n.gender===child.gender||n.partner?.alive||n.statusFlags?.familyMatchedTo||npcLifeBlocksNormalInteraction(n))continue;
  seen.add(n.id);normalizeBonds(n);out.push(n);
 }
 return out.sort((a,b)=>((b.rel||0)+(b.bonds?.trust||0)-Math.abs(b.age-child.age)*2)-((a.rel||0)+(a.bonds?.trust||0)-Math.abs(a.age-child.age)*2)).slice(0,6);
}
function adultChildCareerOpportunity(child){
 if(!child?.alive||child.age<18)return null;
 if(s.role){
  const r=D.careers.find(x=>x.name===s.role);if(!r||child.age>=r.age)return {role:s.role,source:'senin görev çevren'};
 }
 const kindMap={smith:'Demirci',scribe:'Bitigçi',caravan:'Kervan yardımcısı',bard:'Ozan',merchant:'Tüccar'};
 for(const n of (s.careerContacts||[]).filter(n=>n?.alive&&!npcLifeBlocksNormalInteraction(n))){const role=kindMap[n.statusFlags?.careerKind]||n.role;if(role)return {role,source:n.name+' üzerinden'};}
 for(const id of Object.keys(FAMILY_BRANCH_ENTERPRISES))if(s.assets.includes(id))return {role:FAMILY_BRANCH_ENTERPRISES[id].role,source:FAMILY_BRANCH_ENTERPRISES[id].name};
 return null;
}
function registerAdultChildPartner(child,partner,sourceNpc=null,mode='autonomous'){
 if(!child||!partner)return null;const f=ensureFamilyBranches(),p=ensureAdultChildProfile(child);
 const spouse=normalizeNPC({...partner,type:'Çocuk Eşi',statusFlags:{...(partner.statusFlags||{}),childInLawFor:child.id,sourceNPCId:sourceNpc?.id||partner.statusFlags?.sourceNPCId||null}},'Çocuk Eşi');
 spouse.parentIds=Array.isArray(spouse.parentIds)?spouse.parentIds:[];child.partner={...spouse,statusFlags:{...(spouse.statusFlags||{})}};
 if(sourceNpc){sourceNpc.statusFlags=sourceNpc.statusFlags||{};sourceNpc.statusFlags.familyMatchedTo=child.id;sourceNpc.statusFlags.childInLaw=true;sourceNpc.statusFlags.childInLawFor=child.id;sourceNpc.statusFlags.sourceNPCId=sourceNpc.id;}
 const branchRecord=sourceNpc||spouse,existing=f.childInLaws.findIndex(n=>n.statusFlags?.childInLawFor===child.id||n.id===spouse.id);if(existing>=0)f.childInLaws[existing]=branchRecord;else f.childInLaws.push(branchRecord);
 if(sourceNpc){adjustSocialLink(child,sourceNpc,{score:55,trust:15,tag:'kin'},'Aile aracılığıyla tanışıp aynı ocağın yoluna girdiler.');rememberNPC(sourceNpc,'family',child.name+' ile aile aracılığıyla tanıştı.',5);}
 if(mode==='introduced'){f.introductions++;p.matches++;p.lastMatchYear=s.year+s.age;if(sourceNpc&&!p.introducedIds.includes(sourceNpc.id))p.introducedIds.push(sourceNpc.id);}
 p.familyReadiness=clamp(p.familyReadiness+4);rememberNPC(child,'family',spouse.name+' ile bir ilişki kurdu.',6);familyBranchRecord(child,spouse.name+' ile '+(mode==='introduced'?'senin tanıştırmanla ':'')+'birlikte bir yol kurmaya başladı.','partner',{partnerId:spouse.id,mode});
 return spouse;
}
function familyBranchPartnerChance(n){
 if(isAdultPlayerChild(n)){const p=ensureAdultChildProfile(n);return Math.max(.08,Math.min(.32,.09+p.familyReadiness/720+p.householdSupport/1800+(n.goal==='family'?.06:0)+(n.traits?.includes('sadik')?.025:0)-p.autonomy/1800));}
 if(s.siblings.some(x=>x.id===n.id)&&n.age>=18)return Math.max(.06,Math.min(.2,.08+(n.goal==='family'?.07:0)+(n.traits?.includes('sadik')?.025:0)));
 return n.goal==='family'?.11:.055;
}
function familyBranchBirthChance(n){
 if(isAdultPlayerChild(n)){const p=ensureAdultChildProfile(n),boost=(p.familyPlanUntil!=null&&p.familyPlanUntil>=s.year+s.age)?0.09:0;return Math.max(.07,Math.min(.3,.065+p.familyReadiness/700+p.householdSupport/1900+boost+(n.goal==='family'?.045:0)-p.autonomy/2200));}
 if(s.siblings.some(x=>x.id===n.id)&&n.age>=18)return Math.max(.045,Math.min(.16,.06+(n.goal==='family'?.065:0)));
 return n.goal==='family'?.075:.035;
}
function familyBranchYearTick(){
 const f=ensureFamilyBranches();
 for(const child of s.children.filter(n=>n?.alive&&n.age>=18)){
  const p=ensureAdultChildProfile(child);syncAdultChildPartner(child);p.householdSupport=clamp(p.householdSupport-(p.householdSupport>0?1:0));
  p.careerMomentum=clamp(p.careerMomentum+(child.role&&child.role!=='Çocuk'?1:0)+(child.goal==='mastery'||child.goal==='prestige'?1:0));
  if(child.goal==='family')p.familyReadiness=clamp(p.familyReadiness+1);if(child.partner?.alive)p.familyReadiness=clamp(p.familyReadiness+1);
  if(p.familyPlanUntil!=null&&p.familyPlanUntil<s.year+s.age)p.familyPlanUntil=null;
 }
 for(const [asset,id] of Object.entries({...f.stewards}))if(!adultChildById(id)||!s.assets.includes(asset))delete f.stewards[asset];
 for(const [asset,id] of Object.entries({...f.assetHeirs}))if(!adultChildById(id)||!s.assets.includes(asset))delete f.assetHeirs[asset];
}
function adultChildActionIssue(childId,id,extra=null){
 const child=adultChildById(childId);if(!child)return '18 yaşını geçmiş yaşayan bir çocuğun gerekiyor.';if(npcLifeBlocksNormalInteraction(child))return npcNormalInteractionIssue(child);
 const p=ensureAdultChildProfile(child),year=s.year+s.age,f=ensureFamilyBranches();
 if(id==='support'){if(s.wealth<4)return 'Hane desteği için 4 servet gerekiyor.';}
 else if(id==='career'){if(!adultChildCareerOpportunity(child))return 'Şu anda ona açabileceğin bir görev veya aile işi bağlantısı yok.';if(p.lastCareerYear===year)return 'Bu yıl kariyer yolunu zaten konuştunuz.';}
 else if(id==='match'){if(child.partner?.alive)return 'Zaten bir eşi veya eş adayı var.';const cand=adultChildMatchCandidates(child).find(n=>n.id===extra);if(!cand)return 'Tanıştırabileceğin uygun tanıdık bulunamadı.';if(p.lastMatchYear===year)return 'Bu yıl eş adayı konusunu zaten açtın.';}
 else if(id==='family'){if(!child.partner?.alive)return 'Önce kendi ocağında bir eşi veya eş adayı olmalı.';if(p.lastFamilyTalkYear===year)return 'Bu yıl aile planını zaten konuştunuz.';const fertile=child.partner.alive&&child.age>=18&&child.partner.age>=18&&(child.gender==='female'?child.age:child.partner.age)<45;if(!fertile)return 'Bu çift için çocuk planı dönemi kapanmış görünüyor.';}
 else if(id==='enterprise'){if(!FAMILY_BRANCH_ENTERPRISES[extra]||!s.assets.includes(extra))return 'Bu aile işi sende yok.';const current=f.stewards[extra];if(current===child.id)return 'Bu aile işini zaten o yürütüyor.';if(current&&adultChildById(current))return 'Bu aile işini şu anda başka bir yetişkin çocuğun yürütüyor.';}
 else if(id==='bequeath'){if(!FAMILY_BRANCH_MAJOR_ASSETS.includes(extra)||!s.assets.includes(extra))return 'Bu varlık sende yok.';if(f.assetHeirs[extra]===child.id)return 'Bu varlık zaten ona bırakılacak şekilde kaydedilmiş.';}
 else return 'Yetişkin çocuk eylemi bulunamadı.';
 return '';
}
function adultChildAction(childId,id,extra=null){
 const issue=adultChildActionIssue(childId,id,extra);if(issue){notice(issue);return false;}const child=adultChildById(childId),p=ensureAdultChildProfile(child);
 return performAction({kind:'adultChild',childId,id,extra},()=>{
  const f=ensureFamilyBranches(),year=s.year+s.age,b=normalizeBonds(child);
  if(id==='support'){
   s.wealth-=4;child.wealth=(child.wealth||0)+4;p.supportGiven+=4;p.householdSupport=clamp(p.householdSupport+12);p.familyReadiness=clamp(p.familyReadiness+4);p.autonomy=clamp(p.autonomy+2);f.householdSupport+=4;adjustNPC(child,{rel:5,trust:6,respect:2},'Kendi ocağını kurarken ona mal ve yük desteği verdin.');familyBranchRecord(child,'Kendi hanesine 4 servet destek verdin.','support');
  }else if(id==='career'){
   const opp=adultChildCareerOpportunity(child);p.lastCareerYear=year;const chance=Math.max(.2,Math.min(.9,.27+b.trust/300+p.careerMomentum/330+(s.prestige||0)/650-p.autonomy/850));
   if(Math.random()<chance){const old=child.role;child.role=opp.role;child.roleHistory=child.roleHistory||[];child.roleHistory.push({year,role:child.role,source:'family'});child.prestige=clamp((child.prestige||0)+5);p.careerMomentum=clamp(p.careerMomentum+10);p.careerOpenings++;f.careerOpenings++;adjustNPC(child,{rel:3,trust:4,respect:5},'Aile bağlantın üzerinden önüne bir görev kapısı açtın.');familyBranchRecord(child,(old&&old!==opp.role?old+' yolundan ':'')+opp.role+' yoluna geçmesine kapı açtın.','career',{role:opp.role});log(safeText(child.name)+' için '+safeText(opp.role)+' yolunda gerçek bir kapı açıldı.','good');}
   else{p.careerMomentum=clamp(p.careerMomentum+2);p.autonomy=clamp(p.autonomy+3);adjustNPC(child,{respect:2,trust:-1},'Sunduğun görev yolunu bu kez kendi isteğiyle kabul etmedi.');familyBranchRecord(child,'Sunduğun görev yolunu kendi tercihiyle kabul etmedi.','career');log(safeText(child.name)+' bu kez kendi yolunda kalmayı seçti.');}
  }else if(id==='match'){
   const cand=adultChildMatchCandidates(child).find(n=>n.id===extra);p.lastMatchYear=year;const cb=normalizeBonds(cand),chance=Math.max(.12,Math.min(.88,.18+p.familyReadiness/260+b.trust/420+cb.trust/650-Math.abs(child.age-cand.age)/90-p.autonomy/700));
   if(Math.random()<chance){registerAdultChildPartner(child,cand,cand,'introduced');adjustNPC(child,{rel:4,trust:3},'Tanıştırdığın kişiyle görüşmeyi kendi isteğiyle sürdürdü.');log(safeText(child.name)+' ile '+safeText(cand.name)+' tanışıklığı gerçek bir ilişkiye dönüştü.','major');}
   else{p.autonomy=clamp(p.autonomy+2);p.familyReadiness=clamp(p.familyReadiness-1);adjustNPC(child,{rel:p.autonomy>70?-2:0,trust:p.autonomy>70?-2:0},'Tanıştırdığın kişiyle devam etmek istemedi; kararına saygı duymanı bekledi.');familyBranchRecord(child,cand.name+' ile tanıştırdın fakat devam etmek istemedi.','match',{candidateId:cand.id});}
  }else if(id==='family'){
   p.lastFamilyTalkYear=year;p.familyTalks++;f.familyTalks++;const chance=Math.max(.16,Math.min(.9,.22+p.familyReadiness/210+b.trust/500-p.autonomy/620));
   if(Math.random()<chance){p.familyPlanUntil=year+3;p.familyReadiness=clamp(p.familyReadiness+8);adjustNPC(child,{rel:2,trust:2},'Kendi ailesinin geleceğini seninle açıkça konuştu.');familyBranchRecord(child,'Kendi isteğiyle önündeki birkaç yıl aile kurma planına daha açık hale geldi.','family_plan',{until:p.familyPlanUntil});log(safeText(child.name)+' aile planını olumlu karşıladı.','good');}
   else{p.autonomy=clamp(p.autonomy+4);adjustNPC(child,{rel:-1,trust:-1,grudge:p.autonomy>=75?2:0},'Aile planının kendi kararı olması gerektiğini açıkça söyledi.');familyBranchRecord(child,'Aile planını konuştuğunuzda kararı kendisinin vermek istediğini söyledi.','family_plan');}
  }else if(id==='enterprise'){
   f.stewards[extra]=child.id;if(!p.stewardAssets.includes(extra))p.stewardAssets.push(extra);f.enterpriseAssignments++;const spec=FAMILY_BRANCH_ENTERPRISES[extra];child.role=spec.role;child.roleHistory=child.roleHistory||[];child.roleHistory.push({year,role:child.role,source:'family_enterprise'});child.wealth=(child.wealth||0)+2;p.careerMomentum=clamp(p.careerMomentum+8);adjustNPC(child,{rel:4,trust:5,respect:7},spec.name+' işinin sorumluluğunu onunla paylaşmaya başladın.');familyBranchRecord(child,spec.name+' işinin günlük sorumluluğunu ona verdin.','enterprise',{asset:extra});log(safeText(child.name)+' artık '+safeText(spec.name)+' içinde gerçek sorumluluk taşıyor.','major');
  }else if(id==='bequeath'){
   const old=f.assetHeirs[extra];f.assetHeirs[extra]=child.id;f.inheritanceAssignments++;ensureSuccession().prepared=true;ensureSuccession().lastCouncilYear=year;if(old&&old!==child.id){const prev=adultChildById(old);if(prev)adjustNPC(prev,{rel:-2,trust:-2,grudge:4},'Daha önce kendisine bırakılacağı konuşulan varlığın başka kardeşine yazıldığını öğrendi.');}
   adjustNPC(child,{respect:4,trust:2},'Belirli bir aile varlığını ona bırakacağını açıkça konuştun.');familyBranchRecord(child,(D.assets.find(a=>a.id===extra)?.name||extra)+' varlığını ona bırakacak şekilde kaydettin.','inheritance',{asset:extra});log((D.assets.find(a=>a.id===extra)?.name||extra)+' için miras payını '+safeText(child.name)+' olarak belirledin.','major');
  }
 },safeText(child.name)+' ile yetişkin hayatı ve aile geleceği üzerine bir ay geçirdin.');
}
function grandchildById(id){for(const child of s.children||[])for(const g of child.descendants||[])if(g?.id===id)return g;return null;}
function grandchildParent(grandId){return s.children.find(c=>(c.descendants||[]).some(g=>g?.id===grandId))||null;}
function grandchildActionIssue(grandId,id){
 const g=grandchildById(grandId);if(!g?.alive)return 'Yaşayan torun bulunamadı.';if(npcLifeBlocksNormalInteraction(g))return npcNormalInteractionIssue(g);
 if(!['spend','teach','gift'].includes(id))return 'Torun eylemi bulunamadı.';if(id==='teach'&&g.age<5)return 'Bir beceri aktarmak için biraz daha büyümesi gerekiyor.';if(id==='gift'&&s.wealth<2)return 'Armağan için 2 servet gerekiyor.';return '';
}
function grandchildAction(grandId,id){
 const issue=grandchildActionIssue(grandId,id);if(issue){notice(issue);return false;}const g=grandchildById(grandId),parent=grandchildParent(grandId);
 return performAction({kind:'grandchild',grandId,id},()=>{
  const f=ensureFamilyBranches(),p=parent?ensureAdultChildProfile(parent):null;f.grandparentActions++;if(p)p.grandparentActions++;
  if(id==='spend'){adjustNPC(g,{rel:6,trust:6,respect:2},'Büyük ebeveyniyle baş başa vakit geçirdi.');apply({happiness:3});}
  else if(id==='teach'){const [key,val]=Object.entries(s.skills||{}).sort((a,b)=>b[1]-a[1])[0]||['speech',s.skill||0];g.skills=g.skills||{};g.skills[key]=clamp((g.skills[key]||0)+Math.max(2,Math.floor(val/30)));adjustNPC(g,{rel:3,trust:4,respect:6},skillName(key)+' alanında aile büyüğünden bir şeyler öğrendi.');}
  else if(id==='gift'){s.wealth-=2;g.wealth=(g.wealth||0)+2;adjustNPC(g,{rel:5,trust:3},'Aile büyüğünden küçük bir armağan aldı.');}
  if(parent)familyBranchRecord(parent,g.name+' adlı torununla '+(id==='spend'?'vakit geçirdin':id==='teach'?'tecrübe paylaştın':'armağanla bağ kurdun')+'.','grandchild',{grandId:g.id,action:id});
 },safeText(g.name)+' ile torun-büyük ebeveyn bağına bir ay ayırdın.');
}
function familyStewardQuarter(assetId){
 const f=ensureFamilyBranches(),child=adultChildById(f.stewards[assetId]);if(!child||!s.assets.includes(assetId)||npcLifeBlocksNormalInteraction(child))return 0;
 const st=assetState(assetId);st.condition=clamp(st.condition+1);child.wealth=(child.wealth||0)+(Math.random()<.55?1:0);
 if(Math.random()<.3){s.wealth+=1;st.profits=(st.profits||0)+1;economyLedger('family_enterprise',1,(FAMILY_BRANCH_ENTERPRISES[assetId]?.name||assetId)+' • '+child.name+' aile işi katkısı');return 1;}return 0;
}
function adultChildrenSummaryHtml(){
 const f=ensureFamilyBranches(),kids=s.children.filter(n=>n?.alive&&n.age>=18);if(!kids.length)return '';
 const grandkids=kids.flatMap(c=>(c.descendants||[]).filter(g=>g?.alive));
 let html='<div class="card"><h3>🌳 Yetişkin Çocuklar ve Soy Kolları</h3><p>Yetişkin çocuk '+kids.length+' • yaşayan torun '+grandkids.length+' • tanıştırma '+f.introductions+' • kariyer kapısı '+f.careerOpenings+' • aile işi görevi '+f.enterpriseAssignments+'<br>Çocukların kendi kararlarını verir; sen destek, bağlantı ve aile mirasıyla etkide bulunabilirsin.</p></div><div class="grid2">';
 const btn=(child,label,id,extra=null)=>{const issue=adultChildActionIssue(child.id,id,extra),x=JSON.stringify(extra);return '<button class="mini" '+(issue?'disabled':'')+' title="'+safeText(issue)+'" onclick=\'adultChildAction('+JSON.stringify(child.id)+','+JSON.stringify(id)+','+x+')\'>'+safeText(label)+'</button>';};
 html+=kids.map(child=>{const p=ensureAdultChildProfile(child),gcs=(child.descendants||[]).filter(g=>g?.alive),matches=!child.partner?.alive?adultChildMatchCandidates(child).slice(0,2):[],opp=adultChildCareerOpportunity(child),stewards=Object.entries(f.stewards).filter(([,id])=>id===child.id).map(([a])=>FAMILY_BRANCH_ENTERPRISES[a]?.name||a),inherit=Object.entries(f.assetHeirs).filter(([,id])=>id===child.id).map(([a])=>D.assets.find(x=>x.id===a)?.name||a);
  let actions=btn(child,'Hanesine destek ver','support')+(opp?btn(child,'Görev kapısı aç: '+opp.role,'career'):'')+(child.partner?.alive?btn(child,'Aile planını konuş','family'):matches.map(n=>btn(child,'Tanıştır: '+n.name,'match',n.id)).join(''));
  for(const asset of s.assets.filter(id=>FAMILY_BRANCH_ENTERPRISES[id]))actions+=btn(child,'Aile işi: '+FAMILY_BRANCH_ENTERPRISES[asset].name,'enterprise',asset);
  for(const asset of s.assets.filter(id=>FAMILY_BRANCH_MAJOR_ASSETS.includes(id)))actions+=btn(child,'Miras: '+(D.assets.find(a=>a.id===asset)?.name||asset),'bequeath',asset);
  const gcHtml=gcs.slice(0,4).map(g=>'<div class="memoryline"><b>'+safeText(g.name)+'</b> • '+g.age+' yaş • ilişki '+g.rel+'<div class="actions"><button class="mini" onclick=\'grandchildAction('+JSON.stringify(g.id)+',"spend")\'>Vakit geçir</button>'+(g.age>=5?'<button class="mini" onclick=\'grandchildAction('+JSON.stringify(g.id)+',"teach")\'>Bir şey öğret</button>':'')+'<button class="mini" onclick=\'grandchildAction('+JSON.stringify(g.id)+',"gift")\'>Armağan</button>'+(normalizeNPCLifeState(g).status!=='normal'?npcLifeActionsHtml(g):'')+'</div></div>').join('');
  return '<div class="card"><h3>'+safeText(child.name)+' • '+child.age+' yaş</h3><p>'+safeText(child.role||'Kendi yolunu arıyor')+(child.partner?.alive?' • eşi/eş adayı '+safeText(child.partner.name):' • bekar')+'<br>Bağımsızlık '+p.autonomy+' • aile isteği '+p.familyReadiness+' • kariyer ivmesi '+p.careerMomentum+' • hane desteği '+p.householdSupport+(stewards.length?'<br>Aile işi: '+safeText(stewards.join(', ')):'')+(inherit.length?'<br>Vasiyet edilen: '+safeText(inherit.join(', ')):'')+'<br>Torun: '+gcs.length+'</p><div class="actions">'+actions+'</div>'+gcHtml+'</div>';
 }).join('');
 return html+'</div>';
}
function applyFamilyBranchEffect(target,spec={}){
 if(!target)return;const child=adultChildById(target.id)||grandchildParent(target.id);if(!child)return;const p=ensureAdultChildProfile(child);
 for(const k of ['autonomy','familyReadiness','careerMomentum','householdSupport','parentInfluence'])if(spec[k])p[k]=clamp(p[k]+spec[k]);
 if(spec.familyPlanYears&&adultChildById(target.id))p.familyPlanUntil=Math.max(p.familyPlanUntil||0,s.year+s.age+spec.familyPlanYears);
 if(spec.note)familyBranchRecord(child,spec.note,'event',{targetId:target.id});
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
 const childInLaw=ensureFamilyBranches().childInLaws.find(x=>x.id===n.id);if(childInLaw)return 'Çocuk Eşi';
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
 for(const n of ensureFamilyBranches().childInLaws)add(n);
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
   const conflictImpact=familyDynamicsReunionImpact(guests);e.history.unshift({year:s.year+s.age,age:s.age,type:'reunion',guests:guests.map(n=>n.id),good,bad,conflictImpact});e.history=e.history.slice(0,60);apply({happiness:Math.min(6,2+Math.floor(good/5)),prestige:guests.length>=8?2:1});log(guests.length+' yakının katıldığı büyük bir aile buluşması yaptın.'+(conflictImpact.improved?' '+conflictImpact.improved+' aile gerilimi yumuşadı.':'')+(conflictImpact.worsened?' '+conflictImpact.worsened+' eski mesele yeniden açıldı.':''),'major');
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
 if(!n)return null;n.statusFlags=n.statusFlags||{};if(n.statusFlags.inheritanceHandled)return npcEstateCaseById(n.statusFlags.inheritanceCaseId)||null;
 const rec=processNPCEstate(n);n.statusFlags.inheritanceHandled=true;n.statusFlags.inheritanceCaseId=rec?.id||null;return rec;
}
function extendedFamilySummaryHtml(){
 const e=ensureExtendedFamily(),visible=extendedFamilyVisible(),living=visible.filter(n=>n.alive),inlaws=e.inLaws.filter(n=>n.alive&&!n.statusFlags?.legacyInLaw),cousins=living.filter(n=>kinRole(n)==='Kuzen').length,nieces=living.filter(n=>kinRole(n)==='Yeğen').length,grand=living.filter(n=>['Torun','Torunun Çocuğu'].includes(kinRole(n))).length;
 let html='<div class="card"><h3>🌿 Geniş Aile</h3><p>Yaşayan geniş aile '+living.length+' • kuzen '+cousins+' • yeğen '+nieces+' • torun ve sonrası '+grand+' • kayın aile '+inlaws.length+'<br>Aile buluşması '+e.reunions+' • verilen destek '+e.supportGiven+' • alınan destek '+e.supportReceived+'</p>'+actionButton('Büyük aile buluşması yap',{kind:'extendedFamily',id:'reunion'},"extendedFamilyAction('reunion')",'Aynı bölgede yaşayan akrabaları bir araya getirir; bağları ve NPC-NPC ilişkilerini etkiler.')+'</div>';
 if(living.length)html+='<div class="grid2">'+living.slice(0,30).map((n,i)=>'<div class="card"><h3>'+safeText(n.name)+'</h3><p>'+safeText(kinRole(n))+' • '+n.age+' yaş • '+safeText(n.role||'')+'<br>İlişki '+n.rel+' • güven '+(n.bonds?.trust||0)+(n.partner?.alive?' • eşli':'')+(n.descendants?.length?' • çocuk '+n.descendants.length:'')+'<br>Malı: '+safeText(npcEstateSummary(n))+'</p><div class="actions"><button class="mini" onclick="extendedFamilyAction(\'support\','+i+')">Destek ver</button><button class="mini" onclick="extendedFamilyAction(\'ask_help\','+i+')">Destek iste</button></div></div>').join('')+'</div>';
 return html;
}


const FAMILY_CONFLICT_KINDS={
 inheritance:{label:'Miras ve Paylaşım',reasons:['Eski bir malın kime kalacağı konusunda anlaşamıyorlar.','Aile malının paylaşımında kimin daha çok yük taşıdığı tartışılıyor.','Geçmişte verilmiş bir söz miras beklentilerini birbirine düşürdü.']},
 care:{label:'Bakım Yükü',reasons:['Yaşlı veya hasta bir yakının bakımını kimin üstleneceği tartışılıyor.','Uzun süren bakım yükünün adil paylaşılmadığını düşünüyorlar.','Bir yakının ihtiyaçları iki tarafın da ocağını zorlamaya başladı.']},
 inlaw:{label:'Kayın Aile ve Sınırlar',reasons:['İki ocak arasında kimin ne kadar söz sahibi olacağı gerilim yarattı.','Evlilikten sonra aile sınırlarının aşıldığını düşünüyorlar.','Kayın aileyle kurulan yakınlığın kendi ocağını geri plana ittiği konuşuluyor.']},
 household:{label:'Ocak ve Sorumluluk',reasons:['Ortak iş ve yurt yükünün eşit taşınmadığını düşünüyorlar.','Aile işlerinde kimin karar vereceği konusunda sürtüşüyorlar.','Birbirlerinden bekledikleri yardım ve sorumluluk aynı değil.']},
 reputation:{label:'Söz ve İtibar',reasons:['Aile hakkında söylenen bir sözün kimin yüzünden yayıldığı tartışılıyor.','Birinin davranışının bütün ocağın adını etkilediği düşünülüyor.','Eski bir söz yeniden açıldı ve iki taraf birbirini suçluyor.']}
};
function ensureFamilyDynamics(){
 if(!s.familyDynamics||typeof s.familyDynamics!=='object'||Array.isArray(s.familyDynamics))s.familyDynamics={};
 const f=s.familyDynamics;f.conflicts=Array.isArray(f.conflicts)?f.conflicts.slice(0,40):[];f.history=Array.isArray(f.history)?f.history.slice(0,100):[];
 f.started=Math.max(0,Math.round(f.started||0));f.resolved=Math.max(0,Math.round(f.resolved||0));f.mediations=Math.max(0,Math.round(f.mediations||0));f.sidesTaken=Math.max(0,Math.round(f.sidesTaken||0));f.peaceMeals=Math.max(0,Math.round(f.peaceMeals||0));
 for(const rec of f.conflicts){rec.id=rec.id||('family_conflict_'+Math.random().toString(36).slice(2));rec.aId=rec.aId||null;rec.bId=rec.bId||null;rec.kind=FAMILY_CONFLICT_KINDS[rec.kind]?rec.kind:'household';rec.reason=rec.reason||pick(FAMILY_CONFLICT_KINDS[rec.kind].reasons);rec.heat=clamp(Number.isFinite(rec.heat)?rec.heat:35);rec.status=rec.status||'active';rec.startedYear=Number.isFinite(rec.startedYear)?rec.startedYear:s.year+s.age;rec.lastYear=Number.isFinite(rec.lastYear)?rec.lastYear:rec.startedYear;rec.resolvedYear=Number.isFinite(rec.resolvedYear)?rec.resolvedYear:null;rec.playerStance=['a','b','neutral'].includes(rec.playerStance)?rec.playerStance:'neutral';rec.attempts=Math.max(0,Math.round(rec.attempts||0));rec.public=!!rec.public;rec.history=Array.isArray(rec.history)?rec.history.slice(0,30):[];}
 return f;
}
function familyConflictById(id){return ensureFamilyDynamics().conflicts.find(x=>x.id===id)||null;}
function familyConflictForPair(a,b){const key=socialKey(a,b);if(!key)return null;return ensureFamilyDynamics().conflicts.find(x=>x.status==='active'&&socialKey(x.aId,x.bId)===key)||null;}
function activeFamilyConflicts(){
 const f=ensureFamilyDynamics(),out=[];for(const rec of f.conflicts){if(rec.status!=='active')continue;const a=npcById(rec.aId),b=npcById(rec.bId);if(!a?.alive||!b?.alive){rec.status='ended';rec.resolvedYear=s.year+s.age;rec.history.unshift({year:s.year+s.age,type:'ended',note:'Taraflardan biri artık bu anlaşmazlığı sürdüremiyor.'});continue;}out.push(rec);}return out.sort((a,b)=>b.heat-a.heat||b.startedYear-a.startedYear);
}
function familyDynamicsPeople(){const seen=new Set(),out=[],add=n=>{if(!n?.alive||n.age<12||seen.has(n.id))return;seen.add(n.id);out.push(n);};[...s.parents,...s.siblings,...s.children,...(s.relatives||[]),...extendedFamilyVisible(),...(s.partner?[s.partner]:[])].forEach(add);return out;}
function familyConflictPairScore(a,b){
 if(!a?.alive||!b?.alive||a.id===b.id||a.partner?.id===b.id||b.partner?.id===a.id||familyConflictForPair(a,b))return -999;
 const l=socialLinkBetween(a,b),grudge=l?.grudge||0,score=l?.score??35;let tension=Math.max(0,25-score)+grudge*.7;
 const ap=s.parents.some(x=>x.id===a.id),bp=s.parents.some(x=>x.id===b.id),ai=ensureExtendedFamily().inLaws.some(x=>x.id===a.id&&!x.statusFlags?.legacyInLaw),bi=ensureExtendedFamily().inLaws.some(x=>x.id===b.id&&!x.statusFlags?.legacyInLaw);
 if((a.id===s.partner?.id&&(bp||bi))||(b.id===s.partner?.id&&(ap||ai))||(ap&&bi)||(bp&&ai))tension+=22;
 if(caregiverStrain()>=25&&(isClosePlayerKin(a)||isClosePlayerKin(b)))tension+=12;if(ensureNPCEstates().cases.some(x=>x.status==='disputed'))tension+=8;
 if(a.traits?.includes('kinci')||b.traits?.includes('kinci'))tension+=5;if(a.traits?.includes('gururlu')||b.traits?.includes('gururlu'))tension+=3;if(a.place!==b.place)tension-=5;if(a.realm!==b.realm)tension-=8;return Math.round(tension);
}
function familyConflictCandidatePairs(){const p=familyDynamicsPeople(),rows=[];for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const score=familyConflictPairScore(p[i],p[j]);if(score>=12)rows.push({a:p[i],b:p[j],score});}return rows.sort((a,b)=>b.score-a.score);}
function chooseFamilyConflictKind(a,b){
 const ap=s.parents.some(x=>x.id===a.id),bp=s.parents.some(x=>x.id===b.id),ai=ensureExtendedFamily().inLaws.some(x=>x.id===a.id&&!x.statusFlags?.legacyInLaw),bi=ensureExtendedFamily().inLaws.some(x=>x.id===b.id&&!x.statusFlags?.legacyInLaw);
 if((a.id===s.partner?.id&&(bp||bi))||(b.id===s.partner?.id&&(ap||ai))||(ap&&bi)||(bp&&ai))return 'inlaw';if(caregiverStrain()>=25&&Math.random()<.55)return 'care';if(ensureNPCEstates().cases.some(x=>x.status==='disputed')&&Math.random()<.6)return 'inheritance';if(ensureCommunityReputation().rumorHeat>=35&&Math.random()<.45)return 'reputation';return pick(['household','inheritance','reputation']);
}
function familyConflictRecord(rec,type,note,delta=0){if(!rec)return;rec.lastYear=s.year+s.age;rec.history.unshift({year:s.year+s.age,age:s.age,type,note:String(note||''),heat:rec.heat,delta});rec.history=rec.history.slice(0,30);const f=ensureFamilyDynamics();f.history.unshift({year:s.year+s.age,conflictId:rec.id,type,note:String(note||''),heat:rec.heat});f.history=f.history.slice(0,100);}
function createFamilyConflict(a,b,kind='',opt={}){
 if(!a?.alive||!b?.alive||a.id===b.id)return null;const old=familyConflictForPair(a,b);if(old)return old;const k=FAMILY_CONFLICT_KINDS[kind]?kind:chooseFamilyConflictKind(a,b),def=FAMILY_CONFLICT_KINDS[k],f=ensureFamilyDynamics(),rec={id:'family_conflict_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),aId:a.id,bId:b.id,kind:k,reason:opt.reason||pick(def.reasons),heat:clamp(Number.isFinite(opt.heat)?opt.heat:28+rng(0,18)),status:'active',startedYear:s.year+s.age,lastYear:s.year+s.age,resolvedYear:null,playerStance:'neutral',attempts:0,public:false,history:[]};
 f.conflicts.unshift(rec);f.conflicts=f.conflicts.slice(0,40);f.started++;adjustSocialLink(a,b,{score:-Math.max(6,Math.round(rec.heat/6)),trust:-Math.max(4,Math.round(rec.heat/9)),grudge:Math.max(7,Math.round(rec.heat/5)),tag:'kin'},rec.reason);rememberNPC(a,'family_conflict',b.name+' ile '+rec.reason,6);rememberNPC(b,'family_conflict',a.name+' ile '+rec.reason,6);familyConflictRecord(rec,'started',rec.reason,rec.heat);if(isClosePlayerKin(a)||isClosePlayerKin(b))log(safeText(a.name)+' ile '+safeText(b.name)+' arasında aile gerilimi başladı: '+safeText(rec.reason),'bad');return rec;
}
function maybeStartFamilyConflict(force=false){
 if(activeFamilyConflicts().length>=4||s.age<8)return null;const pairs=familyConflictCandidatePairs();if(!pairs.length)return null;const top=pairs.slice(0,Math.min(8,pairs.length)),best=top[0],pressure=best.score+caregiverStrain()*.25+Math.max(0,45-ensureSuccession().familyHarmony)*.18+ensureCommunityReputation().rumorHeat*.12,chance=Math.max(.03,Math.min(.28,.025+pressure/420));if(!force&&Math.random()>=chance)return null;const row=force?best:pick(top);return createFamilyConflict(row.a,row.b,'',{heat:clamp(25+Math.round(row.score*.45)+rng(0,10))});
}
function resolveFamilyConflict(rec,note='Anlaşmazlık yatıştı.'){if(!rec||rec.status!=='active')return false;const a=npcById(rec.aId),b=npcById(rec.bId);rec.status='resolved';rec.heat=Math.min(rec.heat,10);rec.resolvedYear=s.year+s.age;ensureFamilyDynamics().resolved++;if(a?.alive&&b?.alive)adjustSocialLink(a,b,{score:8,trust:6,grudge:-12,tag:'kin'},note);familyConflictRecord(rec,'resolved',note,-12);if(rec.attempts>0)applyCommunityAxes({honor:1,reliability:1},'Aile içindeki bir anlaşmazlığın büyümeden kapanmasına katkı verdin.');return true;}
function familyConflictActionIssue(id,mode){const rec=familyConflictById(id);if(!rec||rec.status!=='active')return 'Bu aile meselesi artık açık değil.';if(s.captive||s.exile)return 'Tutsak veya sürgündeyken aile içi görüşmeye doğrudan katılamazsın.';const a=npcById(rec.aId),b=npcById(rec.bId);if(!a?.alive||!b?.alive)return 'Taraflardan biri artık bu meselede değil.';if(mode==='peace'&&s.wealth<3)return 'Barış sofrası için 3 servet gerekiyor.';if(!['mediate','side_a','side_b','peace','withdraw'].includes(mode))return 'Aile eylemi bulunamadı.';return '';}
function familyConflictAction(id,mode){
 const issue=familyConflictActionIssue(id,mode);if(issue){notice(issue);return false;}const rec=familyConflictById(id),a=npcById(rec.aId),b=npcById(rec.bId);return performAction({kind:'familyConflict',id,mode},()=>{const link=socialLinkBetween(a,b,true,{tags:['kin']});rec.attempts++;
  if(mode==='mediate'){ensureFamilyDynamics().mediations++;const speech=s.skills?.speech||0,rep=ensureCommunityReputation(),chance=Math.max(.12,Math.min(.9,.24+speech/230+s.prestige/520+rep.reliability/650-rec.heat/210-link.grudge/500));if(Math.random()<chance){const drop=rng(14,25)+Math.floor(speech/20);rec.heat=clamp(rec.heat-drop);adjustSocialLink(a,b,{score:7,trust:6,grudge:-10,tag:'kin'},'Arabuluculukla birbirlerini yeniden dinlediler.');adjustNPC(a,{rel:2,trust:2,respect:2},'Aile içi anlaşmazlıkta tarafları dinledin.');adjustNPC(b,{rel:2,trust:2,respect:2},'Aile içi anlaşmazlıkta tarafları dinledin.');familyConflictRecord(rec,'mediate_success','Arabuluculuk gerilimi düşürdü.',-drop);if(rec.heat<=12)resolveFamilyConflict(rec,'Arabuluculuğun ardından mesele kapandı.');}else{rec.heat=clamp(rec.heat+rng(5,10));adjustSocialLink(a,b,{score:-3,trust:-2,grudge:4,tag:'kin'},'Arabuluculuk denemesi bu kez tarafları daha da gerdi.');adjustNPC(a,{trust:-2},'Arabuluculuk denemen sonuç vermedi.');adjustNPC(b,{trust:-2},'Arabuluculuk denemen sonuç vermedi.');familyConflictRecord(rec,'mediate_fail','Arabuluculuk sonuç vermedi.',6);}}
  else if(mode==='side_a'||mode==='side_b'){const chosen=mode==='side_a'?a:b,other=mode==='side_a'?b:a;rec.playerStance=mode==='side_a'?'a':'b';ensureFamilyDynamics().sidesTaken++;rec.heat=clamp(rec.heat+rng(5,10));adjustNPC(chosen,{rel:6,trust:5,respect:2},'Aile anlaşmazlığında onun tarafında durdun.');adjustNPC(other,{rel:-6,trust:-5,grudge:7},'Aile anlaşmazlığında karşı tarafı destekledin.');adjustSocialLink(a,b,{score:-5,trust:-4,grudge:6,tag:'kin'},'Senin açıkça taraf tutman aralarındaki çizgiyi sertleştirdi.');familyConflictRecord(rec,'side',chosen.name+' tarafında durdun.',7);}
  else if(mode==='peace'){s.wealth-=3;economyLedger('family',-3,'Aile barış sofrası');ensureFamilyDynamics().peaceMeals++;const speech=s.skills?.speech||0,chance=Math.max(.2,Math.min(.92,.43+speech/260+(a.rel+b.rel)/700-rec.heat/260));if(Math.random()<chance){const drop=rng(22,38);rec.heat=clamp(rec.heat-drop);adjustSocialLink(a,b,{score:10,trust:7,grudge:-14,tag:'kin'},'Aynı sofrada konuşup gerilimi yumuşattılar.');adjustNPC(a,{rel:3,trust:2},'Barış sofrasında yüz yüze konuştunuz.');adjustNPC(b,{rel:3,trust:2},'Barış sofrasında yüz yüze konuştunuz.');familyConflictRecord(rec,'peace_success','Barış sofrası gerilimi ciddi biçimde düşürdü.',-drop);if(rec.heat<=15)resolveFamilyConflict(rec,'Barış sofrasından sonra anlaşmazlık kapandı.');}else{rec.heat=clamp(rec.heat+rng(2,7));adjustSocialLink(a,b,{score:-2,grudge:3,tag:'kin'},'Barış sofrasında eski sözler yeniden açıldı.');familyConflictRecord(rec,'peace_fail','Barış sofrası bu kez işe yaramadı.',4);}}
  else{rec.playerStance='neutral';rec.heat=clamp(rec.heat-2);familyConflictRecord(rec,'withdraw','Bu kez taraf olmamayı seçtin.',-2);apply({happiness:1});}
  if(rec.status==='active'&&rec.heat>=68&&rec.playerStance!=='neutral'&&!rec.public){rec.public=true;recordPublicWord('family_conflict','Aile içindeki çekişmede açıkça taraf tuttuğun yakın çevrede konuşuluyor.',{honor:-1,reliability:-1},{severity:Math.max(18,Math.round(rec.heat*.35)),polarity:-1,truth:true,knownIds:[a.id,b.id],sourceId:mode==='side_a'?b.id:a.id});}
 },safeText(a.name)+' ile '+safeText(b.name)+' arasındaki aile meselesiyle ilgilenmekle bir ay geçti.');
}
function familyDynamicsYearTick(){
 const f=ensureFamilyDynamics(),year=s.year+s.age;for(const rec of [...activeFamilyConflicts()]){const a=npcById(rec.aId),b=npcById(rec.bId),l=socialLinkBetween(a,b,true,{tags:['kin']});let delta=rng(-4,5);if(l.grudge>=45)delta+=3;if(l.score<=-35)delta+=3;if(a.traits?.includes('kinci')||b.traits?.includes('kinci'))delta+=2;if(a.traits?.includes('bagislayici')||b.traits?.includes('bagislayici'))delta-=3;if(a.place!==b.place)delta-=2;if(rec.playerStance!=='neutral')delta+=1;rec.heat=clamp(rec.heat+delta);rec.lastYear=year;if(rec.heat>=55)adjustSocialLink(a,b,{score:-2,trust:-1,grudge:2,tag:'kin'},'Açık aile gerilimi zamanla bağlarını aşındırdı.');else if(rec.heat<=25)adjustSocialLink(a,b,{score:1,trust:1,grudge:-2,tag:'kin'},'Zaman geçtikçe eski sertlik biraz azaldı.');if(rec.heat<=8){resolveFamilyConflict(rec,'Zamanla taraflar meseleyi geride bıraktı.');continue;}if(rec.heat>=72&&rec.playerStance!=='neutral'&&!rec.public){rec.public=true;recordPublicWord('family_conflict',a.name+' ile '+b.name+' arasındaki aile çekişmesinde taraf olduğun konuşuluyor.',{honor:-1,reliability:-1},{severity:Math.max(20,Math.round(rec.heat*.4)),polarity:-1,truth:true,knownIds:[a.id,b.id],sourceId:rec.playerStance==='a'?b.id:a.id});}}maybeStartFamilyConflict(false);f.history=f.history.slice(0,100);
}
function familyDynamicsReunionImpact(guests){
 const ids=new Set((guests||[]).map(n=>n.id)),result={improved:0,worsened:0,resolved:0};for(const rec of activeFamilyConflicts()){if(!ids.has(rec.aId)||!ids.has(rec.bId))continue;const a=npcById(rec.aId),b=npcById(rec.bId),before=rec.heat,calm=(s.skills?.speech||0)>=45||rec.heat<55||Math.random()<.62;if(calm){rec.heat=clamp(rec.heat-rng(5,12));adjustSocialLink(a,b,{score:3,trust:2,grudge:-4,tag:'kin'},'Aile buluşmasında aynı sofrada oturmak gerilimi azalttı.');result.improved++;}else{rec.heat=clamp(rec.heat+rng(3,7));adjustSocialLink(a,b,{score:-2,grudge:3,tag:'kin'},'Aile buluşmasında eski mesele yeniden açıldı.');result.worsened++;}familyConflictRecord(rec,'reunion','Aile buluşması gerilimi '+(rec.heat<before?'yumuşattı.':'yeniden yükseltti.'),rec.heat-before);if(rec.heat<=10&&resolveFamilyConflict(rec,'Aile buluşmasının ardından barıştılar.'))result.resolved++;}return result;
}
function familyConflictEventPairs(){return activeFamilyConflicts().map(rec=>({rec,target:npcById(rec.aId),other:npcById(rec.bId)})).filter(x=>x.target?.alive&&x.other?.alive&&npcAvailableForOrdinaryEvent(x.target)&&npcAvailableForOrdinaryEvent(x.other));}
function applyFamilyConflictEventChoice(a,b,index){const rec=familyConflictForPair(a,b);if(!rec)return;if(index===0){rec.attempts++;ensureFamilyDynamics().mediations++;rec.heat=clamp(rec.heat-10);adjustSocialLink(a,b,{score:5,trust:4,grudge:-6,tag:'kin'},'Olay sırasında ikisini de dinleyip gerilimi düşürdün.');familyConflictRecord(rec,'event_mediate','Günlük bir tartışmada arayı bulmaya çalıştın.',-10);if(rec.heat<=10)resolveFamilyConflict(rec,'Küçük adımlar sonunda mesele kapandı.');}else{rec.heat=clamp(rec.heat+2);familyConflictRecord(rec,'event_avoid','O tartışmada taraf olmadın.',2);}}
function familyConflictHeatLabel(v){return v>=75?'Kopma noktasında':v>=55?'Açık kavga':v>=35?'Sert gerilim':v>=18?'Sürtüşme':'Yatışıyor';}
function familyConflictSummaryHtml(){
 const f=ensureFamilyDynamics(),active=activeFamilyConflicts();if(!active.length&&!f.resolved)return '';let html='<div class="card"><h3>⚡ Aile İçi Gerilimler</h3><p>Açık mesele '+active.length+' • bugüne kadar başlayan '+f.started+' • çözülen '+f.resolved+'<br>Arabuluculuk '+f.mediations+' • açık taraf tutma '+f.sidesTaken+' • barış sofrası '+f.peaceMeals+'</p></div>';
 if(active.length)html+='<div class="grid2">'+active.slice(0,8).map(rec=>{const a=npcById(rec.aId),b=npcById(rec.bId),stance=rec.playerStance==='a'?(a?.name||'ilk taraf'):rec.playerStance==='b'?(b?.name||'ikinci taraf'):'Tarafsız';return '<div class="card"><h3>⚡ '+safeText(FAMILY_CONFLICT_KINDS[rec.kind].label)+'</h3><p><b>'+safeText(a?.name||'Yakın')+'</b> ↔ <b>'+safeText(b?.name||'Yakın')+'</b><br>'+safeText(rec.reason)+'<br>Gerilim '+rec.heat+'/100 • '+safeText(familyConflictHeatLabel(rec.heat))+'<br>Senin duruşun: '+safeText(stance)+'</p><div class="actions">'+actionButton('Arayı bul',{kind:'familyConflict',id:rec.id,mode:'mediate'},"familyConflictAction('"+rec.id+"','mediate')",'Hitabet, itibar, güven ve mevcut gerilim başarıyı etkiler.')+actionButton((a?.name||'İlk taraf')+' tarafında dur',{kind:'familyConflict',id:rec.id,mode:'side_a'},"familyConflictAction('"+rec.id+"','side_a')",'Bir bağı güçlendirir ama karşı tarafla ilişkiyi ve aile gerilimini kötüleştirebilir.')+actionButton((b?.name||'Diğer taraf')+' tarafında dur',{kind:'familyConflict',id:rec.id,mode:'side_b'},"familyConflictAction('"+rec.id+"','side_b')",'Bir bağı güçlendirir ama karşı tarafla ilişkiyi ve aile gerilimini kötüleştirebilir.')+actionButton('Barış sofrası kur',{kind:'familyConflict',id:rec.id,mode:'peace'},"familyConflictAction('"+rec.id+"','peace')",'3 servet • başarılı olursa iki tarafın bağını güçlü biçimde onarabilir.')+actionButton('Bu kez karışma',{kind:'familyConflict',id:rec.id,mode:'withdraw'},"familyConflictAction('"+rec.id+"','withdraw')",'Tarafsız kalırsın; mesele kendi seyrinde devam eder.')+'</div></div>';}).join('')+'</div>';return html;
}

/* v32: One legacy horse asset token may correspond to multiple persistent living animals. */
const HORSE_NAMES=['Kırat','Bozay','Alaca','Yelkanat','Doru','Akbulut','Karakız','Gökçe','Yunt','Ayaz'];
const HORSE_TEMPERAMENTS=['sakin','atak','inatçı','uysal','ürkek'];
function horseId(){return 'h_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);}
function createHorse(opt={}){
 const age=Number.isFinite(opt.age)?opt.age:rng(3,7);
 return {id:horseId(),name:opt.name||pick(HORSE_NAMES),sex:opt.sex||pick(['mare','stallion']),age,birthYear:opt.birthYear??s.year+s.age-age,
  health:clamp(opt.health??rng(65,90)),speed:clamp(opt.speed??rng(32,64)),stamina:clamp(opt.stamina??rng(32,64)),
  condition:clamp(opt.condition??80),training:clamp(opt.training??12),bond:clamp(opt.bond??32),
  temperament:opt.temperament||pick(HORSE_TEMPERAMENTS),wins:0,races:0,motherId:opt.motherId||null,
  fatherId:opt.fatherId||null,generation:opt.generation||1,pregnancy:null,history:[],lastRaceAt:null};
}
function horsePedigree(h,reason){
 return {id:h.id,name:h.name,sex:h.sex,birthYear:h.birthYear,motherId:h.motherId,fatherId:h.fatherId,generation:h.generation,
  speed:h.speed,stamina:h.stamina,wins:h.wins,races:h.races,reason,year:s.year+s.age};
}
function ensureHorseStable(){
 if(!s.horseStable||typeof s.horseStable!=='object'||Array.isArray(s.horseStable))s.horseStable={};
 const st=s.horseStable;
 st.horses=Array.isArray(st.horses)?st.horses.filter(h=>h&&typeof h==='object').slice(0,8):[];
 st.pedigree=Array.isArray(st.pedigree)?st.pedigree.slice(0,100):[];
 st.history=Array.isArray(st.history)?st.history.slice(0,80):[];
 for(const key of ['races','wins','foals'])st[key]=Math.max(0,Math.round(st[key]||0));
 if(!st.initialized){
  st.initialized=true;
  if(s.assets.includes('horse')&&!st.horses.length){
   const h=createHorse();st.horses.push(h);
   st.history.unshift({year:s.year+s.age,type:'legacy',name:h.name,note:'Eski at varlığı yaşayan bir at olarak kaydedildi.'});
  }
 }
 const used=new Set();
 for(const h of st.horses){
  if(!/^h_[a-z0-9_]+$/.test(h.id||'')||used.has(h.id))h.id=horseId();used.add(h.id);
  h.name=String(h.name||'Adsız at').slice(0,40);h.sex=h.sex==='mare'?'mare':'stallion';
  h.age=Math.max(0,Math.round(h.age||0));h.birthYear=Number.isFinite(h.birthYear)?h.birthYear:s.year+s.age-h.age;
  for(const k of ['health','speed','stamina','condition','training','bond'])h[k]=clamp(Number.isFinite(h[k])?h[k]:50);
  h.temperament=HORSE_TEMPERAMENTS.includes(h.temperament)?h.temperament:'sakin';h.wins=Math.max(0,Math.round(h.wins||0));
  h.races=Math.max(h.wins,Math.round(h.races||0));h.generation=Math.max(1,Math.round(h.generation||1));
  h.history=Array.isArray(h.history)?h.history.slice(0,20):[];h.motherId=h.motherId||null;h.fatherId=h.fatherId||null;
  if(h.pregnancy){h.pregnancy.months=Math.max(0,Math.min(12,Math.round(h.pregnancy.months||11)));h.pregnancy.sireId=h.pregnancy.sireId||null;}
 }
 return st;
}
function horses(){return ensureHorseStable().horses;}
function horseById(id){return horses().find(h=>h.id===id)||null;}
function horseHistory(type,h,note){
 const st=ensureHorseStable();
 st.history.unshift({year:s.year+s.age,month:currentMonth(),type,id:h?.id||null,name:h?.name||'',note});
 st.history=st.history.slice(0,80);
 if(h){h.history.unshift({year:s.year+s.age,type,note});h.history=h.history.slice(0,20);}
}
function removeHorse(h,reason){
 const st=ensureHorseStable();
 st.pedigree.unshift(horsePedigree(h,reason));st.pedigree=st.pedigree.slice(0,100);
 horseHistory(reason,h,h.name+' at ocağından ayrıldı: '+reason+'.');
 st.horses=st.horses.filter(x=>x.id!==h.id);
 if(!st.horses.length){s.assets=s.assets.filter(id=>id!=='horse');if(s.economy?.assetState)delete s.economy.assetState.horse;}
}
function horsePairIssue(mare,sireId){
 if(!mare||mare.sex!=='mare'||mare.age<3||mare.age>17)return 'Yetişkin bir kısrak seç.';
 if(mare.pregnancy)return 'Kısrak zaten tay bekliyor.';
 if(mare.health<55||mare.condition<45)return 'Kısrağın sağlığı ve kondisyonu yetişmeye uygun değil.';
 if(sireId==='outside')return s.wealth<4?'Dış aygır payı için 4 servet gerekiyor.':'';
 const sire=horseById(sireId);
 if(!sire||sire.sex!=='stallion'||sire.age<3||sire.age>19||sire.health<55)return 'Yetişkin ve sağlıklı bir aygır seç.';
 if(sire.id===mare.motherId||sire.id===mare.fatherId||mare.id===sire.motherId||mare.id===sire.fatherId
  ||(sire.motherId&&sire.motherId===mare.motherId)||(sire.fatherId&&sire.fatherId===mare.fatherId))
  return 'Yakın akraba atlar eşleştirilemez.';
 return s.wealth<1?'Eşleştirme için 1 servet gerekiyor.':'';
}
function horseActionIssue(mode,id=null,other=null){
 const st=ensureHorseStable();
 if(mode==='buy'){if(st.horses.length>=8)return 'At ocağında en fazla 8 at barınır.';return s.wealth<assetBuyPrice('horse')?'Yeni at için servet yetersiz.':'';}
 const h=horseById(id);if(!h)return 'At bulunamadı.';
 if(mode==='care')return '';
 if(mode==='train')return h.age<2?'İki yaşından küçük tay ağır talim görmez.':h.health<35?'Önce atın sağlığını düzelt.':'';
 if(mode==='race'){
  if(h.age<3||h.age>18)return 'Yarış için 3–18 yaş gerekiyor.';
  if(h.health<50||h.condition<40)return 'Atın sağlığı ve kondisyonu yarış için düşük.';
  if(s.wealth<2)return 'Katılım için 2 servet gerekiyor.';
  if(h.lastRaceAt!=null&&(s.year+s.age)*12+currentMonth()-h.lastRaceAt<3)return 'Bir sonraki yarış için en az üç ay geçmeli.';
  return '';
 }
 if(mode==='breed')return horsePairIssue(h,other);
 if(mode==='sell')return h.pregnancy?'Tay bekleyen kısrak takas edilemez.':'';
 return 'At ocağı eylemi bulunamadı.';
}
function horseAction(mode,id=null,other=null){
 const err=horseActionIssue(mode,id,other);if(err){notice(err);return false;}
 return performAction({kind:'horseStable',id:mode,horseId:id,other},()=>{
  const st=ensureHorseStable(),h=id?horseById(id):null;
  if(mode==='buy'){
   const cost=assetBuyPrice('horse');s.wealth-=cost;const purchased=createHorse();st.horses.push(purchased);
   if(!s.assets.includes('horse')){s.assets.push('horse');assetState('horse').condition=85;}
   economyLedger('horse',-cost,purchased.name+' adlı atın alımı');horseHistory('purchase',purchased,'At ocağına katıldı.');
  }else if(mode==='care'){
   h.health=clamp(h.health+5);h.condition=clamp(h.condition+16);h.bond=clamp(h.bond+8);skillGain('riding',1);
   horseHistory('care',h,'Dinlendirilip bakımı yapıldı.');
  }else if(mode==='train'){
   h.training=clamp(h.training+7);h.speed=clamp(h.speed+2);h.stamina=clamp(h.stamina+2);
   h.bond=clamp(h.bond+4);h.condition=clamp(h.condition-5);skillGain('riding',2);
   if(h.temperament==='ürkek'&&Math.random()<.2)h.health=clamp(h.health-3);
   horseHistory('train',h,'Talim ve binici bağı geliştirildi.');
  }else if(mode==='race'){
   s.wealth-=2;economyLedger('horse',-2,h.name+' yarış katılımı');h.races++;st.races++;
   h.lastRaceAt=(s.year+s.age)*12+currentMonth();
   const chance=Math.max(.08,Math.min(.88,.12+h.speed/280+h.stamina/480+h.training/360+(s.skills.riding||0)/500+h.bond/1200-(100-h.health)/320-(100-h.condition)/350));
   const victory=Math.random()<chance;
   h.condition=clamp(h.condition-(victory?8:12));
   if(victory){h.wins++;st.wins++;const prize=6+Math.floor(h.speed/30);s.wealth+=prize;economyLedger('horse',prize,h.name+' toy yarış ödülü');apply({prestige:3,happiness:2});}
   if(Math.random()<.06)h.health=clamp(h.health-8);
   horseHistory(victory?'victory':'race',h,victory?'Toy yarışını kazandı.':'Toy yarışına katıldı ama kazanamadı.');skillGain('riding',1);
  }else if(mode==='breed'){
   const sire=other==='outside'?createHorse({sex:'stallion',age:rng(4,9)}):horseById(other);
   const cost=other==='outside'?4:1;s.wealth-=cost;economyLedger('horse',-cost,h.name+' tay yetiştirme payı');
   if(other==='outside'){st.pedigree.unshift(horsePedigree(sire,'dış aygır'));st.pedigree=st.pedigree.slice(0,100);}
   h.pregnancy={months:11,sireId:sire.id,sireSnapshot:horsePedigree(sire,'baba')};
   horseHistory('breed',h,sire.name+' ile eşleştirildi; tay bekleniyor.');
  }else if(mode==='sell'){
   const value=Math.max(2,Math.round(assetSaleValue('horse')*(.5+h.speed/200+h.training/300+h.health/300)));
   s.wealth+=value;economyLedger('horse',value,h.name+' takası');removeHorse(h,'takas');
  }
 },'At ocağına bir ay ayırdın.');
}
function horseMonthTick(month){
 const st=ensureHorseStable();
 for(const h of [...st.horses]){
  h.condition=clamp(h.condition+(s.assets.includes('flock')?2:1));
  if(!h.pregnancy)continue;
  if(--h.pregnancy.months>0)continue;
  const pregnancy=h.pregnancy;h.pregnancy=null;
  if(st.horses.length>=8){horseHistory('full',h,'At ocağında yer olmadığı için tay başka obaya emanet edildi.');continue;}
  const sire=st.horses.find(x=>x.id===pregnancy.sireId)||pregnancy.sireSnapshot;
  const trait=k=>clamp(Math.round((h[k]+(sire?.[k]??h[k]))/2+rng(-9,9)));
  const foal=createHorse({age:0,birthYear:s.year+s.age,sex:pick(['mare','stallion']),motherId:h.id,fatherId:pregnancy.sireId,
   generation:Math.max(h.generation,sire?.generation||1)+1,speed:trait('speed'),stamina:trait('stamina'),training:0,bond:35,condition:78,health:clamp(h.health+rng(-9,3))});
  st.horses.push(foal);st.foals++;horseHistory('birth',foal,h.name+' soyundan tay doğdu.');
  log(safeText(h.name)+' tay doğurdu: '+safeText(foal.name)+'.','major');
 }
}
function horseQuarterTick(){
 const st=ensureHorseStable(),covered=s.age>=18&&s.assets.includes('horse')?1:0,cost=Math.max(0,st.horses.length-covered);
 if(!cost)return;const paid=Math.min(s.wealth,cost);s.wealth-=paid;
 economyLedger('horse',-paid,'At ocağı üç aylık yem ve bakım');
 if(paid<cost){for(const h of st.horses){h.health=clamp(h.health-3);h.condition=clamp(h.condition-8);}horseHistory('hunger',null,'Erzak darlığında atların sağlığı ve kondisyonu azaldı.');}
}
function horseYearTick(){
 const st=ensureHorseStable(),year=s.year+s.age;
 for(const h of [...st.horses]){
  h.age=Math.max(0,year-h.birthYear);
  if(h.age>=19){h.health=clamp(h.health-rng(2,8));h.condition=clamp(h.condition-4);}
  if(h.health<=0||Math.random()<(h.age>=25?.5:h.age>=20?.12:Math.max(0,(40-h.health)/400))){
   removeHorse(h,'ölüm');log(safeText(h.name)+' öldü; adı soy kütüğünde kaldı.','bad');
  }
 }
}
function horseSummaryHtml(){
 const st=ensureHorseStable();
 let html='<div class="card"><h3>🐎 At Ocağı</h3><p>'+st.horses.length+' yaşayan at • '+st.foals+' tay • '+st.wins+'/'+st.races+' yarış zaferi</p>'+
  actionButton('Yeni at edin',{kind:'horseStable',id:'buy'},"horseAction('buy')",assetBuyPrice('horse')+' servet • en çok 8 at')+'</div>';
 if(st.horses.length)html+='<div class="grid2">'+st.horses.map(h=>{
  let txt='<div class="card"><h3>'+safeText(h.name)+' • '+(h.sex==='mare'?'Kısrak':'Aygır')+'</h3><p>'+h.age+' yaş • '+h.generation+'. kuşak • '+safeText(h.temperament)+
   '<br>Sağlık '+h.health+' • Kondisyon '+h.condition+' • Bağ '+h.bond+'<br>Hız '+h.speed+' • Dayanıklılık '+h.stamina+' • Talim '+h.training+
   '<br>Yarış '+h.wins+'/'+h.races+(h.motherId?'<br>Ana: '+safeText(h.motherId):'')+(h.fatherId?' • Ata: '+safeText(h.fatherId):'')+
   (h.pregnancy?'<br>Tay bekliyor • '+h.pregnancy.months+' ay':'')+'</p><div class="actions">';
  for(const [id,label] of [['care','Bakım yap'],['train','Talim yaptır'],['race','Toyda yarıştır'],['sell','Takas et']])
   txt+=actionButton(label,{kind:'horseStable',id,horseId:h.id},"horseAction('"+id+"','"+h.id+"')",id==='race'?'Katılım 2 servet':'Bir ay harcar');
  if(h.sex==='mare'&&h.age>=3&&h.age<=17&&!h.pregnancy){
   txt+=actionButton('Dış aygırla eşleştir',{kind:'horseStable',id:'breed',horseId:h.id,other:'outside'},"horseAction('breed','"+h.id+"','outside')",'4 servet • 11 ay sonra tay');
   for(const stallion of st.horses.filter(x=>x.sex==='stallion'&&x.age>=3&&x.age<=19&&x.id!==h.id))
    txt+=actionButton(safeText(stallion.name)+' ile eşleştir',{kind:'horseStable',id:'breed',horseId:h.id,other:stallion.id},"horseAction('breed','"+h.id+"','"+stallion.id+"')",'1 servet • yakın akrabalar eşleştirilemez');
  }
  return txt+'</div></div>';
 }).join('')+'</div>';
 if(st.history.length)html+='<div class="card"><h3>Atların Geçmişi</h3><p>'+st.history.slice(0,6).map(x=>safeText(x.year+' • '+(x.name?x.name+': ':'')+x.note)).join('<br>')+'</p>'+
  (st.pedigree.length?'<p><b>Soy arşivi:</b> '+st.pedigree.slice(0,5).map(x=>safeText(x.name+' • '+x.generation+'. kuşak • '+x.reason)).join(' / ')+'</p>':'')+'</div>';
 return html;
}
function horseStableInheritance(old,share){
 if(!old.horseStable)return null;
 const from=old.horseStable,keep=share.assets.includes('horse'),living=Array.isArray(from.horses)?from.horses:[];
 return {initialized:true,horses:keep?JSON.parse(JSON.stringify(living.slice(0,8))):[],
  pedigree:JSON.parse(JSON.stringify([...(from.pedigree||[]),...(keep?[]:living.map(h=>horsePedigree(h,'miras başka kola kaldı')))].slice(0,100))),
  history:JSON.parse(JSON.stringify((from.history||[]).slice(0,80))),races:from.races||0,wins:from.wins||0,foals:from.foals||0};
}
function horseSickEvent(i){
 const h=horses().filter(x=>x.health<60).sort((a,b)=>a.health-b.health)[0];if(!h)return;
 if(i===0){h.health=clamp(h.health+12);h.condition=clamp(h.condition+6);}
 else if(i===1){h.health=clamp(h.health+4);h.condition=clamp(h.condition+8);}
 else{h.health=clamp(h.health-8);h.condition=clamp(h.condition-6);}
 horseHistory('illness',h,i===0?'Otacı yardımı aldı.':i===1?'Dinlendirildi.':'Rahatsızlığı ihmal edildi.');
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
 if(h.mode==='hosted_yurt'){push(npcById(h.hostId));if(s.partner?.alive&&s.married)push(s.partner);}
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
 const row=s.crimeRecord.find(x=>x.id===rec.id);if(row){row.result=reason;row.status=rec.status;}j.history.unshift({year:s.year+s.age,age:s.age,caseId:rec.id,result:reason});j.history=j.history.slice(0,60);softenCommunityRumorByCase(rec.id,18);applyCommunityAxes({honor:2,reliability:3,generosity:1},'Töre meselesinde zararı telafi edip sorumluluk aldın.');log('Töre meselesi kapandı: '+reason+'.','good');
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
   const pressure=.18+rec.evidence/120+witnesses.length*.12+j.suspicion/320-(s.skills.speech||0)/520-s.prestige/850-rec.mediationBonus/500+communityJusticePressure();
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
 r.contacts=Array.isArray(r.contacts)?r.contacts.filter(Boolean).map(n=>normalizeNPC(n,n.type||'Ocak Krizi Tanığı')):[];
 r.separations=Array.isArray(r.separations)?r.separations.slice(0,30):[];r.totalSeparations=Math.max(0,Math.round(r.totalSeparations||0));
 s.exPartners=Array.isArray(s.exPartners)?s.exPartners:[];
 if(s.partner?.alive){
  if(!r.current||r.current.partnerId!==s.partner.id){
   r.current={partnerId:s.partner.id,stage:s.married?'married':'courtship',startedYear:s.year+s.age,startedAge:s.age,monthsTogether:0,harmony:clamp(Math.round((s.partner.rel||60)*.8)),commitment:s.married?75:35,familyApproval:initialFamilyApproval(s.partner),tension:5,jealousy:s.partner.traits?.includes('kuskucu')?24:8,neglectMonths:0,arguments:0,reconciliations:0,sharedWork:0,compatibility:relationshipCompatibility(s.partner),lastCareYear:null,lastCareMonth:null,householdContribution:0,betrayal:{incidents:0,discovered:false,unresolved:false,evidence:0,forgiven:0,lastYear:null,thirdPartyId:null},memories:[]};
   r.totalRelationships++;
  }
  r.current.stage=s.married?'married':'courtship';
  r.current.monthsTogether=Math.max(0,Math.round(r.current.monthsTogether||0));for(const k of ['harmony','commitment','familyApproval','tension','jealousy','compatibility'])r.current[k]=clamp(Number.isFinite(r.current[k])?r.current[k]:(k==='compatibility'?relationshipCompatibility(s.partner):k==='familyApproval'?initialFamilyApproval(s.partner):k==='tension'?5:35));
  r.current.neglectMonths=Math.max(0,Math.round(r.current.neglectMonths||0));r.current.arguments=Math.max(0,Math.round(r.current.arguments||0));r.current.reconciliations=Math.max(0,Math.round(r.current.reconciliations||0));r.current.sharedWork=Math.max(0,Math.round(r.current.sharedWork||0));r.current.householdContribution=Math.max(0,Math.round(r.current.householdContribution||0));
  r.current.betrayal=r.current.betrayal&&typeof r.current.betrayal==='object'?r.current.betrayal:{};const b=r.current.betrayal;b.incidents=Math.max(0,Math.round(b.incidents||0));b.discovered=!!b.discovered;b.unresolved=!!b.unresolved;b.evidence=clamp(Number.isFinite(b.evidence)?b.evidence:0);b.forgiven=Math.max(0,Math.round(b.forgiven||0));b.lastYear=Number.isFinite(b.lastYear)?b.lastYear:null;b.thirdPartyId=b.thirdPartyId||null;
  r.current.memories=Array.isArray(r.current.memories)?r.current.memories.slice(-20):[];
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

function marriageBetrayalRisk(){
 const p=currentRomance(),n=s.partner;if(!s.married||!p||!n?.alive)return 0;normalizeBonds(n);
 let risk=5+p.tension*.52+Math.min(24,p.neglectMonths*3)+Math.max(0,55-p.commitment)*.48+Math.max(0,50-p.harmony)*.32+Math.max(0,48-p.compatibility)*.22;
 if(n.traits?.includes('hirsli'))risk+=5;if(n.traits?.includes('sadik'))risk-=16;if(n.traits?.includes('merhametli'))risk-=4;if(n.traits?.includes('kinci')&&p.tension>=45)risk+=5;
 if((n.place&&n.place!==s.place)||(n.realm&&n.realm!==s.realm))risk+=8;if(p.betrayal?.unresolved)risk=100;if(p.betrayal?.forgiven)risk+=Math.min(12,p.betrayal.forgiven*3);
 return clamp(Math.round(risk));
}
function marriageLoyaltyLabel(){const p=currentRomance();if(!p)return '—';if(p.betrayal?.unresolved)return 'İhanet açığa çıktı';const r=marriageBetrayalRisk();return r<30?'Güçlü':r<55?'Hassas':'Kriz riski';}
function romanceThirdParty(){
 const p=currentRomance();if(!p?.betrayal?.thirdPartyId)return null;return ensureRomance().contacts.find(n=>n.id===p.betrayal.thirdPartyId)||npcById(p.betrayal.thirdPartyId);
}
function createRomanceThirdParty(){
 const r=ensureRomance(),p=currentRomance();if(!p)return null;let n=romanceThirdParty();if(n)return n;
 const cfg=D.realms[s.partner?.realm||s.realm]||D.realms[s.realm],gender=s.partner?.gender==='male'?'female':'male',age=Math.max(18,(s.partner?.age||s.age)+rng(-6,6));
 n=normalizeNPC({name:pick(cfg[gender]),gender,age,birthYear:s.year+s.age-age,alive:true,type:'Ocak Krizi Tanığı',rel:rng(25,48),realm:s.partner?.realm||s.realm,place:s.partner?.place||s.place,tribe:s.partner?.tribe||s.tribe,traits:chooseNPCTraits()},'Ocak Krizi Tanığı');
 n.statusFlags.romanceThirdParty=true;n.statusFlags.partnerOf=s.partner?.id||null;r.contacts.push(n);p.betrayal.thirdPartyId=n.id;return n;
}
function recordPartnerBetrayal(evidence=45){
 const p=currentRomance(),n=s.partner;if(!p||!n?.alive)return null;const other=createRomanceThirdParty(),b=p.betrayal;
 if(!b.unresolved){b.incidents++;b.lastYear=s.year+s.age;}b.discovered=true;b.unresolved=true;b.evidence=clamp(Math.max(b.evidence||0,evidence));p.tension=clamp(p.tension+28);p.harmony=clamp(p.harmony-20);p.commitment=clamp(p.commitment-22);
 adjustNPC(n,{rel:-12,trust:-18,grudge:14},'Başka biriyle gizli yakınlığı ortaya çıktı.');if(other)adjustSocialLink(n,other,{score:42,trust:10,tag:'secret_romance'},'Gizli yakınlıkları ortaya çıktı.');
 rememberRomance('Eşinin başka biriyle gizli yakınlığı ortaya çıktı.',10);return other;
}
function forgivePartnerBetrayal(){
 const p=currentRomance(),n=s.partner;if(!p?.betrayal?.unresolved||!n)return false;p.betrayal.unresolved=false;p.betrayal.forgiven++;p.tension=clamp(p.tension-12);p.commitment=clamp(p.commitment+4);p.harmony=clamp(p.harmony+3);adjustNPC(n,{rel:3,trust:2,grudge:-4},'İhanetin ardından ilişkiye bir şans daha verdin.');rememberRomance('İhanetin ardından ilişkiye bir şans daha vermeyi seçtin.',8);return true;
}
function minorSharedChildren(){return s.children.filter(c=>c?.alive&&c.age<18&&c.parentIds?.includes(s.partner?.id));}
function separationAssetCandidate(){
 const assigned=ensureFamilyBranches().assetHeirs||{},pool=s.assets.filter(id=>!assigned[id]&&!(id==='yurt'&&ensureHousing().mode==='own_yurt'));
 return pool.sort((a,b)=>(D.assets.find(x=>x.id===a)?.cost||0)-(D.assets.find(x=>x.id===b)?.cost||0))[0]||null;
}
function marriageSettlement(mode='amicable'){
 const p=currentRomance(),n=s.partner,months=p?.monthsTogether||0,years=months/12,betrayal=p?.betrayal||{},minor=minorSharedChildren();
 let rate=.18+Math.min(.16,years*.018)+Math.min(.08,(p?.sharedWork||0)*.018)+Math.min(.05,(p?.householdContribution||0)/240);
 if(mode==='amicable')rate+=.04;if(mode==='tore')rate+=.02;if(mode==='betrayal'&&betrayal.discovered)rate-=.12;if(mode==='hostile')rate+=.08;rate=Math.max(.08,Math.min(.48,rate));
 const wealth=Math.min(s.wealth,Math.max(0,Math.round(s.wealth*rate))),asset=(months>=36&&rate>=.28&&s.assets.length>=2)?separationAssetCandidate():null;
 let residence='shared';if(mode==='betrayal'&&betrayal.discovered)residence='player';else if(mode==='hostile')residence=(n?.bonds?.trust||0)>(n?.bonds?.grudge||0)+25?'shared':'player';else if(mode==='tore'&&minor.length){const pw=n?.wealth||0;residence=pw>s.wealth*1.25?'former_partner':s.wealth>Math.max(1,pw)*1.8?'player':'shared';}
 const careContribution=minor.length&&residence!=='shared'?Math.max(1,Math.min(3,Math.ceil(minor.length/2))):0;
 return {mode,rate,wealth,asset,residence,careContribution,children:minor.map(c=>c.id),evidence:betrayal.evidence||0};
}
function separationResidenceLabel(v){return v==='player'?'senin ocağın':v==='former_partner'?'diğer ebeveynin ocağı':'iki ocakla ortak bağ';}
function applyChildResidence(record,n){
 for(const id of record.childIds||record.children||[]){const c=s.children.find(x=>x.id===id);if(!c?.alive)continue;c.statusFlags=c.statusFlags||{};c.statusFlags.separationId=record.id;c.statusFlags.primaryHousehold=record.residence;
  if(record.residence==='former_partner'&&n){c.realm=n.realm||s.realm;c.place=n.place||s.place;adjustNPC(c,{rel:-2,trust:-2},'Ocak ayrılığından sonra çoğunlukla diğer ebeveynin yanında yaşamaya başladı.');}
  else if(record.residence==='player'){c.realm=s.realm;c.place=s.place;adjustNPC(c,{trust:1},'Ocak ayrılığından sonra senin yanında yaşamayı sürdürdü.');}
  else rememberNPC(c,'family','Anne ve ata ayrı ocaklarda yaşasa da iki tarafla bağını sürdürdü.',5);
 }
}
function closeRelationshipWithSettlement(mode='amicable',reason='ocak ayrılığı'){
 const r=ensureRomance(),n=s.partner;if(!n)return false;const wasMarried=!!s.married,p=currentRomance(),settlement=wasMarried?marriageSettlement(mode):{mode,rate:0,wealth:0,asset:null,residence:'shared',careContribution:0,children:[]};
 if(wasMarried){
  s.wealth=Math.max(0,s.wealth-settlement.wealth);n.wealth=Math.max(0,(n.wealth||0)+settlement.wealth);
  if(settlement.asset){s.assets=s.assets.filter(x=>x!==settlement.asset);delete ensureEconomy().assetState[settlement.asset];n.statusFlags=n.statusFlags||{};n.statusFlags.settlementAssets=Array.isArray(n.statusFlags.settlementAssets)?n.statusFlags.settlementAssets:[];n.statusFlags.settlementAssets.push(settlement.asset);const ne=normalizeNPCEstate(n);if(!ne.assets.includes(settlement.asset))ne.assets.push(settlement.asset);ne.history.unshift({year:s.year+s.age,type:'settlement',asset:settlement.asset,from:s.id});}
  const rec={id:'sep_'+(s.year+s.age)+'_'+Math.random().toString(36).slice(2,7),partnerId:n.id,name:n.name,year:s.year+s.age,age:s.age,reason,mode:settlement.mode,wealth:settlement.wealth,asset:settlement.asset,residence:settlement.residence,careContribution:settlement.careContribution,childIds:[...settlement.children],missedSupport:0,activeSupport:settlement.careContribution>0};
  r.separations.unshift(rec);r.separations=r.separations.slice(0,30);r.totalSeparations++;applyChildResidence(rec,n);settlement.id=rec.id;
  for(const childId of rec.childIds.slice(0,2))scheduleDelayedEvent({id:'separation_child_adjustment_v24',years:[1,2],payload:{detail:'Anne ve atası ayrı ocaklara geçti.'}},{targetId:childId,sourceEventId:'separation_v24'});
 }
 const profile=p?JSON.parse(JSON.stringify(p)):null;n.type=wasMarried?'Eski Eş':'Eski Eş Adayı';n.statusFlags=n.statusFlags||{};n.statusFlags.exPartner=true;n.statusFlags.breakupReason=reason;n.statusFlags.lastSettlement=settlement;
 if(!s.exPartners.some(x=>x.id===n.id))s.exPartners.push(n);r.history.unshift({partnerId:n.id,name:n.name,married:wasMarried,reason,endedYear:s.year+s.age,endedAge:s.age,profile,settlement});r.history=r.history.slice(0,40);
 if(r.current){r.current.stage='ended';r.current.endReason=reason;}markFormerInLaws(n.id);s.partner=null;s.married=false;apply({happiness:mode==='amicable'?-3:-7});log(safeText(n.name)+' ile ocak ayrıldı: '+reason+'.','major');return settlement;
}
function separationIssue(mode){
 if(!s.married||!s.partner?.alive)return 'Ocak ayrılığı için yaşayan eş gerekiyor.';if(!['amicable','tore','betrayal','hostile'].includes(mode))return 'Ayrılık biçimi bulunamadı.';
 if(mode==='betrayal'&&!currentRomance()?.betrayal?.discovered)return 'Sadakat ihlali ortaya çıkmış değil.';return '';
}
function separationAction(mode='amicable'){
 const issue=separationIssue(mode);if(issue){notice(issue);return false;}
 return performAction({kind:'separation',mode},()=>{
  const n=s.partner,p=currentRomance(),betrayal=p?.betrayal?.discovered;let reason=mode==='amicable'?'karşılıklı ocak ayırma':mode==='tore'?'töre önünde mal ve bakım paylaşımı':mode==='betrayal'?'sadakat ihlalinden sonra ayrılık':'ağır anlaşmazlık';
  if(n)adjustNPC(n,mode==='amicable'?{rel:-3,trust:-2,grudge:-2}:mode==='betrayal'?{rel:-12,trust:-15,grudge:12}:{rel:-8,trust:-7,grudge:8},'Ocak ayrılığı yaşandı.');
  const settlement=closeRelationshipWithSettlement(mode,reason);if(settlement)log('Paylaşım: '+settlement.wealth+' servet'+(settlement.asset?' • '+safeText(D.assets.find(a=>a.id===settlement.asset)?.name||settlement.asset):'')+(settlement.children?.length?' • çocuk düzeni '+safeText(settlement.residence):''),'major');
 },'Ocak ayrılığı, mal ve çocuk düzeni üzerine bir ay geçti.');
}
function separationYearTick(){
 const r=ensureRomance();for(const rec of r.separations.filter(x=>x.activeSupport&&x.careContribution>0)){
  const ex=s.exPartners.find(n=>n.id===rec.partnerId);if(!ex?.alive){rec.activeSupport=false;continue;}const kids=(rec.childIds||[]).map(id=>s.children.find(c=>c.id===id)).filter(c=>c?.alive&&c.age<18);if(!kids.length){rec.activeSupport=false;continue;}
  if(rec.residence==='former_partner'){const pay=Math.min(s.wealth,rec.careContribution);s.wealth-=pay;ex.wealth=(ex.wealth||0)+pay;if(pay<rec.careContribution)rec.missedSupport=(rec.missedSupport||0)+1;}
  else if(rec.residence==='player'){const pay=Math.min(ex.wealth||0,rec.careContribution);ex.wealth=Math.max(0,(ex.wealth||0)-pay);s.wealth+=pay;}
 }
}
function marriageCrisisSummaryHtml(){
 const r=ensureRomance(),p=r.current,n=s.partner;if(n?.alive&&s.married&&p){const b=p.betrayal||{},other=romanceThirdParty();return '<div class="card"><h3>🔥 Ocak Güveni</h3><p>Sadakat: '+safeText(marriageLoyaltyLabel())+' • gerilim '+p.tension+' • bağlılık '+p.commitment+(b.discovered?'<br>Ortaya çıkan ihlal '+b.incidents+' • dayanak '+b.evidence+(other?' • adı geçen '+safeText(other.name):''):'')+'</p></div>';}
 const last=r.separations?.[0];if(last)return '<div class="card"><h3>🪶 Son Ocak Ayrılığı</h3><p>'+safeText(last.name)+' • '+safeText(last.reason)+'<br>Paylaşım '+last.wealth+' servet'+(last.asset?' • '+safeText(D.assets.find(a=>a.id===last.asset)?.name||last.asset):'')+(last.childIds?.length?' • çocuk düzeni '+safeText(separationResidenceLabel(last.residence)):'')+'</p></div>';return '';
}
function applyMarriageCrisisEffect(spec={}){
 const mode=spec.mode||'';if(mode==='discover'){recordPartnerBetrayal(spec.evidence||45);}
 else if(mode==='forgive'){if(!currentRomance()?.betrayal?.unresolved)recordPartnerBetrayal(spec.evidence||55);forgivePartnerBetrayal();}
 else if(mode==='confront'){if(!currentRomance()?.betrayal?.unresolved)recordPartnerBetrayal(spec.evidence||65);currentRomance().betrayal.evidence=clamp(currentRomance().betrayal.evidence+(spec.evidenceGain||15));adjustRomance({tension:8,commitment:-4},'İhaneti açıkça yüzüne vurup açıklık istedin.');}
 else if(mode==='separate'){if(!currentRomance()?.betrayal?.unresolved)recordPartnerBetrayal(spec.evidence||70);closeRelationshipWithSettlement('betrayal','sadakat ihlalinden sonra ayrılık');}
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
function closeRelationship(reason='ayrılık'){return closeRelationshipWithSettlement('amicable',reason);}
function endRelationship(){
 if(s.married)return separationAction('amicable');
 return performAction({kind:'breakup'},()=>{const p=currentRomance(),n=s.partner,reason=p?.tension>=60?'uzun süren gerilim':'yollarınızı ayırma kararı';if(n){adjustNPC(n,{rel:-10,trust:-8,grudge:p?.tension>=60?10:4},'İlişkiniz sona erdi.');closeRelationshipWithSettlement('amicable',reason);}},'Ayrılık kararını konuşarak bir ay geçirdin.');
}
function reconcileEx(index){
 return performAction({kind:'reconcileEx',index},()=>{
  const r=ensureRomance(),n=s.exPartners[index];if(!n?.alive||s.partner?.alive)return;
  normalizeNPC(n,n.type);const chance=Math.max(.12,Math.min(.9,.25+n.rel/250+(n.bonds?.trust||0)/300-(n.bonds?.grudge||0)/220));
  if(Math.random()<chance){
   s.exPartners.splice(index,1);s.partner=n;s.partner.type='Eş adayı';s.married=false;r.current={partnerId:n.id,stage:'courtship',startedYear:s.year+s.age,startedAge:s.age,monthsTogether:0,harmony:clamp((n.rel||50)-5),commitment:35,familyApproval:initialFamilyApproval(n),tension:18,jealousy:10,neglectMonths:0,arguments:0,reconciliations:1,sharedWork:0,householdContribution:0,betrayal:{incidents:0,discovered:false,unresolved:false,evidence:0,forgiven:0,lastYear:null,thirdPartyId:null},compatibility:relationshipCompatibility(n),lastCareYear:s.year+s.age,lastCareMonth:currentMonth(),memories:[{text:'Eski ilişkinizi yeniden denemeye karar verdiniz.',weight:6,year:s.year+s.age}]};adjustNPC(n,{rel:8,trust:7,grudge:-12},'Bir süre ayrı kaldıktan sonra yeniden görüştünüz.');log(safeText(n.name)+' ile yeniden görüşmeye başladın.','major');
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
 if(s.married&&(action.kind==='romance'||action.kind==='work'||action.kind==='housing'||action.kind==='parenting'))p.householdContribution=Math.min(240,p.householdContribution+1);
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
   (s.married?
    actionButton('Dostça ocak ayır',{kind:'separation',mode:'amicable'},"separationAction('amicable')",'Mal ve çocuk düzenini mümkün olduğunca uzlaşmayla kapatır.')+
    actionButton('Töre önünde paylaş',{kind:'separation',mode:'tore'},"separationAction('tore')",'Servet, bazı varlıklar ve çocukların ana hanesi için daha resmî bir paylaşım yapar.')+
    (p.betrayal?.discovered?actionButton('İhanet nedeniyle ayrıl',{kind:'separation',mode:'betrayal'},"separationAction('betrayal')",'Ortaya çıkan sadakat ihlali mal paylaşımını ve çocuk düzenini etkiler.'):'')
    :actionButton('İlişkiyi bitir',{kind:'breakup'},'endRelationship()','İlişkiyi kalıcı geçmişe taşır; eski eş adayı olarak hatırlanır.'))+
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


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='friend_returns')){
 EVENT_DECK.push(
  {id:'friend_returns',cat:'Dostluk',min:10,max:100,w:8,cool:20,req:'hasDistantFriend',target:'distantFriend',text:'Uzun süredir seyrek görüştüğün {name} yeniden obana uğradı.',choices:[
   ['Eski dostluğu yeniden canlandır',{happiness:4,targetRel:5,targetTrust:4,targetGrudge:-3}],
   ['Geçmişi geçmişte bırak',{happiness:1,targetRel:-2}]
  ]},
  {id:'friend_work_opening',cat:'Dostluk',min:14,max:75,w:6,cool:22,req:'hasCareerFriend',target:'careerFriend',text:'{name}, kendi görev çevresinde sana uygun olabilecek bir kapı açıldığını söyledi.',choices:[
   ['Beni tanıştırmasını iste',{prestige:1,targetRel:3,targetTrust:3,targetRespect:2}],
   ['Kendi yolumdan ilerleyeyim',{happiness:1,targetRespect:1}]
  ]},
  {id:'friend_circle_conflict',cat:'Dostluk',min:10,max:90,w:7,cool:16,req:'hasFriendCircle',target:'circleFriend',text:'Dost çevrende bir süredir biriken gerginlik {name} üzerinden açıkça ortaya çıktı.',choices:[
   ['Herkesi dinleyip arayı bul',{prestige:2,happiness:1,targetRel:3,targetTrust:3,targetGrudge:-3}],
   ['Açıkça bir taraf tut',{prestige:1,targetRel:2,targetTrust:-2,targetGrudge:3}]
  ]}
 );
}


if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='workplace_credit_dispute')){
 EVENT_DECK.push(
  {id:'workplace_credit_dispute',cat:'Görev',min:12,max:100,w:7,cool:16,req:'workplaceConflict',target:'workplacePeer',text:'{name}, ortak yaptığınız işte payın çoğunu kendisinin taşıdığını söylemeye başladı.',choices:[
   ['Payı açıkça konuşup uzlaş',{happiness:1,targetRel:3,targetTrust:3,targetGrudge:-4}],
   ['Kendi emeğini öne çıkar',{prestige:2,targetRel:-4,targetTrust:-3,targetRespect:3,targetGrudge:5}]
  ]},
  {id:'workplace_supervisor_test',cat:'Görev',min:12,max:100,w:6,cool:18,req:'hasWorkplace',target:'workplaceSupervisor',text:'{name}, bu ay sana normalden daha zor bir işi tek başına yürütüp yürütemeyeceğini sordu.',choices:[
   ['Sorumluluğu üstlen',{skill:2,prestige:2,targetRel:3,targetTrust:4,targetRespect:5}],
   ['Önce birlikte hazırlık iste',{skill:1,targetRel:2,targetTrust:2,targetRespect:2}]
  ]},
  {id:'workplace_junior_mistake',cat:'Görev',min:18,max:100,w:6,cool:20,req:'hasWorkplaceJunior',target:'workplaceJunior',text:'Yanında yetişen {name}, ortak işte önemli bir hata yaptı ve nasıl davranacağını sana bırakıyor.',choices:[
   ['Hatasını birlikte düzelt',{skill:1,happiness:1,targetRel:4,targetTrust:5,targetRespect:4}],
   ['Sorumluluğu açıkça ona yükle',{prestige:1,targetRel:-2,targetTrust:-4,targetFear:5,targetRespect:2}]
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
 const people=householdMembers(mode).length,month=currentMonth(),winter=month>=10||month<=2?0.1:0,ride=(s.skills.riding||0)/600,horse=s.assets.includes('horse')?.06:0,caps=healthCapabilities(),mobility=Math.max(0,(60-caps.mobility)/300);
 const support=(mode!=='alone'?0.035:0)+(ensureHealthProfile().adaptations.mobility_support?0.035:0)+(ensureHealthProfile().adaptations.family_support?0.02:0);
 return Math.max(.04,Math.min(.48,.08+dest.distance*.045+(dest.cross?.07:0)+people*.008+winter+mobility-ride-horse-support));
}
function migrationIssue(realm,place,mode='alone'){
 if(s.captive)return 'Tutsakken göç edemezsin.';if(s.exile)return 'Sürgün meselesini çözmeden planlı göç yapamazsın.';if(s.military.active)return 'Aktif seferde göç edemezsin.';if(s.age<16)return '16 yaşından önce göç kararını ailen verir.';if(mode==='alone'&&healthCapabilities().mobility<36&&!ensureHealthProfile().adaptations.mobility_support)return 'Bu kadar düşük hareket kapasitesiyle yalnız uzun göç riskli; hareket desteği kur veya yakınlarınla göç et.';
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
  m.moves++;m.localStanding=clamp((dest.cross?18:28)+Math.round((communityGoodName()-50)*(dest.cross?.03:.08)));m.monthsHere=0;m.arrivalYear=s.year+s.age;m.arrivalAge=s.age;m.history.unshift({year:s.year+s.age,age:s.age,fromRealm:oldRealm,from:oldPlace,toRealm:realm,to:place,mode,cost,trouble});m.history=m.history.slice(0,30);
  if(s.role&&['Boy Beyi','Elçi','Bitigçi'].includes(s.role)&&dest.cross){s.retiredRole=s.role;s.role=null;log('Başka siyasi çevreye göçün eski devlet görevini sona erdirdi.','major');}
  log(oldPlace+' çevresinden '+place+' çevresine göç ettin'+(members.length?' • yanında '+members.length+' yakın vardı':'')+'.','major');
 },place+' çevresine göç yolculuğuyla bir ay geçti.');
}
function localIntegrationAction(id){
 performAction({kind:'settlement',id},()=>{
  const m=ensureMobility();
  if(id==='neighbors'){m.localStanding=clamp(m.localStanding+8);apply({happiness:2});if(Math.random()<.45){const g=pick(['male','female']),age=Math.max(8,s.age+rng(-5,6)),n=normalizeNPC({name:pick(D.realms[s.realm][g]),gender:g,age,birthYear:s.year+s.age-age,alive:true,type:'Yerel Dost',rel:rng(56,70),realm:s.realm,place:s.place,tribe:pick(D.realms[s.realm].tribes)},'Yerel Dost');adjustNPC(n,{trust:8,respect:3},'Yeni yerleşimde tanıştınız.');s.friends.push(n);ensureFriendProfile(n);autoCreateFriendCircle();}}
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


/* v33: long-term personal purposes are separate from rerolled annual ambitions.
   Only actions actually taken AFTER choosing a purpose count toward its work. */
const LIFE_PURPOSE_DEFS={
 alp:{name:'Alplık Ülküsü',icon:'⚔️',meaning:'Savaşta ve savunmada iz bırak',
  stages:[
   {title:'At ve ok talimi',need:3,desc:'3 talim/askerlik eylemi ve en az 20 binicilik',test:()=>s.skills.riding>=20},
   {title:'Alp olarak tanın',need:9,desc:'9 eylem, 40 savaş becerisi ve bir sefer hizmeti',test:()=>s.skills.combat>=40&&s.military.served},
   {title:'Seferlerin hatırası',need:16,desc:'16 eylem, en az 2 sefer ve 55 itibar',test:()=>s.military.campaigns>=2&&s.prestige>=55}]},
 craft:{name:'Ustalık Ülküsü',icon:'🔨',meaning:'El emeğiyle kalıcı bir ocak kur',
  stages:[
   {title:'Usta yanında yetiş',need:3,desc:'3 zanaat eylemi ve 25 zanaat becerisi',test:()=>s.skills.craft>=25},
   {title:'Kendi işini üstlen',need:9,desc:'9 eylem, 45 zanaat ve Demirci görevi veya Demir Ocağı',test:()=>s.skills.craft>=45&&(s.role==='Demirci'||s.assets.includes('smithy'))},
   {title:'Ustanın adı',need:16,desc:'16 eylem, 65 zanaat, 45 itibar ve ustalık/ocak emeği',test:()=>s.skills.craft>=65&&s.prestige>=45&&(s.assets.includes('smithy')||careerProfile('smith').mastery>=25)}]},
 trade:{name:'Kervan ve Refah Ülküsü',icon:'🧺',meaning:'İşini büyüt ve hanene refah getir',
  stages:[
   {title:'Takas öğren',need:3,desc:'3 ticaret eylemi ve 20 ticaret becerisi',test:()=>s.skills.trade>=20},
   {title:'Kazancı tut',need:9,desc:'9 eylem, 45 servet ve sürü/kervan payı',test:()=>s.wealth>=45&&(s.assets.includes('flock')||s.assets.includes('caravan_share'))},
   {title:'Kervan sahibi',need:16,desc:'16 eylem, 95 servet, 55 ticaret ve kervan payı',test:()=>s.wealth>=95&&s.skills.trade>=55&&s.assets.includes('caravan_share')}]},
 kin:{name:'Soyu Yaşatma Ülküsü',icon:'🌿',meaning:'Ailenle güven bağı kur ve ocağı sonraki kuşağa bırak',
  stages:[
   {title:'Aileyle ilgilen',need:3,desc:'3 yakınlık eylemi ve en az 55 aile desteği',test:()=>familySupportScore()>=55},
   {title:'Ocağı büyüt',need:9,desc:'9 eylem ve yaşayan eş veya çocuk',test:()=>!!s.partner?.alive||s.children.some(n=>n.alive)},
   {title:'Soya miras bırak',need:16,desc:'16 eylem, yaşayan çocuk ve hazırlanmış paylaşım',test:()=>s.children.some(n=>n.alive)&&ensureSuccession().prepared}]},
 wisdom:{name:'Bilgelik ve Söz Ülküsü',icon:'📜',meaning:'Bitig, söz ve öğretiyle saygınlık kazan',
  stages:[
   {title:'Bitig öğren',need:3,desc:'3 öğrenme eylemi ve 20 bitig becerisi',test:()=>s.skills.literacy>=20},
   {title:'Söz sahibi ol',need:9,desc:'9 eylem, 45 bitig ve bilgi/söz görevi',test:()=>s.skills.literacy>=45&&['Bitigçi','Ozan','Elçi','Boy Beyi'].includes(s.role)},
   {title:'Öğreten bilge',need:16,desc:'16 eylem, 65 bitig, 45 itibar ve meclis/meslek ustalığı',test:()=>s.skills.literacy>=65&&s.prestige>=45&&(ensureStateCourt().influence>=30||careerProfile('scribe').mastery>=25)}]},
 peace:{name:'Barış ve Töre Ülküsü',icon:'🕊️',meaning:'Kin yerine uzlaşma ve güven bırakan biri ol',
  stages:[
   {title:'İlk arabuluculuk',need:2,desc:'2 uzlaşma eylemi ve en az 20 söz becerisi',test:()=>s.skills.speech>=20},
   {title:'Güvenilir arabulucu',need:5,desc:'5 uzlaşma eylemi, iyi ad 60 ve en az bir çözülen aile meselesi',test:()=>communityGoodName()>=60&&ensureFamilyDynamics().resolved>=1},
   {title:'Barışın izi',need:10,desc:'10 uzlaşma eylemi, iyi ad 75 ve 3 aile meselesi çözümü',test:()=>communityGoodName()>=75&&ensureFamilyDynamics().resolved>=3}]}
};
function ensureLifePurpose(){
 if(!s.lifePurpose||typeof s.lifePurpose!=='object'||Array.isArray(s.lifePurpose))s.lifePurpose={};
 const p=s.lifePurpose;
 p.active=p.active&&LIFE_PURPOSE_DEFS[p.active.id]?p.active:null;
 p.history=Array.isArray(p.history)?p.history.slice(0,50):[];
 p.completed=Array.isArray(p.completed)?p.completed.filter(x=>x&&LIFE_PURPOSE_DEFS[x.id]).slice(0,12):[];
 p.lastSelectionYear=Number.isFinite(p.lastSelectionYear)?p.lastSelectionYear:null;
 if(p.active){
  const a=p.active;a.id=a.id;a.stage=Math.max(0,Math.min(3,Math.floor(a.stage||0)));
  a.actions=Math.max(0,Math.floor(a.actions||0));a.selectedYear=Number.isFinite(a.selectedYear)?a.selectedYear:s.year+s.age;
  a.lastMilestoneYear=Number.isFinite(a.lastMilestoneYear)?a.lastMilestoneYear:a.selectedYear-1;
  a.stalledYears=Math.max(0,Math.floor(a.stalledYears||0));a.resolve=clamp(Number.isFinite(a.resolve)?a.resolve:60);
  a.milestones=Array.isArray(a.milestones)?a.milestones.slice(0,3):[];
  if(a.stage>=3)a.status='completed';else a.status='active';
 }
 return p;
}
function purposeActionMatches(id,a={}){
 if(!a.kind)return false;
 if(id==='alp')return a.kind==='military'||a.kind==='training'&&['riding','archery','combat'].includes(a.id)||a.kind==='activity'&&['at','ok','av'].includes(a.id);
 if(id==='craft')return a.kind==='training'&&a.id==='craft'||a.kind==='venture'&&a.id==='forge'||a.kind==='work'&&['Demirci','Demirci Çırağı'].includes(s.role)||a.kind==='period'&&['smith','smithwork','forge'].includes(a.id);
 if(id==='trade')return a.kind==='venture'&&['caravan','herd'].includes(a.id)||a.kind==='asset'&&['caravan_share','flock'].includes(a.id)||a.kind==='work'&&['Tüccar','Kervan Başı','Kervan Rehberi'].includes(s.role)||a.kind==='period'&&['market','caravanmarket','summer_caravan','autumn_store'].includes(a.id);
 if(id==='kin')return a.kind==='npc'&&['parents','siblings','children','partner','relatives','extendedFamily','inLaws'].includes(a.group)||['parenting','childTraining','adultChild','extendedFamily','romance','housing'].includes(a.kind);
 if(id==='wisdom')return a.kind==='education'||a.kind==='training'&&['literacy','speech'].includes(a.id)||a.kind==='work'&&['Bitigçi','Ozan','Elçi','Boy Beyi'].includes(s.role)||a.kind==='stateCouncil';
 if(id==='peace')return a.kind==='familyConflict'&&['mediate','peace'].includes(a.mode)||a.kind==='justiceCase'&&['mediate','reconcile'].includes(a.id)||a.kind==='friendCircle'&&a.id==='mediate'||a.kind==='npc'&&a.group==='rivals'&&a.id==='reconcile';
 return false;
}
function lifePurposeIssue(mode,id=''){
 const p=ensureLifePurpose(),year=s.year+s.age;
 if(mode==='choose'){
  if(!LIFE_PURPOSE_DEFS[id])return 'Böyle bir ülkü yok.';
  if(p.active)return 'Önce mevcut ülküyü tamamla veya bırak.';
  if(p.lastSelectionYear===year)return 'Bu yıl zaten bir ülkü seçtin.';
  if(p.completed.some(x=>x.id===id))return 'Bu ülkü daha önce tamamlandı; yeni bir yol seç.';
  return '';
 }
 if(mode==='abandon'){
  if(!p.active)return 'Bırakılacak ülkü yok.';
  if(p.active.status==='completed')return 'Tamamlanan ülkü bırakılamaz.';
  if(p.lastSelectionYear===year)return 'Aynı yıl seçtiğin ülküyü bırakamazsın.';
  return '';
 }
 return 'Ülkü eylemi bulunamadı.';
}
function purposeRecord(reason=''){
 const p=ensureLifePurpose(),a=p.active;
 return a?{id:a.id,title:LIFE_PURPOSE_DEFS[a.id].name,stage:a.stage,actions:a.actions,
  selectedYear:a.selectedYear,year:s.year+s.age,milestones:a.milestones.map(x=>({...x})),reason,status:a.status}:null;
}
function abandonPurpose(reason='bıraktı'){
 const p=ensureLifePurpose();if(!p.active)return false;
 const record=purposeRecord(reason);p.history.unshift(record);p.history=p.history.slice(0,50);
 p.active=null;apply({happiness:-2});log('Uzun yıllar peşinden gittiğin ülküden ayrıldın.','major');return true;
}
function lifePurposeAction(mode,id=''){
 const issue=lifePurposeIssue(mode,id);if(issue){notice(issue);return false;}
 return performAction({kind:'lifePurpose',id:mode,goal:id},()=>{
  const p=ensureLifePurpose();
  if(mode==='choose'){
   p.active={id,stage:0,actions:0,selectedYear:s.year+s.age,lastMilestoneYear:s.year+s.age-1,
    stalledYears:0,resolve:60,milestones:[],status:'active'};
   p.lastSelectionYear=s.year+s.age;log('Ömürlük ülkün: '+LIFE_PURPOSE_DEFS[id].name+'.','major');
  }else abandonPurpose('kendi isteğiyle bıraktı');
 },'Yazgında iz bırakmak istediğin yol üzerine bir ay düşündün.');
}
function purposeProgressCheck(){
 const p=ensureLifePurpose(),a=p.active;if(!a||a.status!=='active')return false;
 if(a.lastMilestoneYear===s.year+s.age)return false;
 const d=LIFE_PURPOSE_DEFS[a.id],st=d.stages[a.stage];if(!st||a.actions<st.need||!st.test())return false;
 a.stage++;a.lastMilestoneYear=s.year+s.age;a.stalledYears=0;a.resolve=clamp(a.resolve+12);
 a.milestones.push({stage:a.stage,title:st.title,year:s.year+s.age,age:s.age,actions:a.actions});
 const reward=[{happiness:3,prestige:1},{happiness:4,prestige:3},{happiness:7,prestige:6}][a.stage-1];apply(reward);
 log('Ülküde aşama: '+st.title+'.','major');
 if(a.stage===3){
  a.status='completed';
  p.completed.unshift({id:a.id,title:d.name,year:s.year+s.age,age:s.age,milestones:a.milestones.map(x=>({...x}))});p.completed=p.completed.slice(0,12);
  const record=purposeRecord('tamamlandı');p.history.unshift(record);p.history=p.history.slice(0,50);
  if(a.id==='kin')ensureSuccession().familyHarmony=clamp(ensureSuccession().familyHarmony+8);
  if(a.id==='peace')applyCommunityAxes({honor:4,reliability:4},'Barış için uzun yıllar çalışman iyi adını güçlendirdi.');
  if(a.id==='alp')ensureStateCourt().tribeSupport=clamp(ensureStateCourt().tribeSupport+4);
  if(a.id==='craft')careerProfile('smith').reputation=clamp(careerProfile('smith').reputation+5);
  if(a.id==='trade')economyLedger('purpose',0,'Kervan ve refah ülküsü tamamlandı.');
  if(a.id==='wisdom')skillGain('literacy',3);
  log('Ömürlük ülkünü tamamladın: '+d.name+'.','major');
  p.active=null;
 }
 return true;
}
function trackLifePurposeAction(a={}){
 const p=ensureLifePurpose(),active=p.active;
 if(!active||active.status!=='active')return;
 if(purposeActionMatches(active.id,a))active.actions++;
 purposeProgressCheck();
}
function lifePurposeYearTick(){
 const p=ensureLifePurpose(),a=p.active;
 if(!a)return;
 const progressed=purposeProgressCheck();
 if(!progressed&&a.lastMilestoneYear!==s.year+s.age){a.stalledYears++;if(a.stalledYears>=3)a.resolve=clamp(a.resolve-5);}
 if(progressed)a.stalledYears=0;
}
function purposeNeedsReview(){const a=ensureLifePurpose().active;return !!a&&a.stalledYears>=3&&a.status==='active';}
function purposeDoubtChoice(i){
 const p=ensureLifePurpose(),a=p.active;if(!a)return;
 if(i===0){a.resolve=clamp(a.resolve+12);a.stalledYears=0;apply({happiness:2});}
 else if(i===1){a.resolve=clamp(a.resolve+6);a.stalledYears=0;apply({skill:2});}
 else abandonPurpose('vazgeçiş kartında bıraktı');
}
function purposeSummaryHtml(){
 const p=ensureLifePurpose(),a=p.active,completed=p.completed;
 let html='<div class="card"><h3>🏹 Ömürlük Ülkü</h3>';
 if(a){
  const d=LIFE_PURPOSE_DEFS[a.id],st=d.stages[a.stage];
  html+='<p><b>'+d.icon+' '+safeText(d.name)+'</b> • '+(a.stage+1)+'/3 aşama<br>'+safeText(d.meaning)+
   '<br>Yola çıkış: '+a.selectedYear+' • uğraş: '+a.actions+' ay • kararlılık: '+a.resolve+
   (a.stalledYears>=3?'<br>⚠ '+a.stalledYears+' yıldır yeni bir aşama tamamlanmadı.':'')+
   '</p><div class="memoryline"><b>Sıradaki aşama:</b> '+safeText(st.title)+'<br>'+safeText(st.desc)+' • '+a.actions+'/'+st.need+
   ' eylem • şartlar '+(st.test()?'sağlandı':'henüz tamamlanmadı')+'</div>'+
   (a.milestones.length?'<p><b>Tamamlanan:</b> '+a.milestones.map(x=>safeText(x.title+' ('+x.year+')')).join(' • ')+'</p>':'')+
   '<div class="actions">'+actionButton('Bu ülküden ayrıl',{kind:'lifePurpose',id:'abandon'},"lifePurposeAction('abandon')",'Yarım kalan yol hatırada kalır; yeni yol bu yıl açılamaz.')+'</div>';
 }else{
  html+='<p>Bir yıllık amaçtan farklıdır: seçtiğin ülkü yıllar boyunca seninle kalır. Üç kalıcı aşamayı tamamlayabilir, bir gün vazgeçebilirsin.</p>'+
   '<div class="grid2">'+Object.entries(LIFE_PURPOSE_DEFS).map(([id,d])=>actionButton(d.icon+' '+safeText(d.name),{kind:'lifePurpose',id:'choose',goal:id},"lifePurposeAction('choose','"+id+"')",safeText(d.meaning))).join('')+'</div>';
 }
 if(completed.length)html+='<div class="memoryline"><b>Başarılan ülküler:</b> '+completed.map(x=>safeText(x.title+' ('+x.year+')')).join(' • ')+'</div>';
 if(p.history.some(x=>x.status!=='completed'))html+='<div class="memoryline"><b>Yarım kalan yollar:</b> '+p.history.filter(x=>x.status!=='completed').slice(0,3).map(x=>safeText(x.title+' • '+x.stage+'/3 aşama')).join(' • ')+'</div>';
 return html+'</div>';
}
function purposeLegacySnapshot(){
 const p=ensureLifePurpose();return {active:p.active?purposeRecord('yaşamın sonu'):null,
  completed:p.completed.map(x=>({...x})),unfinished:p.history.filter(x=>x.status!=='completed').slice(0,10).map(x=>({...x}))};
}


/* v36: toy festivals are seasonal, multi-round competitions with persistent
   individual rivals and histories, independent of the v32 horse-racing stable. */
const TOY_CONTESTS={
 ok:{name:'Okçuluk Toyu',icon:'🏹',months:[3,4,5,6],minAge:12,skill:'archery',skill2:'riding',prize:12,entry:2},
 gures:{name:'Güreş Toyu',icon:'🤼',months:[5,6,7,8],minAge:12,skill:'combat',skill2:'riding',prize:14,entry:2},
 ozan:{name:'Ozanlar Toyu',icon:'🎶',months:[8,9,10,11],minAge:12,skill:'speech',skill2:'literacy',prize:11,entry:2}
};
const TOY_ROUND_NAMES=['İlk eleme','Yarı final','Toy finali'];
function ensureToyFestival(){
 if(!s.toyFestival||typeof s.toyFestival!=='object'||Array.isArray(s.toyFestival))s.toyFestival={};
 const f=s.toyFestival;
 f.entries=Array.isArray(f.entries)?f.entries.slice(0,75):[];
 f.contenders=Array.isArray(f.contenders)?f.contenders.filter(n=>n&&typeof n==='object').slice(0,24):[];
 f.history=Array.isArray(f.history)?f.history.slice(0,100):[];
 f.titles=Array.isArray(f.titles)?f.titles.slice(0,50):[];
 for(const x of f.entries){
  x.id=typeof x.id==='string'&&x.id.startsWith('toy_')?x.id:'toy_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
  x.type=TOY_CONTESTS[x.type]?x.type:'ok';
  x.year=Number.isFinite(x.year)?x.year:s.year+s.age;
  x.round=Math.max(0,Math.min(3,Math.round(x.round||0)));
  x.wins=Math.max(0,Math.round(x.wins||0));
  x.status=['active','champion','eliminated','expired'].includes(x.status)?x.status:'expired';
  x.opponentIds=Array.isArray(x.opponentIds)?x.opponentIds.slice(0,3):[];
  x.results=Array.isArray(x.results)?x.results.slice(0,3):[];
 }
 f.wins=Math.max(0,Math.round(f.wins||0));f.losses=Math.max(0,Math.round(f.losses||0));
 f.entered=Math.max(0,Math.round(f.entered||0));
 return f;
}
function toyEntry(type,year=s.year+s.age){return ensureToyFestival().entries.find(x=>x.type===type&&x.year===year)||null;}
function toySeasonRemaining(type){const def=TOY_CONTESTS[type];return def?def.months[def.months.length-1]-currentMonth():-1;}
function toyIssue(mode,type){
 const def=TOY_CONTESTS[type];if(!def)return 'Böyle bir toy yarışı bulunamadı.';
 if(s.age<def.minAge)return def.minAge+' yaşına gelmelisin.';
 if(s.health<35)return 'Toy yarışı için sağlığın toparlanmalı.';
 if(mode==='enroll'){
  if(toyEntry(type))return 'Bu yıl bu toy yarışına zaten katıldın.';
  if(!def.months.includes(currentMonth())||toySeasonRemaining(type)<3)return 'Bu toyun eleme turları için mevsim geçti.';
  if(s.wealth<def.entry)return def.entry+' servet katılım payı gerekiyor.';
  return '';
 }
 if(mode==='round'){
  const entry=toyEntry(type);
  if(!entry||entry.status!=='active')return 'Devam eden bir eleme bulunamadı.';
  if(!def.months.includes(currentMonth()))return 'Toyun mevsimi sona erdi.';
  if(entry.round>=3)return 'Bu toy tamamlandı.';
  return '';
 }
 return 'Toy eylemi bulunamadı.';
}
function toyContenderScore(n,type){
 const def=TOY_CONTESTS[type];
 const first=n.skills?.[def.skill]||0,second=n.skills?.[def.skill2]||0;
 const grit=n.traits?.includes('caliskan')?4:0,bold=n.traits?.includes('cesur')?3:0;
 return Math.max(0,Math.min(110,first*.73+second*.14+(n.health||70)*.11+grit+bold));
}
function toyPlayerScore(type){
 const def=TOY_CONTESTS[type],first=s.skills?.[def.skill]||0,second=s.skills?.[def.skill2]||0;
 const stat=s.health*.11+s.skill*.03;
 return Math.max(0,Math.min(116,first*.73+second*.14+stat+Math.min(6,s.prestige/18)));
}
function toyContender(type,except=[]){
 const f=ensureToyFestival();
 let candidates=[...s.rivals,...s.friends,...s.siblings,...(s.careerContacts||[]),...f.contenders]
  .filter(n=>n?.alive&&n.age>=12&&n.health>=35&&!except.includes(n.id)&&!npcLifeBlocksNormalInteraction(n));
 candidates=[...new Map(candidates.map(n=>[n.id,n])).values()];
 if(candidates.length){
  candidates.sort((a,b)=>toyContenderScore(b,type)-toyContenderScore(a,type));
  // Pick from the top few, so training and NPC development affect rivalry.
  return pick(candidates.slice(0,Math.min(5,candidates.length)));
 }
 const sex=pick(['male','female']),age=rng(16,38),def=TOY_CONTESTS[type],name=pick(D.realms[s.realm][sex]);
 const skill=Math.max(15,Math.min(83,rng(25,54)+Math.max(0,s.prestige-30)/7));
 const n=normalizeNPC({id:npcId(),name,gender:sex,age,birthYear:s.year+s.age-age,
  type:'Toy Rakibi',goal:type==='ozan'?'wisdom':type==='ok'?'war':'prestige',
  health:rng(66,96),rel:rng(32,60),skills:{[def.skill]:Math.round(skill),[def.skill2]:rng(16,42)},
  realm:s.realm,place:s.place,tribe:s.tribe,alive:true},'Toy Rakibi');
 f.contenders.push(n);return n;
}
function toyRecord(kind,entry,note,detail={}){
 const f=ensureToyFestival(),row={year:s.year+s.age,month:currentMonth(),type:entry.type,entryId:entry.id,kind,note,...detail};
 f.history.unshift(row);f.history=f.history.slice(0,100);return row;
}
function toyFinish(entry,status,reason=''){
 entry.status=status;
 if(status==='champion'){
  const def=TOY_CONTESTS[entry.type],f=ensureToyFestival(),reward=def.prize;
  s.wealth+=reward;apply({prestige:6,happiness:5});economyLedger('toy',reward,def.name+' birincilik ödülü');
  const title={type:entry.type,name:def.name,year:entry.year,age:s.age,opponentIds:[...entry.opponentIds],wins:entry.wins};
  f.titles.unshift(title);f.titles=f.titles.slice(0,50);
  if(entry.type==='ok'){skillGain('archery',3);addExperience('military');}
  else if(entry.type==='gures'){skillGain('combat',3);addExperience('military');}
  else{skillGain('speech',3);addExperience('culture');}
  log(def.name+' birincisi oldun! Ödül ve ün kazandın.','major');
 }else if(status==='eliminated'){apply({happiness:-2});}
 toyRecord(status,entry,reason||TOY_CONTESTS[entry.type].name+' sona erdi.');
}
function toyRoundOutcome(entry,opponent,forcedRoll=null){
 const base=toyPlayerScore(entry.type),rival=toyContenderScore(opponent,entry.type);
 const playerRoll=forcedRoll?.player??rng(-16,16),npcRoll=forcedRoll?.npc??rng(-16,16);
 return {won:base+playerRoll>=rival+npcRoll,player:Math.round(base+playerRoll),rival:Math.round(rival+npcRoll)};
}
function toyAction(mode,type){
 const issue=toyIssue(mode,type);if(issue){notice(issue);return false;}
 return performAction({kind:'toyContest',id:mode,contestType:type},()=>{
  const f=ensureToyFestival(),def=TOY_CONTESTS[type];
  if(mode==='enroll'){
   s.wealth-=def.entry;economyLedger('toy',-def.entry,def.name+' katılım payı');
   const entry={id:'toy_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),
    type,year:s.year+s.age,round:0,wins:0,status:'active',opponentIds:[],results:[]};
   f.entries.push(entry);f.entered++;toyRecord('enroll',entry,def.name+' müsabakasına yazıldın.');
  }else{
   const entry=toyEntry(type),opponent=toyContender(type,entry.opponentIds),round=entry.round;
   const score=toyRoundOutcome(entry,opponent),before=opponent.rel;
   entry.round++;entry.opponentIds.push(opponent.id);
   entry.results.push({round:round+1,label:TOY_ROUND_NAMES[round],opponentId:opponent.id,
    opponentName:opponent.name,player:score.player,rival:score.rival,won:score.won,year:s.year+s.age});
   if(score.won){
    f.wins++;entry.wins++;
    adjustNPC(opponent,{rel:-2,respect:3,grudge:1},'Toyda '+TOY_ROUND_NAMES[round].toLowerCase()+' müsabakasında seni geçemedi.');
    skillGain(def.skill,round===2?3:1);
    apply({prestige:round+1,happiness:1});
    toyRecord('win',entry,TOY_ROUND_NAMES[round]+': '+opponent.name+' karşısında kazandın.',{opponentId:opponent.id});
    if(entry.round===3)toyFinish(entry,'champion');
   }else{
    f.losses++;
    adjustNPC(opponent,{rel:2,respect:1},'Toyda '+TOY_ROUND_NAMES[round].toLowerCase()+' müsabakasında senden iyi sonuç aldı.');
    toyRecord('loss',entry,TOY_ROUND_NAMES[round]+': '+opponent.name+' karşısında kaybettin.',{opponentId:opponent.id});
    toyFinish(entry,'eliminated');
   }
   if(type==='gures'&&Math.random()<.09){apply({health:-rng(2,7)});toyRecord('strain',entry,'Güreş sonrası yorgunluk ve hafif sakatlık yaşadın.');}
   if(opponent.rel!==before)rememberNPC(opponent,'toy','Toyda karşılıklı mücadele ettiniz.',2);
  }
 },mode==='enroll'?'Toyun düzenine katılmak için bir ay ayırdın.':'Toy müsabakasıyla bir ay geçirdin.');
}
function toyMonthTick(month){
 const f=ensureToyFestival();
 for(const entry of f.entries.filter(x=>x.status==='active')){
  if(entry.year!==s.year+s.age||month>TOY_CONTESTS[entry.type].months.at(-1))
   toyFinish(entry,'expired','Toyun vakti doldu; tamamlanmayan eleme kapandı.');
 }
}
function toyYearTick(){
 const f=ensureToyFestival();
 for(const entry of f.entries.filter(x=>x.status==='active'&&x.year!==s.year+s.age))
  toyFinish(entry,'expired','Yıl döndü; tamamlanmayan eleme kapanmıştır.');
}
function toyLegacySnapshot(){
 const f=ensureToyFestival();return {wins:f.wins,losses:f.losses,entered:f.entered,
  titles:f.titles.map(x=>({...x})),recent:f.history.slice(0,12).map(x=>({...x}))};
}
function toyContestSummaryHtml(){
 const f=ensureToyFestival(),year=s.year+s.age;
 let html='<div class="card"><h3>🏅 Toy Müsabakaları</h3><p>Okçuluk, güreş ve ozanlıkta her yıl ayrı turnuvalar düzenlenir. Üç galibiyetle toy birincisi olabilirsin. Her eleme bir ay sürer; rakiplerin gerçek obalı kişilerdir.</p>'+
  '<p>Geçmiş: '+f.entered+' katılım • '+f.wins+' kazanılan müsabaka • '+f.losses+' kayıp • '+f.titles.length+' birincilik</p></div><div class="grid2">';
 for(const [type,def] of Object.entries(TOY_CONTESTS)){
  const entry=toyEntry(type,year),active=entry?.status==='active',mode=active?'round':'enroll',can=active||!entry;
  const label=active?TOY_ROUND_NAMES[entry.round]+' oyna':entry?'Bu yıl tamamlandı':'Toy elemesine katıl';
  const issue=can?toyIssue(mode,type):'Bu yıl yeniden katılamazsın.';
  html+='<div class="card"><h3>'+def.icon+' '+safeText(def.name)+'</h3><p>'+
   'Mevsim: '+def.months[0]+'.–'+def.months.at(-1)+'. ay • '+def.minAge+' yaş • '+def.entry+' servet'+
   (entry?'<br>Sonuç: '+(active?'Devam ediyor':entry.status==='champion'?'Şampiyon':entry.status==='eliminated'?'Elendi':'Süresi doldu')+
    ' • '+entry.wins+'/3 galibiyet'+
    (entry.results.length?'<br>Son rakip: '+safeText(entry.results.at(-1).opponentName):''):'')+
   '</p><div class="actions"><button class="mini" '+(issue?'disabled title="'+safeText(issue)+'"':'')+
   ' onclick="toyAction('+JSON.stringify(mode)+','+JSON.stringify(type)+')">'+safeText(label)+'</button></div></div>';
 }
 html+='</div>';
 if(f.titles.length)html+='<div class="card"><h3>🏆 Toy Birincilikleri</h3><p>'+
  f.titles.slice(0,7).map(x=>safeText(x.year+' • '+x.name)).join('<br>')+'</p></div>';
 if(f.history.length)html+='<div class="card"><h3>Müsabaka Defteri</h3><p>'+
  f.history.slice(0,6).map(x=>safeText(x.year+' • '+x.note)).join('<br>')+'</p></div>';
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

/* v35: period-appropriate obligations: loans are fixed-share pledges, not free wealth.
   Existing household, kin trust, community word, property and inheritance all matter. */
const CREDIT_OFFERS={
 oba:{name:'Oba Emaneti',sum:16,fee:4,term:12,desc:'Oba büyüklerinden geçim desteği; 12 ayda 20 servet geri ödeme.'},
 pazar:{name:'Kervan Sermayesi',sum:30,fee:8,term:24,desc:'Pazar ortaklığı için sermaye; 24 ayda 38 servet ve varlık rehni.'},
 kin:{name:'Yakınından Emanet',sum:12,fee:0,term:12,desc:'Güvendiğin yakından 12 servet; 12 ayda aynı tutarı geri ödeme.'}
};
const CREDIT_COLLATERAL=['flock','smithy','caravan_share'];
function ensureCredit(){
 if(!s.credit||typeof s.credit!=='object'||Array.isArray(s.credit))s.credit={};
 const q=s.credit;q.contracts=Array.isArray(q.contracts)?q.contracts.filter(x=>x&&typeof x==='object').slice(0,40):[];
 q.history=Array.isArray(q.history)?q.history.slice(0,100):[];
 for(const k of ['borrowed','repaid','defaults','extensions','foreclosures','estatePaid'])q[k]=Math.max(0,Math.round(q[k]||0));
 q.lastBorrowAt=Number.isFinite(q.lastBorrowAt)?q.lastBorrowAt:null;
 for(const x of q.contracts){
  x.id=typeof x.id==='string'&&x.id.startsWith('credit_')?x.id:'credit_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2);
  x.type=CREDIT_OFFERS[x.type]?x.type:'oba';x.principal=Math.max(0,Math.round(x.principal||0));x.fee=Math.max(0,Math.round(x.fee||0));
  x.balance=Math.max(0,Math.round(x.balance||0));x.duration=Math.max(1,Math.round(x.duration||12));
  x.paid=Math.max(0,Math.round(x.paid||0));x.missed=Math.max(0,Math.round(x.missed||0));x.lateTotal=Math.max(0,Math.round(x.lateTotal||0));
  x.startSerial=Number.isFinite(x.startSerial)?x.startSerial:lifeSerial();x.lastTick=Number.isFinite(x.lastTick)?x.lastTick:null;
  x.status=['active','defaulted','repaid','seized','estate'].includes(x.status)?x.status:'active';
  x.lenderId=x.lenderId||null;x.pledge=CREDIT_COLLATERAL.includes(x.pledge)?x.pledge:null;x.extended=!!x.extended;
  x.estateUnpaid=Math.max(0,Math.round(x.estateUnpaid||0));
  x.timeline=Array.isArray(x.timeline)?x.timeline.slice(0,20):[];
 }
 return q;
}
function creditOpen(){return ensureCredit().contracts.filter(x=>x.status==='active'||x.status==='defaulted');}
function creditById(id){return ensureCredit().contracts.find(x=>x.id===id)||null;}
function creditPledgeInUse(asset){return !!asset&&creditOpen().some(x=>x.pledge===asset);}
function creditTotal(){return creditOpen().reduce((sum,x)=>sum+x.balance,0);}
function creditRecord(type,rec,detail='',amount=0){
 const q=ensureCredit(),row={year:s.year+s.age,month:currentMonth(),type,contractId:rec?.id||null,
  offer:rec?.type||null,lenderId:rec?.lenderId||null,amount:Math.round(amount||0),balance:rec?.balance??0,detail};
 q.history.unshift(row);q.history=q.history.slice(0,100);
 if(rec){rec.timeline.unshift(row);rec.timeline=rec.timeline.slice(0,20);}
 return row;
}
function creditEligibleKin(){
 return [...s.parents,...s.siblings,...s.friends,...(s.partner?[s.partner]:[])].filter((n,i,arr)=>
  n?.alive&&n.age>=18&&n.wealth>=12&&(n.bonds?.trust||0)>=60&&n.rel>=55&&
  arr.findIndex(x=>x?.id===n.id)===i);
}
function creditBorrowIssue(type,extra=null){
 const offer=CREDIT_OFFERS[type],q=ensureCredit(),open=creditOpen();
 if(!offer)return 'Emanet türü bulunamadı.';
 if(open.some(x=>x.status==='defaulted'))return 'Önce ödenmemiş eski borcunu kapatmalısın.';
 if(open.length>=2)return 'Aynı anda en fazla iki açık emanet tutabilirsin.';
 if(creditTotal()+offer.sum+offer.fee>85)return 'Yeni sözleşmeyle toplam borç aşırı yükseliyor.';
 if(q.lastBorrowAt!=null&&lifeSerial()-q.lastBorrowAt<3)return 'Yeni emanet istemeden önce üç ay geçmeli.';
 if(type==='oba'){
  if(ensureCommunityReputation().reliability<40||communityGoodName()<42)return 'Oba büyükleri sözünün güvenilir olmasını istiyor.';
 }else if(type==='pazar'){
  if((s.skills.trade||0)<15||s.prestige<15)return 'Kervan için 15 ticaret becerisi ve 15 itibar gerekiyor.';
  if(!CREDIT_COLLATERAL.includes(extra)||!s.assets.includes(extra))return 'Önce sürü, demir ocağı veya kervan payı gibi bir rehin seç.';
  if(creditPledgeInUse(extra))return 'Bu varlık başka bir borç için zaten rehinli.';
  if(ensureCommunityReputation().reliability<45)return 'Tüccarlar güvenilir söz ister.';
 }else if(type==='kin'){
  if(!extra||!creditEligibleKin().some(n=>n.id===extra))return 'Sana güvenen ve emanet verebilecek yetişkin bir yakın gerekiyor.';
 }
 return '';
}
function creditIssue(mode,id,extra=null){
 if(mode==='borrow')return creditBorrowIssue(id,extra);
 const rec=creditById(id);if(!rec||!['active','defaulted'].includes(rec.status))return 'Bu borç artık açık değil.';
 if(mode==='pay'){if(!['five','all'].includes(extra))return 'Ödeme seçeneği bulunamadı.';if(s.wealth<1)return 'Borç ödemek için servetin yok.';return '';}
 if(mode==='extend'){
  if(rec.status==='defaulted')return 'Önce temerrüde düşen borcu kapatmalısın.';
  if(rec.extended)return 'Bu emanetin vadesi daha önce uzatıldı.';
  if(s.wealth<2)return 'Yeni anlaşma için 2 servet gerekiyor.';
  return '';
 }
 return 'Borç eylemi bulunamadı.';
}
function creditClose(rec,reason='paid'){
 if(rec.balance>0)return false;
 rec.balance=0;rec.status='repaid';rec.pledge=null;
 const q=ensureCredit();q.repaid++;
 creditRecord('closed',rec,'Emanet sözü tamamen yerine getirildi.',0);
 if(rec.lenderId){const n=npcById(rec.lenderId);if(n?.alive)adjustNPC(n,{rel:5,trust:8,respect:5,grudge:-6},'Borç sözünü eksiksiz yerine getirdin.');}
 applyCommunityAxes({reliability:3,honor:1},'Emanet sözünü tamamlayarak toplumsal güvenini güçlendirdin.');
 return true;
}
function creditPay(rec,amount,mode='voluntary'){
 const sum=Math.min(Math.max(0,Math.round(amount)),rec.balance,s.wealth);
 if(sum<=0)return 0;
 s.wealth-=sum;rec.balance-=sum;rec.paid+=sum;
 if(rec.lenderId){const lender=npcById(rec.lenderId);if(lender?.alive)lender.wealth+=sum;}
 if(mode==='voluntary')rec.missed=0;
 economyLedger('credit',-sum,'Emanet geri ödemesi');creditRecord('payment',rec,mode+' ödeme',sum);
 if(rec.balance===0)creditClose(rec);
 return sum;
}
function creditDefault(rec){
 if(rec.status!=='active')return false;
 rec.status='defaulted';const q=ensureCredit();q.defaults++;
 recordPublicWord('credit','Üstlenilen '+CREDIT_OFFERS[rec.type].name.toLowerCase()+' vadesi tutulamadı.',{reliability:-12,honor:-4},{severity:24,polarity:-1});
 if(rec.lenderId){const lender=npcById(rec.lenderId);if(lender?.alive)adjustNPC(lender,{rel:-16,trust:-22,grudge:18},'Emanet sözünü vaktinde tutmadın.');}
 if(rec.pledge&&s.assets.includes(rec.pledge)){
  const pledge=rec.pledge,value=assetSaleValue(pledge);
  s.assets=s.assets.filter(x=>x!==pledge);
  if(s.economy?.assetState)delete s.economy.assetState[pledge];
  rec.balance=Math.max(0,rec.balance-value);q.foreclosures++;
  creditRecord('foreclosure',rec,'Rehinli '+pledge+' elden çıktı, borçtan '+value+' servet düşüldü.',value);
  rec.pledge=null;
 }
 creditRecord('default',rec,'Üç aylık ödeme aksadı; borç takibe düştü.',rec.balance);
 if(rec.balance===0){rec.status='seized';creditRecord('seized',rec,'Rehin mahsup edildi; temerrütle kapandı, iyi ödeme olarak sayılmadı.',0);}
 return true;
}
function creditAction(mode,id,extra=null){
 const issue=creditIssue(mode,id,extra);if(issue){notice(issue);return false;}
 return performAction({kind:'credit',id:mode,contractId:id,extra},()=>{
  const q=ensureCredit();
  if(mode==='borrow'){
   const offer=CREDIT_OFFERS[id],lender=id==='kin'?npcById(extra):null;
   if(lender){lender.wealth-=offer.sum;adjustNPC(lender,{rel:1,trust:2},'Yardım için geri ödeme sözü verdin.');}
   const rec={id:'credit_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2),
    type:id,principal:offer.sum,fee:offer.fee,balance:offer.sum+offer.fee,duration:offer.term,
    paid:0,missed:0,lateTotal:0,startSerial:lifeSerial(),lastTick:null,status:'active',
    lenderId:lender?.id||null,pledge:id==='pazar'?extra:null,extended:false,estateUnpaid:0,timeline:[]};
   q.contracts.push(rec);q.borrowed++;q.lastBorrowAt=lifeSerial();
   s.wealth+=offer.sum;economyLedger('credit',offer.sum,offer.name+' alındı');
   creditRecord('borrow',rec,offer.name+' • '+offer.term+' aylık sözleşme',offer.sum);
   log(safeText(offer.name)+' karşılığında '+offer.sum+' servet emanet aldın; '+rec.balance+' servet borçlandın.','major');
  }else{
   const rec=creditById(id);
   if(mode==='pay')creditPay(rec,extra==='all'?rec.balance:5,'voluntary');
   else if(mode==='extend'){
    s.wealth-=2;rec.balance+=3;rec.duration+=6;rec.extended=true;rec.missed=0;q.extensions++;
    economyLedger('credit',-2,'Emanet vade uzatma görüşmesi');
    creditRecord('extension',rec,'Vade altı ay uzatıldı; geri ödeme 3 servet arttı.',2);
   }
  }
 },'Emanet ve borç işleri için bir ay ayırdın.');
}
function creditMonthTick(month){
 const q=ensureCredit(),serial=lifeSerial(s.year+s.age,month);
 for(const rec of q.contracts.filter(x=>x.status==='active')){
  if(serial<=rec.startSerial||rec.lastTick===serial)continue;
  rec.lastTick=serial;
  const elapsed=Math.max(1,serial-rec.startSerial),left=Math.max(1,rec.duration-elapsed+1);
  const due=Math.min(rec.balance,Math.max(1,Math.ceil(rec.balance/left)));
  const paid=creditPay(rec,due,'scheduled');
  if(rec.status==='repaid')continue;
  if(paid<due){
   rec.missed++;rec.lateTotal++;
   if(rec.missed===1){applyCommunityAxes({reliability:-1},'Emanet geri ödemesi bir ay aksadı.');creditRecord('late',rec,'Geri ödeme ayı kısmen veya tamamen aksadı.',due-paid);}
   if(rec.missed>=3)creditDefault(rec);
  }else rec.missed=0;
 }
}
function creditEstateSettlement(old){
 const q=ensureCredit(),debtors=creditOpen(),initial=debtors.reduce((sum,x)=>sum+x.balance,0);
 let paid=0,foreclosed=0;
 for(const rec of debtors){
  const cash=Math.min(old.wealth,rec.balance);old.wealth-=cash;rec.balance-=cash;paid+=cash;
  if(rec.lenderId){const n=npcById(rec.lenderId);if(n?.alive)n.wealth+=cash;}
  if(rec.balance>0&&rec.pledge&&old.assets.includes(rec.pledge)){
   const value=assetSaleValue(rec.pledge);old.assets=old.assets.filter(x=>x!==rec.pledge);
   rec.balance=Math.max(0,rec.balance-value);paid+=Math.min(value,initial-paid);foreclosed++;
  }
  rec.estateUnpaid=rec.balance;rec.status='estate';rec.pledge=null;
  creditRecord('estate',rec,'Vefat sonrası miras malından borç ayrıldı; kalan '+rec.balance+' servet.',cash);
 }
 q.estatePaid+=paid;q.foreclosures+=foreclosed;
 return {original:initial,paid,unpaid:debtors.reduce((sum,x)=>sum+x.balance,0),foreclosed};
}
function creditLegacySnapshot(){
 const q=ensureCredit();return {borrowed:q.borrowed,repaid:q.repaid,defaults:q.defaults,
  open:creditOpen().map(x=>({type:x.type,balance:x.balance,pledge:x.pledge,lenderId:x.lenderId})),
  totalOutstanding:creditTotal()};
}
function creditSummaryHtml(){
 const q=ensureCredit(),open=creditOpen(),debt=creditTotal();
 let html='<div class="card"><h3>📜 Emanet, Borç ve Söz</h3><p>Toplam geri ödeme: '+debt+' servet • tutulan söz '+q.repaid+' • temerrüt '+q.defaults+
  ' • rehin kaybı '+q.foreclosures+'<br>Her ay vade payı kendiliğinden ödenir. Üç kez üst üste aksarsa söz bozulur; teminat ve itibar tehlikeye girer.</p>';
 html+='<div class="grid2">'+actionButton('Oba Emaneti',{kind:'credit',id:'borrow',contractId:'oba'},"creditAction('borrow','oba')",CREDIT_OFFERS.oba.desc);
 const kin=creditEligibleKin();
 for(const n of kin.slice(0,5))html+=actionButton(safeText(n.name)+' • Emanet iste',{kind:'credit',id:'borrow',contractId:'kin',extra:n.id},
  "creditAction('borrow','kin',"+JSON.stringify(n.id)+")",CREDIT_OFFERS.kin.desc+' • Güven: '+n.bonds.trust);
 for(const pledge of CREDIT_COLLATERAL.filter(id=>s.assets.includes(id)))html+=actionButton('Kervan Sermayesi • '+safeText(npcEstateAssetName(pledge))+' rehin',
  {kind:'credit',id:'borrow',contractId:'pazar',extra:pledge},
  "creditAction('borrow','pazar','"+pledge+"')",CREDIT_OFFERS.pazar.desc);
 html+='</div></div>';
 for(const rec of open){
  const name=CREDIT_OFFERS[rec.type].name;
  html+='<div class="card"><h3>'+safeText(name)+' • '+(rec.status==='defaulted'?'Takipte':'Ödeniyor')+'</h3><p>'+
   'Kalan '+rec.balance+' servet • '+rec.paid+' ödendi • '+rec.missed+' arka arkaya aksama'+
   (rec.pledge?' • Rehin: '+safeText(npcEstateAssetName(rec.pledge)):'')+
   (rec.lenderId?' • Veren: '+safeText(npcById(rec.lenderId)?.name||'eski tanıdık'):'')+'</p><div class="grid2">'+
   actionButton('5 servet öde',{kind:'credit',id:'pay',contractId:rec.id,extra:'five'},"creditAction('pay','"+rec.id+"','five')",'Bir ay ayırıp erken ödeme yap.')+
   actionButton('Kalanı öde',{kind:'credit',id:'pay',contractId:rec.id,extra:'all'},"creditAction('pay','"+rec.id+"','all')",'Servetin yettiği kadarını öde.')+
   actionButton('Vadeyi uzat',{kind:'credit',id:'extend',contractId:rec.id},"creditAction('extend','"+rec.id+"')",'2 servet anlaşma masrafı • toplam 3 servet artış')+
   '</div></div>';
 }
 if(q.history.length)html+='<div class="card"><h3>Emanet Defteri</h3><div class="memoryline">'+q.history.slice(0,6).map(x=>safeText(x.year+' • '+x.detail)).join('<br>')+'</div></div>';
 return html;
}


/* v37: persistent craft work orders use real materials, clients and apprentices.
   The legacy random forge venture stays available; this is its deeper workshop. */
const WORKSHOP_MATERIALS={
 iron:{name:'Demir Cevheri',amount:4,cost:6},
 charcoal:{name:'Ocak Kömürü',amount:5,cost:4},
 leather:{name:'Deri ve Kayış',amount:3,cost:4}
};
const WORKSHOP_RECIPES={
 nal:{name:'At Nalı Takımı',needs:{iron:2,charcoal:1},minQuality:32,price:14},
 mizrak:{name:'Mızrak Ucu',needs:{iron:3,charcoal:1},minQuality:40,price:19},
 kilic:{name:'Kılıç ve Kabza',needs:{iron:4,charcoal:2,leather:1},minQuality:55,price:29}
};
function ensureWorkshop(){
 if(!s.workshop||typeof s.workshop!=='object'||Array.isArray(s.workshop))s.workshop={};
 const w=s.workshop;
 w.materials=w.materials&&typeof w.materials==='object'&&!Array.isArray(w.materials)?w.materials:{};
 for(const k of Object.keys(WORKSHOP_MATERIALS))w.materials[k]=Math.max(0,Math.min(99,Math.floor(w.materials[k]||0)));
 w.orders=Array.isArray(w.orders)?w.orders.filter(x=>x&&WORKSHOP_RECIPES[x.recipe]).slice(-75):[];
 w.items=Array.isArray(w.items)?w.items.filter(x=>x&&WORKSHOP_RECIPES[x.recipe]).slice(-30):[];
 w.clients=Array.isArray(w.clients)?w.clients.filter(x=>x&&typeof x==='object').slice(-18):[];
 w.apprentices=Array.isArray(w.apprentices)?w.apprentices.slice(-30):[];
 w.apprenticeId=w.apprenticeId||null;
 w.history=Array.isArray(w.history)?w.history.slice(0,90):[];
 w.delivered=Math.max(0,Math.floor(w.delivered||0));w.failed=Math.max(0,Math.floor(w.failed||0));
 w.earned=Math.max(0,Math.floor(w.earned||0));w.spent=Math.max(0,Math.floor(w.spent||0));
 for(const o of w.orders){
  o.status=['active','ready','delivered','failed'].includes(o.status)?o.status:'failed';
  o.minQuality=clamp(o.minQuality??WORKSHOP_RECIPES[o.recipe].minQuality);
  o.price=Math.max(0,Math.round(o.price||WORKSHOP_RECIPES[o.recipe].price));
  o.deposit=Math.max(0,Math.round(o.deposit||0));
  o.createdSerial=Number.isFinite(o.createdSerial)?o.createdSerial:lifeSerial();
  o.deadline=Number.isFinite(o.deadline)?o.deadline:o.createdSerial+6;
 }
 for(const item of w.items){item.quality=clamp(item.quality||0);item.status=item.status==='defective'?'defective':'ready';}
 return w;
}
function workshopRecord(type,note,orderId=null,extra={}){
 const w=ensureWorkshop(),row={year:s.year+s.age,month:currentMonth(),type,note:String(note),orderId,...extra};
 w.history.unshift(row);w.history=w.history.slice(0,90);return row;
}
function workshopOrderById(id){return ensureWorkshop().orders.find(x=>x.id===id)||null;}
function workshopItemFor(orderId){return ensureWorkshop().items.find(x=>x.orderId===orderId)||null;}
function workshopCurrentApprentice(){
 const w=ensureWorkshop();return w.apprenticeId?npcById(w.apprenticeId):null;
}
function workshopCandidates(){
 const w=ensureWorkshop(),list=[...s.siblings,...s.children,...s.friends,...(s.careerContacts||[]),...(s.workplace?.contacts||[])],seen=new Set();
 return list.filter(n=>{
  if(!n?.alive||seen.has(n.id)||n.id===w.apprenticeId||n.age<12||n.age>32||n.rel<45||npcLifeBlocksNormalInteraction(n))return false;
  seen.add(n.id);return true;
 });
}
function workshopCustomer(){
 const w=ensureWorkshop(),list=[...s.friends,...s.careerContacts,...s.relatives,...w.clients].filter(n=>
  n?.alive&&n.age>=16&&!npcLifeBlocksNormalInteraction(n));
 if(list.length)return pick(list);
 const gender=pick(['male','female']),age=rng(19,52);
 const n=normalizeNPC({id:npcId(),name:pick(D.realms[s.realm][gender]),gender,age,birthYear:s.year+s.age-age,
  type:'Zanaat Müşterisi',alive:true,rel:rng(46,70),health:rng(65,94),
  place:s.place,realm:s.realm,tribe:s.tribe,goal:'wealth'},'Zanaat Müşterisi');
 w.clients.push(n);return n;
}
function workshopNeeds(recipeId){return WORKSHOP_RECIPES[recipeId]?.needs||null;}
function workshopHasMaterials(recipeId,extra=false){
 const w=ensureWorkshop(),need=extra?{iron:1,charcoal:1}:workshopNeeds(recipeId);
 return !!need&&Object.entries(need).every(([key,count])=>w.materials[key]>=count);
}
function workshopConsumeMaterials(recipeId,extra=false){
 const need=extra?{iron:1,charcoal:1}:workshopNeeds(recipeId),w=ensureWorkshop();
 for(const [key,n] of Object.entries(need))w.materials[key]-=n;
}
function workshopCanSellSmithy(){
 const w=ensureWorkshop();return !w.orders.some(x=>['active','ready'].includes(x.status))&&!w.apprenticeId;
}
function workshopIssue(mode,id,extra=null){
 const w=ensureWorkshop();
 if(!s.assets.includes('smithy'))return 'Önce Demir Ocağı sahibi olmalısın.';
 if(s.age<18)return 'Atölyeyi 18 yaşında yönetebilirsin.';
 if(mode==='stock'){
  const mat=WORKSHOP_MATERIALS[id];
  if(!mat)return 'Böyle bir malzeme yok.';
  if(w.materials[id]+mat.amount>99)return 'Bu malzemeden yeterince stok bulunuyor.';
  if(s.wealth<mat.cost)return mat.cost+' servetlik malzeme bedeli gerekiyor.';
 }else if(mode==='take'){
  if(!WORKSHOP_RECIPES[id])return 'Böyle bir üretim siparişi yok.';
  if(w.orders.filter(x=>['active','ready'].includes(x.status)).length>=2)return 'Önce açık siparişleri tamamlamalısın (en fazla iki).';
  if(w.orders.some(x=>x.recipe===id&&['active','ready'].includes(x.status)))return 'Aynı üründen açık bir siparişin var.';
 }else if(['forge','deliver','rework'].includes(mode)){
  const order=workshopOrderById(id),item=workshopItemFor(id);
  if(!order||!['active','ready'].includes(order.status))return 'Bu sipariş artık açık değil.';
  if(lifeSerial()>order.deadline)return 'Bu siparişin teslim süresi geçti.';
  if(mode==='forge'){
   if(order.status!=='active'||item)return 'Bu siparişin bir ürünü zaten hazırlanmış.';
   if(assetState('smithy').condition<25)return 'Önce demir ocağının bakımını yap.';
   if(!workshopHasMaterials(order.recipe))return 'Bu sipariş için malzeme stoğu yetersiz.';
  }else if(mode==='deliver'){
   if(!item||item.quality<order.minQuality||order.status!=='ready')return 'Teslim edilecek yeterli kalitede ürün yok.';
  }else{
   if(!item||item.quality>=order.minQuality||item.status!=='defective')return 'Yeniden işlenecek kusurlu ürün yok.';
   if(!workshopHasMaterials(null,true))return 'Yeniden dövmek için birer demir ve kömür gerekiyor.';
  }
 }else if(mode==='hire'){
  if(w.apprenticeId)return 'Ocakta zaten bir çırak çalışıyor.';
  if(!workshopCandidates().some(n=>n.id===id))return 'Bu kişi henüz çırak olmak için uygun değil.';
  if(s.wealth<3)return 'Çırağı almak için 3 servet gerekiyor.';
 }else if(mode==='release'){
  if(!w.apprenticeId||w.apprenticeId!==id)return 'Bu çırak artık yanında değil.';
 }else return 'Atölye eylemi bulunamadı.';
 return '';
}
function workshopForgeResult(order,roll=null){
 const apprentice=workshopCurrentApprentice();
 const level=s.skills.craft||0,condition=assetState('smithy').condition,mastery=careerProfile('smith').mastery||0;
 const base=14+level*.62+condition*.14+Math.min(16,mastery/7)+
  (apprentice?6+Math.min(6,(apprentice.skills?.craft||0)/12):0);
 return clamp(Math.round(base+(roll===null?rng(-18,13):roll)));
}
function workshopFinishOrder(order,mode,amount=0){
 const w=ensureWorkshop(),customer=npcById(order.clientId);
 if(mode==='delivered'){
  order.status='delivered';order.deliveredSerial=lifeSerial();w.delivered++;w.earned+=amount;
  if(customer?.alive)adjustNPC(customer,{rel:4,trust:6,respect:5},'Demir ocağından sipariş ettiğin ürünü söz verilen zamanda teslim aldın.');
  apply({prestige:2,happiness:2});skillGain('craft',2);
  careerProfile('smith').reputation=clamp(careerProfile('smith').reputation+3);
  economyLedger('workshop',amount,WORKSHOP_RECIPES[order.recipe].name+' sipariş teslimi');
  workshopRecord('delivered',WORKSHOP_RECIPES[order.recipe].name+' müşteriye teslim edildi.',order.id,{amount});
 }else{
  order.status='failed';order.failedSerial=lifeSerial();w.failed++;
  const repayment=Math.min(s.wealth,order.deposit);s.wealth-=repayment;
  w.spent+=repayment;
  if(customer?.alive){customer.wealth+=repayment;adjustNPC(customer,{rel:-9,trust:-14,grudge:7},'Demir ocağındaki siparişin zamanında teslim edilmedi.');}
  apply({prestige:-3,happiness:-2});
  careerProfile('smith').reputation=clamp(careerProfile('smith').reputation-5);
  economyLedger('workshop',-repayment,'Geciken sipariş için alınan ön ödemenin iadesi');
  workshopRecord('failed','Sipariş vadesinde bitmedi; '+repayment+' servet iade edildi.',order.id);
 }
 w.items=w.items.filter(x=>x.orderId!==order.id);
}
function workshopAction(mode,id,extra=null){
 const issue=workshopIssue(mode,id,extra);if(issue){notice(issue);return false;}
 return performAction({kind:'workshop',id:mode,targetId:id,extra},()=>{
  const w=ensureWorkshop();
  if(mode==='stock'){
   const mat=WORKSHOP_MATERIALS[id];s.wealth-=mat.cost;w.spent+=mat.cost;w.materials[id]+=mat.amount;
   economyLedger('workshop',-mat.cost,mat.name+' alımı');workshopRecord('stock',mat.name+' stoğuna '+mat.amount+' birim eklendi.');
  }else if(mode==='take'){
   const spec=WORKSHOP_RECIPES[id],customer=workshopCustomer(),deposit=3,price=Math.max(8,Math.round(spec.price*(.7+ensureEconomy().craftDemand/180)));
   const order={id:'order_'+npcId(),recipe:id,clientId:customer.id,clientName:customer.name,status:'active',minQuality:spec.minQuality,
    createdSerial:lifeSerial(),deadline:lifeSerial()+6,deposit,price};
   customer.wealth+=0;
   w.orders.push(order);s.wealth+=deposit;w.earned+=deposit;
   economyLedger('workshop',deposit,spec.name+' ön ödeme');workshopRecord('take',customer.name+' için '+spec.name+' siparişi alındı.',order.id);
  }else if(mode==='forge'){
   const order=workshopOrderById(id),rec=WORKSHOP_RECIPES[order.recipe];
   workshopConsumeMaterials(order.recipe);const q=workshopForgeResult(order);
   assetState('smithy').condition=clamp(assetState('smithy').condition-rng(2,5));
   skillGain('craft',2);addExperience('craft');
   const item={id:'item_'+npcId(),orderId:order.id,recipe:order.recipe,quality:q,status:q>=order.minQuality?'ready':'defective'};
   w.items.push(item);if(item.status==='ready')order.status='ready';
   workshopRecord(item.status,'Üretilen '+rec.name+' kalite '+q+'/100.',order.id,{quality:q});
   if(q<order.minQuality&&Math.random()<.12)apply({health:-rng(1,4)});
   const apprentice=workshopCurrentApprentice();
   if(apprentice?.alive)apprentice.skills.craft=clamp((apprentice.skills.craft||0)+2);
  }else if(mode==='rework'){
   const order=workshopOrderById(id),item=workshopItemFor(id);
   workshopConsumeMaterials(null,true);item.quality=clamp(item.quality+rng(14,23));
   if(item.quality>=order.minQuality){item.status='ready';order.status='ready';}
   skillGain('craft',1);addExperience('craft');assetState('smithy').condition=clamp(assetState('smithy').condition-2);
   workshopRecord('rework','Kusurlu ürün yeniden dövüldü, kalite '+item.quality+'/100.',order.id);
  }else if(mode==='deliver'){
   const order=workshopOrderById(id),item=workshopItemFor(id),premium=item.quality>=80?Math.floor(order.price*.18):0;
   const amount=Math.max(0,order.price-order.deposit+premium);s.wealth+=amount;
   workshopFinishOrder(order,'delivered',amount);
  }else if(mode==='hire'){
   const n=npcById(id);s.wealth-=3;w.spent+=3;n.wealth+=2;
   w.apprenticeId=n.id;w.apprentices.push({npcId:n.id,name:n.name,year:s.year+s.age,months:0,status:'learning',formerRole:n.role});
   n.role='Demirci Çırağı';n.roleHistory.push({year:s.year+s.age,role:n.role,source:'workshop'});
   adjustNPC(n,{rel:5,trust:5,respect:2},'Demir ocağında çırak olmaya başladın.');
   economyLedger('workshop',-3,'Çırak için ilk ödeme');workshopRecord('hire',n.name+' demir ocağına çırak girdi.');
  }else if(mode==='release'){
   const n=npcById(id),rec=w.apprentices.findLast(x=>x.npcId===id&&x.status==='learning');
   if(rec){rec.status='released';rec.endYear=s.year+s.age;if(n?.alive&&n.role==='Demirci Çırağı')n.role=rec.formerRole;}
   w.apprenticeId=null;
   if(n?.alive)adjustNPC(n,{rel:-3,trust:-3},'Demir ocağındaki çıraklık sona erdi.');
   workshopRecord('release',(n?.name||'Çırak')+' ocaktan ayrıldı.');
  }
 },'Demir ocağında bir ay emek verdin.');
}
function workshopMonthTick(month){
 const w=ensureWorkshop(),serial=lifeSerial(s.year+s.age,month);
 if(!s.assets.includes('smithy'))return;
 for(const order of w.orders.filter(x=>['active','ready'].includes(x.status)&&serial> x.deadline))
  workshopFinishOrder(order,'failed');
 if(w.apprenticeId){
  const n=workshopCurrentApprentice(),rec=w.apprentices.findLast(x=>x.npcId===w.apprenticeId&&x.status==='learning');
  if(!n?.alive||!rec){w.apprenticeId=null;return;}
  if(rec.lastTick===serial)return;
  rec.lastTick=serial;rec.months++;
  n.skills.craft=clamp((n.skills.craft||0)+rng(1,2));
  if(rec.months%3===0){
   if(s.wealth>=1){s.wealth--;w.spent++;n.wealth++;economyLedger('workshop',-1,'Çırağın üç aylık payı');}
   else{rec.status='left';rec.endYear=s.year+s.age;w.apprenticeId=null;
    adjustNPC(n,{rel:-5,trust:-8},'Ocakta emeğinin karşılığını alamadın.');
    workshopRecord('unpaid',n.name+' ücreti ödenmediği için ocaktan ayrıldı.');return;}
  }
  if(rec.months>=12&&(n.skills.craft||0)>=35){
   rec.status='graduated';rec.endYear=s.year+s.age;w.apprenticeId=null;
   n.role='Demirci';n.statusFlags=n.statusFlags||{};n.statusFlags.workshopGraduate=true;n.roleHistory.push({year:s.year+s.age,role:'Demirci',source:'workshop-graduation'});
   adjustNPC(n,{rel:7,trust:7,respect:8},'Usta yanında yetişip demirci oldun.');
   workshopRecord('graduated',n.name+' ocakta yetişip demirci ustası oldu.');
  }
 }
}
function workshopInheritance(old,share){
 const w=ensureWorkshop();
 if(!share.assets.includes('smithy'))return null;
 const inherited=JSON.parse(JSON.stringify(w));
 // Inherited orders remain owed to their actual clients; the apprentice chooses a new arrangement.
 if(inherited.apprenticeId){
  const rec=inherited.apprentices.findLast(x=>x.npcId===inherited.apprenticeId&&x.status==='learning');
  if(rec){rec.status='succession';rec.endYear=old.year+old.age;}
  inherited.apprenticeId=null;
 }
 return inherited;
}
function workshopLegacySnapshot(){
 const w=ensureWorkshop();return {delivered:w.delivered,failed:w.failed,
  earned:w.earned,spent:w.spent,graduates:w.apprentices.filter(x=>x.status==='graduated').length,
  openOrders:w.orders.filter(x=>['active','ready'].includes(x.status)).length};
}
function workshopSummaryHtml(){
 const w=ensureWorkshop();if(!s.assets.includes('smithy'))return '';
 let html='<div class="card"><h3>🔨 Demir Ocağı Atölyesi</h3><p>Gerçek malzeme, süreli müşteri siparişleri ve çırak yetiştirme.'+
  '<br>Teslim '+w.delivered+' • geciken '+w.failed+' • alınan '+w.earned+' servet • gider '+w.spent+' servet</p>'+
  '<div class="memoryline">'+Object.entries(WORKSHOP_MATERIALS).map(([k,d])=>safeText(d.name)+' '+w.materials[k]).join(' • ')+'</div><div class="grid2">';
 for(const [id,def] of Object.entries(WORKSHOP_MATERIALS))
  html+=actionButton(safeText(def.name)+' al',{kind:'workshop',id:'stock',targetId:id},
   "workshopAction('stock','"+id+"')",def.amount+' birim • '+def.cost+' servet');
 html+='</div><h3>Yeni Sipariş</h3><div class="grid2">';
 for(const [id,def] of Object.entries(WORKSHOP_RECIPES))
  html+=actionButton(safeText(def.name),{kind:'workshop',id:'take',targetId:id},
   "workshopAction('take','"+id+"')",'6 ay vade • '+Object.entries(def.needs).map(([k,v])=>WORKSHOP_MATERIALS[k].name+' '+v).join(', '));
 html+='</div></div>';
 for(const order of w.orders.filter(x=>['active','ready'].includes(x.status))){
  const recipe=WORKSHOP_RECIPES[order.recipe],item=workshopItemFor(order.id);
  const mode=!item?'forge':item.quality<order.minQuality?'rework':'deliver',label=mode==='forge'?'Ürünü döv':mode==='rework'?'Kusuru düzelt':'Siparişi teslim et';
  html+='<div class="card"><h3>'+safeText(recipe.name)+' • '+safeText(order.clientName)+'</h3><p>'+
   'Teslim için kalan '+Math.max(0,order.deadline-lifeSerial())+' ay • fiyat '+order.price+
   ' servet • ön ödeme '+order.deposit+
   (item?' • ürün kalitesi '+item.quality+'/'+order.minQuality:' • henüz ürün yok')+
   '</p><div class="grid2">'+actionButton(label,{kind:'workshop',id:mode,targetId:order.id},
     "workshopAction('"+mode+"','"+order.id+"')",'Gerçek malzeme ve beceri gerekir')+'</div></div>';
 }
 const trainee=workshopCurrentApprentice();
 html+='<div class="card"><h3>Ocak Çırağı</h3>';
 if(trainee){
  const rec=w.apprentices.findLast(x=>x.npcId===trainee.id&&x.status==='learning');
  html+='<p>'+safeText(trainee.name)+' • zanaat '+(trainee.skills?.craft||0)+' • '+(rec?.months||0)+
    ' aylık çıraklık • üç ayda bir 1 servet pay</p>'+
    actionButton('Çırağı serbest bırak',{kind:'workshop',id:'release',targetId:trainee.id},
      "workshopAction('release',"+JSON.stringify(trainee.id)+")",'Çırak başka bir yola gidebilir');
 }else{
  html+='<p>Güvendiğin genç bir yakını eğitip kendi ustalığına ulaştırabilirsin.</p><div class="grid2">';
  for(const n of workshopCandidates().slice(0,6))
   html+=actionButton(safeText(n.name)+' çırak olsun',{kind:'workshop',id:'hire',targetId:n.id},
     "workshopAction('hire',"+JSON.stringify(n.id)+")",'3 servet • '+n.age+' yaş • zanaat '+(n.skills?.craft||0));
  html+='</div>';
 }
 html+='</div>';
 if(w.history.length)html+='<div class="card"><h3>Atölye Defteri</h3><div class="memoryline">'+
  w.history.slice(0,7).map(x=>safeText(x.year+' • '+x.note)).join('<br>')+'</div></div>';
 return html;
}


/* v38 — Kervan ticareti: satın alınan gerçek yük, sabit sefer fiyatı ve yol riski. */
const CARAVAN_GOODS={
 salt:{name:'Tuz',cost:3,weight:1},
 wool:{name:'Yün',cost:4,weight:2},
 iron:{name:'Demir eşya',cost:6,weight:2},
 silk:{name:'İpek',cost:9,weight:1}
};
const CARAVAN_ROUTES={
 river:{name:'Irmak Pazarı',months:2,toll:2,risk:.07,prices:{salt:1.65,wool:1.15,iron:1.35,silk:.85}},
 mountain:{name:'Dağ Geçidi Pazarı',months:3,toll:4,risk:.17,prices:{salt:1.3,wool:1.55,iron:1.7,silk:1.4}},
 steppe:{name:'Bozkır Toy Pazarı',months:1,toll:1,risk:.11,prices:{salt:.9,wool:1.35,iron:1.05,silk:1.65}}
};


/* v41 — Kalıcı bölgesel arz/talep ve mevsimsel pazar krizleri. */
const CARAVAN_MARKET_SHOCKS={
 shortage:{name:'Ticaret kıtlığı',supply:-5,demand:3},
 surplus:{name:'Pazar bolluğu',supply:6,demand:-2}
};
function caravanMarketState(routeId){
 return CARAVAN_ROUTES[routeId]?ensureCaravanTrade().markets[routeId]:null;
}
function caravanMarketMultiplier(routeId,goodId){
 if(!CARAVAN_GOODS[goodId])return 1;
 const m=caravanMarketState(routeId);if(!m)return 1;
 const g=m.goods[goodId],cr=m.crisis?.goodId===goodId?m.crisis:null;
 return Math.max(.65,Math.min(1.55,1+(g.demand-g.supply)*.028+(cr?(cr.kind==='shortage'?.05:-.05):0)));
}
function caravanMarketNote(m,kind,goodId,qty,note){
 m.history.unshift({serial:lifeSerial(),kind,goodId,qty,note});
 m.history=m.history.slice(0,36);
}
function caravanMarketExchange(routeId,goodId,qty,kind){
 if(!CARAVAN_GOODS[goodId])return false;
 const m=caravanMarketState(routeId);if(!m)return false;
 const count=Math.max(0,Math.min(12,Math.floor(qty||0)));if(!count)return false;
 const g=m.goods[goodId];
 if(kind==='playerSell'||kind==='npcSell')g.supply=Math.min(24,g.supply+count);
 else if(kind==='npcBuy')g.supply=Math.max(0,g.supply-count);
 else return false;
 g.traded+=count;
 caravanMarketNote(m,kind,goodId,count,CARAVAN_GOODS[goodId].name+' pazar işlemi');
 return true;
}
function caravanMarketShock(routeId,goodId,kind){
 if(!CARAVAN_GOODS[goodId]||!CARAVAN_MARKET_SHOCKS[kind])return false;
 const m=caravanMarketState(routeId);if(!m||m.crisis)return false;
 const cfg=CARAVAN_MARKET_SHOCKS[kind],g=m.goods[goodId];
 g.supply=Math.max(0,Math.min(24,g.supply+cfg.supply));
 g.demand=Math.max(0,Math.min(24,g.demand+cfg.demand));
 m.crisis={kind,goodId,remaining:3,started:lifeSerial()};
 caravanMarketNote(m,kind,goodId,0,CARAVAN_GOODS[goodId].name+' — '+cfg.name);
 return true;
}
function caravanMarketQuarterTick(month){
 if(month%3!==0||!s.assets.includes('caravan_share'))return;
 const serial=lifeSerial();
 for(const routeId of Object.keys(CARAVAN_ROUTES)){
  const m=caravanMarketState(routeId);if(m.lastQuarterSerial===serial)continue;
  m.lastQuarterSerial=serial;m.quarters++;
  for(const g of Object.values(m.goods)){
   if(g.supply<10)g.supply++;else if(g.supply>10)g.supply--;
   if(g.demand<10)g.demand++;else if(g.demand>10)g.demand--;
  }
  if(m.crisis&&!--m.crisis.remaining){
   caravanMarketNote(m,'recovery',m.crisis.goodId,0,'Pazar toparlandı.');m.crisis=null;
  }
  if(!m.crisis&&Math.random()<.065){
   const keys=Object.keys(CARAVAN_GOODS);
   caravanMarketShock(routeId,keys[rng(0,keys.length-1)],Math.random()<.5?'shortage':'surplus');
  }
 }
}
function caravanMarketSummaryHtml(){
 if(!s.assets.includes('caravan_share'))return '';
 const t=ensureCaravanTrade();
 let html='<div class="card"><h3>📈 Bölgesel Pazarlar</h3><p>Kıtlık fiyatı artırır, bolluk düşürür. İşlemler arzı değiştirir; pazar çeyrekler boyunca toparlanır. Açık sefer fiyatları sabittir.</p>';
 for(const [routeId,route] of Object.entries(CARAVAN_ROUTES)){
  const m=t.markets[routeId],cr=m.crisis;
  html+='<h3 class="sectionTitle">'+safeText(route.name)+'</h3>';
  if(cr)html+='<p>'+safeText(CARAVAN_GOODS[cr.goodId].name)+' • '+safeText(CARAVAN_MARKET_SHOCKS[cr.kind].name)+' • '+cr.remaining+' çeyrek</p>';
  html+='<div class="memoryline">'+Object.entries(m.goods).map(([id,g])=>{
   const factor=caravanMarketMultiplier(routeId,id);
   return safeText(CARAVAN_GOODS[id].name)+' arz '+g.supply+' / talep '+g.demand+' • '+(factor>1.04?'pahalı':factor<.96?'ucuz':'dengeli');
  }).join('<br>')+'</div>';
 }
 return html+'</div>';
}

/* v39: kalıcı ticaret ortaklığı ve yol bazlı gerçek NPC rekabeti. */
function caravanPartnerCandidates(){
 const m=careerContact('merchant'),list=[m,...s.careerContacts,...s.friends,...s.relatives].filter(n=>n?.alive&&n.age>=18&&!npcLifeBlocksNormalInteraction(n)&&
  (n.statusFlags?.careerKind==='merchant'||n.role==='Tüccar')&&!n.statusFlags?.tradeRivalRoute),ids=new Set();
 return list.filter(n=>!ids.has(n.id)&&ids.add(n.id));
}
function caravanPartner(){const id=ensureCaravanTrade().partnerId;return id?npcById(id):null;}
function caravanRivalRecord(routeId){return ensureCaravanTrade().competition[routeId]||null;}
function caravanEnsureRival(routeId){
 if(!CARAVAN_ROUTES[routeId])return null;
 const t=ensureCaravanTrade();let rec=t.competition[routeId];
 if(!rec)rec=t.competition[routeId]={npcId:null,heat:32,truceUntil:0,lastParleySerial:-1000,wins:0,encounters:0};
 let n=rec.npcId?npcById(rec.npcId):null;
 if(!n?.alive){
  const gender=pick(['male','female']),age=rng(24,48);
  n=normalizeNPC({id:npcId(),name:pick(D.realms[s.realm][gender]),gender,age,birthYear:s.year+s.age-age,
   type:'Pazar Rakibi',role:'Tüccar',goal:'wealth',alive:true,rel:48,wealth:rng(14,34),
   place:s.place,realm:s.realm,tribe:s.tribe,traits:['hirsli','tutumlu']},'Pazar Rakibi');
  n.statusFlags=n.statusFlags||{};n.statusFlags.tradeRivalRoute=routeId;
  s.careerContacts.push(n);rec.npcId=n.id;
  rec.inventory=[];rec.recentVolume=0;rec.displaced=0;
  caravanRecord('rival',CARAVAN_ROUTES[routeId].name+' yolunda '+n.name+' ile rekabet başladı.',{npcId:n.id});
 }
 return n;
}
function caravanNetworkIssue(mode,id){
 const t=ensureCaravanTrade();
 if(!s.assets.includes('caravan_share'))return 'Önce Kervan Payı edinmelisin.';
 if(s.age<18)return 'Ticaret anlaşmaları 18 yaşında açılır.';
 if(t.stage!=='home')return 'Anlaşmaları yalnız oba dönüşünde görüşebilirsin.';
 if(mode==='join'){
  if(t.partnerId)return 'Önce mevcut ticaret ortaklığını bitirmelisin.';
  const n=caravanPartnerCandidates().find(x=>x.id===id);
  if(!n)return 'Bu kişiyle ticaret ortaklığı kurulamaz.';
  if(n.rel<40||(n.bonds?.trust||0)<30)return 'Ortaklık için yeterli güven yok.';
 }else if(mode==='leave'){
  if(!t.partnerId||t.partnerId!==id)return 'Bu ortaklık artık yürürlükte değil.';
 }else if(mode==='parley'){
  if(!CARAVAN_ROUTES[id])return 'Ticaret yolu bulunamadı.';
  const rec=caravanRivalRecord(id);
  if(!rec||!npcById(rec.npcId)?.alive)return 'Bu yolda görüşülecek canlı rakip yok.';
  if(lifeSerial()-rec.lastParleySerial<12)return 'Aynı rakiple yeni görüşme için 12 ay geçmeli.';
  if(s.wealth<3)return 'Uzlaşma için 3 servet gerekiyor.';
 }else return 'Ticaret anlaşması eylemi bulunamadı.';
 return '';
}
function caravanNetworkAction(mode,id){
 const issue=caravanNetworkIssue(mode,id);if(issue){notice(issue);return false;}
 return performAction({kind:'caravanNetwork',id:mode,targetId:id},()=>{
  const t=ensureCaravanTrade();
  if(mode==='join'){
   const n=npcById(id);t.partnerId=id;t.partnerHistory.unshift({npcId:id,year:s.year+s.age,mode:'joined'});
   adjustNPC(n,{rel:3,trust:5,respect:3},'Kervan kazancını paylaşmak üzere sözleşme yaptınız.');
   caravanRecord('partner',n.name+' ile kârın dörtte biri için ortaklık kuruldu.',{npcId:id});
  }else if(mode==='leave'){
   const n=npcById(id);t.partnerId=null;t.partnerHistory.unshift({npcId:id,year:s.year+s.age,mode:'left'});
   if(n?.alive)adjustNPC(n,{rel:-1,trust:-1},'Ortaklık yeni seferlerden önce sona erdi.');
   caravanRecord('partnerEnd',(n?.name||'Tüccar')+' ile ortaklık sona erdi.',{npcId:id});
  }else if(mode==='parley'){
   const rec=t.competition[id],n=npcById(rec.npcId);s.wealth-=3;
   rec.heat=clamp(rec.heat-25);rec.truceUntil=lifeSerial()+12;rec.lastParleySerial=lifeSerial();
   if(n?.alive)adjustNPC(n,{rel:4,trust:4,grudge:-3},'Ticaret payında bir yıllık uzlaşma sağlandı.');
   economyLedger('caravanTrade',-3,CARAVAN_ROUTES[id].name+' uzlaşma gideri');
   caravanRecord('parley',CARAVAN_ROUTES[id].name+' pazarında bir yıllık rekabet ateşkesi sağlandı.',{npcId:rec.npcId});
  }
  t.partnerHistory=t.partnerHistory.slice(0,40);
 },'Tüccarlarla anlaşmaya bir ay ayırdın.');
}

/* v40 — Gerçek sermaye, mal stoku, özerk rakip pazarı ve toptan ticaret. */
function caravanRivalUnits(r){return (r.inventory||[]).reduce((n,x)=>n+x.qty,0);}
function caravanRivalStockAdd(r,id,cost){
 const lot=r.inventory.find(x=>x.goodId===id&&x.unitCost===cost);if(lot)lot.qty++;else r.inventory.push({goodId:id,qty:1,unitCost:cost});
}
function caravanRivalJournal(r,kind,id,amount){
 r.ledger.unshift({serial:lifeSerial(),kind,goodId:id,amount});
 r.ledger=r.ledger.slice(0,30);
}
function caravanRivalCycle(month){
 if(month%3!==0)return;
 const t=ensureCaravanTrade(),serial=lifeSerial(),goods=Object.keys(CARAVAN_GOODS),routes=Object.keys(CARAVAN_ROUTES);
 for(const [routeId,r] of Object.entries(t.competition)){
  const n=r.npcId?npcById(r.npcId):null;
  if(!n?.alive||r.lastCycleSerial===serial)continue;
  r.lastCycleSerial=serial;r.cycles++;
  const lot=r.inventory.find(x=>x.qty>0);
  if(lot){
   if(r.displaced){r.displaced--;caravanRivalJournal(r,'blocked',lot.goodId,0);}
   else{
    const id=lot.goodId,cost=lot.unitCost,price=Math.max(1,Math.round(CARAVAN_GOODS[id].cost*
     CARAVAN_ROUTES[routeId].prices[id]*(.85+ensureEconomy().tradeDemand/500)));
    lot.qty--;r.inventory=r.inventory.filter(x=>x.qty>0);
    n.wealth+=price;r.revenue+=price;r.profit+=price-cost;r.sold++;r.recentVolume=Math.min(6,r.recentVolume+1);
    caravanMarketExchange(routeId,id,1,'npcSell');
    r.lastSaleSerial=serial;caravanRivalJournal(r,'sell',id,price);
   }
  }
  const reserved=t.contracts.active?.issuerId===n.id?t.contracts.active.qty:0;
  if(caravanRivalUnits(r)<8-reserved){
   const id=goods[(r.cycles+routes.indexOf(routeId))%goods.length],cost=caravanBuyPrice(id);
   if(n.wealth>=cost){n.wealth-=cost;r.expenses+=cost;r.bought++;caravanRivalStockAdd(r,id,cost);caravanRivalJournal(r,'buy',id,-cost);
    caravanMarketExchange(routeId,id,1,'npcBuy');}
   else if(caravanRivalUnits(r)===0){r.stalls++;caravanRivalJournal(r,'stalled',id,0);}
  }
  if(r.lastSaleSerial!==serial)r.recentVolume=Math.max(0,r.recentVolume-1);
 }
}
function caravanWholesalePrice(id){
 const t=ensureCaravanTrade();return Math.max(1,Math.floor((t.prices[id]||CARAVAN_GOODS[id]?.cost||1)*.82));
}
function caravanWholesaleIssue(id){
 const t=ensureCaravanTrade();if(!s.assets.includes('caravan_share')||s.age<18)return 'Kervan ticaretine erişim yok.';
 if(t.stage!=='market')return 'Rakibe yalnızca ulaştığın pazarda satabilirsin.';
 if(!CARAVAN_GOODS[id]||!t.cargo.some(x=>x.goodId===id&&x.qty>0))return 'Bu maldan kervanda stok yok.';
 const r=t.competition[t.routeId],n=r?.npcId?npcById(r.npcId):null;
 if(!n?.alive)return 'Bu pazarda alıcı rakip yok.';
 const reserved=t.contracts.active?.issuerId===n.id?t.contracts.active.qty:0;
 if(caravanRivalUnits(r)+reserved>=8)return 'Rakibin ambarı sözleşme yüküyle dolu.';
 if(n.wealth<caravanWholesalePrice(id))return 'Rakip tüccarın bu mala yetecek nakdi yok.';
 return '';
}
function caravanWholesaleAction(id){
 const issue=caravanWholesaleIssue(id);if(issue){notice(issue);return false;}
 return performAction({kind:'caravanWholesale',id},()=>{
  const price=caravanWholesalePrice(id);
  const t=ensureCaravanTrade(),r=t.competition[t.routeId],n=npcById(r.npcId),lot=t.cargo.find(x=>x.goodId===id&&x.qty>0);
  const commission=t.trip?.partnerId?Math.floor(Math.max(0,price-lot.unitCost)*.25):0;
  lot.qty--;t.cargo=t.cargo.filter(x=>x.qty>0);
  n.wealth-=price;caravanRivalStockAdd(r,id,price);r.expenses+=price;r.bought++;caravanRivalJournal(r,'playerSale',id,-price);
  s.wealth+=price-commission;t.earned+=price-commission;t.partnerPaid+=commission;
  if(t.trip){t.trip.earned+=price-commission;t.trip.partnerPaid=(t.trip.partnerPaid||0)+commission;}
  const partner=t.trip?.partnerId?npcById(t.trip.partnerId):null;
  if(partner){partner.wealth=Math.max(0,partner.wealth||0)+commission;
   if(partner.alive)adjustNPC(partner,{trust:1,rel:1},'Pazarda kâr payı teslim edildi.');}
  economyLedger('caravanTrade',price-commission,CARAVAN_GOODS[id].name+' rakibe toptan satıldı');
  caravanRecord('wholesale',CARAVAN_GOODS[id].name+' rakibe '+price+' bedelle satıldı.',{npcId:n.id,amount:price-commission,partnerPaid:commission});
 },'Rakibe mal satmaya bir ay ayırdın.');
}

function caravanNetworkSummaryHtml(){
 const t=ensureCaravanTrade();if(!s.assets.includes('caravan_share'))return '';
 const partner=caravanPartner();
 let html='<div class="card"><h3>🤝 Tüccar Ortakları ve Rakipler</h3><p>Ortaklık daha iyi satış fiyatı ve düşük yol riski sağlar, net satış kârının %25’i ortağa gider.</p>';
 if(t.partnerId){
  html+='<div class="memoryline">Ortak: '+safeText(partner?.name||'Eski tüccar')+' • Kâr payı %25</div>';
  html+=actionButton('Ortaklığı bitir',{kind:'caravanNetwork',id:'leave',targetId:t.partnerId},
   'caravanNetworkAction("leave",'+JSON.stringify(t.partnerId)+')','Yalnız obada • geçmiş sözleşmeler korunur');
 }else{
  html+='<div class="grid2">';
  for(const n of caravanPartnerCandidates().slice(0,4))html+=actionButton(safeText(n.name)+' ile ortak ol',
   {kind:'caravanNetwork',id:'join',targetId:n.id},'caravanNetworkAction("join",'+JSON.stringify(n.id)+')',
   'Güven '+(n.bonds?.trust||0)+' • kâr payı %25');
  html+='</div>';
 }
 const rivals=Object.entries(t.competition).filter(([id,v])=>CARAVAN_ROUTES[id]&&v?.npcId);
 if(rivals.length){
  html+='<h3 class="sectionTitle">Rakip tüccarlar</h3><div class="grid2">';
  for(const [id,v] of rivals){
   const n=npcById(v.npcId),truce=v.truceUntil>lifeSerial();
   html+='<div class="card"><h3>'+safeText(n?.name||'Bilinmeyen rakip')+'</h3><p>'+safeText(CARAVAN_ROUTES[id].name)+
   ' • Rekabet '+v.heat+'/100'+(truce?' • Uzlaşma sürüyor':'')+'</p>'+
   '<p>Nakit '+(n?.wealth||0)+' • Ambar '+caravanRivalUnits(v)+' • Alış '+v.bought+' • Satış '+v.sold+
    ' • Net '+v.profit+' • Durgunluk '+v.stalls+'</p>'+
    '<div class="memoryline">'+(v.inventory.length?v.inventory.map(x=>safeText(CARAVAN_GOODS[x.goodId].name)+' ×'+x.qty).join(' • '):'Ambar boş')+'</div>'+
    actionButton('Uzlaşmayı görüş',{kind:'caravanNetwork',id:'parley',targetId:id},
    "caravanNetworkAction('parley','"+id+"')",'3 servet • 12 ayda bir')+'</div>';
  }
  html+='</div>';
 }
 if(t.partnerHistory.length)html+='<div class="memoryline">Ortaklık geçmişi '+t.partnerHistory.length+' • Ödenen kâr payı '+t.partnerPaid+' servet</div>';
 return html+'</div>';
}

function ensureCaravanTrade(){
 if(!s.caravanTrade||typeof s.caravanTrade!=='object'||Array.isArray(s.caravanTrade))s.caravanTrade={};
 const t=s.caravanTrade;
 t.cargo=Array.isArray(t.cargo)?t.cargo.filter(x=>x&&CARAVAN_GOODS[x.goodId]).map(x=>({
  goodId:x.goodId,qty:Math.max(0,Math.min(12,Math.floor(x.qty||0))),
  unitCost:Math.max(1,Math.floor(x.unitCost||CARAVAN_GOODS[x.goodId].cost))
 })).filter(x=>x.qty>0).slice(0,30):[];
 t.history=Array.isArray(t.history)?t.history.slice(0,65):[];
 t.voyages=Array.isArray(t.voyages)?t.voyages.slice(0,40):[];
 t.stage=['home','outbound','market','returning'].includes(t.stage)?t.stage:'home';
 t.routeId=CARAVAN_ROUTES[t.routeId]?t.routeId:null;
 if(t.stage!=='home'&&!t.routeId)t.stage='home';
 t.arrivalSerial=Math.max(0,Math.floor(t.arrivalSerial||0));
 t.lastTravelSerial=Number.isFinite(t.lastTravelSerial)?t.lastTravelSerial:null;
 t.guard=!!t.guard;
 t.prices=t.prices&&typeof t.prices==='object'&&!Array.isArray(t.prices)?t.prices:{};
 for(const key of Object.keys(CARAVAN_GOODS))t.prices[key]=Math.max(1,Math.floor(t.prices[key]||CARAVAN_GOODS[key].cost));
 t.trip=t.trip&&typeof t.trip==='object'?t.trip:null;
 t.partnerId=typeof t.partnerId==='string'&&t.partnerId?t.partnerId:null;
 t.partnerHistory=Array.isArray(t.partnerHistory)?t.partnerHistory.slice(0,40):[];
 t.contracts=t.contracts&&typeof t.contracts==='object'&&!Array.isArray(t.contracts)?t.contracts:{};
 const c=t.contracts;
 c.offers=Array.isArray(c.offers)?c.offers.filter(x=>x&&CARAVAN_ROUTES[x.routeId]&&CARAVAN_GOODS[x.goodId]&&
  typeof x.id==='string'&&typeof x.issuerId==='string'&&Number.isFinite(x.reward)&&x.reward>0&&
  Number.isFinite(x.qty)&&x.qty>=1&&x.qty<=8&&Number.isFinite(x.validUntil)).slice(0,3):[];
 c.history=Array.isArray(c.history)?c.history.slice(0,40):[];
 c.active=c.active&&CARAVAN_ROUTES[c.active.routeId]&&CARAVAN_GOODS[c.active.goodId]&&
  typeof c.active.id==='string'&&typeof c.active.issuerId==='string'&&Number.isFinite(c.active.reward)&&c.active.reward>0&&
  Number.isFinite(c.active.qty)&&c.active.qty>=1&&c.active.qty<=8&&Number.isFinite(c.active.deadlineSerial)?c.active:null;
 for(const k of ['fulfilled','failed','nextId'])c[k]=Math.max(0,Math.floor(Number.isFinite(c[k])?c[k]:0));
 c.lastSeekSerial=Number.isFinite(c.lastSeekSerial)?c.lastSeekSerial:null;
 t.markets=t.markets&&typeof t.markets==='object'&&!Array.isArray(t.markets)?t.markets:{};
 for(const routeId of Object.keys(CARAVAN_ROUTES)){
  const m=t.markets[routeId]&&typeof t.markets[routeId]==='object'&&!Array.isArray(t.markets[routeId])?t.markets[routeId]:{};
  t.markets[routeId]=m;m.goods=m.goods&&typeof m.goods==='object'&&!Array.isArray(m.goods)?m.goods:{};
  for(const goodId of Object.keys(CARAVAN_GOODS)){
   const g=m.goods[goodId]&&typeof m.goods[goodId]==='object'?m.goods[goodId]:{};
   m.goods[goodId]=g;
   for(const key of ['supply','demand'])g[key]=Math.max(0,Math.min(24,Math.floor(Number.isFinite(g[key])?g[key]:10)));
   g.traded=Math.max(0,Math.floor(Number.isFinite(g.traded)?g.traded:0));
  }
  m.history=Array.isArray(m.history)?m.history.slice(0,36):[];
  m.quarters=Math.max(0,Math.floor(Number.isFinite(m.quarters)?m.quarters:0));
  m.lastQuarterSerial=Number.isFinite(m.lastQuarterSerial)?m.lastQuarterSerial:null;
  const q=m.crisis;
  m.crisis=q&&CARAVAN_MARKET_SHOCKS[q.kind]&&CARAVAN_GOODS[q.goodId]&&Number.isFinite(q.remaining)&&q.remaining>0?
   {kind:q.kind,goodId:q.goodId,remaining:Math.min(4,Math.floor(q.remaining)),started:Number.isFinite(q.started)?q.started:0}:null;
 }
 for(const id of Object.keys(t.markets))if(!CARAVAN_ROUTES[id])delete t.markets[id];
 t.competition=t.competition&&typeof t.competition==='object'&&!Array.isArray(t.competition)?t.competition:{};
 for(const [id,rec] of Object.entries(t.competition)){
  if(!CARAVAN_ROUTES[id]||!rec||typeof rec!=='object'){delete t.competition[id];continue;}
  rec.npcId=typeof rec.npcId==='string'?rec.npcId:null;rec.heat=clamp(Number.isFinite(rec.heat)?rec.heat:32);
  rec.truceUntil=Math.max(0,Math.floor(rec.truceUntil||0));rec.lastParleySerial=Number.isFinite(rec.lastParleySerial)?rec.lastParleySerial:-1000;
  rec.wins=Math.max(0,Math.floor(rec.wins||0));rec.encounters=Math.max(0,Math.floor(rec.encounters||0));
  rec.inventory=Array.isArray(rec.inventory)?rec.inventory.filter(x=>x&&CARAVAN_GOODS[x.goodId]).map(x=>({
   goodId:x.goodId,qty:Math.max(0,Math.min(8,Math.floor(x.qty||0))),unitCost:Math.max(1,Math.floor(x.unitCost||CARAVAN_GOODS[x.goodId].cost))
  })).filter(x=>x.qty>0).slice(0,8):[];
  if(caravanRivalUnits(rec)>8){let cap=8;rec.inventory=rec.inventory.map(x=>{const qty=Math.min(x.qty,cap);cap-=qty;return {...x,qty};}).filter(x=>x.qty>0);}
  rec.ledger=Array.isArray(rec.ledger)?rec.ledger.slice(0,30):[];
  for(const key of ['cycles','bought','sold','revenue','expenses','stalls','recentVolume','displaced'])rec[key]=Math.max(0,Math.floor(rec[key]||0));
  rec.profit=Number.isFinite(rec.profit)?Math.round(rec.profit):0;
  rec.lastCycleSerial=Number.isFinite(rec.lastCycleSerial)?rec.lastCycleSerial:null;
  rec.lastSaleSerial=Number.isFinite(rec.lastSaleSerial)?rec.lastSaleSerial:null;
 }
 for(const k of ['bought','earned','spent','lost','completed','partnerPaid'])t[k]=Math.max(0,Math.floor(t[k]||0));
 return t;
}
function caravanCargoWeight(t=ensureCaravanTrade()){
 return t.cargo.reduce((sum,x)=>sum+x.qty*CARAVAN_GOODS[x.goodId].weight,0);
}
function caravanBuyPrice(id){
 const g=CARAVAN_GOODS[id],e=ensureEconomy();
 return g?Math.max(1,Math.round(g.cost*(.65+e.marketIndex/250+e.tradeDemand/500))):0;
}
function caravanQuote(routeId){
 const route=CARAVAN_ROUTES[routeId],e=ensureEconomy();if(!route)return null;
 const t=ensureCaravanTrade(),rec=t.competition[routeId];
 const rivalry=rec&&rec.truceUntil<=lifeSerial()?rec.heat/600:0;
 const supply=rec&&rec.lastSaleSerial!==null&&lifeSerial()-rec.lastSaleSerial<=3?Math.min(.14,rec.recentVolume*.035):0;
 const competition=Math.max(.67,1-rivalry-supply);
 const partner=caravanPartner(),bonus=partner?.alive?1.12:1;
 return Object.fromEntries(Object.keys(CARAVAN_GOODS).map(id=>[
  id,Math.max(1,Math.round(CARAVAN_GOODS[id].cost*route.prices[id]*(.85+e.tradeDemand/500)*competition*bonus*caravanMarketMultiplier(routeId,id)))
 ]));
}
function caravanIssue(mode,id=null,extra=null){
 const t=ensureCaravanTrade();
 if(!s.assets.includes('caravan_share'))return 'Önce Kervan Payı edinmelisin.';
 if(s.age<18)return 'Kervan ticareti 18 yaşında açılır.';
 if(mode==='buy'){
  if(t.stage!=='home')return 'Kervan yoldayken evde yük alamazsın.';
  if(!CARAVAN_GOODS[id])return 'Böyle bir ticaret malı yok.';
  if(caravanCargoWeight(t)+CARAVAN_GOODS[id].weight>8)return 'Kervan yükü sekiz kapasiteyi aşamaz.';
  if(s.wealth<caravanBuyPrice(id))return caravanBuyPrice(id)+' servet gerekiyor.';
 }else if(mode==='depart'){
  if(t.stage!=='home')return 'Kervanın önce geri dönmesi gerekiyor.';
  if(!CARAVAN_ROUTES[id])return 'Bu ticaret yolu bulunamadı.';
  if(!t.cargo.length)return 'Yola çıkmadan önce gerçek mal satın almalısın.';
  if(assetState('caravan_share').condition<30)return 'Kervan payının bakımını önce tamamla.';
  const total=CARAVAN_ROUTES[id].toll+(extra==='guarded'?4:0);
  if(s.wealth<total)return total+' servet yol ve koruma payı gerekiyor.';
  if(extra!==null&&extra!=='guarded')return 'Koruma seçeneği bulunamadı.';
 }else if(mode==='sell'){
  if(t.stage!=='market')return 'Yalnızca ulaştığın pazarda satabilirsin.';
  if(!t.cargo.length)return 'Satılacak yük kalmadı.';
 }else if(mode==='return'){
  if(t.stage!=='market')return 'Önce varış pazarına ulaşmalısın.';
 }else return 'Kervan eylemi bulunamadı.';
 return '';
}
function caravanRecord(type,note,details={}){
 const t=ensureCaravanTrade();
 t.history.unshift({year:s.year+s.age,month:currentMonth(),type,note,...details});
 t.history=t.history.slice(0,65);
}
function caravanAction(mode,id=null,extra=null){
 const issue=caravanIssue(mode,id,extra);if(issue){notice(issue);return false;}
 return performAction({kind:'caravanTrade',id:mode,goodId:id,extra},()=>{
  const t=ensureCaravanTrade();
  if(mode==='buy'){
   const price=caravanBuyPrice(id);s.wealth-=price;t.bought++;t.spent+=price;
   // FIFO lotları: eski fiyattan alınan malların maliyeti sonraki dönemde kaybolmaz.
   const lot=t.cargo.find(x=>x.goodId===id&&x.unitCost===price);
   if(lot)lot.qty++;else t.cargo.push({goodId:id,qty:1,unitCost:price});
   economyLedger('caravanTrade',-price,CARAVAN_GOODS[id].name+' ticaret yükü');
   caravanRecord('buy',CARAVAN_GOODS[id].name+' alındı, bedel '+price+'.');
  }else if(mode==='depart'){
   const route=CARAVAN_ROUTES[id],fee=route.toll+(extra==='guarded'?4:0);
   caravanEnsureRival(id);
   s.wealth-=fee;t.spent+=fee;t.routeId=id;t.stage='outbound';t.guard=extra==='guarded';
   t.arrivalSerial=lifeSerial()+route.months;t.prices=caravanQuote(id);
   t.trip={routeId:id,departed:lifeSerial(),spent:fee+t.cargo.reduce((sum,x)=>sum+x.qty*x.unitCost,0),
    fee,earned:0,lost:0,guarded:t.guard,origin:s.place,partnerId:caravanPartner()?.alive?caravanPartner().id:null,partnerPaid:0};
   if(t.competition[id])t.competition[id].encounters++;
   economyLedger('caravanTrade',-fee,route.name+' yol gideri');
   caravanRecord('depart',route.name+' yoluna çıkıldı; yük fiyatı ve varış bedeli sabitlendi.');
  }else if(mode==='sell'){
   const amount=t.cargo.reduce((sum,x)=>sum+x.qty*t.prices[x.goodId],0);
   const goods=t.cargo.reduce((sum,x)=>sum+x.qty,0);
   const soldGoods={};for(const lot of t.cargo)soldGoods[lot.goodId]=(soldGoods[lot.goodId]||0)+lot.qty;
   const costs=t.cargo.reduce((sum,x)=>sum+x.qty*x.unitCost,0);
   const share=t.trip?.partnerId?Math.floor(Math.max(0,amount-costs-(t.trip?.fee||0))*.25):0;
   const income=amount-share;
   s.wealth+=income;t.earned+=income;t.partnerPaid+=share;
   if(t.trip){t.trip.earned+=income;t.trip.partnerPaid=(t.trip.partnerPaid||0)+share;}
   t.cargo=[];
   const rival=t.competition[t.routeId];if(rival)rival.displaced=Math.min(8,rival.displaced+Math.ceil(goods/2));
   for(const [id,qty] of Object.entries(soldGoods))caravanMarketExchange(t.routeId,id,qty,'playerSell');
   const partner=t.trip?.partnerId?npcById(t.trip.partnerId):null;
   if(partner){partner.wealth=Math.max(0,Math.round(partner.wealth||0))+share;
    if(partner.alive)adjustNPC(partner,{rel:2,trust:3},'Kervan kârının söz verilen payı teslim edildi.');}
   const buyer=careerContact('merchant');
   if(buyer?.alive)adjustNPC(buyer,{rel:2,trust:3,respect:2},'Uzak pazarda getirilen malların karşılığı söz verildiği gibi teslim edildi.');
   skillGain('trade',3);addExperience('trade');
   economyLedger('caravanTrade',income,goods+' parça yük '+CARAVAN_ROUTES[t.routeId].name+' pazarında satıldı'+(share?' • ortak payı '+share:''));
   caravanRecord('sell',goods+' parça yük satıldı, '+income+' servet kaldı'+(share?' • ortak payı '+share:''),{buyerId:buyer?.id||null,amount:income,partnerPaid:share});
  }else if(mode==='return'){
   const route=CARAVAN_ROUTES[t.routeId];t.stage='returning';t.arrivalSerial=lifeSerial()+route.months;
   caravanRecord('return',route.name+' pazarından dönüş başladı.');
  }
 },'Kervan ticaretine bir ay ayırdın.');
}
function caravanMonthTick(){
 const t=ensureCaravanTrade();
 if(!['outbound','returning'].includes(t.stage)||t.lastTravelSerial===lifeSerial())return;
 const route=CARAVAN_ROUTES[t.routeId];if(!route)return;
 t.lastTravelSerial=lifeSerial();
 // Tek ayda bir kez uygulanan risk; sefer kaydı ve tükenen gerçek stok kalıcıdır.
 const risk=Math.max(.015,route.risk-(t.guard?.085:0)-(statePolicyActive('caravan_guard')?.025:0)-(s.skills.trade||0)/1000-(t.trip?.partnerId?.03:0));
 if(t.cargo.length&&Math.random()<risk){
  const lot=t.cargo[rng(0,t.cargo.length-1)],cost=lot.unitCost;lot.qty--;
  if(lot.qty<=0)t.cargo=t.cargo.filter(x=>x!==lot);
  t.lost+=cost;if(t.trip)t.trip.lost+=cost;
  assetState('caravan_share').condition=clamp(assetState('caravan_share').condition-4);
  caravanRecord('loss',CARAVAN_GOODS[lot.goodId].name+' yolda kayboldu, '+cost+' servetlik yük yitirildi.');
 }
 if(lifeSerial()>=t.arrivalSerial){
  if(t.stage==='outbound'){t.stage='market';caravanRecord('arrive',route.name+' pazarına ulaşıldı.');}
  else{
   const carryValue=t.cargo.reduce((sum,x)=>sum+x.qty*x.unitCost,0);
   const trip=t.trip?{...t.trip,returned:lifeSerial(),inventoryRemaining:carryValue,profit:t.trip.earned+carryValue-t.trip.spent}:null;
   if(trip){const rec=t.competition[trip.routeId];if(rec){rec.heat=clamp(rec.heat+(trip.profit>=0?4:1));if(trip.profit>=0)rec.wins++;}t.voyages.unshift(trip);t.voyages=t.voyages.slice(0,40);}
   t.stage='home';t.routeId=null;t.arrivalSerial=0;t.guard=false;t.trip=null;t.completed++;
   caravanRecord('home','Kervan geri döndü.'+(trip?' Sefer hesabı '+trip.profit+' servet.':''));
  }
 }
}
function caravanInheritance(old,share){
 if(!share.assets.includes('caravan_share'))return null;
 const t=ensureCaravanTrade(),inherited=JSON.parse(JSON.stringify(t));
 inherited.partnerId=null;
 inherited.contracts.active=null;inherited.contracts.offers=[];
 inherited.inheritedRivals=old.careerContacts.filter(n=>n.alive&&n.statusFlags?.tradeRivalRoute&&
  Object.values(t.competition).some(v=>v.npcId===n.id)).map(n=>JSON.parse(JSON.stringify(n)));
 return inherited;
}
function caravanLegacySnapshot(){
 const t=ensureCaravanTrade();return {completed:t.completed,earned:t.earned,spent:t.spent,lost:t.lost,partnerPaid:t.partnerPaid,partners:t.partnerHistory.length,rivals:Object.keys(t.competition).length,fulfilledContracts:t.contracts.fulfilled,failedContracts:t.contracts.failed,ongoing:t.stage!=='home'};
}

/* v42: Emanet ödüllü, gerçek NPC alıcılı, son tarihli kervan sözleşmeleri. */
function caravanContractIssue(mode,id=null){
 const t=ensureCaravanTrade(),c=t.contracts,now=lifeSerial();
 if(!s.assets.includes('caravan_share'))return 'Önce Kervan Payı edinmelisin.';
 if(s.age<18)return 'Teslimat sözleşmeleri 18 yaşında açılır.';
 if(mode==='seek'){
  if(t.stage!=='home')return 'Yeni sözleşmeler obada aranır.';
  if(c.active)return 'Önce devam eden sözleşmeyi bitirmelisin.';
  if(c.lastSeekSerial!==null&&now-c.lastSeekSerial<6)return 'Yeni teklif için altı ay geçmeli.';
 }else if(mode==='accept'){
  if(t.stage!=='home')return 'Sözleşmeler obada kabul edilir.';
  if(c.active)return 'Aynı anda yalnız bir teslimat sözleşmesi olabilir.';
  const q=c.offers.find(x=>x.id===id);if(!q)return 'Böyle bir teklif bulunamadı.';
  if(now>q.validUntil)return 'Sözleşmenin teklif süresi doldu.';
  const n=npcById(q.issuerId),r=t.competition[q.routeId];
  if(!n?.alive||r?.npcId!==q.issuerId)return 'Sözleşmenin tüccarı artık ticaret yapmıyor.';
  if(n.wealth<q.reward)return 'Tüccarın ödülü karşılayacak serveti yok.';
  if(caravanRivalUnits(r)+q.qty>8)return 'Tüccarın ambarında yeterli yer yok.';
 }else if(mode==='deliver'){
  const q=c.active;if(!q||q.id!==id)return 'Etkin bir teslimat sözleşmesi yok.';
  if(now>q.deadlineSerial)return 'Sözleşmenin teslim süresi doldu.';
  if(t.stage!=='market'||t.routeId!==q.routeId)return 'Yükü sözleşmedeki varış pazarına götürmelisin.';
  const n=npcById(q.issuerId),r=t.competition[q.routeId];
  if(!n?.alive||r?.npcId!==q.issuerId)return 'Alıcı tüccara teslimat yapılamıyor.';
  if(caravanRivalUnits(r)+q.qty>8)return 'Alıcı tüccarın ambarı dolu.';
  if(t.cargo.filter(x=>x.goodId===q.goodId).reduce((sum,x)=>sum+x.qty,0)<q.qty)return 'Teslimat için yeterli gerçek yükün yok.';
 }else return 'Bilinmeyen sözleşme eylemi.';
 return '';
}
function caravanContractFinish(status,note){
 const t=ensureCaravanTrade(),c=t.contracts,q=c.active;if(!q)return false;
 const n=npcById(q.issuerId);
 if(status!=='fulfilled'&&n)n.wealth=Math.max(0,Math.round(n.wealth||0))+q.reward;
 if(status==='expired'){
  s.prestige=clamp(s.prestige-4);
  const cost=Math.min(2,s.wealth);s.wealth-=cost;
  if(cost)economyLedger('caravanTrade',-cost,'Geciken sözleşme itibar gideri');
  if(n?.alive)adjustNPC(n,{rel:-7,trust:-9,respect:-5,grudge:5},'Verilen ticaret sözü zamanında yerine getirilmedi.');
  c.failed++;
 }else if(status==='fulfilled')c.fulfilled++;
 c.history.unshift({...q,status,closedSerial:lifeSerial(),note});c.history=c.history.slice(0,40);
 c.active=null;caravanRecord('contract_'+status,note,{issuerId:q.issuerId,contractId:q.id});
 return true;
}
function caravanContractMonthTick(){
 const c=ensureCaravanTrade().contracts,now=lifeSerial();
 c.offers=c.offers.filter(x=>x.validUntil>=now).slice(0,3);
 if(!c.active)return;
 const n=npcById(c.active.issuerId);
 if(!n?.alive){caravanContractFinish('void','Tüccar öldü; sözleşme cezasız iptal edildi.');return;}
 if(now>c.active.deadlineSerial)caravanContractFinish('expired','Teslimat süresi doldu; ticaret sözleşmesi başarısız oldu.');
}
function caravanContractAction(mode,id=null){
 const issue=caravanContractIssue(mode,id);if(issue){notice(issue);return false;}
 return performAction({kind:'caravanContract',id:mode,offerId:id},()=>{
  const t=ensureCaravanTrade(),c=t.contracts;
  if(mode==='seek'){
   c.lastSeekSerial=lifeSerial();c.offers=[];
   const goods=Object.keys(CARAVAN_GOODS);
   for(const [i,routeId] of Object.keys(CARAVAN_ROUTES).entries()){
    const n=caravanEnsureRival(routeId),r=t.competition[routeId];if(!n?.alive||!r)continue;
    const goodId=goods[(i+c.nextId)%goods.length],quote=caravanQuote(routeId)[goodId];
    let qty=routeId==='mountain'?2:1,reward=qty*(quote+3);
    if(n.wealth<reward||caravanRivalUnits(r)+qty>8){qty=1;reward=quote+3;}
    if(n.wealth<reward||caravanRivalUnits(r)+qty>8)continue;
    c.offers.push({id:'cv42_'+c.nextId++,issuerId:n.id,routeId,goodId,qty,reward,
     offeredSerial:lifeSerial(),validUntil:lifeSerial()+6});
   }
   caravanRecord('contract_seek',c.offers.length+' teslimat teklifi bulundu.');
  }else if(mode==='accept'){
   const offer=c.offers.find(x=>x.id===id),n=npcById(offer.issuerId);
   n.wealth-=offer.reward;
   c.active={...offer,acceptedSerial:lifeSerial(),
    deadlineSerial:lifeSerial()+CARAVAN_ROUTES[offer.routeId].months+8};
   c.offers=[];
   caravanRecord('contract_accept',n.name+' için '+offer.qty+' '+CARAVAN_GOODS[offer.goodId].name+
    ' teslimatı kabul edildi. '+offer.reward+' servet emanete alındı.',{issuerId:n.id,contractId:offer.id});
  }else if(mode==='deliver'){
   const q=c.active,n=npcById(q.issuerId),r=t.competition[q.routeId];
   let need=q.qty,cost=0;
   for(const lot of t.cargo){
    if(lot.goodId!==q.goodId||need<=0)continue;
    const used=Math.min(need,lot.qty);lot.qty-=used;need-=used;cost+=used*lot.unitCost;
   }
   t.cargo=t.cargo.filter(x=>x.qty>0);
   for(let i=0;i<q.qty;i++)caravanRivalStockAdd(r,q.goodId,Math.max(1,Math.floor(q.reward/q.qty)));
   r.bought+=q.qty;r.expenses+=q.reward;
   caravanRivalJournal(r,'contractDelivery',q.goodId,-q.reward);
   const partner=t.trip?.partnerId?npcById(t.trip.partnerId):null;
   const commission=partner?Math.floor(Math.max(0,q.reward-cost)*.25):0;
   s.wealth+=q.reward-commission;t.earned+=q.reward-commission;t.partnerPaid+=commission;
   if(t.trip){t.trip.earned+=q.reward-commission;t.trip.partnerPaid=(t.trip.partnerPaid||0)+commission;}
   if(partner){partner.wealth=Math.max(0,partner.wealth||0)+commission;
    if(partner.alive)adjustNPC(partner,{trust:2,rel:2},'Sözleşme ortaklık payı teslim edildi.');}
   adjustNPC(n,{rel:5,trust:8,respect:5},'Sözleşmedeki mallar zamanında teslim edildi.');
   skillGain('trade',2);addExperience('trade');
   economyLedger('caravanTrade',q.reward-commission,CARAVAN_GOODS[q.goodId].name+' teslimat ödülü');
   caravanContractFinish('fulfilled',CARAVAN_GOODS[q.goodId].name+' teslim edildi; '+(q.reward-commission)+' servet alındı.');
  }
 },'Ticaret sözleşmeleri için bir ay ayırdın.');
}
function caravanContractSummaryHtml(){
 if(!s.assets.includes('caravan_share'))return '';
 const t=ensureCaravanTrade(),c=t.contracts,q=c.active,now=lifeSerial();
 let html='<div class="card"><h3>📜 Ticaret Sözleşmeleri</h3><p>Tamamlanan '+c.fulfilled+' • Başarısız '+c.failed+
 ' • Tek aktif sözleşme. Ödül kabulde gerçek tüccar servetinden ayrılır.</p>';
 if(q){
  const n=npcById(q.issuerId),loaded=t.cargo.filter(x=>x.goodId===q.goodId).reduce((v,x)=>v+x.qty,0);
  html+='<p><b>'+safeText(n?.name||'Tüccar')+'</b> • '+safeText(CARAVAN_ROUTES[q.routeId].name)+
   ' • '+safeText(CARAVAN_GOODS[q.goodId].name)+' ×'+q.qty+' • Ödül '+q.reward+
   ' servet • Kalan '+Math.max(0,q.deadlineSerial-now)+' ay • Yük '+loaded+'/'+q.qty+'</p>';
  html+=actionButton('Teslimatı tamamla',{kind:'caravanContract',id:'deliver',offerId:q.id},
   'caravanContractAction("deliver",'+JSON.stringify(q.id)+')','Yalnız sözleşmedeki pazarda');
 }else{
  if(t.stage==='home')html+=actionButton('Yeni sözleşme ara',{kind:'caravanContract',id:'seek'},
   'caravanContractAction("seek")','Altı ayda bir • bir eylem');
  for(const offer of c.offers){
   if(offer.validUntil<now)continue;
   const n=npcById(offer.issuerId);
   html+='<div class="memoryline">'+safeText(n?.name||'Tüccar')+' • '+
    safeText(CARAVAN_ROUTES[offer.routeId].name)+' • '+safeText(CARAVAN_GOODS[offer.goodId].name)+
    ' ×'+offer.qty+' • '+offer.reward+' servet • Teklife '+Math.max(0,offer.validUntil-now)+' ay</div>';
   html+=actionButton('Sözleşmeyi kabul et',{kind:'caravanContract',id:'accept',offerId:offer.id},
    'caravanContractAction("accept",'+JSON.stringify(offer.id)+')','Ödül emanete ayrılır');
  }
 }
 if(c.history.length)html+='<h3 class="sectionTitle">Sözleşme geçmişi</h3><div class="memoryline">'+
  c.history.slice(0,5).map(x=>safeText(CARAVAN_ROUTES[x.routeId]?.name||'Pazar')+' • '+
   safeText(CARAVAN_GOODS[x.goodId]?.name||'Mal')+' ×'+x.qty+' • '+
   (x.status==='fulfilled'?'Tamamlandı':x.status==='expired'?'Süre aşıldı':'İptal')).join('<br>')+'</div>';
 return html+'</div>';
}

function caravanTradeSummaryHtml(){
 const t=ensureCaravanTrade();if(!s.assets.includes('caravan_share'))return '';
 const route=t.routeId?CARAVAN_ROUTES[t.routeId]:null;
 let html='<div class="card"><h3>🐫 Kervan Ticareti</h3><p>8 yük kapasitesi • '+caravanCargoWeight(t)+'/8 dolu • Sefer '+t.completed+' • Satış '+t.earned+' • Gider '+t.spent+' • Yitik '+t.lost+'</p>';
 html+='<div class="memoryline">Yük: '+(t.cargo.length?t.cargo.map(x=>safeText(CARAVAN_GOODS[x.goodId].name)+' ×'+x.qty+' (alış '+x.unitCost+')').join(' • '):'Boş')+'</div>';
 if(t.stage==='home'){
  html+='<p>Konum: Oba. Önce mal al, sonra ticaret yolunu seç.</p><div class="grid2">';
  for(const [id,g] of Object.entries(CARAVAN_GOODS))html+=actionButton('Al: '+safeText(g.name),{kind:'caravanTrade',id:'buy',goodId:id},
   "caravanAction('buy','"+id+"')",caravanBuyPrice(id)+' servet • '+g.weight+' yük');
  html+='</div><h3 class="sectionTitle">Ticaret yolları</h3><div class="grid2">';
  for(const [id,r] of Object.entries(CARAVAN_ROUTES)){
   html+=actionButton(safeText(r.name),{kind:'caravanTrade',id:'depart',goodId:id},
    "caravanAction('depart','"+id+"')",r.months+' ay yol • '+r.toll+' servet geçiş');
   html+=actionButton(safeText(r.name)+' • Muhafızlı',{kind:'caravanTrade',id:'depart',goodId:id,extra:'guarded'},
    "caravanAction('depart','"+id+"','guarded')",r.months+' ay yol • '+(r.toll+4)+' servet • daha az kayıp');
  }
  html+='</div>';
 }else{
  html+='<p>'+safeText(route.name)+' • '+(t.stage==='outbound'?'Gidiş':t.stage==='returning'?'Dönüş':'Pazarda')+
   (t.stage==='market'?' • mallarının satış fiyatı sabit':' • varışa '+Math.max(0,t.arrivalSerial-lifeSerial())+' ay')+'</p>';
  if(t.stage==='market'){
   html+='<div class="memoryline">'+Object.entries(CARAVAN_GOODS).map(([id,g])=>safeText(g.name)+' satış '+t.prices[id]+' servet').join(' • ')+'</div><div class="grid2">';
   html+=actionButton('Bütün yükü sat',{kind:'caravanTrade',id:'sell'},"caravanAction('sell')",'Yalnızca mevcut stoğu bir kez sat');
   html+=actionButton('Obaya dön',{kind:'caravanTrade',id:'return'},"caravanAction('return')",'Satılmayan yük elde kalır');
   html+='</div>';
   const rival=t.competition[t.routeId],buyer=rival?.npcId?npcById(rival.npcId):null;
   if(buyer?.alive){
    html+='<h3 class="sectionTitle">Rakibe doğrudan sat</h3><p>'+safeText(buyer.name)+' yalnız kendi servetiyle mal alır.</p><div class="grid2">';
    for(const [id,g] of Object.entries(CARAVAN_GOODS))if(t.cargo.some(x=>x.goodId===id&&x.qty>0))
     html+=actionButton(safeText(g.name)+' sat',{kind:'caravanWholesale',id},
      "caravanWholesaleAction('"+id+"')",'Toptan '+caravanWholesalePrice(id)+' servet • rakip nakit '+buyer.wealth);
    html+='</div>';
   }
  }
 }
 if(t.voyages.length)html+='<h3 class="sectionTitle">Sefer geçmişi</h3><div class="memoryline">'+
  t.voyages.slice(0,5).map(x=>safeText(CARAVAN_ROUTES[x.routeId]?.name||'Kervan')+' • gelir '+x.earned+' • maliyet '+x.spent+' • net '+x.profit).join('<br>')+'</div>';
 if(t.history.length)html+='<div class="memoryline">'+t.history.slice(0,3).map(x=>safeText(x.note)).join('<br>')+'</div>';
 return html+'</div>'+caravanNetworkSummaryHtml()+caravanMarketSummaryHtml()+caravanContractSummaryHtml();
}

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
  const relief=statePolicyActive('winter_share')?0.04:0;if(Math.random()<Math.max(.04,.12+e.foodPressure/700-relief)){gain=-rng(1,3);st.losses++;}else gain=Math.max(0,gross);
 }else if(id==='smithy'&&s.skills.craft>=40){
  if(Math.random()<.1){gain=-1;st.losses++;}else gain=Math.max(0,Math.round(rng(1,4)*(.65+e.craftDemand/100))+(statePolicyActive('craft_patronage')?1:0));
 }else if(id==='caravan_share'){
  if(ensureCaravanTrade().stage!=='home')return 0;
  const guard=statePolicyActive('caravan_guard')?0.08:0;if(Math.random()<Math.max(.06,.22-guard)){gain=-rng(1,5);st.losses++;}else gain=Math.max(0,Math.round(rng(1,5)*(.6+e.tradeDemand/100)));
 }
 if(gain){s.wealth=Math.max(0,s.wealth+gain);if(gain>0)st.profits+=gain;economyLedger('asset',gain,id+' dönem getirisi');}
 return gain;
}
function tickEconomyQuarter(month){
 if(s.age<18)return;const e=ensureEconomy(),bias=economySeasonBias(month);
 e.marketIndex=ecoClamp(e.marketIndex+bias+rng(-5,5),75,145);
 e.foodPressure=clamp(e.foodPressure+(month<=2?rng(4,10):month<=8?rng(-7,2):rng(-1,5))-(s.assets.includes('flock')?2:0));
 e.tradeDemand=clamp(e.tradeDemand+rng(-8,8)+(month>=4&&month<=9?3:-1));e.craftDemand=clamp(e.craftDemand+rng(-7,7)+(s.assets.includes('smithy')?1:0));statePolicyQuarterTick(month);
 const cost=householdQuarterCost(),upkeep=s.assets.reduce((a,id)=>a+(ASSET_ECONOMY[id]?.upkeep||0),0),due=cost+upkeep,pay=Math.min(s.wealth,due);
 s.wealth-=pay;e.upkeepPaid+=pay;
 if(pay<due){const missing=due-pay;e.upkeepMissed+=missing;e.shortageMonths++;apply({happiness:-Math.min(4,missing),health:e.shortageMonths>=2?-1:0});for(const id of s.assets)assetState(id).condition=clamp(assetState(id).condition-3);economyLedger('expense',-pay,'Geçim ve bakım gideri tam karşılanamadı.');}
 else{e.shortageMonths=Math.max(0,e.shortageMonths-1);economyLedger('expense',-due,'Üç aylık hane geçimi ve varlık bakımı');}
 for(const id of s.assets){passiveAssetQuarter(id,month);familyStewardQuarter(id);}
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
 const f=ensureFamilyBranches(),equal=s.will==='equal'||!heirs.some(n=>n.id===s.will),i=Math.max(0,heirs.findIndex(n=>n.id===child.id)),livingIds=new Set(heirs.map(n=>n.id));
 const designated=s.assets.filter(id=>f.assetHeirs[id]===child.id),remaining=s.assets.filter(id=>!f.assetHeirs[id]||!livingIds.has(f.assetHeirs[id]));
 const regular=equal?remaining.filter((_,j)=>j%heirs.length===i):s.will===child.id?[...remaining]:[];
 return {equal,wealth:equal?Math.floor(s.wealth/heirs.length):s.will===child.id?s.wealth:0,assets:[...new Set([...designated,...regular])]};
}
function applySuccessionEffect(spec={}){
 const q=ensureSuccession(),target=npcById(s.pendingEventContext?.targetId),mode=spec.mode||'';
 if(mode==='equal'){s.will='equal';q.chosenHeirId=null;}
 if(mode==='target'&&target&&s.children.some(n=>n.id===target.id&&n.alive)){s.will=target.id;q.chosenHeirId=target.id;}
 if(spec.prepared!==false)q.prepared=true;if(spec.harmony)q.familyHarmony=clamp(q.familyHarmony+spec.harmony);if(spec.lastWish)q.lastWish=String(spec.lastWish);
 q.lastCouncilYear=s.year+s.age;q.history.unshift({year:s.year+s.age,age:s.age,mode:s.will==='equal'?'equal':'chosen',targetId:q.chosenHeirId,note:String(spec.note||spec.lastWish||'Aile geleceği konuşuldu.'),harmony:q.familyHarmony});q.history=q.history.slice(0,24);
}

function ensureElderLife(){
 s.elderLife=s.elderLife&&typeof s.elderLife==='object'&&!Array.isArray(s.elderLife)?s.elderLife:{};
 const e=s.elderLife;
 e.startedAge=Number.isFinite(e.startedAge)?e.startedAge:(s.age>=50?s.age:null);
 e.standing=clamp(Number.isFinite(e.standing)?e.standing:Math.round((s.prestige||0)*.55+Math.max(...Object.values(s.skills||{speech:0}))* .25));
 e.purpose=clamp(Number.isFinite(e.purpose)?e.purpose:60);
 e.careSupport=clamp(Number.isFinite(e.careSupport)?e.careSupport:elderCareScoreRaw());
 for(const k of ['years','councils','lessons','reconciliations','delegations','childHomeMoves','memoriesShared'])e[k]=Math.max(0,Math.round(e[k]||0));
 e.mentorIds=Array.isArray(e.mentorIds)?[...new Set(e.mentorIds)].slice(-30):[];
 e.history=Array.isArray(e.history)?e.history.slice(0,50):[];
 e.lastActiveYear=Number.isFinite(e.lastActiveYear)?e.lastActiveYear:null;e.hostChildId=e.hostChildId||null;
 return e;
}
function elderCloseFamily(){
 const raw=[...(s.partner?.alive?[s.partner]:[]),...s.children,...s.siblings,...s.parents,...(s.relatives||[])].filter(n=>n?.alive);
 const seen=new Set();return raw.filter(n=>!seen.has(n.id)&&seen.add(n.id));
}
function elderAdultChildren(){return s.children.filter(n=>n?.alive&&n.age>=18);}
function elderCareSources(){
 const raw=[...(s.partner?.alive?[s.partner]:[]),...elderAdultChildren(),...s.siblings.filter(n=>n?.alive&&(n.rel||0)>=55)];
 const seen=new Set();return raw.filter(n=>!seen.has(n.id)&&seen.add(n.id));
}
function elderCareScoreRaw(){
 const src=elderCareSources();if(!src.length)return 25;
 let score=Math.round(src.reduce((a,n)=>{normalizeBonds(n);return a+((n.rel||0)+(n.bonds?.trust||0))/2;},0)/src.length);
 const h=s.housing;if(h?.mode==='hosted_yurt'&&h.hostId&&src.some(n=>n.id===h.hostId))score+=12;
 return clamp(score);
}
function elderMentorCandidates(){
 const raw=[
  ...s.children.filter(n=>n?.alive&&n.age>=8&&n.age<=Math.max(8,s.age-10)),
  ...s.siblings.filter(n=>n?.alive&&n.age>=10&&n.age<=s.age-12),
  ...(s.relatives||[]).filter(n=>n?.alive&&n.age>=10&&n.age<=s.age-15),
  ...(s.role?workplaceJuniors().filter(n=>n?.alive):[])
 ];
 const seen=new Set();return raw.filter(n=>!seen.has(n.id)&&seen.add(n.id)).sort((a,b)=>(b.rel||0)-(a.rel||0));
}
function elderDelegateCandidates(){
 if(!s.role)return [];
 return workplaceJuniors().filter(n=>n?.alive).sort((a,b)=>((b.bonds?.trust||0)+(b.bonds?.respect||0))-((a.bonds?.trust||0)+(a.bonds?.respect||0)));
}
function elderHostChildren(){
 return elderAdultChildren().filter(n=>{normalizeBonds(n);return (n.rel||0)>=55&&(n.bonds?.trust||0)>=35&&(!n.realm||n.realm===s.realm)&&(!n.place||n.place===s.place);}).sort((a,b)=>((b.rel||0)+(b.bonds?.trust||0))-((a.rel||0)+(a.bonds?.trust||0)));
}
function elderPrimarySkill(){
 const entries=Object.entries(s.skills||{});if(!entries.length)return ['speech',s.skill||0];
 return entries.sort((a,b)=>b[1]-a[1])[0];
}
function elderActionIssue(id,index=-1){
 if(s.age<50)return '50 yaşında tecrübe çağı açılır.';
 if(id==='council'){if(!elderCloseFamily().length)return 'Meclise çağırabileceğin yaşayan bir yakın yok.';}
 else if(id==='mentor'){if(!elderMentorCandidates()[index])return 'Tecrübe aktarabileceğin uygun bir genç yok.';}
 else if(id==='reconcile'){if(!s.rivals.filter(n=>n?.alive)[index])return 'Barışmayı deneyebileceğin yaşayan bir hasım yok.';}
 else if(id==='delegate'){if(!s.role)return 'Devredeceğin aktif bir görevin yok.';if(!elderDelegateCandidates()[index])return 'Görevi devredebileceğin yetişmiş bir çırak veya yardımcı yok.';}
 else if(id==='childhome'){if(s.age<60)return 'Yetişkin çocuğun yanında yaşama seçeneği 60 yaşında açılır.';if(!elderHostChildren()[index])return 'Aynı bölgede seni yanına alabilecek yeterince yakın bir yetişkin çocuğun yok.';}
 else if(id==='memories'){if(!elderCloseFamily().some(n=>n.age<s.age))return 'Hatıralarını aktarabileceğin daha genç bir yakın yok.';}
 else return 'Tecrübe çağı eylemi bulunamadı.';
 return '';
}
function recordElder(note,type='life',targetId=null){
 const e=ensureElderLife();e.lastActiveYear=s.year+s.age;e.history.unshift({year:s.year+s.age,age:s.age,month:currentMonth(),type,targetId,note:String(note)});e.history=e.history.slice(0,50);
}
function applyElderEffect(x={}){
 const e=ensureElderLife();
 for(const k of ['standing','purpose','careSupport'])if(x[k])e[k]=clamp(e[k]+x[k]);
 for(const k of ['councils','lessons','reconciliations','delegations','childHomeMoves','memoriesShared'])if(x[k])e[k]=Math.max(0,e[k]+x[k]);
 if(x.active!==false)e.lastActiveYear=s.year+s.age;
 if(x.note)recordElder(x.note,x.type||'event',s.pendingEventContext?.targetId||null);
 return e;
}
function elderAction(id,index=-1){
 const issue=elderActionIssue(id,index);if(issue){notice(issue);return false;}
 const reasons={council:'Yakınlarını bir araya getirip aile meselelerini konuştun.',mentor:'Bir gence tecrübeni aktarmaya bir ay ayırdın.',reconcile:'Eski bir husumeti kapatmak için görüşmeye gittin.',delegate:'Görevini bir sonraki kuşağa devretmekle uğraştın.',childhome:'Yetişkin çocuğunla yeni hane düzenini kurdun.',memories:'Aile geçmişini ve yaşadıklarını gençlere anlattın.'};
 return performAction({kind:'elder',id,index},()=>{
  const e=ensureElderLife(),q=ensureSuccession();
  if(id==='council'){
   const kin=elderCloseFamily().slice(0,8);for(const n of kin)adjustNPC(n,{rel:2,trust:2,respect:2},'Aile büyüğü olarak herkesi aynı mecliste dinledin.');
   q.familyHarmony=clamp(q.familyHarmony+6);e.councils++;e.standing=clamp(e.standing+3);e.purpose=clamp(e.purpose+5);recordElder('Yakınlarını aile meclisinde bir araya getirdin.','council');
  }else if(id==='mentor'){
   const n=elderMentorCandidates()[index];if(!n)return;const [key,level]=elderPrimarySkill();n.skills=n.skills||{};n.skills[key]=clamp((n.skills[key]||0)+Math.max(2,Math.floor(level/22)));n.skill=clamp((n.skill||30)+2);
   adjustNPC(n,{rel:3,trust:4,respect:7},skillName(key)+' alanındaki tecrübeni onunla paylaştın.');e.lessons++;if(!e.mentorIds.includes(n.id))e.mentorIds.push(n.id);e.standing=clamp(e.standing+2);e.purpose=clamp(e.purpose+6);recordElder(n.name+' ile '+skillName(key)+' tecrübeni paylaştın.','mentor',n.id);
  }else if(id==='reconcile'){
   const rivals=s.rivals.filter(n=>n?.alive),n=rivals[index];if(!n)return;normalizeBonds(n);
   const chance=Math.max(.18,Math.min(.92,.34+(s.skills.speech||0)/190+(s.prestige||0)/420+e.standing/380-(n.bonds.grudge||0)/360));
   if(Math.random()<chance){
    adjustNPC(n,{rel:16,trust:10,respect:3,grudge:-32},'İleri yaşında eski husumeti sürdürmek yerine barış elini uzattın.');
    e.reconciliations++;e.purpose=clamp(e.purpose+7);e.standing=clamp(e.standing+3);q.familyHarmony=clamp(q.familyHarmony+2);
    if((n.rel||0)>=50&&(n.bonds?.grudge||0)<=28){const ri=s.rivals.findIndex(x=>x.id===n.id);if(ri>=0)s.rivals.splice(ri,1);n.type='Eski Hasım / Dost';if(!s.friends.some(x=>x.id===n.id))s.friends.push(n);ensureFriendProfile(n);unlock('reconciled');}
    recordElder(n.name+' ile yıllardır süren husumeti yumuşattın.','reconcile',n.id);log(safeText(n.name)+' ile eski husumetiniz belirgin biçimde yatıştı.','good');
   }else{adjustNPC(n,{rel:-2,trust:-1,grudge:-4},'Barış görüşmesi sonuç vermedi ama eski öfke biraz azaldı.');e.purpose=clamp(e.purpose-1);recordElder(n.name+' ile barış görüşmesi sonuçsuz kaldı.','reconcile',n.id);log('Eski husumeti bu kez kapatamadın.');}
  }else if(id==='delegate'){
   const n=elderDelegateCandidates()[index];if(!n)return;const oldRole=s.role,cur=currentCareer();if(cur)cur.profile.history.push({year:s.year+s.age,retired:true,delegatedTo:n.id});adjustNPC(n,{rel:5,trust:7,respect:10},'Görevi kendi elinle ona devrettin.');
   n.role=oldRole;n.type='Görev Halefi';n.statusFlags=n.statusFlags||{};n.statusFlags.workplacePosition='successor';n.statusFlags.succeededPlayer=true;n.statusFlags.succeededRole=oldRole;n.prestige=clamp((n.prestige||0)+8);
   s.retiredRole=oldRole;if(s.workplace?.roleId)archiveWorkplace('görevi halefine devretme');s.role=null;e.delegations++;e.standing=clamp(e.standing+7);e.purpose=clamp(e.purpose+8);recordElder(oldRole+' görevini '+n.name+' adlı halefine devrettin.','delegate',n.id);apply({health:2,happiness:3,prestige:2});log(safeText(oldRole)+' görevini '+safeText(n.name)+' adlı halefine devrettin.','major');
  }else if(id==='childhome'){
   const n=elderHostChildren()[index];if(!n)return;const h=ensureHousing();h.mode='hosted_yurt';h.hostId=n.id;h.comfort=clamp(Math.max(h.comfort,62));h.pressure=0;h.monthsUnsheltered=0;e.hostChildId=n.id;e.childHomeMoves++;e.careSupport=clamp(e.careSupport+15);e.purpose=clamp(e.purpose+5);
   adjustNPC(n,{rel:5,trust:6,respect:3},'İleri yaşında aynı yurtta yaşamayı kabul ettiniz.');recordHousing(n.name+' adlı yetişkin çocuğunun yanında yaşamaya başladın.');recordElder(n.name+' adlı çocuğunun yanında yaşamaya başladın.','care',n.id);apply({happiness:5,health:1});log(safeText(n.name)+' seni kendi yurduna aldı.','major');
  }else if(id==='memories'){
   const young=elderCloseFamily().filter(n=>n.age<s.age).sort((a,b)=>a.age-b.age).slice(0,8);for(const n of young){adjustNPC(n,{rel:2,trust:2,respect:4},'Ailenin geçmişini ve kendi yaşadıklarını anlattın.');rememberNPC(n,'legacy',s.name+' aile geçmişinden ve eski günlerden söz etti.',5);}
   e.memoriesShared++;e.purpose=clamp(e.purpose+6);e.standing=clamp(e.standing+2);q.familyHarmony=clamp(q.familyHarmony+3);recordElder('Aile hatıralarını genç kuşağa aktardın.','memory');
  }
 },reasons[id]||'Tecrübe çağındaki yaşamına bir ay ayırdın.');
}
function elderYearTick(){
 if(s.age<50)return;const q=ensureSuccession(),e=ensureElderLife();e.years++;
 const heirs=livingHeirs();if(heirs.length){const avg=Math.round(heirs.reduce((a,n)=>a+(n.rel||0),0)/heirs.length);q.familyHarmony=clamp(q.familyHarmony+(avg>=72?1:avg<45?-2:0));if(!q.prepared&&s.age>=60&&(s.wealth>=40||s.assets.length>=2))q.familyHarmony=clamp(q.familyHarmony-1);}
 const care=elderCareScoreRaw();e.careSupport=clamp(Math.round((e.careSupport*2+care)/3));e.standing=clamp(Math.max(e.standing,Math.round((s.prestige||0)*.55)));
 const year=s.year+s.age;if(s.age>=60&&e.lastActiveYear!==(year-1)){e.purpose=clamp(e.purpose-(s.role?1:2));if(!elderCareSources().length)e.purpose=clamp(e.purpose-2);}
 const frailty=ensureHealthProfile().frailty;if(s.age>=60&&frailty>=60){if(e.careSupport>=68){apply({happiness:2,health:1});}else if(e.careSupport<35){apply({happiness:-2,health:-1});}}
 if(s.age>=65&&s.role&&frailty>=72&&Math.random()<.25)log('Yaş ilerledikçe ağır görevin yükü daha belirgin hissediliyor.','bad');
}
function deathCauseLabel(){
 const active=(s.ailments||[]).slice().sort((a,b)=>(b.severity||0)-(a.severity||0))[0],h=ensureHealthProfile();
 if(s.health<=0&&active)return AILMENTS[active.id]?.name||'ağır rahatsızlık';
 if(s.age>=75&&h.frailty>=65)return 'ileri yaş ve bedenin güçten düşmesi';
 if(h.scars.length&&s.health<25)return 'eski yaralar ve zayıflayan sağlık';
 if(s.age>=60)return 'yaşlılıkta sağlık kaybı';
 return s.health<20?'ağır sağlık kaybı':'ani yaşam sonu';
}
function elderLifeSummaryHtml(){
 if(s.age<50)return '';const e=ensureElderLife(),q=ensureSuccession(),mentors=elderMentorCandidates().slice(0,4),rivals=s.rivals.filter(n=>n?.alive).slice(0,3),delegates=elderDelegateCandidates().slice(0,3),hosts=elderHostChildren().slice(0,3);
 const active=s.role?'Aktif görev: '+safeText(s.role):(s.retiredRole?'Eski görev: '+safeText(s.retiredRole):'Ağır görev taşımıyor');
 let html='<h3 class="sectionTitle">Tecrübe Çağı</h3><div class="card"><h3>🧓 Aile Büyüğü ve Yaşam Amacı</h3><p>'+active+'<br>Söz ağırlığı '+e.standing+'/100 • yaşam amacı '+e.purpose+'/100 • aile desteği '+e.careSupport+'/100<br>'+e.councils+' aile meclisi • '+e.lessons+' tecrübe aktarımı • '+e.reconciliations+' barışma • '+e.delegations+' görev devri</p><div class="memoryline">Aile uyumu '+q.familyHarmony+'/100'+(e.history[0]?.note?' • Son iz: '+safeText(e.history[0].note):'')+'</div></div><div class="grid2">'+
  actionButton('Aile meclisi topla',{kind:'elder',id:'council'},"elderAction('council')",'Yakınlarını dinle; aile uyumu ve söz ağırlığını güçlendir.')+
  actionButton('Hatıraları gençlere aktar',{kind:'elder',id:'memories'},"elderAction('memories')",'Aile hafızasını, yakınlığı ve yaşam amacını güçlendir.')+
 '</div>';
 if(mentors.length)html+='<h3 class="sectionTitle">Tecrübe Aktar</h3><div class="grid2">'+mentors.map((n,i)=>actionButton(safeText(n.name)+' ile çalış',{kind:'elder',id:'mentor',index:i},"elderAction('mentor',"+i+")",'En güçlü becerinden pay alır; güven ve saygısı gelişir.')).join('')+'</div>';
 if(rivals.length)html+='<h3 class="sectionTitle">Eski Defterler</h3><div class="grid2">'+rivals.map((n,i)=>actionButton(safeText(n.name)+' ile barışmayı dene',{kind:'elder',id:'reconcile',index:i},"elderAction('reconcile',"+i+")",'Hitabet, itibar, söz ağırlığı ve karşı tarafın kini sonucu etkiler.')).join('')+'</div>';
 if(delegates.length)html+='<h3 class="sectionTitle">Görevi Devret</h3><div class="grid2">'+delegates.map((n,i)=>actionButton(safeText(n.name)+' halefin olsun',{kind:'elder',id:'delegate',index:i},"elderAction('delegate',"+i+")",'Aktif görevini bu çırak/yardımcıya devredip ağır görevi bırakırsın.')).join('')+'</div>';
 if(s.age>=60&&hosts.length)html+='<h3 class="sectionTitle">İleri Yaşta Hane</h3><div class="grid2">'+hosts.map((n,i)=>actionButton(safeText(n.name)+' yanında yaşa',{kind:'elder',id:'childhome',index:i},"elderAction('childhome',"+i+")",'Yetişkin çocuğunla aynı yurtta yaşar, aile desteğini güçlendirirsin.')).join('')+'</div>';
 return html;
}
function successionSummaryHtml(){
 const q=ensureSuccession();if(s.age<45&&!q.prepared)return '';
 const heirs=livingHeirs(),wish=q.lastWish?'<br>Son dilek: '+safeText(q.lastWish):'';
 return '<h3 class="sectionTitle">Vasiyet ve Soy Devri</h3><div class="card"><h3>🪶 '+successionModeText()+'</h3><p>Aile uyumu '+q.familyHarmony+' • '+(q.prepared?'Vasiyet konuşuldu':'Henüz aile meclisi yapılmadı')+' • '+heirs.length+' yaşayan çocuk'+wish+'</p></div>';
}

function physicalHealthIssue(a){
 const serious=s.ailments.find(x=>AILMENTS[x.id]?.kind==='injury'&&(x.severity||1)>=3);
 if(serious&&(['activity','training','military','desert'].includes(a.kind)))return AILMENTS[serious.id].name+' iyileşmeden ağır eylem yapamazsın.';
 const caps=healthCapabilities();
 if(ensureHealthProfile().frailty>=75&&a.kind==='training'&&['wrestling','archery'].includes(a.id))return 'Yaş ve eski yaraların bu ağır talimi artık çok zorluyor.';
 if(a.kind==='training'&&a.id==='wrestling'&&(caps.mobility<38||caps.upper<38))return 'Bu talim mevcut hareket ve kol işlevine fazla yük bindiriyor; daha uygun bir çalışma seç.';
 if((a.kind==='activity'&&a.id==='av'||a.kind==='period'&&a.id==='summer_hunt')&&(caps.mobility<34||caps.vision<34))return 'Bu av mevcut hareket veya görme kapasitesi için güvenli değil.';
 if((a.kind==='activity'&&a.id==='ok'||a.kind==='training'&&a.id==='archery')&&(caps.upper<32||caps.vision<30))return 'Okçuluk için kol/el ve görme kapasitesi şu anda çok sınırlı.';
 if(a.kind==='military'){const issue=longTermMilitaryIssue();if(issue)return issue;}
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
 if(r.path==='military'){const issue=longTermMilitaryIssue();if(issue)return issue;}
 if(s.exile&&['state','military'].includes(r.path))return 'Önce sürgün meselesini çözmelisin';return '';
}
function careerRequirements(r){const a=CAREER_RULES[r.id];return `${a.age} yaş • genel beceri ${Math.max(0,r.skill-10)} • ${Object.entries(a.skills).map(([k,v])=>skillName(k)+' '+v).join(' • ')}${a.months?' • '+a.months+' ay '+pathName(a.track):''}${a.prestige?' • itibar '+a.prestige:''}${a.campaigns?' • '+a.campaigns+' sefer':''}${r.id==='bey'?' • meclis nüfuzu 20 • meclis güveni 30':''}`;}
function getFamilyGroup(group){if(group==='partner')return s.partner?[s.partner]:[];if(group==='workplaceContacts')return currentWorkplaceContacts();if(group==='guardianContacts')return ensureGuardianship().contacts;if(group==='exPartners')return s.exPartners||[];if(group==='extendedFamily')return extendedFamilyVisible();if(group==='inLaws')return ensureExtendedFamily().inLaws;if(group==='justiceContacts')return ensureJustice().contacts;if(group==='comrades')return s.military?.comrades||[];if(group==='careerContacts')return s.careerContacts||[];if(group==='educationContacts')return ensureEducation().contacts;if(group==='captivityContacts')return ensureDisplacement().captivity.contacts;if(group==='exileContacts')return ensureDisplacement().exile.contacts;return ['parents','siblings','relatives','friends','rivals','children'].includes(group)?(s[group]||[]):[];}
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
 else if(a.kind==='romance'){min=16;if(!s.partner?.alive)return 'Yaşayan eş adayı veya eş gerekiyor.';const lifeIssue=npcNormalInteractionIssue(s.partner);if(lifeIssue)return lifeIssue;if(!['time','future','family','work','repair','reassure'].includes(a.id))return 'İlişki eylemi bulunamadı.';}
 else if(a.kind==='breakup'){min=16;if(!s.partner?.alive)return 'Sona erdirilecek ilişki yok.';}
 else if(a.kind==='separation'){min=18;const issue=separationIssue(a.mode);if(issue)return issue;}
 else if(a.kind==='reconcileEx'){min=16;if(s.partner?.alive)return 'Önce mevcut ilişkinin durumunu çöz.';if(!s.exPartners?.[a.index]?.alive)return 'Bu eski ilişkiyle görüşemezsin.';}
 else if(a.kind==='period'){const r=PERIOD_ACTIVITIES.find(x=>x.id===a.id)||SEASONAL_ACTIVITIES.find(x=>x.id===a.id);if(!r)return 'Faaliyet bulunamadı.';min=r.age;if(r.months&&!r.months.includes(currentMonth()))return 'Bu faaliyet bu mevsimde yapılır.';if(r.req&&!r.req())return 'Bu faaliyet için uygun şartlar oluşmadı.';if(a.id==='healer'&&s.wealth<2)return '2 servet gerekiyor.';}
 else if(a.kind==='role')return careerIssue(D.careers.find(x=>x.id===a.id));
 else if(a.kind==='stateCouncil'){
  min=18;
  if(a.id==='open'){const issue=stateOpenProposalIssue(a.proposalId);if(issue)return issue;}
  else if(a.id==='lobby'){const issue=stateLobbyIssue(a.npcId);if(issue)return issue;}
  else if(a.id==='vote'){const issue=stateVoteIssue();if(issue)return issue;}
  else return 'Meclis eylemi bulunamadı.';
 }
 else if(a.kind==='workshop'){min=18;const issue=workshopIssue(a.id,a.targetId,a.extra);if(issue)return issue;}
  else if(a.kind==='caravanTrade'){min=18;const issue=caravanIssue(a.id,a.goodId,a.extra);if(issue)return issue;}
  else if(a.kind==='caravanNetwork'){min=18;const issue=caravanNetworkIssue(a.id,a.targetId);if(issue)return issue;}
  else if(a.kind==='caravanWholesale'){min=18;const issue=caravanWholesaleIssue(a.id);if(issue)return issue;}
  else if(a.kind==='caravanContract'){min=18;const issue=caravanContractIssue(a.id,a.offerId);if(issue)return issue;}
 else if(a.kind==='toyContest'){min=12;const issue=toyIssue(a.id,a.contestType);if(issue)return issue;}
 else if(a.kind==='horseStable'){min=12;const issue=horseActionIssue(a.id,a.horseId,a.other);if(issue)return issue;}
 else if(a.kind==='asset'){
  const r=D.assets.find(x=>x.id===a.id);if(!r)return 'Varlık bulunamadı.';min=ASSET_AGES[a.id]||18;
  if(a.sell&&!s.assets.includes(a.id))return 'Bu varlık sende yok.';
  if(a.sell&&creditPledgeInUse(a.id))return 'Bu varlık emanet için rehinli; önce borcunu kapat.';
  if(a.sell&&a.id==='smithy'&&!workshopCanSellSmithy())return 'Atölyenin açık siparişlerini tamamla ve çırağını serbest bırak.';
   if(a.sell&&a.id==='caravan_share'&&(ensureCaravanTrade().stage!=='home'||ensureCaravanTrade().cargo.length||ensureCaravanTrade().contracts.active))return 'Önce kervanı geri getir ve kalan yükü sat veya tüket.';
  if(a.sell&&a.id==='yurt'&&ensureHousing().mode==='own_yurt')return 'Yaşadığın yurdu satmadan önce başka barınma düzenine geçmelisin.';
  if(!a.sell&&s.assets.includes(a.id))return 'Zaten sahipsin.';
  if(!a.sell&&s.wealth<assetBuyPrice(a.id))return `${assetBuyPrice(a.id)} servet gerekiyor.`;
  if(!a.sell&&a.id==='smithy'&&(s.skills.craft<40||(s.experience.craft||0)<12))return 'Zanaat 40 ve 12 ay zanaat tecrübesi gerekiyor.';
  }else if(a.kind==='credit'){min=18;const issue=creditIssue(a.id,a.contractId,a.extra);if(issue)return issue;}
 else if(a.kind==='maintenance'){min=18;if(!s.assets.includes(a.id))return 'Bu varlık sende yok.';if(s.wealth<maintenanceCost(a.id))return `${maintenanceCost(a.id)} servet bakım gideri gerekiyor.`;
 }else if(a.kind==='npc'){
  if(!['spend','gift','advice','reconcile','confide','help','work'].includes(a.id))return 'Etkileşim bulunamadı.';
  min=a.id==='gift'||a.id==='help'||a.id==='work'?10:a.id==='confide'?8:a.id==='advice'?6:5;const n=getFamilyGroup(a.group)[a.index];if(!n?.alive)return 'Bu kişiyle görüşemezsin.';const lifeIssue=npcNormalInteractionIssue(n);if(lifeIssue)return lifeIssue;
  if(a.id==='gift'&&s.wealth<3)return '3 servet gerekiyor.';
  if(a.id==='help'&&s.wealth<2)return 'Yardım için 2 servet gerekiyor.';
  if(a.id==='confide'&&(n.bonds?.trust??0)<25)return 'Önce aranızda biraz güven oluşmalı.';
  if(a.id==='advice'&&(n.age<16||n.age<=s.age))return 'Senden büyük, en az 16 yaşında birini seç.';
  if(a.id==='reconcile'&&a.group!=='rivals')return 'Bir rakip seç.';
 }else if(a.kind==='npcAspiration'){min=12;const issue=npcAspirationActionIssue(npcById(a.npcId),a.id);if(issue)return issue;}
 else if(a.kind==='npcLife'){const n=npcById(a.npcId);const issue=npcLifeActionIssue(n,a.id);if(issue)return issue;min=5;
 }else if(a.kind==='grief'){const issue=bereavementActionIssue(a.lossId,a.id);if(issue)return issue;min=5;
 }else if(a.kind==='inheritanceDispute'){const issue=inheritanceDisputeIssue(a.caseId,a.id);if(issue)return issue;min=12;
 }else if(a.kind==='reputation'){const issue=reputationActionIssue(a.rumorId,a.id);if(issue)return issue;min=10;
 }else if(a.kind==='adultChild'){const issue=adultChildActionIssue(a.childId,a.id,a.extra??null);if(issue)return issue;min=18;
 }else if(a.kind==='grandchild'){const issue=grandchildActionIssue(a.grandId,a.id);if(issue)return issue;min=18;
 }else if(a.kind==='health'){min=5;if(!['rest','healer'].includes(a.id))return 'Bakım bulunamadı.';if(a.id==='healer'&&s.wealth<2)return '2 servet gerekiyor; dinlenebilirsin.';}
 else if(a.kind==='healthAdapt'){min=5;const issue=healthAdaptationIssue(a.id);if(issue)return issue;}
 else if(a.kind==='guardian'){if(s.age>=5)return 'Bu bakım dönemi sona erdi.';}
 else if(a.kind==='friend')min=6;
 else if(a.kind==='rival')min=10;
 else if(a.kind==='meet'){min=16;if(s.partner?.alive)return 'Zaten görüştüğün biri var.';}
 else if(a.kind==='marry'){min=18;if(!s.partner?.alive||s.married)return 'Yaşayan eş adayı gerekiyor.';if(s.partner.age<18)return 'İkiniz de 18 yaşında olmalısınız.';if(s.partner.rel<65)return 'İlişkiniz en az 65 olmalı.';}
 else if(a.kind==='crime'){min=18;if(!D.crimes.some(x=>x.id===a.id))return 'Eylem bulunamadı.';if(openJusticeCase())return 'Önce açık töre meselesini çözmelisin.';}
 else if(a.kind==='workplace'){if(!s.role)return 'Aktif görevin yok.';const n=currentWorkplaceContacts()[a.index];if(!n?.alive)return 'Bu görev kişisiyle görüşemezsin.';const lifeIssue=npcNormalInteractionIssue(n);if(lifeIssue)return lifeIssue;if(!['collaborate','advice','sponsor','compete','befriend','mentor','mediate'].includes(a.id))return 'Görev çevresi eylemi bulunamadı.';const pos=n.statusFlags?.workplacePosition;if(a.id==='advice'&&pos!=='supervisor')return 'Öğüt için usta veya amir gerekir.';if(a.id==='sponsor'&&pos!=='supervisor')return 'Kefillik için usta veya amir gerekir.';if(a.id==='compete'&&pos!=='peer')return 'Görev rekabeti akranlarla olur.';if(a.id==='mentor'&&pos!=='junior')return 'Bu kişi çırak veya yardımcı değil.';}
 else if(a.kind==='friendship'){min=6;const n=s.friends[a.index];if(!n?.alive)return 'Bu dostla görüşemezsin.';const lifeIssue=npcNormalInteractionIssue(n);if(lifeIssue)return lifeIssue;if(!['deepen','confidant','reconnect','referral','matchmake','comrade'].includes(a.id))return 'Dostluk eylemi bulunamadı.';if(a.id==='confidant'&&(n.rel<72||(n.bonds?.trust||0)<72))return 'Sırdaşlık için ilişki ve güven 72 gerekiyor.';if(a.id==='matchmake'&&(s.partner?.alive||s.age<16))return 'Şu anda eş adayı tanıştırmasına uygun değilsin.';if(a.id==='comrade'&&(s.age<18||!['Alp','Akıncı','Tarkan'].includes(n.role)))return 'Bu dost şu an sefer yoldaşı olmaya uygun değil.';}
 else if(a.kind==='friendCircle'){min=8;const g=ensureSocialLife().groups.find(x=>x.id===a.groupId);if(!g)return 'Dost çevresi bulunamadı.';if(!['gather','mediate'].includes(a.id))return 'Dost çevresi eylemi bulunamadı.';}
 else if(a.kind==='guardianship'){if(s.age>=18||!ensureGuardianship().active||!currentGuardian()?.alive)return 'Aktif bir koruyuculuk düzenin yok.';if(!['time','help','learn','remember','visitSibling','change'].includes(a.id))return 'Koruyuculuk eylemi bulunamadı.';if(a.id==='visitSibling'&&!s.siblings.some(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)))return 'Ayrı yaşayan kardeşin yok.';}
 else if(a.kind==='parenting'){min=18;const c=s.children[a.index];if(!c?.alive||c.age>=18)return 'Bu çocuk için aktif yetiştirme dönemi sona ermiş.';if(a.id==='guide'&&!PARENTING_PATHS[a.path])return 'Yetişme yolu bulunamadı.';if(!['care','teach','listen','discipline','guide','mediate'].includes(a.id))return 'Ebeveynlik eylemi bulunamadı.';}
 else if(a.kind==='childTraining'){min=18;const issue=childTrainingActionIssue(a.index,a.id,a.track);if(issue)return issue;}
 else if(a.kind==='extendedFamily'){min=5;if(a.id==='reunion'){if(familyReunionGuests().length<2)return 'Aynı bölgede buluşacak yeterli yakın yok.';}else{const n=extendedFamilyVisible()[a.index];if(!n?.alive)return 'Bu akrabayla etkileşemezsin.';const lifeIssue=npcNormalInteractionIssue(n);if(lifeIssue)return lifeIssue;if(a.id==='support'&&s.wealth<3)return '3 servet gerekiyor.';if(!['support','ask_help'].includes(a.id))return 'Geniş aile eylemi bulunamadı.';}}
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
 else if(a.kind==='elder'){const issue=elderActionIssue(a.id,a.index??-1);if(issue)return issue;min=50;}
 else if(a.kind==='retire'){min=50;if(!s.role)return 'Bırakılacak görev yok.';}
 else if(a.kind==='will'){min=18;if(!s.children.some(x=>x.alive))return 'Yaşayan çocuğun yok.';}
 else if(a.kind==='familyConflict'){min=10;const issue=familyConflictActionIssue(a.id,a.mode);if(issue)return issue;}
 else if(a.kind==='lifePurpose'){min=16;const issue=lifePurposeIssue(a.id,a.goal);if(issue)return issue;}
 else if(a.kind==='venture'){min=18;if(a.id==='caravan')return 'Kervan yönetimi artık Kervan Ticareti bölümünden yapılır.';const asset={herd:'flock',forge:'smithy',caravan:'caravan_share'}[a.id];if(!asset||!s.assets.includes(asset))return 'Önce ilgili varlığı edinmelisin.';if(assetState(asset).condition<20)return 'Önce bu varlığın bakımını yapmalısın.';}
 else if(a.kind!=='wait')return 'Eylem bulunamadı.';
 return s.age<min?`${min} yaşında açılır.`:'';
}
function canSpendMonth(){if(!s?.alive)return false;if(s.pendingEventId||s.pendingDecision){notice('Önce karar kartını çöz.');return false;}if(s.monthsRemaining<=0){notice('Bu yıl için eylem hakkın kalmadı. 1 Yıl Geçir ile devam et.');return false;}return true;}
function performAction(a,work,reason){const issue=accessIssue(a);if(issue){notice(issue);return false;}$('gameNotice').textContent='';s.lastAction={...a,age:s.age,year:s.year+s.age,month:currentMonth()};work();s.wealth=Math.max(0,Math.round(s.wealth));return spendMonth(reason,a);}
function spendMonth(reason='',action={kind:'wait'}){
 if(!canSpendMonth())return false;const month=currentMonth();s.monthsRemaining--;if(reason)log(`<b>${month}. Ay:</b> ${reason}`);monthlyTick(month,action);if(s.alive){trackLifeVarietyAction(action);trackLifePurposeAction(action);}
 if(s.alive&&s.monthsRemaining===0)log('Bu yılın 12 eylem hakkını kullandın. Hazır olduğunda yeni yıla geçebilirsin.','major');render();save();return true;
}
function addExperience(path){if(path)s.experience[path]=(s.experience[path]||0)+1;}
function checkAchievements(){if(s.age>=18)unlock('adult');if(s.age>=65)unlock('old');if(s.wealth>=100)unlock('rich');if(Object.values(s.skills).some(x=>x>=60))unlock('trained');}
function canHaveChild(){if(!s.married||!s.partner?.alive||npcLifeBlocksNormalInteraction(s.partner)||s.age<18||s.partner.age<18||s.captive||s.military.active||s.pregnancy)return false;return (s.gender==='female'?s.age:s.partner.age)<45&&s.health>=35&&s.partner.health>=35;}
function monthlyTick(month,action,allowEvent=true){
 tickEventCooldowns();
 for(const n of allNPCs())if(n.alive&&n.birthYear!=null){const before=n.age;n.age=Math.max(0,s.year+s.age-n.birthYear-(month<n.birthMonth?1:0));if(before!==n.age&&[8,12,18].includes(n.age))n.role=npcRole(n.age);}
 if(s.military.active){addExperience('military');s.military.dutyMonths--;if(s.military.dutyMonths<=0)campaignResult();}
 tickHealthMonth(month);tickDisplacementMonth(month,action);tickMobilityMonth();tickAppearanceMonth(action);tickRomanceMonth(action);tickJusticeMonth(action);tickHousingMonth(month,action);tickParentingMonth(action);tickGuardianshipMonth(action);tickFriendshipMonth(action);tickWorkplaceMonth(action);horseMonthTick(month);bereavementMonthTick(month,action);tickCommunityReputationMonth(month);
 if(s.role&&!s.captive&&!s.military.active){const r=D.careers.find(x=>x.name===s.role);if(r){addExperience(r.path);s.careerMonths[r.id]=(s.careerMonths[r.id]||0)+1;if(month%3===0){const stipend=Math.max(1,Math.round(((r.wealth?.[0]||1)+(r.wealth?.[1]||3))/5*careerDemandMultiplier(r.path)));apply({wealth:stipend});economyLedger('income',stipend,r.name+' dönem payı');}}}
 if(s.age>=18&&month%3===0)tickEconomyQuarter(month);if(month%3===0)horseQuarterTick();creditMonthTick(month);toyMonthTick(month);workshopMonthTick(month);caravanMonthTick();caravanRivalCycle(month);caravanMarketQuarterTick(month);caravanContractMonthTick();
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
 const p=careerProfile(id),fit=Math.max(.08,Math.min(.96,.48+(s.skill-r.skill)/100+s.prestige/300+p.reputation/500+p.mastery/600+educationFitBonusForCareer(r)+friendCareerReferralBonus(r)+communityCareerBonus(r)));
 if(Math.random()<fit){
  const old=s.role;if(old&&old!==r.name&&s.workplace?.roleId)archiveWorkplace('yeni göreve geçiş');s.role=r.name;s.path=r.path;p.lastYear=s.year+s.age;apply({prestige:r.prestige});p.history.push({year:s.year+s.age,entry:true,from:old||''});
  if(['smith','smith_apprentice'].includes(id))careerContact('smith');
  if(['scribe','envoy','bey'].includes(id))careerContact('scribe');if(['envoy','bey'].includes(id))ensureStateCircle();
  if(['merchant','caravan'].includes(id))careerContact(id==='merchant'?'merchant':'caravan');
  if(id==='bard')careerContact('bard');ensureWorkplaceForRole(true);
  log(r.name+' görevini üstlendin.'+(s.age<18?' Büyüklerin gözetiminde yetişeceksin.':''),'good');if(id==='bey')unlock('bey');
 }else{p.failures++;p.reputation=clamp(p.reputation-1);log('Bu kez '+r.name+' görevi için kabul edilmedin.');}
},'Görev görüşmeleriyle bir ay geçti.');}
function workRole(){performAction({kind:'work'},()=>{
 const r=D.careers.find(x=>x.name===s.role);if(!r)return;const result=careerWorkOutcome(r);
 if(result.success){if(r.path==='state')adjustStateCourt({influence:1,trust:1,support:r.id==='bey'?1:0,rival:r.id==='bey'?-1:0},r.name+' görevinde düzenli hizmet verdin.');log(safeText(r.name)+' görevinde verimli bir ay geçirdin; '+result.gain+' servet kazandın.','good');}
 else{if(r.path==='state')adjustStateCourt({trust:-1,rival:1},r.name+' görevinde aksayan bir ay geçirdin.');log(safeText(r.name)+' görevinde bu ay işler istediğin gibi gitmedi.');}
},'Görevin üzerinde çalıştın.');}
function retireRole(){performAction({kind:'retire'},()=>{const cur=currentCareer();if(cur){cur.profile.history.push({year:s.year+s.age,retired:true});s.retiredRole=s.role;}if(s.workplace?.roleId)archiveWorkplace('görevi bırakma');s.role=null;apply({health:2,happiness:2});},'Ağır görevini bıraktın.');}
function buyAsset(id){performAction({kind:'asset',id},()=>{const price=assetBuyPrice(id);s.wealth-=price;s.assets.push(id);ensureEconomy();assetState(id).condition=88;economyLedger('purchase',-price,id+' alımı');if(id==='horse'){const stable=ensureHorseStable();if(!stable.horses.length)stable.horses.push(createHorse());}if(id==='yurt'){const h=ensureHousing();h.ownCapacity=4+h.expansions*2;recordHousing('Kendi yurdunu kurmaya uygun bir yurt edindin.');}apply({happiness:3});},'Alım ve takasla bir ay geçti.');}
function sellAsset(id){if(id==='horse'){const h=horses()[0];return h?horseAction('sell',h.id):false;}performAction({kind:'asset',id,sell:true},()=>{const value=assetSaleValue(id);s.assets=s.assets.filter(x=>x!==id);s.wealth+=value;delete ensureEconomy().assetState[id];if(id==='smithy'){const w=ensureWorkshop();w.materials={iron:0,charcoal:0,leather:0};w.items=[];w.clients=[];}if(id==='caravan_share')s.caravanTrade=null;economyLedger('sale',value,id+' satışı');},'Varlığını takas ettin.');}
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
  const n=getFamilyGroup(group)[index];if(!n)return;normalizeNPC(n,n.type);n.lastInteractionYear=s.year+s.age;if(group==='friends')friendInteractionStamp(n,id==='confide'?'secret':id);const remote=(n.place&&n.place!==s.place)||(n.realm&&n.realm!==s.realm);
  const has=t=>(n.traits||[]).includes(t);
  if(id==='spend'){adjustNPC(n,{rel:has('sakin')?7:6,trust:4,respect:1},'Birlikte sakin bir zaman geçirdiniz.');apply({happiness:2});}
  if(id==='confide'){
   const risk=has('kuskucu')?.18:.05;
   if(Math.random()<risk){adjustNPC(n,{rel:-4,trust:-5,grudge:has('kinci')?4:1},'Paylaştığın bir söz aranızda huzursuzluk yarattı.');apply({prestige:-1});}
   else adjustNPC(n,{rel:6,trust:has('sadik')?9:7},'Bir sırrını ona emanet ettin.');
  }
  if(id==='help'){s.wealth-=2;adjustNPC(n,{rel:8,trust:has('merhametli')?12:9,respect:5,grudge:-3},'Zor bir işinde ona destek oldun.');recordPublicWord('generosity',n.name+' zor zamanında ona el uzattığını çevresine anlattı.',{generosity:3,honor:1},{severity:14,polarity:1,sourceId:n.id,knownIds:[n.id]});}
  if(id==='work'){adjustNPC(n,{rel:4,respect:has('caliskan')?9:6,trust:2},'Bir işi omuz omuza tamamladınız.');apply({skill:1});}
  if(id==='gift'){s.wealth-=3;adjustNPC(n,{rel:has('tutumlu')?7:10,trust:has('comert')?7:4,respect:3,grudge:-2},'Ona bir armağan verdin.');if(Math.random()<.55)recordPublicWord('generosity',n.name+' ona verdiğin armağanı çevresine anlattı.',{generosity:2},{severity:10,polarity:1,sourceId:n.id,knownIds:[n.id]});}
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
  if(kind==='friend'){n.realm=s.realm;n.place=s.place;n.tribe=s.tribe;adjustNPC(n,{trust:10,respect:4},'Tanışmanız kısa sürede dostluğa dönüştü.');s.friends.push(n);ensureFriendProfile(n);autoCreateFriendCircle();}
  else{adjustNPC(n,{grudge:25,trust:-15},'Aranızdaki ilk anlaşmazlık düşmanlığa dönüştü.');s.rivals.push(n);}
 },kind==='friend'?'Yeni bir dostluk için çevrene zaman ayırdın.':'Bir anlaşmazlık yeni bir rakip doğurdu.');
}
function addFriend(){addSocial('friend');}
function makeRival(){addSocial('rival');}
function meetPartner(){performAction({kind:'meet'},()=>{const g=s.gender==='male'?'female':'male';s.partner=normalizeNPC({name:pick(D.realms[s.realm][g]),gender:g,age:s.age<18?s.age:Math.max(18,s.age+rng(-4,4)),alive:true,rel:rng(52,68),type:'Eş adayı',realm:s.realm,place:s.place,tribe:pick(D.realms[s.realm].tribes)});adjustNPC(s.partner,{trust:5,respect:4},'Ailelerin aracılığıyla ilk kez uzun uzun görüştünüz.');s.married=false;const r=ensureRomance();r.current=null;ensureRomance();ensurePartnerFamily(true);log(safeText(s.partner.name)+' ile ailelerin aracılığıyla tanıştın; onun ailesiyle de bağ kurma yolu açıldı.');},'Aileler arası görüşmelere bir eylem hakkı ayırdın.');}
function marry(){performAction({kind:'marry'},()=>{
 const n=s.partner;normalizeNPC(n,n.type);const b=normalizeBonds(n),rp=currentRomance(),familyMind=(n.goal==='family'?0.08:0),proud=n.traits.includes('gururlu')?(s.prestige>=n.prestige?0.06:-0.08):0;
 const chance=Math.max(.15,Math.min(.97,.26+n.rel/300+b.trust/350-b.grudge/240+familyMind+proud+(rp?.commitment||0)/350+(rp?.harmony||0)/500+(rp?.familyApproval||0)/650-(rp?.tension||0)/350+(rp?.compatibility||0)/800+communityMarriageBonus(n)));
 if(Math.random()<chance){s.married=true;n.type='Eş';const rp=ensureRomance().current;if(rp){rp.stage='married';rp.commitment=clamp(rp.commitment+12);rp.harmony=clamp(rp.harmony+5);rp.tension=clamp(rp.tension-5);rememberRomance('Birlikte ocak kurdunuz.',8);}adjustNPC(n,{rel:8,trust:10,respect:5,grudge:-8},'Birlikte ocak kurmaya söz verdiniz.');unlock('family');apply({prestige:3});log(safeText(n.name)+' ile ocak kurdun.','good');}
 else{adjustNPC(n,{rel:-4,trust:-3,grudge:n.traits.includes('kinci')?5:2},'Ocak kurma görüşmesi sonuçsuz kaldı.');log('Bu kez ocak kurma konusunda uzlaşamadınız.');}
},'Ocak kurma görüşmelerine bir eylem hakkı ayırdın.');}
function militaryCall(){if(s.age<18||s.captive||s.exile||s.military.called||s.military.active||s.pendingEventId||s.pendingDecision)return;s.military.called=true;s.pendingDecision={id:'campaign_call',age:s.age,year:s.year+s.age,month:currentMonth()};activateLifeTab();renderEventBoard();save();}
function chooseDecision(i){if(!s?.alive||s.pendingDecision?.id!=='campaign_call'||![0,1].includes(i)||s.age<18)return;if(i===0&&(s.health<40||s.captive||s.exile)){notice('Özgürlük ve en az 40 sağlık gerekiyor.');return;}if(i===0){const longIssue=longTermMilitaryIssue();if(longIssue){notice(longIssue);return;}s.military.served=true;s.military.active=true;s.military.dutyMonths=rng(4,8);s.military.campaigns++;generateComrades();s.path='military';apply({prestige:4});unlock('military');log('Sefer birliğine katıldın.','major');}else{s.flags.military_declined=true;log('Bu çağrıda obada kaldın.');}s.pendingDecision=null;render();save();}
function militaryTrain(id){performAction({kind:'military',id},()=>{skillGain({horse:'riding',bow:'archery',drill:'combat',watch:'combat'}[id],3);apply({skill:1,prestige:1});},'Birlik talimine bir ay ayırdın.');}
function desertCampaign(){performAction({kind:'desert'},()=>{s.military.active=false;s.military.dutyMonths=0;apply({prestige:-18,happiness:-4});recordPublicWord('military','Birliği izinsiz terk ettiğin savaşçılar arasında konuşuluyor.',{honor:-7,reliability:-8,fear:1},{severity:42,polarity:-1,truth:true,knownIds:s.military.comrades.filter(n=>n.alive).map(n=>n.id),sourceId:s.military.comrades.find(n=>n.alive)?.id||null});if(Math.random()<.35)enterExile('birliği izinsiz terk etme');log('Birliği izinsiz terk ettin.','bad');},'Ayrılmanın sonuçlarıyla bir ay geçti.');}
function campaignResult(){s.military.active=false;s.military.dutyMonths=0;const roll=Math.random(),safe=stateCampaignSafetyBonus(),capture=Math.max(.04,.12-safe*.5),wound=Math.max(.18,.32-safe);if(roll<capture){enterCaptivity('seferde esir düşme');resolveComradeCampaignOutcome('captured');log('Seferde tutsak düştün.','bad');}else if(roll<wound){s.military.wounds++;resolveComradeCampaignOutcome('wounded');apply({health:-rng(8,18),prestige:4});acquireAilment('deep_wound',{severity:2,duration:6,source:'battle'});if(Math.random()<.55)addScar('battle',1,'battle');recordPublicWord('military','Seferde yaralanmana rağmen birliği bırakmadığın anlatılıyor.',{honor:2,reliability:2},{severity:14,polarity:1,truth:true,knownIds:s.military.comrades.filter(n=>n.alive).map(n=>n.id)});}else{resolveComradeCampaignOutcome('success');apply({wealth:rng(4,12)+(safe?2:0),prestige:rng(4,8)});s.flags.recent_campaign=true;recordPublicWord('military','Seferden görevini tamamlayarak döndüğün yoldaşlar arasında anlatılıyor.',{honor:4,reliability:4},{severity:22,polarity:1,truth:true,knownIds:s.military.comrades.filter(n=>n.alive).map(n=>n.id)});log('Seferden ganimet ve tecrübeyle döndün.'+(safe?' Meclisin hazırlık düzeni kayıpları azalttı.':''),'good');}}
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
  if(rec.status==='summoned'||witnesses.length){
   const severity=Math.max(18,Math.min(70,Math.round(profile.severity*.72+witnesses.length*5)));
   recordPublicWord('crime',c.name+' meselesinde adının geçtiği oba içinde konuşulmaya başladı.',{honor:-Math.max(2,Math.round(profile.severity/18)),reliability:-Math.max(1,Math.round(profile.severity/25)),fear:Math.max(1,Math.round(profile.severity/28))},{severity,polarity:-1,truth:true,sourceId:witnesses[0]?.id||victim.id,knownIds:[victim.id,...witnesses.map(n=>n.id)],caseId:rec.id});
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
  normalizeBonds(n);npcWorldYearTick(n,year);if(isAdultPlayerChild(n)){ensureAdultChildProfile(n);if(n.partner)syncAdultChildPartner(n);}
  const away=n.lastInteractionYear==null?0:year-n.lastInteractionYear;
  if(away>=3&&!['Ana','Ata','Çocuk'].includes(n.type)){n.rel=clamp(n.rel-(n.traits.includes('sadik')?0:1));n.bonds.trust=clamp(n.bonds.trust-1);}
  const grudgeDrop=n.traits.includes('bagislayici')?4:n.traits.includes('kinci')?0:2;n.bonds.grudge=clamp(n.bonds.grudge-grudgeDrop);
  if(n.bonds.grudge>55)n.rel=clamp(n.rel-2);if(n.bonds.trust>78&&n.rel<75)n.rel=clamp(n.rel+1);
  if(!npcLifeBlocksNormalInteraction(n)){if(n.goal==='wealth')n.wealth+=rng(0,3);if(n.goal==='prestige')n.prestige=clamp(n.prestige+rng(0,2));if(n.goal==='mastery')n.skills.mastery=clamp((n.skills.mastery||0)+rng(1,3));}npcEstateYearTick(n);
  if(n.age>=18&&!npcLifeBlocksNormalInteraction(n)&&!n.statusFlags?.familyMatchedTo&&!n.aspiration?.protectedRole&&!n.statusFlags?.workshopGraduate&&s.workshop?.apprenticeId!==n.id&&Math.random()<(n.traits.includes('hirsli')?.22:.07)){const old=n.role,next=npcCareerFor(n);if(old!==next){n.role=next;n.roleHistory.push({year,role:n.role});rememberNPC(n,'career','Görevini değiştirip '+n.role+' oldu.',2);if(closeIds.has(n.id))log(safeText(n.name)+' artık '+safeText(n.role)+'.','good');}}
  npcAspirationYearTick(n,year);
  if(n.partner){
   if(isAdultPlayerChild(n)){
    const rec=ensureAdultChildPartnerRecord(n,ensureFamilyBranches()),linked=n.partner.statusFlags?.sourceNPCId?adultChildMatchSource(n.partner.statusFlags.sourceNPCId):null;
    if(linked||rec)syncAdultChildPartner(n);
   }else{
    n.partner.age=(n.partner.age??Math.max(18,n.age-1))+1;if(n.partner.alive!==false&&Math.random()<npcDeathRisk(n.partner)){n.partner.alive=false;rememberNPC(n,'loss','Eşini kaybetti.',5);if(closeIds.has(n.id))log(safeText(n.name)+' eşini kaybetti.','bad');}
   }
  }
  if(n!==s.partner&&!npcLifeBlocksNormalInteraction(n)&&!n.statusFlags?.familyMatchedTo&&!n.statusFlags?.childInLawFor&&familyBranchCanGrow()&&n.age>=18&&!n.partner&&Math.random()<familyBranchPartnerChance(n)){
   const pg=n.gender==='male'?'female':'male',pa=Math.max(18,n.age+rng(-4,4)),partner=normalizeNPC({id:npcId(),gender:pg,name:pick(cfg[pg]),age:pa,birthYear:year-pa,alive:true,health:rng(60,95),type:'Eş',rel:rng(55,75),realm:n.realm||s.realm,place:n.place||s.place,tribe:n.tribe||s.tribe},'Eş');
   if(isAdultPlayerChild(n))registerAdultChildPartner(n,partner,null,'autonomous');else n.partner=partner;
   rememberNPC(n,'family',partner.name+' ile ocak kurdu.',4);if(closeIds.has(n.id))log(safeText(n.name)+' '+safeText(partner.name)+' ile ocak kurdu.','good');
  }
  const fertile=!npcLifeBlocksNormalInteraction(n)&&n.partner?.alive&&!npcLifeBlocksNormalInteraction(n.partner)&&n.age>=18&&n.partner.age>=18&&(n.gender==='female'?n.age:n.partner.age)<45;
  if(n!==s.partner&&familyBranchCanGrow()&&fertile&&Math.random()<familyBranchBirthChance(n)){
   const g=pick(['male','female']),child=normalizeNPC({name:pick(cfg[g]),gender:g,age:0,type:'Çocuk',alive:true,birthYear:year,birthMonth:1,parentIds:[n.id,n.partner.id],rel:rng(65,85),realm:n.realm||s.realm,place:n.place||s.place,tribe:n.tribe||s.tribe},'Çocuk');
   n.descendants.push(child);n.children++;rememberNPC(n,'family',child.name+' dünyaya geldi.',5);
   if(isAdultPlayerChild(n)){const p=ensureAdultChildProfile(n),f=ensureFamilyBranches();p.births++;f.grandchildrenBorn++;p.familyReadiness=clamp(p.familyReadiness+3);familyBranchRecord(n,child.name+' dünyaya geldi; soyun yeni kuşağına katıldı.','birth',{grandId:child.id});}
   if(closeIds.has(n.id))log(safeText(n.name)+' ailesine '+safeText(child.name)+' katıldı.','major');
  }
  if(n.age>45)n.health=clamp(n.health-rng(0,2));
  if(Math.random()<npcDeathRisk(n)){registerNPCDeath(n,npcDeathCauseLabel(n),{inherit:true});}
 }
 tickNPCSocialNetwork(year);parentingYearTick();guardianshipYearTick();friendshipYearTick();workplaceYearTick();familyBranchYearTick();familyDynamicsYearTick();separationYearTick();
 stateYearTick();
 if(canHaveChild()&&Math.random()<.18){s.pregnancy={remaining:9};log('Ocağınızda bir çocuk bekleniyor.','major');}
}
function ageUp(){if(!s?.alive)return;if(s.pendingEventId||s.pendingDecision){notice('Önce son karar kartını çöz.');return;}if(s.monthsRemaining>0){notice('Yeni yıla geçmeden önce kalan haklar atlanmalı.');return;}s.age++;s.monthsRemaining=12;s.lastAction=null;if(s.age>40)apply({health:-rng(0,2)});familyTick();horseYearTick();toyYearTick();housingYearTick();lifePurposeYearTick();healthAgeTick();elderYearTick();ensureLifeVariety();checkAchievements();mortality();if(s.alive){log(animalYearName(s.year+s.age)+' Yılı başladı; bu yıl 12 eylem hakkın var.','major');if(s.age>=18&&!s.captive&&!s.exile&&!s.military.called)militaryCall();else if(s.age>=18&&!s.captive&&!s.exile&&!s.military.active&&s.military.served&&Math.random()<.08){s.military.called=false;militaryCall();}}render();save();}
function die(){if(!s?.alive)return;if(ensureCaravanTrade().contracts.active)caravanContractFinish('void','Sözleşme sahibinin vefatıyla yükümlülük kapatıldı.');const q=ensureSuccession(),cause=deathCauseLabel(),heirs=livingHeirs();s.alive=false;s.pendingEventId=null;s.pendingDecision=null;s.pendingEventContext=null;clearTransient();
 const elder=s.age>=50?ensureElderLife():null;s.deathRecord={name:s.name,age:s.age,year:s.year+s.age,role:s.role,retiredRole:s.retiredRole||null,prestige:s.prestige,wealth:s.wealth,cause,will:s.will,prepared:q.prepared,chosenHeirId:q.chosenHeirId,familyHarmony:q.familyHarmony,lastWish:q.lastWish,assets:[...s.assets],workshop:workshopLegacySnapshot(),caravanTrade:caravanLegacySnapshot(),credit:creditLegacySnapshot(),toyFestival:toyLegacySnapshot(),lifePurpose:purposeLegacySnapshot(),reputation:communityReputationSnapshot(),heirs:heirs.map(n=>({id:n.id,name:n.name,age:n.age})),elder:elder?{standing:elder.standing,purpose:elder.purpose,careSupport:elder.careSupport,councils:elder.councils,lessons:elder.lessons,reconciliations:elder.reconciliations,delegations:elder.delegations,memoriesShared:elder.memoriesShared}:null};
 log(`${s.age} yaşında, ${s.year+s.age} yılında yaşamın sona erdi. Neden: ${cause}.`,'bad');s.legacy.past.push({...s.deathRecord});s.legacy.purposes=Array.isArray(s.legacy.purposes)?s.legacy.purposes:[];s.legacy.purposes.unshift({name:s.name,year:s.year+s.age,purpose:s.deathRecord.lifePurpose});s.legacy.purposes=s.legacy.purposes.slice(0,30);render();save();showHeirModal();}
function setWill(id){if(id!=='equal'&&!s.children.some(x=>x.id===id&&x.alive))return;performAction({kind:'will'},()=>{const q=ensureSuccession();s.will=id;q.prepared=true;q.chosenHeirId=id==='equal'?null:id;q.lastCouncilYear=s.year+s.age;q.familyHarmony=clamp(q.familyHarmony+(id==='equal'?2:-2));q.history.unshift({year:s.year+s.age,age:s.age,mode:id==='equal'?'equal':'chosen',targetId:q.chosenHeirId,note:'Mal paylaşımı doğrudan konuşuldu.',harmony:q.familyHarmony});q.history=q.history.slice(0,24);},'Mal paylaşımı isteğini yakınlarınla konuştun.');}
function continueAsHeir(i){
 if(!s||s.alive)return;const heirs=s.children.filter(x=>x.alive),c=heirs[i];if(!c)return;const old=s,heirOwnJourney=npcAspirationLegacyRecord(c),oldCommunity=JSON.parse(JSON.stringify(ensureCommunityReputation())),oldSuccession=JSON.parse(JSON.stringify(ensureSuccession())),creditEstate=creditEstateSettlement(old),equal=old.will==='equal'||!heirs.some(x=>x.id===old.will),share=inheritanceShareFor(c,heirs),deathRecord=old.deathRecord||null;clearTransient();
 s=newCharacter({name:c.name,gender:c.gender,realm:old.realm,year:old.year+old.age-c.age,place:c.place||old.place,tribe:c.tribe||old.tribe,age:c.age,monthsRemaining:old.monthsRemaining,wealth:share.wealth,health:c.health,happiness:65,skill:Math.min(60,c.age*2),skills:c.skills||{},prestige:clamp(old.prestige*.35),achievements:[...old.achievements],familyDynamics:JSON.parse(JSON.stringify(old.familyDynamics||null)),horseStable:horseStableInheritance(old,share),workshop:workshopInheritance(old,share),caravanTrade:caravanInheritance(old,share),legacy:{generation:old.legacy.generation+1,familyName:old.legacy.familyName,past:old.legacy.past,purposes:old.legacy.purposes||[],heirJourneys:[...(old.legacy.heirJourneys||[]),...(heirOwnJourney?[heirOwnJourney]:[])].slice(-30),toyTitles:[...(old.legacy.toyTitles||[]),...(old.deathRecord?.toyFestival?.titles||[])].slice(-70)}});
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
  s.assets=share.assets;
 if(s.caravanTrade?.inheritedRivals){s.careerContacts.push(...s.caravanTrade.inheritedRivals);delete s.caravanTrade.inheritedRivals;}
 s=migrateState(s);if(s.assets.includes('horse')&&!horses().length)horses().push(createHorse());s.communityReputation=inheritCommunityReputation(oldCommunity,old.name);ensureCommunityReputation();s.lastInheritance={from:old.name,year:old.year+old.age,equal,wealth:share.wealth,creditEstate,workshopInherited:share.assets.includes('smithy'),caravanInherited:share.assets.includes('caravan_share'),assets:[...share.assets],prepared:oldSuccession.prepared,familyHarmony:oldSuccession.familyHarmony,lastWish:oldSuccession.lastWish,deathRecord};
 const favored=!equal&&old.will===c.id;for(const sib of s.siblings.filter(n=>n.alive)){if(favored)adjustNPC(sib,{rel:-8,trust:-7,grudge:12},old.name+' ardından mirasın tek elde kalmasını kolay unutmadı.');else if(oldSuccession.prepared&&oldSuccession.familyHarmony>=60)adjustNPC(sib,{rel:4,trust:5,grudge:-5},old.name+' hayattayken paylaşımı açıkça konuşmuştu.');}
 if(favored&&s.siblings.some(n=>n.alive))recordPublicWord('inheritance',old.name+' ardından mirasın büyük kısmının sana kaldığı aile içinde konuşuluyor.',{honor:-2,reliability:-1},{severity:18,polarity:-1,truth:true,knownIds:s.siblings.filter(n=>n.alive).map(n=>n.id),sourceId:s.siblings.find(n=>n.alive)?.id||null});
 const inheritanceSibling=s.siblings.find(n=>n.alive);if(inheritanceSibling)scheduleDelayedEvent({id:'inheritance_aftershock',years:[1,2],payload:{detail:(favored?'Mirasın büyük kısmı sana kaldı. ':'Miras paylaştırıldı. ')+(oldSuccession.lastWish?'Son dileği: '+oldSuccession.lastWish:'Aile şimdi yeni düzene alışıyor.'),favored,parentName:old.name}},{targetId:inheritanceSibling.id,sourceEventId:'heir_succession'});if(favored){const inheritanceParties=[...s.siblings.filter(n=>n.alive),...s.parents.filter(n=>n.alive)].filter((n,i,a)=>a.findIndex(x=>x.id===n.id)===i);if(inheritanceParties.length>=2&&!familyConflictForPair(inheritanceParties[0],inheritanceParties[1]))createFamilyConflict(inheritanceParties[0],inheritanceParties[1],'inheritance',{heat:58,reason:old.name+' ardından kalan malın ve sözün adil olup olmadığı konusunda anlaşamıyorlar.'});}
 const veteran=(old.military?.comrades||[]).filter(n=>n.alive&&(n.rel||0)>=70).sort((a,b)=>((b.bonds?.trust||0)+(b.rel||0))-((a.bonds?.trust||0)+(a.rel||0)))[0];
 const inheritedVeteran=veteran?s.friends.find(n=>n.id===veteran.id):null;
 if(inheritedVeteran)scheduleDelayedEvent({id:'legacy_comrade_visit',years:[1,4],payload:{detail:old.name+' ile yıllar önce omuz omuza savaşmıştı.'}},{targetId:inheritedVeteran.id,sourceEventId:'heir_succession'});
 unlock('heir');log(safeText(old.name)+' ardından soyun '+safeText(s.name)+' ile devam ediyor.','major');$('heirModal').classList.remove('show');activateLifeTab();render();save();
}
function eventRequirementOK(ev){
 const check=r=>{if(!r)return true;if(Array.isArray(r))return r.every(check);if(r.startsWith('flag:'))return !!s.flags[r.slice(5)];if(r.startsWith('notflag:'))return !s.flags[r.slice(8)];if(r.startsWith('asset:'))return s.assets.includes(r.slice(6));if(r.startsWith('career:'))return !careerIssue(D.careers.find(x=>x.id===r.slice(7)));if(r.startsWith('role:'))return D.careers.find(x=>x.id===r.slice(5))?.name===s.role;let cm=r.match(/^careermonths:([^:]+):(\d+)$/);if(cm)return careerProfile(cm[1]).months>=+cm[2];let cr=r.match(/^careerrep:([^:]+):(\d+)$/);if(cr)return careerProfile(cr[1]).reputation>=+cr[2];let st=r.match(/^state(influence|trust|support|rival):(\d+)$/);if(st){const q=ensureStateCourt(),k={influence:'influence',trust:'councilTrust',support:'tribeSupport',rival:'rivalPressure'}[st[1]];return q[k]>=+st[2];}const num=r.match(/^(skill|wealth|prestige)(\d+)$/);if(num)return s[num[1]]>=+num[2];
 const map={single:()=>!s.partner?.alive&&!s.married,partnered:()=>!!s.partner?.alive,hasWorkplace:()=>!!s.role&&currentWorkplaceContacts().length>0,workplaceConflict:()=>!!s.role&&ensureWorkplace().conflict>=25,hasWorkplaceJunior:()=>!!s.role&&workplaceJuniors().some(n=>n.alive),hasDistantFriend:()=>friendReconnectionCandidates().length>0,hasCareerFriend:()=>s.friends.some(n=>n.alive&&!!friendRolePath(n)),hasFriendCircle:()=>ensureSocialLife().groups.some(g=>!g.archived&&g.memberIds.filter(id=>npcById(id)?.alive).length>=3),underGuardianship:()=>s.age<18&&ensureGuardianship().active&&!!currentGuardian()?.alive,separatedMinorSibling:()=>s.age<18&&ensureGuardianship().active&&s.siblings.some(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)),multipleMinorChildren:()=>s.children.filter(c=>c.alive&&c.age<18).length>=2,hasInLaw:()=>ensureExtendedFamily().inLaws.some(n=>n.alive&&!n.statusFlags?.legacyInLaw),hasCousin:()=>extendedFamilyVisible().some(n=>n.alive&&kinRole(n)==='Kuzen'),hasFamilyConflict:()=>activeFamilyConflicts().length>0,familyHomeAdult:()=>!s.captive&&!s.exile&&ensureHousing().mode==='family_yurt'&&s.age>=18,housingCrowded:()=>!s.captive&&!s.exile&&housingCrowding()>0,temporaryShelter:()=>!s.captive&&!s.exile&&ensureHousing().mode==='temporary_shelter',hasJusticeFeud:()=>ensureJustice().feuds.some(x=>x.status==='active'&&x.heat>=25),married:()=>s.age>=18&&s.married&&s.partner?.alive&&s.partner.age>=18,romanceTense:()=>!!currentRomance()&&currentRomance().tension>=45,romanceJealous:()=>!!currentRomance()&&currentRomance().jealousy>=35,romanceFamilyLow:()=>!!currentRomance()&&currentRomance().familyApproval<45,romanceStable:()=>!!currentRomance()&&currentRomance().harmony>=65&&currentRomance().tension<30,marriageBetrayalRisk:()=>s.married&&marriageBetrayalRisk()>=58&&!currentRomance()?.betrayal?.unresolved,hasChild:()=>s.children.some(x=>x.alive),hasAdultChild:()=>s.children.some(x=>x.alive&&x.age>=18),hasAdultChildPartner:()=>s.children.some(x=>x.alive&&x.age>=18&&x.partner?.alive),hasFamilySteward:()=>Object.values(ensureFamilyBranches().stewards).some(id=>!!adultChildById(id)),hasLivingSibling:()=>s.siblings.some(x=>x.alive),successionPrepared:()=>ensureSuccession().prepared,successionUnprepared:()=>!ensureSuccession().prepared,trainableChild:()=>s.children.some(x=>x.alive&&x.age>=7&&x.age<18),hasChildTrainingV31:()=>s.children.some(x=>x.alive&&x.age<18&&!!childTrainingProfile(x)?.track),hasSickHorseV32:()=>horses().some(h=>h.health<60),hasPurposeDoubtV33:()=>purposeNeedsReview(),hasGrandchild:()=>s.children.some(x=>x.alive&&x.children>0),hasFriend:()=>s.friends.some(x=>x.alive),hasRival:()=>s.rivals.some(x=>x.alive),hasFamilyFriend:()=>s.friends.some(x=>x.alive&&x.statusFlags?.familyFriend),hasFamilyEnemy:()=>s.rivals.some(x=>x.alive&&x.statusFlags?.familyEnemy),hasRivalKinLink:()=>rivalKinPairs().length>0,hasCloseKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].some(x=>x.alive),hasTrustedPerson:()=>allNPCs().some(x=>x.alive&&(x.bonds?.trust||0)>=55),hasActiveGrief:()=>activeGriefRecords().length>0,caregiverStrain:()=>caregiverStrain()>=25,hasLongTermCondition:()=>ensureHealthProfile().longTermConditions.length>0,lowHealthManagement:()=>ensureHealthProfile().longTermConditions.some(x=>x.management<35),hasBadRumor:()=>activeCommunityRumors(-1).length>0,highRumorHeat:()=>ensureCommunityReputation().rumorHeat>=35,hasComrade:()=>s.military.comrades.some(x=>x.alive),hasTrustedComrade:()=>s.military.comrades.some(x=>x.alive&&((x.bonds?.trust||0)>=60||(x.rel||0)>=72)),hasAilment:()=>s.ailments.length>0,hasScar:()=>ensureHealthProfile().scars.length>0,healthLow:()=>s.health<55,military:()=>s.age>=18&&s.military.served,activeCampaign:()=>s.age>=18&&s.military.active,recentCampaign:()=>!!s.flags.recent_campaign,captive:()=>s.captive,exile:()=>s.exile};return map[r]?!!map[r]():false;};return check(ev.req);
}
function eventChoiceIssue(ch){const x=ch[1]||{};if(x.wealth<0&&s.wealth<-x.wealth)return `${-x.wealth} servet gerekiyor`;if(x.healerCare&&s.wealth<2)return 'Otacı bakımı için 2 servet gerekiyor';if(x.setRole)return careerIssue(D.careers.find(r=>r.name===x.setRole));return '';}
function eventTargetCandidates(target){
 const pools={
  guardian:()=>{const n=currentGuardian();return n?.alive?[n]:[]},separatedSibling:()=>s.siblings.filter(n=>n.alive&&ensureGuardianship().separatedSiblingIds.includes(n.id)),child:()=>s.children.filter(n=>n.alive),minorChild:()=>s.children.filter(n=>n.alive&&n.age<18),adultChild:()=>s.children.filter(n=>n.alive&&n.age>=18),grandchild:()=>s.children.flatMap(c=>c.descendants||[]).filter(n=>n?.alive),trainingChild:()=>s.children.filter(n=>n.alive&&n.age>=7&&n.age<18),childTrainingStudent:()=>s.children.filter(n=>n.alive&&n.age<18&&!!childTrainingProfile(n)?.track),friend:()=>s.friends.filter(n=>n.alive),workplaceSupervisor:()=>{const n=workplaceSupervisor();return n?.alive?[n]:[]},workplacePeer:()=>workplacePeers().filter(n=>n.alive),workplaceJunior:()=>workplaceJuniors().filter(n=>n.alive),distantFriend:()=>friendReconnectionCandidates(),careerFriend:()=>s.friends.filter(n=>n.alive&&!!friendRolePath(n)),circleFriend:()=>s.friends.filter(n=>n.alive&&!!friendCircleFor(n)),
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
 if(target==='familyConflictPair')return familyConflictEventPairs().map(x=>({target:x.target,other:x.other}));
 if(target==='statePair'){const {patron,rival}=ensureStateCircle();return npcAvailableForOrdinaryEvent(patron)&&npcAvailableForOrdinaryEvent(rival)?[{target:patron,other:rival}]:[];}
 const meta=arcEventMeta(eventId);ensureStoryArcs();const st=meta?s.storyArcs[meta.id]:null;
 if(st?.status==='active'&&st.participantIds?.length){const locked=st.participantIds.map(npcById).find(n=>npcAvailableForOrdinaryEvent(n));return locked?[{target:locked,other:null}]:[];}
 return eventTargetCandidates(target).filter(npcAvailableForOrdinaryEvent).map(n=>({target:n,other:null}));
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
 if(x.succession)applySuccessionEffect(x.succession);if(x.elder)applyElderEffect(x.elder);if(x.economy)applyEconomyEffect(x.economy);if(x.displacement)applyDisplacementEffect(x.displacement);if(x.romance)adjustRomance(x.romance,x.romanceMemory||'İlişkinizde yeni bir iz kaldı.');if(x.housing)applyHousingEffect(x.housing);
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
 if(target?.alive&&fx.familyBranch)applyFamilyBranchEffect(target,fx.familyBranch);
 if(fx.marriageCrisis)applyMarriageCrisisEffect(fx.marriageCrisis);
 if(fx.bereavement)applyBereavementEffect(target,fx.bereavement);
 if(fx.longHealth){const h=ensureHealthProfile();for(const x of h.longTermConditions){if(fx.longHealth.management)x.management=clamp(x.management+fx.longHealth.management);}if(fx.longHealth.health)apply({health:fx.longHealth.health});}
 if(fx.reputation)applyCommunityReputationEffect(target,fx.reputation);
 if(target?.alive&&fx.promoteTarget==='military_leader')promoteMilitaryComrade(target);
 if(target?.alive&&fx.makeTargetFriend)makeTargetFriend(target,'Eski sefer yoldaşı');
 if(target?.alive&&fx.makeTargetRival)makeTargetRival(target,'Eski sefer yoldaşı / Hasım');
 if(['crime_old_accusation','crime_witness_returns','crime_feud_returns'].includes(ev.id))applyJusticeEventOutcome(ev.id,i,context,target);
 if(target?.alive&&['parenting_child_lie','parenting_child_choice','parenting_sibling_conflict','child_training_choice'].includes(ev.id))applyParentingEvent(ev.id,i,target);
 if(target?.alive&&ev.id==='child_training_report_v31')applyChildTrainingReportEvent(target,i);
 if(['guardian_household_strain','guardian_family_memory','guardian_sibling_distance'].includes(ev.id))applyGuardianshipEvent(ev.id,i,target);
 if(['friend_returns','friend_work_opening','friend_circle_conflict'].includes(ev.id))applyFriendshipEvent(ev.id,i,target);
 if(['workplace_credit_dispute','workplace_supervisor_test','workplace_junior_mistake'].includes(ev.id))applyWorkplaceEvent(ev.id,i,target);
 if(ev.id==='family_conflict_spillover_v30'&&target?.alive&&other?.alive)applyFamilyConflictEventChoice(target,other,i);if(ev.id==='horse_sick_v32')horseSickEvent(i);if(ev.id==='purpose_doubt_v33')purposeDoubtChoice(i);
 if(target?.alive){if(['education_mentor_trial','education_peer_competition','education_peer_help'].includes(ev.id)){const d=EDUCATION_TRACKS[target.statusFlags?.educationTrack];if(d)skillGain(d.skill,ev.id==='education_mentor_trial'?(i===0?3:1):ev.id==='education_peer_competition'?(i===0?2:3):(i===0?2:1));}
  if(ev.id==='child_ill')target.health=clamp(target.health+(i===0?4:7));if(ev.id==='friend_quarrel')target.rel=clamp(target.rel+(i===0?6:-6));if(ev.id==='child_training_choice'){target.skills=target.skills||{};const k=i===0?'archery':i===1?'craft':'speech';target.skills[k]=clamp((target.skills[k]||0)+3);}if(ev.id==='child_path_consequence')applyChildPathConsequence(target,context,i);}
 if(target?.alive&&fx.resolveRival){const ri=s.rivals.findIndex(n=>n.id===target.id);if(ri>=0){s.rivals.splice(ri,1);target.type='Dost';if(!s.friends.some(n=>n.id===target.id))s.friends.push(target);rememberNPC(target,'peace','Uzun süren husumet sona erdi.',7);unlock('reconciled');}}
 for(const spec of [...(Array.isArray(fx.scheduleEvents)?fx.scheduleEvents:[]),...(fx.scheduleEvent?[fx.scheduleEvent]:[])])scheduleDelayedEvent(spec,{...context,sourceEventId:ev.id});
 resolveDelayedRecord(context.delayedId);
 if(ev.once&&!s.eventHistory.includes(ev.id))s.eventHistory.push(ev.id);if(!ev.fallback)s.eventCooldowns[ev.id]=ev.cool||12;
 s.eventArchive.push({id:ev.id,cat:ev.cat,...context,choice:i,actor:hasDirectAgency(ev)?'self':'guardian'});s.eventArchive=s.eventArchive.slice(-300);recordStoryArcChoice(ev.id,i,ch[0],context,false);log(`<b>${ev.cat}:</b> ${safeText(eventDisplayText(ev,context))} <i>${hasDirectAgency(ev)?'':'Ailen/bakıcıların: '}${safeText(ch[0])}</i>`);
 s.pendingEventId=null;s.pendingEventContext=null;s.decisionOffset=0;window._contextEvent=null;checkAchievements();if(s.health<=0)die();render();save();
}
function eventDisplayText(e,ctx){const target=allNPCs().find(n=>n.id===ctx?.targetId),other=allNPCs().find(n=>n.id===ctx?.otherTargetId),fc=target&&other?familyConflictForPair(target,other):null;return String(e?.text||'').replaceAll('{name}',target?.name||'Yakının').replaceAll('{other}',other?.name||'yakının').replaceAll('{conflict}',fc?.reason||'aile içindeki eski mesele').replaceAll('{training}',target&&childTrainingDef(target)?.name||'yetişme düzeni').replaceAll('{horse}',horses().filter(h=>h.health<60).sort((a,b)=>a.health-b.health)[0]?.name||'At').replaceAll('{detail}',delayedDetail(ctx)).replaceAll('{past}',targetPastLabel(target));}
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
 if(x.reputation){const r=x.reputation,parts=[];if(r.honor)parts.push('Onur '+(r.honor>0?'+':'')+r.honor);if(r.reliability)parts.push('Güven '+(r.reliability>0?'+':'')+r.reliability);if(r.generosity)parts.push('Cömertlik '+(r.generosity>0?'+':'')+r.generosity);if(r.fear)parts.push('Çekince '+(r.fear>0?'+':'')+r.fear);if(parts.length)items.push({cls:(r.honor||0)+(r.reliability||0)+(r.generosity||0)-(r.fear||0)>=0?"pos":"neg",label:'🗣 '+parts.join(' • ')});}
  if(x.targetRel)items.push({cls:x.targetRel>0?"pos":"neg",label:`🤝 İlişki ${x.targetRel>0?"+":""}${x.targetRel}`});
 if(x.targetTrust)items.push({cls:x.targetTrust>0?"pos":"neg",label:`🔒 Güven ${x.targetTrust>0?"+":""}${x.targetTrust}`});
 if(x.targetRespect)items.push({cls:x.targetRespect>0?"pos":"neg",label:`🐺 Saygı ${x.targetRespect>0?"+":""}${x.targetRespect}`});
 if(x.targetGrudge)items.push({cls:x.targetGrudge>0?"neg":"pos",label:`🔥 Kin ${x.targetGrudge>0?"+":""}${x.targetGrudge}`});
 if(x.otherRel)items.push({cls:x.otherRel>0?"pos":"neg",label:`👥 Yakının ilişki ${x.otherRel>0?"+":""}${x.otherRel}`});
 if(x.otherTrust)items.push({cls:x.otherTrust>0?"pos":"neg",label:`🔒 Yakının güveni ${x.otherTrust>0?"+":""}${x.otherTrust}`});
 if(x.linkScore)items.push({cls:x.linkScore>0?"pos":"neg",label:`🔗 Aralarındaki bağ ${x.linkScore>0?"+":""}${x.linkScore}`});
 if(x.resolveRival)items.push({cls:"pos",label:"🤝 Husumet sona erebilir"});
 if(x.succession){const m=x.succession.mode==='equal'?'Eşit paylaşım':x.succession.mode==='target'?'Ana varis seçimi':'Aile vasiyeti';items.push({cls:x.succession.harmony<0?'neg':'neutral',label:'🪶 '+m});}
 if(x.elder?.purpose)items.push({cls:x.elder.purpose>0?'pos':'neg',label:`🧓 Yaşam amacı ${x.elder.purpose>0?'+':''}${x.elder.purpose}`});
 if(x.elder?.standing)items.push({cls:x.elder.standing>0?'pos':'neg',label:`🪶 Söz ağırlığı ${x.elder.standing>0?'+':''}${x.elder.standing}`});
 if(x.elder?.careSupport)items.push({cls:x.elder.careSupport>0?'pos':'neg',label:`🏕 Aile desteği ${x.elder.careSupport>0?'+':''}${x.elder.careSupport}`});
 if(x.familyBranch?.autonomy)items.push({cls:x.familyBranch.autonomy>0?'neutral':'neg',label:`🧭 Bağımsızlık ${x.familyBranch.autonomy>0?'+':''}${x.familyBranch.autonomy}`});
 if(x.familyBranch?.familyReadiness)items.push({cls:x.familyBranch.familyReadiness>0?'pos':'neg',label:`🌿 Aile isteği ${x.familyBranch.familyReadiness>0?'+':''}${x.familyBranch.familyReadiness}`});
 if(x.familyBranch?.careerMomentum)items.push({cls:x.familyBranch.careerMomentum>0?'pos':'neg',label:`🛠 Kariyer ivmesi ${x.familyBranch.careerMomentum>0?'+':''}${x.familyBranch.careerMomentum}`});
 if(x.marriageCrisis){const m=x.marriageCrisis.mode==='separate'?'Ocak ayrılığı':x.marriageCrisis.mode==='forgive'?'Bir şans daha':x.marriageCrisis.mode==='confront'?'Yüzleşme':'Sadakat krizi';items.push({cls:x.marriageCrisis.mode==='separate'?'neg':'neutral',label:'🔥 '+m});}
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
 if(s.role)html+=`<div class="grid2">${actionButton('Görevinde çalış',{kind:'work'},'workRole()','Meslek tecrübesi, ustalık ve ün kazan.')}${s.age>=50?actionButton('Ağır görevi bırak',{kind:'retire'},'retireRole()'):''}</div>`+workplaceSummaryHtml();
 html+=stateCourtSummary();
 html+=careerContactsSummary();
 html+=`<h3 class="sectionTitle">Görev Yolları</h3><div class="grid2">${D.careers.map(r=>actionButton(r.name,{kind:'role',id:r.id},`takeRole('${r.id}')`,careerRequirements(r))).join('')}</div>`;
 $('tab-gorev').innerHTML=html;
}
function renderActivities(){
 ensureLifeVariety();const cats=[...new Set(PERIOD_ACTIVITIES.map(x=>x.cat))];
 $('tab-faaliyet').innerHTML=mobilitySummaryHtml()+purposeSummaryHtml()+varietySummaryHtml()+toyContestSummaryHtml()+seasonalActivitiesHtml()+cats.map(cat=>`<h3 class="sectionTitle">${cat}</h3><div class="grid2">${PERIOD_ACTIVITIES.filter(x=>x.cat===cat).map(a=>actionButton(a.icon+' '+a.name,{kind:'period',id:a.id},`doPeriodActivity('${a.id}')`,a.desc+' • '+a.age+' yaş • '+activityStatLabel(a.id))).join('')}</div>`).join('');
}
function renderAssets(){
 ensureEconomy();ensureHousing();
 $('tab-varlik').innerHTML=housingSummaryHtml()+economySummaryHtml()+creditSummaryHtml()+workshopSummaryHtml()+caravanTradeSummaryHtml()+horseSummaryHtml()+`<h3 class="sectionTitle">Pazar</h3><div class="grid2">${D.assets.filter(a=>!s.assets.includes(a.id)).map(a=>actionButton(a.icon+' '+a.name,{kind:'asset',id:a.id},`buyAsset('${a.id}')`,assetBuyPrice(a.id)+' servet • '+ASSET_AGES[a.id]+' yaş • fiyat pazara göre değişir')).join('')}</div><h3>Sahip oldukların</h3><div class="grid2">${s.assets.map(id=>{if(id==='horse')return '';const a=D.assets.find(x=>x.id===id);if(!a)return '';const st=assetState(id);return '<div class="card"><h3>'+a.icon+' '+a.name+'</h3><p>Durum '+st.condition+'/100 • Satış '+assetSaleValue(id)+' servet</p><div class="grid2">'+actionButton('Bakım yap',{kind:'maintenance',id},`maintainAsset('${id}')`,maintenanceCost(id)+' servet')+actionButton('Takas et',{kind:'asset',id,sell:true},`sellAsset('${id}')`,'Pazar değeri '+assetSaleValue(id))+'</div></div>';}).join('')}</div><h3>Üretim</h3><div class="grid2">${[['herd','Sürüyü yönet','flock'],['forge','Ocakta üret','smithy']].map(([id,n,a])=>actionButton(n,{kind:'venture',id},`manageVenture('${id}')`,s.assets.includes(a)?'Durum '+assetState(a).condition+'/100 • sonuç garanti değil':'İlgili varlık gerekli')).join('')}</div>`;
}
function familyCard(n,group,index){
 normalizeNPC(n,n.type);
 const options=[['spend','Vakit geçir'],...(s.age>=8?[['confide','Dertleş']]:[]),...(s.age>=10?[['help','Yardım et'],['work','Birlikte çalış'],['gift','Armağan']]:[]),['advice','Öğüt al'],...(group==='rivals'?[['reconcile','Uzlaş']]:[])];
 const life=normalizeNPCLifeState(n),actions=n.alive&&s.age>=5?(life.status!=='normal'?npcLifeActionsHtml(n):options.map(([id,label])=>{const issue=accessIssue({kind:'npc',group,index,id});return `<button class="mini" ${issue?'disabled':''} title="${safeText(issue)}" onclick="interactNPC('${group}',${index},'${id}')">${label}</button>`;}).join('')):'';
 const traits=npcTraitNames(n).map(x=>`<span class="trait">${safeText(x)}</span>`).join('');
 const b=normalizeBonds(n),memory=recentNPCMemory(n),ties=socialConnectionsFor(n,2),tieLine=ties.length?'Bağları: '+ties.map(x=>x.other.name+' ('+socialLinkLabel(x.link)+')').join(' • '):'',shownType=typeof kinRole==='function'?kinRole(n):(n.displayKinRole||n.type);
 return `<div class="card familycard"><div><h3>${n.alive?'':'† '}${safeText(n.name)}</h3><p>${safeText(shownType)} • ${n.age} yaş • ${safeText(n.role)}<br>İlişki ${n.rel}${n.partner?' • Eş: '+safeText(n.partner.name):''}${n.children?' • Çocuk: '+n.children:''}</p>
 <div class="traitrow">${traits}</div><div class="npcgoal">Amaç: ${safeText(npcGoalName(n))}</div>${npcAspirationSummaryHtml(n)}<div class="networkline">Malı: ${safeText(npcEstateSummary(n))}</div><div class="networkline">Durum: ${safeText(npcLifeStatusLabel(n))}${npcLifeStatusDetail(n)?' • '+npcLifeStatusDetail(n):''}</div>
 <div class="rbar"><i style="width:${n.rel}%"></i></div><div class="bondrow"><span class="bond good">Güven ${b.trust}</span><span class="bond">Saygı ${b.respect}</span>${b.grudge?'<span class="bond bad">Kin '+b.grudge+'</span>':''}${b.fear>15?'<span class="bond bad">Çekince '+b.fear+'</span>':''}</div>
 ${memory?`<div class="memoryline">Hatırladığı: ${safeText(memory)}</div>`:''}${tieLine?`<div class="networkline">${safeText(tieLine)}</div>`:''}</div><div class="actions">${actions}</div></div>`;
}
function renderSystems(){
 $('lifeCare').innerHTML=`<h3 class="sectionTitle">${lifeStage(s.age)}</h3>${healthSummaryHtml()}${displacementSummaryHtml()}${guardianshipSummaryHtml()}<div class="grid2">${s.age<5?actionButton('Aile bakımında bir ay',{kind:'guardian'},'guardianCare()'):actionButton('Dinlen',{kind:'health',id:'rest'},"healthAction('rest')",'Aktif rahatsızlıkların iyileşmesini hızlandırır.')+actionButton(s.age<12?'Ailenle otacıya git':'Otacıya Git',{kind:'health',id:'healer'},"healthAction('healer')",'2 servet • rahatsızlık şiddetini ve iyileşme süresini azaltır.')}</div>${s.pregnancy?'<p class="note">Doğum bekleniyor • yaklaşık '+s.pregnancy.remaining+' ay.</p>':''}`;
 $('tab-yetisme').insertAdjacentHTML('beforeend',educationSummaryHtml()+'<h3 class="sectionTitle">Yetişme tecrübesi</h3><p class="note">'+Object.entries(s.experience).map(([k,v])=>pathName(k)+': '+v+' ay').join(' • ')+'</p>');
 $('tab-faaliyet').insertAdjacentHTML('afterbegin',appearanceSummaryHtml());
 $('tab-aile').insertAdjacentHTML('afterbegin',npcEstateSummaryHtml()+bereavementSummaryHtml()+npcWorldSummaryHtml()+friendshipSummaryHtml()+marriageCrisisSummaryHtml()+romanceSummaryHtml()+parentingSummaryHtml()+adultChildrenSummaryHtml()+extendedFamilySummaryHtml()+familyConflictSummaryHtml());
 $('tab-soy').insertAdjacentHTML('beforeend',communityReputationSummaryHtml()+elderLifeSummaryHtml()+successionSummaryHtml());
 if(s.legacy?.toyTitles?.length)$('tab-soy').insertAdjacentHTML('beforeend','<div class="card"><h3>Ataların Toy Zaferleri</h3><p>'+s.legacy.toyTitles.slice(-8).map(x=>safeText(x.year+' • '+x.name)).join('<br>')+'</p></div>');
 if(s.legacy?.heirJourneys?.length)$('tab-soy').insertAdjacentHTML('beforeend','<div class="card"><h3>Önceki Kuşakların Kendi Yolu</h3>'+s.legacy.heirJourneys.slice(-5).map(x=>'<p>'+safeText(x.name)+' • '+safeText(NPC_GOALS[x.goal]||x.goal)+' • '+x.stage+'/3 aşama</p>').join('')+'</div>');
 $('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Ün ve başarımlar</h3><div class="grid2">${D.achievements.map(a=>`<div class="card ${s.achievements.includes(a.id)?'':'locked'}"><h3>${s.achievements.includes(a.id)?'🏆':'🔒'} ${a.name}</h3><p>${a.desc}</p></div>`).join('')}</div>`);
 if(s.age>=18&&s.children.some(x=>x.alive))$('tab-soy').insertAdjacentHTML('beforeend',`<h3 class="sectionTitle">Mal paylaşımı</h3><p class="note">Şu an: ${s.will==='equal'?'Yaşayan çocuklara eşit':safeText(s.children.find(n=>n.id===s.will)?.name||'Eşit paylaşım')}. Bu paylaşım bir oyun kuralıdır.</p><div class="grid2">${actionButton('Eşit paylaş',{kind:'will'},"setWill('equal')")}${s.children.filter(x=>x.alive).map(n=>actionButton(safeText(n.name),{kind:'will'},`setWill('${n.id}')`)).join('')}</div>`);
}
function migrateState(x){
 if(!x||!D.realms[x.realm]||!Number.isFinite(x.age)||!Number.isFinite(x.year))throw new Error('Geçersiz kayıt');const sourceVersion=x.version||0;x.version=SAVE_VERSION;x.age=Math.max(0,Math.floor(x.age));x.monthsRemaining=Math.max(0,Math.min(12,Math.floor(x.monthsRemaining??12)));x.alive=x.alive!==false;
 for(const k of ['health','happiness','skill','prestige'])x[k]=clamp(Number.isFinite(x[k])?x[k]:50);x.wealth=Math.max(0,Math.round(Number.isFinite(x.wealth)?x.wealth:0));
 for(const k of ['parents','siblings','relatives','friends','rivals','children','careerContacts','socialLinks','delayedEvents','assets','achievements','eventHistory','eventArchive','crimeRecord','timeline','ailments','exPartners'])if(!Array.isArray(x[k]))x[k]=[];
 for(const k of ['experience','careerMonths','careerProfiles','eventCooldowns','flags','skills'])x[k]=x[k]||{};x.storyArcs=x.storyArcs&&typeof x.storyArcs==='object'&&!Array.isArray(x.storyArcs)?x.storyArcs:{};x.will=x.will||'equal';x.pregnancy=x.pregnancy||null;x.deathRecord=x.deathRecord||null;x.legacy=x.legacy||{generation:1,familyName:x.tribe,past:[]};x.legacy.past=x.legacy.past||[];s=x;ensureSkills();ensureMilitary();ensureCareerSystems();ensureWorkplace();ensureStateCourt();ensureHealthProfile();ensureSuccession();ensureElderLife();ensureEconomy();ensureWorkshop();ensureCaravanTrade();ensureCredit();ensureHorseStable();ensureDisplacement();ensureLifeVariety();ensureToyFestival();ensureLifePurpose();ensureMobility();ensureEducation();ensureAppearance();ensureRomance();ensureJustice();ensureHousing();ensureExtendedFamily();ensureFamilyDynamics();ensureParenting();ensureFamilyBranches();ensureGuardianship();ensureSocialLife();ensureNPCWorld();ensureBereavement();ensureNPCEstates();ensureCommunityReputation();if(s.role)ensureWorkplaceForRole();if(s.partner?.alive)ensurePartnerFamily();refreshKinRoles();if(s.age<18)ensureMinorGuardianship('kayıt göçü');
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
function load(){try{const raw=localStorage.getItem('yazgi_full_v1');if(!raw)return;const x=JSON.parse(raw);if(x.version!==SAVE_VERSION){if(!localStorage.getItem('yazgi_before_v42'))localStorage.setItem('yazgi_before_v42',raw);if(!localStorage.getItem('yazgi_before_v41'))localStorage.setItem('yazgi_before_v41',raw);if(!localStorage.getItem('yazgi_before_v40'))localStorage.setItem('yazgi_before_v40',raw);if(!localStorage.getItem('yazgi_before_v39'))localStorage.setItem('yazgi_before_v39',raw);if(!localStorage.getItem('yazgi_before_v38'))localStorage.setItem('yazgi_before_v38',raw);if(!localStorage.getItem('yazgi_before_v37'))localStorage.setItem('yazgi_before_v37',raw);}clearTransient();s=migrateState(x);$('newModal').classList.remove('show');render();if(s.pendingEventId||s.pendingDecision)activateLifeTab();if(!s.alive)showHeirModal();save();}catch(e){console.error(e);s=null;$('newModal').classList.remove('show');notice('Kayıt okunamadı; mevcut kayıt korunuyor. Yeni yaşam açmadan önce tarayıcı verisini yedekle.');}}
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


/* v21 — 50+ active elder-life decisions. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='elder_care_offer_v21')){
 EVENT_DECK.push(
  {id:'elder_child_advice_v21',cat:'Tecrübe',min:50,max:100,w:7,cool:18,req:'hasAdultChild',target:'adultChild',text:'Yetişkin çocuğun {name}, kendi ocağında zor bir karar verirken senin tecrübene başvurdu.',choices:[
   ['Yaşadıklarından örnek ver',{happiness:3,prestige:2,targetRel:4,targetTrust:5,targetRespect:6,elder:{purpose:5,standing:2,lessons:1,note:'Yetişkin çocuğuna kendi tecrübenle yol gösterdin.'}}],
   ['Kararı kendisinin vermesini söyle',{happiness:2,targetRel:2,targetTrust:3,targetRespect:4,elder:{purpose:2,standing:1,note:'Çocuğunun kendi kararını vermesine alan açtın.'}}]
  ]},
  {id:'elder_old_rival_peace_v21',cat:'Tecrübe',min:55,max:100,w:5,cool:30,req:'hasRival',target:'rival',text:'Yıllardır yolunun kesiştiği hasmın {name}, eski meselenin artık iki tarafı da yorduğunu söyledi.',choices:[
   ['Barış elini uzat',{happiness:4,prestige:3,targetRel:12,targetTrust:7,targetGrudge:-28,resolveRival:true,elder:{purpose:7,standing:3,reconciliations:1,note:'Eski bir husumeti yaşlılıkta barışla kapattın.'}}],
   ['Mesafeyi koru',{prestige:1,targetRel:-1,targetGrudge:-4,elder:{purpose:-1,note:'Eski hasımla mesafeyi korumayı seçtin.'}}]
  ]},
  {id:'elder_care_offer_v21',cat:'Yaşlılık',min:60,max:100,w:7,cool:20,req:'hasAdultChild',target:'adultChild',text:'{name}, son zamanlarda daha çabuk yorulduğunu fark edip yükünün bir kısmını üstlenmeyi teklif etti.',choices:[
   ['Desteğini kabul et',{health:2,happiness:4,targetRel:5,targetTrust:5,elder:{purpose:4,careSupport:12,note:'Ailenden gelen desteği kabul ettin.'}}],
   ['Şimdilik kendi düzenini sürdür',{happiness:1,targetRespect:3,elder:{standing:1,careSupport:-2,note:'Yükünü şimdilik kendi taşımayı seçtin.'}}]
  ]},
  {id:'elder_successor_question_v21',cat:'Görev',min:50,max:100,w:6,cool:22,req:'hasWorkplaceJunior',target:'workplaceJunior',text:'Çırak/yardımcın {name}, bir gün senin taşıdığın sorumluluğu üstlenmeye hazır olup olmadığını sordu.',choices:[
   ['Onu ciddi biçimde yetiştirmeye başla',{prestige:2,targetRel:4,targetTrust:5,targetRespect:7,elder:{purpose:6,standing:3,lessons:1,note:'Görev çevrende bir halef yetiştirmeye ağırlık verdin.'}}],
   ['Henüz erken olduğunu söyle',{targetRespect:3,targetTrust:-1,elder:{standing:1,note:'Haleflik için henüz erken olduğuna karar verdin.'}}]
  ]}
 );
}


/* v23 — adult children, family branches and grandchildren. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='adult_child_own_path_v23')){
 EVENT_DECK.push(
  {id:'adult_child_own_path_v23',cat:'Soy',min:36,max:100,w:7,cool:20,req:'hasAdultChild',target:'adultChild',text:'Yetişkin çocuğun {name}, aileden gördüğü yol ile kendi istediği hayat arasında kaldığını sana açtı.',choices:[
   ['Kendi kararını destekle',{happiness:2,targetRel:4,targetTrust:5,targetRespect:3,familyBranch:{autonomy:8,careerMomentum:3,parentInfluence:-3,note:'Yetişkin çocuğunun kendi kararını vermesine açıkça alan tanıdın.'}}],
   ['Ailenin açtığı yolu hatırlat',{prestige:1,targetRel:-1,targetTrust:-2,targetRespect:4,familyBranch:{autonomy:-5,careerMomentum:5,parentInfluence:8,note:'Ailenin imkân ve sorumluluklarını önüne koyup daha yönlendirici davrandın.'}}]
  ]},
  {id:'adult_child_family_future_v23',cat:'Ocak',min:36,max:100,w:6,cool:24,req:'hasAdultChildPartner',target:'adultChild',text:'{name}, kendi ocağının geleceğini ve çocuk sahibi olup olmamayı senin yanında konuşmaya başladı.',choices:[
   ['Dinle, kararı onlara bırak',{happiness:2,targetRel:3,targetTrust:5,familyBranch:{autonomy:5,familyReadiness:3,parentInfluence:-2,note:'Aile planı konuşulurken kararı onların vermesine alan tanıdın.'}}],
   ['Soyun devamını istediğini açıkça söyle',{prestige:1,targetRel:1,targetTrust:-1,targetRespect:2,familyBranch:{familyReadiness:9,parentInfluence:7,familyPlanYears:2,note:'Soyun devamı isteğini açıkça söyledin; karar yine onların hayatında kalacak.'}}]
  ]},
  {id:'grandchild_legacy_v23',cat:'Soy',min:45,max:100,w:7,cool:18,req:'hasGrandchild',target:'grandchild',text:'Torunun {name}, eski aile hikâyelerini ve senden önce yaşayanları merak edip yanına geldi.',choices:[
   ['Aile geçmişini uzun uzun anlat',{happiness:4,prestige:1,targetRel:6,targetTrust:5,targetRespect:8,familyBranch:{householdSupport:2,note:'Torununa aile geçmişini anlatarak kuşaklar arasındaki bağı güçlendirdin.'}}],
   ['Birlikte vakit geçirip sorularını dinle',{happiness:3,targetRel:5,targetTrust:6,targetRespect:3,familyBranch:{householdSupport:1,note:'Torununla sakin bir zaman geçirip onun sorularını dinledin.'}}]
  ]}
 );
}


/* v24 — marriage betrayal, separation settlement and child adjustment. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='marriage_betrayal_v24')){
 EVENT_DECK.push(
  {id:'marriage_betrayal_v24',cat:'Ocak',min:18,max:100,w:10,cool:36,actions:['wait','romance','work','npc','housing','parenting'],target:'partner',req:['married','marriageBetrayalRisk'],
   text:'{name} ile ocağındaki uzun süren gerilim arasında, başka biriyle gizli bir yakınlık kurduğuna dair açık işaretler önüne geldi.',choices:[
    ['Yüzleş ve gerçeği açıkça konuş',{happiness:-4,targetRel:-6,targetTrust:-8,targetGrudge:6,marriageCrisis:{mode:'confront',evidence:55,evidenceGain:20}}],
    ['Bir şans daha ver',{happiness:-2,targetRel:2,targetTrust:-3,targetGrudge:-2,marriageCrisis:{mode:'forgive',evidence:50}}],
    ['Bu ihlalden sonra ocağı ayır',{happiness:-6,marriageCrisis:{mode:'separate',evidence:75}}]
   ]},
  {id:'separation_child_adjustment_v24',cat:'Aile',min:0,max:100,w:30,cool:0,delayed:true,target:'child',
   text:'{detail} {name}, ayrı haneler arasında yeni düzene alışırken seninle konuşmak istiyor.',choices:[
    ['Onu dinle ve iki ebeveynle bağını koru',{happiness:2,targetRel:5,targetTrust:6,targetGrudge:-4}],
    ['Yeni düzenin kurallarını net anlat',{targetRespect:4,targetTrust:2,targetRel:1}]
   ]}
 );
}


/* v25 — grief, funeral attendance, memorials and caregiving strain. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='grief_shared_memory_v25')){
 EVENT_DECK.push(
  {id:'grief_shared_memory_v25',cat:'Aile',min:5,max:110,w:7,cool:14,req:['hasActiveGrief','hasCloseKin'],target:'closeKin',
   text:'{name}, yakın zamanda kaybettiğiniz kişinin bir hatırasını anlatınca ikiniz de sustunuz.',choices:[
    ['Hatırayı birlikte konuş',{happiness:2,targetRel:4,targetTrust:5,targetGrudge:-3,bereavement:{grief:-8}}],
    ['Bugün bu konuyu açmak istemediğini söyle',{happiness:-1,targetRel:-1,targetTrust:-1,bereavement:{grief:2}}]
   ]},
  {id:'caregiver_strain_v25',cat:'Sağlık',min:10,max:110,w:8,cool:16,req:'caregiverStrain',
   text:'Uzun süredir bir yakınının bakımını taşımak kendi gücünü de tüketmeye başladı.',choices:[
    ['Bakımı aile içinde paylaş',{health:2,happiness:2,bereavement:{strain:-12}}],
    ['Yükü tek başına sürdür',{health:-2,happiness:-2,prestige:1,bereavement:{strain:5}}]
   ]}
 );
}


/* v28 — persistent health conditions, adaptation and social support. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='long_health_support_v28')){
 EVENT_DECK.push(
  {id:'long_health_support_v28',cat:'Sağlık',min:8,max:110,w:7,cool:18,req:['hasLongTermCondition','hasCloseKin'],target:'closeKin',
   text:'{name}, günlük işlerin bazılarını seninle paylaşmayı teklif etti.',choices:[
    ['Desteği kabul et',{happiness:3,targetRel:4,targetTrust:5,longHealth:{management:8}}],
    ['Kendi düzenini koru',{prestige:1,longHealth:{management:1}}]
   ]},
  {id:'long_health_flare_v28',cat:'Sağlık',min:10,max:110,w:8,cool:14,req:['hasLongTermCondition','lowHealthManagement'],
   text:'Süregelen sağlık yükün bu ay günlük işlerde daha fazla kendini gösterdi.',choices:[
    ['Yükü hafifletip dinlen',{happiness:1,longHealth:{management:6,health:2}}],
    ['Aynı tempoyu sürdür',{prestige:1,health:-2,longHealth:{management:-4}}]
   ]}
 );
}


/* v29 — reputation, gossip and community memory. */
if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='rival_false_rumor_v29')){
 EVENT_DECK.push(
  {id:'rival_false_rumor_v29',cat:'Oba',min:12,max:110,w:7,cool:20,req:'hasRival',target:'rival',
   text:'{name}, sözünde durmadığını ve çıkarına göre konuştuğunu çevrede anlatmaya başladı.',choices:[
    ['Toyda kendi sözünü açıkça anlat',{happiness:1,targetRel:-2,targetTrust:-1,reputation:{kind:'false_rumor',text:'Bir rakibin sözünde durmadığını iddia ediyor.',truth:false,polarity:-1,severity:20,reliability:-1,sourceTarget:true}}],
    ['Şimdilik karşılık verme',{happiness:-1,reputation:{kind:'false_rumor',text:'Bir rakibin sözünde durmadığını çevrede anlatıyor.',truth:false,polarity:-1,severity:36,reliability:-3,sourceTarget:true}}]
   ]},
  {id:'good_name_request_v29',cat:'Oba',min:16,max:110,w:5,cool:24,req:'hasTrustedPerson',target:'trusted',
   text:'{name}, çevrede sözünün güvenilir bulunmasından dolayı bir anlaşmazlıkta şahitlik etmeni istedi.',choices:[
    ['Sözünün arkasında dur',{prestige:1,targetRel:3,targetTrust:4,reputation:{kind:'word',text:'Bir anlaşmazlıkta verdiğin sözü açıkça taşıdığın anlatılıyor.',truth:true,polarity:1,severity:18,honor:2,reliability:4,sourceTarget:true}}],
    ['Bu işe karışma',{targetRel:-1,reputation:{rumor:false,reliability:-1,text:'Bir topluluk meselesinde geri durmayı seçtin.'}}]
   ]}
 );
}

if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='family_conflict_spillover_v30')){
 EVENT_DECK.push({id:'family_conflict_spillover_v30',cat:'Aile',min:8,max:110,w:7,cool:12,req:'hasFamilyConflict',target:'familyConflictPair',text:'{name} ile {other} arasındaki gerilim yine ortaya çıktı: {conflict}',choices:[
  ['İkisini de dinleyip arayı bulmaya çalış',{prestige:1,targetRel:1,targetTrust:1,otherRel:1,otherTrust:1,linkScore:4,linkTrust:3,linkGrudge:-5}],
  ['Bu kez karışma',{happiness:1}]
 ]});
}

if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='child_training_report_v31')){
 EVENT_DECK.push({id:'child_training_report_v31',cat:'Aile',min:18,max:100,w:7,cool:12,req:'hasChildTrainingV31',target:'childTrainingStudent',text:'{name} için {training} hakkında yıllık değerlendirme geldi. Eğitici bazı güçlü yanların yanında eksik kalan taraflardan da söz ediyor.',choices:[
  ['Eksiklerini birlikte kapat',{targetRel:2,targetTrust:2}],
  ['Daha sıkı çalışmasını iste',{targetRespect:2,targetTrust:-1}],
  ['Önce kendi fikrini dinle',{targetRel:3,targetTrust:3}]
 ]});
}

if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='horse_sick_v32')){
 EVENT_DECK.push({id:'horse_sick_v32',cat:'At Ocağı',min:12,max:100,w:5,cool:18,req:'hasSickHorseV32',
 text:'{horse} hastalandı. At ocağında nasıl davranacaksın?',
 choices:[['Otacı yardımı al',{wealth:-2}],['Dinlenmesine izin ver',{}],['Bir şey yapma',{}]]});
}

if(typeof EVENT_DECK!=='undefined'&&Array.isArray(EVENT_DECK)&&!EVENT_DECK.some(e=>e.id==='purpose_doubt_v33')){
 EVENT_DECK.push({id:'purpose_doubt_v33',cat:'Yaşam',min:16,max:100,w:7,cool:18,req:'hasPurposeDoubtV33',
  text:'Yıllardır peşinden gittiğin ülkü ağırlaştı. Yolda ilerleyemediğini hissediyorsun. Bundan sonra ne yapacaksın?',
  choices:[['Yoluma devam edeceğim',{}],['Başka birinden yol gösterimi iste',{}],['Bu ülküden vazgeç',{}]]});
}
