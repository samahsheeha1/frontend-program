// Global variables
let projectsData = [];
let aboutMeData = {};

// DOM Elements
const aboutMeSection = document.getElementById('aboutMe');
const projectsList = document.getElementById('projectsList');
const projectSpotlight = document.getElementById('projectSpotlight');
const navArrows = document.querySelector('.projectNavArrows');
const contactForm = document.getElementById('contactForm');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const charCount = document.getElementById('charCount');

// Fetch About Me Data
async function fetchAboutMeData() {
    try {
        const response = await fetch('data/aboutMeData.json');
        aboutMeData = await response.json();
        populateAboutMe();
    } catch (error) {
        console.error('Error fetching about me data:', error);
    }
}

// Populate About Me Section
function populateAboutMe() {
    const frag = document.createDocumentFragment();

    const aboutParagraph = document.createElement('p');
    aboutParagraph.textContent = aboutMeData.aboutMe;

    const headshotContainer = document.createElement('div');
    headshotContainer.className = 'headshotContainer';

    const headshotImg = document.createElement('img');
    headshotImg.src = aboutMeData.headshot || 'images/placeholder.jpg';
    headshotImg.alt = 'Samah Sheeha';

    headshotContainer.appendChild(headshotImg);
    frag.appendChild(aboutParagraph);
    frag.appendChild(headshotContainer);

    aboutMeSection.appendChild(frag);
}

// Fetch Projects Data
async function fetchProjectsData() {
    try {
        const response = await fetch('data/projectsData.json');
        projectsData = await response.json();
        populateProjects();
        setDefaultSpotlight();
    } catch (error) {
        console.error('Error fetching projects data:', error);
    }
}

// Populate Projects List
function populateProjects() {
    projectsList.innerHTML = '';
    const frag = document.createDocumentFragment();

    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'projectCard';
        projectCard.dataset.id = project.project_id;

        const projectName = document.createElement('h4');
        projectName.textContent = project.project_name;

        const projectDesc = document.createElement('p');
        projectDesc.textContent = project.short_description || 'No description available';

        projectCard.appendChild(projectName);
        projectCard.appendChild(projectDesc);

        // Set card background image instead of <img>
        if (project.card_image) {
            projectCard.style.backgroundImage = `url(${project.card_image})`;
            projectCard.style.backgroundSize = 'cover';
            projectCard.style.backgroundPosition = 'center';
            projectCard.style.color = 'white';
            projectCard.style.textShadow = '1px 1px 3px rgba(0,0,0,0.8)';
        }

        frag.appendChild(projectCard);
    });

    projectsList.appendChild(frag);
}

// Set Default Spotlight
function setDefaultSpotlight() {
    if (projectsData.length > 0) {
        updateSpotlight(projectsData[0].project_id);
    }
}

// Update Spotlight Section using DOM (no innerHTML)
function updateSpotlight(projectId) {
    const project = projectsData.find(p => p.project_id == projectId);
    if (!project) return;

    projectSpotlight.innerHTML = '';
    const frag = document.createDocumentFragment();

    const title = document.createElement('h3');
    title.id = 'spotlightTitles';
    title.textContent = project.project_name;

    const description = document.createElement('p');
    description.textContent = project.long_description || 'No detailed description available';

    const link = document.createElement('a');
    link.href = project.url || '#';
    link.target = '_blank';
    link.textContent = 'Click here to see more...';

    frag.appendChild(title);
    frag.appendChild(description);
    frag.appendChild(link);

    projectSpotlight.style.backgroundImage = project.spotlight_image ?
        `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${project.spotlight_image})` :
        'none';

    projectSpotlight.appendChild(frag);
}

// Event Delegation for Project Cards
projectsList.addEventListener('click', (e) => {
    const card = e.target.closest('.projectCard');
    if (card) {
        updateSpotlight(card.dataset.id);
    }
});

// Event Delegation for Arrows with Responsive Scroll
navArrows.addEventListener('click', (e) => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const scrollDistance = 300;

    if (e.target.classList.contains('left-arrow')) {
        projectsList.scrollBy({
            [isMobile ? 'left' : 'top']: -scrollDistance,
            behavior: 'smooth'
        });
    } else if (e.target.classList.contains('right-arrow')) {
        projectsList.scrollBy({
            [isMobile ? 'left' : 'top']: scrollDistance,
            behavior: 'smooth'
        });
    }
});

// Character Count and Form Validation
messageInput.addEventListener('input', () => {
    const remaining = 300 - messageInput.value.length;
    charCount.textContent = `${remaining} characters remaining`;
    charCount.classList.toggle('error', remaining < 0);
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const illegalChars = /[^a-zA-Z0-9@._]/;

    if (!emailInput.value) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (illegalChars.test(emailInput.value)) {
        emailError.textContent = 'Email contains invalid characters';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    if (!messageInput.value) {
        messageError.textContent = 'Message is required';
        isValid = false;
    } else if (illegalChars.test(messageInput.value)) {
        messageError.textContent = 'Message contains invalid characters';
        isValid = false;
    } else if (messageInput.value.length > 300) {
        messageError.textContent = 'Message must be 300 characters or less';
        isValid = false;
    } else {
        messageError.textContent = '';
    }

    if (isValid) {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
        charCount.textContent = '300 characters remaining';
    }
});

// Skills Section
function initializeSkills() {
    const skillsList = document.getElementById('skillsList');

    const programmingSkills = [
        'Python (Advanced)',
        'C/C++ (Advanced)',
        'Java (Intermediate)',
        'JavaScript (Intermediate)'
    ];

    const webSkills = [
        'HTML5/CSS3',
        'React.js',
        'Node.js',
        'Django'
    ];

    const programmingDiv = createSkillCategory('Programming', programmingSkills);
    const webDiv = createSkillCategory('Web Development', webSkills);

    skillsList.appendChild(programmingDiv);
    skillsList.appendChild(webDiv);
}

function createSkillCategory(title, skills) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skillCategory';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const skillsList = document.createElement('ul');
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });

    categoryDiv.appendChild(titleElement);
    categoryDiv.appendChild(skillsList);

    return categoryDiv;
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    fetchAboutMeData();
    fetchProjectsData();
    initializeSkills();
});
