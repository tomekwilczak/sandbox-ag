"use strict";(()=>{window.Webflow||(window.Webflow=[]);var a=document.getElementById("phoneNumber"),n=document.querySelector(".form-input_phone");a.addEventListener("blur",()=>{let o=a.value.trim();o===""||/^\d{9}$/.test(o)?(n.classList.remove("error_state"),$(".error_phone").fadeOut()):(n.classList.add("error_state"),$(".error_phone").fadeIn())});Webflow.push(function(){$(document).off("submit"),$("form").submit(function(o){o.preventDefault();let e=$(this),r=$("[type=submit]",e),l=r.val(),i=r.attr("data-wait"),u=e.attr("method"),f=e.attr("action"),m=e.serialize();i&&r.val(i),$.ajax(f,{data:m,method:u}).done(t=>{console.log(t.result),e.hide().siblings(".w-form-done").show().siblings(".w-form-fail").hide();let s=t.result;if(console.log("resultUrl:",s),s){window.location=s;return}}).fail((t,s,c)=>{t.status!==200&&t.responseText.includes("User already exists")?$("#form-error-user-exists").show():e.siblings(".w-form-done").hide().siblings(".w-form-fail").show()}).always(()=>{r.val(l)})})});})();