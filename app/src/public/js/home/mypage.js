const toggleButton = document.querySelector('#navbarToggleButton');
const navMenu = document.querySelector('#navbarMenu');
const signOutBtn = document.querySelector('#signOut');
const qnaBtn = document.querySelector('#qna');

signOutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('accessToken');
})

toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

qnaBtn.addEventListener('click', ()=>{
    alert('깃허브에서 contributer에게 연락주세요');
  })
