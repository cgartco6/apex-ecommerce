async function loadClientDashboard(user_id){
  const res = await fetch(`/dashboard/client?user_id=${user_id}`);
  const data = await res.json();
  const container = document.getElementById('orders');
  if(container) data.orders.forEach(o=>{
    const div = document.createElement('div');
    div.innerText = `Order ${o.id} - Total: $${o.total} - Status: ${o.status}`;
    container.appendChild(div);
  });
}

async function loadOwnerDashboard(secret_key){
  const res = await fetch(`/dashboard/owner?secret_key=${secret_key}`);
  const data = await res.json();
  if(data.status==='error') return alert(data.msg);
  const ordersDiv = document.getElementById('orders');
  const usersDiv = document.getElementById('users');
  data.orders.forEach(o=>{
    const div = document.createElement('div');
    div.innerText = `Order ${o.id} - User ${o.user_id} - Total: $${o.total} - Status: ${o.status}`;
    ordersDiv.appendChild(div);
  });
  data.users.forEach(u=>{
    const div = document.createElement('div');
    div.innerText = `User ${u.username} - Email: ${u.email} - Role: ${u.role}`;
    usersDiv.appendChild(div);
  });
}
