/* Original YAZGI simulation rules; reference assets, text and code are not used. */
const SAVE_VERSION=3,ADULT_AGE=18;
const CAREER_RULES={
 herder:{age:10,skills:{riding:10}},hunter:{age:12,skills:{archery:20,riding:10}},horsekeeper:{age:12,skills:{riding:25}},smith_apprentice:{age:12,skills:{craft:17}},
 smith:{age:18,skills:{craft:40},months:12,track:'craft'},bard:{age:16,skills:{speech:35},months:6,track:'culture'},merchant:{age:18,skills:{trade:35},months:12,track:'trade'},caravan:{age:18,skills:{trade:30,riding:25},months:6,track:'trade'},
 scribe:{age:18,skills:{literacy:50},months:12,track:'state'},envoy:{age:22,skills:{literacy:55,speech:45},months:24,track:'state'},alp:{age:18,skills:{combat:45,archery:30,riding:30}},raider:{age:18,skills:{combat:50,riding:40},months:6,track:'military'},
 tarkan:{age:24,skills:{combat:66,speech:40},months:24,track:'military',campaigns:3,prestige:35},bey:{age:28,skills:{speech:60,literacy:40},months:36,track:'state',prestige:45}
};
const ASSET_AGES={horse:12,bow:12,flock:18,sword:18,armor:18,yurt:18,caravan_share:18,smithy:18};
const AILMENTS={fever:{name:'Ateşli rahatsızlık',min:0,loss:2,duration:3},chill:{name:'Soğukta güçten düşme',min:0,loss:1,duration:2},injury:{name:'İyileşen yara',min:12,loss:2,duration:4},joints:{name:'Eklem ağrısı',min:50,loss:1,duration:8}};
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
 const a=n.age??18,g=n.goal||'family';
 if(a<8)return 'Çocuk';
 if(a<12)return g==='mastery'?'Usta yanında gözlemci':g==='family'?'Oba işlerine yardım ediyor':'Sürü yanında yetişiyor';
 if(a<18){
  if(g==='war'||n.traits?.includes('cesur'))return pick(['At binmeyi öğreniyor','Okçuluk öğreniyor','Güreş talimi görüyor']);
  if(g==='mastery')return pick(['Demirci yanında yetişiyor','At bakımı öğreniyor','Zanaat öğreniyor']);
  if(g==='wisdom')return pick(['Destan dinliyor','Bitig öğreniyor']);
  return pick(['Sürü yanında yetişiyor','Oba işlerini öğreniyor']);
 }
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
 [...s.parents,...s.siblings,...(s.relatives||[]),...s.friends,...s.rivals,...s.children,s.partner,...s.military.comrades].forEach(visit);return out;
}
function careerIssue(r){
 if(!r)return 'Görev bulunamadı.';const a=CAREER_RULES[r.id];
 if(s.age<a.age)return `${a.age} yaşında açılır`;
 if(s.skill<r.skill-10)return `Genel beceri ${Math.max(0,r.skill-10)} gerekiyor`;
 for(const [k,v]of Object.entries(a.skills))if(s.skills[k]<v)return `${skillName(k)} ${v} gerekiyor`;
 if(a.months&&(s.experience[a.track]||0)<a.months)return `${a.months} ay ${pathName(a.track)} tecrübesi gerekiyor`;
 if(a.prestige&&s.prestige<a.prestige)return `${a.prestige} itibar gerekiyor`;
 if(a.campaigns&&s.military.campaigns<a.campaigns)return `${a.campaigns} sefer gerekiyor`;
 if(r.path==='military'&&s.health<40)return 'En az 40 sağlık gerekiyor';
 if(s.exile&&['state','military'].includes(r.path))return 'Önce sürgün meselesini çözmelisin';return '';
}
function careerRequirements(r){const a=CAREER_RULES[r.id];return `${a.age} yaş • genel beceri ${Math.max(0,r.skill-10)} • ${Object.entries(a.skills).map(([k,v])=>skillName(k)+' '+v).join(' • ')}${a.months?' • '+a.months+' ay '+pathName(a.track):''}${a.prestige?' • itibar '+a.prestige:''}${a.campaigns?' • '+a.campaigns+' sefer':''}`;}
function getFamilyGroup(group){if(group==='partner')return s.partner?[s.partner]:[];if(group==='comrades')return s.military?.comrades||[];return ['parents','siblings','relatives','friends','rivals','children'].includes(group)?(s[group]||[]):[];}
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
function takeRole(id){const r=D.careers.find(x=>x.id===id);if(!r)return;performAction({kind:'role',id},()=>{if(Math.random()<Math.min(.95,.5+(s.skill-r.skill)/100+s.prestige/300)){s.role=r.name;s.path=r.path;apply({prestige:r.prestige});log(r.name+' görevini üstlendin.'+(s.age<18?' Büyüklerin gözetiminde yetişeceksin.':''),'good');if(id==='bey')unlock('bey');}else log('Bu kez başvurun kabul edilmedi.');},'Görev görüşmeleriyle bir ay geçti.');}
function workRole(){performAction({kind:'work'},()=>{const r=D.careers.find(x=>x.name===s.role);if(r){skillGain(Object.keys(CAREER_RULES[r.id].skills)[0],2);apply({wealth:rng(1,3),prestige:1});}},'Görevin üzerinde çalıştın.');}
function retireRole(){performAction({kind:'retire'},()=>{s.retiredRole=s.role;s.role=null;apply({health:2,happiness:2});},'Ağır görevini bıraktın.');}
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
function campaignResult(){s.military.active=false;s.military.dutyMonths=0;const roll=Math.random();if(roll<.12){s.captive=true;unlock('captive');log('Seferde tutsak düştün.','bad');}else if(roll<.32){s.military.wounds++;apply({health:-rng(8,18),prestige:4});acquireAilment('injury');}else{apply({wealth:rng(4,12),prestige:rng(4,8)});s.flags.recent_campaign=true;log('Seferden ganimet ve tecrübeyle döndün.','good');}}
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
  if(n.age>=18&&n.age%rng(4,7)===0&&n.traits.includes('hirsli')){const old=n.role;n.role=npcCareerFor(n);if(old!==n.role){n.roleHistory.push({year,role:n.role});rememberNPC(n,'career','Görevini değiştirip '+n.role+' oldu.',2);}}
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
 s.assets=equal?old.assets.filter((_,j)=>j%heirs.length===i):old.will===c.id?[...old.assets]:[];s=migrateState(s);unlock('heir');log(safeText(old.name)+' ardından soyun '+safeText(s.name)+' ile devam ediyor.','major');$('heirModal').classList.remove('show');activateLifeTab();render();save();
}
function eventRequirementOK(ev){
 const check=r=>{if(!r)return true;if(Array.isArray(r))return r.every(check);if(r.startsWith('flag:'))return !!s.flags[r.slice(5)];if(r.startsWith('notflag:'))return !s.flags[r.slice(8)];if(r.startsWith('asset:'))return s.assets.includes(r.slice(6));if(r.startsWith('career:'))return !careerIssue(D.careers.find(x=>x.id===r.slice(7)));const num=r.match(/^(skill|wealth|prestige)(\d+)$/);if(num)return s[num[1]]>=+num[2];
 const map={single:()=>!s.partner?.alive&&!s.married,married:()=>s.age>=18&&s.married&&s.partner?.alive&&s.partner.age>=18,hasChild:()=>s.children.some(x=>x.alive),hasAdultChild:()=>s.children.some(x=>x.alive&&x.age>=18),trainableChild:()=>s.children.some(x=>x.alive&&x.age>=7&&x.age<18),hasGrandchild:()=>s.children.some(x=>x.alive&&x.children>0),hasFriend:()=>s.friends.some(x=>x.alive),hasRival:()=>s.rivals.some(x=>x.alive),hasCloseKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].some(x=>x.alive),hasTrustedPerson:()=>allNPCs().some(x=>x.alive&&(x.bonds?.trust||0)>=55),military:()=>s.age>=18&&s.military.served,activeCampaign:()=>s.age>=18&&s.military.active,recentCampaign:()=>!!s.flags.recent_campaign,captive:()=>s.captive,exile:()=>s.exile};return map[r]?!!map[r]():false;};return check(ev.req);
}
function eventChoiceIssue(ch){const x=ch[1]||{};if(x.wealth<0&&s.wealth<-x.wealth)return `${-x.wealth} servet gerekiyor`;if(x.setRole)return careerIssue(D.careers.find(r=>r.name===x.setRole));return '';}
function eligibleContextEvents(context=s.lastAction||{}){return EVENT_DECK.filter(e=>{
 if(s.age<e.min||s.age>e.max||e.once&&s.eventHistory.includes(e.id)||!e.fallback&&(s.eventCooldowns[e.id]||0)>0)return false;
 if(e.months&&!e.months.includes(context.month||currentMonth())||e.actions&&!e.actions.includes(context.kind))return false;
 if(s.captive&&e.cat!=='Tutsaklık'||!s.captive&&e.cat==='Tutsaklık')return false;
 if(s.military.active&&!['Sefer','Sağlık'].includes(e.cat)||!s.military.active&&e.cat==='Sefer'&&e.id!=='spoils_choice')return false;
 if(s.exile&&['Boy','Devlet','Ocak'].includes(e.cat)||!s.exile&&e.cat==='Sürgün')return false;
 return eventRequirementOK(e)&&e.choices.some(ch=>!eventChoiceIssue(ch));
 });}
