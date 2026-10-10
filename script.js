const $=(selector,scope=document)=>scope.querySelector(selector);const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
$$('.quote-band p').forEach(quote=>{quote.textContent=quote.textContent.replace(/^â€œ/, '“').replace(/^““/, '“')});
$$('.button').forEach(button=>button.addEventListener('click',event=>{const rect=button.getBoundingClientRect();const ripple=document.createElement('span');ripple.className='ripple';ripple.style.left=`${event.clientX-rect.left-6}px`;ripple.style.top=`${event.clientY-rect.top-6}px`;button.appendChild(ripple);ripple.addEventListener('animationend',()=>ripple.remove())}));

window.addEventListener('load',()=>document.body.classList.add('loaded'));

const cursorDot=document.querySelector('.cursor-dot');
const cursorRing=document.querySelector('.cursor-ring');
if(cursorDot&&cursorRing&&!matchMedia('(pointer: coarse)').matches){
  const interactiveSelectors='a, button, input, select, textarea, .project-card, .service-row, .menu-toggle, .filter-bar button, .archive-card, .philosophy-list span';
  let mouseX=window.innerWidth/2, mouseY=window.innerHeight/2;
  let ringX=mouseX, ringY=mouseY;
  const moveCursor=(event)=>{mouseX=event.clientX; mouseY=event.clientY; cursorDot.style.transform=`translate(${mouseX}px, ${mouseY}px)`};
  document.addEventListener('pointermove',moveCursor);
  const animate=()=>{ringX += (mouseX - ringX) * 0.18; ringY += (mouseY - ringY) * 0.18; cursorRing.style.transform=`translate(${ringX - 18}px, ${ringY - 18}px)`; cursorDot.style.transform=`translate(${mouseX}px, ${mouseY}px)`; requestAnimationFrame(animate)};
  requestAnimationFrame(animate);
  document.querySelectorAll(interactiveSelectors).forEach(el=>{
    el.addEventListener('pointerenter',()=>cursorRing.classList.add('cursor-hover'));
    el.addEventListener('pointerleave',()=>cursorRing.classList.remove('cursor-hover'));
  });
}

const menuToggle=$('.menu-toggle'),mobileMenu=$('.mobile-menu');
menuToggle?.addEventListener('click',()=>{mobileMenu.classList.toggle('open');document.body.classList.toggle('menu-open')});
$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>mobileMenu.classList.remove('open')));
const sharedNavigation=[['Journal','journal.html'],['Materials','materials.html']];$$('.desktop-nav,.mobile-menu nav').forEach(nav=>sharedNavigation.forEach(([label,href])=>{if(nav.querySelector(`a[href="${href}"]`))return;const link=document.createElement('a');link.href=href;link.textContent=label;if(nav.classList.contains('mobile-menu')||nav.closest('.mobile-menu')){const arrow=document.createElement('span');arrow.textContent='↗';link.appendChild(arrow)}const contact=nav.querySelector('a[href="contact.html"]');nav.insertBefore(link,contact||null)}));
const updateHeader=()=>$$('.site-header').forEach(header=>header.classList.toggle('scrolled',scrollY>40));
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));
$$('.philosophy-list span').forEach(item=>{const setTone=()=>{const section=item.closest('.philosophy');section.setAttribute('data-tone',item.dataset.tone);const detail=$('.philosophy-detail',section);const visual=$('.philosophy-visual',section);const image=$('.philosophy-visual img',section);if(detail){$('span',detail).textContent=item.dataset.title;$('p',detail).textContent=item.dataset.copy}if(image){visual.classList.add('is-changing');image.onload=()=>visual.classList.remove('is-changing');image.src=item.dataset.image;image.alt=`${item.dataset.title} atmosphere in an Earthy Haven interior`}};item.addEventListener('pointerenter',setTone);item.addEventListener('focus',setTone)});
$$('.intro-image').forEach(frame=>{frame.addEventListener('pointermove',event=>{if(matchMedia('(hover: hover)').matches){const rect=frame.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;frame.style.setProperty('--image-x',`${x*1.8}%`);frame.style.setProperty('--image-y',`${y*1.8}%`)}});frame.addEventListener('pointerleave',()=>{frame.style.setProperty('--image-x','0%');frame.style.setProperty('--image-y','0%')})});

const slider=$('[data-slider]');
if(slider){const range=$('input',slider),before=$('.ba-before',slider),handle=$('.ba-handle',slider);const update=()=>{before.style.width=`${range.value}%`;handle.style.left=`${range.value}%`};range.addEventListener('input',update);update()}

const topButton=$('.back-top');window.addEventListener('scroll',()=>topButton?.classList.toggle('visible',scrollY>700));topButton?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

$$('.filter-bar button').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('.filter-bar button').forEach(item=>item.classList.remove('active'));button.classList.add('active');$$('.archive-card').forEach(card=>card.classList.toggle('hide',filter!=='all'&&card.dataset.type!==filter))}));

$$('.site-footer').forEach(footer=>{if($('.footer-inquiry',footer))return;const form=document.createElement('form');form.className='inquiry-form footer-inquiry';form.innerHTML='<div class="footer-form-heading"><p class="eyebrow light">Begin a conversation</p><h3>Have a space in mind?</h3><p>Tell us a little about it and we will be in touch.</p></div><div class="footer-form-fields"><div class="field"><label for="footer-name">Name</label><input id="footer-name" name="name" required placeholder="Your name"></div><div class="field"><label for="footer-email">Email</label><input id="footer-email" name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label for="footer-type">Project type</label><select id="footer-type" name="project-type"><option>Project type</option><option>Residential</option><option>Commercial</option><option>Renovation</option></select></div><div class="field footer-message"><label for="footer-message">A few words</label><input id="footer-message" name="message" placeholder="What are you imagining?"></div><button class="button button-light form-submit" type="submit">Start the conversation <span>↗</span></button></div>';footer.insertBefore(form,footer.querySelector('.footer-bottom'))});
$$('.inquiry-form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const submit=$('.form-submit',form);submit.innerHTML='Thank you — we will be in touch ↗';submit.disabled=true}));
