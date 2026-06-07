
let DATA=[];

fetch('projects.json')
.then(r=>r.json())
.then(d=>{
 DATA=d;
 init();
});

const ids=['reviewer','section','track','supervisor'];

function init(){
 populateAllFilters();
 ids.forEach(id=>document.getElementById(id).addEventListener('change',onFilterChange));
 search.addEventListener('input',render);
 render();
}

function populateSelect(el, values, label, keep=''){
 el.innerHTML='';
 el.add(new Option(label,''));
 values.forEach(v=>el.add(new Option(v,v)));
 if(values.includes(keep)) el.value=keep;
}

function applyFilters(ignore=null){
 const reviewerVal = ignore==='reviewer' ? '' : reviewer.value;
 const sectionVal = ignore==='section' ? '' : section.value;
 const trackVal = ignore==='track' ? '' : track.value;
 const supervisorVal = ignore==='supervisor' ? '' : supervisor.value;

 const q = search.value.toLowerCase();

 return DATA.filter(r=>
 (!reviewerVal || r.reviewer===reviewerVal) &&
 (!sectionVal || r.gender_section===sectionVal) &&
 (!trackVal || r.track===trackVal) &&
 (!supervisorVal || r.supervisor===supervisorVal) &&
 (!q || JSON.stringify(r).toLowerCase().includes(q))
 );
}

function populateAllFilters(){
 const rv=reviewer.value||'';
 const sv=section.value||'';
 const tv=track.value||'';
 const pv=supervisor.value||'';

 populateSelect(reviewer,
 [...new Set(applyFilters('reviewer').map(x=>x.reviewer).filter(Boolean))].sort(),
 'كل المحكمين', rv);

 populateSelect(section,
 [...new Set(applyFilters('section').map(x=>x.gender_section).filter(Boolean))].sort(),
 'كلا الشطرين', sv);

 populateSelect(track,
 [...new Set(applyFilters('track').map(x=>x.track).filter(Boolean))].sort(),
 'كل التخصصات', tv);

 populateSelect(supervisor,
 [...new Set(applyFilters('supervisor').map(x=>x.supervisor).filter(Boolean))].sort(),
 'كل المشرفين', pv);
}

function onFilterChange(){
 populateAllFilters();
 render();
}

function currentResults(){
 const q = search.value.toLowerCase();
 return DATA.filter(r=>
 (!reviewer.value || r.reviewer===reviewer.value) &&
 (!section.value || r.gender_section===section.value) &&
 (!track.value || r.track===track.value) &&
 (!supervisor.value || r.supervisor===supervisor.value) &&
 (!q || JSON.stringify(r).toLowerCase().includes(q))
 );
}

function render(){
 const rows=currentResults();

 projectsCount.textContent=rows.length;
 tracksCount.textContent=new Set(rows.map(x=>x.track)).size;
 supervisorsCount.textContent=new Set(rows.map(x=>x.supervisor)).size;
 reviewersCount.textContent=new Set(rows.map(x=>x.reviewer)).size;

 cards.innerHTML = rows.length ? rows.map(r=>`
 <div class="col-lg-4 col-md-6">
  <div class="cardx">
   <div class="title">${escapeHtml(r.project_title)}</div><hr>
   <div class="meta"><b>رقم المشروع:</b> ${escapeHtml(r.project_id)}</div>
   <div class="meta"><b>قائد المشروع:</b> ${escapeHtml(r.group_leader)}</div>
   <div class="meta"><b>اسم المشرف:</b> ${escapeHtml(r.supervisor)}</div>
   <div class="meta"><b>التخصص:</b> ${escapeHtml(r.track)}</div>
   <div class="meta"><b>اسم المحكم:</b> ${escapeHtml(r.reviewer)}</div>
   <a class="btn btn-primary w-100 mt-2" target="_blank" href="${r.poster_link}">عرض البوستر</a>
  </div>
 </div>`).join('')
 : '<div class="col-12"><div class="alert alert-warning">لا توجد نتائج مطابقة.</div></div>';
}

function escapeHtml(s){
 return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
