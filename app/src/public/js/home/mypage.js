const toggleButton = document.querySelector('#navbarToggleButton');
const navMenu = document.querySelector('#navbarMenu');
const signOutBtn = document.querySelector('#signOut');

signOutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('accessToken');
})

toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
