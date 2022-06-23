import { elementsIsExist } from "./general.js";
export default class AnimateByScroll {
    constructor(arg, ...elements) {
        this.activeAnimationClass = 'active';
        AnimateByScroll.repeatingAnimations = arg.repeatingAnimations;
        if (elements.length <= 0) {
            console.log('[AnimateByScroll] No elements have been created.');
            return;
        }
        if (arg.activeAnimationClass)
            this.activeAnimationClass = arg.activeAnimationClass;
        AnimateByScroll.elements = elements;
        this.checkAndToggleAnimationForElements();
        for (let element of AnimateByScroll.elements) {
            element.mediaQueries.length > 0 ? element.setMediaProperties() : false;
        }
        window.addEventListener('scroll', () => {
            this.checkAndToggleAnimationForElements();
        }, false);
        window.addEventListener('resize', () => {
            for (let element of AnimateByScroll.elements) {
                element.setMediaProperties();
            }
        }, false);
    }
    checkAndToggleAnimationForElements() {
        window.requestAnimationFrame(() => {
            for (let animateElement of AnimateByScroll.elements) {
                for (const animateHtml of animateElement.htmlElements) {
                    if (this.isPartiallyVisible(animateElement, animateHtml) &&
                        !animateHtml.classList.contains(this.activeAnimationClass)) {
                        setTimeout(() => {
                            animateHtml.classList.add(this.activeAnimationClass);
                        }, parseInt(animateHtml.dataset.timeout));
                    }
                    else if (!this.isPartiallyVisible(animateElement, animateHtml) && AnimateByScroll.repeatingAnimations) {
                        animateHtml.classList.remove(this.activeAnimationClass);
                    }
                }
            }
        });
    }
    isPartiallyVisible(animElement, animHtml) {
        /* thanks for this function:
            en: https://www.kirupa.com/animations/creating_scroll_activated_animations.htm
            ru: http://webupblog.ru/animatsiya-pri-prokrutke-stranitsy-na-javascript-i-css/
        */
        var elementBoundary = animHtml.getBoundingClientRect();
        var top = elementBoundary.top;
        var bottom = elementBoundary.bottom;
        var height = elementBoundary.height;
        let heightWithCoeff = height * parseFloat(animHtml.dataset.viewStartCoeff);
        return ((top + heightWithCoeff >= 0) && (heightWithCoeff + window.innerHeight >= bottom));
    }
}
AnimateByScroll.repeatingAnimations = false;
export class AnimationGroup {
    /**
    * @param mediaQueries
    * If you need to change the animation assignment settings at a certain width, set the objects of `AnimationMediaQuery`.
    */
    constructor(arg, ...mediaQueries) {
        if (elementsIsExist(arg.selectors) == false) {
            console.log('[AnimationGroup] Element is not exist!');
        }
        else if (arg.animateStartCoeff <= 0 || arg.animateStartCoeff > 1) {
            console.log('[AnimationGroup] AnimateStartCoeff <= 0 or > 1');
        }
        this.htmlElements = document.querySelectorAll(arg.selectors);
        for (let htmlElement of this.htmlElements) {
            htmlElement.setAttribute('data-timeout', arg.timeoutBeforeStart.toString());
            htmlElement.setAttribute('data-view-start-coeff', arg.animateStartCoeff.toString());
        }
        this.defTimeoutBeforeStart = arg.timeoutBeforeStart;
        this.defAnimStartCoeff = arg.animateStartCoeff;
        this.mediaQueries = mediaQueries;
    }
    setMediaProperties() {
        for (let media of this.mediaQueries) {
            if (window.innerWidth <= media.activeWitdh) {
                for (let htmlElement of this.htmlElements) {
                    htmlElement.setAttribute('data-timeout', media.timeoutBeforeStart.toString());
                    htmlElement.setAttribute('data-view-start-coeff', media.animateStartCoeff.toString());
                }
            }
            else {
                for (let htmlElement of this.htmlElements) {
                    htmlElement.setAttribute('data-timeout', this.defTimeoutBeforeStart.toString());
                    htmlElement.setAttribute('data-view-start-coeff', this.defAnimStartCoeff.toString());
                }
            }
        }
    }
}
export class AnimationMediaQuery {
    /**
    * At a certain width, it changes the settings for applying the animation class.
    *
    * @param activeWitdh
    * If the viewport width is less than or equal to this value, new settings for applying the animation class will be applied.
    * @param animateStartCoeff
    * For example, 1 => class is assigned as soon as the element is shown on the screen. 0.5 = as soon as it is shown at half.
    * @param timeoutBeforeStart
    * The delay before the animation starts in milliseconds.
    *
    * @throws animateStartCoeff < 0 or > 1 -
    * Specify the animation start factor greater than 0 and less than 1.
    */
    constructor(activeWitdh, animateStartCoeff, timeoutBeforeStart) {
        if (animateStartCoeff <= 0 || animateStartCoeff > 1) {
            console.log('[AnimationMediaQuery] AnimateStartCoeff <= 0 or > 1');
        }
        this.activeWitdh = activeWitdh;
        this.animateStartCoeff = animateStartCoeff;
        this.timeoutBeforeStart = timeoutBeforeStart;
    }
}