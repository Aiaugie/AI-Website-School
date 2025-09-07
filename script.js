const chatEl = document.getElementById('chat');
const form = document.getElementById('msgForm');
const messageInput = document.getElementById('message');

function addMessage(who, text){
  const wrap = document.createElement('div');
  wrap.className = 'msg';
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerText = who === 'user' ? 'You' : 'Wisteria Fable';
  const bubble = document.createElement('div');
  bubble.className = who === 'user' ? 'user' : 'ai';
  bubble.innerText = text;
  wrap.appendChild(meta);
  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function sendMessage(text){
  addMessage('user', text);
  addMessage('ai', 'Wisteria Fable is typing...');
  try{
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    // remove the typing message (last AI bubble)
    const last = chatEl.querySelectorAll('.msg');
    const lastNode = last[last.length-1];
    if(lastNode) chatEl.removeChild(lastNode);
    addMessage('ai', data.reply ?? 'Sorry, no reply.');
  } catch(err){
    console.error(err);
    const last = chatEl.querySelectorAll('.msg');
    const lastNode = last[last.length-1];
    if(lastNode) chatEl.removeChild(lastNode);
    addMessage('ai', '[Error contacting server]');
  }
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = messageInput.value.trim();
  if(!text) return;
  messageInput.value = '';
  sendMessage(text);
});