const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let db,active,reviewQueue=[],reviewIndex=0;
let st=JSON.parse(localStorage.getItem('vq')||'{"name":"","done":[],"seen":[],"scores":{},"last":"","streak":0,"words":{}}');
if(!st.words)st.words={};
const today=()=>new Date().toISOString().slice(0,10), addDays=n=>{let d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const key=(setId,word)=>setId+'::'+word;
function defaultWord(){return{seen:0,correct:0,wrong:0,stage:'new',interval:0,due:today(),last:null,ease:2.3,lapses:0,streak:0}}
function wordState(setId,word){let k=key(setId,word);return st.words[k]||(st.words[k]=defaultWord())}
function allWords(){return db.sets.flatMap(s=>s.words.map(w=>({...w,setId:s.id,setTitle:s.title,icon:s.icon,state:wordState(s.id,w.word)})))}
function save(){localStorage.setItem('vq',JSON.stringify(st));stats()}
function startDay(){let t=today(),d=st.last?(new Date(t)-new Date(st.last))/864e5:0;if(!st.last)st.streak=1;else if(d===1)st.streak++;else if(d>1)st.streak=1;st.last=t;save()}
function stats(){if(!db)return;let words=allWords(),n=st.done.length;$('#stats').textContent=`${n} of 20 stages complete • ${words.filter(w=>w.state.seen).length} words practised`;$('.bar i').style.[...] 
function isWeak(x){return x.wrong>=2||(x.seen>=2&&x.correct/Math.max(1,x.seen)<.6)||x.lapses>=1}
function render(){let q=$('#search').value.toLowerCase();$('#grid').innerHTML=db.sets.filter(s=>(s.title+s.arabic+s.words.map(w=>w.word).join()).toLowerCase().includes(q)).map(s=>{let weak=s.words.fil[...]
function record(setId,word,quality){let x=wordState(setId,word);x.seen++;x.last=today();if(quality<2){x.wrong++;x.lapses++;x.streak=0;x.interval=quality===0?0:1;x.ease=Math.max(1.3,x.ease-.2);x.stage=[...]
window.openSet=id=>{active=db.sets.find(s=>s.id===id);if(!st.seen.includes(id))st.seen.push(id);save();$('#inside').innerHTML=`<div class="top"><div><small>STAGE ${id} OF 20</small><h2>${active.icon} [...]
function build(){let pool=allWords();$('#quizBox').innerHTML=active.words.map((w,i)=>{let o=[w.word,...pool.filter(x=>x.word!==w.word).sort(()=>Math.random()-.5).slice(0,3).map(x=>x.word)].sort(()=>Ma[...]
window.check=()=>{let n=0;$$('.q').forEach(q=>{let p=q.querySelector('.sel'),ok=p?.dataset.v===q.dataset.a;q.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(x.dataset.v===q.dataset.a)x.classLi[...]
function launchReview(mode,setId){let words=allWords();if(setId)words=words.filter(w=>w.setId===setId);if(mode==='due')reviewQueue=words.filter(w=>w.state.seen&&w.state.due<=today()&&w.state.stage!=='[...]
window.startSetReview=id=>{lesson.close();launchReview('set',id)};
function renderReview(mode){if(!reviewQueue.length){$('#reviewIn').innerHTML=`<div class="top"><h2>Smart Review</h2><button onclick="review.close()">✕</button></div><div class="emptyReview"><div cla[...]
function showReviewCard(){if(reviewIndex>=reviewQueue.length){$('#reviewIn').innerHTML=`<div class="top"><h2>Review complete</h2><button onclick="review.close()">✕</button></div><div class="emptyRev[...]
window.revealAnswer=()=>{$('#answer').hidden=false;$('#reveal').style.display='none';$('#rating').classList.add('show')};window.rate=q=>{let w=reviewQueue[reviewIndex];record(w.setId,w.word,q);reviewI[...]
function dl(b,n){let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click()}window.csv=()=>{let r=[['Word','Arabic','Definition','Example'],...active.words.map(w=>[w.word,w[...]
window.certificate=()=>{let name=(st.name||'Vocabulary Explorer').replace(/[<>]/g,'');$('#certIn').innerHTML=`<div class="certificate"><div><div style="font-size:5rem">🏅</div><small>VOCABULARY QUES[...]
$('#name').oninput=e=>{st.name=e.target.value;save()};$('#search').oninput=render;$('#go').onclick=()=>openSet(db.sets.find(s=>!st.done.includes(s.id))?.id||1);$('#reviewDue').onclick=()=>launchReview('due');
fetch('vocabulary.json').then(r=>r.json()).then(x=>{db=x;startDay();render();stats()}).catch(()=>alert('Publish on GitHub Pages or use a local web server.'));