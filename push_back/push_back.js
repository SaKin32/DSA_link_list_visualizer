const INIT_DATA = [10, 20];
const NEW_VAL   = 99;

const STEPS = [
    {
        t: "সূচনা",
        d: "লিস্টে <code>10</code> এবং <code>20</code> আছে। <code>tail</code> পয়েন্টার সরাসরি শেষে থাকা <code>20</code>-কে দেখাচ্ছে। আমরা শেষে <code>99</code> যুক্ত করবো।",
        c: [],
        r: () => draw(INIT_DATA, null, false, false)
    },
    {
        t: "নতুন নোড",
        d: "<code>Node* newNode = new Node(99)</code> মেমরিতে তৈরি হলো। এর <code>next</code> এখন <code>NULL</code>।",
        c: [1],
        r: () => draw(INIT_DATA, NEW_VAL, false, false)
    },
    {
        t: "NULL চেক",
        d: "লিস্ট খালি নয় (<code>head != NULL</code>), তাই আমরা সরাসরি <code>tail</code> ব্যবহার করে শেষে যুক্ত করতে পারবো।",
        c: [2],
        r: () => draw(INIT_DATA, NEW_VAL, false, false)
    },
    {
        t: "সংযোগ তৈরি",
        d: "<code>tail->next = newNode</code> — পুরনো শেষ নোড (<code>20</code>) এখন নতুন নোড (<code>99</code>) কে পয়েন্ট করছে।",
        c: [6],
        r: () => draw(INIT_DATA, NEW_VAL, true, false)
    },
    {
        t: "Tail আপডেট",
        d: "<code>tail = newNode</code> — <code>99</code> এখন লিস্টের নতুন শেষ নোড বা <code>tail</code>।",
        c: [7],
        r: () => draw(INIT_DATA, NEW_VAL, true, true)
    },
    {
        t: "সম্পন্ন",
        d: "<code>tail</code> পয়েন্টার থাকায় পুরো লিস্ট দেখতে হয়নি — সরাসরি <strong>O(1)</strong> সময়ে কাজ শেষ!",
        c: [],
        r: () => draw([...INIT_DATA, NEW_VAL], null, false, true, true)
    }
];

const CODE_LINES = [
    "void push_back(int val) {",
    "  Node* newNode = new Node(val);",
    "  if (head == NULL) {",
    "    head = tail = newNode;",
    "  } else {",
    "    // tail পয়েন্টার সাহায্য করে",
    "    tail->next = newNode;",
    "    tail = newNode;",
    "  }",
    "}"
];

let cur = 0;

function mkArrow(on = false, dashed = false) {
    const c  = on ? '#fb923c' : 'rgba(255,255,255,0.1)';
    const sw = on ? '2' : '1.5';
    const d  = dashed ? 'stroke-dasharray="5 4"' : '';
    return `<svg class="node-arrow" viewBox="0 0 42 18" fill="none"
        stroke="${c}" stroke-width="${sw}" ${d}>
        <path d="M3 9h32M27 4l8 5-8 5"/>
    </svg>`;
}

function draw(base, newVal, linked, tailMoved, final = false) {
    let h = '<div class="node-row">';

    base.forEach((v, i) => {
        const isHead = i === 0;
        const isTail = final ? i === base.length-1 : (!tailMoved && i === base.length-1);
        let cls = 'node';
        if (isHead) cls += ' is-head';
        if (isTail) cls += ' is-tail';

        const isLast   = i === base.length - 1;
        const showNext = i < base.length - 1 || (newVal && !final);
        const arrowOn  = isLast && linked;
        const arrowDash = isLast && !linked && newVal && !final;

        h += `<div class="node-container">
            <div class="${cls}">
                <span class="node-val">${v}</span>
                <span class="node-ptr">${isLast && linked && !final ? 'next &rarr;' : isTail ? 'NULL' : 'next &rarr;'}</span>
            </div>
            <div class="ptr-row">
                ${isHead ? '<span class="lbl lbl-head">head</span>' : ''}
                ${isTail ? '<span class="lbl lbl-tail">tail</span>' : ''}
            </div>
        </div>`;
        if (showNext) h += mkArrow(arrowOn, arrowDash);
    });

    if (newVal && !final) {
        const isTailNow = tailMoved;
        h += `<div class="node-container anim-right">
            <div class="node ${isTailNow ? 'is-newtail' : 'is-new'}">
                <span class="node-val">${newVal}</span>
                <span class="node-ptr">NULL</span>
            </div>
            <div class="ptr-row">
                ${isTailNow
                    ? '<span class="lbl lbl-tail">tail</span>'
                    : '<span class="lbl lbl-new">newNode</span>'}
            </div>
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
