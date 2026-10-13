const stateKey='pyforge-progress-v1';
const progress=JSON.parse(localStorage.getItem(stateKey)||'{}');
let current={level:null,topic:null,section:null,mode:'learn'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const totalTopics=CURRICULUM.reduce((n,l)=>n+l.total,0);
function key(l,t){return `${l}::${t}`}
function isDone(l,t){return !!progress[key(l,t)]}
function save(){localStorage.setItem(stateKey,JSON.stringify(progress));render();}
function completed(){return Object.values(progress).filter(Boolean).length}
function updateStats(){
 const done=completed(), pct=Math.round(done/totalTopics*100);
 $('#heroPct').textContent=pct+'%'; $('#doneNum').textContent=done; $('#topicNum').textContent=totalTopics;
 $('#sidePct').textContent=pct+'%'; $('#sideBar').style.width=pct+'%'; $('#sideCount').textContent=`${done} / ${totalTopics} topics completed`;
}
function renderNav(){
 $('#levelNav').innerHTML=CURRICULUM.map(l=>`<button class="level-link" data-jump="level-${l.id}"><i class="level-dot"></i><span>L${l.id} · ${esc(l.title)}</span><span>${l.total}</span></button>`).join('');
 $$('[data-jump]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:'smooth'}));
}
function render(){
 const q=($('#search')?.value||'').toLowerCase().trim(), f=$('#filter')?.value||'all';
 $('#levels').innerHTML=CURRICULUM.map(l=>{
  let visible=0;
  const sections=l.sections.map(s=>{
   const items=s.items.filter(t=>(!q||`${t} ${s.title} ${l.title}`.toLowerCase().includes(q))&&(f==='all'||(f==='done'?isDone(l.id,t):!isDone(l.id,t))));
   visible+=items.length;
   if(!items.length)return '';
   return `<div class="section-title">${esc(s.title)}</div><div class="topic-grid">${items.map(t=>`
    <div class="topic ${isDone(l.id,t)?'done':''}">
      <input class="check" type="checkbox" ${isDone(l.id,t)?'checked':''} data-level="${l.id}" data-topic="${esc(t)}" />
      <span class="topic-name" data-open="${l.id}" data-topic="${esc(t)}" data-section="${esc(s.title)}">${esc(t)}</span><span class="topic-arrow" data-open="${l.id}" data-topic="${esc(t)}" data-section="${esc(s.title)}">›</span>
    </div>`).join('')}</div>`;
  }).join('');
  if(!visible)return '';
  const done=l.sections.flatMap(s=>s.items).filter(t=>isDone(l.id,t)).length, pct=Math.round(done/l.total*100);
  return `<section class="level-section" id="level-${l.id}"><div class="level-header"><div><div class="eyebrow">LEVEL ${l.id}</div><h2>${esc(l.title)}</h2><p>${l.total} learning checkpoints</p></div><div class="level-progress">${done}/${l.total} · ${pct}%<div class="progress-track"><i style="width:${pct}%"></i></div></div></div>${sections}</section>`;
 }).join('');
 updateStats(); bindTopics();
}
function bindTopics(){
 $$('.check').forEach(c=>c.onchange=()=>{progress[key(c.dataset.level,c.dataset.topic)]=c.checked;save();if(c.checked)toast('Checkpoint completed ✓')});
 $$('[data-open]').forEach(x=>x.onclick=()=>openLesson(+x.dataset.open,x.dataset.topic,x.dataset.section));
}
const seed={
 'print()':{learn:`<h3>What it is</h3><p><code>print()</code> sends values to standard output, usually your terminal. It is one of the simplest ways to observe what a program is doing.</p><pre><code>name = "Ada"\nprint("Hello", name)\n# Hello Ada</code></pre><div class="callout"><b>Think of it as:</b> your program talking back to you.</div><h3>Key details</h3><p>You can print multiple values, choose a separator with <code>sep</code>, and control the ending with <code>end</code>.</p>`,task:`<div class="task-box"><h3>Mini task</h3><p>Print your name, branch and a target for this semester on three lines. Then rewrite it so all three values appear on one line.</p><pre><code># Your turn</code></pre></div>`,quiz:`<div class="quiz-box"><h3>Quick check</h3><p>What does <code>print("A", "B", sep="-")</code> display?</p><button class="option" data-correct="1">A-B</button><button class="option" data-correct="0">A B</button><button class="option" data-correct="0">AB</button></div>`},
 'variables':{learn:`<h3>Variables are names bound to objects</h3><p>In Python, assignment does not create a typed box. It binds a name to an object.</p><pre><code>x = 10\nx = "hello"</code></pre><p>The same name can later refer to an object of a different type. This is dynamic typing.</p><div class="callout"><b>Important:</b> names, objects and references are separate concepts. This becomes crucial when you learn mutability.</div>`,task:`<div class="task-box"><h3>Prediction task</h3><p>Before running it, predict what each line prints:</p><pre><code>x = [1, 2]\ny = x\ny.append(3)\nprint(x)\nprint(y)</code></pre></div>`,quiz:`<div class="quiz-box"><h3>Quick check</h3><p>What is the best mental model for <code>x = 10</code>?</p><button class="option" data-correct="1">Bind the name x to the integer object 10</button><button class="option" data-correct="0">Create a permanent integer variable box</button></div>`},
 'if':{learn:`<h3>Decision making</h3><p><code>if</code> evaluates a condition. If it is truthy, its indented block executes. <code>elif</code> and <code>else</code> handle alternatives.</p><pre><code>score = 82\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelse:\n    grade = "C"</code></pre><p>Indentation is part of Python's syntax, not decoration.</p>`,task:`<div class="task-box"><h3>Mini task</h3><p>Write a program that accepts an integer and reports whether it is positive, negative or zero. Then extend it to distinguish even/odd.</p></div>`,quiz:`<div class="quiz-box"><h3>Quick check</h3><p>Why does Python use indentation here?</p><button class="option" data-correct="1">It defines code blocks</button><button class="option" data-correct="0">Only for visual formatting</button></div>`}
};
function defaultLesson(topic,level,section){return {learn:`<h3>Understand ${esc(topic)}</h3><p>This checkpoint belongs to <b>Level ${level}: ${esc(CURRICULUM[level-1].title)}</b>, under <b>${esc(section)}</b>.</p><p>Start by identifying what the feature is, what problem it solves, and what Python rule controls its behavior. Then test a tiny example before using it in a larger program.</p><div class="callout"><b>Best learning loop:</b> read → predict → run → explain the output → modify the code → solve a small task.</div><h3>Next step</h3><p>Use <b>Generate deeper explanation</b> to have the AI tutor teach this exact checkpoint with examples, edge cases, common mistakes and interview-style questions.</p>`,task:`<div class="task-box"><h3>Active recall task</h3><p>Without looking up the syntax, write the smallest program you can that demonstrates <b>${esc(topic)}</b>. Then modify it to create one edge case.</p></div>`,quiz:`<div class="quiz-box"><h3>Self-test</h3><p>Can you explain <b>${esc(topic)}</b> in your own words, show a 5-line example, and name one common mistake?</p></div>`};}
function openLesson(level,topic,section){current={level,topic,section,mode:'learn'};$('#lessonLevel').textContent=`LEVEL ${level} · ${section}`;$('#lessonTitle').textContent=topic;$('#lessonSub').textContent='Learn the concept, complete the task, then test yourself.';showLesson('learn');$('#lessonModal').classList.remove('hidden')}
function lessonData(){return seed[current.topic]||defaultLesson(current.topic,current.level,current.section)}
function showLesson(mode){current.mode=mode;$$('.lesson-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===mode));$('#lessonBody').innerHTML=lessonData()[mode];$$('.option').forEach(o=>o.onclick=()=>{o.classList.add(o.dataset.correct==='1'?'correct':'wrong');if(o.dataset.correct==='1')toast('Correct ✓')});}
async function askAI(prompt,mode='chat'){
 const context=`Current lesson: Level ${current.level||'none'} — ${current.topic||'none'} (${current.section||'none'}). Curriculum scope: ${CURRICULUM.map(l=>`L${l.id} ${l.title}`).join('; ')}.`;
 const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:prompt,mode,context})});
 if(!r.ok)throw new Error((await r.text())||'AI request failed'); return (await r.json()).answer;
}
function markdownLite(s){return esc(s).replace(/```([\s\S]*?)```/g,'<pre><code>$1</code></pre>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')}
$('#aiExplain').onclick=async()=>{const btn=$('#aiExplain');btn.disabled=true;btn.textContent='Generating…';try{$('#lessonBody').innerHTML='<div class="callout">✦ Building a deeper lesson for this topic…</div>';const ans=await askAI(`Teach me ${current.topic} in depth. Include mental model, syntax, 2 progressively harder examples, common mistakes, edge cases, interview questions and a practical task. Keep it educational and precise.`,'lesson');$('#lessonBody').innerHTML='<p>'+markdownLite(ans)+'</p>'}catch(e){$('#lessonBody').innerHTML='<div class="callout">AI is not configured yet. Add <code>OPENAI_API_KEY</code> to your Vercel project environment variables.</div>'}finally{btn.disabled=false;btn.textContent='✦ Generate deeper explanation'}};
$('#markDone').onclick=()=>{progress[key(current.level,current.topic)]=true;save();toast('Checkpoint completed ✓');$('#lessonModal').classList.add('hidden')};
function openAI(){ $('#aiModal').classList.remove('hidden'); $('#chatInput').focus() }
$('#aiFab').onclick=openAI;$('#askTop').onclick=openAI;
$('#chatForm').onsubmit=async e=>{e.preventDefault();const input=$('#chatInput'),q=input.value.trim();if(!q)return;addMsg('user',q);input.value='';const typing=document.createElement('div');typing.className='msg ai';typing.innerHTML='<b>AI Tutor</b><p>Thinking…</p>';$('#chatMessages').appendChild(typing);$('#chatMessages').scrollTop=99999;try{const a=await askAI(q);typing.innerHTML='<b>AI Tutor</b><p>'+markdownLite(a)+'</p>'}catch(err){typing.innerHTML='<b>AI Tutor</b><p>AI is not configured. Add <code>OPENAI_API_KEY</code> in Vercel.</p>'}};
function addMsg(who,text){const d=document.createElement('div');d.className='msg '+who;d.innerHTML=`<b>${who==='user'?'You':'AI Tutor'}</b><p>${markdownLite(text)}</p>`;$('#chatMessages').appendChild(d);$('#chatMessages').scrollTop=99999}
$$('.quick-prompts button').forEach(b=>b.onclick=()=>{$('#chatInput').value=current.topic?`${b.textContent} for ${current.topic}`:b.textContent;$('#chatInput').focus()});
$$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.add('hidden'));
$('#search').oninput=render;$('#filter').onchange=render;
$('#resetBtn').onclick=()=>{if(confirm('Reset all learning progress?')){Object.keys(progress).forEach(k=>delete progress[k]);save();toast('Progress reset')}};
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAI()}if(e.key==='Escape'){$$('.modal').forEach(m=>m.classList.add('hidden'))}});
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove('show'),1600)}
renderNav();render();
