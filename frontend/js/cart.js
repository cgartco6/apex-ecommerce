let cart = [];
function updateCartUI(){
  const container = document.getElementById('cartItems') || document.getElementById('products');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach((item,i)=>{
    total += item.price*item.qty;
    const div = document.createElement('div');
    div.innerHTML = `${item.name} - $${item.price} x ${item.qty} <button onclick="remove(${i})">Remove</button>`;
    container.appendChild(div);
  });
  document.getElementById('cartTotal').innerText = total.toFixed(2);
}

function remove(index){ cart.splice(index,1); updateCartUI(); }

updateCartUI();
