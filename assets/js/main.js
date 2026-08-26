/* =========================================================
   俊哥装饰 · 网站交互脚本
   ========================================================= */
(function () {
  "use strict";

  // ---------- 顶部导航滚动状态 & 移动端菜单 ----------
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  });

  if (toggle) {
    toggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }

  // 当前页面高亮
  const path = window.location.pathname.split("/").pop() || "index.html";
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (a) {
      const href = a.getAttribute("href");
      if (href && href.split("#")[0] === path) a.classList.add("active");
    });
  }

  // ---------- Hero 轮播 ----------
  function initHero() {
    const track = document.querySelector(".hero-track");
    if (!track) return;
    const slides = track.children;
    if (slides.length === 0) return;
    const dotsWrap = document.querySelector(".hero-dots");
    let index = 0;
    let timer = null;

    // 生成圆点
    if (dotsWrap) {
      for (let i = 0; i < slides.length; i++) {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "slide " + (i + 1));
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", function () { goTo(i); restart(); });
        dotsWrap.appendChild(b);
      }
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
          d.classList.toggle("active", di === index);
        });
      }
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(index + 1); }, 4000);
    }

    const prev = document.querySelector(".hero-arrow.prev");
    const next = document.querySelector(".hero-arrow.next");
    if (prev) prev.addEventListener("click", function () { goTo(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); restart(); });

    restart();
  }
  initHero();

  // ---------- 滚动渐显 ----------
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // ---------- 图片灯箱 ----------
  function initLightbox() {
    let lb = document.querySelector(".lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.innerHTML =
        '<button class="lb-close" aria-label="关闭">&times;</button><img src="" alt="" />';
      document.body.appendChild(lb);
    }
    const lbImg = lb.querySelector("img");
    const closeBtn = lb.querySelector(".lb-close");

    function open(src) {
      lbImg.src = src;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // 代理点击：所有带 data-lightbox 的图片
    document.addEventListener("click", function (e) {
      const t = e.target.closest("[data-lightbox]");
      if (t) {
        open(t.getAttribute("data-lightbox") || t.src);
      }
    });
  }
  initLightbox();

  // ---------- 案例切换（cases.html） ----------
  function initCaseTabs() {
    const tabsWrap = document.querySelector(".case-tabs");
    if (!tabsWrap) return;
    const dataEl = document.getElementById("case-data");
    if (!dataEl) return;
    const cases = JSON.parse(dataEl.textContent);
    const show = document.getElementById("case-show");
    if (!show) return;

    function render(c) {
      const gallery = c.images.map(function (src) {
        return '<img src="' + src + '" alt="' + c.title + '" data-lightbox="' + src + '" />';
      }).join("");
      show.innerHTML =
        '<div class="case-show-head">' +
        "<h3>" + c.title + "</h3>" +
        '<span class="style">' + c.style + "</span>" +
        '<span class="area">面积 <b>' + c.area + 'm²</b></span>' +
        "</div>" +
        '<div class="case-gallery">' + gallery + "</div>" +
        '<div class="case-desc"><b>项目详情：</b>' + c.content + "</div>";
    }

    function bindTabs() {
      const tabs = tabsWrap.querySelectorAll(".case-tab");
      tabs.forEach(function (t) {
        t.addEventListener("click", function () {
          tabs.forEach(function (x) { x.classList.remove("active"); });
          t.classList.add("active");
          const c = cases.find(function (it) { return it.id === parseInt(t.dataset.id, 10); });
          if (c) render(c);
        });
      });
    }

    cases.forEach(function (c) {
      const b = document.createElement("button");
      b.className = "case-tab" + (c.id === cases[0].id ? " active" : "");
      b.dataset.id = c.id;
      b.textContent = c.title;
      tabsWrap.appendChild(b);
    });
    bindTabs();
    render(cases[0]);
  }
  initCaseTabs();

  // ---------- 客户评价时间展示 ----------
  const calDay = document.getElementById("cal-day");
  if (calDay) {
    const now = new Date();
    const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    calDay.textContent = now.getDate();
    const calWeek = document.getElementById("cal-week");
    if (calWeek) calWeek.textContent = week[now.getDay()];
  }
})();
