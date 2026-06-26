(function () {
  'use strict';

  const TRANSLATION = '语言永远不应成为获取知识的障碍。';
  const EXAMPLES = [
    { source: 'Language barrier', target: '语言障碍' },
    { source: 'Never be a barrier', target: '永不成障碍' },
  ];

  // --- Demo video / fallback animation ---
  function initDemo() {
    const video = document.getElementById('demoVideo');
    const fallback = document.getElementById('demoFallback');
    if (!fallback) return;

    function startAnimation() {
      fallback.classList.add('active');
      fallback.setAttribute('aria-hidden', 'false');
      startMockAnimation();
    }

    if (!video) {
      startAnimation();
      return;
    }

    function showFallback() {
      video.style.display = 'none';
      startAnimation();
    }

    video.addEventListener('error', showFallback);
    video.play().catch(showFallback);

    if (video.readyState === 0) {
      setTimeout(() => {
        if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
          showFallback();
        }
      }, 800);
    }
  }

  function startMockAnimation() {
    const words = document.querySelectorAll('.mock-word');
    const trigger = document.getElementById('mockTrigger');
    const overlay = document.getElementById('mockOverlay');
    const translation = document.getElementById('mockTranslation');
    const examples = document.getElementById('mockExamples');
    const cursor = document.getElementById('mockCursor');
    if (!words.length || !trigger || !overlay) return;

    const selectRange = [0, 7];
    let running = true;

    async function wait(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    function positionOverlay(anchorEl, overlayEl) {
      const container = anchorEl.closest('.browser-content');
      if (!container) return;

      const cRect = container.getBoundingClientRect();
      const aRect = anchorEl.getBoundingClientRect();
      const overlayW = Math.min(300, cRect.width - 32);
      const gap = 12;

      overlayEl.style.width = `${overlayW}px`;

      const left = Math.max(8, Math.min(aRect.left - cRect.left, cRect.width - overlayW - 8));
      const spaceBelow = cRect.height - (aRect.bottom - cRect.top) - gap;
      const oHeight = overlayEl.offsetHeight || 160;
      const topBelow = aRect.bottom - cRect.top + gap;
      const topAbove = aRect.top - cRect.top - oHeight - gap;

      const top = spaceBelow >= oHeight ? topBelow : Math.max(8, topAbove);
      overlayEl.style.left = `${left}px`;
      overlayEl.style.top = `${top}px`;
      overlayEl.style.bottom = 'auto';
    }

    async function loop() {
      while (running) {
        words.forEach((w) => w.classList.remove('selected'));
        trigger.classList.remove('visible', 'clicked');
        overlay.classList.remove('visible');
        translation.textContent = '';
        examples.innerHTML = '';
        cursor.classList.remove('visible');

        await wait(600);

        cursor.classList.add('visible');
        const first = words[selectRange[0]];
        const last = words[selectRange[1]];
        if (first && last) {
          const container = first.closest('.browser-content');
          const cRect = container.getBoundingClientRect();
          const fRect = first.getBoundingClientRect();
          cursor.style.left = `${fRect.left - cRect.left - 4}px`;
          cursor.style.top = `${fRect.top - cRect.top - 2}px`;
        }

        await wait(400);

        for (let i = selectRange[0]; i <= selectRange[1]; i++) {
          words[i]?.classList.add('selected');
          await wait(80);
        }

        await wait(200);

        const lastWord = words[selectRange[1]];
        if (lastWord) {
          const container = lastWord.closest('.browser-content');
          const cRect = container.getBoundingClientRect();
          const wRect = lastWord.getBoundingClientRect();
          trigger.style.left = `${wRect.right - cRect.left + 8}px`;
          trigger.style.top = `${wRect.bottom - cRect.top + 4}px`;
        }

        trigger.classList.add('visible');
        await wait(500);

        if (lastWord) {
          const container = lastWord.closest('.browser-content');
          const cRect = container.getBoundingClientRect();
          const tRect = trigger.getBoundingClientRect();
          cursor.style.left = `${tRect.left - cRect.left + 4}px`;
          cursor.style.top = `${tRect.top - cRect.top + 2}px`;
        }

        await wait(300);
        trigger.classList.add('clicked');
        await wait(200);

        overlay.classList.add('visible');
        cursor.classList.remove('visible');

        if (lastWord) {
          positionOverlay(lastWord, overlay);
        }

        for (let i = 0; i < TRANSLATION.length; i++) {
          translation.textContent = TRANSLATION.slice(0, i + 1);
          await wait(45);
        }

        await wait(400);

        EXAMPLES.forEach((ex) => {
          const el = document.createElement('div');
          el.className = 'mock-example';
          el.innerHTML = `<div>${ex.source}</div><div class="target">${ex.target}</div>`;
          examples.appendChild(el);
        });

        if (lastWord) {
          positionOverlay(lastWord, overlay);
        }

        await wait(3200);
      }
    }

    loop();
  }

  const EXTENSION_URL =
    window.__WT_EXTENSION_URL__ || 'https://github.com/pminimd/WebTranslate-extension';

  // --- Waitlist form ---
  function getSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || params.get('source') || 'landing';
  }

  async function submitEmail(email) {
    const scriptUrl = window.__WT_SCRIPT_URL__;
    if (!scriptUrl) {
      throw new Error('Script URL not configured');
    }

    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        email,
        source: getSource(),
      }),
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { ok: res.ok, message: text || (res.ok ? 'ok' : '提交失败') };
    }
  }

  function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    const message = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !message) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      message.className = 'form-message';

      const emailInput = form.querySelector('#email');
      const email = emailInput?.value.trim();
      if (!email) {
        message.textContent = '请输入邮箱地址';
        message.className = 'form-message error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = '提交中…';

      try {
        const data = await submitEmail(email);

        if (data.ok !== false) {
          message.textContent = '提交成功，正在前往插件安装页…';
          message.className = 'form-message success';
          form.reset();
          window.setTimeout(() => {
            window.location.assign(EXTENSION_URL);
          }, 800);
          return;
        } else {
          message.textContent = data.message || '提交失败，请稍后重试';
          message.className = 'form-message error';
        }
      } catch {
        message.textContent = '网络错误，请检查连接后重试';
        message.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '申请内测';
      }
    });
  }

  initDemo();
  initWaitlistForm();
})();
