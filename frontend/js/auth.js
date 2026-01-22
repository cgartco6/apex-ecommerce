const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const data = new FormData(registerForm);
    const res = await fetch('/auth/register',{
      method:'POST',
      body:data
    });
    const json = await res.json();
    document.getElementById('message').innerText = json.status==='success' ? 'Registered!' : json.msg;
  });
}

const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const data = new FormData(loginForm);
    const res = await fetch('/auth/login',{
      method:'POST',
      body:data
    });
    const json = await res.json();
    document.getElementById('message').innerText = json.status==='success' ? 'Logged in!' : json.msg;
  });
  }
