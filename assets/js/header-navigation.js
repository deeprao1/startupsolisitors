/**
 * Header Navigation - Complete Mobile & Desktop Solution
 * Version: 2.0
 * Handles: Hamburger menu, mega menus, sticky header, responsive behavior
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }

  function initHeader() {
    // Initialize all header functionality
    initMobileMenu();
    initMegaMenus();
    initStickyHeader();
    initResponsiveHandlers();
  }

  // ============================================
  // MOBILE HAMBURGER MENU
  // ============================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.ak-munu_toggle');
    const navList = document.querySelector('.ak-nav_list');
    const body = document.body;

    if (!menuToggle || !navList) return;

    // Hamburger click handler
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = this.classList.toggle('ak-toggle_active');
      
      if (isActive) {
        navList.style.display = 'block';
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
      } else {
        closeMainMenu();
      }
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 1200) {
        if (!e.target.closest('.ak-nav') && !e.target.closest('.ak-munu_toggle')) {
          closeMainMenu();
        }
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuToggle.classList.contains('ak-toggle_active')) {
        closeMainMenu();
      }
    });

    function closeMainMenu() {
      menuToggle.classList.remove('ak-toggle_active');
      navList.style.display = 'none';
      body.classList.remove('menu-open');
      body.style.overflow = '';
      closeAllSubMenus();
    }
  }

  // ============================================
  // TOP LEVEL MENU ITEMS (Services, Location, Industry)
  // ============================================
  function initMegaMenus() {
    const topLevelItems = document.querySelectorAll('.ak-nav_list > li.menu-item-has-children');
    
    topLevelItems.forEach(item => {
      const link = item.querySelector(':scope > a');
      const submenu = item.querySelector(':scope > ul');
      
      if (!link || !submenu) return;

      // Create mobile toggle button
      createMobileToggle(item, link);

      // Handle clicks for mobile
      link.addEventListener('click', function(e) {
        if (window.innerWidth < 1200) {
          e.preventDefault();
          e.stopPropagation();
          toggleTopLevelMenu(item, submenu);
        }
      });

      // Initialize category toggles within this menu
      initCategoryToggles(submenu);
    });
  }

  // Create mobile toggle button (+/-)
  function createMobileToggle(item, link) {
    let toggleBtn = item.querySelector('.ak-mobile-toggle');
    
    if (!toggleBtn) {
      toggleBtn = document.createElement('span');
      toggleBtn.className = 'ak-mobile-toggle';
      toggleBtn.innerHTML = '+';
      toggleBtn.setAttribute('aria-label', 'Toggle submenu');
      
      // Insert after the link
      if (link.nextSibling) {
        link.parentNode.insertBefore(toggleBtn, link.nextSibling);
      } else {
        link.parentNode.appendChild(toggleBtn);
      }

      // Toggle button click handler
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.innerWidth < 1200) {
          const submenu = item.querySelector(':scope > ul');
          toggleTopLevelMenu(item, submenu);
        }
      });
    }
  }

  // Toggle top-level menu item
  function toggleTopLevelMenu(item, submenu) {
    const isOpen = item.classList.contains('mobile-open');
    const toggleBtn = item.querySelector('.ak-mobile-toggle');
    
    // Close all other top-level menus
    document.querySelectorAll('.ak-nav_list > li.menu-item-has-children').forEach(otherItem => {
      if (otherItem !== item) {
        closeTopLevelMenu(otherItem);
      }
    });
    
    // Toggle current menu
    if (isOpen) {
      closeTopLevelMenu(item);
    } else {
      item.classList.add('mobile-open');
      submenu.style.display = 'block';
      if (toggleBtn) toggleBtn.innerHTML = '−';
      
      // Smooth scroll to menu if needed
      setTimeout(() => {
        const rect = item.getBoundingClientRect();
        if (rect.top < 0) {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  // Close top-level menu
  function closeTopLevelMenu(item) {
    const submenu = item.querySelector(':scope > ul');
    const toggleBtn = item.querySelector('.ak-mobile-toggle');
    
    item.classList.remove('mobile-open');
    if (submenu) submenu.style.display = 'none';
    if (toggleBtn) toggleBtn.innerHTML = '+';
    
    // Close all categories within this menu
    const categories = item.querySelectorAll('.mega-main-category');
    categories.forEach(cat => closeCategoryMenu(cat));
  }

  // ============================================
  // MEGA MENU CATEGORIES (Left side items)
  // ============================================
  function initCategoryToggles(parentMenu) {
    const categories = parentMenu.querySelectorAll('.mega-main-category');
    
    categories.forEach(category => {
      const link = category.querySelector(':scope > a');
      const subServices = category.querySelector('.mega-sub-services');
      
      if (!link || !subServices) return;

      // Create category toggle indicator
      createCategoryToggle(category, link);

      // Mobile click handler
      link.addEventListener('click', function(e) {
        if (window.innerWidth < 1200) {
          e.preventDefault();
          e.stopPropagation();
          toggleCategoryMenu(category, subServices, parentMenu);
        }
      });

      // Desktop hover handler
      if (window.innerWidth >= 1200) {
        category.addEventListener('mouseenter', function() {
          handleDesktopHover(this);
        });
      }
    });
  }

  // Create category toggle indicator
  function createCategoryToggle(category, link) {
    let toggleIndicator = category.querySelector('.category-toggle');
    
    if (!toggleIndicator) {
      toggleIndicator = document.createElement('span');
      toggleIndicator.className = 'category-toggle';
      toggleIndicator.innerHTML = '+';
      toggleIndicator.setAttribute('aria-label', 'Toggle category');
      link.appendChild(toggleIndicator);
    }
  }

  // Toggle category menu
  function toggleCategoryMenu(category, subServices, parentMenu) {
    const isOpen = category.classList.contains('mobile-expanded');
    const toggleIndicator = category.querySelector('.category-toggle');
    
    // Close all other categories in same menu
    const allCategories = parentMenu.querySelectorAll('.mega-main-category');
    allCategories.forEach(otherCat => {
      if (otherCat !== category) {
        closeCategoryMenu(otherCat);
      }
    });
    
    // Toggle current category
    if (isOpen) {
      closeCategoryMenu(category);
    } else {
      category.classList.add('mobile-expanded');
      subServices.style.display = 'block';
      if (toggleIndicator) toggleIndicator.innerHTML = '−';
      
      // Smooth scroll if needed
      setTimeout(() => {
        const rect = category.getBoundingClientRect();
        if (rect.top < 80) {
          category.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  // Close category menu
  function closeCategoryMenu(category) {
    const subServices = category.querySelector('.mega-sub-services');
    const toggleIndicator = category.querySelector('.category-toggle');
    
    category.classList.remove('mobile-expanded');
    if (subServices) subServices.style.display = 'none';
    if (toggleIndicator) toggleIndicator.innerHTML = '+';
  }

  // Desktop hover handler
  function handleDesktopHover(category) {
    const target = category.getAttribute('data-target');
    const parentMenu = category.closest('ul');
    
    if (!parentMenu) return;
    
    // Remove active from all categories
    parentMenu.querySelectorAll('.mega-main-category').forEach(cat => {
      cat.classList.remove('active');
    });
    category.classList.add('active');
    
    // Hide all sub-services
    parentMenu.querySelectorAll('.mega-sub-services').forEach(service => {
      service.classList.remove('active');
    });
    
    // Show target sub-service
    const targetService = parentMenu.querySelector('#' + target);
    if (targetService) {
      targetService.classList.add('active');
    }
  }

  // ============================================
  // STICKY HEADER
  // ============================================
  function initStickyHeader() {
    const header = document.querySelector('.ak-site_header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    function handleScroll() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('ak-gescout_sticky', 'ak-gescout_show');
      } else {
        header.classList.remove('ak-gescout_sticky', 'ak-gescout_show');
      }
      
      lastScroll = currentScroll;
    }
  }

  // ============================================
  // RESPONSIVE HANDLERS
  // ============================================
  function initResponsiveHandlers() {
    let resizeTimer;
    let currentWidth = window.innerWidth;

    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        const newWidth = window.innerWidth;
        
        // Only handle if crossing breakpoint
        if ((currentWidth < 1200 && newWidth >= 1200) || 
            (currentWidth >= 1200 && newWidth < 1200)) {
          handleBreakpointChange(newWidth);
        }
        
        currentWidth = newWidth;
      }, 250);
    });
  }

  function handleBreakpointChange(width) {
    const menuToggle = document.querySelector('.ak-munu_toggle');
    const navList = document.querySelector('.ak-nav_list');
    const body = document.body;

    if (width >= 1200) {
      // Desktop view
      if (navList) navList.style.display = '';
      body.classList.remove('menu-open');
      body.style.overflow = '';
      closeAllSubMenus();
      if (menuToggle) menuToggle.classList.remove('ak-toggle_active');
      
      // Re-initialize desktop hover
      document.querySelectorAll('.mega-main-category').forEach(category => {
        const clone = category.cloneNode(true);
        category.parentNode.replaceChild(clone, category);
        
        clone.addEventListener('mouseenter', function() {
          handleDesktopHover(this);
        });
      });
    } else {
      // Mobile view
      if (menuToggle && !menuToggle.classList.contains('ak-toggle_active')) {
        if (navList) navList.style.display = 'none';
      }
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function closeAllSubMenus() {
    // Close all top-level menus
    document.querySelectorAll('.ak-nav_list > li.menu-item-has-children').forEach(item => {
      closeTopLevelMenu(item);
    });
    
    // Close all category menus
    document.querySelectorAll('.mega-main-category').forEach(category => {
      closeCategoryMenu(category);
    });
  }

  // Public API (if needed)
  window.HeaderNavigation = {
    closeAllMenus: closeAllSubMenus,
    version: '2.0'
  };

})();