async function loadSales(){
    let res = await fetch('/dashboard/sales');
    let data = await res.json();
    document.getElementById('total_revenue').innerText = "$" + data.total_revenue;
    let ordersDiv = document.getElementById('orders_list');
    ordersDiv.innerHTML = "<ul>"+data.orders.map(o=>`<li>Order ${o.id} | User ${o.user_id} | $${o.total} | ${o.status}</li>`).join("")+"</ul>";
}

async function loadSchedule(){
    let res = await fetch('/dashboard/schedule');
    let data = await res.json();
    let div = document.getElementById('schedule_list');
    div.innerHTML = "<ul>"+data.map(d=>`<li>${d.product_name} - ${d.caption} at ${d.post_time} [Posted: ${d.posted}]</li>`).join("")+"</ul>";
}

async function loadEngagement(){
    let res = await fetch('/dashboard/engagement');
    let data = await res.json();
    let div = document.getElementById('engagement_list');
    div.innerHTML = "<ul>"+data.map(d=>`<li>${d.product_name || d.order_id} - ${d.platform}: ${d.likes}👍 ${d.shares}🔁 ${d.comments}💬</li>`).join("")+"</ul>";
}

function refreshAll(){
    loadSales();
    loadSchedule();
    loadEngagement();
}

window.onload = refreshAll;
setInterval(refreshAll, 60000); // refresh every minute
