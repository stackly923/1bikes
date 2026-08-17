// Demo button actions
// Prevents placeholder buttons from submitting forms during the static demo.
document.querySelectorAll('form button').forEach((button) => {
    button.addEventListener('click', (event) => {
        if (button.closest('[data-contact-select]')) {
            return;
        }

        if (button.type === 'button') {
            event.preventDefault();
            alert('Demo action completed. Connect your backend/API for live marketplace functionality.');
        }
    });
});

// Interactive bike colour and price selector
document.addEventListener('DOMContentLoaded', () => {
    const bikeImage = document.getElementById('configBikeImage');
    const price = document.getElementById('configPrice');
    const colorName = document.getElementById('configColorName');
    const swatches = document.querySelectorAll('.color-swatch');

    if (!bikeImage || !swatches.length) {
        return;
    }

    swatches.forEach((button) => {
        button.addEventListener('click', () => {
            swatches.forEach((swatch) => swatch.classList.remove('active'));
            button.classList.add('active');

            bikeImage.style.filter = button.dataset.filter || 'none';
            price.textContent = button.dataset.price || price.textContent;
            colorName.textContent = button.dataset.name || colorName.textContent;
        });
    });

    const activeSwatch = document.querySelector('.color-swatch.active');
    if (activeSwatch) {
        bikeImage.style.filter = activeSwatch.dataset.filter || 'none';
    }
});

