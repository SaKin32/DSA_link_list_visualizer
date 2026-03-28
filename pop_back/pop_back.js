const STEPS = [
    {
        t: "সূচনা",
        d: "লিস্টে <code>10</code>, <code>20</code>, <code>30</code> আছে। আমরা শেষ নোড (<code>30</code>) সরাবো। সমস্যা: <code>tail</code> সরাসরি আগের নোড জানে না, তাই পুরো লিস্ট দেখতে হবে।",
        c: [],
        r: () => render('init')
    },
    {
        t: "খালি চেক",
        d: "<code>if (head == NULL)</code> — লিস্ট খালি কি না পরীক্ষা করা হচ্ছে।",
        c: [1],
        r: () => render('init')
    },
    {
        t: "ট্রাভার্সাল ১",
        d: "<code>Node* temp = head</code> — ট্রাভার্সাল শুরু। <code>temp</code> এখন <code>10</code>-এ আছে।",
        c: [4],
        r: () => render('t1')
    },
    {
        t: "ট্রাভার্সাল ২",
        d: "<code>while (temp->next != tail)</code> — <code>10</code>-এর পরের নোড কি <code>tail</code>? না। তাই <code>temp</code> পরের নোডে (<code>20</code>) যাবে।",
        c: [5, 6],
        r: () => render('t2')
    },
    {
        t: "আগের নোড",
        d: "<code>temp->next</code> এখন <code>tail</code> (<code>30</code>)-কে পয়েন্ট করছে। মানে <code>temp</code>-ই শেষ নোডের আগের নোড — লুপ শেষ!",
        c: [5],
        r: () => render('found')
    },
    {
        t: "সংযোগ ছিন্ন",
        d: "<code>temp->next = NULL</code> — <code>20</code> এবং <code>30</code>-এর মধ্যকার সংযোগ কেটে দেওয়া হলো।",
        c: [8],
        r: () => render('cut')
    },
    {
        t: "নোড মুছো",
        d: "<code>delete tail</code> — মেমরি থেকে <code>30</code> মুছে ফেলা হলো।",
        c: [9],
        r: () => render('delete')
    },
    {
        t: "Tail আপডেট",
        d: "<code>tail = temp</code> — এখন থেকে <code>20</code>-ই লিস্টের নতুন <code>tail</code>।",
        c: [10],
        r: () => render('final')
    }
];

const CODE_LINES = [
    "void pop_back() {",
    "  if (head == NULL) return;",
    "  if (head == tail) { /* একটি নোড */ }",
    "  ",
    "  Node* temp = head;",
    "  while (temp->next != tail) {",
    "    temp = temp->next;",
    "  }",
    "  temp->next = NULL;",
    "  delete tail;",
    "  tail = temp;",
    "}"
];

let cur = 0;

function mkArrow(cut = false, scanHL = false) {
    if (cut) return `<svg class="node-arrow" viewBox="0 0 42 18" fill="none"
        stroke="rgba(248,113,113,0.5)" stroke-width="1.5" stroke-dasharray="4 3">
        <path d="M3 9h32M27 4l8 5-8 5"/>
    </svg>`;
    const c = scanHL ? '#a78bfa' : 'rgba(255,255,255,0.1)';
    const sw = scanHL ? '2' : '1.5';
    return `<svg class="node-arrow" viewBox="0 0 42 18" fill="none" stroke="${c}" stroke-width="${sw}">
        <path d="M3 9h32M27 4l8 5-8 5"/>
    </svg>`;
}

function render(mode) {
    let h = '<div class="node-row">';

    // Node 10
    let n1cls = 'node is-head';
    let n1lbl = '<span class="lbl lbl-head">head</span>';
    if (mode === 't1') { n1cls += ' is-scan'; n1lbl += ' <span class="lbl lbl-temp">temp</span>'; }
    h += `<div class="node-container">
        <div class="${n1cls}">
            <span class="node-val">10</span>
            <span class="node-ptr">next &rarr;</span>
        </div>
        <div class="ptr-row">${n1lbl}</div>
    </div>`;

    const scanHL = ['t1','t2'].includes(mode);
    h += mkArrow(false, scanHL);

    // Node 20
    const scan20 = ['t2','found','cut','delete'].includes(mode);
    let n2cls = 'node' + (scan20 ? ' is-scan' : '');
    let n2lbl = scan20 ? '<span class="lbl lbl-temp">temp</span>' : '';
    if (mode === 'final') { n2cls = 'node is-newtail'; n2lbl = '<span class="lbl lbl-tail">tail</span>'; }
    const n2ptr = (mode === 'cut' || mode === 'delete') ? 'NULL' : 'next &rarr;';
    h += `<div class="node-container">
        <div class="${n2cls}">
            <span class="node-val">20</span>
            <span class="node-ptr">${n2ptr}</span>
        </div>
        <div class="ptr-row">${n2lbl}</div>
    </div>`;

    // Arrow 2→3
    if (mode !== 'final') {
        const isCut = mode === 'cut' || mode === 'delete';
        h += mkArrow(isCut, false);
    }

    // Node 30
    if (mode !== 'final') {
        let n3cls = 'node ' + (mode === 'delete' ? 'is-gone' : 'is-del');
        h += `<div class="node-container">
            <div class="${n3cls}">
                <span class="node-val">30</span>
                <span class="node-ptr">NULL</span>
            </div>
            <div class="ptr-row"><span class="lbl lbl-tail">tail</span></div>
        </div>`;
    }

    h += '</div>';
    document.getElementById('vis').innerHTML = h;
}

function update() {
    const s = STEPS[cur];
    document.getElementById('desc-text').innerHTML = s.d;
    document.getElementById('stepper').innerHTML = STEPS.map((st, i) =>
        `<button class="step-btn ${i===cur?'active':i<cur?'done':''}" onclick="jump(${i})">${st.t}</button>`
    ).join('');
    document.getElementById('code-view').innerHTML = CODE_LINES.map((l, i) =>
        `<span class="code-ln${s.c.includes(i)?' active':''}">${l.replace(/ /g,'&nbsp;')}</span>`
    ).join('');
    s.r();
    document.getElementById('prevBtn').disabled = cur === 0;
    const nb = document.getElementById('nextBtn');
    nb.disabled  = cur === STEPS.length - 1;
    nb.textContent = cur === STEPS.length - 1 ? 'সম্পন্ন ✓' : 'পরের ধাপ →';
}

function next()  { if (cur < STEPS.length-1) { cur++; update(); } }
function prev()  { if (cur > 0) { cur--; update(); } }
function jump(i) { cur = i; update(); }
function reset() { cur = 0; update(); }
update();