function triggerContextEvent(force=false,context=s.lastAction||{}){
 if(!s?.alive||s.pendingEventId||s.pendingDecision)return false;const eligible=eligibleContextEvents(context);let pool=eligible.filter(e=>!e.fallback);if(!pool.length){pool=eligible.filter(e=>e.fallback);if(s.exile&&!s.captive&&!s.military.active)pool=pool.filter(e=>e.cat==='Sürgün');}if(!pool.length)return false;
 const ev=weightedPickEvents(pool);let target=null;
 const targetPools={
  child:()=>s.children.filter(n=>n.alive),trainingChild:()=>s.children.filter(n=>n.alive&&n.age>=7&&n.age<18),friend:()=>s.friends.filter(n=>n.alive),
  rival:()=>s.rivals.filter(n=>n.alive),parent:()=>s.parents.filter(n=>n.alive),sibling:()=>s.siblings.filter(n=>n.alive),relative:()=> (s.relatives||[]).filter(n=>n.alive),
  closeKin:()=>[...s.parents,...s.siblings,...s.children,...(s.relatives||[])].filter(n=>n.alive),trusted:()=>allNPCs().filter(n=>n.alive&&(n.bonds?.trust||0)>=55)
 };
 if(ev.target&&targetPools[ev.target]){const candidates=targetPools[ev.target]();if(candidates.length)target=pick(candidates);}
 s.pendingEventId=ev.id;s.pendingEventContext={age:s.age,year:s.year+s.age,month:context.month||currentMonth(),kind:context.kind||'wait',targetId:target?.id||null};s.decisionOffset=0;activateLifeTab();return true;
}
function hasDirectAgency(e){return s.age>=5&&e.agency!=='guardian';}
function applyEventChoice(x={}){
 apply(Object.fromEntries(Object.entries(x).filter(([k])=>['health','happiness','skill','prestige','wealth'].includes(k))));
 for(const k of Array.isArray(x.setFlag)?x.setFlag:[x.setFlag])if(k)s.flags[k]=true;for(const k of [x.clearFlag,x.clearFlag2])if(k)delete s.flags[k];
 if(x.path)s.path=x.path;for(const k of Object.keys(s.skills))if(x[k])skillGain(k,x[k]);
 if(x.setRole){const r=D.careers.find(r=>r.name===x.setRole);if(r&&!careerIssue(r)){s.role=r.name;s.path=r.path;}}
 if(x.asset&&!s.assets.includes(x.asset))s.assets.push(x.asset);if(x.wound){s.military.wounds+=x.wound;acquireAilment('injury');}if(x.clearExile)s.exile=false;
}
function chooseContextEvent(i){
 const ev=activeContextEvent();if(!ev||!s.alive)return;const ch=ev.choices[i];if(!ch)return;const issue=eventChoiceIssue(ch);if(issue){notice(issue);return;}
 const context=s.pendingEventContext||{age:s.age,year:s.year+s.age,month:currentMonth()},target=allNPCs().find(n=>n.id===context.targetId),fx=ch[1]||{};applyEventChoice(fx);
 if(target?.alive&&(fx.targetRel||fx.targetTrust||fx.targetRespect||fx.targetFear||fx.targetGrudge)){
  adjustNPC(target,{rel:fx.targetRel||0,trust:fx.targetTrust||0,respect:fx.targetRespect||0,fear:fx.targetFear||0,grudge:fx.targetGrudge||0},eventDisplayText(ev,context)+' — '+ch[0]);
 }
 if(target?.alive){if(ev.id==='child_ill')target.health=clamp(target.health+(i===0?4:7));if(ev.id==='friend_quarrel')target.rel=clamp(target.rel+(i===0?6:-6));if(ev.id==='child_training_choice'){target.skills=target.skills||{};const k=i===0?'archery':i===1?'craft':'speech';target.skills[k]=clamp((target.skills[k]||0)+3);}}
 if(ev.once&&!s.eventHistory.includes(ev.id))s.eventHistory.push(ev.id);if(!ev.fallback)s.eventCooldowns[ev.id]=ev.cool||12;
 s.eventArchive.push({id:ev.id,cat:ev.cat,...context,choice:i,actor:hasDirectAgency(ev)?'self':'guardian'});s.eventArchive=s.eventArchive.slice(-300);log(`<b>${ev.cat}:</b> ${ev.text} <i>${hasDirectAgency(ev)?'':'Ailen/bakıcıların: '}${ch[0]}</i>`);
 s.pendingEventId=null;s.pendingEventContext=null;s.decisionOffset=0;window._contextEvent=null;checkAchievements();if(s.health<=0)die();render();save();
}
function eventDisplayText(e,ctx){const target=allNPCs().find(n=>n.id===ctx?.targetId);return String(e?.text||'').replaceAll('{name}',target?.name||'Yakının');}
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
function renderRole(){ $('tab-gorev').innerHTML=(s.role?`<div class="card"><h3>${safeText(s.role)}</h3><p>${s.age<18?'Büyüklerin gözetiminde':'Mevcut görevin'}</p></div><div class="grid2">${actionButton('Görevinde çalış',{kind:'work'},'workRole()')}${s.age>=50?actionButton('Ağır görevi bırak',{kind:'retire'},'retireRole()'):''}</div>`:'')+`<div class="grid2">${D.careers.map(r=>actionButton(r.name,{kind:'role',id:r.id},`takeRole('${r.id}')`,careerRequirements(r))).join('')}</div>`;}
function renderActivities(){const cats=[...new Set(PERIOD_ACTIVITIES.map(x=>x.cat))];$('tab-faaliyet').innerHTML=cats.map(cat=>`<h3 class="sectionTitle">${cat}</h3><div class="grid2">${PERIOD_ACTIVITIES.filter(x=>x.cat===cat).map(a=>actionButton(a.icon+' '+a.name,{kind:'period',id:a.id},`doPeriodActivity('${a.id}')`,a.desc+' • '+a.age+' yaş')).join('')}</div>`).join('');}
function renderAssets(){ $('tab-varlik').innerHTML=`<div class="grid2">${D.assets.filter(a=>!s.assets.includes(a.id)).map(a=>actionButton(a.icon+' '+a.name,{kind:'asset',id:a.id},`buyAsset('${a.id}')`,a.cost+' servet • '+ASSET_AGES[a.id]+' yaş')).join('')}</div><h3>Sahip oldukların</h3><div class="grid2">${s.assets.map(id=>{const a=D.assets.find(x=>x.id===id);return a?actionButton(a.icon+' '+a.name,{kind:'asset',id,sell:true},`sellAsset('${id}')`,'Takas değeri '+Math.floor(a.cost*.6)) :'';}).join('')}</div><h3>Üretim</h3><div class="grid2">${[['herd','Sürüyü yönet'],['forge','Ocakta üret'],['caravan','Kervan payını yönet']].map(([id,n])=>actionButton(n,{kind:'venture',id},`manageVenture('${id}')`)).join('')}</div>`;}
function familyCard(n,group,index){
 normalizeNPC(n,n.type);
 const options=[['spend','Vakit geçir'],...(s.age>=8?[['confide','Dertleş']]:[]),...(s.age>=10?[['help','Yardım et'],['work','Birlikte çalış'],['gift','Armağan']]:[]),['advice','Öğüt al'],...(group==='rivals'?[['reconcile','Uzlaş']]:[])];
 const actions=n.alive&&s.age>=5?options.map(([id,label])=>{const issue=accessIssue({kind:'npc',group,index,id});return `<button class="mini" ${issue?'disabled':''} title="${safeText(issue)}" onclick="interactNPC('${group}',${index},'${id}')">${label}</button>`;}).join(''):'';
 const traits=npcTraitNames(n).map(x=>`<span class="trait">${safeText(x)}</span>`).join('');
 const b=normalizeBonds(n),memory=recentNPCMemory(n);
 return `<div class="card familycard"><div><h3>${n.alive?'':'† '}${safeText(n.name)}</h3><p>${safeText(n.type)} • ${n.age} yaş • ${safeText(n.role)}<br>İlişki ${n.rel}${n.partner?' • Eş: '+safeText(n.partner.name):''}${n.children?' • Çocuk: '+n.children:''}</p>
 <div class="traitrow">${traits}</div><div class="npcgoal">Amaç: ${safeText(npcGoalName(n))}</div>
 <div class="rbar"><i style="width:${n.rel}%"></i></div><div class="bondrow"><span class="bond good">Güven ${b.trust}</span><span class="bond">Saygı ${b.respect}</span>${b.grudge?'<span class="bond bad">Kin '+b.grudge+'</span>':''}${b.fear>15?'<span class="bond bad">Çekince '+b.fear+'</span>':''}</div>
 ${memory?`<div class="memoryline">Hatırladığı: ${safeText(memory)}</div>`:''}</div><div class="actions">${actions}</div></div>`;
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
 for(const k of ['parents','siblings','relatives','friends','rivals','children','assets','achievements','eventHistory','eventArchive','crimeRecord','timeline','ailments'])if(!Array.isArray(x[k]))x[k]=[];
 for(const k of ['experience','careerMonths','eventCooldowns','flags','skills'])x[k]=x[k]||{};x.will=x.will||'equal';x.pregnancy=x.pregnancy||null;x.legacy=x.legacy||{generation:1,familyName:x.tribe,past:[]};x.legacy.past=x.legacy.past||[];s=x;ensureSkills();ensureMilitary();
 if(x.partner){x.partner.age=x.partner.age??Math.max(16,x.age);x.partner.gender=x.partner.gender||(x.gender==='male'?'female':'male');}
 allNPCs().forEach(n=>normalizeNPC(n,n.type));if(x.partner&&!x.partner.alive)x.married=false;
 if(x.role){const r=D.careers.find(r=>r.name===x.role);if(r&&x.age<r.age){x.deferredRole=x.role;x.role=null;}}
 if(x.married&&(x.age<18||x.partner?.age<18)){x.deferredMarriage=true;x.married=false;}
 if(x.age<18){x.military.active=false;x.military.dutyMonths=0;x.pregnancy=null;x.pendingDecision=null;}
 if(x.pendingDecision?.id!=='campaign_call')x.pendingDecision=null;x.ailments=x.ailments.filter(a=>AILMENTS[a.id]&&x.age>=AILMENTS[a.id].min);
 if(x.age>=18&&x.military.called&&!x.military.served&&!x.flags.military_declined&&!x.pendingDecision)x.pendingDecision={id:'campaign_call',age:x.age,year:x.year+x.age,month:currentMonth()};
 if(x.pendingEventId){const e=EVENT_DECK.find(e=>e.id===x.pendingEventId);if(!e||x.age<e.min||x.age>e.max||!eventRequirementOK(e)||!e.choices.some(c=>!eventChoiceIssue(c))){x.pendingEventId=null;x.pendingEventContext=null;}else x.pendingEventContext=x.pendingEventContext||{age:x.age,year:x.year+x.age,month:Math.max(1,currentMonth()-1)};}
 if(!x.alive){x.pendingEventId=null;x.pendingDecision=null;}return x;
}
function save(){if(s)try{localStorage.setItem('yazgi_full_v1',JSON.stringify(s));}catch(e){notice('Kayıt yazılamadı; tarayıcı depolama alanını kontrol et.');}}
function load(){try{const raw=localStorage.getItem('yazgi_full_v1');if(!raw)return;const x=JSON.parse(raw);if(x.version!==SAVE_VERSION&&!localStorage.getItem('yazgi_before_v3'))localStorage.setItem('yazgi_before_v3',raw);clearTransient();s=migrateState(x);$('newModal').classList.remove('show');render();if(s.pendingEventId||s.pendingDecision)activateLifeTab();if(!s.alive)showHeirModal();save();}catch(e){console.error(e);s=null;$('newModal').classList.remove('show');notice('Kayıt okunamadı; mevcut kayıt korunuyor. Yeni yaşam açmadan önce tarayıcı verisini yedekle.');}}
function configureRules(){
 D.assets.push({id:'smithy',name:'Demir Ocağı',icon:'🔥',cost:60});D.achievements.push({id:'trained',name:'Ustanın Emeği',desc:'Bir uzmanlıkta 60 seviyesine ulaş.'},{id:'reconciled',name:'Barış Sözü',desc:'Bir rakiple uzlaş.'});D.achievements.find(x=>x.id==='adult').desc='18 yaşına ulaş.';D.careers.forEach(r=>r.age=CAREER_RULES[r.id].age);
 const adult=new Set(['Sefer','Tutsaklık','Sürgün','Töre','Ocak','Ticaret','Kervan','Devlet','Elçilik','Servet','Sürü']);
 for(const e of EVENT_DECK){
  if(adult.has(e.cat)||['marriage_pressure','family_debt','winter_shortage','summer_drought','wolf_attack','bandit_tracks','feud_challenge','feud_end'].includes(e.id))e.min=Math.max(18,e.min);
  if(e.id==='foal_friend')e.min=5;if(e.id==='smith_offer'){e.min=12;e.choices[0][1].craft=3;}if(e.id==='scribe_offer')e.choices[0][1].literacy=3;
  if(e.id==='river_crossing'){e.text='Göç sırasında oba bir ırmağın kıyısında bekliyor. Büyüklerin sana hafif bir iş gösterdi.';e.choices[0][0]='Büyüklerinin yanında yardım et';}if(e.id==='lost_lamb')e.choices[0][0]='Bir büyüğünle izine bak';
  if(e.id==='friend_quarrel'){e.req='hasFriend';e.target='friend';}if(e.id==='child_training_choice'){e.req='trainableChild';e.target='trainingChild';}if(e.id==='child_ill')e.target='child';if(e.id==='grandchild_visit')e.req='hasGrandchild';
  if(e.id==='winter_shortage')e.months=[10,11,12];if(e.id==='summer_drought'){e.months=[4,5,6];e.req='asset:flock';}if(e.id==='exile_return')e.req=['exile','flag:exile_loyal'];
  if(e.cat==='Sefer')e.req=[e.req,'activeCampaign'].filter(Boolean);if(e.id==='spoils_choice'){e.req='recentCampaign';e.choices.forEach(c=>c[1].clearFlag='recent_campaign');}
  if(e.id==='merchant_offer')e.actions=['period','venture','work','role'];if(e.id==='minor_wound')e.actions=['training','activity','work','military'];if(e.id==='wolf_attack')e.actions=['activity','work','venture'];
  for(const c of e.choices){const r=D.careers.find(r=>r.name===c[1]?.setRole);if(r){e.min=Math.max(e.min,r.age);e.req=[e.req,'career:'+r.id].filter(Boolean);}}
  if(e.id==='smith_own_hearth'){e.req=['flag:smith_journeyman','wealth60'];e.choices[0][1].wealth=-60;e.choices[0][1].asset='smithy';}if(e.id==='herd_expansion'){e.choices[0][1].wealth=-25;e.choices[0][1].asset='flock';}if(e.id==='caravan_partner'){e.req=['flag:trader','wealth65'];e.choices[0][1].wealth=-65;e.choices[0][1].asset='caravan_share';}
 }
 EVENT_DECK.push(
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
 {id:'sibling_path',cat:'Aile',min:12,max:70,w:3,cool:30,target:'sibling',req:'hasCloseKin',text:'{name} geleceği hakkında fikrini sordu.',choices:[['Kendi yolunu seçmesini söyle',{targetRel:4,targetTrust:7,targetRespect:3}],['Ailenin ihtiyacını öncelemesini söyle',{prestige:1,targetRel:2,targetRespect:5,targetGrudge:2}]]}
 );
}
configureRules();
init();