// Authentication validation and role-based routing
(() => {
    const enquiryForm = document.getElementById('enquiryForm');

    document.querySelectorAll('[data-contact-select]').forEach((customSelect) => {
        const trigger = customSelect.querySelector('.contact-select-trigger');
        const triggerText = trigger.querySelector('span');
        const hiddenInput = customSelect.querySelector('input[type="hidden"]');
        const options = customSelect.querySelectorAll('.contact-select-menu button');

        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('[data-contact-select].open').forEach((select) => {
                if (select !== customSelect) {
                    select.classList.remove('open');
                    select.querySelector('.contact-select-trigger')?.setAttribute('aria-expanded', 'false');
                }
            });

            const isOpen = customSelect.classList.toggle('open');
            trigger.setAttribute('aria-expanded', String(isOpen));
        });

        options.forEach((option) => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const label = option.textContent.trim();
                options.forEach((item) => item.classList.remove('active'));
                option.classList.add('active');
                triggerText.textContent = label;
                hiddenInput.value = option.dataset.value;
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (event) => {
            if (!customSelect.contains(event.target)) {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && customSelect.classList.contains('open')) {
                customSelect.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });
    });

    if (enquiryForm) {

        const firstNameInput = document.getElementById('enquiryFirstName');
        const lastNameInput = document.getElementById('enquiryLastName');
        const emailInput = document.getElementById('enquiryEmail');
        const phoneInput = document.getElementById('enquiryPhone');
        const messageInput = document.getElementById('enquiryMessage');
        const messageBox = document.getElementById('enquiryMessageBox');
        const alphaOnly = /[^a-zA-Z\s]/g;
        const showEnquiryMessage = (message) => {
            messageBox.className = 'form-message error-message';
            messageBox.textContent = message;
        };

        [firstNameInput, lastNameInput].forEach((input) => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(alphaOnly, '');
            });
        });

        phoneInput.addEventListener('input', () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        });

        enquiryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const message = messageInput.value.trim();

            if (!firstName || !lastName || !email || !phone || !message) {
                showEnquiryMessage('Please fill all details before sending your enquiry.');
                return;
            }

            if (!/^[a-zA-Z\s]+$/.test(firstName) || !/^[a-zA-Z\s]+$/.test(lastName)) {
                showEnquiryMessage('Name and Last Name should contain alphabets only.');
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showEnquiryMessage('Please enter a valid email address.');
                return;
            }

            if (!/^\d{10}$/.test(phone)) {
                showEnquiryMessage('Phone Number should contain exactly 10 digits.');
                return;
            }

            messageBox.className = 'form-message success-message';
            messageBox.textContent = 'Enquiry sent successfully. Redirecting...';
            window.location.href = '404.html';
        });
    }

    const sellBikeForm = document.getElementById('sellBikeForm');

    if (sellBikeForm) {
        const sellBikeMessage = document.getElementById('sellBikeMessage');
        const requiredFields = [
            document.getElementById('sellBikeBrand'),
            document.getElementById('sellBikeModel'),
            document.getElementById('sellBikeYear'),
            document.getElementById('sellBikeKilometres'),
            document.getElementById('sellBikeCity'),
            sellBikeForm.querySelector('input[name="ownership"]'),
            document.getElementById('sellBikeDetails')
        ];

        sellBikeForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const hasEmptyField = requiredFields.some((field) => !field.value.trim());

            if (hasEmptyField) {
                sellBikeMessage.className = 'form-message error-message';
                sellBikeMessage.textContent = 'Please fill all bike details before getting the estimated value.';
                sellBikeMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            sellBikeMessage.className = 'form-message success-message';
            sellBikeMessage.textContent = 'Details submitted. Opening estimated value...';
            window.location.href = '404.html';
        });
    }

    const signinForm = document.getElementById('signinForm');

    if (signinForm) {
        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value.trim();
            const role = document.getElementById('signinRole').value;
            const messageBox = document.getElementById('signinError');

            messageBox.className = 'form-message error-message';

            if (!email || !password || !role) {
                messageBox.textContent = 'Please fill Email Address, Password and Role before signing in.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                messageBox.textContent = 'Please enter a valid email address.';
                return;
            }

            messageBox.className = 'form-message success-message';
            messageBox.textContent = 'Sign in successful. Opening your dashboard...';
            localStorage.setItem('stacklySignedInEmail', email);

            setTimeout(() => {
                window.location.href = role === 'admin'
                    ? 'admin-dashboard.html'
                    : 'client-dashboard.html';
            }, 650);
        });
    }

    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageBox = document.getElementById('registerMessage');

            messageBox.className = 'form-message error-message';

            if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
                messageBox.textContent = 'Please fill all fields before creating your account.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                messageBox.textContent = 'Please enter a valid email address.';
                return;
            }

            if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
                messageBox.textContent = 'Please enter a valid 10-digit mobile number.';
                return;
            }

            if (password.length < 6) {
                messageBox.textContent = 'Password must contain at least 6 characters.';
                return;
            }

            if (password !== confirmPassword) {
                messageBox.textContent = 'Password and Confirm Password do not match.';
                return;
            }

            messageBox.className = 'form-message success-message';
            messageBox.textContent = 'Your account is created successfully! Redirecting to Sign In...';

            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 1100);
        });
    }

    const dashboardEmail = localStorage.getItem('stacklySignedInEmail');

    if (dashboardEmail) {
        document.querySelectorAll('[data-dashboard-email]').forEach((item) => {
            item.textContent = dashboardEmail;
        });

        document.querySelectorAll('[data-dashboard-email-input]').forEach((item) => {
            item.value = dashboardEmail;
        });
    }

    // Dashboard sidebar navigation without page reload
    const dashboardLinks = document.querySelectorAll('.dash-link[data-panel]');

    if (dashboardLinks.length) {
        const openPanel = (panelId) => {
            document.querySelectorAll('.dash-panel').forEach((panel) => {
                panel.classList.toggle('active', panel.id === panelId);
            });

            dashboardLinks.forEach((link) => {
                link.classList.toggle('active', link.dataset.panel === panelId);
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        dashboardLinks.forEach((link) => {
            link.addEventListener('click', () => openPanel(link.dataset.panel));
        });

        document.querySelectorAll('[data-open-panel]').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                openPanel(link.dataset.openPanel);
            });
        });
    }

    document.querySelectorAll('[data-profile-form]').forEach((profileForm) => {
        const saveButton = profileForm.querySelector('[data-profile-save]');
        const messageBox = profileForm.querySelector('[data-profile-message]');
        const fields = Array.from(profileForm.querySelectorAll('input[required]'));

        if (!saveButton || !messageBox || !fields.length) {
            return;
        }

        saveButton.addEventListener('click', () => {
            const firstInvalidField = fields.find((field) => !field.value.trim() || !field.checkValidity());

            if (firstInvalidField) {
                fields.forEach((field) => field.classList.toggle('is-invalid', field === firstInvalidField));
                messageBox.className = 'form-message error-message profile-message';
                messageBox.textContent = 'Please fill this field.';
                firstInvalidField.focus();
                return;
            }

            fields.forEach((field) => field.classList.remove('is-invalid'));
            messageBox.className = 'form-message success-message profile-message';
            messageBox.textContent = 'Profile details saved successfully. Redirecting...';

            setTimeout(() => {
                window.location.href = '404.html';
            }, 900);
        });

        fields.forEach((field) => {
            field.addEventListener('input', () => {
                field.classList.remove('is-invalid');
            });
        });
    });
})();

