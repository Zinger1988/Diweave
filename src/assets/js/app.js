"use strict"

class Modal {
    static modalElements = null;
    static activeModal = null;
    static modalOverlay = document.createElement('div');

    constructor(modalSelector) {
        Modal.modalElements = Array.from(document.querySelectorAll(modalSelector));
        Modal.modalOverlay.id = 'modal-overlay';
        Modal.setHandlers();
        Modal.callbacks = {
            onHide: (activeModal) => {
                const forms = activeModal.querySelectorAll('form');
                if(forms.length !== 0){
                    forms.forEach(f => SiteJS.formReset(f));
                }
            },
        }
    }

    static bindButton(buttonEl) {
        buttonEl.addEventListener('click', () => {
            if(Modal.activeModal){
                Modal.hide();
            }
            const modalId = buttonEl.getAttribute('data-modal-id');
            Modal.show(modalId);
            Modal.showOverlay();
        })
    }

    static setHandlers(){
        const modalButtons = document.querySelectorAll('[data-modal-id]');

        modalButtons.forEach(button => {
            Modal.bindButton(button);
        });

        Modal.modalOverlay.addEventListener('click', (e) => {
            Modal.callbacks.onHide(Modal.activeModal);
            Modal.hide();
            Modal.hideOverlay();
        })

        Modal.modalElements.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if(e.target.classList.contains('modal-close') || e.target.closest('.modal-close:not(.modal)')){
                    Modal.hide();
                    Modal.hideOverlay();
                }
            })
        });
    }

    static showOverlay(){
        const overlay = document.querySelector('#modal-overlay');
        if(overlay) return;

        document.body.append(Modal.modalOverlay);
        document.body.classList.add('no-overflow');

        let alpha = .01;
        const timer = setInterval(() => {
            if (alpha >= 0.8){
                clearInterval(timer);
            } else {
                Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${alpha += 0.1})`;
            }
        }, 20);
    }

    static hideOverlay(){
        const overlay = document.querySelector('#modal-overlay');
        if(!overlay) return;

        document.body.classList.remove('no-overflow');

        let alpha = 0.56;
        const timer = setInterval(() => {
            if (alpha <= 0.1){
                overlay.remove()
                clearInterval(timer);
            } else {
                Modal.modalOverlay.style.backgroundColor = `rgba(0,0,0, ${alpha -= 0.1})`;
            }
        }, 20);
    }

    static show(modalId){
        const targetModal = Modal.modalElements.find(element => element.id === modalId);
        Modal.activeModal = targetModal;
        targetModal.classList.add('visible');
    }

    static hide(){
        Modal.callbacks.onHide(Modal.activeModal);
        Modal.activeModal.classList.remove('visible');
        Modal.activeModal = null;
    }
}

class Validation {
    constructor(element) {
        this.element = element;
        this.validityChecks = [];
        this.invalidities = [];
        this.invaliditiesElements = [];
    }

    init() {
        this.setHandler(this.element, 'validation')
    }

    setHandler(element, text) {
        if (element.tagName.toLowerCase() !== 'select') {
            element.addEventListener('keyup', (e) => {
                e.preventDefault();
                this.checkValidity(element)
            })
        } else {
            element.addEventListener('change', (e) => {
                e.preventDefault();
                this.checkValidity(element)
            })
        }
    }

    checkValidity(element) {
        this.clearInvalidities(element);

        if (!this.element.disabled) {
            this.validityChecks.forEach(check => {
                if (check.isInvalid(this.element)) {
                    this.addInvalidity(check.invalidityMessage);
                }
            })

            if (this.invalidities.length) {
                this.element.classList.add('invalid');
                this.element.classList.remove('valid');

                this.createInvalidityElements(this.invalidities);
                this.showInvalidityElements(this.invaliditiesElements);

                return false

            } else {
                this.element.classList.add('valid');
                this.element.classList.remove('invalid');
            }
        }
    }

    createInvalidityElements(invalidities) {
        invalidities.forEach(invalidity => {
            const message = document.createElement('div');
            message.classList.add('error-message');
            message.textContent = invalidity;

            this.invaliditiesElements.push(message);
        })
    }

    showInvalidityElements(elements) {
        elements.forEach(item => this.element.after(item))
    }

    clearInvalidities() {
        this.invaliditiesElements.forEach(element => element.remove());
        this.invaliditiesElements = [];
        this.invalidities = [];
        this.element.classList.remove('invalid');
        this.element.classList.remove('valid');
    }

    addValidityChecks(check) {
        this.validityChecks.push(...check)
    }

    addInvalidity(message) {
        this.invalidities.push(message)
    }

    getStatus() {
        return this.invalidities.length ? 'invalid' : 'valid'
    }
}

const SiteJS = {
    onload: document.addEventListener('DOMContentLoaded', function () {

        SiteJS.init();
    }),
    init: function () {
        new Modal('.modal');

        const mainSlider = document.querySelector('.main-slider__body');

        if(mainSlider){
            const swiper = new Swiper('.main-slider__body', {
                preloadImages: false,
                lazy: true,
                navigation: {
                    nextEl: '.main-slider__nav-btn--next',
                    prevEl: '.main-slider__nav-btn--prev'
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            });
        }

        const newsSlider = document.querySelector('.news__carousel');

        if(newsSlider){
            const swiperNews = new Swiper('.news__carousel', {
                freeMode: true,
                preloadImages: false,
                lazy: true,
                spaceBetween: 30,
                breakpoints: {
                    320: {
                        slidesPerView: 'auto',
                        spaceBetween: 20
                    },
                    576: {
                        slidesPerView: 'auto',
                        spaceBetween: 30
                    },
                    768: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                    992: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                    }
                }
            });

            const newsSliderNextBtn = document.querySelector('.news__nav-next');
            const newsSliderPrevBtn = document.querySelector('.news__nav-prev');

            newsSliderNextBtn.addEventListener('click', () => {
                swiperNews.slideNext();
            });

            newsSliderPrevBtn.addEventListener('click', () => {
                swiperNews.slidePrev();
            });
        }

        const brandsSlider = document.querySelector('.brands__carousel');

        if(brandsSlider){
            const swiperBrands = new Swiper('.brands__carousel', {
                freeMode: true,
                preloadImages: false,
                lazy: true,
                spaceBetween: 30,
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 30
                    },
                    576: {
                        slidesPerView: 1,
                        spaceBetween: 30
                    },
                    768: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 2,
                    },
                    1000: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                    1200: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 50,
                    },
                    1600: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 60,
                    },
                }
            });

            const brandsSliderNextBtn = document.querySelector('.brands__nav-next');
            const brandsSliderPrevBtn = document.querySelector('.brands__nav-prev');

            brandsSliderNextBtn.addEventListener('click', () => {
                swiperBrands.slideNext();
            });

            brandsSliderPrevBtn.addEventListener('click', () => {
                swiperBrands.slidePrev();
            });
        }

        this.typeDisplay();
        this.tabs();
        this.sidebar();
        this.headerSearch();
        this.startValidation({
            formSelector: '#partnership-form'
        });
    },
    startValidation: function({formSelector, cb = () => {}}){

        const formCollection = document.querySelectorAll(formSelector);

        if(!formCollection.length) return;

        formCollection.forEach(formEl => {
            const submitBtnCollection = formEl.querySelectorAll('[data-validation-btn]');

            submitBtnCollection.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.appendValidation(formEl, cb);
                })
            })
        })
    },
    appendValidation(formElement, cb) {

        const formControls = formElement.querySelectorAll('[data-validation]');

        // Validity checks
        const validityChecks = {
            empty: [
                {
                    isInvalid(elem) {
                        if (elem.tagName.toLowerCase() == 'select') {
                            this.invalidityMessage = 'Выберите один из пунктов';
                        } else {
                            this.invalidityMessage = 'Це поле необхідно заповнити';
                        }
                        return !elem.value;
                    },
                    invalidityMessage: '',
                }
            ],
            email: [
                {
                    isInvalid(elem) {
                        let illegalCharacters = elem.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
                        return elem.value && !illegalCharacters;
                    },
                    invalidityMessage: 'Ввеідть коректний e-mail'
                }
            ],
            tel: [
                {
                    isInvalid(elem) {
                        let illegalCharacters = elem.value.match(/[^0-9+()]/g);
                        return !!illegalCharacters;
                    },
                    invalidityMessage: 'Неприпустимі символи. Тільки цифри, знак плюс "+" и круглі дужки "()"'
                }
            ],
        }


        // applying Validation class and binding checks for inputs by data attribute
        formControls.forEach(element => {
            if(!element.customValidation){
                element.customValidation = new Validation(element);
                element.customValidation.init()

                const validationPattern = element.getAttribute('data-validation');

                element.customValidation.addValidityChecks(validityChecks.empty);

                switch (validationPattern) {
                    case 'name':
                        element.customValidation.addValidityChecks(validityChecks.name);
                        break;
                    case 'zip':
                        element.customValidation.addValidityChecks(validityChecks.zip);
                        break;
                    case 'tel':
                        element.customValidation.addValidityChecks(validityChecks.tel);
                        break;
                    case 'cc-number':
                        element.customValidation.addValidityChecks(validityChecks.ccNumber);
                        break;
                    case 'cc-exp':
                        element.customValidation.addValidityChecks(validityChecks.ccExp);
                        break;
                    case 'age':
                        element.customValidation.addValidityChecks(validityChecks.age);
                        break;
                    case 'date':
                        element.customValidation.addValidityChecks(validityChecks.date);
                        break;
                    case 'email':
                        element.customValidation.addValidityChecks(validityChecks.email);
                        break;
                    case 'password':
                        element.customValidation.addValidityChecks(validityChecks.password);
                        break;
                    case 'password-repeat':
                        element.customValidation.addValidityChecks(validityChecks.passwordRepeat);
                        break;
                }
            }
        });

        // Checking inputs when form going to be submitted
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();

            formControls.forEach(element => {
                element.customValidation.checkValidity()
            });

            const invalidElements = Array.from(formControls).some(element => element.customValidation.getStatus() === 'invalid');

            if (!invalidElements) {
                cb();
            }
        }, {once: true})
    },
    typeDisplay() {
        if ("ontouchstart" in document.documentElement) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('hover-device');
        }
    },
    tabs() {
        const wrappers = document.querySelectorAll('.tabs');

        if(wrappers.length === 0){
            return
        }

        wrappers.forEach(wrapper => {
            const tabsHead = wrapper.querySelector('.tabs__head');
            const tabsHeadBtn = tabsHead.querySelectorAll('.tabs__head-item');
            const tabsContent = wrapper.querySelector('.tabs__content');
            const contentItems = tabsContent.querySelectorAll('.tabs__content-item');

            tabsHead.addEventListener('click', (e) => {
                if(e.target.classList.contains('tabs__head-item')){
                    const tabsContentId = e.target.dataset['tabTarget'];
                    e.target.classList.add('tabs__head-item--active');

                    tabsHeadBtn.forEach(btn => {
                        if(btn !== e.target){
                            btn.classList.remove('tabs__head-item--active');
                        }
                    })

                    contentItems.forEach(item => {
                        if(item.dataset['tabId'] === tabsContentId){
                            item.classList.add('tabs__content-item--active');
                            return
                        }

                        item.classList.remove('tabs__content-item--active');
                    })
                }
            })
        });
    },
    sidebar() {

        const header = document.querySelector('.header');
        const menuBtn = document.querySelector('.header__menu-btn');
        const sidebar = document.querySelector('.sidebar');
        const sidebarBody = sidebar.querySelector('.sidebar__body');
        const searchInput = sidebar.querySelector('.search__control');

        menuBtn.addEventListener('click', toggleSidebar);
        sidebar.addEventListener('click', toggleSidebar);
        sidebarBody.addEventListener('click', (e) => e.stopPropagation());
        header.addEventListener('click', (e) => {
            if(e.target !== menuBtn && !e.target.closest('.header__menu-btn')){
                sidebar.classList.remove('sidebar--active');
                menuBtn.querySelector('.burger-icon').classList.remove('burger-icon--active');
            }
        });

        function toggleSidebar() {
            sidebar.classList.toggle('sidebar--active');
            menuBtn.querySelector('.burger-icon').classList.toggle('burger-icon--active');
            searchInput.value = '';
        }
    },
    headerSearch(){
        const headerSearch = document.querySelector('.header__search');
        const searchInput = headerSearch.querySelector('.search__control');
        const headerNav = document.querySelector('.header__nav');
        const headerSearchOpenBtn = document.querySelector('.header-search-open');
        const headerSearchCloseBtn = document.querySelector('.header-search-close');

        headerSearchOpenBtn.addEventListener('click', (e) => openSearch(e));
        headerSearchCloseBtn.addEventListener('click', closeSearch);

        document.addEventListener('click', (e) => {
            if(
                headerSearch.classList.contains('header__search--active')
                && e.target !== headerSearch
                && e.target !== headerSearchOpenBtn
                && !e.target.closest('.header')
            ){
                closeSearch();
            }
        })

        function closeSearch() {
            headerSearchOpenBtn.style = '';
            headerNav.style = '';
            headerSearch.classList.remove('header__search--active');
            searchInput.value = '';
        }

        function openSearch(e) {
            e.currentTarget.style.display = 'none';
            headerNav.style.display = 'none';
            headerSearch.classList.add('header__search--active');
            searchInput.focus();
        }
    },
    formReset: function(formElement){
        formElement.reset();

        for ( const element of formElement){
            if(element.customValidation) element.customValidation.clearInvalidities(element);
        }
    },
};