/* --- Udaan Academy JavaScript Handler --- */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Sticky / Scrolled Header Effect
     ========================================== */
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================
     2. Mobile Menu Drawer Navigation
     ========================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  
  function openMobileMenu() {
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  mobileToggle.addEventListener('click', openMobileMenu);
  drawerClose.addEventListener('click', closeMobileMenu);
  
  // Close menu if clicking on background overlay
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking a drawer link
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* ==========================================
     3. Scroll Spy (Highlight active nav link)
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerNavLinks = document.querySelectorAll('.drawer-link');

  function scrollSpy() {
    const scrollPosition = window.scrollY + 150; // offset for detection accuracy
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update Desktop Navbar
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        
        // Update Mobile Drawer
        drawerNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // run once on load


  /* ==========================================
     4. Toast Notification System
     ========================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on toast type
    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check"></i>' 
      : '<i class="fa-solid fa-circle-exclamation"></i>';
      
    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 4000);
  }


  /* ==========================================
     5. Admin Panel (Easter Egg - 5 Clicks)
     ========================================== */
  let logoClicks = 0;
  let logoClickTimer;
  const logoLink = document.querySelector('.logo-link');
  const adminModal = document.getElementById('adminModal');
  const adminModalCloseBtn = document.getElementById('adminModalCloseBtn');

  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent standard jump since it points to #home
      logoClicks++;
      
      if (logoClicks === 1) {
        logoClickTimer = setTimeout(() => {
          logoClicks = 0;
        }, 3000); // 3-second click window
      }
      
      if (logoClicks >= 5) {
        logoClicks = 0;
        clearTimeout(logoClickTimer);
        openAdminModal();
      }
    });
  }

  // Initialize Default Password if missing
  if (!localStorage.getItem('udaan_admin_password')) {
    localStorage.setItem('udaan_admin_password', 'admin123');
  }

  function openAdminModal() {
    // Reset to Login View first
    document.getElementById('adminLoginSection').style.display = 'block';
    document.getElementById('adminTabsHeader').style.display = 'none';
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('adminAuthPassword').value = '';

    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (adminModalCloseBtn) {
    adminModalCloseBtn.addEventListener('click', closeAdminModal);
  }

  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        closeAdminModal();
      }
    });
  }

  // Admin Login Submission
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPassword = document.getElementById('adminAuthPassword').value;
      const storedPassword = localStorage.getItem('udaan_admin_password') || 'admin123';

      if (enteredPassword === storedPassword) {
        // Unlock Admin panel
        document.getElementById('adminLoginSection').style.display = 'none';
        
        // Show tabs header
        const tabsHeader = document.getElementById('adminTabsHeader');
        tabsHeader.style.display = 'flex';
        
        // Reset tab buttons active state
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.admin-tab-btn[data-tab="tab-general"]').classList.add('active');
        
        // Show General Tab Content
        document.getElementById('tab-general').classList.add('active');

        // Populate form fields with current values from DOM
        document.getElementById('adminHeroTitle1').value = document.getElementById('heroText1').textContent;
        document.getElementById('adminHeroTitle2').value = document.getElementById('heroText2').textContent;
        document.getElementById('adminHeroSubtitle').value = document.getElementById('heroSubtitleText').textContent;
        
        document.getElementById('adminContactAddress').value = document.getElementById('contactAddressText').textContent;
        
        document.getElementById('adminContactPhone').value = document.getElementById('contactPhoneText').textContent.trim();
        
        const emailText = document.getElementById('contactEmailText').innerHTML;
        const emailParts = emailText.split('<br>');
        document.getElementById('adminContactEmail').value = emailParts[0] ? emailParts[0].trim() : '';

        showToast('Login successful! Welcome to the Admin Panel.', 'success');
      } else {
        showToast('Incorrect password! Please try again.', 'error');
        document.getElementById('adminAuthPassword').value = '';
      }
    });
  }

  // Admin Password Change Submission
  const adminPasswordForm = document.getElementById('adminPasswordForm');
  if (adminPasswordForm) {
    adminPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPwd = document.getElementById('currentPassword').value;
      const newPwd = document.getElementById('newPassword').value;
      const confirmPwd = document.getElementById('confirmPassword').value;
      const storedPassword = localStorage.getItem('udaan_admin_password') || 'admin123';

      if (currentPwd !== storedPassword) {
        showToast('Current password is incorrect!', 'error');
        return;
      }

      if (newPwd !== confirmPwd) {
        showToast('New passwords do not match!', 'error');
        return;
      }

      if (newPwd.length < 4) {
        showToast('Password must be at least 4 characters long!', 'error');
        return;
      }

      localStorage.setItem('udaan_admin_password', newPwd);
      showToast('Password updated successfully!', 'success');
      adminPasswordForm.reset();
    });
  }

  // Admin Modal Tab Switcher
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
      
      if (tabId === 'tab-queries') {
        renderQueries();
      }
    });
  });


  /* ==========================================
     6. LocalStorage Data CMS & Persistence
     ========================================== */
  
  // Default values to initialize website data if localStorage is empty
  const defaultGeneralInfo = {
    heroTitle1: 'EMPOWERING MINDS',
    heroTitle2: 'INSPIRING FUTURES',
    heroSubtitle: 'Where Learning Takes Flight',
    address: '[Insert Academy Campus Address Here]',
    phone: '+91 XXXXX XXXXX',
    email: 'admissions@udaanacademymys.com',
    heroBgImage: ''
  };

  const defaultTeachers = [
    {
      id: 't1',
      name: 'Dr. Amit Verma',
      qualification: 'PhD in Pure Mathematics (IIT Bombay)',
      subjects: ['Maths'],
      classes: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
      desc: 'Over 15 years of board teaching experience. Ex-Principal and Board Exam Evaluator.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 't2',
      name: 'Mrs. Ritu Sen',
      qualification: 'M.Sc in Physics (Gold Medalist)',
      subjects: ['Science'],
      classes: ['Class 7', 'Class 8', 'Class 9', 'Class 10'],
      desc: 'Specializes in conceptual logic and simplified experiments to make science engaging.',
      image: 'https://images.unsplash.com/photo-1580894732444-8febeb78fb3e?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 't3',
      name: 'Mr. David Joseph',
      qualification: 'MA in English Literature, B.Ed',
      subjects: ['English', 'Social Science'],
      classes: ['Class 5', 'Class 6', 'Class 7', 'Class 8'],
      desc: 'Focused on vocabulary visualization, creative speech, and structural grammar writing.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const defaultToppers = [
    {
      id: 'top1',
      name: 'Aditya Rao',
      score: '98.6% - Class 10th Board (School Topper)',
      quote: 'The concept masteries and doubt clearing sessions at Udaan helped me score perfect marks in Maths and Science.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'top2',
      name: 'Priyanka Patel',
      score: '97.2% - Class 12th Board Science',
      quote: 'Studying under the guidance of Udaan faculty made complex physics and chemistry concepts crystal clear and extremely enjoyable.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'top3',
      name: 'Karan Sharma',
      score: '100/100 in Maths - Class 10th Std',
      quote: 'The regular mock test evaluations and personalized study routines kept my exam preparation stress-free and highly structured.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  ];

  const defaultGallery = [
    {
      id: 'gal1',
      title: 'Active Classroom Activities',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      layout: 'h-2'
    },
    {
      id: 'gal2',
      title: 'Student Creative Reading Zone',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      layout: 'normal'
    },
    {
      id: 'gal3',
      title: 'Junior Computing & Logic Lab',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80',
      layout: 'normal'
    },
    {
      id: 'gal4',
      title: 'Interactive Science Experiments',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      layout: 'w-2'
    }
  ];

  const defaultBlogPosts = [
    {
      id: 'blog1',
      title: 'How to Build a Regular Study Routine for Kids at Home',
      date: 'July 15, 2026',
      tag: 'Study Tips',
      excerpt: 'Discover simple structures to balance playtime, school assignments, and revision periods to prevent learning burnout.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'blog2',
      title: 'Developing Interest in Science & Math: A Guided Parent Plan',
      date: 'June 28, 2026',
      tag: 'Science for Kids',
      excerpt: 'How everyday puzzles, chemistry kitchen science, and practical mathematical tools build natural curiosity in growing minds.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'blog3',
      title: 'Improving Handwriting & Reading Speed in Middle School',
      date: 'June 10, 2026',
      tag: 'Learning Skills',
      excerpt: 'Step-by-step motor practice, vocabulary visualizers, and interactive reading techniques to double study efficiency.',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Load General Text Settings
  function loadGeneralInfo() {
    let info = localStorage.getItem('udaan_general_info');
    if (!info) {
      info = defaultGeneralInfo;
      localStorage.setItem('udaan_general_info', JSON.stringify(info));
    } else {
      info = JSON.parse(info);
    }

    // Bind values directly to DOM elements
    document.getElementById('heroText1').textContent = info.heroTitle1;
    document.getElementById('heroText2').textContent = info.heroTitle2;
    document.getElementById('heroSubtitleText').textContent = info.heroSubtitle;
    document.getElementById('contactAddressText').textContent = info.address;
    document.getElementById('contactPhoneText').innerHTML = info.phone;
    document.getElementById('contactEmailText').innerHTML = `${info.email}<br>info@udaanacademymys.com`;

    // Bind Hero Background Image if uploaded
    if (info.heroBgImage) {
      document.documentElement.style.setProperty('--body-bg-image', `url('${info.heroBgImage}')`);
    } else {
      document.documentElement.style.removeProperty('--body-bg-image');
    }
  }

  // Save General Text Settings
  const adminGeneralForm = document.getElementById('adminGeneralForm');
  if (adminGeneralForm) {
    adminGeneralForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('adminHeroBgFile');
      const file = fileInput.files[0];
      
      const currentInfo = JSON.parse(localStorage.getItem('udaan_general_info') || '{}');
      
      const saveGeneralInfo = (bgImageBase64) => {
        const info = {
          heroTitle1: document.getElementById('adminHeroTitle1').value,
          heroTitle2: document.getElementById('adminHeroTitle2').value,
          heroSubtitle: document.getElementById('adminHeroSubtitle').value,
          address: document.getElementById('adminContactAddress').value,
          phone: document.getElementById('adminContactPhone').value,
          email: document.getElementById('adminContactEmail').value,
          heroBgImage: bgImageBase64 !== undefined ? bgImageBase64 : (currentInfo.heroBgImage || '')
        };
        
        localStorage.setItem('udaan_general_info', JSON.stringify(info));
        loadGeneralInfo();
        closeAdminModal();
        fileInput.value = ''; // reset file input
        showToast('General configurations saved!', 'success');
      };
      
      if (file) {
        getCompressedImage(file, 1200, (base64Result) => {
          if (base64Result) {
            saveGeneralInfo(base64Result);
          } else {
            showToast('Failed to process background image.', 'error');
            saveGeneralInfo(undefined);
          }
        });
      } else {
        saveGeneralInfo(undefined);
      }
    });
  }

  // Load and Render Teachers List (LinkedIn Style Card)
  function loadAndRenderTeachers() {
    let teachers = localStorage.getItem('udaan_teachers');
    if (!teachers) {
      teachers = defaultTeachers;
      localStorage.setItem('udaan_teachers', JSON.stringify(teachers));
    } else {
      teachers = JSON.parse(teachers);
    }

    // Render on Main page
    const teachersGrid = document.getElementById('teachersGrid');
    if (teachersGrid) {
      teachersGrid.innerHTML = '';
      teachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        
        const bannerUrl = teacher.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
        const profileUrl = teacher.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
        const qualificationText = teacher.qualification || 'Educator';
        const subjectsList = Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : (teacher.subject || 'All Subjects');
        const classesList = Array.isArray(teacher.classes) ? teacher.classes.join(', ') : 'All Batches';

        card.innerHTML = `
          <div class="teacher-card-banner" style="background-image: url('${bannerUrl}')"></div>
          <div class="teacher-card-body">
            <div class="teacher-card-avatar" style="background-image: url('${profileUrl}')"></div>
            <h3 class="teacher-name">${teacher.name}</h3>
            <span class="teacher-qualification">${qualificationText}</span>
            
            <div class="teacher-meta-section">
              <div class="teacher-meta-item">
                <strong>Subjects</strong>
                <span>${subjectsList}</span>
              </div>
              <div class="teacher-meta-item">
                <strong>Classes</strong>
                <span>${classesList}</span>
              </div>
            </div>
            
            <p class="teacher-bio">"${teacher.desc}"</p>
          </div>
        `;
        teachersGrid.appendChild(card);
      });
    }

    // Render in Admin Panel List
    const adminTeachersList = document.getElementById('adminTeachersList');
    if (adminTeachersList) {
      adminTeachersList.innerHTML = '';
      if (teachers.length === 0) {
        adminTeachersList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 12px;">No teachers listed yet.</p>';
      } else {
        teachers.forEach(teacher => {
          const item = document.createElement('div');
          item.className = 'admin-teacher-item';
          
          const qualificationText = teacher.qualification || 'Educator';
          
          item.innerHTML = `
            <div class="admin-teacher-info">
              <span class="admin-teacher-name">${teacher.name}</span>
              <span class="admin-teacher-sub">${qualificationText}</span>
            </div>
            <div class="admin-teacher-actions" style="display: flex; gap: 8px;">
              <button type="button" class="btn-edit" data-id="${teacher.id}">Edit</button>
              <button type="button" class="btn-delete" data-id="${teacher.id}">Delete</button>
            </div>
          `;
          adminTeachersList.appendChild(item);
        });
      }
    }
  }

  // Helper to resize and compress uploaded image to a small base64 string
  function getCompressedImage(file, max_size, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output compressed JPEG representation (70% quality factor)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
      };
      img.onerror = function() {
        callback(null);
      };
      img.src = e.target.result;
    };
    reader.onerror = function() {
      callback(null);
    };
    reader.readAsDataURL(file);
  }

  // Promise-based wrapper for image compression
  function getCompressedImagePromise(file, max_size) {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
      getCompressedImage(file, max_size, (result) => {
        resolve(result);
      });
    });
  }

  // Editing Teacher State
  let editingTeacherId = null;

  // Cancel Teacher Edit Button
  const cancelTeacherEditBtn = document.getElementById('cancelTeacherEditBtn');
  const teacherFormSubmitBtn = document.getElementById('teacherFormSubmitBtn');

  if (cancelTeacherEditBtn) {
    cancelTeacherEditBtn.addEventListener('click', () => {
      resetTeacherForm();
    });
  }

  function resetTeacherForm() {
    editingTeacherId = null;
    const form = document.getElementById('adminAddTeacherForm');
    if (form) {
      form.reset();
      // Uncheck checkboxes explicitly
      document.querySelectorAll('input[name="teacherSubjects"]').forEach(cb => cb.checked = false);
      document.querySelectorAll('input[name="teacherClasses"]').forEach(cb => cb.checked = false);
    }
    if (teacherFormSubmitBtn) {
      teacherFormSubmitBtn.textContent = 'ADD TEACHER';
    }
    if (cancelTeacherEditBtn) {
      cancelTeacherEditBtn.style.display = 'none';
    }
  }

  // Add/Update a Teacher Form Handler
  const adminAddTeacherForm = document.getElementById('adminAddTeacherForm');
  if (adminAddTeacherForm) {
    adminAddTeacherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('teacherName').value.trim();
      const qualification = document.getElementById('teacherQualification').value.trim();
      const desc = document.getElementById('teacherDesc').value.trim();
      
      const profileFileInput = document.getElementById('teacherImageFile');
      const profileFile = profileFileInput.files[0];
      
      const bannerFileInput = document.getElementById('teacherBannerFile');
      const bannerFile = bannerFileInput.files[0];
      
      // Collect Checked Subjects
      const subjectsChecked = Array.from(document.querySelectorAll('input[name="teacherSubjects"]:checked'))
                                   .map(cb => cb.value);
      
      // Collect Checked Classes
      const classesChecked = Array.from(document.querySelectorAll('input[name="teacherClasses"]:checked'))
                                  .map(cb => cb.value);
      
      // Validation Check
      if (subjectsChecked.length === 0) {
        showToast('Please select at least one subject handled!', 'error');
        return;
      }
      
      if (classesChecked.length === 0) {
        showToast('Please select at least one class taken!', 'error');
        return;
      }
      
      // Load current teacher list
      const teachers = JSON.parse(localStorage.getItem('udaan_teachers') || '[]');
      
      if (editingTeacherId) {
        // Edit Mode
        const oldTeacherIndex = teachers.findIndex(t => t.id === editingTeacherId);
        if (oldTeacherIndex === -1) {
          showToast('Failed to find teacher to edit.', 'error');
          resetTeacherForm();
          return;
        }
        const oldTeacher = teachers[oldTeacherIndex];
        
        // Concurrent compress uploads
        Promise.all([
          getCompressedImagePromise(profileFile, 150),
          getCompressedImagePromise(bannerFile, 600)
        ]).then(([profileBase64, bannerBase64]) => {
          
          teachers[oldTeacherIndex] = {
            id: editingTeacherId,
            name,
            qualification,
            desc,
            subjects: subjectsChecked,
            classes: classesChecked,
            image: profileBase64 || oldTeacher.image,
            banner: bannerBase64 || oldTeacher.banner
          };
          
          localStorage.setItem('udaan_teachers', JSON.stringify(teachers));
          loadAndRenderTeachers();
          resetTeacherForm();
          showToast(`Teacher ${name} details updated successfully!`, 'success');
        });
      } else {
        // Create Mode
        Promise.all([
          getCompressedImagePromise(profileFile, 150),
          getCompressedImagePromise(bannerFile, 600)
        ]).then(([profileBase64, bannerBase64]) => {
          
          const newTeacher = {
            id: 't_' + Date.now(),
            name,
            qualification,
            desc,
            subjects: subjectsChecked,
            classes: classesChecked,
            image: profileBase64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            banner: bannerBase64 || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
          };
          
          teachers.push(newTeacher);
          localStorage.setItem('udaan_teachers', JSON.stringify(teachers));
          
          loadAndRenderTeachers();
          resetTeacherForm();
          showToast(`Teacher ${name} added successfully!`, 'success');
        });
      }
    });
  }

  // Teacher Action Delegated Click Listener (Edit & Delete)
  const adminTeachersListContainer = document.getElementById('adminTeachersList');
  if (adminTeachersListContainer) {
    adminTeachersListContainer.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      
      let teachers = JSON.parse(localStorage.getItem('udaan_teachers') || '[]');
      
      if (e.target.classList.contains('btn-delete')) {
        const teacherToDelete = teachers.find(t => t.id === id);
        teachers = teachers.filter(t => t.id !== id);
        
        localStorage.setItem('udaan_teachers', JSON.stringify(teachers));
        loadAndRenderTeachers();
        
        // If the teacher being deleted was currently being edited, reset the form!
        if (editingTeacherId === id) {
          resetTeacherForm();
        }
        
        if (teacherToDelete) {
          showToast(`Teacher ${teacherToDelete.name} deleted.`, 'error');
        }
      } else if (e.target.classList.contains('btn-edit')) {
        const teacherToEdit = teachers.find(t => t.id === id);
        if (!teacherToEdit) return;
        
        // Populate fields
        document.getElementById('teacherName').value = teacherToEdit.name;
        document.getElementById('teacherQualification').value = teacherToEdit.qualification || '';
        document.getElementById('teacherDesc').value = teacherToEdit.desc || '';
        
        // Populate checkboxes
        document.querySelectorAll('input[name="teacherSubjects"]').forEach(cb => {
          cb.checked = Array.isArray(teacherToEdit.subjects) && teacherToEdit.subjects.includes(cb.value);
        });
        document.querySelectorAll('input[name="teacherClasses"]').forEach(cb => {
          cb.checked = Array.isArray(teacherToEdit.classes) && teacherToEdit.classes.includes(cb.value);
        });
        
        // Modify button display states
        if (teacherFormSubmitBtn) {
          teacherFormSubmitBtn.textContent = 'UPDATE TEACHER DETAILS';
        }
        if (cancelTeacherEditBtn) {
          cancelTeacherEditBtn.style.display = 'block';
        }
        
        editingTeacherId = id;
        
        // Scroll the form into view smoothly inside the modal
        const modalBody = document.querySelector('.admin-modal-body');
        if (modalBody) {
          modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        showToast(`Loaded ${teacherToEdit.name}'s info to edit form.`, 'success');
      }
    });
  }

  /* ==========================================
     6b. Toppers CMS & Dynamic Rendering
     ========================================== */
  
  // Editing Topper State
  let editingTopperId = null;

  // Topper Form Elements
  const cancelTopperEditBtn = document.getElementById('cancelTopperEditBtn');
  const topperFormSubmitBtn = document.getElementById('topperFormSubmitBtn');

  if (cancelTopperEditBtn) {
    cancelTopperEditBtn.addEventListener('click', () => {
      resetTopperForm();
    });
  }

  function resetTopperForm() {
    editingTopperId = null;
    const form = document.getElementById('adminAddTopperForm');
    if (form) {
      form.reset();
    }
    if (topperFormSubmitBtn) {
      topperFormSubmitBtn.textContent = 'ADD TOPPER';
    }
    if (cancelTopperEditBtn) {
      cancelTopperEditBtn.style.display = 'none';
    }
  }

  // Load and Render Toppers
  window.loadAndRenderToppers = function() {
    let toppers = localStorage.getItem('udaan_toppers');
    if (!toppers) {
      toppers = defaultToppers;
      localStorage.setItem('udaan_toppers', JSON.stringify(toppers));
    } else {
      toppers = JSON.parse(toppers);
    }

    // Render on main page
    const toppersGrid = document.getElementById('toppersGrid');
    if (toppersGrid) {
      toppersGrid.innerHTML = '';
      toppers.forEach(topper => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        
        const avatarUrl = topper.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
        
        card.innerHTML = `
          <div class="student-avatar" style="background-image: url('${avatarUrl}');"></div>
          <h3 class="student-name">${topper.name}</h3>
          <span class="student-rank">${topper.score}</span>
          <p class="student-quote">"${topper.quote}"</p>
        `;
        toppersGrid.appendChild(card);
      });
    }

    // Render in Admin Panel List
    const adminToppersList = document.getElementById('adminToppersList');
    if (adminToppersList) {
      adminToppersList.innerHTML = '';
      if (toppers.length === 0) {
        adminToppersList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 12px;">No toppers listed yet.</p>';
      } else {
        toppers.forEach(topper => {
          const item = document.createElement('div');
          item.className = 'admin-teacher-item';
          item.innerHTML = `
            <div class="admin-teacher-info">
              <span class="admin-teacher-name">${topper.name}</span>
              <span class="admin-teacher-sub">${topper.score}</span>
            </div>
            <div class="admin-teacher-actions" style="display: flex; gap: 8px;">
              <button type="button" class="btn-edit" data-id="${topper.id}">Edit</button>
              <button type="button" class="btn-delete" data-id="${topper.id}">Delete</button>
            </div>
          `;
          adminToppersList.appendChild(item);
        });
      }
    }
  };

  // Add/Update a Topper Form Handler
  const adminAddTopperForm = document.getElementById('adminAddTopperForm');
  if (adminAddTopperForm) {
    adminAddTopperForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('topperName').value.trim();
      const score = document.getElementById('topperScore').value.trim();
      const quote = document.getElementById('topperQuote').value.trim();
      
      const imageFileInput = document.getElementById('topperImageFile');
      const file = imageFileInput.files[0];
      
      const toppers = JSON.parse(localStorage.getItem('udaan_toppers') || '[]');
      
      if (editingTopperId) {
        // Edit Mode
        const oldIndex = toppers.findIndex(t => t.id === editingTopperId);
        if (oldIndex === -1) {
          showToast('Failed to find topper to edit.', 'error');
          resetTopperForm();
          return;
        }
        const oldTopper = toppers[oldIndex];
        
        getCompressedImagePromise(file, 150).then(base64Result => {
          toppers[oldIndex] = {
            id: editingTopperId,
            name,
            score,
            quote,
            image: base64Result || oldTopper.image
          };
          
          localStorage.setItem('udaan_toppers', JSON.stringify(toppers));
          loadAndRenderToppers();
          resetTopperForm();
          showToast(`Topper ${name} updated successfully!`, 'success');
        });
      } else {
        // Create Mode
        getCompressedImagePromise(file, 150).then(base64Result => {
          const newTopper = {
            id: 'top_' + Date.now(),
            name,
            score,
            quote,
            image: base64Result || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
          };
          
          toppers.push(newTopper);
          localStorage.setItem('udaan_toppers', JSON.stringify(toppers));
          
          loadAndRenderToppers();
          resetTopperForm();
          showToast(`Topper ${name} added successfully!`, 'success');
        });
      }
    });
  }

  // Topper Action Delegated Click Listener (Edit & Delete)
  const adminToppersListContainer = document.getElementById('adminToppersList');
  if (adminToppersListContainer) {
    adminToppersListContainer.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      
      let toppers = JSON.parse(localStorage.getItem('udaan_toppers') || '[]');
      
      if (e.target.classList.contains('btn-delete')) {
        const topperToDelete = toppers.find(t => t.id === id);
        toppers = toppers.filter(t => t.id !== id);
        
        localStorage.setItem('udaan_toppers', JSON.stringify(toppers));
        loadAndRenderToppers();
        
        if (editingTopperId === id) {
          resetTopperForm();
        }
        
        if (topperToDelete) {
          showToast(`Topper ${topperToDelete.name} deleted.`, 'error');
        }
      } else if (e.target.classList.contains('btn-edit')) {
        const topperToEdit = toppers.find(t => t.id === id);
        if (!topperToEdit) return;
        
        // Populate fields
        document.getElementById('topperName').value = topperToEdit.name;
        document.getElementById('topperScore').value = topperToEdit.score;
        document.getElementById('topperQuote').value = topperToEdit.quote;
        
        // Modify button display states
        if (topperFormSubmitBtn) {
          topperFormSubmitBtn.textContent = 'UPDATE TOPPER DETAILS';
        }
        if (cancelTopperEditBtn) {
          cancelTopperEditBtn.style.display = 'block';
        }
        
        editingTopperId = id;
        
        // Scroll the form into view smoothly inside the modal
        const modalBody = document.querySelector('.admin-modal-body');
        if (modalBody) {
          modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        showToast(`Loaded ${topperToEdit.name}'s info to edit form.`, 'success');
      }
    });
  }

  /* ==========================================
     6c. Gallery CMS & Dynamic Rendering
     ========================================== */
  
  // Editing Gallery State
  let editingGalleryId = null;

  // Gallery Form Elements
  const cancelGalleryEditBtn = document.getElementById('cancelGalleryEditBtn');
  const galleryFormSubmitBtn = document.getElementById('galleryFormSubmitBtn');

  if (cancelGalleryEditBtn) {
    cancelGalleryEditBtn.addEventListener('click', () => {
      resetGalleryForm();
    });
  }

  function resetGalleryForm() {
    editingGalleryId = null;
    const form = document.getElementById('adminAddGalleryForm');
    if (form) {
      form.reset();
    }
    if (galleryFormSubmitBtn) {
      galleryFormSubmitBtn.textContent = 'ADD TO GALLERY';
    }
    if (cancelGalleryEditBtn) {
      cancelGalleryEditBtn.style.display = 'none';
    }
  }

  // Load and Render Gallery
  window.loadAndRenderGallery = function() {
    let gallery = localStorage.getItem('udaan_gallery');
    if (!gallery) {
      gallery = defaultGallery;
      localStorage.setItem('udaan_gallery', JSON.stringify(gallery));
    } else {
      gallery = JSON.parse(gallery);
    }

    // Render on main page
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
      galleryGrid.innerHTML = '';
      gallery.forEach(item => {
        const div = document.createElement('div');
        const layoutClass = item.layout && item.layout !== 'normal' ? item.layout : '';
        div.className = `gallery-item ${layoutClass}`.trim();
        
        const imageUrl = item.image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
        div.style.backgroundImage = `url('${imageUrl}')`;
        
        div.innerHTML = `
          <div class="gallery-overlay">
            <span class="gallery-title">${item.title}</span>
          </div>
        `;
        galleryGrid.appendChild(div);
      });
    }

    // Render in Admin Panel List
    const adminGalleryList = document.getElementById('adminGalleryList');
    if (adminGalleryList) {
      adminGalleryList.innerHTML = '';
      if (gallery.length === 0) {
        adminGalleryList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 12px;">No gallery items uploaded yet.</p>';
      } else {
        gallery.forEach(item => {
          const row = document.createElement('div');
          row.className = 'admin-teacher-item';
          row.innerHTML = `
            <div class="admin-teacher-info">
              <span class="admin-teacher-name">${item.title}</span>
              <span class="admin-teacher-sub">Size Layout: ${item.layout.toUpperCase()}</span>
            </div>
            <div class="admin-teacher-actions" style="display: flex; gap: 8px;">
              <button type="button" class="btn-edit" data-id="${item.id}">Edit</button>
              <button type="button" class="btn-delete" data-id="${item.id}">Delete</button>
            </div>
          `;
          adminGalleryList.appendChild(row);
        });
      }
    }
  };

  // Add/Update a Gallery Item Form Handler
  const adminAddGalleryForm = document.getElementById('adminAddGalleryForm');
  if (adminAddGalleryForm) {
    adminAddGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('galleryTitle').value.trim();
      const layout = document.getElementById('galleryLayout').value;
      
      const imageFileInput = document.getElementById('galleryImageFile');
      const file = imageFileInput.files[0];
      
      const gallery = JSON.parse(localStorage.getItem('udaan_gallery') || '[]');
      
      if (editingGalleryId) {
        // Edit Mode
        const oldIndex = gallery.findIndex(g => g.id === editingGalleryId);
        if (oldIndex === -1) {
          showToast('Failed to find gallery item to edit.', 'error');
          resetGalleryForm();
          return;
        }
        const oldItem = gallery[oldIndex];
        
        getCompressedImagePromise(file, 800).then(base64Result => {
          gallery[oldIndex] = {
            id: editingGalleryId,
            title,
            layout,
            image: base64Result || oldItem.image
          };
          
          localStorage.setItem('udaan_gallery', JSON.stringify(gallery));
          loadAndRenderGallery();
          resetGalleryForm();
          showToast(`Gallery item updated successfully!`, 'success');
        });
      } else {
        // Create Mode
        if (!file) {
          showToast('Please select a photo to upload!', 'error');
          return;
        }
        
        getCompressedImagePromise(file, 800).then(base64Result => {
          if (!base64Result) {
            showToast('Failed to compress selected photo.', 'error');
            return;
          }
          
          const newItem = {
            id: 'gal_' + Date.now(),
            title,
            layout,
            image: base64Result
          };
          
          gallery.push(newItem);
          localStorage.setItem('udaan_gallery', JSON.stringify(gallery));
          
          loadAndRenderGallery();
          resetGalleryForm();
          showToast('Photo added to gallery successfully!', 'success');
        });
      }
    });
  }

  // Gallery Action Delegated Click Listener (Edit & Delete)
  const adminGalleryListContainer = document.getElementById('adminGalleryList');
  if (adminGalleryListContainer) {
    adminGalleryListContainer.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      
      let gallery = JSON.parse(localStorage.getItem('udaan_gallery') || '[]');
      
      if (e.target.classList.contains('btn-delete')) {
        const itemToDelete = gallery.find(g => g.id === id);
        gallery = gallery.filter(g => g.id !== id);
        
        localStorage.setItem('udaan_gallery', JSON.stringify(gallery));
        loadAndRenderGallery();
        
        if (editingGalleryId === id) {
          resetGalleryForm();
        }
        
        if (itemToDelete) {
          showToast(`Gallery item "${itemToDelete.title}" deleted.`, 'error');
        }
      } else if (e.target.classList.contains('btn-edit')) {
        const itemToEdit = gallery.find(g => g.id === id);
        if (!itemToEdit) return;
        
        // Populate fields
        document.getElementById('galleryTitle').value = itemToEdit.title;
        document.getElementById('galleryLayout').value = itemToEdit.layout || 'normal';
        
        // Modify button display states
        if (galleryFormSubmitBtn) {
          galleryFormSubmitBtn.textContent = 'UPDATE GALLERY DETAILS';
        }
        if (cancelGalleryEditBtn) {
          cancelGalleryEditBtn.style.display = 'block';
        }
        
        editingGalleryId = id;
        
        // Scroll form into view smoothly inside the modal
        const modalBody = document.querySelector('.admin-modal-body');
        if (modalBody) {
          modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        showToast(`Loaded "${itemToEdit.title}" details to edit form.`, 'success');
      }
    });
  }

  /* ==========================================
     6d. Academic Desk (Blog) CMS & Dynamic Rendering
     ========================================== */
  
  // Editing Blog State
  let editingBlogId = null;

  // Blog Form Elements
  const cancelBlogEditBtn = document.getElementById('cancelBlogEditBtn');
  const blogFormSubmitBtn = document.getElementById('blogFormSubmitBtn');

  if (cancelBlogEditBtn) {
    cancelBlogEditBtn.addEventListener('click', () => {
      resetBlogForm();
    });
  }

  function resetBlogForm() {
    editingBlogId = null;
    const form = document.getElementById('adminAddBlogForm');
    if (form) {
      form.reset();
    }
    if (blogFormSubmitBtn) {
      blogFormSubmitBtn.textContent = 'ADD TO DESK';
    }
    if (cancelBlogEditBtn) {
      cancelBlogEditBtn.style.display = 'none';
    }
  }

  // Load and Render Blog Posts
  window.loadAndRenderBlog = function() {
    let posts = localStorage.getItem('udaan_blog_posts');
    if (!posts) {
      posts = defaultBlogPosts;
      localStorage.setItem('udaan_blog_posts', JSON.stringify(posts));
    } else {
      posts = JSON.parse(posts);
    }

    // Render on main page
    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid) {
      blogGrid.innerHTML = '';
      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        
        const imageUrl = post.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80';
        
        article.innerHTML = `
          <div class="blog-img" style="background-image: url('${imageUrl}');"></div>
          <div class="blog-body">
            <span class="blog-date">${post.date} • ${post.tag}</span>
            <h3 class="blog-title"><a href="#">${post.title}</a></h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <a href="#" class="blog-link">Read Full Article &rarr;</a>
          </div>
        `;
        blogGrid.appendChild(article);
      });
    }

    // Render in Admin Panel List
    const adminBlogList = document.getElementById('adminBlogList');
    if (adminBlogList) {
      adminBlogList.innerHTML = '';
      if (posts.length === 0) {
        adminBlogList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 12px;">No articles uploaded to academic desk yet.</p>';
      } else {
        posts.forEach(post => {
          const row = document.createElement('div');
          row.className = 'admin-teacher-item';
          row.innerHTML = `
            <div class="admin-teacher-info">
              <span class="admin-teacher-name">${post.title}</span>
              <span class="admin-teacher-sub">${post.date} • ${post.tag}</span>
            </div>
            <div class="admin-teacher-actions" style="display: flex; gap: 8px;">
              <button type="button" class="btn-edit" data-id="${post.id}">Edit</button>
              <button type="button" class="btn-delete" data-id="${post.id}">Delete</button>
            </div>
          `;
          adminBlogList.appendChild(row);
        });
      }
    }
  };

  // Add/Update a Blog Post Form Handler
  const adminAddBlogForm = document.getElementById('adminAddBlogForm');
  if (adminAddBlogForm) {
    adminAddBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('blogTitle').value.trim();
      const tag = document.getElementById('blogTag').value.trim();
      const excerpt = document.getElementById('blogExcerpt').value.trim();
      
      const imageFileInput = document.getElementById('blogImageFile');
      const file = imageFileInput.files[0];
      
      const posts = JSON.parse(localStorage.getItem('udaan_blog_posts') || '[]');
      
      if (editingBlogId) {
        // Edit Mode
        const oldIndex = posts.findIndex(p => p.id === editingBlogId);
        if (oldIndex === -1) {
          showToast('Failed to find article to edit.', 'error');
          resetBlogForm();
          return;
        }
        const oldPost = posts[oldIndex];
        
        getCompressedImagePromise(file, 600).then(base64Result => {
          posts[oldIndex] = {
            id: editingBlogId,
            title,
            tag,
            excerpt,
            date: oldPost.date, // keep original publish date
            image: base64Result || oldPost.image
          };
          
          localStorage.setItem('udaan_blog_posts', JSON.stringify(posts));
          loadAndRenderBlog();
          resetBlogForm();
          showToast(`Desk article updated successfully!`, 'success');
        });
      } else {
        // Create Mode
        getCompressedImagePromise(file, 600).then(base64Result => {
          const dateStr = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          const newPost = {
            id: 'blog_' + Date.now(),
            title,
            tag,
            excerpt,
            date: dateStr,
            image: base64Result || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
          };
          
          posts.push(newPost);
          localStorage.setItem('udaan_blog_posts', JSON.stringify(posts));
          
          loadAndRenderBlog();
          resetBlogForm();
          showToast('Article added to Academic Desk successfully!', 'success');
        });
      }
    });
  }

  // Blog Action Delegated Click Listener (Edit & Delete)
  const adminBlogListContainer = document.getElementById('adminBlogList');
  if (adminBlogListContainer) {
    adminBlogListContainer.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;
      
      let posts = JSON.parse(localStorage.getItem('udaan_blog_posts') || '[]');
      
      if (e.target.classList.contains('btn-delete')) {
        const postToDelete = posts.find(p => p.id === id);
        posts = posts.filter(p => p.id !== id);
        
        localStorage.setItem('udaan_blog_posts', JSON.stringify(posts));
        loadAndRenderBlog();
        
        if (editingBlogId === id) {
          resetBlogForm();
        }
        
        if (postToDelete) {
          showToast(`Article "${postToDelete.title}" deleted.`, 'error');
        }
      } else if (e.target.classList.contains('btn-edit')) {
        const postToEdit = posts.find(p => p.id === id);
        if (!postToEdit) return;
        
        // Populate fields
        document.getElementById('blogTitle').value = postToEdit.title;
        document.getElementById('blogTag').value = postToEdit.tag;
        document.getElementById('blogExcerpt').value = postToEdit.excerpt || '';
        
        // Modify button display states
        if (blogFormSubmitBtn) {
          blogFormSubmitBtn.textContent = 'UPDATE DESK ARTICLE';
        }
        if (cancelBlogEditBtn) {
          cancelBlogEditBtn.style.display = 'block';
        }
        
        editingBlogId = id;
        
        // Scroll form into view smoothly inside the modal
        const modalBody = document.querySelector('.admin-modal-body');
        if (modalBody) {
          modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        showToast(`Loaded "${postToEdit.title}" details to edit form.`, 'success');
      }
    });
  }

  // Load and print localStorage state on boot
  loadGeneralInfo();
  loadAndRenderTeachers();
  loadAndRenderToppers();
  loadAndRenderGallery();
  loadAndRenderBlog();


  /* ==========================================
     7. Enrollment Modal Control
     ========================================== */
  const enrollModal = document.getElementById('enrollModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const navEnrollBtn = document.getElementById('navEnrollBtn');
  const drawerEnrollBtn = document.getElementById('drawerEnrollBtn');
  const enrollForm = document.getElementById('enrollForm');
  const enrollCourseSelect = document.getElementById('enrollCourse');

  function openEnrollModal(preselectedCourse = '') {
    if (preselectedCourse) {
      enrollCourseSelect.value = preselectedCourse;
    }
    enrollModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEnrollModal() {
    enrollModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open triggers
  navEnrollBtn.addEventListener('click', () => openEnrollModal());
  drawerEnrollBtn.addEventListener('click', () => openEnrollModal());

  // Add click triggers dynamically to "Enroll Now" cards
  document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('enroll-trigger-btn')) {
      const courseName = e.target.getAttribute('data-course');
      openEnrollModal(courseName);
    }
  });

  // Close triggers
  modalCloseBtn.addEventListener('click', closeEnrollModal);
  enrollModal.addEventListener('click', (e) => {
    if (e.target === enrollModal) {
      closeEnrollModal();
    }
  });

  // Form submit handler
  enrollForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentName = document.getElementById('enrollName').value;
    const email = document.getElementById('enrollEmail').value;
    const phone = document.getElementById('enrollPhone').value;
    const program = enrollCourseSelect.value;
    const message = document.getElementById('enrollMessage').value;
    
    const query = {
      id: 'q_' + Date.now(),
      type: 'Enrollment Request',
      name: studentName,
      email,
      phone,
      detail: `Program: ${program}`,
      message: message || 'No additional message provided.',
      timestamp: new Date().toLocaleString()
    };
    
    // Save to localStorage
    const queries = JSON.parse(localStorage.getItem('udaan_queries') || '[]');
    queries.unshift(query);
    localStorage.setItem('udaan_queries', JSON.stringify(queries));
    
    // Trigger mail client
    const currentInfo = JSON.parse(localStorage.getItem('udaan_general_info') || '{}');
    const academyEmail = currentInfo.email || 'admissions@udaanacademymys.com';
    const subject = encodeURIComponent(`[Udaan Enrollment] Request from ${studentName}`);
    const body = encodeURIComponent(
      `Udaan Academy Enrollment Request Details:\n\n` +
      `Student Name: ${studentName}\n` +
      `Email Address: ${email}\n` +
      `Contact Phone: ${phone}\n` +
      `Target Program: ${program}\n` +
      `Message: ${message || 'N/A'}\n\n` +
      `Submitted at: ${query.timestamp}`
    );
    
    window.location.href = `mailto:${academyEmail}?subject=${subject}&body=${body}`;
    
    closeEnrollModal();
    showToast(`Enrollment request saved to admin portal!`, 'success');
    enrollForm.reset();
  });


  /* ==========================================
     8. Contact Form Handler
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const phone = document.getElementById('contactPhone').value;
      const subjectInterest = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;
      
      const query = {
        id: 'q_' + Date.now(),
        type: 'General Query',
        name: clientName,
        email,
        phone,
        detail: `Topic: ${subjectInterest}`,
        message,
        timestamp: new Date().toLocaleString()
      };
      
      // Save to localStorage
      const queries = JSON.parse(localStorage.getItem('udaan_queries') || '[]');
      queries.unshift(query);
      localStorage.setItem('udaan_queries', JSON.stringify(queries));
      
      // Trigger mail client
      const currentInfo = JSON.parse(localStorage.getItem('udaan_general_info') || '{}');
      const academyEmail = currentInfo.email || 'admissions@udaanacademymys.com';
      const subject = encodeURIComponent(`[Udaan Contact] Query from ${clientName}`);
      const body = encodeURIComponent(
        `Udaan Academy Contact Inquiry Details:\n\n` +
        `Name: ${clientName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Topic: ${subjectInterest}\n` +
        `Message: ${message}\n\n` +
        `Submitted at: ${query.timestamp}`
      );
      
      window.location.href = `mailto:${academyEmail}?subject=${subject}&body=${body}`;
      
      showToast(`Query saved to admin portal!`, 'success');
      contactForm.reset();
    });
  }


  /* ==========================================
     9. Queries Rendering & Controls
     ========================================== */
  window.renderQueries = function() {
    const list = document.getElementById('adminQueriesList');
    if (!list) return;
    
    const queries = JSON.parse(localStorage.getItem('udaan_queries') || '[]');
    list.innerHTML = '';
    
    if (queries.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No user queries submitted yet.</p>';
      return;
    }
    
    queries.forEach(q => {
      const badgeClass = q.type === 'Enrollment Request' ? 'enroll' : 'general';
      const card = document.createElement('div');
      card.className = 'query-card';
      card.innerHTML = `
        <div class="query-card-header">
          <span class="query-type-badge ${badgeClass}">${q.type}</span>
          <span class="query-time">${q.timestamp}</span>
        </div>
        <div class="query-field"><strong>Name</strong> <span>${q.name}</span></div>
        <div class="query-field"><strong>Contact</strong> <span>${q.email} | ${q.phone}</span></div>
        <div class="query-field"><strong>Info</strong> <span>${q.detail}</span></div>
        <div class="query-message">${q.message}</div>
      `;
      list.appendChild(card);
    });
  };

  const clearQueriesBtn = document.getElementById('clearQueriesBtn');
  if (clearQueriesBtn) {
    clearQueriesBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all user queries?')) {
        localStorage.setItem('udaan_queries', JSON.stringify([]));
        renderQueries();
        showToast('All queries cleared.', 'error');
      }
    });
  }


  /* ==========================================
     10. Newsletter Subscription Handler
     ========================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      showToast('Subscribed successfully to Udaan Newsletter!', 'success');
      newsletterForm.reset();
    });
  }

});
