const STEPS = [
    {
        t: "শুরু",
        d: "লিস্টে <code>10</code>, <code>20</code>, <code>30</code> আছে। আমরা প্রথম নোড (<code>10</code>) সরাবো।",
        c: [],
        r: () => render('init')
    },
    {
        t: "খালি চেক",
        d: "<code>if (head == NULL)</code> — লিস্ট খালি কি না পরীক্ষা করা হচ্ছে। খালি না হলে পরের ধাপে যাবো।",
        c: [1],
        r: () => render('init')
    },
    {
        t: "Temp রাখো",
        d: "<code>Node* temp = head</code> — প্রথম নোডটিকে <code>temp</code> পয়েন্টার দিয়ে ধরে রাখা হলো, মেমরি থেকে হারিয়ে যাবে না।",
        c: [4],
        r: () => render('temp')
    },
    {
        t: "Head সরাও",
        d: "<code>head = head->next</code> — <code>head</code> পয়েন্টারটি দ্বিতীয় নোডে (<code>20</code>) সরানো হলো। এখন <code>20</code>-ই নতুন <code>head</code>।",
        c: [6],
        r: () => render('shift')
    },
    {
        t: "সংযোগ ছিন্ন",
        d: "<code>temp->next = NULL</code> — <code>10</code> এবং <code>20</code>-এর মধ্যকার সংযোগ ছিন্ন করা হলো।",
        c: [8],
        r: () => render('isolate')
    },
    {
        t: "মুছে ফেলো",
        d: "<code>delete temp</code> — মেমরি থেকে <code>10</code> চিরতরে মুছে ফেলা হলো।",
        c: [10],
        r: () => render('delete')
    },
    {
        t: "সম্পন্ন",
        d: "সফলভাবে প্রথম নোড সরানো হয়েছে। নতুন লিস্ট: <code>20 &#8594; 30</code>। সময় লেগেছে মাত্র <strong>O(1)</strong>!",
        c: [],
        r: () => render('final')
    }
];

const CODE_LINES = [
    "void pop_front() {",
    "  if (head == NULL) return;",
    "  ",
    "  // ১. temp কে head-এ রাখো",
    "  Node* temp = head;",
    "  // ২. head কে সামনে সরাও",
    "  head = head->next;",
    "  // ৩. সংযোগ ছিন্ন করো",
    "  temp->next = NULL;",
    "  // ৪. পুরনো নোড মুছো",
    "  delete temp;",
    "}"
];

let cur = 0;

function mkArrow(cut = false) {
    if (cut) return `<div style="width:42px;text-align:center;font-size:14px;color:#f472b6;margin-bottom:30px;font-weight:900;letter-spacing:-2px">&#10005;</div>`;
    return `<svg class="node-arrow" viewBox="0 0 42 18" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5">
        <path d="M3 9h32M27 4l8 5-8 5"/>
    </svg>`;
}

function render(mode) {
    let h = '<div class="node-row">';

    // Node 10
    if (mode !== 'final') {
        let cls = 'node';
        if (mode === 'init')  cls += ' is-head';
        if (mode === 'temp' || mode === 'shift' || mode === 'isolate') cls += ' is-del';
        if (mode === 'delete') cls += ' is-gone';

        h += `<div class="node-container">
            <div class="${cls}">
                <span class="node-val">10</span>
                <span class="node-ptr">${mode === 'isolate' ? 'NULL' : 'next &rarr;'}</span>
            </div>
            <div class="ptr-row">
                ${mode === 'init' ? '<span class="lbl lbl-head">head</span>' : ''}
                ${(mode === 'temp'||mode === 'shift'||mode === 'isolate') ? '<span class="lbl lbl-temp">temp</span>' : ''}
            </div>
        </div>`;

        if (mode === 'isolate')      h += mkArrow(true);
        else if (mode === 'delete')  h += `<div style="width:20px;margin-bottom:30px;"></div>`;
        else                         h += mkArrow(false);
    }

    // Node 20
    const n2head = ['shift','isolate','delete','final'].includes(mode);
    h += `<div class="node-container">
        <div class="node ${n2head ? 'is-head' : ''}">
            <span class="node-val">20</span>
            <span class="node-ptr">next &rarr;</span>
        </div>
        <div class="ptr-row">${n2head ? '<span class="lbl lbl-head">head</span>' : ''}</div>
    </div>`;
    h += mkArrow(false);

    // Node 30
    h += `<div class="node-container">
        <div class="node is-tail">
            <span class="node-val">30</span>
            <span class="node-ptr">NULL</span>
        </div>
        <div class="ptr-row"><span class="lbl lbl-tail">tail</span></div>
    </div>`;

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
