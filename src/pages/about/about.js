import gsap from '../../modules/gsap';

const profile = document.querySelectorAll('.profileCardImage')

profile.forEach((profileCard, index) => 
  profileCard.addEventListener('click', () => {
    if(index === 0){    
    gsap.from(profileCard, { 
    scale: 0.5,
    ease: "back.inOut",
    repeat: 0,
    yoyo: true,
    duration: 0.8,
  })
} else if (index === 1) {
  gsap.from(profileCard, {
    rotation: 20,
    repeat: 0,
    yoyo: false,
    duration: 1,
    ease: "power1.easeInOut"
  })
}
else if (index === 2) {
  gsap.to(profileCard, {
    scaleX: -1,
    repeat: 0,
    yoyo: false,
    
    duration: 1.2
  })
}
else if (index === 3) {
  gsap.from(profileCard, {
    opacity: 0.5,
    scale: 1.5,
    repeat: 0,
    yoyo: false,
    duration: 0.5,
    ease: "power1.easeInOut"
  })
}
}))