// Tap-friendly bike detail flip cards
(() => {
    const flipCards = document.querySelectorAll('.story-flip-card');

    flipCards.forEach((card) => {
        card.addEventListener('click', (event) => {
            event.stopPropagation();
            flipCards.forEach((otherCard) => {
                if (otherCard !== card) {
                    otherCard.classList.remove('is-flipped');
                }
            });
            card.classList.toggle('is-flipped');
        });
    });

    document.addEventListener('click', () => {
        flipCards.forEach((card) => card.classList.remove('is-flipped'));
    });
})();

// Home premium bike colour viewer
(() => {
    const viewer = document.getElementById('premiumBikeViewer');
    const bikeImage = document.getElementById('premiumBikeImage');
    const price = document.getElementById('premiumBikePrice');
    const colorName = document.getElementById('premiumBikeColor');
    const swatches = document.querySelectorAll('.premium-color-swatch');

    if (!viewer || !bikeImage || !price || !colorName || !swatches.length) {
        return;
    }

    const bikes = {
        red: {
            color: 'Red',
            price: 'Rs 17.80 Lakh',
            alt: 'Red Ducati Panigale V2 premium used motorcycle',
            filter: 'saturate(1.08) contrast(1.04)'
        },
        orange: {
            color: 'Orange',
            price: 'Rs 18.25 Lakh',
            alt: 'Orange Ducati Panigale V2 premium used motorcycle',
            filter: 'hue-rotate(35deg) saturate(1.65) brightness(1.06) contrast(1.08)'
        },
        blue: {
            color: 'Blue',
            price: 'Rs 16.95 Lakh',
            alt: 'Blue Ducati Panigale V2 premium used motorcycle',
            filter: 'hue-rotate(215deg) saturate(1.25) contrast(1.05)'
        }
    };

    const bikeSource = 'assets/images/user-bike-set/bike-02-ducati-red.webp';

    let activeColor = 'red';

    const renderBike = () => {
        const bike = bikes[activeColor];

        viewer.classList.add('is-changing');
        bikeImage.src = bikeSource;
        bikeImage.alt = bike.alt;
        bikeImage.style.setProperty('--bike-color-filter', bike.filter);
        price.textContent = bike.price;
        colorName.textContent = bike.color;

        window.setTimeout(() => viewer.classList.remove('is-changing'), 160);
    };

    swatches.forEach((swatch) => {
        swatch.addEventListener('click', () => {
            activeColor = swatch.dataset.color;

            swatches.forEach((item) => item.classList.remove('active'));
            swatch.classList.add('active');
            renderBike();
        });
    });

    renderBike();
})();

// Responsive public navigation and dashboard drawer
(() => {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navigation = document.querySelector('.navlinks');

    const syncHeader = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 12);
        }
    };

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (navigation) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navigation.querySelectorAll('a').forEach((link) => {
            const linkPage = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').pop() || 'index.html';
            link.classList.toggle('active', linkPage === currentPage);
        });
    }

    if (mobileToggle && navigation) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navigation.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');

            mobileToggle.setAttribute('aria-expanded', String(isOpen));

            if (icon) {
                icon.className = isOpen
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
            }
        });

        navigation.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                const icon = mobileToggle.querySelector('i');

                navigation.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');

                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
            });
        });
    }

    const dashboardToggle = document.querySelector('.dash-menu-toggle');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');

    if (dashboardToggle && dashboardSidebar) {
        const closeDashboardMenu = () => {
            const icon = dashboardToggle.querySelector('i');

            dashboardSidebar.classList.remove('open');
            document.body.classList.remove('menu-open');

            if (icon) {
                icon.className = 'fa-solid fa-bars';
            }
        };

        dashboardToggle.addEventListener('click', () => {
            const isOpen = dashboardSidebar.classList.toggle('open');
            const icon = dashboardToggle.querySelector('i');

            document.body.classList.toggle('menu-open', isOpen);

            if (icon) {
                icon.className = isOpen
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
            }
        });

        dashboardSidebar.querySelectorAll('.dash-link, a').forEach((item) => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    closeDashboardMenu();
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                closeDashboardMenu();
            }
        });
    }
})();
