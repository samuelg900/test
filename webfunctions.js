let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    if (lastScrollY + 20 < window.scrollY || lastScrollY - 20 > window.scrollY) {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        document.getElementById('navbar').classList.add('nav_disappear');
        document.getElementById('navbar').classList.remove('nav_appear');
      } else {
        // Scrolling up
        document.getElementById('navbar').classList.remove('nav_disappear');
        document.getElementById('navbar').classList.add('nav_appear');
      }
      lastScrollY = window.scrollY;
    }
  }
});
