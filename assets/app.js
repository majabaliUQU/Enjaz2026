
let allData=[];

fetch('projects.json')
.then(r=>r.json())
.then(data=>{
 allData=data;
 populateFilters(data);
 render();
});

function unique(data,key){return [...new Set(data.map(x=>x[key]).filter(Boolean))].sort();}

function fillSelect(id,items,label){
 const s=document.getElementById(id);
 s.innerHTML=`<option value="">${label}</option>`;
 items.forEach(v=>s.add(new Option(v,v)));
}

function currentFiltered(){
 const reviewer=reviewerFilter.value;
 const section=sectionFilter.value;
 const track=trackFilter.value;
 const supervisor=supervisorFilter.value;
 const search=searchBox.value.toLowerCase();

 return allData.filter(r=>
 (!reviewer || r.reviewer===reviewer) &&
 (!section || r.gender_section===section) &&
 (!track || r.track===track) &&
 (!supervisor || r.supervisor===supervisor) &&
 JSON.stringify(r).toLowerCase().includes(search)
 );
}

function populateFilters(data){
 fillSelect('reviewerFilter',unique(data,'reviewer'),'كل المحكمين');
 fillSelect('trackFilter',unique(data,'track'),'كل التخصصات');
 fillSelect('supervisorFilter',unique(data,'supervisor'),'كل المشرفين');

 sectionFilter.innerHTML='';
 ['','شطر الطلاب','شطر الطالبات'].forEach(v=>{
   sectionFilter.add(new Option(v||'كلا الشطرين',v));
 });

 document.querySelectorAll('input,select').forEach(x=>{
   x.addEventListener('input',()=>{
      updateDependentFilters();
      render();
   });
 });
}

function updateDependentFilters(){
 const filtered=currentFiltered();

 fillSelect('trackFilter',unique(filtered,'track'),'كل التخصصات');
 fillSelect('supervisorFilter',unique(filtered,'supervisor'),'كل المشرفين');
 fillSelect('reviewerFilter',unique(filtered,'reviewer'),'كل المحكمين');
}

function render(){
 const filtered=currentFiltered();

 projectsCount.textContent=filtered.length;
 tracksCount.textContent=new Set(filtered.map(x=>x.track)).size;
 supervisorsCount.textContent=new Set(filtered.map(x=>x.supervisor)).size;
 reviewersCount.textContent=new Set(filtered.map(x=>x.reviewer)).size;

 cards.innerHTML=filtered.map(r=>`
<div class="col-lg-4 col-md-6">
<div class="card project-card">
<div class="card-body">
<div class="project-title">${r.project_title}</div>
<hr>
<p><b>رقم المشروع:</b> ${r.project_id}</p>
<p><b>قائد المشروع:</b> ${r.group_leader}</p>
<p><b>اسم المشرف:</b> ${r.supervisor}</p>
<p><b>التخصص:</b> ${r.track}</p>
<p><b>اسم المحكم:</b> ${r.reviewer}</p>
<a target="_blank" class="btn btn-primary w-100" href="${r.poster_link}">عرض البوستر</a>
</div></div></div>`).join('');
}
