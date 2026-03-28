const INIT_DATA = [20, 30];
const NEW_VAL   = 42;

const STEPS = [
    {
        t: "সূচনা",
        d: "লিস্টে <code>20</code> এবং <code>30</code> আছে। <code>head</code> শুরুতে, <code>tail</code> শেষে। আমরা সামনে <code>42</code> যুক্ত করবো।",
        c: [],
        r: () => draw(INIT_DATA, null, false, false)
    },
    {
        t: "নতুন নোড",
        d: "<code>Node* newNode = new Node(42)</code> মেমরিতে তৈরি হলো। এর <code>next</code> এখন <code>NULL</code>। এটি এখনো লিস্টের অংশ নয়।",
        c: [1],
        r: () => draw(INIT_DATA, NEW_VAL, false, false)
    },
    {
        t: "লিংক তৈরি",
        d: "<code>newNode->next = head</code> — নতুন নোড এখন পুরনো <code>head</code> (<code>20</code>) কে পয়েন্ট করছে।",
        c: [5],
        r: () => draw(INIT_DATA, NEW_VAL, true, false)
    },
    {
        t: "Head আপডেট",
        d: "<code>head = newNode</code> — লিস্টের নতুন শুরু এখন <code>42</code>।",
        c: [6],
        r: () => draw(INIT_DATA, NEW_VAL, true, true)
    },
    {
        t: "সম্পন্ন",
        d: "সফলভাবে <code>42</code> সামনে যুক্ত হয়েছে। <code>head</code> এখন <code>42</code>, <code>tail</code> এখনো <code>30</code>। মাত্র <strong>O(1)</strong> সময়ে কাজ শেষ!",
        c: [],
        r: () => draw([NEW_VAL, ...INIT_DATA], null, false, true, true)
    }
];

const CODE_LINES = [
    "void push_front(int val) {",
    "  Node* newNode = new Node(val);",
    "  if (head == NULL) {",
    "    head = tail = newNode;",
    "  } else {",
    "    newNode->next = head;",
    "    head = newNode;",
    "  }",
    "}"
];

let cur = 0;

function mkArrow(on = false, dashed = false) {
    const c  = on ? '#38bdf8' : 'rgba(255,255,255,0.1)';
    const sw = on ? '2' : '1.5';
    const d  = dashed ? 'stroke-dasharray="5 4"' : '';
    return `<svg class="node-arrow" viewBox="0 0 42 18" fill="none"
        stroke="${c}" stroke-width="${sw}" ${d}>
        <path d="M3 9h32M27 4l8 5-8 5"/>
    </svg>`;
}

function draw(base, newVal, linked, headMoved, final = false) {
    let h = '<div class="node-row">';

    if (newVal && !final) {
        h += `<div class="node-container anim-left">
            <div class="node is-new">
                <span class="node-val">${newVal}</span>
                <span class="node-ptr">${linked ? 'next &rarr;' : 'NULL'}</span>
            </div>
            <div class="ptr-row"><span class="lbl lbl-new">newNode</span></div>
        </div>`;
        h += mkArrow(linked, !linked);
    }

    base.forEach((v, i) => {
        const isHead = final ? i === 0 : (!headMoved && i === 0);
        const isTail = i === base.length - 1;
        let cls = 'node';
        if (isHead) cls += ' is-head';
        if (isTail) cls += ' is-tail';

        h += `<div class="node-container">
            <div class="${cls}">
                <span class="node-val">${v}</span>
                <span class="node-ptr">${isTail ? 'NULL' : 'next &rarr;'}</span>
            </div>
            <div class="ptr-row">
                ${isHead ? '<span class="lbl lbl-head">head</span>' : ''}
                ${isTail ? '<span class="lbl lbl-tail">tail</span>' : ''}
            </div>
        </div>`;
        if (i < base.length - 1) h += mkArrow(false);
    });

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
